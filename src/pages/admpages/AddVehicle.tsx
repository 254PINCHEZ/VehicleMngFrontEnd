import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
const API_ENDPOINTS = {
  VEHICLES: `${API_BASE_URL}/api/vehicles`,
} as const;

// Types
export type FuelType = 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid' | 'Other';
export type Transmission = 'Automatic' | 'Manual' | 'CVT' | 'Semi-Automatic';

export interface VehicleSpecificationFormData {
  manufacturer: string;
  model: string;
  year: number;
  fuel_type: FuelType;
  engine_capacity?: string;
  transmission?: Transmission;
  seating_capacity: number;
  color: string;
  features: string;
}

export interface VehicleFormData {
  rental_rate: number;
  availability: boolean;
  location_id?: string;
  vehicle_spec: VehicleSpecificationFormData;
}

// Constants
const CURRENT_YEAR = new Date().getFullYear();
const MIN_YEAR = 1900;
const MAX_YEAR = CURRENT_YEAR + 1;

const FUEL_TYPES: FuelType[] = ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'Other'];
const TRANSMISSIONS: Transmission[] = ['Automatic', 'Manual', 'CVT', 'Semi-Automatic'];

// Validation Utility
const validateFormData = (data: VehicleFormData): string | null => {
  const { vehicle_spec, rental_rate } = data;

  if (!vehicle_spec.manufacturer.trim()) {
    return 'Manufacturer is required';
  }

  if (!vehicle_spec.model.trim()) {
    return 'Model is required';
  }

  if (vehicle_spec.year < MIN_YEAR || vehicle_spec.year > MAX_YEAR) {
    return `Please enter a valid year between ${MIN_YEAR} and ${MAX_YEAR}`;
  }

  if (rental_rate <= 0) {
    return 'Please enter a valid rental rate greater than 0';
  }

  return null;
};

// API Service - UPDATED to match your backend service.ts expectations
const vehicleService = {
  addVehicle: async (vehicleData: VehicleFormData, token: string): Promise<any> => {
    // Transform data to match what your backend createVehicle expects
    // Based on your service.ts, it expects { vehicle_spec_id, rental_rate, availability }
    // But you need to first create the vehicle specification
    
    // Since your current createVehicle only accepts vehicle_spec_id, we need to:
    // 1. First create vehicle specification (if separate endpoint exists)
    // 2. Then create vehicle with the returned spec_id
    
    // For now, I'll create a proper payload that includes both vehicle and spec data
    const payload = {
      rental_rate: vehicleData.rental_rate,
      availability: vehicleData.availability,
      location_id: vehicleData.location_id,
      vehicle_spec: vehicleData.vehicle_spec
    };

    const response = await fetch(API_ENDPOINTS.VEHICLES, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized. Please log in as admin.');
      }
      if (response.status === 403) {
        throw new Error('Access denied. Admin privileges required.');
      }
      
      const errorText = await response.text();
      throw new Error(`Failed to add vehicle: ${response.status} - ${errorText}`);
    }

    return await response.json();
  },
};

// Initial Form State
const initialFormData: VehicleFormData = {
  rental_rate: 0,
  availability: true,
  vehicle_spec: {
    manufacturer: '',
    model: '',
    year: CURRENT_YEAR,
    fuel_type: 'Petrol',
    engine_capacity: '',
    transmission: 'Automatic',
    seating_capacity: 5,
    color: '',
    features: '',
  },
};

const AddVehicle: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<VehicleFormData>(initialFormData);

  const getAuthToken = (): string | null => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  };

  const handleSpecificationChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      vehicle_spec: {
        ...prev.vehicle_spec,
        [name]: type === 'number' ? parseFloat(value) || 0 : value,
      },
    }));
  };

  const handleVehicleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked
        : type === 'number' 
          ? parseFloat(value) || 0
          : value,
    }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateFormData(formData);
    if (validationError) {
      toast.error(validationError);
      return;
    }
    
    const token = getAuthToken();
    if (!token) {
      toast.error('Please log in as admin to add vehicles');
      navigate('/login');
      return;
    }

    setIsSubmitting(true);

    try {
      // Log what we're sending for debugging
      console.log('Submitting vehicle data:', formData);
      
      await vehicleService.addVehicle(formData, token);
      
      toast.success('Vehicle added successfully!');
      resetForm();
      navigate('/admin/vehicles');
    } catch (error: any) {
      console.error('Vehicle addition error:', error);
      
      // Check for specific error messages
      if (error.message.includes('vehicle_spec_id') && error.message.includes('NULL')) {
        toast.error('Backend error: Vehicle specification ID is missing. The backend needs to create the specification first.');
      } else {
        toast.error(error.message || 'Failed to add vehicle. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/vehicles');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Add New Vehicle
          </h1>
          <p className="text-gray-600">
            Add a new vehicle to the rental inventory
          </p>
        </header>

        <main className="bg-white rounded-xl shadow-lg p-4 md:p-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Vehicle Specifications Section */}
            <section className="border-b border-gray-200 pb-6">
              <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">
                Vehicle Specifications
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <FormField
                  label="Manufacturer *"
                  name="manufacturer"
                  value={formData.vehicle_spec.manufacturer}
                  onChange={handleSpecificationChange}
                  type="text"
                  placeholder="e.g., Toyota, BMW, Tesla"
                  required
                />

                <FormField
                  label="Model *"
                  name="model"
                  value={formData.vehicle_spec.model}
                  onChange={handleSpecificationChange}
                  type="text"
                  placeholder="e.g., Camry, X5, Model S"
                  required
                />

                <FormField
                  label="Year *"
                  name="year"
                  value={formData.vehicle_spec.year}
                  onChange={handleSpecificationChange}
                  type="number"
                  min={MIN_YEAR}
                  max={MAX_YEAR}
                  required
                />

                <FormField
                  label="Color"
                  name="color"
                  value={formData.vehicle_spec.color}
                  onChange={handleSpecificationChange}
                  type="text"
                  placeholder="e.g., Red, Blue, Black"
                />
              </div>

              {/* Technical Specifications */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fuel Type *
                  </label>
                  <select
                    name="fuel_type"
                    value={formData.vehicle_spec.fuel_type}
                    onChange={handleSpecificationChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  >
                    {FUEL_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Transmission
                  </label>
                  <select
                    name="transmission"
                    value={formData.vehicle_spec.transmission}
                    onChange={handleSpecificationChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  >
                    <option value="">Select transmission</option>
                    {TRANSMISSIONS.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <FormField
                  label="Engine Capacity"
                  name="engine_capacity"
                  value={formData.vehicle_spec.engine_capacity || ''}
                  onChange={handleSpecificationChange}
                  type="text"
                  placeholder="e.g., 2.0L, 1500cc"
                />

                <FormField
                  label="Seating Capacity"
                  name="seating_capacity"
                  value={formData.vehicle_spec.seating_capacity}
                  onChange={handleSpecificationChange}
                  type="number"
                  min="1"
                  max="50"
                />
              </div>

              {/* Features */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Features
                </label>
                <textarea
                  name="features"
                  value={formData.vehicle_spec.features}
                  onChange={handleSpecificationChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="GPS Navigation, Bluetooth, Sunroof, Leather Seats..."
                />
                <p className="text-xs text-gray-500 mt-2">
                  Separate features with commas
                </p>
              </div>
            </section>

            {/* Rental Information Section */}
            <section>
              <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">
                Rental Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <FormField
                  label="Daily Rental Rate (USD) *"
                  name="rental_rate"
                  value={formData.rental_rate}
                  onChange={handleVehicleChange}
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="e.g., 50.00"
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location ID (Optional)
                  </label>
                  <input
                    type="text"
                    name="location_id"
                    value={formData.location_id || ''}
                    onChange={handleVehicleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter location UUID"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Leave empty for default location
                  </p>
                </div>
              </div>

              {/* Availability Toggle */}
              <div className="flex items-center mt-6">
                <input
                  type="checkbox"
                  id="availability"
                  name="availability"
                  checked={formData.availability}
                  onChange={handleVehicleChange}
                  className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
                />
                <label 
                  htmlFor="availability" 
                  className="ml-2 text-sm text-gray-700 cursor-pointer"
                >
                  Available for rental immediately
                </label>
              </div>
            </section>

            {/* Form Actions */}
            <footer className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[140px] justify-center"
              >
                {isSubmitting ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Adding...
                  </>
                ) : (
                  'Add Vehicle'
                )}
              </button>
            </footer>
          </form>
        </main>
      </div>
    </div>
  );
};

// Reusable Form Field Component
interface FormFieldProps {
  label: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  type: string;
  placeholder?: string;
  required?: boolean;
  min?: number | string;
  max?: number | string;
  step?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  value,
  onChange,
  type,
  placeholder,
  required = false,
  min,
  max,
  step,
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      min={min}
      max={max}
      step={step}
      placeholder={placeholder}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
    />
  </div>
);

export default AddVehicle;