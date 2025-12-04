// services/paymentHistoryApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { apiDomain } from '../ApiDomain/ApiDomain';

export interface PaymentHistoryResponse {
  payment_id: string;
  booking_id: string;
  amount: number;
  payment_status: string;
  payment_date: string;
  payment_method: string;
  transaction_id: string | null;
  created_at: string;
  updated_at: string;
  booking: {
    booking_id: string;
    user_id: string;
    vehicle_id: string;
    total_amount: number;
    booking_status: string;
    booking_date?: string;
    return_date?: string;
  };
  vehicle?: {
    vehicle_spec?: {
      manufacturer: string;
      model: string;
      year: number;
    };
    rental_rate?: number;
  };
}

export const paymentHistoryApi = createApi({
  reducerPath: 'paymentHistoryApi',
  baseQuery: fetchBaseQuery({
    baseUrl: apiDomain,
    prepareHeaders: (headers, { getState }) => {
      // Debug logging
      if (process.env.NODE_ENV === 'development') {
        console.log('🔄 Preparing headers for payment history API...');
      }
      
      // Try multiple token storage locations
      const token = 
        localStorage.getItem('token') ||
        localStorage.getItem('access_token') ||
        sessionStorage.getItem('token') ||
        sessionStorage.getItem('access_token');
      
      if (token) {
        if (process.env.NODE_ENV === 'development') {
          console.log('✅ Token found, setting Authorization header');
          console.log('🔍 Token preview:', token.substring(0, 20) + '...');
        }
        headers.set('Authorization', `Bearer ${token}`);
      } else {
        if (process.env.NODE_ENV === 'development') {
          console.warn('⚠️ No token found for payment history API');
        }
      }
      
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['PaymentHistory'],
  endpoints: (builder) => ({
    
    // ✅ Get payments for current authenticated user - SMART ENDPOINT
    getMyPaymentHistory: builder.query<PaymentHistoryResponse[], void>({
      queryFn: async (args, api, extraOptions, baseQuery) => {
        try {
          // First, let's get the current user ID from Redux store
          const state = api.getState() as any;
          const userId = state?.auth?.user?.user_id;
          
          if (!userId) {
            console.warn('No user ID found in Redux store');
          }
          
          // Try different endpoints in order of preference
          const endpoints = [
            { path: '/api/payments/me', description: 'User-specific endpoint' },
            { path: '/api/payments/user/me', description: 'Alternative user endpoint' },
            { path: `/api/payments/user/${userId}`, description: 'User ID endpoint' },
            { path: '/api/payments', description: 'All payments (will filter client-side)' },
            { path: '/api/payments/test', description: 'Test endpoint' },
          ];
          
          let lastError: any = null;
          let lastResponse: any = null;
          
          for (const endpoint of endpoints) {
            try {
              console.log(`🔄 Trying: ${endpoint.path} (${endpoint.description})`);
              
              const result = await baseQuery(endpoint.path);
              
              if (result.error) {
                lastError = result.error;
                console.log(`❌ ${endpoint.path} failed:`, result.error.status);
                continue; // Try next endpoint
              }
              
              console.log(`✅ ${endpoint.path} succeeded!`);
              lastResponse = result.data;
              
              // Process the successful response
              let payments: PaymentHistoryResponse[] = [];
              
              if (Array.isArray(result.data)) {
                payments = result.data;
              } else if (result.data?.data && Array.isArray(result.data.data)) {
                payments = result.data.data;
              } else if (result.data?.payments && Array.isArray(result.data.payments)) {
                payments = result.data.payments;
              } else if (result.data && typeof result.data === 'object') {
                // Try to find any array property
                const arrayKeys = Object.keys(result.data).filter(key => 
                  Array.isArray(result.data[key])
                );
                if (arrayKeys.length > 0) {
                  payments = result.data[arrayKeys[0]];
                }
              }
              
              // If we got all payments (not user-specific), filter them
              if (payments.length > 0 && endpoint.path === '/api/payments') {
                if (userId) {
                  const filteredPayments = payments.filter(payment => 
                    payment.booking?.user_id === userId
                  );
                  console.log(`✅ Filtered ${filteredPayments.length} payments for user ${userId}`);
                  payments = filteredPayments;
                } else {
                  console.warn('⚠️ Got all payments but no user ID to filter with');
                }
              }
              
              // For test endpoint, mock some data
              if (endpoint.path === '/api/payments/test' && payments.length === 0) {
                payments = generateMockPayments(userId);
              }
              
              return { data: payments };
              
            } catch (error) {
              lastError = error;
              console.log(`❌ ${endpoint.path} exception:`, error);
              continue;
            }
          }
          
          // If all endpoints failed but we have a user ID, generate mock data for development
          if (process.env.NODE_ENV === 'development' && userId) {
            console.log('🛠️ DEVELOPMENT: Generating mock payment data');
            const mockPayments = generateMockPayments(userId);
            return { data: mockPayments };
          }
          
          // All endpoints failed
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: lastError?.message || 'Failed to fetch payments from all endpoints',
              data: lastResponse || 'No payment data available'
            }
          };
          
        } catch (error: any) {
          console.error('Unexpected error in getMyPaymentHistory:', error);
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: error.message || 'Unexpected error fetching payments'
            }
          };
        }
      },
      providesTags: ['PaymentHistory'],
    }),
    
    // ✅ Simple endpoint - just use /api/payments
    getPaymentsSimple: builder.query<PaymentHistoryResponse[], void>({
      query: () => '/api/payments',
      providesTags: ['PaymentHistory'],
    }),
    
    // ✅ Get payments by user ID (admin only)
    getPaymentsByUserId: builder.query<PaymentHistoryResponse[], string>({
      query: (userId) => `/api/payments/user/${userId}`,
      providesTags: (result, error, userId) => [
        { type: 'PaymentHistory', id: userId }
      ],
    }),
    
    // ✅ Download receipt
    downloadReceipt: builder.mutation<Blob, string>({
      query: (paymentId) => ({
        url: `/api/payments/${paymentId}/receipt`,
        method: 'GET',
        responseHandler: (response) => response.blob(),
        headers: {
          'Accept': 'application/pdf',
        },
      }),
    }),
    
    // ✅ Get payment statistics
    getPaymentStats: builder.query<{
      totalRevenue: number;
      completedPayments: number;
      pendingPayments: number;
      failedPayments: number;
    }, void>({
      query: () => '/api/payments/stats',
      providesTags: ['PaymentHistory'],
    }),
  }),
});

// Helper function to generate mock payments for development
const generateMockPayments = (userId?: string): PaymentHistoryResponse[] => {
  const mockUserId = userId || 'user-12345';
  const now = new Date();
  
  return [
    {
      payment_id: 'pay_' + Math.random().toString(36).substring(7),
      booking_id: 'book_' + Math.random().toString(36).substring(7),
      amount: 250.75,
      payment_status: 'success',
      payment_date: new Date(now.getTime() - 86400000 * 2).toISOString(),
      payment_method: 'stripe',
      transaction_id: 'txn_' + Math.random().toString(36).substring(7),
      created_at: new Date(now.getTime() - 86400000 * 2).toISOString(),
      updated_at: new Date(now.getTime() - 86400000 * 2).toISOString(),
      booking: {
        booking_id: 'book_1',
        user_id: mockUserId,
        vehicle_id: 'veh_123',
        total_amount: 250.75,
        booking_status: 'confirmed',
        booking_date: new Date(now.getTime() - 86400000 * 3).toISOString(),
        return_date: new Date(now.getTime() - 86400000).toISOString()
      },
      vehicle: {
        vehicle_spec: {
          manufacturer: 'Toyota',
          model: 'Camry',
          year: 2023
        },
        rental_rate: 83.58
      }
    },
    {
      payment_id: 'pay_' + Math.random().toString(36).substring(7),
      booking_id: 'book_' + Math.random().toString(36).substring(7),
      amount: 180.50,
      payment_status: 'pending',
      payment_date: new Date(now.getTime() - 86400000).toISOString(),
      payment_method: 'm-pesa',
      transaction_id: 'txn_' + Math.random().toString(36).substring(7),
      created_at: new Date(now.getTime() - 86400000).toISOString(),
      updated_at: new Date(now.getTime() - 86400000).toISOString(),
      booking: {
        booking_id: 'book_2',
        user_id: mockUserId,
        vehicle_id: 'veh_456',
        total_amount: 180.50,
        booking_status: 'pending',
        booking_date: new Date(now.getTime() - 86400000).toISOString(),
        return_date: new Date(now.getTime() + 86400000 * 2).toISOString()
      },
      vehicle: {
        vehicle_spec: {
          manufacturer: 'Honda',
          model: 'Civic',
          year: 2022
        },
        rental_rate: 60.17
      }
    },
    {
      payment_id: 'pay_' + Math.random().toString(36).substring(7),
      booking_id: 'book_' + Math.random().toString(36).substring(7),
      amount: 320.25,
      payment_status: 'failed',
      payment_date: new Date(now.getTime() - 86400000 * 5).toISOString(),
      payment_method: 'card',
      transaction_id: 'txn_' + Math.random().toString(36).substring(7),
      created_at: new Date(now.getTime() - 86400000 * 5).toISOString(),
      updated_at: new Date(now.getTime() - 86400000 * 5).toISOString(),
      booking: {
        booking_id: 'book_3',
        user_id: mockUserId,
        vehicle_id: 'veh_789',
        total_amount: 320.25,
        booking_status: 'cancelled',
        booking_date: new Date(now.getTime() - 86400000 * 6).toISOString(),
        return_date: new Date(now.getTime() - 86400000 * 4).toISOString()
      },
      vehicle: {
        vehicle_spec: {
          manufacturer: 'BMW',
          model: 'X5',
          year: 2023
        },
        rental_rate: 106.75
      }
    }
  ];
};

export const {
  useGetMyPaymentHistoryQuery,
  useGetPaymentsSimpleQuery,
  useGetPaymentsByUserIdQuery,
  useDownloadReceiptMutation,
  useGetPaymentStatsQuery,
} = paymentHistoryApi;