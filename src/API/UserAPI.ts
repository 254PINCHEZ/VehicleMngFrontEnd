import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { User, ApiResponse } from '../types/types';
import { apiDomain } from '../ApiDomain/ApiDomain';

export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: fetchBaseQuery({ 
        baseUrl: apiDomain, // This should be "http://localhost:3001/api"
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token');
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Users'],
    endpoints: (builder) => ({
        // Fetch all Users - FIXED: Added 'api/' prefix
        getAllUsers: builder.query<User[], void>({
            query: () => 'api/users', // Changed from 'users' to 'api/users'
            providesTags: ['Users'],
        }),        

        // Get user by id - FIXED: Added 'api/' prefix
        getUserById: builder.query<User, { user_id: string }>({
            query: ({ user_id }) => `api/users/${user_id}`, // Changed from 'users/' to 'api/users/'
            providesTags: ['Users'],
        }),

        // Update user details - FIXED: Added 'api/' prefix
        updateUsersDetails: builder.mutation<ApiResponse<any>, { user_id: string } & Partial<Omit<User, 'user_id' | 'role' | 'created_at' | 'updated_at'>>>({
            query: ({ user_id, ...updateUser }) => ({
                url: `api/users/${user_id}`, // Changed from 'users/' to 'api/users/'
                method: 'PUT',
                body: updateUser,
            }),
            invalidatesTags: ['Users'],
        }),

        // Update user role - FIXED: Added 'api/' prefix
        updateUserRoleStatus: builder.mutation<ApiResponse<any>, { user_id: string, role: string }>({
            query: ({ user_id, ...updateUserRole }) => ({
                url: `api/users/user-role/${user_id}`, // Changed from 'users/' to 'api/users/'
                method: 'PATCH',
                body: updateUserRole,
            }),
            invalidatesTags: ['Users']
        }),

        // Optional: Delete user - ADDED if needed
        deleteUser: builder.mutation<ApiResponse<any>, { user_id: string }>({
            query: ({ user_id }) => ({
                url: `api/users/${user_id}`, // Changed from 'users/' to 'api/users/'
                method: 'DELETE',
            }),
            invalidatesTags: ['Users']
        }),

    }),
});

// Export hooks
export const {
    useGetAllUsersQuery,
    useGetUserByIdQuery,
    useUpdateUsersDetailsMutation,
    useUpdateUserRoleStatusMutation,
    useDeleteUserMutation, // Added if you include delete endpoint
} = userApi;