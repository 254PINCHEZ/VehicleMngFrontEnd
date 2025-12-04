import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { SystemSettings, ApiResponse } from '../types/types';
import { apiDomain } from '../ApiDomain/ApiDomain';

export const settingsApi = createApi({
  reducerPath: 'settingsApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: `${apiDomain}/api`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Settings'],
  endpoints: (builder) => ({

    // Fetch all system settings
    getSettings: builder.query<SystemSettings, void>({
      query: () => '/settings',     
      providesTags: ['Settings']        
    }),

    // Get specific setting by key
    getSettingByKey: builder.query<any, string>({
      query: (key) => `/settings/${key}`,     
      providesTags: ['Settings']
    }),

    // Update system settings
    updateSettings: builder.mutation<ApiResponse<{ message: string }>, Partial<SystemSettings>>({
      query: (settingsData) => ({
        url: '/settings',
        method: 'PUT',
        body: settingsData,
      }),
      invalidatesTags: ['Settings'],
    }),

    // Update specific setting
    updateSetting: builder.mutation<ApiResponse<{ message: string }>, { 
      key: string; 
      value: any 
    }>({
      query: ({ key, value }) => ({
        url: `/settings/${key}`,
        method: 'PATCH',
        body: { value },
      }),
      invalidatesTags: ['Settings']
    }),

    // Reset settings to defaults
    resetSettings: builder.mutation<ApiResponse<{ message: string }>, void>({
      query: () => ({
        url: '/settings/reset',
        method: 'POST',
      }),
      invalidatesTags: ['Settings']
    }),

    // Export settings
    exportSettings: builder.mutation<Blob, void>({
      query: () => ({
        url: '/settings/export',
        method: 'GET',
        responseHandler: (response) => response.blob(),
      }),
    }),

    // Import settings
    importSettings: builder.mutation<ApiResponse<{ message: string }>, FormData>({
      query: (formData) => ({
        url: '/settings/import',
        method: 'POST',
        body: formData,
        headers: {
          authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }),
      invalidatesTags: ['Settings']
    }),

    // Get system health status
    getSystemHealth: builder.query<{
      status: string;
      database: string;
      api: string;
      storage: string;
      uptime: number;
      last_backup: string;
    }, void>({
      query: () => '/settings/health',
      providesTags: ['Settings']
    }),

    // Clear system cache
    clearCache: builder.mutation<ApiResponse<{ message: string }>, void>({
      query: () => ({
        url: '/settings/cache/clear',
        method: 'POST',
      }),
      invalidatesTags: ['Settings']
    }),

    // Backup database
    backupDatabase: builder.mutation<Blob, void>({
      query: () => ({
        url: '/settings/backup',
        method: 'POST',
        responseHandler: (response) => response.blob(),
      }),
    }),

    // Get system logs
    getSystemLogs: builder.query<{
      logs: Array<{
        timestamp: string;
        level: string;
        message: string;
        user_id?: string;
        action: string;
      }>;
      total: number;
    }, { 
      page?: number; 
      limit?: number;
      level?: string;
      start_date?: string;
      end_date?: string;
    }>({
      query: (params) => ({
        url: '/settings/logs',
        method: 'GET',
        params,
      }),
      providesTags: ['Settings']
    }),

    // Update email settings
    updateEmailSettings: builder.mutation<ApiResponse<{ message: string }>, {
      smtp_host: string;
      smtp_port: number;
      smtp_username: string;
      smtp_password: string;
      from_email: string;
      from_name: string;
    }>({
      query: (emailSettings) => ({
        url: '/settings/email',
        method: 'PUT',
        body: emailSettings,
      }),
      invalidatesTags: ['Settings']
    }),

    // Test email configuration
    testEmailConfig: builder.mutation<ApiResponse<{ message: string }>, void>({
      query: () => ({
        url: '/settings/email/test',
        method: 'POST',
      }),
    }),

    // Update payment gateway settings
    updatePaymentSettings: builder.mutation<ApiResponse<{ message: string }>, {
      stripe_public_key: string;
      stripe_secret_key: string;
      paypal_client_id: string;
      paypal_secret: string;
      default_currency: string;
      tax_rate: number;
    }>({
      query: (paymentSettings) => ({
        url: '/settings/payment',
        method: 'PUT',
        body: paymentSettings,
      }),
      invalidatesTags: ['Settings']
    }),

    // Update security settings
    updateSecuritySettings: builder.mutation<ApiResponse<{ message: string }>, {
      two_factor_auth: boolean;
      session_timeout: number;
      password_policy: string;
      max_login_attempts: number;
      ip_whitelist: string[];
    }>({
      query: (securitySettings) => ({
        url: '/settings/security',
        method: 'PUT',
        body: securitySettings,
      }),
      invalidatesTags: ['Settings']
    }),

    // Get system metrics
    getSystemMetrics: builder.query<{
      total_users: number;
      total_bookings: number;
      total_vehicles: number;
      total_revenue: number;
      active_sessions: number;
      system_load: number;
      memory_usage: number;
      disk_usage: number;
    }, void>({
      query: () => '/settings/metrics',
      providesTags: ['Settings']
    }),
  }),
});

export const {
  useGetSettingsQuery,
  useGetSettingByKeyQuery,
  useUpdateSettingsMutation,
  useUpdateSettingMutation,
  useResetSettingsMutation,
  useExportSettingsMutation,
  useImportSettingsMutation,
  useGetSystemHealthQuery,
  useClearCacheMutation,
  useBackupDatabaseMutation,
  useGetSystemLogsQuery,
  useUpdateEmailSettingsMutation,
  useTestEmailConfigMutation,
  useUpdatePaymentSettingsMutation,
  useUpdateSecuritySettingsMutation,
  useGetSystemMetricsQuery,
} = settingsApi;