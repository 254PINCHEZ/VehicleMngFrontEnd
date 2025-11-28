import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Payment } from '../types/types';
import { apiDomain } from '../ApiDomain/ApiDomain';

export const paymentApi = createApi({
    reducerPath: 'paymentApi',
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
    tagTypes: ['Payments'],
    endpoints: (builder) => ({

        // Fetch all Payments
        getAllPayments: builder.query<Payment[], void>({
            query: () => 'payments',
            providesTags: ['Payments'],
        }),        

        //get payment by id
        getPaymentById: builder.query<Payment, { payment_id: string }>({
            query: ({ payment_id }) => `payments/${payment_id}`,
            providesTags: ['Payments'],
        }),

        //create payment
        createPayment: builder.mutation<{ message: string }, Partial<Omit<Payment, 'payment_id' | 'created_at'>>>({
            query: (newPayment) => ({
                url: 'payments',
                method: 'POST',
                body: newPayment,
            }),
            invalidatesTags: ['Payments'],
        }),

        //update payment status
        updatePaymentStatus: builder.mutation<{ message: string }, { payment_id: string, status: string }>({
            query: ({ payment_id, ...updatePaymentStatus }) => ({
                url: `payments/payment-status/${payment_id}`,
                method: 'PATCH',
                body: updatePaymentStatus,
            }),
            invalidatesTags: ['Payments']
        }),

    }),
})

export const {
    useGetAllPaymentsQuery,
    useGetPaymentByIdQuery,
    useCreatePaymentMutation,
    useUpdatePaymentStatusMutation,
} = paymentApi