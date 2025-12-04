import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Payment } from '../types/types';
import { apiDomain } from '../ApiDomain/ApiDomain';

// Define the Payment type based on your backend response
export interface BackendPayment {
  payment_id: string;
  booking_id: string;
  amount: number;
  payment_status: string;
  payment_date: string | null;
  payment_method: string;
  payment_provider: string;
  transaction_id: string | null;
  provider_payment_id: string | null;
  currency: string;
  provider_metadata: string | null;
  created_at: string;
  updated_at: string;
  booking?: {
    booking_id: string;
    user_id: string;
    vehicle_id: string;
    total_amount: number;
    booking_status: string;
  };
  user?: {
    user_id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
}

export const paymentApi = createApi({
    reducerPath: 'paymentApi',
    baseQuery: fetchBaseQuery({ 
        baseUrl: apiDomain,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            headers.set('Content-Type', 'application/json');
            return headers;
        },
    }),
    tagTypes: ['Payments'],
    endpoints: (builder) => ({

        // ✅ Fetch all Payments - CORRECTED ENDPOINT
        getAllPayments: builder.query<BackendPayment[], void>({
            query: () => '/api/payments',
            providesTags: (result = []) => [
                'Payments',
                ...result.map(({ payment_id }) => ({ type: 'Payments' as const, id: payment_id })),
            ],
            transformResponse: (response: any) => {
                // Handle different response formats
                if (Array.isArray(response)) {
                    return response;
                } else if (response && response.data) {
                    return response.data;
                }
                return [];
            },
        }),        

        // ✅ Get payment by id - CORRECTED ENDPOINT
        getPaymentById: builder.query<BackendPayment, string>({
            query: (payment_id) => `/api/payments/${payment_id}`,
            providesTags: (result, error, id) => [{ type: 'Payments', id }],
        }),

        // ✅ Create payment - CORRECTED ENDPOINT
        createPayment: builder.mutation<{ message: string }, {
            booking_id: string;
            amount: number;
            payment_status: string;
            payment_method: string;
            transaction_id: string;
            payment_provider?: string;
            currency?: string;
        }>({
            query: (newPayment) => ({
                url: '/api/payments',
                method: 'POST',
                body: newPayment,
            }),
            invalidatesTags: ['Payments'],
        }),

        // ✅ Update payment - CORRECTED ENDPOINT
        updatePayment: builder.mutation<{ message: string }, {
            payment_id: string;
            booking_id?: string;
            amount?: number;
            payment_status?: string;
            payment_method?: string;
            transaction_id?: string;
        }>({
            query: ({ payment_id, ...data }) => ({
                url: `/api/payments/${payment_id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (result, error, { payment_id }) => [
                { type: 'Payments', id: payment_id },
                'Payments'
            ],
        }),

        // ✅ Update payment status - CORRECTED ENDPOINT
        updatePaymentStatus: builder.mutation<{ message: string }, { 
            payment_id: string; 
            status: string;
        }>({
            query: ({ payment_id, status }) => ({
                url: `/api/payments/${payment_id}`,
                method: 'PATCH',
                body: { payment_status: status },
            }),
            invalidatesTags: (result, error, { payment_id }) => [
                { type: 'Payments', id: payment_id },
                'Payments'
            ],
        }),

        // ✅ Delete payment - NEW ENDPOINT
        deletePayment: builder.mutation<{ message: string }, string>({
            query: (payment_id) => ({
                url: `/api/payments/${payment_id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Payments'],
        }),

        // ✅ Stripe payment endpoints
        createStripePaymentIntent: builder.mutation<{
            clientSecret: string;
            amount: number;
            id: string;
        }, {
            amount: number;
            currency?: string;
            metadata?: any;
        }>({
            query: (paymentData) => ({
                url: '/api/payments/create-intent',
                method: 'POST',
                body: paymentData,
            }),
        }),

        // ✅ Confirm Stripe payment
        confirmStripePayment: builder.mutation<{
            success: boolean;
            bookingId: string;
            paymentId: string;
            paymentIntent: any;
        }, {
            paymentIntentId: string;
            bookingData: {
                user_id: string;
                vehicle_id: string;
                startDate: string;
                endDate: string;
                totalCost: number;
            };
        }>({
            query: (confirmationData) => ({
                url: '/api/payments/confirm',
                method: 'POST',
                body: confirmationData,
            }),
            invalidatesTags: ['Payments'],
        }),

        // ✅ Get payment statistics (optional)
        getPaymentStats: builder.query<{
            totalRevenue: number;
            completedPayments: number;
            pendingPayments: number;
            failedPayments: number;
        }, void>({
            query: () => '/api/payments/stats',
            providesTags: ['Payments'],
            transformResponse: (response: any) => {
                // Calculate stats from payments if stats endpoint doesn't exist
                if (response && response.totalRevenue !== undefined) {
                    return response;
                }
                return {
                    totalRevenue: 0,
                    completedPayments: 0,
                    pendingPayments: 0,
                    failedPayments: 0,
                };
            },
        }),
    }),
})

export const {
    useGetAllPaymentsQuery,
    useGetPaymentByIdQuery,
    useCreatePaymentMutation,
    useUpdatePaymentMutation,
    useUpdatePaymentStatusMutation,
    useDeletePaymentMutation,
    useCreateStripePaymentIntentMutation,
    useConfirmStripePaymentMutation,
    useGetPaymentStatsQuery,
} = paymentApi;

// // Helper function to transform backend data to frontend format if needed
// export const transformBackendPayment = (backendPayment: BackendPayment): Payment => {
//     return {
//         payment_id: parseInt(backendPayment.payment_id.replace(/-/g, '').substring(0, 8), 16) || 0,
//         transaction_id: backendPayment.transaction_id || `TXN_${backendPayment.payment_id.substring(0, 8)}`,
//         customer_name: backendPayment.user 
//             ? `${backendPayment.user.first_name} ${backendPayment.user.last_name}`
//             : 'Unknown Customer',
//         customer_email: backendPayment.user?.email || 'unknown@example.com',
//         amount: backendPayment.amount,
//         status: backendPayment.payment_status,
//         payment_method: backendPayment.payment_method,
//         created_at: backendPayment.created_at,
//         booking_reference: backendPayment.booking?.booking_id || undefined,
//         fee: 0, // You can calculate this from provider_metadata if available
//     };
// };

// // Export a hook for transformed payments
// export const useGetAllTransformedPaymentsQuery = () => {
//     const { data, isLoading, error, refetch } = useGetAllPaymentsQuery();
    
//     const transformedData = data 
//         ? data.map(transformBackendPayment)
//         : [];
    
//     return {
//         data: transformedData,
//         isLoading,
//         error,
//         refetch,
//     };
// };