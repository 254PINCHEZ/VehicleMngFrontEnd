import React from 'react';
import { Link } from 'react-router-dom';
import AdminDashboardLayout from '../../components/Dashboard/admDashboardLayout';
import { 
  Car, 
  DollarSign, 
  Calendar, 
  Users, 
  Loader2,
  ArrowUpRight,
  CheckCircle2,
  BarChart3,
  Settings,
  Eye,
  TrendingUp as TrendingUpIcon
} from 'lucide-react';
import { dashboardDataApi } from '../../API/dashboardDataApi';
import { bookingApi } from '../../API/BookingAPI';
import type { RootState } from '../../store/store';
import { useSelector } from 'react-redux';
import { skipToken } from '@reduxjs/toolkit/query';

interface DashboardStats {
  totalBookings: number;
  totalRevenue: number;
  totalUsers: number;
  activeVehicles: number;
  revenueChange: number;
  bookingChange: number;
  userChange: number;
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

    // Dashboard data query with simplified error handling
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
        isLoading: bookingsDataIsLoading
    } = bookingApi.useGetAllBookingsQuery(
        isAuthenticated ? undefined : skipToken
    );

    // Default stats if API fails
    const defaultStats: DashboardStats = {
        totalBookings: 0,
        totalRevenue: 0,
        totalUsers: 0,
        activeVehicles: 0,
        revenueChange: 0,
        bookingChange: 0,
        userChange: 0
    };

    // Use API data or fallback to defaults
    const stats: DashboardStats = dashboardData ? {
        totalBookings: dashboardData.totalBookings || 0,
        totalRevenue: dashboardData.totalRevenue || 0,
        totalUsers: dashboardData.totalUsers || 0,
        activeVehicles: dashboardData.activeVehicles || 0,
        revenueChange: dashboardData.revenueChange || 0,
        bookingChange: dashboardData.bookingChange || 0,
        userChange: dashboardData.userChange || 0
    } : defaultStats;

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

    // Get status color and styling
    const getStatusStyles = (status: string | undefined) => {
        if (!status) return {
            bg: 'bg-slate-100',
            text: 'text-slate-800',
            border: 'border-slate-200',
            icon: '🔄'
        };
        
        const normalizedStatus = status.toLowerCase();
        switch (normalizedStatus) {
            case 'pending':
                return {
                    bg: 'bg-amber-500/10',
                    text: 'text-amber-700',
                    border: 'border-amber-500/20',
                    icon: '⏳'
                };
            case 'confirmed':
                return {
                    bg: 'bg-blue-500/10',
                    text: 'text-blue-700',
                    border: 'border-blue-500/20',
                    icon: '✅'
                };
            case 'active':
                return {
                    bg: 'bg-emerald-500/10',
                    text: 'text-emerald-700',
                    border: 'border-emerald-500/20',
                    icon: '🚗'
                };
            case 'cancelled':
                return {
                    bg: 'bg-red-500/10',
                    text: 'text-red-700',
                    border: 'border-red-500/20',
                    icon: '❌'
                };
            case 'completed':
                return {
                    bg: 'bg-green-500/10',
                    text: 'text-green-700',
                    border: 'border-green-500/20',
                    icon: '🏁'
                };
            default:
                return {
                    bg: 'bg-slate-100',
                    text: 'text-slate-800',
                    border: 'border-slate-200',
                    icon: '🔄'
                };
        }
    };

    // Format status text
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
            gradient: 'from-blue-600 to-indigo-600',
            hoverGradient: 'from-blue-700 to-indigo-700',
            href: '/admin/vehicles/add'
        },
        {
            title: 'Manage Users',
            description: 'View and manage users',
            icon: Users,
            gradient: 'from-emerald-600 to-teal-600',
            hoverGradient: 'from-emerald-700 to-teal-700',
            href: '/admin/users'
        },
        {
            title: 'View Reports',
            description: 'Analytics and insights',
            icon: BarChart3,
            gradient: 'from-purple-600 to-violet-600',
            hoverGradient: 'from-purple-700 to-violet-700',
            href: '/admin/analytics'
        },
        {
            title: 'System Settings',
            description: 'Platform configuration',
            icon: Settings,
            gradient: 'from-orange-600 to-amber-600',
            hoverGradient: 'from-orange-700 to-amber-700',
            href: '/admin/settings'
        }
    ];

    return (
        <AdminDashboardLayout>
            {/* Dashboard Header - Professional Gradient */}
            <div className="mb-8 bg-gradient-to-r from-slate-800 via-slate-800 to-slate-900 p-6 rounded-2xl border border-slate-700/50 shadow-xl">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-300 bg-clip-text text-transparent">
                            Dashboard Overview
                        </h1>
                        <p className="text-slate-400 mt-2 flex items-center">
                            <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-400" />
                            Welcome back, {user?.first_name}. Real-time system monitoring active.
                        </p>
                    </div>
                    <div className="hidden md:flex items-center space-x-2 px-4 py-2 bg-slate-800/50 rounded-xl border border-slate-700/50">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        <span className="text-sm text-slate-300">Live Data</span>
                    </div>
                </div>
            </div>

            {/* Stats Cards - Always show, even if loading or error */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {dataIsLoading ? (
                    <>
                        {/* Loading Skeletons */}
                        {[...Array(4)].map((_, index) => (
                            <div key={index} className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700/50 animate-pulse">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div className="h-4 w-24 bg-slate-700 rounded mb-2"></div>
                                        <div className="h-8 w-20 bg-slate-700 rounded mb-3"></div>
                                        <div className="h-6 w-20 bg-slate-700 rounded"></div>
                                    </div>
                                    <div className="p-3 rounded-xl bg-slate-700/50">
                                        <div className="w-6 h-6 bg-slate-700 rounded"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </>
                ) : (
                    <>
                        {/* Total Bookings */}
                        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-blue-500/30">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-400 mb-2">Total Bookings</p>
                                    <p className="text-3xl font-bold text-white">
                                        {stats.totalBookings.toLocaleString()}
                                    </p>
                                    <div className="flex items-center mt-3">
                                        <div className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs border border-blue-500/20">
                                            <Calendar className="w-3 h-3 inline mr-1" />
                                            Active
                                        </div>
                                    </div>
                                </div>
                                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                                    <Calendar className="w-6 h-6 text-blue-400" />
                                </div>
                            </div>
                        </div>

                        {/* Total Revenue */}
                        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-emerald-500/30">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-400 mb-2">Total Revenue</p>
                                    <p className="text-3xl font-bold text-white">
                                        ${stats.totalRevenue.toLocaleString()}
                                    </p>
                                    <div className="flex items-center mt-3">
                                        {stats.revenueChange > 0 ? (
                                            <div className="flex items-center px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs border border-emerald-500/20">
                                                <TrendingUpIcon className="w-3 h-3 mr-1" />
                                                +{stats.revenueChange}%
                                            </div>
                                        ) : (
                                            <div className="flex items-center px-3 py-1 rounded-full bg-slate-700/50 text-slate-400 text-xs border border-slate-600/50">
                                                <BarChart3 className="w-3 h-3 mr-1" />
                                                No change
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                                    <DollarSign className="w-6 h-6 text-emerald-400" />
                                </div>
                            </div>
                        </div>

                        {/* Total Users */}
                        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-purple-500/30">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-400 mb-2">Total Users</p>
                                    <p className="text-3xl font-bold text-white">
                                        {stats.totalUsers.toLocaleString()}
                                    </p>
                                    <div className="flex items-center mt-3">
                                        {stats.userChange > 0 ? (
                                            <div className="flex items-center px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs border border-purple-500/20">
                                                <Users className="w-3 h-3 mr-1" />
                                                +{stats.userChange}%
                                            </div>
                                        ) : (
                                            <div className="flex items-center px-3 py-1 rounded-full bg-slate-700/50 text-slate-400 text-xs border border-slate-600/50">
                                                <Users className="w-3 h-3 mr-1" />
                                                0% change
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                                    <Users className="w-6 h-6 text-purple-400" />
                                </div>
                            </div>
                        </div>

                        {/* Active Vehicles */}
                        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-amber-500/30">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-400 mb-2">Active Vehicles</p>
                                    <p className="text-3xl font-bold text-white">
                                        {stats.activeVehicles.toLocaleString()}
                                    </p>
                                    <div className="flex items-center mt-3">
                                        <div className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs border border-amber-500/20">
                                            <Car className="w-3 h-3 inline mr-1" />
                                            Available
                                        </div>
                                    </div>
                                </div>
                                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                                    <Car className="w-6 h-6 text-amber-400" />
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Bookings Section */}
                <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl shadow-xl border border-slate-700/50 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-semibold text-white">Recent Bookings</h2>
                            <p className="text-sm text-slate-400 mt-1">Latest customer reservations</p>
                        </div>
                        <Link 
                            to="/admin/bookings"
                            className="flex items-center px-4 py-2 rounded-xl bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white transition-all duration-300 border border-slate-600/50"
                        >
                            <Eye className="w-4 h-4 mr-2" />
                            View All
                        </Link>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-700/50">
                                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Customer</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Vehicle</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Amount</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Status</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookingsDataIsLoading ? (
                                    <tr>
                                        <td colSpan={5} className="text-center py-12">
                                            <div className="flex flex-col items-center justify-center">
                                                <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
                                                <p className="text-slate-400">Loading bookings...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : recentBookings.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="text-center py-12">
                                            <div className="flex flex-col items-center justify-center">
                                                <Calendar className="mx-auto text-slate-500 mb-4" size={40} />
                                                <p className="text-slate-400">No recent bookings found.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    recentBookings.map((booking: RecentBooking, index) => {
                                        const statusStyles = getStatusStyles(booking.status);
                                        return (
                                            <tr 
                                                key={booking.booking_id} 
                                                className={`border-b border-slate-700/30 hover:bg-slate-800/50 transition-colors duration-200 ${
                                                    index === recentBookings.length - 1 ? 'border-b-0' : ''
                                                }`}
                                            >
                                                <td className="py-4 px-4">
                                                    <div>
                                                        <div className="font-medium text-white">
                                                            {booking.customer_name}
                                                        </div>
                                                        <div className="text-sm text-slate-400 truncate max-w-[150px]">
                                                            {booking.customer_email}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="font-medium text-white">
                                                        {booking.vehicle_name}
                                                    </div>
                                                    <div className="text-sm text-slate-400">
                                                        {booking.vehicle_type}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="font-semibold text-emerald-400">
                                                        ${booking.total_amount.toLocaleString()}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusStyles.bg} ${statusStyles.text} border ${statusStyles.border}`}>
                                                        <span className="mr-1.5">{statusStyles.icon}</span>
                                                        {formatStatusText(booking.status)}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="text-sm text-slate-400">
                                                        {formatDateTime(booking.created_at)}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl shadow-xl border border-slate-700/50 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-semibold text-white">Quick Actions</h2>
                            <p className="text-sm text-slate-400 mt-1">Frequently used operations</p>
                        </div>
                        <div className="px-3 py-1.5 rounded-lg bg-slate-700/50 text-slate-300 text-xs border border-slate-600/50">
                            4 Actions
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {quickActions.map((action, index) => {
                            const IconComponent = action.icon;
                            return (
                                <Link
                                    key={index}
                                    to={action.href}
                                    className={`group bg-gradient-to-br ${action.gradient} rounded-xl p-5 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] border border-slate-700/50`}
                                >
                                    <div className="flex flex-col items-center text-center">
                                        <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm mb-3 group-hover:bg-white/20 transition-colors">
                                            <IconComponent className="w-6 h-6 text-white" />
                                        </div>
                                        <h3 className="font-semibold text-white mb-1">{action.title}</h3>
                                        <p className="text-sm text-white/70">{action.description}</p>
                                        <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <ArrowUpRight className="w-4 h-4 text-white/50" />
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Performance Metrics */}
            <div className="mt-8 bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl shadow-xl border border-slate-700/50 p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-semibold text-white">Performance Metrics</h2>
                        <p className="text-sm text-slate-400 mt-1">Growth and performance indicators</p>
                    </div>
                    <div className="px-3 py-1.5 rounded-lg bg-slate-700/50 text-slate-300 text-xs border border-slate-600/50">
                        Last 30 Days
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-blue-900/20 to-blue-900/5 rounded-xl p-6 border border-blue-800/30 hover:border-blue-700/50 transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-medium text-slate-400">Revenue Growth</h3>
                            {stats.revenueChange > 0 ? (
                                <div className="flex items-center text-emerald-400 text-xs">
                                    <TrendingUpIcon className="w-4 h-4 mr-1" />
                                    Positive
                                </div>
                            ) : (
                                <div className="flex items-center text-slate-400 text-xs">
                                    <BarChart3 className="w-4 h-4 mr-1" />
                                    Monitoring
                                </div>
                            )}
                        </div>
                        <div className="text-3xl font-bold text-white mb-2">
                            {stats.revenueChange ? `${stats.revenueChange}%` : '0%'}
                        </div>
                        <div className="text-sm text-slate-400">Month-over-month change</div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-emerald-900/20 to-emerald-900/5 rounded-xl p-6 border border-emerald-800/30 hover:border-emerald-700/50 transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-medium text-slate-400">Booking Growth</h3>
                            {stats.bookingChange > 0 ? (
                                <div className="flex items-center text-emerald-400 text-xs">
                                    <TrendingUpIcon className="w-4 h-4 mr-1" />
                                    Positive
                                </div>
                            ) : (
                                <div className="flex items-center text-slate-400 text-xs">
                                    <BarChart3 className="w-4 h-4 mr-1" />
                                    Monitoring
                                </div>
                            )}
                        </div>
                        <div className="text-3xl font-bold text-white mb-2">
                            {stats.bookingChange ? `${stats.bookingChange}%` : '0%'}
                        </div>
                        <div className="text-sm text-slate-400">New bookings growth</div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-purple-900/20 to-purple-900/5 rounded-xl p-6 border border-purple-800/30 hover:border-purple-700/50 transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-medium text-slate-400">User Growth</h3>
                            {stats.userChange > 0 ? (
                                <div className="flex items-center text-emerald-400 text-xs">
                                    <TrendingUpIcon className="w-4 h-4 mr-1" />
                                    Positive
                                </div>
                            ) : (
                                <div className="flex items-center text-slate-400 text-xs">
                                    <BarChart3 className="w-4 h-4 mr-1" />
                                    Monitoring
                                </div>
                            )}
                        </div>
                        <div className="text-3xl font-bold text-white mb-2">
                            {stats.userChange ? `${stats.userChange}%` : '0%'}
                        </div>
                        <div className="text-sm text-slate-400">New user registrations</div>
                    </div>
                </div>
            </div>
        </AdminDashboardLayout>
    );
};

export default AdminDashboard;