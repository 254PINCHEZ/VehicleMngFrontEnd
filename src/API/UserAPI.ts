import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { User } from '../types/types';
import { apiDomain } from '../ApiDomain/ApiDomain';

export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: fetchBaseQuery({ 
        baseUrl: apiDomain,
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

        // Fetch all Users
        getAllUsers: builder.query<User[], void>({
            query: () => 'users',
            providesTags: ['Users'],
        }),        

        //get user by id
        getUserById: builder.query<User, { user_id: string }>({
            query: ({ user_id }) => `users/${user_id}`,
            providesTags: ['Users'],
        }),

        //update user details
        updateUsersDetails: builder.mutation<{ message: string }, { user_id: string } & Partial<Omit<User, 'user_id' | 'role' | 'created_at' | 'updated_at'>>>({
            query: ({ user_id, ...updateUser }) => ({
                url: `users/${user_id}`,
                method: 'PUT',
                body: updateUser,
            }),
            invalidatesTags: ['Users'],
        }),

        //update user role
        updateUserRoleStatus: builder.mutation<{ message: string }, { user_id: string, role: string }>({
            query: ({ user_id, ...updateUserRole }) => ({
                url: `users/user-role/${user_id}`,
                method: 'PATCH',
                body: updateUserRole,
            }),
            invalidatesTags: ['Users']
        }),

    }),
})

export const {
    useGetAllUsersQuery,
    useGetUserByIdQuery,
    useUpdateUsersDetailsMutation,
    useUpdateUserRoleStatusMutation,
} = userApi