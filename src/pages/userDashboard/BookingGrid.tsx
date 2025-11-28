import React from 'react';
import { Link } from 'react-router-dom';

interface Booking {
  id: number;
  vehicle: string;
  image: string;
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'confirmed' | 'completed' | 'cancelled';
  totalCost: number;
  vehicleType: string;
}

interface BookingGridProps {
  bookings: Booking[];
}

const BookingGrid: React.FC<BookingGridProps> = ({ bookings }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusConfig = (status: string) => {
    const config = {
      confirmed: { 
        color: 'bg-blue-100 text-blue-800 border-blue-200', 
        label: 'Confirmed',
        icon: '✅'
      },
      upcoming: { 
        color: 'bg-emerald-100 text-emerald-800 border-emerald-200', 
        label: 'Upcoming',
        icon: '📅'
      },
      completed: { 
        color: 'bg-green-100 text-green-800 border-green-200', 
        label: 'Completed',
        icon: '🎉'
      },
      cancelled: { 
        color: 'bg-red-100 text-red-800 border-red-200', 
        label: 'Cancelled',
        icon: '❌'
      },
    };
    return config[status as keyof typeof config] || config.confirmed;
  };

  const getDaysUntilTrip = (startDate: string) => {
    const start = new Date(startDate);
    const today = new Date();
    const diffTime = start.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return { text: 'Starts today', color: 'bg-orange-100 text-orange-800' };
    if (diffDays === 1) return { text: 'Starts tomorrow', color: 'bg-emerald-100 text-emerald-800' };
    if (diffDays > 1) return { text: `In ${diffDays} days`, color: 'bg-blue-100 text-blue-800' };
    if (diffDays < 0) return { text: 'Trip completed', color: 'bg-slate-100 text-slate-800' };
    return { text: 'Scheduled', color: 'bg-slate-100 text-slate-800' };
  };

  const getRentalDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24));
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      {bookings.map((booking) => {
        const statusConfig = getStatusConfig(booking.status);
        const tripTiming = getDaysUntilTrip(booking.startDate);
        const duration = getRentalDuration(booking.startDate, booking.endDate);

        return (
          <div 
            key={booking.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg transition-all duration-300 group"
          >
            {/* Header Section */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">{booking.image}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 text-lg mb-1">
                    {booking.vehicle}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusConfig.color}`}>
                      <span className="mr-1">{statusConfig.icon}</span>
                      {statusConfig.label}
                    </span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${tripTiming.color}`}>
                      {tripTiming.text}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Total Cost */}
              <div className="text-right">
                <div className="text-xl font-bold text-slate-900">
                  ${booking.totalCost}
                </div>
                <div className="text-xs text-slate-500">
                  Total
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div className="bg-slate-50 rounded-xl p-3">
                <div className="text-xs text-slate-600 mb-1">Start Date</div>
                <div className="font-semibold text-slate-900">
                  {formatDate(booking.startDate)}
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <div className="text-xs text-slate-600 mb-1">End Date</div>
                <div className="font-semibold text-slate-900">
                  {formatDate(booking.endDate)}
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <div className="text-xs text-slate-600 mb-1">Duration</div>
                <div className="font-semibold text-slate-900">
                  {duration} {duration === 1 ? 'day' : 'days'}
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <div className="text-xs text-slate-600 mb-1">Vehicle Type</div>
                <div className="font-semibold text-slate-900 capitalize">
                  {booking.vehicleType}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4 border-t border-slate-200">
              <Link
                to={`/dashboard/bookings/${booking.id}`}
                className="flex-1 btn btn-outline btn-sm justify-center py-2.5 text-slate-700 border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-all duration-200"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                View Details
              </Link>
              
              {booking.status === 'upcoming' && (
                <button className="flex-1 btn btn-outline btn-sm justify-center py-2.5 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 transition-all duration-200">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancel
                </button>
              )}

              {booking.status === 'completed' && (
                <button className="flex-1 btn btn-outline btn-sm justify-center py-2.5 text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Receipt
                </button>
              )}
            </div>

            {/* Quick Status Bar */}
            <div className="mt-4 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Booking #{booking.id}</span>
                <span>{new Date(booking.startDate).getFullYear()}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BookingGrid;