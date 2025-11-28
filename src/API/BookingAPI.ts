import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Booking } from '../types/types';
import { apiDomain } from '../ApiDomain/ApiDomain';

export const bookingApi = createApi({
    reducerPath: 'bookingApi',
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
    tagTypes: ['Bookings'],
    endpoints: (builder) => ({
        // Booking endpoints will be added here
        getAllBookings: builder.query<Booking[], void>({
            query: () => 'bookings',
            providesTags: ['Bookings'],
        }),
    }),
})