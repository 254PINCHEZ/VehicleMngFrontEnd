import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Vehicle, VehicleSpecification, ApiResponse } from '../types/types';
import { apiDomain } from '../ApiDomain/ApiDomain';

export const vehicleApi = createApi({
  reducerPath: 'vehicleApi',
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
  tagTypes: ['Vehicles'],
  endpoints: (builder) => ({

    // Fetch all vehicles with response transformation
    getAllVehicles: builder.query<Vehicle[], void>({
      query: () => '/vehicles',     
      providesTags: ['Vehicles']        
    }),

    // Get vehicle by id with response transformation
    getVehicleById: builder.query<Vehicle, string>({
      query: (vehicle_id) => `/vehicles/${vehicle_id}`,     
      providesTags: ['Vehicles']
    }),

    // Add new vehicle - updated for FormData (file uploads)
    addVehicle: builder.mutation<ApiResponse<{ vehicle_id: string }>, FormData>({
      query: (formData) => ({
        url: '/vehicles',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Vehicles'],
    }),

    // Update vehicle - updated for FormData
    updateVehicle: builder.mutation<ApiResponse<{ message: string }>, { 
      vehicle_id: string; 
      formData: FormData 
    }>({
      query: ({ vehicle_id, formData }) => ({
        url: `/vehicles/${vehicle_id}`,
        method: 'PUT',
        body: formData,
        headers: {
          authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }),
      invalidatesTags: ['Vehicles']
    }),

    // Delete vehicle
    deleteVehicle: builder.mutation<ApiResponse<{ message: string }>, string>({
      query: (vehicle_id) => ({
        url: `/vehicles/${vehicle_id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Vehicles']
    }),

    // Get vehicle specifications
    getVehicleSpecifications: builder.query<VehicleSpecification, string>({
      query: (vehicle_id) => `/vehicles/${vehicle_id}/specifications`,
      transformResponse: (response: ApiResponse<VehicleSpecification>) => {
        return response.data || response;
      },
      providesTags: ['Vehicles']
    }),

    // Update vehicle specifications
    updateVehicleSpecifications: builder.mutation<
      ApiResponse<{ message: string }>, 
      { vehicle_id: string } & Partial<VehicleSpecification>
    >({
      query: ({ vehicle_id, ...specifications }) => ({
        url: `/vehicles/${vehicle_id}/specifications`,
        method: 'PUT',
        body: specifications,
      }),
      invalidatesTags: ['Vehicles']
    }),

    // Toggle vehicle availability
    toggleVehicleAvailability: builder.mutation<
      ApiResponse<{ message: string; is_available: boolean }>, 
      { vehicle_id: string; is_available: boolean }
    >({
      query: ({ vehicle_id, is_available }) => ({
        url: `/vehicles/${vehicle_id}/availability`,
        method: 'PATCH',
        body: { is_available },
      }),
      invalidatesTags: ['Vehicles']
    }),
  }),
});

// ADD THIS EXPORT SECTION - ONLY MISSING PART
export const {
  useGetAllVehiclesQuery,
  useGetVehicleByIdQuery,
  useAddVehicleMutation,
  useUpdateVehicleMutation,
  useDeleteVehicleMutation,
  useGetVehicleSpecificationsQuery,
  useUpdateVehicleSpecificationsMutation,
  useToggleVehicleAvailabilityMutation,
} = vehicleApi;