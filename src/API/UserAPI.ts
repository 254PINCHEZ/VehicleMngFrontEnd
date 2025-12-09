import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { User, ApiResponse } from '../types/types';
import { apiDomain } from '../ApiDomain/ApiDomain';

export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: fetchBaseQuery({ 
        baseUrl: apiDomain,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token');
            if (token) {
                const cleanToken = token.replace(/^Bearer\s+/i, '').trim();
                headers.set('authorization', `Bearer ${cleanToken}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Users'],
    endpoints: (builder) => ({
        // Fetch all Users
        getAllUsers: builder.query<User[], void>({
            query: () => 'api/users',
            providesTags: ['Users'],
        }),        

        // Get user by id
        getUserById: builder.query<User, { user_id: string }>({
            query: ({ user_id }) => `api/users/${user_id}`,
            providesTags: ['Users'],
        }),

        // Update user details (PATCH - partial update)
        updateUsersDetails: builder.mutation<ApiResponse<any>, { 
            user_id: string, 
            first_name?: string,
            last_name?: string,
            email?: string,
            contact_phone?: string,
            address?: string,
            role?: string
        }>({
            query: ({ user_id, ...updateData }) => ({
                url: `api/users/${user_id}`,
                method: 'PATCH',
                body: updateData,
            }),
            invalidatesTags: ['Users'],
        }),

        // Update user role (PATCH - specific endpoint)
        updateUserRoleStatus: builder.mutation<ApiResponse<any>, { 
            user_id: string, 
            role: string 
        }>({
            query: ({ user_id, role }) => ({
                url: `api/user-status/${user_id}`,
                method: 'PATCH',
                body: { role },
            }),
            invalidatesTags: ['Users']
        }),

        // Delete user
        deleteUser: builder.mutation<ApiResponse<any>, { user_id: string }>({
            query: ({ user_id }) => ({
                url: `api/users/${user_id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Users']
        }),

    }),
});

export const {
    useGetAllUsersQuery,
    useGetUserByIdQuery,
    useUpdateUsersDetailsMutation,
    useUpdateUserRoleStatusMutation,
    useDeleteUserMutation,
} = userApi;