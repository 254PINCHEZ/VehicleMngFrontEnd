import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { LoginFormValues, RegisterFormValues, User } from '../types/types';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/auth`,
  }),
  tagTypes: ['Auth'],
  endpoints: (builder) => ({
    register: builder.mutation<{ message: string }, RegisterFormValues>({
      query: (userData) => ({
        url: '/register',
        method: 'POST',
        body: userData,
      }),
    }),

    login: builder.mutation<{ message: string; token: string; user: User }, LoginFormValues>({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
    }),

    getProfile: builder.query<User, void>({
      query: () => '/profile',
      providesTags: ['Auth'],
    }),

    updateProfile: builder.mutation<User, Partial<User>>({
      query: (userData) => ({
        url: '/profile',
        method: 'PUT',
        body: userData,
      }),
      invalidatesTags: ['Auth'],
    }),

    logout: builder.mutation<void, void>({
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