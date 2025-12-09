import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { SupportTicket, TicketReply, ApiResponse } from '../types/types';
import { apiDomain } from '../ApiDomain/ApiDomain';
import type { RootState } from '../store/store';

export const supportApi = createApi({
  reducerPath: 'supportApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: `${apiDomain}/api`,
    prepareHeaders: (headers, { getState }) => {
      // Try to get token from multiple sources
      const state = getState() as RootState;
      
      // 1. Try Redux state first
      let token = state.auth?.token;
      
      console.log('🔐 Support API - Token check - Redux:', token ? 'Token exists' : 'No token');
      console.log('🔐 Support API - Token check - localStorage:', localStorage.getItem('token') ? 'Token exists' : 'No token');
      
      // 2. If no valid token in Redux, check localStorage
      if (!token || token === 'Token exists') {
        token = localStorage.getItem('token');
      }
      
      // 3. If still no token, try sessionStorage
      if (!token) {
        token = sessionStorage.getItem('token');
      }
      
      if (token) {
        console.log('📊 Token details:', {
          type: typeof token,
          length: token.length,
          startsWithBearer: token.startsWith('Bearer '),
          first30Chars: token.substring(0, 30) + '...'
        });
        
        // Clean the token: Remove duplicate "Bearer " prefix if it exists
        let cleanToken = token;
        
        // Handle the case where token might be "Bearer Bearer ..."
        while (cleanToken.startsWith('Bearer ')) {
          cleanToken = cleanToken.substring(7); // Remove "Bearer "
        }
        
        // Now add a single "Bearer " prefix
        const authToken = `Bearer ${cleanToken}`;
        headers.set('Authorization', authToken);
        
        console.log('✅ Setting Authorization header with token:', authToken.substring(0, 30) + '...');
      } else {
        console.warn('⚠️ No valid authentication token found for support API');
      }
      
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['SupportTickets', 'TicketReplies'],
  endpoints: (builder) => ({

    // ✅ Fetch all support tickets
    getAllTickets: builder.query<SupportTicket[], void>({
      query: () => {
        console.log('📋 Fetching all support tickets...');
        return '/support/tickets';
      },     
      providesTags: ['SupportTickets'],
      transformResponse: (response: ApiResponse<SupportTicket[]> | SupportTicket[]) => {
        // Handle both response formats
        if (response && typeof response === 'object' && 'data' in response) {
          return response.data || [];
        }
        return response as SupportTicket[];
      },
      transformErrorResponse: (response: any) => {
        console.error('❌ Support tickets fetch error:', response);
        return response;
      }
    }),

    // ✅ Get ticket by id
    getTicketById: builder.query<SupportTicket, string>({
      query: (ticket_id) => {
        console.log(`📋 Fetching ticket ${ticket_id}...`);
        return `/support/tickets/${ticket_id}`;
      },     
      providesTags: ['SupportTickets'],
      transformResponse: (response: ApiResponse<SupportTicket> | SupportTicket) => {
        if (response && typeof response === 'object' && 'data' in response) {
          return response.data;
        }
        return response as SupportTicket;
      }
    }),

    // ✅ Get tickets by customer
    getTicketsByCustomer: builder.query<SupportTicket[], string>({
      query: (customer_id) => `/support/tickets/customer/${customer_id}`,     
      providesTags: ['SupportTickets'],
      transformResponse: (response: ApiResponse<SupportTicket[]> | SupportTicket[]) => {
        if (response && typeof response === 'object' && 'data' in response) {
          return response.data || [];
        }
        return response as SupportTicket[];
      }
    }),

    // ✅ Create new support ticket
    createTicket: builder.mutation<ApiResponse<{ ticket_id: string }>, Partial<SupportTicket>>({
      query: (ticketData) => ({
        url: '/support/tickets',
        method: 'POST',
        body: ticketData,
      }),
      invalidatesTags: ['SupportTickets'],
    }),

    // ✅ Update ticket status
    updateTicketStatus: builder.mutation<ApiResponse<{ message: string }>, { 
      ticket_id: string | number; 
      status: string 
    }>({
      query: ({ ticket_id, status }) => {
        console.log(`🔄 Updating ticket ${ticket_id} status to ${status}...`);
        return {
          url: `/support/tickets/${ticket_id}/status`,
          method: 'PATCH',
          body: { status },
        };
      },
      invalidatesTags: ['SupportTickets'],
      transformErrorResponse: (response: any) => {
        console.error('❌ Ticket status update error:', response);
        return response;
      }
    }),

    // ✅ Update ticket priority
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

    // ✅ Assign ticket to admin
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

    // ✅ Delete ticket
    deleteTicket: builder.mutation<ApiResponse<{ message: string }>, string>({
      query: (ticket_id) => ({
        url: `/support/tickets/${ticket_id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['SupportTickets']
    }),

    // ✅ Get ticket replies
    getTicketReplies: builder.query<TicketReply[], string>({
      query: (ticket_id) => `/support/tickets/${ticket_id}/replies`,
      providesTags: ['TicketReplies'],
      transformResponse: (response: ApiResponse<TicketReply[]> | TicketReply[]) => {
        if (response && typeof response === 'object' && 'data' in response) {
          return response.data || [];
        }
        return response as TicketReply[];
      }
    }),

    // ✅ Add reply to ticket
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

    // ✅ Mark ticket as resolved
    markAsResolved: builder.mutation<ApiResponse<{ message: string }>, string>({
      query: (ticket_id) => ({
        url: `/support/tickets/${ticket_id}/resolve`,
        method: 'PATCH',
      }),
      invalidatesTags: ['SupportTickets']
    }),

    // ✅ Reopen ticket
    reopenTicket: builder.mutation<ApiResponse<{ message: string }>, string>({
      query: (ticket_id) => ({
        url: `/support/tickets/${ticket_id}/reopen`,
        method: 'PATCH',
      }),
      invalidatesTags: ['SupportTickets']
    }),

    // ✅ Get support statistics
    getSupportStats: builder.query<{
      total_tickets: number;
      open_tickets: number;
      resolved_tickets: number;
      average_response_time: number;
    }, void>({
      query: () => {
        console.log('📊 Fetching support statistics...');
        return '/support/stats';
      },
      providesTags: ['SupportTickets'],
      transformResponse: (response: ApiResponse<any> | any) => {
        if (response && typeof response === 'object' && 'data' in response) {
          return response.data;
        }
        return response;
      }
    }),

    // ✅ Search tickets
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
      providesTags: ['SupportTickets'],
      transformResponse: (response: ApiResponse<SupportTicket[]> | SupportTicket[]) => {
        if (response && typeof response === 'object' && 'data' in response) {
          return response.data || [];
        }
        return response as SupportTicket[];
      }
    }),

    // ✅ Health check endpoint
    getSupportHealth: builder.query<{ status: string; message: string }, void>({
      query: () => '/support/health',
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
  useGetSupportHealthQuery,
} = supportApi;