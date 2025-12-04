import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { SupportTicket, TicketReply, ApiResponse } from '../types/types';
import { apiDomain } from '../ApiDomain/ApiDomain';

export const supportApi = createApi({
  reducerPath: 'supportApi',
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
  tagTypes: ['SupportTickets', 'TicketReplies'],
  endpoints: (builder) => ({

    // Fetch all support tickets
    getAllTickets: builder.query<SupportTicket[], void>({
      query: () => '/support/tickets',     
      providesTags: ['SupportTickets']        
    }),

    // Get ticket by id
    getTicketById: builder.query<SupportTicket, string>({
      query: (ticket_id) => `/support/tickets/${ticket_id}`,     
      providesTags: ['SupportTickets']
    }),

    // Get tickets by customer
    getTicketsByCustomer: builder.query<SupportTicket[], string>({
      query: (customer_id) => `/support/tickets/customer/${customer_id}`,     
      providesTags: ['SupportTickets']
    }),

    // Create new support ticket
    createTicket: builder.mutation<ApiResponse<{ ticket_id: string }>, Partial<SupportTicket>>({
      query: (ticketData) => ({
        url: '/support/tickets',
        method: 'POST',
        body: ticketData,
      }),
      invalidatesTags: ['SupportTickets'],
    }),

    // Update ticket status
    updateTicketStatus: builder.mutation<ApiResponse<{ message: string }>, { 
      ticket_id: string; 
      status: string 
    }>({
      query: ({ ticket_id, status }) => ({
        url: `/support/tickets/${ticket_id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['SupportTickets']
    }),

    // Update ticket priority
    updateTicketPriority: builder.mutation<ApiResponse<{ message: string }>, { 
      ticket_id: string; 
      priority: string 
    }>({
      query: ({ ticket_id, priority }) => ({
        url: `/support/tickets/${ticket_id}/priority`,
        method: 'PATCH',
        body: { priority },
      }),
      invalidatesTags: ['SupportTickets']
    }),

    // Assign ticket to admin
    assignTicket: builder.mutation<ApiResponse<{ message: string }>, { 
      ticket_id: string; 
      assigned_to: string 
    }>({
      query: ({ ticket_id, assigned_to }) => ({
        url: `/support/tickets/${ticket_id}/assign`,
        method: 'PATCH',
        body: { assigned_to },
      }),
      invalidatesTags: ['SupportTickets']
    }),

    // Delete ticket
    deleteTicket: builder.mutation<ApiResponse<{ message: string }>, string>({
      query: (ticket_id) => ({
        url: `/support/tickets/${ticket_id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['SupportTickets']
    }),

    // Get ticket replies
    getTicketReplies: builder.query<TicketReply[], string>({
      query: (ticket_id) => `/support/tickets/${ticket_id}/replies`,
      providesTags: ['TicketReplies']
    }),

    // Add reply to ticket
    addTicketReply: builder.mutation<ApiResponse<{ reply_id: string }>, { 
      ticket_id: string;
      message: string;
      is_admin: boolean;
    }>({
      query: ({ ticket_id, ...replyData }) => ({
        url: `/support/tickets/${ticket_id}/replies`,
        method: 'POST',
        body: replyData,
      }),
      invalidatesTags: ['TicketReplies', 'SupportTickets']
    }),

    // Mark ticket as resolved
    markAsResolved: builder.mutation<ApiResponse<{ message: string }>, string>({
      query: (ticket_id) => ({
        url: `/support/tickets/${ticket_id}/resolve`,
        method: 'PATCH',
      }),
      invalidatesTags: ['SupportTickets']
    }),

    // Reopen ticket
    reopenTicket: builder.mutation<ApiResponse<{ message: string }>, string>({
      query: (ticket_id) => ({
        url: `/support/tickets/${ticket_id}/reopen`,
        method: 'PATCH',
      }),
      invalidatesTags: ['SupportTickets']
    }),

    // Get support statistics
    getSupportStats: builder.query<{
      total_tickets: number;
      open_tickets: number;
      resolved_tickets: number;
      average_response_time: number;
    }, void>({
      query: () => '/support/stats',
      providesTags: ['SupportTickets']
    }),

    // Search tickets
    searchTickets: builder.query<SupportTicket[], { 
      query: string; 
      status?: string; 
      priority?: string;
      category?: string;
    }>({
      query: (searchParams) => ({
        url: '/support/tickets/search',
        method: 'GET',
        params: searchParams,
      }),
      providesTags: ['SupportTickets']
    }),
  }),
});

export const {
  useGetAllTicketsQuery,
  useGetTicketByIdQuery,
  useGetTicketsByCustomerQuery,
  useCreateTicketMutation,
  useUpdateTicketStatusMutation,
  useUpdateTicketPriorityMutation,
  useAssignTicketMutation,
  useDeleteTicketMutation,
  useGetTicketRepliesQuery,
  useAddTicketReplyMutation,
  useMarkAsResolvedMutation,
  useReopenTicketMutation,
  useGetSupportStatsQuery,
  useSearchTicketsQuery,
} = supportApi;