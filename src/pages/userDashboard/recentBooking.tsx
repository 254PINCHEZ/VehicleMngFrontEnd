import React from 'react';
import { Link } from 'react-router-dom';

interface Booking {
  id: number;
  vehicle: string;
  image: string;
  startDate: string;
  endDate: string;
  status: 'confirmed' | 'upcoming' | 'completed' | 'cancelled';
  totalCost: number;
}

interface RecentBookingsProps {
  bookings: Booking[];
}

const RecentBookings: React.FC<RecentBookingsProps> = ({ bookings }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusConfig = (status: string) => {
    const config = {
      confirmed: { color: 'bg-blue-100 text-blue-800 border-blue-200', label: 'Confirmed' },
      upcoming: { color: 'bg-emerald-100 text-emerald-800 border-emerald-200', label: 'Upcoming' },
      completed: { color: 'bg-green-100 text-green-800 border-green-200', label: 'Completed' },
      cancelled: { color: 'bg-red-100 text-red-800 border-red-200', label: 'Cancelled' },
    };
    return config[status as keyof typeof config] || config.confirmed;
  };

  const getDaysUntilTrip = (startDate: string) => {
    const start = new Date(startDate);
    const today = new Date();
    const diffTime = start.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays > 1) return `In ${diffDays} days`;
    return 'Past';
  };

  if (bookings.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">🚗</span>
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">No bookings yet</h3>
        <p className="text-slate-600 mb-4">Your recent bookings will appear here</p>
        <Link to="/inventory" className="btn btn-primary btn-sm">
          Browse Vehicles
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop Table */}
      <div className="hidden md:block">
        <div className="overflow-hidden rounded-lg border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Vehicle
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Dates
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Total
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {bookings.map((booking) => {
                const statusConfig = getStatusConfig(booking.status);
                return (
                  <tr key={booking.id} className="hover:bg-slate-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center mr-3">
                          <span className="text-lg">{booking.image}</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-slate-900">
                            {booking.vehicle}
                          </div>
                          <div className="text-xs text-slate-500">
                            {getDaysUntilTrip(booking.startDate)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900">
                        {formatDate(booking.startDate)}
                      </div>
                      <div className="text-xs text-slate-500">
                        to {formatDate(booking.endDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusConfig.color}`}>
                        {statusConfig.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 font-semibold">
                      ${booking.totalCost}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link
                          to={`/dashboard/bookings/${booking.id}`}
                          className="text-blue-600 hover:text-blue-900 transition-colors duration-200"
                        >
                          View
                        </Link>
                        {booking.status === 'upcoming' && (
                          <button className="text-red-600 hover:text-red-900 transition-colors duration-200">
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {bookings.map((booking) => {
          const statusConfig = getStatusConfig(booking.status);
          return (
            <div key={booking.id} className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition-all duration-200">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-xl">{booking.image}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">{booking.vehicle}</h4>
                    <p className="text-sm text-slate-600">{getDaysUntilTrip(booking.startDate)}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusConfig.color}`}>
                  {statusConfig.label}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Start Date</p>
                  <p className="text-sm font-medium text-slate-900">{formatDate(booking.startDate)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">End Date</p>
                  <p className="text-sm font-medium text-slate-900">{formatDate(booking.endDate)}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                <div className="text-lg font-bold text-slate-900">${booking.totalCost}</div>
                <div className="flex space-x-2">
                  <Link
                    to={`/dashboard/bookings/${booking.id}`}
                    className="btn btn-outline btn-sm"
                  >
                    View Details
                  </Link>
                  {booking.status === 'upcoming' && (
                    <button className="btn btn-outline btn-sm text-red-600 border-red-200 hover:bg-red-50">
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentBookings;