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

interface BookingListProps {
  bookings: Booking[];
}

const BookingList: React.FC<BookingListProps> = ({ bookings }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
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
    
    if (diffDays === 0) return { text: 'Starts today', color: 'text-orange-600' };
    if (diffDays === 1) return { text: 'Starts tomorrow', color: 'text-emerald-600' };
    if (diffDays > 1) return { text: `In ${diffDays} days`, color: 'text-slate-600' };
    if (diffDays < 0) return { text: 'Trip completed', color: 'text-slate-500' };
    return { text: 'Scheduled', color: 'text-slate-600' };
  };

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Vehicle
            </th>
            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Rental Period
            </th>
            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Total
            </th>
            <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-200">
          {bookings.map((booking) => {
            const statusConfig = getStatusConfig(booking.status);
            const tripTiming = getDaysUntilTrip(booking.startDate);
            
            return (
              <tr 
                key={booking.id} 
                className="hover:bg-slate-50 transition-all duration-200 group"
              >
                {/* Vehicle Column */}
                <td className="px-6 py-5 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center mr-4 group-hover:scale-105 transition-transform duration-200">
                      <span className="text-xl">{booking.image}</span>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900 group-hover:text-slate-800 transition-colors">
                        {booking.vehicle}
                      </div>
                      <div className="text-xs text-slate-500 capitalize">
                        {booking.vehicleType}
                      </div>
                      <div className={`text-xs font-medium mt-1 ${tripTiming.color}`}>
                        {tripTiming.text}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Rental Period Column */}
                <td className="px-6 py-5 whitespace-nowrap">
                  <div className="text-sm font-medium text-slate-900">
                    {formatDate(booking.startDate)}
                  </div>
                  <div className="text-xs text-slate-500 flex items-center">
                    <svg className="w-3 h-3 mr-1 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                    {formatDate(booking.endDate)}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {Math.ceil((new Date(booking.endDate).getTime() - new Date(booking.startDate).getTime()) / (1000 * 3600 * 24))} days
                  </div>
                </td>

                {/* Status Column */}
                <td className="px-6 py-5 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">{statusConfig.icon}</span>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${statusConfig.color}`}>
                      {statusConfig.label}
                    </span>
                  </div>
                </td>

                {/* Total Cost Column */}
                <td className="px-6 py-5 whitespace-nowrap">
                  <div className="text-sm font-bold text-slate-900">
                    ${booking.totalCost}
                  </div>
                  <div className="text-xs text-slate-500">
                    Paid
                  </div>
                </td>

                {/* Actions Column */}
                <td className="px-6 py-5 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end space-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Link
                      to={`/dashboard/bookings/${booking.id}`}
                      className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100 hover:border-blue-300 transition-all duration-200"
                    >
                      <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View
                    </Link>
                    
                    {booking.status === 'upcoming' && (
                      <button className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium text-red-700 bg-red-50 border border-red-200 hover:bg-red-100 hover:border-red-300 transition-all duration-200">
                        <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Cancel
                      </button>
                    )}

                    {booking.status === 'completed' && (
                      <button className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:border-slate-300 transition-all duration-200">
                        <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Receipt
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
  );
};

export default BookingList;