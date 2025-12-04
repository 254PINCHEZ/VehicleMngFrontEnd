

import React, { useState, useEffect } from 'react'
import DashboardLayout from '../../components/Dashboard/DashboardLayout'
import { Calendar, Clock, CheckCircle, XCircle, Car, MapPin, DollarSign, RefreshCw, AlertCircle } from 'lucide-react'
import { useSelector } from 'react-redux'
import type { RootState } from '../../store/store'
import Swal from 'sweetalert2'
import { toast } from 'sonner'

const BookingHistory: React.FC = () => {
    const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
    
    // State for real bookings data
    const [bookings, setBookings] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [debugInfo, setDebugInfo] = useState<string>('')

    // Debug function to log all info
    const logDebugInfo = () => {
        const token = localStorage.getItem('token') || localStorage.getItem('access_token')
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'
        
        const info = `
        === DEBUG INFO ===
        User ID: ${user?.user_id || 'No user'}
        Authenticated: ${isAuthenticated}
        Token exists: ${!!token}
        Token preview: ${token ? token.substring(0, 20) + '...' : 'No token'}
        API Base URL: ${API_BASE_URL}
        Bookings count: ${bookings.length}
        Loading: ${isLoading}
        Error: ${error || 'None'}
        ==================
        `
        console.log(info)
        setDebugInfo(info)
    }

    // Fetch real bookings from backend - FIXED VERSION
    const fetchUserBookings = async () => {
        if (!isAuthenticated || !user?.user_id) {
            setError('User not authenticated')
            setIsLoading(false)
            return
        }

        setIsLoading(true)
        setError(null)

        try {
            const token = localStorage.getItem('token') || localStorage.getItem('access_token')
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'
            
            console.log('🔍 Starting to fetch bookings...');
            console.log('User ID:', user.user_id);
            console.log('Token available:', !!token);
            console.log('API Base:', API_BASE_URL);

            // Try different endpoint patterns in sequence
            const endpoints = [
                // Pattern 1: Most likely based on your backend structure
                `${API_BASE_URL}/api/bookings?user_id=${user.user_id}`,
                
                // Pattern 2: Path parameter style
                `${API_BASE_URL}/api/bookings/user/${user.user_id}`,
                
                // Pattern 3: Alternative path
                `${API_BASE_URL}/api/user/bookings`,
                
                // Pattern 4: Maybe it's under a different path
                `${API_BASE_URL}/api/bookings/my-bookings`,
                
                // Pattern 5: Check if there's a specific user bookings endpoint
                `${API_BASE_URL}/api/users/${user.user_id}/bookings`
            ];

            let response = null;
            let successData = null;
            let successfulEndpoint = '';

            // Try each endpoint until one works
            for (const endpoint of endpoints) {
                try {
                    console.log(`Trying endpoint: ${endpoint}`);
                    
                    response = await fetch(endpoint, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        }
                    });

                    console.log(`Response status for ${endpoint}: ${response.status}`);
                    
                    if (response.ok) {
                        const data = await response.json();
                        console.log(`Success! Data received from ${endpoint}:`, data);
                        successData = data;
                        successfulEndpoint = endpoint;
                        break;
                    }
                    
                    if (response.status === 404) {
                        console.log(`Endpoint ${endpoint} not found, trying next...`);
                        continue;
                    }
                    
                    if (response.status === 400) {
                        const errorText = await response.text();
                        console.log(`400 error from ${endpoint}:`, errorText);
                        
                        // Try one more time with different headers
                        const retryResponse = await fetch(endpoint, {
                            method: 'GET',
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                // Try without Content-Type for GET requests
                                'Accept': 'application/json'
                            }
                        });
                        
                        if (retryResponse.ok) {
                            const data = await retryResponse.json();
                            successData = data;
                            successfulEndpoint = endpoint;
                            break;
                        }
                        
                        console.log(`Retry also failed: ${retryResponse.status}`);
                        continue;
                    }
                    
                    // For other errors, try next endpoint
                    console.log(`Endpoint ${endpoint} failed with status ${response.status}`);
                    
                } catch (fetchError) {
                    console.log(`Fetch error for ${endpoint}:`, fetchError);
                    continue;
                }
            }

            // If no endpoint worked
            if (!successData) {
                throw new Error('All booking endpoints failed. Please check your backend routes.');
            }

            console.log(`✅ Successfully fetched from: ${successfulEndpoint}`);
            
            // Process the data
            processBookingsData(successData, successfulEndpoint);

        } catch (err: any) {
            console.error('❌ Error in fetchUserBookings:', err);
            
            // Provide user-friendly error message
            const errorMessage = err.message || 'Failed to load bookings';
            setError(errorMessage);
            
            // Show toast with specific guidance
            if (errorMessage.includes('endpoints failed')) {
                toast.error('Cannot connect to bookings server. Please ensure backend is running.');
            } else if (errorMessage.includes('401') || errorMessage.includes('403')) {
                toast.error('Session expired. Please login again.');
            } else {
                toast.error('Failed to load bookings. Please try again.');
            }
            
            // Fallback: Show example data for development
            if (import.meta.env.DEV) {
                console.log('Showing development example data');
                showExampleData();
            }
            
        } finally {
            setIsLoading(false);
        }
    };

    // Helper to process bookings data
    const processBookingsData = (data: any, endpoint: string) => {
        console.log(`Processing data from ${endpoint}:`, data);
        
        // Check if data is array
        if (!Array.isArray(data)) {
            console.log('Data is not an array:', data);
            
            // If it's an object with a bookings property
            if (data && typeof data === 'object' && data.bookings) {
                data = data.bookings;
            } else if (data && typeof data === 'object') {
                // If it's a single booking object, wrap it in array
                data = [data];
            } else {
                data = [];
            }
        }
        
        console.log('Processed data array:', data);
        
        if (data.length === 0) {
            console.log('No bookings found');
            setBookings([]);
            toast.info('No bookings found for your account.');
            return;
        }
        
        // Transform API data to match your expected structure
        const formattedBookings = data.map((booking: any, index: number) => {
            // Debug each booking
            console.log(`Booking ${index}:`, booking);
            
            return {
                booking_id: booking.booking_id || booking.id || `BK-${Date.now()}-${index}`,
                vehicle_id: booking.vehicle_id,
                vehicle: {
                    vehicle_spec: {
                        manufacturer: booking.vehicle?.vehicle_spec?.manufacturer || 
                                     booking.vehicle?.manufacturer || 
                                     booking.spec_manufacturer || 
                                     booking.vehicle_spec?.manufacturer || 
                                     'Unknown',
                        model: booking.vehicle?.vehicle_spec?.model || 
                               booking.vehicle?.model || 
                               booking.spec_model || 
                               booking.vehicle_spec?.model || 
                               'Unknown',
                        year: booking.vehicle?.vehicle_spec?.year || 
                              booking.vehicle?.year || 
                              booking.spec_year || 
                              booking.vehicle_spec?.year || 
                              new Date().getFullYear()
                    },
                    rental_rate: booking.vehicle?.rental_rate || 
                                 booking.vehicle_rental_rate || 
                                 booking.daily_rate || 
                                 booking.rental_rate || 
                                 0
                },
                location: {
                    city: booking.location?.city || 
                          booking.location_city || 
                          booking.pickup_location?.city || 
                          'Nairobi',
                    country: booking.location?.country || 
                             booking.location_country || 
                             booking.pickup_location?.country || 
                             'Kenya'
                },
                booking_date: booking.booking_date || booking.start_date || new Date().toISOString(),
                return_date: booking.return_date || booking.end_date || new Date().toISOString(),
                total_amount: booking.total_amount || booking.total_cost || booking.total_price || 0,
                booking_status: booking.booking_status || booking.status || 'Pending',
                created_at: booking.created_at || new Date().toISOString(),
                payment_status: booking.payment_status || 'pending',
                duration: calculateDuration(
                    booking.booking_date || booking.start_date,
                    booking.return_date || booking.end_date
                )
            };
        });

        console.log('Final formatted bookings:', formattedBookings);
        setBookings(formattedBookings);
        toast.success(`Loaded ${formattedBookings.length} booking${formattedBookings.length !== 1 ? 's' : ''}`);
    };

    // Show example data for development
    const showExampleData = () => {
        const exampleBookings = [
            {
                booking_id: 'BK-001',
                vehicle_id: 'V001',
                vehicle: {
                    vehicle_spec: {
                        manufacturer: 'Toyota',
                        model: 'Camry',
                        year: 2023
                    },
                    rental_rate: 85
                },
                location: {
                    city: 'Nairobi',
                    country: 'Kenya'
                },
                booking_date: '2024-01-15T10:00:00Z',
                return_date: '2024-01-18T10:00:00Z',
                total_amount: 255,
                booking_status: 'Confirmed',
                created_at: '2024-01-10T14:30:00Z',
                payment_status: 'paid'
            },
            {
                booking_id: 'BK-002',
                vehicle_id: 'V002',
                vehicle: {
                    vehicle_spec: {
                        manufacturer: 'Honda',
                        model: 'Civic',
                        year: 2022
                    },
                    rental_rate: 65
                },
                location: {
                    city: 'Mombasa',
                    country: 'Kenya'
                },
                booking_date: '2024-01-08T09:00:00Z',
                return_date: '2024-01-10T09:00:00Z',
                total_amount: 130,
                booking_status: 'Completed',
                created_at: '2024-01-05T16:20:00Z',
                payment_status: 'paid'
            }
        ];
        
        setBookings(exampleBookings);
        toast.info('Showing example data. Backend connection failed.');
    };

    // Fetch bookings on component mount
    useEffect(() => {
        if (isAuthenticated && user?.user_id) {
            fetchUserBookings()
        } else {
            setIsLoading(false)
            setError('Please login to view your bookings')
        }
    }, [isAuthenticated, user?.user_id])

    // Refresh bookings
    const handleRefresh = () => {
        fetchUserBookings()
    }

    // Helper functions
    const getStatusBadge = (status: string) => {
        const statusConfig = {
            Pending: { color: 'bg-yellow-100 text-yellow-800 border border-yellow-200', icon: Clock, label: 'Pending' },
            Confirmed: { color: 'bg-blue-100 text-blue-800 border border-blue-200', icon: CheckCircle, label: 'Confirmed' },
            Active: { color: 'bg-green-100 text-green-800 border border-green-200', icon: Car, label: 'Active' },
            Completed: { color: 'bg-gray-100 text-gray-800 border border-gray-200', icon: CheckCircle, label: 'Completed' },
            Cancelled: { color: 'bg-red-100 text-red-800 border border-red-200', icon: XCircle, label: 'Cancelled' },
        };

        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.Pending;
        const IconComponent = config.icon;

        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
                <IconComponent size={14} className="mr-1" />
                {config.label}
            </span>
        );
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A'
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (e) {
            return 'Invalid Date'
        }
    };

    const calculateDuration = (startDate: string, endDate: string) => {
        if (!startDate || !endDate) return 0
        try {
            const start = new Date(startDate);
            const end = new Date(endDate);
            const diffTime = Math.abs(end.getTime() - start.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays;
        } catch (e) {
            return 0
        }
    };

    // Function to handle booking cancellation
    const handleCancelBooking = async (bookingId: string) => {
        Swal.fire({
            title: "Cancel Booking?",
            text: "Are you sure you want to cancel this booking?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc2626",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Yes, Cancel Booking",
            cancelButtonText: "Keep Booking"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const token = localStorage.getItem('token') || localStorage.getItem('access_token')
                    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'

                    // Try different cancel endpoints
                    const cancelEndpoints = [
                        `${API_BASE_URL}/api/bookings/${bookingId}/cancel`,
                        `${API_BASE_URL}/api/bookings/${bookingId}`,
                        `${API_BASE_URL}/api/cancel-booking/${bookingId}`
                    ];

                    let cancelSuccess = false;
                    
                    for (const endpoint of cancelEndpoints) {
                        try {
                            console.log(`Trying to cancel booking at: ${endpoint}`);
                            
                            const response = await fetch(endpoint, {
                                method: 'PUT',
                                headers: {
                                    'Authorization': `Bearer ${token}`,
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({ 
                                    status: 'Cancelled',
                                    booking_status: 'Cancelled' 
                                })
                            });

                            if (response.ok) {
                                const result = await response.json();
                                console.log('Cancel success:', result);
                                
                                // Update local state
                                setBookings(prevBookings => 
                                    prevBookings.map(booking => 
                                        booking.booking_id === bookingId 
                                            ? { ...booking, booking_status: 'Cancelled' }
                                            : booking
                                    )
                                );
                                
                                Swal.fire("Cancelled", result.message || "Booking cancelled successfully", "success");
                                toast.success('Booking cancelled successfully');
                                cancelSuccess = true;
                                break;
                            }
                        } catch (cancelError) {
                            console.log(`Cancel failed at ${endpoint}:`, cancelError);
                            continue;
                        }
                    }

                    if (!cancelSuccess) {
                        throw new Error('All cancel endpoints failed');
                    }
                    
                } catch (error) {
                    console.error('Cancel booking error:', error);
                    Swal.fire("Error", "Failed to cancel booking. Please try again.", "error");
                    toast.error('Failed to cancel booking');
                }
            }
        });
    };

    // Function to handle rebooking
    const handleRebook = (booking: any) => {
        Swal.fire({
            title: "Rebook Vehicle?",
            text: `Would you like to book the ${booking.vehicle.vehicle_spec.manufacturer} ${booking.vehicle.vehicle_spec.model} again?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#2563eb",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Yes, Rebook",
            cancelButtonText: "Not Now"
        }).then((result) => {
            if (result.isConfirmed) {
                // Store vehicle info for rebooking
                localStorage.setItem('rebookVehicle', JSON.stringify({
                    vehicle_id: booking.vehicle_id,
                    vehicle_name: `${booking.vehicle.vehicle_spec.manufacturer} ${booking.vehicle.vehicle_spec.model}`,
                    rental_rate: booking.vehicle.rental_rate
                }));
                
                window.location.href = `/inventory?rebook=true`;
            }
        });
    };

    // Function to view booking details
    const handleViewDetails = (bookingId: string) => {
        window.location.href = `/dashboard/booking/${bookingId}`;
    };

    // Test connection button
    const testConnection = async () => {
        console.log('Testing connection...');
        logDebugInfo();
        
        const token = localStorage.getItem('token') || localStorage.getItem('access_token');
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
        
        // Test basic API connectivity
        try {
            const testResponse = await fetch(`${API_BASE_URL}/health` || `${API_BASE_URL}/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            console.log('Basic connectivity test:', testResponse.status);
            
            // Test authentication
            const authResponse = await fetch(`${API_BASE_URL}/api/auth/verify` || `${API_BASE_URL}/api/verify-token`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            console.log('Auth test:', authResponse.status);
            
            toast.info('Connection tests completed. Check console for details.');
            
        } catch (testError) {
            console.error('Connection test failed:', testError);
            toast.error('Connection test failed. Check console.');
        }
    };

    return (
        <DashboardLayout>
           
            {/* Header Section */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <Calendar className="text-blue-600" size={24} />
                    </div>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Booking History</h1>
                        <p className="text-gray-600 text-sm mt-1">View all your vehicle rental bookings</p>
                    </div>
                </div>
                
                <div className="flex gap-2">
                    <button
                        onClick={handleRefresh}
                        disabled={isLoading}
                        className="btn btn-outline btn-sm border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                    >
                        <RefreshCw size={16} className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                    
                    <button
                        onClick={() => window.location.href = '/inventory'}
                        className="btn btn-sm bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        Book New Vehicle
                    </button>
                </div>
            </div>

            {/* Stats Summary */}
            {!isLoading && bookings.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                        <p className="text-sm text-gray-600">Total Bookings</p>
                        <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                        <p className="text-sm text-gray-600">Active</p>
                        <p className="text-2xl font-bold text-green-600">
                            {bookings.filter(b => b.booking_status === 'Active' || b.booking_status === 'Confirmed').length}
                        </p>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                        <p className="text-sm text-gray-600">Completed</p>
                        <p className="text-2xl font-bold text-blue-600">
                            {bookings.filter(b => b.booking_status === 'Completed').length}
                        </p>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                        <p className="text-sm text-gray-600">Total Spent</p>
                        <p className="text-2xl font-bold text-gray-900">
                            ${bookings.reduce((sum, booking) => sum + booking.total_amount, 0)}
                        </p>
                    </div>
                </div>
            )}

            {/* Bookings Content */}
            {isLoading ? (
                <div className="flex flex-col justify-center items-center py-16">
                    <span className="loading loading-spinner loading-lg text-blue-600"></span>
                    <span className="ml-3 text-gray-600 mt-4">Loading your bookings...</span>
                    <span className="text-sm text-gray-500 mt-2">Fetching data from server</span>
                </div>
            ) : error ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                    <AlertCircle className="mx-auto text-red-500 mb-3" size={48} />
                    <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Bookings</h3>
                    <p className="text-red-600 mb-4">{error}</p>
                    <div className="flex gap-2 justify-center">
                        <button
                            onClick={handleRefresh}
                            className="btn btn-outline btn-error"
                        >
                            Try Again
                        </button>
                        <button
                            onClick={() => window.location.href = '/inventory'}
                            className="btn bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            Book a Vehicle
                        </button>
                    </div>
                </div>
            ) : !bookings || bookings.length === 0 ? (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
                    <Calendar className="mx-auto text-gray-400 mb-4" size={64} />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No Bookings Yet</h3>
                    <p className="text-gray-500 mb-6">You haven't made any vehicle bookings yet.</p>
                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={() => window.location.href = '/inventory'}
                            className="btn bg-blue-600 hover:bg-blue-700 text-white border-0"
                        >
                            Browse Vehicles
                        </button>
                        {import.meta.env.DEV && (
                            <button
                                onClick={showExampleData}
                                className="btn btn-outline"
                            >
                                Load Example Data
                            </button>
                        )}
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="table table-zebra w-full">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="text-left font-semibold text-gray-700 p-4">Booking ID</th>
                                    <th className="text-left font-semibold text-gray-700 p-4">Vehicle</th>
                                    <th className="text-left font-semibold text-gray-700 p-4">Location</th>
                                    <th className="text-left font-semibold text-gray-700 p-4">Duration</th>
                                    <th className="text-left font-semibold text-gray-700 p-4">Status</th>
                                    <th className="text-left font-semibold text-gray-700 p-4">Amount</th>
                                    <th className="text-left font-semibold text-gray-700 p-4">Booking Date</th>
                                    <th className="text-center font-semibold text-gray-700 p-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.map((booking) => (
                                    <tr key={booking.booking_id} className="hover:bg-gray-50 transition-colors duration-150">
                                        <td className="font-bold text-gray-800 p-4">
                                            #{booking.booking_id}
                                        </td>
                                        <td className="p-4">
                                            <div>
                                                <div className="font-semibold text-blue-800 flex items-center gap-2">
                                                    <Car size={16} />
                                                    {booking.vehicle.vehicle_spec.manufacturer} {booking.vehicle.vehicle_spec.model}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    Year: {booking.vehicle.vehicle_spec.year} • ${booking.vehicle.rental_rate}/day
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="flex items-center gap-1 text-gray-700">
                                                <MapPin size={14} />
                                                {booking.location.city}, {booking.location.country}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-gray-700 font-medium">
                                                {calculateDuration(booking.booking_date, booking.return_date)} days
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            {getStatusBadge(booking.booking_status)}
                                        </td>
                                        <td className="p-4">
                                            <span className="font-bold text-green-600 flex items-center gap-1">
                                                <DollarSign size={16} />
                                                {booking.total_amount}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm text-gray-600">
                                            {formatDate(booking.created_at)}
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="flex flex-col gap-2 items-center">
                                                <button
                                                    onClick={() => handleViewDetails(booking.booking_id)}
                                                    className="btn btn-outline btn-sm btn-info"
                                                >
                                                    View Details
                                                </button>
                                                
                                                {booking.booking_status === 'Pending' || booking.booking_status === 'Confirmed' ? (
                                                    <button
                                                        onClick={() => handleCancelBooking(booking.booking_id)}
                                                        className="btn btn-outline btn-error btn-sm hover:bg-red-600 hover:text-white transition-all duration-200"
                                                    >
                                                        Cancel
                                                    </button>
                                                ) : booking.booking_status === 'Completed' ? (
                                                    <button 
                                                        onClick={() => handleRebook(booking)}
                                                        className="btn bg-blue-600 hover:bg-blue-700 text-white btn-sm border-0"
                                                    >
                                                        Rebook
                                                    </button>
                                                ) : booking.booking_status === 'Cancelled' ? (
                                                    <span className="text-xs text-red-500 flex items-center">
                                                        <XCircle size={12} className="mr-1" />
                                                        Cancelled
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-gray-500 flex items-center">
                                                        <Clock size={12} className="mr-1" />
                                                        In Progress
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Summary Section */}
                    <div className="bg-gray-50 border-t border-gray-200 p-4">
                        <div className="flex justify-between items-center">
                            <div className="text-sm text-gray-600">
                                Showing {bookings.length} booking{bookings.length !== 1 ? 's' : ''}
                            </div>
                            <div className="text-sm font-semibold text-gray-800">
                                Total Spent: ${bookings.reduce((sum, booking) => sum + booking.total_amount, 0)}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    )
}

export default BookingHistory