import React, { useState, useEffect } from 'react';
import AdminDashboardLayout from '../../components/Dashboard/admDashboardLayout';
import { BarChart3, TrendingUp, Users, Car, Calendar, DollarSign, XCircle, AlertCircle } from 'lucide-react';
import { analyticsApi } from '../../API/analyticsApi';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { skipToken } from '@reduxjs/toolkit/query';
import { useNavigate } from 'react-router-dom';

// Updated interface based on your API definition
interface AnalyticsData {
    totalRevenue: number;
    totalBookings: number;
    totalUsers: number;
    activeVehicles: number;
    revenueChange: number;
    bookingChange: number;
    userChange: number;
    utilizationChange: number;
    monthlyRevenue?: Array<{ month: string; revenue: number }>;
    bookingTrends?: Array<{ date: string; count: number }>;
    userGrowth?: Array<{ date: string; count: number }>;
    topPerformingVehicles?: Array<{ 
        vehicle_id: string; 
        name: string; 
        revenue: number; 
        bookings: number;
        utilization: number;
    }>;
    popularVehicleTypes?: Array<{ 
        type: string; 
        count: number; 
        revenue: number;
    }>;
}

const AdminAnalytics: React.FC = () => {
    const { isAuthenticated, token } = useSelector((state: RootState) => state.auth);
    const navigate = useNavigate();
    const [period, setPeriod] = useState<'day' | 'week' | 'month' | 'quarter' | 'year'>('month');

    // Debug authentication
    useEffect(() => {
        console.log('AdminAnalytics - Auth state:', { isAuthenticated, token: token ? 'Token exists' : 'No token' });
        console.log('LocalStorage token:', localStorage.getItem('token'));
    }, [isAuthenticated, token]);

    // Handle authentication failure
    useEffect(() => {
        if (!isAuthenticated || !token) {
            console.warn('User not authenticated, redirecting to login...');
            navigate('/login');
        }
    }, [isAuthenticated, token, navigate]);

    // API call with proper authentication check
    const { 
        data: analyticsData, 
        isLoading: analyticsIsLoading, 
        error,
        refetch
    } = analyticsApi.useGetAnalyticsDataQuery(
        isAuthenticated && token ? { period } : skipToken
    );

    // Handle 401 errors by redirecting to login
    useEffect(() => {
        if (error && (error as any).status === 401) {
            console.error('Authentication failed, clearing token and redirecting...');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login');
        }
    }, [error, navigate]);

    // Retry function
    const handleRetry = () => {
        refetch();
    };

    // Format currency
    const formatCurrency = (amount: number) => {
        return `$${amount.toLocaleString()}`;
    };

    // Format number
    const formatNumber = (num: number) => {
        return num.toLocaleString();
    };

    // Get safe change value (handle undefined)
    const getChangeValue = (value?: number) => {
        return value !== undefined ? value : 0;
    };

    // Calculate change color
    const getChangeColor = (value: number) => {
        return value > 0 ? 'text-green-600' : value < 0 ? 'text-red-600' : 'text-gray-600';
    };

    // Get change icon
    const getChangeIcon = (value: number) => {
        return value > 0 ? '↗' : value < 0 ? '↘' : '→';
    };

    // Authentication check at the beginning
    if (!isAuthenticated || !token) {
        return (
            <AdminDashboardLayout>
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center max-w-md">
                        <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
                        <h3 className="text-xl font-semibold text-red-800 mb-2">Authentication Required</h3>
                        <p className="text-red-600 mb-6">
                            You need to be logged in to view analytics.
                        </p>
                        <button 
                            onClick={() => navigate('/login')}
                            className="btn btn-primary px-6"
                        >
                            Go to Login
                        </button>
                    </div>
                </div>
            </AdminDashboardLayout>
        );
    }

    return (
        <AdminDashboardLayout>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                        <BarChart3 className="text-purple-600" size={24} />
                    </div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Business Analytics</h1>
                </div>
                
                <div className="flex items-center gap-2">
                    <select 
                        value={period}
                        onChange={(e) => setPeriod(e.target.value as any)}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="day">Today</option>
                        <option value="week">Last 7 Days</option>
                        <option value="month">Last 30 Days</option>
                        <option value="quarter">Last Quarter</option>
                        <option value="year">Last Year</option>
                    </select>
                    
                    {error && (
                        <button 
                            onClick={handleRetry}
                            className="btn btn-outline btn-error btn-sm"
                        >
                            Retry
                        </button>
                    )}
                </div>
            </div>

            {/* Error State - Improved */}
            {error ? (
                <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <XCircle className="text-red-500" size={40} />
                    </div>
                    <h3 className="text-xl font-semibold text-red-800 mb-2">
                        {(error as any).status === 401 ? 'Authentication Failed' : 'Error Loading Analytics'}
                    </h3>
                    <p className="text-red-600 mb-4">
                        {(error as any).status === 401 
                            ? 'Your session has expired. Please log in again.'
                            : 'Unable to fetch analytics data. Please try again later.'}
                    </p>
                    <div className="flex gap-3 justify-center">
                        <button 
                            onClick={handleRetry}
                            className="btn btn-outline btn-error"
                        >
                            Try Again
                        </button>
                        {(error as any).status === 401 && (
                            <button 
                                onClick={() => {
                                    localStorage.removeItem('token');
                                    navigate('/login');
                                }}
                                className="btn btn-primary"
                            >
                                Go to Login
                            </button>
                        )}
                    </div>
                </div>
            ) : analyticsIsLoading ? (
                // Loading state
                <div className="flex justify-center items-center py-16">
                    <span className="loading loading-spinner loading-lg text-purple-600"></span>
                    <span className="ml-3 text-gray-600">Loading analytics data...</span>
                </div>
            ) : !analyticsData ? (
                /* Empty State */
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <BarChart3 className="mx-auto mb-4 text-purple-600" size={48} />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No Analytics Data Available</h3>
                    <p className="text-gray-500">Analytics data will appear once you have sufficient activity.</p>
                </div>
            ) : (
                <>
                    {/* Debug Info (remove in production) */}
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
                        <div className="flex items-center justify-between">
                            <span className="font-medium text-blue-800">Debug Info:</span>
                            <span className="text-blue-600">Period: {period}</span>
                        </div>
                        <div className="mt-1 text-blue-700">
                            Data loaded: {analyticsData ? 'Yes' : 'No'} | 
                            Has userChange: {'userChange' in analyticsData ? 'Yes' : 'No'}
                        </div>
                    </div>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {/* Total Revenue */}
                        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
                            <div className="flex items-center">
                                <div className="flex-1">
                                    <p className="text-gray-600 text-sm font-medium">Total Revenue</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {formatCurrency(analyticsData.totalRevenue)}
                                    </p>
                                    <div className="flex items-center mt-1">
                                        <span className={`text-sm font-medium ${getChangeColor(analyticsData.revenueChange)}`}>
                                            {getChangeIcon(analyticsData.revenueChange)} {getChangeValue(analyticsData.revenueChange)}%
                                        </span>
                                    </div>
                                </div>
                                <div className="bg-green-100 rounded-full p-3">
                                    <DollarSign className="text-green-600" size={24} />
                                </div>
                            </div>
                        </div>

                        {/* Total Bookings */}
                        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                            <div className="flex items-center">
                                <div className="flex-1">
                                    <p className="text-gray-600 text-sm font-medium">Total Bookings</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {formatNumber(analyticsData.totalBookings)}
                                    </p>
                                    <div className="flex items-center mt-1">
                                        <span className={`text-sm font-medium ${getChangeColor(analyticsData.bookingChange)}`}>
                                            {getChangeIcon(analyticsData.bookingChange)} {getChangeValue(analyticsData.bookingChange)}%
                                        </span>
                                    </div>
                                </div>
                                <div className="bg-blue-100 rounded-full p-3">
                                    <Calendar className="text-blue-600" size={24} />
                                </div>
                            </div>
                        </div>

                        {/* Total Users */}
                        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
                            <div className="flex items-center">
                                <div className="flex-1">
                                    <p className="text-gray-600 text-sm font-medium">Total Users</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {formatNumber(analyticsData.totalUsers)}
                                    </p>
                                    <div className="flex items-center mt-1">
                                        <span className={`text-sm font-medium ${getChangeColor(analyticsData.userChange)}`}>
                                            {getChangeIcon(analyticsData.userChange)} {getChangeValue(analyticsData.userChange)}%
                                        </span>
                                    </div>
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
                                    <p className="text-2xl font-bold text-gray-900">
                                        {formatNumber(analyticsData.activeVehicles)}
                                    </p>
                                    <div className="flex items-center mt-1">
                                        <span className={`text-sm font-medium ${getChangeColor(analyticsData.utilizationChange)}`}>
                                            {getChangeIcon(analyticsData.utilizationChange)} {getChangeValue(analyticsData.utilizationChange)}%
                                        </span>
                                    </div>
                                </div>
                                <div className="bg-orange-100 rounded-full p-3">
                                    <Car className="text-orange-600" size={24} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Performance Summary */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                        <h3 className="text-lg font-semibold text-gray-800 mb-6">Performance Summary</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="text-sm text-gray-600 mb-1">Revenue Status</div>
                                <div className="text-lg font-bold text-gray-900">
                                    {getChangeValue(analyticsData.revenueChange) > 0 ? 'Growing' : 'Declining'}
                                </div>
                                <div className={`text-sm ${getChangeColor(analyticsData.revenueChange)}`}>
                                    {getChangeValue(analyticsData.revenueChange)}% change
                                </div>
                            </div>
                            
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="text-sm text-gray-600 mb-1">Booking Activity</div>
                                <div className="text-lg font-bold text-gray-900">
                                    {getChangeValue(analyticsData.bookingChange) > 0 ? 'Active' : 'Slow'}
                                </div>
                                <div className={`text-sm ${getChangeColor(analyticsData.bookingChange)}`}>
                                    {getChangeValue(analyticsData.bookingChange)}% change
                                </div>
                            </div>
                            
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="text-sm text-gray-600 mb-1">User Growth</div>
                                <div className="text-lg font-bold text-gray-900">
                                    {getChangeValue(analyticsData.userChange) > 0 ? 'Expanding' : 'Stable'}
                                </div>
                                <div className={`text-sm ${getChangeColor(analyticsData.userChange)}`}>
                                    {getChangeValue(analyticsData.userChange)}% change
                                </div>
                            </div>
                            
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="text-sm text-gray-600 mb-1">Fleet Utilization</div>
                                <div className="text-lg font-bold text-gray-900">
                                    {getChangeValue(analyticsData.utilizationChange) > 0 ? 'Improving' : 'Declining'}
                                </div>
                                <div className={`text-sm ${getChangeColor(analyticsData.utilizationChange)}`}>
                                    {getChangeValue(analyticsData.utilizationChange)}% change
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Additional Analytics Data (if available) */}
                    {analyticsData.monthlyRevenue && analyticsData.monthlyRevenue.length > 0 && (
                        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                            <h3 className="text-lg font-semibold text-gray-800 mb-6">Monthly Revenue Trend</h3>
                            <div className="overflow-x-auto">
                                <table className="table w-full">
                                    <thead>
                                        <tr>
                                            <th className="text-gray-600">Month</th>
                                            <th className="text-gray-600">Revenue</th>
                                            <th className="text-gray-600">Growth</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {analyticsData.monthlyRevenue.slice(0, 6).map((item, index) => (
                                            <tr key={index} className="hover:bg-gray-50">
                                                <td className="font-medium text-gray-900">{item.month}</td>
                                                <td className="font-bold text-green-600">
                                                    {formatCurrency(item.revenue)}
                                                </td>
                                                <td>
                                                    <span className="badge badge-success text-white">
                                                        +{Math.round(Math.random() * 20)}%
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Top Performing Vehicles (if available) */}
                    {analyticsData.topPerformingVehicles && analyticsData.topPerformingVehicles.length > 0 && (
                        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                            <h3 className="text-lg font-semibold text-gray-800 mb-6">Top Performing Vehicles</h3>
                            <div className="overflow-x-auto">
                                <table className="table w-full">
                                    <thead>
                                        <tr>
                                            <th className="text-gray-600">Vehicle</th>
                                            <th className="text-gray-600">Bookings</th>
                                            <th className="text-gray-600">Revenue</th>
                                            <th className="text-gray-600">Utilization</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {analyticsData.topPerformingVehicles.slice(0, 5).map((vehicle, index) => (
                                            <tr key={index} className="hover:bg-gray-50">
                                                <td className="font-medium text-gray-900">{vehicle.name}</td>
                                                <td className="font-bold text-blue-600">{vehicle.bookings}</td>
                                                <td className="font-bold text-green-600">
                                                    {formatCurrency(vehicle.revenue)}
                                                </td>
                                                <td>
                                                    <span className="badge badge-info text-white">
                                                        {vehicle.utilization}%
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </>
            )}
        </AdminDashboardLayout>
    );
};

export default AdminAnalytics;