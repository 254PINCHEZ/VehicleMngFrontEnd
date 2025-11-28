import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useGetVehicleByIdQuery } from "../API/VehicleAPI";
import {  useSelector } from "react-redux";
import { type RootState } from "../store/store";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import Footer from "../components/footer";

export default function VehicleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  // const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  
  // const [selectedImage, setSelectedImage] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);

  const { 
    data: vehicle, 
    isLoading, 
    error,
    isError 
  } = useGetVehicleByIdQuery(id!, {
    skip: !id,
  });

  useEffect(() => {
    if (isError) {
      const errorMessage = (error as any)?.data?.message || 'Failed to load vehicle details';
      toast.error(errorMessage);
    }
  }, [isError, error]);

  const calculateTotal = () => {
    if (!startDate || !endDate || !vehicle) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24));
    return days * vehicle.rental_rate;
  };

  const handleBookNow = () => {
    if (!isAuthenticated || !user) {
      toast.error('Please login to book a vehicle');
      navigate('/login', { state: { from: `/vehicle/${id}` } });
      return;
    }

    if (!startDate || !endDate) {
      toast.error('Please select rental dates');
      return;
    }
    
    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) {
      toast.error('Start date cannot be in the past');
      return;
    }

    if (end <= start) {
      toast.error('End date must be after start date');
      return;
    }

    if (vehicle) {
      setIsCalculating(true);
      // Simulate calculation delay for better UX
      setTimeout(() => {
        const bookingData = {
          vehicle,
          startDate,
          endDate,
          totalCost: calculateTotal()
        };
        localStorage.setItem('currentBooking', JSON.stringify(bookingData));
        setIsCalculating(false);
        navigate('/checkout');
      }, 500);
    }
  };

  const getDaysDifference = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <div className="loading loading-spinner loading-lg text-blue-600 mb-6"></div>
            <p className="text-gray-600 text-lg font-medium">Loading vehicle details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!vehicle || isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center max-w-md mx-auto p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
            <div className="bg-red-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Vehicle Not Found</h2>
            <p className="text-gray-600 mb-8 text-lg">The vehicle you're looking for doesn't exist or is no longer available.</p>
            <Link to="/inventory" className="btn btn-primary px-8 py-3 text-lg font-semibold rounded-xl hover:shadow-lg transition-all duration-300">
              Back to Inventory
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      
      {/* Enhanced Breadcrumb */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Home
            </Link>
            <span className="text-gray-400">›</span>
            <Link to="/inventory" className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200">
              Inventory
            </Link>
            <span className="text-gray-400">›</span>
            <span className="text-gray-900 font-semibold truncate max-w-xs">
              {vehicle.vehicle_spec?.manufacturer} {vehicle.vehicle_spec?.model}
            </span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Enhanced Image Section */}
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl h-96 flex items-center justify-center shadow-2xl border border-blue-200 relative overflow-hidden">
              <div className="text-9xl transform hover:scale-110 transition-transform duration-500">🚗</div>
              {/* Availability Badge Overlay */}
              <div className="absolute top-6 left-6">
                <span className={`badge badge-lg ${vehicle.availability ? 'badge-success' : 'badge-error'} font-semibold px-4 py-2 shadow-lg`}>
                  {vehicle.availability ? 'Available' : 'Not Available'}
                </span>
              </div>
            </div>
            
            {/* Enhanced Features Section */}
            {vehicle.vehicle_spec?.features && (
              <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="w-2 h-8 bg-blue-600 rounded-full mr-4"></span>
                  Premium Features
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {vehicle.vehicle_spec.features.split(',').map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-blue-800 font-medium text-sm">{feature.trim()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Vehicle Info & Booking */}
          <div className="space-y-8">
            {/* Enhanced Header */}
            <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-200">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className={`badge badge-lg ${vehicle.availability ? 'badge-success' : 'badge-error'} font-semibold px-4 py-2`}>
                  {vehicle.availability ? '✅ Available' : '❌ Not Available'}
                </span>
                <span className="badge badge-lg badge-outline badge-primary font-semibold px-4 py-2">
                  {vehicle.vehicle_spec?.year}
                </span>
                <span className="badge badge-lg badge-outline badge-secondary font-semibold px-4 py-2">
                  {vehicle.vehicle_spec?.fuel_type}
                </span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                {vehicle.vehicle_spec?.manufacturer} {vehicle.vehicle_spec?.model}
              </h1>
              <div className="flex items-center text-gray-600 text-lg mb-2">
                <svg className="w-6 h-6 mr-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">{vehicle.location?.name || 'Location not specified'}</span>
              </div>
              <div className="flex items-center text-gray-600 text-lg">
                <svg className="w-6 h-6 mr-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">Fully insured and maintained</span>
              </div>
            </div>

            {/* Enhanced Price Card */}
            <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="relative z-10">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-4xl font-bold">{formatCurrency(vehicle.rental_rate)}</span>
                  <span className="text-blue-200 text-xl">/ day</span>
                </div>
                <p className="text-blue-100 text-lg mb-2">All inclusive pricing with no hidden fees</p>
                <div className="flex items-center text-blue-200 text-sm">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Secure payment processing
                </div>
              </div>
            </div>

            {/* Enhanced Booking Form */}
            <div className="card bg-white shadow-2xl border border-gray-200 rounded-3xl">
              <div className="card-body p-8">
                <h3 className="card-title text-3xl text-gray-900 mb-2 flex items-center">
                  <span className="w-2 h-8 bg-green-600 rounded-full mr-4"></span>
                  Reserve Your Dates
                </h3>
                <p className="text-gray-600 text-lg mb-8">Select your rental dates to check availability and pricing</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold text-gray-700 text-lg flex items-center">
                        <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Start Date
                      </span>
                    </label>
                    <input
                      type="date"
                      className="input input-bordered input-lg focus:input-primary w-full rounded-xl border-2 border-gray-300 focus:border-blue-500 transition-colors"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold text-gray-700 text-lg flex items-center">
                        <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        End Date
                      </span>
                    </label>
                    <input
                      type="date"
                      className="input input-bordered input-lg focus:input-primary w-full rounded-xl border-2 border-gray-300 focus:border-blue-500 transition-colors"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      min={startDate || new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>

                {/* Enhanced Price Calculation */}
                {startDate && endDate && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-100 border border-green-200 rounded-2xl p-6 mb-8 transform hover:scale-[1.02] transition-transform duration-300">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-gray-700 font-semibold text-lg">Rental Summary:</span>
                      <span className="text-3xl font-bold text-green-600">
                        {formatCurrency(calculateTotal())}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex justify-between">
                        <span>{getDaysDifference()} days × {formatCurrency(vehicle.rental_rate)}/day</span>
                        <span>{formatCurrency(getDaysDifference() * vehicle.rental_rate)}</span>
                      </div>
                      <div className="flex justify-between text-green-600 font-semibold">
                        <span>Total Amount</span>
                        <span>{formatCurrency(calculateTotal())}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="card-actions justify-end">
                  <button 
                    className="btn btn-primary btn-lg w-full text-lg py-4 rounded-xl font-semibold hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 disabled:transform-none disabled:hover:shadow-none relative overflow-hidden"
                    onClick={handleBookNow}
                    disabled={!vehicle.availability || !startDate || !endDate || isCalculating}
                  >
                    {isCalculating ? (
                      <>
                        <span className="loading loading-spinner loading-sm mr-2"></span>
                        Processing...
                      </>
                    ) : vehicle.availability ? (
                      <>
                        <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Reserve Now - {formatCurrency(calculateTotal())}
                      </>
                    ) : (
                      'Currently Unavailable'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Specifications */}
        {vehicle.vehicle_spec && (
          <div className="mt-20">
            <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center relative">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Vehicle Specifications
              </span>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></div>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-200 transform hover:-translate-y-2 transition-transform duration-300">
                <h3 className="font-bold text-2xl mb-6 text-gray-900 flex items-center">
                  <div className="w-3 h-8 bg-blue-600 rounded-full mr-4"></div>
                  Basic Information
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Manufacturer:</span>
                    <span className="font-semibold text-gray-900 text-lg">{vehicle.vehicle_spec.manufacturer}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Model:</span>
                    <span className="font-semibold text-gray-900 text-lg">{vehicle.vehicle_spec.model}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Year:</span>
                    <span className="font-semibold text-gray-900 text-lg">{vehicle.vehicle_spec.year}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-200 transform hover:-translate-y-2 transition-transform duration-300">
                <h3 className="font-bold text-2xl mb-6 text-gray-900 flex items-center">
                  <div className="w-3 h-8 bg-green-600 rounded-full mr-4"></div>
                  Technical Details
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Fuel Type:</span>
                    <span className="font-semibold text-gray-900 text-lg">{vehicle.vehicle_spec.fuel_type}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Seating Capacity:</span>
                    <span className="font-semibold text-gray-900 text-lg">{vehicle.vehicle_spec.seating_capacity} people</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Transmission:</span>
                    <span className="font-semibold text-gray-900 text-lg">{vehicle.vehicle_spec.transmission || 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-200 transform hover:-translate-y-2 transition-transform duration-300">
                <h3 className="font-bold text-2xl mb-6 text-gray-900 flex items-center">
                  <div className="w-3 h-8 bg-purple-600 rounded-full mr-4"></div>
                  Additional Details
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Color:</span>
                    <span className="font-semibold text-gray-900 text-lg">{vehicle.vehicle_spec.color}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Engine Capacity:</span>
                    <span className="font-semibold text-gray-900 text-lg">{vehicle.vehicle_spec.engine_capacity || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Features:</span>
                    <span className="font-semibold text-gray-900 text-lg">{vehicle.vehicle_spec.features ? 'Available' : 'Basic'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}