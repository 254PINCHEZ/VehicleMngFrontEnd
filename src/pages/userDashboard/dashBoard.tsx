import React from 'react';
import { useSelector } from 'react-redux';
import {type RootState } from '../../store/store';
import StatsCards from '../userDashboard/statsCard';
import RecentBookings from '../userDashboard/recentBooking';
import QuickActions from '../userDashboard/QuickAction';

const Dashboard: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  // Mock data - will be replaced with actual API calls
  const dashboardStats = {
    totalBookings: 12,
    upcomingTrips: 2,
    completedRentals: 8,
    totalSpent: 1240,
  };

  const recentBookings = [
    {
      id: 1,
      vehicle: 'Honda Civic',
      image: '🚗',
      startDate: '2024-06-10',
      endDate: '2024-06-12',
      status: 'confirmed',
      totalCost: 180,
    },
    {
      id: 2,
      vehicle: 'Toyota RAV4',
      image: '🚙',
      startDate: '2024-06-15',
      endDate: '2024-06-20',
      status: 'upcoming',
      totalCost: 450,
    },
    {
      id: 3,
      vehicle: 'BMW 3 Series',
      image: '🚘',
      startDate: '2024-05-20',
      endDate: '2024-05-25',
      status: 'completed',
      totalCost: 375,
    },
  ];

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold mb-3">
            Welcome back, {user.first_name}! 👋
          </h1>
          <p className="text-blue-100 text-lg opacity-90">
            Ready for your next adventure? Here's what's happening with your bookings.
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCards stats={dashboardStats} />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Recent Bookings - 2/3 width */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900 flex items-center">
                <span className="w-2 h-6 bg-blue-600 rounded-full mr-3"></span>
                Recent Bookings
              </h2>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200">
                View All →
              </button>
            </div>
            <RecentBookings bookings={recentBookings} />
          </div>
        </div>

        {/* Quick Actions & Sidebar - 1/3 width */}
        <div className="space-y-6">
          <QuickActions />
          
          {/* Support Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white">
            <div className="text-center">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl">💬</span>
              </div>
              <h3 className="font-semibold mb-2">Need Help?</h3>
              <p className="text-slate-300 text-sm mb-4">
                Our support team is here to help you 24/7
              </p>
              <button className="btn btn-outline btn-sm text-white border-white hover:bg-white hover:text-slate-900 w-full">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Empty State (for when no bookings) */}
      {recentBookings.length === 0 && (
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-12 text-center">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl">🚗</span>
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-3">
            No bookings yet
          </h3>
          <p className="text-slate-600 mb-6 max-w-md mx-auto">
            Start your journey by exploring our vehicle collection and making your first booking.
          </p>
          <button className="btn btn-primary px-8">
            Browse Vehicles
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;