import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { AnalyticsData, AdvancedAnalytics, ApiResponse, KpiMetrics } from '../types/types';
import { apiDomain } from '../ApiDomain/ApiDomain';
import type { RootState } from '../store/store';

// Proper interface definition
export interface AnalyticsData {
  totalRevenue: number;
  totalBookings: number;
  totalUsers: number;
  activeVehicles: number;
  revenueChange: number;
  bookingChange: number;
  userChange: number;
  utilizationChange: number;
  monthlyRevenue?: Array<{ month: string; revenue: number }>;
  bookingTrends?: Array<{ date: string; count: number }>;
  userGrowth?: Array<{ date: string; count: number }>;
  topPerformingVehicles?: Array<{ 
      vehicle_id: string; 
      name: string; 
      revenue: number; 
      bookings: number;
      utilization: number;
  }>;
  popularVehicleTypes?: Array<{ 
      type: string; 
      count: number; 
      revenue: number;
  }>;
}

export const analyticsApi = createApi({
  reducerPath: 'analyticsApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: apiDomain, // This should be "http://localhost:3001"
    prepareHeaders: (headers, { getState }) => {
      // Get token from Redux state first
      const state = getState() as RootState;
      const reduxToken = state.auth?.token;
      
      console.log('Analytics API - Token check - Redux:', reduxToken ? 'Token exists' : 'No token');
      console.log('Analytics API - Token check - localStorage:', localStorage.getItem('token') ? 'Token exists' : 'No token');
      console.log('API Domain is:', apiDomain);
      
      let token = reduxToken;
      
      // If no valid token in Redux, check localStorage
      if (!token || token === 'Token exists') {
        token = localStorage.getItem('token');
      }
      
      // Log token details for debugging
      if (token) {
        console.log('Token type:', typeof token);
        console.log('Token length:', token.length);
        console.log('Token starts with Bearer?:', token.startsWith('Bearer '));
      }
      
      if (token && token !== 'Token exists') {
        // Handle both cases: token might already have "Bearer " prefix
        const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
        headers.set('Authorization', authToken);
        console.log('✅ Setting Authorization header with token:', authToken.substring(0, 30) + '...');
      } else {
        console.warn('⚠️ No valid authentication token found for analytics API');
        console.log('Token value:', token);
      }
      
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Analytics'],
  endpoints: (builder) => ({
    // Get analytics data with flexible endpoint detection
    getAnalyticsData: builder.query<AnalyticsData, { 
      period?: 'day' | 'week' | 'month' | 'quarter' | 'year';
      startDate?: string;
      endDate?: string;
    }>({
      query: (params) => {
        console.log('Fetching analytics with params:', params);
        console.log('API Domain:', apiDomain);
        
        // Try multiple endpoint patterns
        const endpointsToTry = [
          'api/analytics',
          'analytics',
          'dashboard/analytics',
          'admin/analytics'
        ];
        
        // Use the first endpoint for now, could implement fallback logic
        const endpoint = endpointsToTry[0];
        
        console.log('Trying endpoint:', endpoint);
        console.log('Full URL will be:', `${apiDomain}/${endpoint}`);
        
        return {
          url: endpoint,
          method: 'GET',
          params,
        };
      },     
      providesTags: ['Analytics'],
      // Handle 401 errors
      transformErrorResponse: (response: any) => {
        console.error('❌ Analytics API Error:', response);
        
        if (response?.status === 401) {
          console.error('🔒 401 Unauthorized - Clearing invalid tokens');
          localStorage.removeItem('token');
          sessionStorage.removeItem('token');
          
          return {
            ...response,
            data: {
              ...response.data,
              message: 'Authentication failed. Please login again.'
            }
          };
        }
        
        return response;
      }
    }),

    // Alternative endpoints for testing
    getAnalyticsDataAlt1: builder.query<AnalyticsData, { 
      period?: 'day' | 'week' | 'month' | 'quarter' | 'year';
    }>({
      query: (params) => ({
        url: 'analytics', // Try without /api prefix
        method: 'GET',
        params,
      }),     
      providesTags: ['Analytics'],
    }),

    getAnalyticsDataAlt2: builder.query<AnalyticsData, { 
      period?: 'day' | 'week' | 'month' | 'quarter' | 'year';
    }>({
      query: (params) => ({
        url: 'dashboard/analytics', // Try dashboard prefix
        method: 'GET',
        params,
      }),     
      providesTags: ['Analytics'],
    }),

    // Get advanced analytics with predictions
    getAdvancedAnalytics: builder.query<AdvancedAnalytics, { 
      period: 'month' | 'quarter' | 'year';
      includePredictions?: boolean;
    }>({
      query: (params) => ({
        url: 'api/analytics/advanced',
        method: 'GET',
        params,
      }),     
      providesTags: ['Analytics'],
      transformResponse: (response: ApiResponse<AdvancedAnalytics>) => {
        return response.data || response;
      }
    }),

    // Get KPI metrics
    getKpiMetrics: builder.query<KpiMetrics, { 
      period?: 'week' | 'month' | 'quarter' | 'year';
    }>({
      query: (params) => ({
        url: 'api/analytics/kpis',
        method: 'GET',
        params,
      }),     
      providesTags: ['Analytics'],
      transformResponse: (response: ApiResponse<KpiMetrics>) => {
        return response.data || response;
      }
    }),

    // Get revenue analytics breakdown
    getRevenueAnalytics: builder.query<{
      totalRevenue: number;
      revenueBySource: Array<{ source: string; amount: number }>;
      revenueByVehicleType: Array<{ type: string; amount: number }>;
      revenueByLocation: Array<{ location: string; amount: number }>;
      monthlyRevenueTrend: Array<{ month: string; revenue: number }>;
      revenueGrowthRate: number;
    }, { period: 'month' | 'quarter' | 'year' }>({
      query: ({ period }) => `api/analytics/revenue?period=${period}`,    
      providesTags: ['Analytics'],
      transformResponse: (response: ApiResponse<any>) => {
        return response.data || response;
      }
    }),

    // Add a simple test endpoint to check if API is working
    testAnalyticsEndpoint: builder.query<{ message: string }, void>({
      query: () => ({
        url: 'api/analytics/health',
        method: 'GET',
      }),
    }),

    // Refresh analytics cache
    refreshAnalyticsCache: builder.mutation<ApiResponse<{ message: string }>, void>({
      query: () => ({
        url: 'api/analytics/cache/refresh',
        method: 'POST',
      }),
      invalidatesTags: ['Analytics']
    }),

    // Test authentication endpoint
    testAuth: builder.query<{ authenticated: boolean; user?: any }, void>({
      query: () => ({
        url: 'api/auth/verify',
        method: 'GET',
      }),
    }),
  }),
});

// Export hooks
export const {
  useGetAnalyticsDataQuery,
  useGetAnalyticsDataAlt1Query,
  useGetAnalyticsDataAlt2Query,
  useGetAdvancedAnalyticsQuery,
  useGetKpiMetricsQuery,
  useGetRevenueAnalyticsQuery,
  useTestAnalyticsEndpointQuery,
  useTestAuthQuery,
  useRefreshAnalyticsCacheMutation,
} = analyticsApi;