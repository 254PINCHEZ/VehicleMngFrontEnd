import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { LoginFormValues, RegisterFormValues, User } from '../types/types';
import { apiDomain } from '../ApiDomain/ApiDomain';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: `${apiDomain}/api/auth`,
    prepareHeaders: (headers) => {
      // For auth endpoints (login/register), we don't need token
      // Only add token for protected endpoints like profile
      const token = localStorage.getItem('token');
      
      if (token && window.location.pathname.includes('/profile')) {
        // Basic JWT validation
        const tokenParts = token.split('.');
        if (tokenParts.length === 3) {
          headers.set('Authorization', `Bearer ${token}`);
        } else {
          console.warn('Invalid token format in auth API');
        }
      }
      
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Auth'],
  endpoints: (builder) => ({
    // User registration
    register: builder.mutation<{ message: string; token?: string; user?: User }, RegisterFormValues>({
      query: (userData) => ({
        url: '/register',
        method: 'POST',
        body: userData,
      }),
    }),

    // User login - THIS IS CRITICAL
    login: builder.mutation<{ message: string; token: string; user: User }, LoginFormValues>({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
      transformResponse: (response: any) => {
        console.log('✅ Login successful, response:', response);
        
        // Automatically save token if present
        if (response.token) {
          localStorage.setItem('token', response.token);
          console.log('💾 Token saved to localStorage');
        }
        
        return response;
      },
    }),

    // Get user profile
    getProfile: builder.query<User, void>({
      query: () => '/profile',
      providesTags: ['Auth'],
    }),

    // Update user profile
    updateProfile: builder.mutation<User, Partial<User>>({
      query: (userData) => ({
        url: '/profile',
        method: 'PUT',
        body: userData,
      }),
      invalidatesTags: ['Auth'],
    }),

    // User logout
    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: '/logout',
        method: 'POST',
      }),
      invalidatesTags: ['Auth'],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useLogoutMutation,
} = authApi;