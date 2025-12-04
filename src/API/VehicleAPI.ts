import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Vehicle, VehicleSpecification, ApiResponse } from '../types/types';
import { apiDomain } from '../ApiDomain/ApiDomain';

// First, let's see what apiDomain is
console.log('API Domain:', apiDomain);

export const vehicleApi = createApi({
  reducerPath: 'vehicleApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: apiDomain, // Should be http://localhost:3001 or http://localhost:3001/api
    prepareHeaders: (headers, { getState, endpoint }) => {
      console.log(`Preparing headers for: ${endpoint}`);
      
      // Handle tracking prevention - try multiple storage methods
      let token = null;
      
      // Try localStorage first
      try {
        token = localStorage.getItem('token');
        console.log('Token from localStorage:', token ? 'Found' : 'Not found');
      } catch (e) {
        console.log('localStorage blocked by tracking prevention');
      }
      
      // Fallback to sessionStorage
      if (!token) {
        try {
          token = sessionStorage.getItem('token');
          console.log('Token from sessionStorage:', token ? 'Found' : 'Not found');
        } catch (e) {
          console.log('sessionStorage also blocked');
        }
      }
      
      // Fallback to cookies
      if (!token) {
        try {
          const cookies = document.cookie.split(';');
          for (let cookie of cookies) {
            if (cookie.includes('token=')) {
              token = cookie.split('=')[1].trim();
              console.log('Token from cookies: Found');
              break;
            }
          }
        } catch (e) {
          console.log('Cookies also blocked');
        }
      }
      
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
        console.log('Authorization header set');
      } else {
        console.log('No token found for authorization');
      }
      
      return headers;
    },
  }),
  tagTypes: ['Vehicles'],
  endpoints: (builder) => ({

    // ✅ FIXED: Add /api/ prefix to all endpoints
    getAllVehicles: builder.query<Vehicle[], void>({
      query: () => '/api/vehicles', // Changed from '/vehicles' to '/api/vehicles'
      providesTags: ['Vehicles'],
      transformErrorResponse: (response) => {
        console.log('Error fetching vehicles:', response);
        return response;
      }
    }),

    getVehicleById: builder.query<Vehicle, string>({
      query: (vehicle_id) => `/api/vehicles/${vehicle_id}`, // Added /api/
      providesTags: ['Vehicles']
    }),

    // ✅ ADD THIS - Update vehicle status (for availability toggle)
    updateVehicleStatus: builder.mutation<ApiResponse<{ message: string }>, { 
      vehicle_id: string; 
      availability: boolean;
      rental_rate?: number;
    }>({
      query: ({ vehicle_id, availability, rental_rate = 0 }) => ({
        url: `/api/vehicles/${vehicle_id}`, // Added /api/
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          availability,
          rental_rate
        }),
      }),
      invalidatesTags: ['Vehicles']
    }),

    // ✅ ADD THIS - Delete vehicle
    deleteVehicle: builder.mutation<ApiResponse<{ message: string }>, string>({
      query: (vehicle_id) => ({
        url: `/api/vehicles/${vehicle_id}`, // Added /api/
        method: 'DELETE',
      }),
      invalidatesTags: ['Vehicles']
    }),

    // Keep other endpoints with /api/ prefix
    addVehicle: builder.mutation<ApiResponse<{ vehicle_id: string }>, FormData>({
      query: (formData) => ({
        url: '/api/vehicles', // Added /api/
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Vehicles'],
    }),

    updateVehicle: builder.mutation<ApiResponse<{ message: string }>, { 
      vehicle_id: string; 
      formData: FormData 
    }>({
      query: ({ vehicle_id, formData }) => ({
        url: `/api/vehicles/${vehicle_id}`, // Added /api/
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: ['Vehicles']
    }),

    // ... other endpoints with /api/ prefix
  }),
});

// ✅ CRITICAL: Export all hooks
export const {
  useGetAllVehiclesQuery,
  useGetVehicleByIdQuery,
  useAddVehicleMutation,
  useUpdateVehicleMutation,
  useUpdateVehicleStatusMutation, // ✅ This must be exported
  useDeleteVehicleMutation,
} = vehicleApi;