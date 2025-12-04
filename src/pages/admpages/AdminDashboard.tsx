import React from 'react';
import AdminDashboardLayout from '../../components/Dashboard/admDashboardLayout';
import { Car, DollarSign, Calendar, Users, XCircle, TrendingUp, Shield } from 'lucide-react';
import { dashboardDataApi } from '../../API/dashboardDataApi';
import { bookingApi } from '../../API/BookingAPI';
import type { RootState } from '../../store/store';
import { useSelector } from 'react-redux';
import { skipToken } from '@reduxjs/toolkit/query';

// Define proper TypeScript interfaces
interface AdminDashboardStats {
  totalBookings: number;
  totalRevenue: number;
  totalUsers: number;
  activeVehicles: number;
  revenueChange?: number;
  bookingChange?: number;
  userChange?: number;
}

interface RecentBooking {
  booking_id: string;
  booking_reference: string;
  customer_name: string;
  customer_email: string;
  vehicle_name: string;
  vehicle_type: string;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'active' | 'cancelled' | 'completed';
  created_at: string;
}

const AdminDashboard: React.FC = () => {
    const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

    // Dashboard data query
    const { 
        data: dashboardData, 
        isLoading: dataIsLoading, 
        error: dataError 
    } = dashboardDataApi.useGetAdminDashboardDataQuery(
        isAuthenticated ? undefined : skipToken
    );

    // Recent bookings query
    const { 
        data: recentBookingsData, 
        isLoading: bookingsDataIsLoading, 
        error: bookingsDataError 
    } = bookingApi.useGetAllBookingsQuery(
        isAuthenticated ? undefined : skipToken
    );

    // Format date
    const formatDateTime = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return 'Invalid Date';
        }
    };

    // Get status color - FIXED with safe access
    const getStatusColor = (status: string | undefined) => {
        if (!status) return 'badge-neutral';
        
        const normalizedStatus = status.toLowerCase();
        switch (normalizedStatus) {
            case 'pending': return 'badge-warning';
            case 'confirmed': return 'badge-info';
            case 'active': return 'badge-primary';
            case 'cancelled': return 'badge-error';
            case 'completed': return 'badge-success';
            default: return 'badge-neutral';
        }
    };

    // Format status text - NEW helper function
    const formatStatusText = (status: string | undefined) => {
        if (!status) return 'Unknown';
        return status.charAt(0).toUpperCase() + status.slice(1);
    };

    // Transform booking data safely
    const transformBookingData = (booking: any): RecentBooking => {
        const status = (booking.status || booking.booking_status || 'pending').toLowerCase();
        
        return {
            booking_id: booking.booking_id || booking.id || '',
            booking_reference: booking.booking_reference || booking.reference || '',
            customer_name: booking.customer_name || booking.customerName || 'Unknown Customer',
            customer_email: booking.customer_email || booking.customerEmail || '',
            vehicle_name: booking.vehicle_name || booking.vehicleName || 'Unknown Vehicle',
            vehicle_type: booking.vehicle_type || booking.vehicleType || 'Unknown Type',
            total_amount: booking.total_amount || booking.totalAmount || 0,
            status: status as any,
            created_at: booking.created_at || booking.createdAt || new Date().toISOString()
        };
    };

    // Get recent bookings (limit to 5)
    const recentBookings = React.useMemo(() => {
        if (!recentBookingsData || !Array.isArray(recentBookingsData)) {
            return [];
        }
        
        return recentBookingsData
            .slice(0, 5)
            .map(transformBookingData);
    }, [recentBookingsData]);

    // Quick Actions
    const quickActions = [
        {
            title: 'Add Vehicle',
            description: 'Add new vehicle to fleet',
            icon: Car,
            color: 'bg-blue-600 hover:bg-blue-700',
            href: '/admin/vehicles/add'
        },
        {
            title: 'Manage Users',
            description: 'View and manage users',
            icon: Users,
            color: 'bg-green-600 hover:bg-green-700',
            href: '/admin/users'
        },
        {
            title: 'View Reports',
            description: 'Analytics and insights',
            icon: TrendingUp,
            color: 'bg-purple-600 hover:bg-purple-700',
            href: '/admin/analytics'
        },
        {
            title: 'System Settings',
            description: 'Platform configuration',
            icon: Shield,
            color: 'bg-orange-600 hover:bg-orange-700',
            href: '/admin/settings'
        }
    ];

    return (
        <AdminDashboardLayout>
            {/* Dashboard Header */}
            <div className="mb-8 bg-green-700 p-4 rounded-lg">
                <h1 className="text-3xl font-bold text-white">VehicleRent Admin Dashboard</h1>
                <p className="text-green-200 mt-2">Welcome to VehicleRent Admin Management Dashboard</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {dataIsLoading ? (
                    <div className="col-span-4 flex justify-center items-center py-16">
                        <span className="loading loading-spinner loading-lg text-green-600"></span>
                    </div>
                ) : dataError ? (
                    <div className="col-span-4 flex flex-col justify-center items-center py-16">
                        <XCircle className="mx-auto text-red-500 mb-3" size={48} />
                        <p className="text-red-600">Error loading dashboard data. Please try again later.</p>
                    </div>
                ) : (
                    <>
                        {/* Total Bookings */}
                        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                            <div className="flex items-center">
                                <div className="flex-1">
                                    <p className="text-gray-600 text-sm font-medium">Total Bookings</p>
                                    <p className="text-2xl font-bold text-gray-900">{dashboardData?.totalBookings || 0}</p>
                                </div>
                                <div className="bg-blue-100 rounded-full p-3">
                                    <Calendar className="text-blue-600" size={24} />
                                </div>
                            </div>
                        </div>

                        {/* Total Revenue */}
                        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
                            <div className="flex items-center">
                                <div className="flex-1">
                                    <p className="text-gray-600 text-sm font-medium">Total Revenue</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        ${(dashboardData?.totalRevenue || 0).toLocaleString()}
                                    </p>
                                </div>
                                <div className="bg-green-100 rounded-full p-3">
                                    <DollarSign className="text-green-600" size={24} />
                                </div>
                            </div>
                        </div>

                        {/* Total Users */}
                        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
                            <div className="flex items-center">
                                <div className="flex-1">
                                    <p className="text-gray-600 text-sm font-medium">Total Users</p>
                                    <p className="text-2xl font-bold text-gray-900">{dashboardData?.totalUsers || 0}</p>
                                </div>
                                <div className="bg-purple-100 rounded-full p-3">
                                    <Users className="text-purple-600" size={24} />
                                </div>
                            </div>
                        </div>

                        {/* Active Vehicles */}
                        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
                            <div className="flex items-center">
                                <div className="flex-1">
                                    <p className="text-gray-600 text-sm font-medium">Active Vehicles</p>
                                    <p className="text-2xl font-bold text-gray-900">{dashboardData?.activeVehicles || 0}</p>
                                </div>
                                <div className="bg-orange-100 rounded-full p-3">
                                    <Car className="text-orange-600" size={24} />
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Bookings Section */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-gray-900">Recent Bookings</h2>
                        <button className="btn btn-sm bg-green-800 hover:bg-green-900 text-white border-none">
                            View All
                        </button>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                                <tr>
                                    <th className="text-gray-600">Customer</th>
                                    <th className="text-gray-600">Vehicle</th>
                                    <th className="text-gray-600">Amount</th>
                                    <th className="text-gray-600">Status</th>
                                    <th className="text-gray-600">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookingsDataIsLoading ? (
                                    <tr>
                                        <td colSpan={5} className="text-center text-gray-500">
                                            <span className="loading loading-spinner loading-sm"></span>
                                            Loading...
                                        </td>
                                    </tr>
                                ) : bookingsDataError ? (
                                    <tr>
                                        <td colSpan={5} className="text-center">
                                            <XCircle className="mx-auto text-red-500 mb-2" size={32} />
                                            <p className="text-red-600">Error loading bookings. Please try again later.</p>
                                        </td>
                                    </tr>
                                ) : recentBookings.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="text-center text-gray-500">
                                            <Calendar className="mx-auto text-gray-400 mb-2" size={32} />
                                            No recent bookings found.
                                        </td>
                                    </tr>
                                ) : (
                                    recentBookings.map((booking: RecentBooking) => (
                                        <tr key={booking.booking_id} className="hover:bg-gray-50">
                                            <td>
                                                <div>
                                                    <div className="font-medium text-gray-900">
                                                        {booking.customer_name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {booking.customer_email}
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="font-medium text-gray-900">
                                                    {booking.vehicle_name}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {booking.vehicle_type}
                                                </div>
                                            </td>
                                            <td className="font-semibold text-green-700">
                                                ${booking.total_amount.toLocaleString()}
                                            </td>
                                            <td>
                                                <span className={`badge ${getStatusColor(booking.status)} text-white`}>
                                                    {formatStatusText(booking.status)}
                                                </span>
                                            </td>
                                            <td className="text-gray-500 text-sm">
                                                {formatDateTime(booking.created_at)}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {quickActions.map((action, index) => {
                            const IconComponent = action.icon;
                            return (
                                <a
                                    key={index}
                                    href={action.href}
                                    className={`btn ${action.color} text-white border-none flex flex-col items-center p-6 h-auto`}
                                >
                                    <IconComponent className="w-8 h-8 mb-2" />
                                    {action.title}
                                </a>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Performance Metrics */}
            <div className="mt-8 bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Performance Metrics</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-blue-700">
                            {dashboardData?.revenueChange ? `${dashboardData.revenueChange}%` : 'N/A'}
                        </div>
                        <div className="text-sm text-blue-600 mt-1">Revenue Growth</div>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-green-700">
                            {dashboardData?.bookingChange ? `${dashboardData.bookingChange}%` : 'N/A'}
                        </div>
                        <div className="text-sm text-green-600 mt-1">Booking Growth</div>
                    </div>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-purple-700">
                            {dashboardData?.userChange ? `${dashboardData.userChange}%` : 'N/A'}
                        </div>
                        <div className="text-sm text-purple-600 mt-1">User Growth</div>
                    </div>
                </div>
            </div>
        </AdminDashboardLayout>
    );
};

export default AdminDashboard;