import React, {  useState, useCallback, useMemo } from 'react';
import AdminDashboardLayout from '../../components/Dashboard/admDashboardLayout';
import { 
    Calendar, 
    Trash2, 
    User, 
    Car, 
    DollarSign, 
    XCircle, 
    CheckCircle, 
    Clock, 
    MapPin, 
    Filter,
    Search,
    RefreshCw
} from 'lucide-react';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { useGetAllBookingsQuery, useUpdateBookingStatusMutation } from '../../API/BookingAPI';
import { skipToken } from '@reduxjs/toolkit/query';

// Create a display-friendly booking type
interface DisplayBooking {
    booking_id: string;
    booking_reference: string;
    customer_name: string;
    customer_email: string;
    vehicle_make: string;
    vehicle_model: string;
    vehicle_license_plate?: string;
    total_amount: number;
    daily_rate?: number;
    status: string;
    created_at: string;
    start_date: string;
    end_date: string;
    pickup_location?: string;
}

const AdminBookings: React.FC = () => {
    const { isAuthenticated, token } = useSelector((state: RootState) => state.auth);
    
    // State for filtering
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState<string>('');

    // RTK Query Hook to fetch all bookings
    const { 
        data: allBookings = [], 
        isLoading: bookingsIsLoading, 
        error,
        refetch 
    } = useGetAllBookingsQuery(
        isAuthenticated && token ? undefined : skipToken
    );

    // RTK mutation to update booking status
    const [updateBookingStatus, { isLoading: isUpdating }] = useUpdateBookingStatusMutation();

    // Memoized transformation function
    const displayBookings = useMemo(() => {
        if (!allBookings || allBookings.length === 0) {
            return [];
        }

        return allBookings.map((booking: any, index: number) => {
            // Extract data from the booking object
            const customerName = booking.user?.first_name && booking.user?.last_name 
                ? `${booking.user.first_name} ${booking.user.last_name}`
                : booking.user?.name 
                ? booking.user.name
                : booking.customer_name 
                ? booking.customer_name
                : `Customer ${index + 1}`;

            const customerEmail = booking.user?.email 
                ? booking.user.email
                : booking.customer_email 
                ? booking.customer_email
                : 'no-email@example.com';

            const vehicleMake = booking.vehicle?.vehicle_spec?.manufacturer 
                ? booking.vehicle.vehicle_spec.manufacturer
                : booking.vehicle_make 
                ? booking.vehicle_make
                : booking.vehicle?.manufacturer 
                ? booking.vehicle.manufacturer
                : 'Unknown';

            const vehicleModel = booking.vehicle?.vehicle_spec?.model 
                ? booking.vehicle.vehicle_spec.model
                : booking.vehicle_model 
                ? booking.vehicle_model
                : booking.vehicle?.model 
                ? booking.vehicle.model
                : 'Vehicle';

            return {
                booking_id: booking.booking_id?.toString() || booking.id?.toString() || `temp-${index}`,
                booking_reference: booking.booking_reference || `BOOK-${booking.booking_id || index}`,
                customer_name: customerName,
                customer_email: customerEmail,
                vehicle_make: vehicleMake,
                vehicle_model: vehicleModel,
                vehicle_license_plate: booking.vehicle?.license_plate || booking.vehicle_license_plate || 'N/A',
                total_amount: booking.total_amount || booking.total_cost || 0,
                daily_rate: booking.daily_rate || booking.rental_rate,
                status: (booking.booking_status || booking.status || 'pending').toLowerCase(),
                created_at: booking.created_at || new Date().toISOString(),
                start_date: booking.booking_date || booking.start_date || booking.created_at,
                end_date: booking.return_date || booking.end_date || booking.created_at,
                pickup_location: booking.location?.name || booking.pickup_location || 'Not specified'
            } as DisplayBooking;
        });
    }, [allBookings]);

    // FIXED: Filter bookings with proper dependencies
    const filteredBookings = useMemo(() => {
        if (!displayBookings || displayBookings.length === 0) {
            return [];
        }

        const lowerSearchTerm = searchTerm.toLowerCase();
        
        return displayBookings.filter((booking: DisplayBooking) => {
            // Apply status filter
            const statusMatch = statusFilter === 'all' || booking.status === statusFilter;
            
            // Apply search filter
            const searchMatch = searchTerm === '' || 
                booking.customer_name.toLowerCase().includes(lowerSearchTerm) ||
                booking.customer_email.toLowerCase().includes(lowerSearchTerm) ||
                booking.booking_reference.toLowerCase().includes(lowerSearchTerm) ||
                booking.vehicle_make.toLowerCase().includes(lowerSearchTerm) ||
                booking.vehicle_model.toLowerCase().includes(lowerSearchTerm) ||
                (booking.vehicle_license_plate?.toLowerCase().includes(lowerSearchTerm) || false);
            
            return statusMatch && searchMatch;
        });
    }, [displayBookings, statusFilter, searchTerm]); // FIXED: Proper dependencies

    // Format currency
    const formatCurrency = useCallback((amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
        }).format(amount);
    }, []);

    // Format date
    const formatDateTime = useCallback((dateString: string) => {
        try {
            return new Date(dateString).toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return 'Invalid Date';
        }
    }, []);

    // Format short date
    const formatShortDate = useCallback((dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        } catch {
            return 'Invalid Date';
        }
    }, []);

    // Calculate duration in days
    const calculateDuration = useCallback((startDate: string, endDate: string) => {
        try {
            const start = new Date(startDate);
            const end = new Date(endDate);
            const diffTime = Math.abs(end.getTime() - start.getTime());
            return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        } catch {
            return 0;
        }
    }, []);

    // Get status badge with proper styling
    const getStatusBadge = useCallback((status: string) => {
        const statusConfig: Record<string, { 
            color: string; 
            bgColor: string; 
            icon: React.ElementType;
            label: string 
        }> = {
            pending: { 
                color: 'text-yellow-800', 
                bgColor: 'bg-yellow-100', 
                icon: Clock, 
                label: 'Pending' 
            },
            confirmed: { 
                color: 'text-blue-800', 
                bgColor: 'bg-blue-100', 
                icon: CheckCircle, 
                label: 'Confirmed' 
            },
            active: { 
                color: 'text-purple-800', 
                bgColor: 'bg-purple-100', 
                icon: CheckCircle, 
                label: 'Active' 
            },
            completed: { 
                color: 'text-green-800', 
                bgColor: 'bg-green-100', 
                icon: CheckCircle, 
                label: 'Completed' 
            },
            cancelled: { 
                color: 'text-red-800', 
                bgColor: 'bg-red-100', 
                icon: XCircle, 
                label: 'Cancelled' 
            }
        };

        const config = statusConfig[status.toLowerCase() as keyof typeof statusConfig] || statusConfig.pending;
        const IconComponent = config.icon;

        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.color}`}>
                <IconComponent size={12} className="mr-1" />
                {config.label}
            </span>
        );
    }, []);

    // Handle status update
    const handleStatusUpdate = async (bookingId: string, currentStatus: string) => {
        const statusOptions = ['pending', 'confirmed', 'active', 'completed', 'cancelled'];
        const currentIndex = statusOptions.indexOf(currentStatus.toLowerCase());
        const nextStatuses = statusOptions.slice(currentIndex + 1);

        if (nextStatuses.length === 0) {
            Swal.fire({
                title: "Info",
                text: "This booking is already at the final status",
                icon: "info",
                confirmButtonColor: "#3b82f6",
            });
            return;
        }

        const { value: newStatus } = await Swal.fire({
            title: 'Update Booking Status',
            input: 'select',
            inputOptions: nextStatuses.reduce((acc, status) => {
                acc[status] = status.charAt(0).toUpperCase() + status.slice(1);
                return acc;
            }, {} as Record<string, string>),
            inputPlaceholder: 'Select new status',
            showCancelButton: true,
            confirmButtonText: 'Update',
            confirmButtonColor: '#10b981',
            cancelButtonColor: '#6b7280',
            inputValidator: (value) => {
                if (!value) {
                    return 'Please select a status';
                }
            }
        });

        if (newStatus) {
            try {
                const bookingIdNum = parseInt(bookingId);
                if (isNaN(bookingIdNum)) {
                    throw new Error('Invalid booking ID');
                }

                const res = await updateBookingStatus({ 
                    booking_id: bookingIdNum, 
                    status: newStatus 
                }).unwrap();
                
                Swal.fire({
                    title: "Success!",
                    text: res.message || "Booking status updated successfully",
                    icon: "success",
                    confirmButtonColor: "#10b981",
                });
                
                setTimeout(() => {
                    refetch();
                }, 1000);
            } catch (error: any) {
                Swal.fire({
                    title: "Error!",
                    text: error?.data?.message || error?.message || "Failed to update booking status",
                    icon: "error",
                    confirmButtonColor: "#ef4444",
                });
            }
        }
    };

    // Handle cancel booking
    const handleCancelBooking = async (bookingId: string, bookingRef: string) => {
        const { isConfirmed } = await Swal.fire({
            title: "Cancel Booking?",
            html: `<div class="text-left">
                <p class="mb-2">Are you sure you want to cancel booking <strong>#${bookingRef}</strong>?</p>
                <p class="text-sm text-gray-600">This action cannot be undone.</p>
            </div>`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Yes, Cancel it!",
            cancelButtonText: "No, keep it",
        });

        if (isConfirmed) {
            try {
                const bookingIdNum = parseInt(bookingId);
                if (isNaN(bookingIdNum)) {
                    throw new Error('Invalid booking ID');
                }

                await updateBookingStatus({ 
                    booking_id: bookingIdNum, 
                    status: 'cancelled' 
                }).unwrap();
                
                Swal.fire({
                    title: "Cancelled!",
                    text: "Booking has been cancelled successfully.",
                    icon: "success",
                    confirmButtonColor: "#10b981",
                });
                
                setTimeout(() => {
                    refetch();
                }, 1000);
            } catch (error: any) {
                Swal.fire({
                    title: "Error!",
                    text: error?.data?.message || "Something went wrong. Please try again.",
                    icon: "error",
                    confirmButtonColor: "#ef4444",
                });
            }
        }
    };

    // Stats calculations
    const stats = useMemo(() => {
        if (!displayBookings || displayBookings.length === 0) return null;
        
        const pending = displayBookings.filter((b) => b.status === 'pending').length;
        const active = displayBookings.filter((b) => b.status === 'active').length;
        const completed = displayBookings.filter((b) => b.status === 'completed').length;
        const cancelled = displayBookings.filter((b) => b.status === 'cancelled').length;
        const totalRevenue = displayBookings.reduce((sum, booking) => sum + booking.total_amount, 0);
        
        return { pending, active, completed, cancelled, totalRevenue };
    }, [displayBookings]);

    // Handle retry
    const handleRetry = () => {
        refetch();
    };

    // Clear filters
    const handleClearFilters = () => {
        setStatusFilter('all');
        setSearchTerm('');
    };

    // Check authentication
    if (!isAuthenticated || !token) {
        return (
            <AdminDashboardLayout>
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center max-w-md">
                        <XCircle className="mx-auto text-red-500 mb-4" size={48} />
                        <h3 className="text-xl font-semibold text-red-800 mb-2">Authentication Required</h3>
                        <p className="text-red-600 mb-6">
                            You need to be logged in to access this page.
                        </p>
                        <a 
                            href="/login" 
                            className="btn btn-primary px-6"
                        >
                            Go to Login
                        </a>
                    </div>
                </div>
            </AdminDashboardLayout>
        );
    }

    // For debugging - only show once
    if (filteredBookings.length > 0) {
        console.log(`Found ${filteredBookings.length} filtered bookings out of ${displayBookings.length} total`);
    }

    return (
        <AdminDashboardLayout>
            {/* Header */}
            <div className="mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-green-100 rounded-xl">
                            <Calendar className="text-green-600" size={28} />
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Booking Management</h1>
                            <p className="text-gray-600 text-sm mt-1">
                                Manage and track all vehicle bookings
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleRetry}
                            className="btn btn-outline btn-sm flex items-center gap-2"
                            disabled={bookingsIsLoading}
                        >
                            <RefreshCw size={16} className={bookingsIsLoading ? 'animate-spin' : ''} />
                            Refresh
                        </button>
                        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                            {filteredBookings.length} of {displayBookings.length} bookings
                        </span>
                    </div>
                </div>

                {/* Stats Cards */}
                {stats && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-6">
                        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 font-medium">Pending</p>
                                    <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                                </div>
                                <div className="p-2 bg-yellow-100 rounded-lg">
                                    <Clock className="text-yellow-500" size={20} />
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 font-medium">Active</p>
                                    <p className="text-2xl font-bold text-purple-600">{stats.active}</p>
                                </div>
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <CheckCircle className="text-purple-500" size={20} />
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 font-medium">Completed</p>
                                    <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                                </div>
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <CheckCircle className="text-green-500" size={20} />
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 font-medium">Cancelled</p>
                                    <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
                                </div>
                                <div className="p-2 bg-red-100 rounded-lg">
                                    <XCircle className="text-red-500" size={20} />
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 font-medium">Total Revenue</p>
                                    <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalRevenue)}</p>
                                </div>
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <DollarSign className="text-green-500" size={20} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Filters */}
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm mb-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <Filter size={20} className="text-gray-600" />
                        <span className="font-semibold text-gray-700">Filters</span>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Search Bookings</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search by customer, vehicle, or reference..."
                                    className="input input-bordered w-full pl-10"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status Filter</label>
                            <select 
                                className="select select-bordered w-full sm:w-48"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="all">All Statuses</option>
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="active">Active</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                        
                        {(searchTerm || statusFilter !== 'all') && (
                            <div className="flex items-end">
                                <button
                                    onClick={handleClearFilters}
                                    className="btn btn-ghost btn-sm text-gray-600 hover:text-gray-800"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Loading State */}
            {bookingsIsLoading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-200">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-green-200 rounded-full"></div>
                        <div className="w-16 h-16 border-4 border-green-500 rounded-full animate-spin absolute top-0 left-0 border-t-transparent"></div>
                    </div>
                    <span className="text-gray-600 mt-4 text-lg">Loading bookings...</span>
                    <span className="text-gray-400 text-sm mt-1">Please wait a moment</span>
                </div>
            ) : error ? (
                <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <XCircle className="text-red-500" size={40} />
                    </div>
                    <h3 className="text-xl font-semibold text-red-800 mb-2">Error Loading Bookings</h3>
                    <p className="text-red-600 mb-6 max-w-md mx-auto">
                        {error.status === 404 
                            ? "Bookings endpoint not found. Trying to access: /api/bookings"
                            : error.status === 401
                            ? "Authentication failed. Please log in again."
                            : "Unable to fetch bookings. Please check your connection and try again."}
                    </p>
                    <div className="flex gap-3 justify-center">
                        <button 
                            onClick={handleRetry}
                            className="btn btn-outline btn-error px-6"
                        >
                            Try Again
                        </button>
                        {error.status === 401 && (
                            <a 
                                href="/login" 
                                className="btn btn-primary px-6"
                            >
                                Go to Login
                            </a>
                        )}
                    </div>
                </div>
            ) : !filteredBookings || filteredBookings.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-200">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Calendar className="text-gray-400" size={40} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No Bookings Found</h3>
                    <p className="text-gray-500 mb-6 max-w-md mx-auto">
                        {displayBookings.length === 0 
                            ? "No bookings have been placed yet. Check back later for new bookings." 
                            : "No bookings match your search criteria. Try adjusting your filters."}
                    </p>
                    {searchTerm || statusFilter !== 'all' ? (
                        <button 
                            onClick={handleClearFilters}
                            className="btn btn-primary px-8"
                        >
                            Clear Filters
                        </button>
                    ) : null}
                </div>
            ) : (
                /* Bookings Table */
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="font-semibold text-gray-700 py-4 px-4">Booking ID</th>
                                    <th className="font-semibold text-gray-700 py-4 px-4">Customer</th>
                                    <th className="font-semibold text-gray-700 py-4 px-4">Vehicle</th>
                                    <th className="font-semibold text-gray-700 py-4 px-4">Period</th>
                                    <th className="font-semibold text-gray-700 py-4 px-4">Amount</th>
                                    <th className="font-semibold text-gray-700 py-4 px-4">Status</th>
                                    <th className="font-semibold text-gray-700 py-4 px-4">Date</th>
                                    <th className="font-semibold text-gray-700 py-4 px-4 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBookings.map((booking: DisplayBooking) => (
                                    <tr key={booking.booking_id} className="hover:bg-gray-50 border-b border-gray-100">
                                        <td className="py-4 px-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-gray-800">#{booking.booking_reference}</span>
                                                <span className="text-xs text-gray-500 mt-1">
                                                    ID: {booking.booking_id}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div>
                                                <div className="font-semibold text-gray-800 flex items-center gap-2 mb-1">
                                                    <User size={16} className="text-gray-500" />
                                                    {booking.customer_name}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {booking.customer_email}
                                                </div>
                                                {booking.pickup_location && (
                                                    <div className="text-xs text-gray-400 flex items-center gap-1 mt-2">
                                                        <MapPin size={12} />
                                                        {booking.pickup_location}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex-shrink-0">
                                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                                        <Car className="text-blue-600" size={20} />
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-gray-800">
                                                        {booking.vehicle_make} {booking.vehicle_model}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {booking.vehicle_license_plate}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="text-sm text-gray-600 font-medium mb-1">
                                                {calculateDuration(booking.start_date, booking.end_date)} days
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {formatShortDate(booking.start_date)} → {formatShortDate(booking.end_date)}
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="font-bold text-green-600 text-lg">
                                                {formatCurrency(booking.total_amount)}
                                            </div>
                                            {booking.daily_rate && (
                                                <div className="text-xs text-gray-500">
                                                    {formatCurrency(booking.daily_rate)}/day
                                                </div>
                                            )}
                                        </td>
                                        <td className="py-4 px-4">
                                            {getStatusBadge(booking.status)}
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="text-sm text-gray-600">
                                                {formatDateTime(booking.created_at)}
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleStatusUpdate(booking.booking_id, booking.status)}
                                                    className="btn btn-outline btn-success btn-sm min-w-[120px]"
                                                    disabled={isUpdating}
                                                >
                                                    {isUpdating ? (
                                                        <span className="loading loading-spinner loading-xs"></span>
                                                    ) : (
                                                        'Update Status'
                                                    )}
                                                </button>
                                                {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                                                    <button
                                                        onClick={() => handleCancelBooking(booking.booking_id, booking.booking_reference)}
                                                        className="btn btn-ghost btn-sm text-red-600 hover:bg-red-50 hover:text-red-700"
                                                        title="Cancel Booking"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </AdminDashboardLayout>
    );
};

export default AdminBookings;