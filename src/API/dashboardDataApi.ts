import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { ApiResponse } from '../types/types';
import { apiDomain } from '../ApiDomain/ApiDomain';
import type { RootState } from '../store/store';

export interface AdminDashboardStats {
  totalBookings: number;
  totalRevenue: number;
  totalUsers: number;
  activeVehicles: number;
  revenueChange: number;
  bookingChange: number;
  userChange: number;
  utilizationChange: number;
  pendingBookings: number;
  completedBookings: number;
  activeBookings: number;
  recentBookings: any[];
  topVehicles: any[];
  monthlyRevenue: Array<{ month: string; revenue: number }>;
}

export interface RecentBooking {
  booking_id: string;
  booking_reference: string;
  customer_name: string;
  customer_email: string;
  vehicle_name: string;
  vehicle_type: string;
  total_amount: number;
  daily_rate?: number;
  status: 'pending' | 'confirmed' | 'active' | 'cancelled' | 'completed';
  created_at: string;
  start_date: string;
  end_date: string;
  pickup_location?: string;
  vehicle_license_plate?: string;
}

export const dashboardDataApi = createApi({
  reducerPath: 'dashboardDataApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: `${apiDomain}/api`,
    prepareHeaders: (headers, { getState }) => {
      // Get token from Redux state first
      const state = getState() as RootState;
      const reduxToken = state.auth?.token;
      
      let token = reduxToken;
      
      // DEBUG: Log token status from both sources
      console.log('🔐 Dashboard API - Token check - Redux:', reduxToken ? 'Token exists' : 'No token');
      console.log('🔐 Dashboard API - Token check - localStorage:', localStorage.getItem('token') ? 'Token exists' : 'No token');
      
      // If no valid token in Redux, check localStorage
      if (!token || token === 'Token exists') {
        token = localStorage.getItem('token');
      }
      
      // Debug token details
      if (token) {
        console.log('Token details:', {
          type: typeof token,
          length: token.length,
          startsWithBearer: token.startsWith('Bearer '),
          first20Chars: token.substring(0, 20) + '...'
        });
      }
      
      if (token && token !== 'Token exists') {
        // CRITICAL FIX: Use capital 'A' in Authorization (some backends are case-sensitive)
        const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
        headers.set('Authorization', authToken);
        console.log('✅ Authorization header set with token (first 30 chars):', authToken.substring(0, 30) + '...');
      } else {
        console.warn('⚠️ No valid token available for dashboard API');
        console.log('Token value:', token);
      }
      
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['DashboardStats'],
  endpoints: (builder) => ({
    // Fetch admin dashboard data with enhanced error handling
    getAdminDashboardData: builder.query<AdminDashboardStats, void>({
      query: () => {
        console.log('🚀 Fetching dashboard data from /dashboard/admin');
        console.log('Full URL:', `${apiDomain}/api/dashboard/admin`);
        return '/dashboard/admin';
      },     
      providesTags: ['DashboardStats'],
      transformResponse: (response: ApiResponse<AdminDashboardStats>) => {
        console.log('✅ Dashboard API Success:', response);
        return response.data || response;
      },
      // Enhanced error handling
      transformErrorResponse: (response: any) => {
        console.error('❌ Dashboard API Error:', {
          status: response?.status,
          statusText: response?.statusText,
          data: response?.data,
          originalStatus: response?.originalStatus
        });
        
        // Handle 401 Unauthorized
        if (response?.status === 401) {
          console.error('🔒 401 Unauthorized - Token may be invalid or expired');
          
          // Clear all token storage
          localStorage.removeItem('token');
          sessionStorage.removeItem('token');
          
          return {
            ...response,
            data: {
              ...response.data,
              message: 'Authentication failed. Please login again.',
              code: 'AUTH_REQUIRED'
            }
          };
        }
        
        // Handle network errors
        if (response?.status === 'FETCH_ERROR') {
          console.error('🌐 Network Error - Unable to connect to server');
          return {
            ...response,
            data: {
              message: 'Unable to connect to server. Please check your internet connection.',
              code: 'NETWORK_ERROR'
            }
          };
        }
        
        return response;
      }
    }),

    // Get user dashboard data
    getUserDashboardData: builder.query<{
      totalBookings: number;
      upcomingBookings: number;
      totalSpent: number;
      activeTickets: number;
      recentBookings: RecentBooking[];
      upcomingTrips: any[];
    }, void>({
      query: () => '/dashboard/user',     
      providesTags: ['DashboardStats'],
      transformResponse: (response: ApiResponse<any>) => {
        return response.data || response;
      }
    }),

    // Get revenue analytics
    getRevenueAnalytics: builder.query<{
      totalRevenue: number;
      monthlyRevenue: Array<{ month: string; revenue: number }>;
      revenueChange: number;
      averageBookingValue: number;
      revenueByVehicleType: Array<{ type: string; revenue: number }>;
    }, { period: 'week' | 'month' | 'year' }>({
      query: ({ period }) => `/dashboard/analytics/revenue?period=${period}`,     
      providesTags: ['DashboardStats'],
      transformResponse: (response: ApiResponse<any>) => {
        return response.data || response;
      }
    }),

    // Get booking analytics
    getBookingAnalytics: builder.query<{
      totalBookings: number;
      bookingTrends: Array<{ date: string; count: number }>;
      bookingStatus: {
        pending: number;
        confirmed: number;
        active: number;
        completed: number;
        cancelled: number;
      };
      peakHours: Array<{ hour: number; bookings: number }>;
      popularVehicles: Array<{ vehicle_id: string; name: string; bookings: number }>;
    }, { period: 'week' | 'month' | 'year' }>({
      query: ({ period }) => `/dashboard/analytics/bookings?period=${period}`,     
      providesTags: ['DashboardStats'],
      transformResponse: (response: ApiResponse<any>) => {
        return response.data || response;
      }
    }),

    // Get user analytics
    getUserAnalytics: builder.query<{
      totalUsers: number;
      newUsers: number;
      activeUsers: number;
      userGrowth: number;
      userByType: {
        customer: number;
        admin: number;
        staff: number;
      };
      signupTrends: Array<{ date: string; count: number }>;
    }, { period: 'week' | 'month' | 'year' }>({
      query: ({ period }) => `/dashboard/analytics/users?period=${period}`,     
      providesTags: ['DashboardStats'],
      transformResponse: (response: ApiResponse<any>) => {
        return response.data || response;
      }
    }),

    // Get vehicle fleet analytics
    getFleetAnalytics: builder.query<{
      totalVehicles: number;
      availableVehicles: number;
      rentedVehicles: number;
      maintenanceVehicles: number;
      utilizationRate: number;
      revenueByVehicle: Array<{ vehicle_id: string; name: string; revenue: number }>;
      topPerformingVehicles: Array<{ vehicle_id: string; name: string; bookings: number; revenue: number }>;
    }, void>({
      query: () => '/dashboard/analytics/fleet',     
      providesTags: ['DashboardStats'],
      transformResponse: (response: ApiResponse<any>) => {
        return response.data || response;
      }
    }),

    // Get real-time dashboard stats
    getRealtimeStats: builder.query<{
      activeBookings: number;
      activeUsers: number;
      todayRevenue: number;
      todayBookings: number;
      systemHealth: {
        api: 'healthy' | 'degraded' | 'down';
        database: 'healthy' | 'degraded' | 'down';
        storage: 'healthy' | 'degraded' | 'down';
      };
    }, void>({
      query: () => '/dashboard/stats/realtime',     
      providesTags: ['DashboardStats'],
      transformResponse: (response: ApiResponse<any>) => {
        return response.data || response;
      }
    }),

    // Get performance metrics
    getPerformanceMetrics: builder.query<{
      responseTime: number;
      uptime: number;
      errorRate: number;
      serverLoad: number;
      memoryUsage: number;
      activeConnections: number;
    }, void>({
      query: () => '/dashboard/metrics/performance',     
      providesTags: ['DashboardStats'],
      transformResponse: (response: ApiResponse<any>) => {
        return response.data || response;
      }
    }),

    // Get geographic analytics
    getGeographicAnalytics: builder.query<{
      bookingsByLocation: Array<{ location: string; bookings: number }>;
      revenueByLocation: Array<{ location: string; revenue: number }>;
      popularPickupLocations: Array<{ location: string; count: number }>;
    }, { period: 'week' | 'month' | 'year' }>({
      query: ({ period }) => `/dashboard/analytics/geographic?period=${period}`,     
      providesTags: ['DashboardStats'],
      transformResponse: (response: ApiResponse<any>) => {
        return response.data || response;
      }
    }),

    // Export dashboard data
    exportDashboardData: builder.mutation<Blob, {
      format: 'csv' | 'pdf' | 'excel';
      dataType: 'revenue' | 'bookings' | 'users' | 'vehicles';
      period: 'week' | 'month' | 'year' | 'custom';
      startDate?: string;
      endDate?: string;
    }>({
      query: (exportParams) => ({
        url: '/dashboard/export',
        method: 'POST',
        body: exportParams,
        responseHandler: (response) => response.blob(),
      }),
    }),

    // Refresh dashboard cache
    refreshDashboardCache: builder.mutation<ApiResponse<{ message: string }>, void>({
      query: () => ({
        url: '/dashboard/cache/refresh',
        method: 'POST',
      }),
      invalidatesTags: ['DashboardStats']
    }),

    // Test authentication with a simple endpoint
    testAuthStatus: builder.query<{ 
      authenticated: boolean; 
      user?: any; 
      tokenValid: boolean;
    }, void>({
      query: () => '/dashboard/verify-auth',
    }),
  }),
});

export const {
  useGetAdminDashboardDataQuery,
  useGetUserDashboardDataQuery,
  useGetRevenueAnalyticsQuery,
  useGetBookingAnalyticsQuery,
  useGetUserAnalyticsQuery,
  useGetFleetAnalyticsQuery,
  useGetRealtimeStatsQuery,
  useGetPerformanceMetricsQuery,
  useGetGeographicAnalyticsQuery,
  useExportDashboardDataMutation,
  useRefreshDashboardCacheMutation,
  useTestAuthStatusQuery,
} = dashboardDataApi;