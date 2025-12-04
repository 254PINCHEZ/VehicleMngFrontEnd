import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { AnalyticsData, AdvancedAnalytics, ApiResponse, KpiMetrics } from '../types/types';
import { apiDomain } from '../ApiDomain/ApiDomain';

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
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      console.log('Analytics API - Token check:', token ? 'Token exists' : 'No token found');
      console.log('API Domain is:', apiDomain);
      
      if (token) {
        // Handle both cases: token might already have "Bearer " prefix
        const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
        headers.set('Authorization', authToken);
        console.log('Setting Authorization header with token');
      } else {
        console.warn('No authentication token found for analytics API');
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Analytics'],
  endpoints: (builder) => ({
    // Try different endpoint variations based on what your backend expects
    getAnalyticsData: builder.query<AnalyticsData, { 
      period?: 'day' | 'week' | 'month' | 'quarter' | 'year';
      startDate?: string;
      endDate?: string;
    }>({
      query: (params) => {
        console.log('Fetching analytics with params:', params);
        console.log('API Domain:', apiDomain);
        
        // Try different endpoint patterns. Based on your logs, your backend might expect:
        // Option 1: /api/analytics (most common)
        // Option 2: /analytics (if apiDomain already includes /api)
        // Option 3: /dashboard/analytics
        // Option 4: /admin/analytics
        
        // First, let's check what apiDomain actually is
        const endpoint = 'api/analytics'; // Try this first - most common pattern
        
        console.log('Trying endpoint:', endpoint);
        console.log('Full URL will be:', `${apiDomain}/${endpoint}`);
        
        return {
          url: endpoint,
          method: 'GET',
          params,
        };
      },     
      providesTags: ['Analytics'],
    }),

    // Alternative: If you want to try multiple endpoints, you can create multiple queries
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
        url: 'api/analytics/advanced', // Added api/ prefix
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
        url: 'api/analytics/kpis', // Added api/ prefix
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
      query: ({ period }) => `api/analytics/revenue?period=${period}`, // Added api/ prefix    
      providesTags: ['Analytics'],
      transformResponse: (response: ApiResponse<any>) => {
        return response.data || response;
      }
    }),

    // Add a simple test endpoint to check if API is working
    testAnalyticsEndpoint: builder.query<{ message: string }, void>({
      query: () => ({
        url: 'api/analytics/health', // Try a health check endpoint
        method: 'GET',
      }),
    }),

    // Refresh analytics cache
    refreshAnalyticsCache: builder.mutation<ApiResponse<{ message: string }>, void>({
      query: () => ({
        url: 'api/analytics/cache/refresh', // Added api/ prefix
        method: 'POST',
      }),
      invalidatesTags: ['Analytics']
    }),
  }),
});

// Export hooks
export const {
  useGetAnalyticsDataQuery,
  useGetAnalyticsDataAlt1Query, // Alternative 1
  useGetAnalyticsDataAlt2Query, // Alternative 2
  useGetAdvancedAnalyticsQuery,
  useGetKpiMetricsQuery,
  useGetRevenueAnalyticsQuery,
  useTestAnalyticsEndpointQuery,
  useRefreshAnalyticsCacheMutation,
} = analyticsApi;