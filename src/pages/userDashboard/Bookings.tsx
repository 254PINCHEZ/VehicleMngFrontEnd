import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {type RootState } from '../../store/store';
import BookingFilters from '../userDashboard/BookingFilters';
import BookingList from '../userDashboard/BookingList';
import BookingGrid from '../userDashboard/BookingGrid';

const Bookings: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [activeFilter, setActiveFilter] = useState<'all' | 'upcoming' | 'active' | 'completed' | 'cancelled'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - will be replaced with API calls
  const allBookings = [
    {
      id: 1,
      vehicle: 'Honda Civic',
      image: '🚗',
      startDate: '2024-06-15',
      endDate: '2024-06-20',
      status: 'upcoming',
      totalCost: 450,
      vehicleType: 'sedan',
    },
    {
      id: 2,
      vehicle: 'Toyota RAV4',
      image: '🚙',
      startDate: '2024-06-10',
      endDate: '2024-06-12',
      status: 'confirmed',
      totalCost: 180,
      vehicleType: 'suv',
    },
    {
      id: 3,
      vehicle: 'BMW 3 Series',
      image: '🚘',
      startDate: '2024-05-20',
      endDate: '2024-05-25',
      status: 'completed',
      totalCost: 375,
      vehicleType: 'luxury',
    },
    {
      id: 4,
      vehicle: 'Harley Davidson',
      image: '🏍️',
      startDate: '2024-05-15',
      endDate: '2024-05-18',
      status: 'completed',
      totalCost: 210,
      vehicleType: 'motorcycle',
    },
    {
      id: 5,
      vehicle: 'Tesla Model 3',
      image: '⚡',
      startDate: '2024-07-01',
      endDate: '2024-07-07',
      status: 'upcoming',
      totalCost: 630,
      vehicleType: 'electric',
    },
  ];

  // Filter bookings based on active filter and search
  const filteredBookings = allBookings.filter(booking => {
    const matchesFilter = activeFilter === 'all' || booking.status === activeFilter;
    const matchesSearch = booking.vehicle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         booking.vehicleType.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStats = () => {
    return {
      total: allBookings.length,
      upcoming: allBookings.filter(b => b.status === 'upcoming').length,
      active: allBookings.filter(b => b.status === 'confirmed').length,
      completed: allBookings.filter(b => b.status === 'completed').length,
      cancelled: allBookings.filter(b => b.status === 'cancelled').length,
    };
  };

  const stats = getStats();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
          <p className="text-slate-600">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">My Bookings</h1>
          <p className="text-slate-600">
            Manage your vehicle rentals and track your upcoming trips
          </p>
        </div>
        <div className="mt-4 lg:mt-0">
          <button className="btn btn-primary">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            New Booking
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
          <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
          <div className="text-sm text-slate-600">Total</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
          <div className="text-2xl font-bold text-emerald-600">{stats.upcoming}</div>
          <div className="text-sm text-slate-600">Upcoming</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.active}</div>
          <div className="text-sm text-slate-600">Active</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          <div className="text-sm text-slate-600">Completed</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
          <div className="text-sm text-slate-600">Cancelled</div>
        </div>
      </div>

      {/* Filters Section */}
      <BookingFilters
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        stats={stats}
      />

      {/* Bookings Content */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">
              {filteredBookings.length} {filteredBookings.length === 1 ? 'Booking' : 'Bookings'} Found
            </h2>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-600">Sort by:</span>
              <select className="select select-bordered select-sm">
                <option>Recent First</option>
                <option>Oldest First</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bookings List/Grid */}
        <div className="p-6">
          {filteredBookings.length > 0 ? (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block">
                <BookingList bookings={filteredBookings} />
              </div>
              
              {/* Mobile Grid */}
              <div className="md:hidden">
                <BookingGrid bookings={filteredBookings} />
              </div>
            </>
          ) : (
            /* Empty State */
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">
                No bookings found
              </h3>
              <p className="text-slate-600 mb-6 max-w-md mx-auto">
                {searchQuery || activeFilter !== 'all' 
                  ? 'Try adjusting your search criteria or filters to find what you\'re looking for.'
                  : 'You haven\'t made any bookings yet. Start by exploring our vehicle collection.'
                }
              </p>
              <button 
                className="btn btn-primary"
                onClick={() => {
                  setSearchQuery('');
                  setActiveFilter('all');
                }}
              >
                {searchQuery || activeFilter !== 'all' ? 'Clear Filters' : 'Browse Vehicles'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Bookings;