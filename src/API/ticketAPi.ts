import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { SupportTicket, SupportTicketFormValues } from '../types/types';
import { apiDomain } from '../ApiDomain/ApiDomain';

export const ticketApi = createApi({
    reducerPath: 'ticketApi',
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
    tagTypes: ['Tickets'],
    endpoints: (builder) => ({
        // Create support ticket
        createTicket: builder.mutation<{ message: string }, SupportTicketFormValues>({
            query: (ticketData) => ({
                url: 'tickets',
                method: 'POST',
                body: ticketData,
            }),
            invalidatesTags: ['Tickets'],
        }),

        // Get user tickets
        getUserTickets: builder.query<SupportTicket[], string>({
            query: (userId) => `tickets/user/${userId}`,
            providesTags: ['Tickets'],
        }),

        // Get all tickets (admin)
        getAllTickets: builder.query<SupportTicket[], void>({
            query: () => 'tickets',
            providesTags: ['Tickets'],
        }),

        // Update ticket status
        updateTicketStatus: builder.mutation<{ message: string }, { 
            ticket_id: string; 
            status: 'Open' | 'InProgress' | 'Resolved' | 'Closed' 
        }>({
            query: ({ ticket_id, status }) => ({
                url: `tickets/${ticket_id}`,
                method: 'PUT',
                body: { status },
            }),
            invalidatesTags: ['Tickets'],
        }),
    }),
})

export const {
    useCreateTicketMutation,
    useGetUserTicketsQuery,
    useGetAllTicketsQuery,
    useUpdateTicketStatusMutation,
} = ticketApi