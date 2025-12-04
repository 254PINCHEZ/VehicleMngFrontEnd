import React from 'react';
import DashboardLayout from '../../components/Dashboard/DashboardLayout';
import {
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Download,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import Swal from 'sweetalert2';
import {
  useGetMyPaymentHistoryQuery,
  useDownloadReceiptMutation,
  type PaymentHistoryResponse
} from '../../API/paymentHistoryApi';

const PaymentHistory: React.FC = () => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  // RTK Query hooks
  const {
    data: payments = [],
    isLoading,
    error: apiError,
    refetch
  } = useGetMyPaymentHistoryQuery(undefined, {
    skip: !isAuthenticated,
  });

  const [downloadReceipt] = useDownloadReceiptMutation();

  // Helper to get vehicle name from payment
  const getVehicleName = (payment: PaymentHistoryResponse): string => {
    if (payment.vehicle?.vehicle_spec) {
      return `${payment.vehicle.vehicle_spec.manufacturer} ${payment.vehicle.vehicle_spec.model} (${payment.vehicle.vehicle_spec.year})`;
    }
    
    // Fallback: Generate a generic name from booking ID
    return `Vehicle (Booking: ${payment.booking_id.substring(0, 8)}...)`;
  };

  // Helper functions
  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, {
      color: string;
      icon: React.ComponentType<{ size: number }>;
      label: string;
    }> = {
      success: {
        color: 'bg-green-100 text-green-800 border border-green-200',
        icon: CheckCircle,
        label: 'Success'
      },
      completed: {
        color: 'bg-green-100 text-green-800 border border-green-200',
        icon: CheckCircle,
        label: 'Completed'
      },
      pending: {
        color: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
        icon: Clock,
        label: 'Pending'
      },
      failed: {
        color: 'bg-red-100 text-red-800 border border-red-200',
        icon: XCircle,
        label: 'Failed'
      },
      refunded: {
        color: 'bg-blue-100 text-blue-800 border border-blue-200',
        icon: CheckCircle,
        label: 'Refunded'
      },
      cancelled: {
        color: 'bg-gray-100 text-gray-800 border border-gray-200',
        icon: XCircle,
        label: 'Cancelled'
      },
    };

    const config = statusConfig[status.toLowerCase()] || statusConfig.pending;
    const IconComponent = config.icon;

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        <IconComponent size={14} className="mr-1" />
        {config.label}
      </span>
    );
  };

  const getPaymentMethodIcon = (method: string) => {
    const icons: Record<string, string> = {
      stripe: '💳',
      'stripe card': '💳',
      card: '💳',
      'm-pesa': '📱',
      mpesa: '📱',
      paypal: '🔵',
      cash: '💵',
      'bank transfer': '🏦',
      'bank_transfer': '🏦'
    };
    return icons[method.toLowerCase()] || '💳';
  };

  const getPaymentMethodLabel = (method: string) => {
    const labels: Record<string, string> = {
      stripe: 'Credit Card (Stripe)',
      'stripe card': 'Credit Card',
      card: 'Credit Card',
      'm-pesa': 'M-Pesa',
      mpesa: 'M-Pesa',
      paypal: 'PayPal',
      cash: 'Cash',
      'bank transfer': 'Bank Transfer',
      'bank_transfer': 'Bank Transfer'
    };
    return labels[method.toLowerCase()] || method;
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Function to handle receipt download
  const handleDownloadReceipt = async (payment: PaymentHistoryResponse) => {
    Swal.fire({
      title: "Download Receipt",
      text: `Download receipt for payment ${payment.payment_id}?`,
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Download",
      cancelButtonText: "Cancel",
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          const blob = await downloadReceipt(payment.payment_id).unwrap();
          
          // Create download link
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `receipt-${payment.payment_id}.pdf`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
          
          return { success: true };
        } catch (error) {
          Swal.showValidationMessage('Failed to download receipt');
          return { success: false };
        }
      }
    }).then((result) => {
      if (result.isConfirmed && result.value?.success) {
        Swal.fire("Success", "Receipt downloaded successfully!", "success");
      }
    });
  };

  // Function to handle payment retry
  const handleRetryPayment = (payment: PaymentHistoryResponse) => {
    Swal.fire({
      title: "Retry Payment",
      text: `Retry payment of ${formatCurrency(payment.amount)} for booking ${payment.booking_id}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Retry Payment",
      cancelButtonText: "Cancel"
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = `/checkout?booking_id=${payment.booking_id}&retry=true`;
      }
    });
  };

  // Function to view booking details
  const handleViewBooking = (payment: PaymentHistoryResponse) => {
    window.location.href = `/bookings/${payment.booking_id}`;
  };

  // Function to handle refresh
  const handleRefresh = () => {
    refetch();
  };

  // Calculate summary statistics
  const totalPaid = payments
    .filter(p => p.payment_status.toLowerCase() === 'success' || p.payment_status.toLowerCase() === 'completed')
    .reduce((sum, payment) => sum + payment.amount, 0);

  const successfulCount = payments.filter(p =>
    p.payment_status.toLowerCase() === 'success' || p.payment_status.toLowerCase() === 'completed'
  ).length;

  const pendingCount = payments.filter(p =>
    p.payment_status.toLowerCase() === 'pending'
  ).length;

  const failedCount = payments.filter(p =>
    p.payment_status.toLowerCase() === 'failed'
  ).length;

  // Handle error message
  const getErrorMessage = () => {
    if (!apiError) return null;
    
    if (typeof apiError === 'object' && 'data' in apiError) {
      const errorData = apiError.data as any;
      return errorData.message || 'Failed to load payment history';
    }
    
    return 'Failed to load payment history';
  };

  const errorMessage = getErrorMessage();

  return (
    <DashboardLayout>
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <CreditCard className="text-green-600" size={24} />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Payment History</h1>
            <p className="text-sm text-gray-600">View all your payment transactions</p>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className="btn btn-outline btn-sm flex items-center gap-2 self-start sm:self-center"
        >
          {isLoading ? (
            <span className="loading loading-spinner loading-xs"></span>
          ) : (
            <RefreshCw size={14} />
          )}
          Refresh
        </button>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <AlertCircle className="text-red-500 mr-3 mt-0.5 flex-shrink-0" size={20} />
            <div>
              <h3 className="font-semibold text-red-800">Error Loading Payments</h3>
              <p className="text-red-600 text-sm">{errorMessage}</p>
              <button
                onClick={handleRefresh}
                className="mt-2 text-sm text-red-700 underline hover:text-red-800"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payments Content */}
      {isLoading ? (
        <div className="flex flex-col justify-center items-center py-16">
          <span className="loading loading-spinner loading-lg text-green-600"></span>
          <span className="mt-3 text-gray-600">Loading your payments...</span>
        </div>
      ) : !isAuthenticated ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 text-center">
          <AlertCircle className="mx-auto text-yellow-500 mb-4" size={64} />
          <h3 className="text-xl font-semibold text-yellow-800 mb-2">Authentication Required</h3>
          <p className="text-yellow-600 mb-6">Please log in to view your payment history.</p>
          <button
            onClick={() => window.location.href = '/login'}
            className="btn bg-yellow-500 hover:bg-yellow-600 text-white border-0"
          >
            Log In
          </button>
        </div>
      ) : payments.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
          <CreditCard className="mx-auto text-gray-400 mb-4" size={64} />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Payments Yet</h3>
          <p className="text-gray-500 mb-6">You haven't made any payments yet. Book a vehicle to get started!</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => window.location.href = '/inventory'}
              className="btn bg-green-600 hover:bg-green-700 text-white border-0"
            >
              Browse Vehicles
            </button>
            <button
              onClick={() => window.location.href = '/bookings'}
              className="btn btn-outline border-gray-300 hover:bg-gray-50"
            >
              View Bookings
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Paid</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(totalPaid)}</p>
                </div>
                <div className="p-2 bg-green-100 rounded-lg">
                  <DollarSign className="text-green-600" size={20} />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Successful</p>
                  <p className="text-2xl font-bold text-green-600">{successfulCount}</p>
                </div>
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="text-green-600" size={20} />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
                </div>
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="text-yellow-600" size={20} />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Failed</p>
                  <p className="text-2xl font-bold text-red-600">{failedCount}</p>
                </div>
                <div className="p-2 bg-red-100 rounded-lg">
                  <XCircle className="text-red-600" size={20} />
                </div>
              </div>
            </div>
          </div>

          {/* Payments Table - Mobile Responsive */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Details
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Method
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {payments.map((payment) => (
                    <tr key={payment.payment_id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-bold text-gray-900">
                            #{payment.payment_id.substring(0, 12)}...
                          </div>
                          <div className="text-sm text-gray-500">
                            Booking: #{payment.booking_id.substring(0, 8)}...
                          </div>
                          <div className="text-sm text-blue-600 mt-1">
                            {getVehicleName(payment)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <span className="mr-2 text-lg">{getPaymentMethodIcon(payment.payment_method)}</span>
                          <span className="text-sm font-medium text-gray-900">
                            {getPaymentMethodLabel(payment.payment_method)}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {payment.transaction_id ? `TXN: ${payment.transaction_id.substring(0, 10)}...` : 'No TXN ID'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(payment.payment_status)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-green-600">
                          {formatCurrency(payment.amount)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {formatDate(payment.payment_date || payment.created_at)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => handleViewBooking(payment)}
                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-gray-700 rounded-md text-sm hover:bg-gray-50 transition-colors duration-200"
                            title="View Booking"
                          >
                            View
                          </button>
                          
                          {(payment.payment_status.toLowerCase() === 'success' || 
                            payment.payment_status.toLowerCase() === 'completed') && (
                            <button
                              onClick={() => handleDownloadReceipt(payment)}
                              className="inline-flex items-center px-3 py-1.5 border border-green-300 text-green-700 rounded-md text-sm hover:bg-green-50 transition-colors duration-200"
                              title="Download Receipt"
                            >
                              <Download size={14} className="mr-1" />
                              Receipt
                            </button>
                          )}
                          
                          {payment.payment_status.toLowerCase() === 'failed' && (
                            <button
                              onClick={() => handleRetryPayment(payment)}
                              className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors duration-200"
                            >
                              Retry
                            </button>
                          )}
                          
                          {payment.payment_status.toLowerCase() === 'pending' && (
                            <span className="inline-flex items-center px-3 py-1.5 border border-yellow-300 text-yellow-700 rounded-md text-sm">
                              <Clock size={14} className="mr-1" />
                              Processing
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden">
              {payments.map((payment) => (
                <div key={payment.payment_id} className="border-b border-gray-200 p-4 last:border-b-0">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-bold text-gray-900 text-sm">
                        #{payment.payment_id.substring(0, 8)}...
                      </div>
                      <div className="text-xs text-gray-500">
                        Booking: #{payment.booking_id.substring(0, 6)}...
                      </div>
                    </div>
                    {getStatusBadge(payment.payment_status)}
                  </div>
                  
                  <div className="mb-2">
                    <div className="text-sm font-medium text-gray-900">
                      {getVehicleName(payment)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatDate(payment.payment_date || payment.created_at)}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center">
                      <span className="mr-2 text-lg">{getPaymentMethodIcon(payment.payment_method)}</span>
                      <span className="text-sm text-gray-700">
                        {getPaymentMethodLabel(payment.payment_method)}
                      </span>
                    </div>
                    <div className="font-bold text-green-600">
                      {formatCurrency(payment.amount)}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleViewBooking(payment)}
                      className="flex-1 min-w-[80px] inline-flex justify-center items-center px-3 py-1.5 border border-gray-300 text-gray-700 rounded-md text-sm hover:bg-gray-50 transition-colors duration-200"
                    >
                      View
                    </button>
                    
                    {(payment.payment_status.toLowerCase() === 'success' || 
                      payment.payment_status.toLowerCase() === 'completed') && (
                      <button
                        onClick={() => handleDownloadReceipt(payment)}
                        className="flex-1 min-w-[80px] inline-flex justify-center items-center px-3 py-1.5 border border-green-300 text-green-700 rounded-md text-sm hover:bg-green-50 transition-colors duration-200"
                      >
                        <Download size={14} className="mr-1" />
                        Receipt
                      </button>
                    )}
                    
                    {payment.payment_status.toLowerCase() === 'failed' && (
                      <button
                        onClick={() => handleRetryPayment(payment)}
                        className="flex-1 min-w-[80px] inline-flex justify-center items-center px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors duration-200"
                      >
                        Retry
                      </button>
                    )}
                    
                    {payment.payment_status.toLowerCase() === 'pending' && (
                      <span className="flex-1 min-w-[80px] inline-flex justify-center items-center px-3 py-1.5 border border-yellow-300 text-yellow-700 rounded-md text-sm">
                        <Clock size={14} className="mr-1" />
                        Processing
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary Footer */}
          {payments.length > 0 && (
            <div className="mt-6 text-center text-sm text-gray-500">
              Showing {payments.length} payment{payments.length !== 1 ? 's' : ''}
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  );
};

export default PaymentHistory;