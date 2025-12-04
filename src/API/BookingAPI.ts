import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Booking, ApiResponse } from '../types/types';
import { apiDomain } from '../ApiDomain/ApiDomain';

export const bookingApi = createApi({
    reducerPath: 'bookingApi',
    baseQuery: fetchBaseQuery({ 
        baseUrl: apiDomain, // Should be "http://localhost:3001/api"
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token');
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Bookings'],
    endpoints: (builder) => ({
        // FIXED: Add 'api/' if your backend expects it
        getAllBookings: builder.query<Booking[], void>({
            query: () => 'api/bookings', // Changed from 'bookings' to 'api/bookings'
            providesTags: ['Bookings'],
        }),

        updateBookingStatus: builder.mutation<ApiResponse<any>, { booking_id: number; status: string }>({
            query: ({ booking_id, status }) => ({
                url: `api/bookings/${booking_id}/status`, // Add 'api/' prefix
                method: 'PUT',
                body: { status },
            }),
            invalidatesTags: ['Bookings'],
        }),
    }),
});

export const { 
    useGetAllBookingsQuery,
    useUpdateBookingStatusMutation,
} = bookingApi;