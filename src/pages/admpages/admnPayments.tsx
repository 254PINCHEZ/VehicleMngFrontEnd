import React from 'react';
import AdminDashboardLayout from '../../components/Dashboard/admDashboardLayout';
import { DollarSign, CreditCard, CheckCircle, XCircle, Clock, Eye, User, AlertCircle } from 'lucide-react';
import { paymentApi } from '../../API/PaymentAPI';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { skipToken } from '@reduxjs/toolkit/query';

// Define TypeScript interface for payments matching backend response
interface Payment {
  payment_id: string; // Changed from number to string (GUID)
  booking_id: string;
  amount: number;
  payment_status: string;
  payment_date: string;
  payment_method: string;
  transaction_id: string;
  created_at: string;
  updated_at: string;
  booking: {
    booking_id: string;
    user_id: string;
    vehicle_id: string;
    total_amount: number;
    booking_status: string;
  };
  user: {
    user_id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
}

const AdminPayments: React.FC = () => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  // RTK Query Hook to fetch all payments
  const { 
    data: paymentsResponse, 
    isLoading: paymentsIsLoading, 
    error,
    refetch
  } = paymentApi.useGetAllPaymentsQuery(
    isAuthenticated ? undefined : skipToken
  );

  // Extract payments array from response
  const payments = paymentsResponse || [];

  // RTK mutation to update payment status
  const [updatePaymentStatus] = paymentApi.useUpdatePaymentStatusMutation();

  // Format currency
  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  // Format date
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; icon: any; label: string }> = {
      success: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Success' },
      completed: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Completed' },
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Pending' },
      failed: { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Failed' },
      refunded: { color: 'bg-blue-100 text-blue-800', icon: DollarSign, label: 'Refunded' },
      processing: { color: 'bg-purple-100 text-purple-800', icon: Clock, label: 'Processing' }
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

  // Get payment method badge
  const getMethodBadge = (method: string) => {
    const methodConfig: Record<string, { color: string; label: string }> = {
      stripe: { color: 'bg-indigo-100 text-indigo-800', label: 'Stripe' },
      credit_card: { color: 'bg-blue-100 text-blue-800', label: 'Credit Card' },
      debit_card: { color: 'bg-green-100 text-green-800', label: 'Debit Card' },
      paypal: { color: 'bg-indigo-100 text-indigo-800', label: 'PayPal' },
      bank_transfer: { color: 'bg-gray-100 text-gray-800', label: 'Bank Transfer' },
      cash: { color: 'bg-yellow-100 text-yellow-800', label: 'Cash' }
    };

    const config = methodConfig[method.toLowerCase()] || { color: 'bg-gray-100 text-gray-800', label: method };

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  // Handle status update
  const handleStatusUpdate = async (paymentId: string, currentStatus: string) => {
    const { value: newStatus } = await Swal.fire({
      title: 'Update Payment Status',
      input: 'select',
      inputOptions: {
        pending: 'Pending',
        processing: 'Processing',
        success: 'Success',
        failed: 'Failed',
        refunded: 'Refunded'
      },
      inputValue: currentStatus,
      showCancelButton: true,
      confirmButtonText: 'Update',
      confirmButtonColor: '#10b981',
      inputValidator: (value) => {
        if (!value) {
          return 'Please select a status';
        }
      }
    });

    if (newStatus) {
      try {
        await updatePaymentStatus({ payment_id: paymentId, status: newStatus }).unwrap();
        Swal.fire("Success", "Payment status updated successfully", "success");
        refetch(); // Refresh the payments list
      } catch (error: any) {
        Swal.fire("Error", error.message || "Failed to update payment status", "error");
      }
    }
  };

  // Handle refund payment
  const handleRefundPayment = async (payment: Payment) => {
    const result = await Swal.fire({
      title: 'Process Refund?',
      text: `Are you sure you want to refund $${payment.amount} for payment #${payment.transaction_id}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Process Refund',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280'
    });

    if (result.isConfirmed) {
      try {
        await updatePaymentStatus({ payment_id: payment.payment_id, status: 'refunded' }).unwrap();
        Swal.fire("Refunded!", "Payment has been refunded successfully.", "success");
        refetch(); // Refresh the payments list
      } catch (error: any) {
        Swal.fire("Error", error.message || "Failed to process refund", "error");
      }
    }
  };

  // Handle view payment details
  const handleViewDetails = (payment: Payment) => {
    Swal.fire({
      title: 'Payment Details',
      html: `
        <div class="text-left">
          <div class="mb-3">
            <strong class="block text-gray-700">Payment ID:</strong>
            <code class="text-sm">${payment.payment_id}</code>
          </div>
          <div class="mb-3">
            <strong class="block text-gray-700">Transaction ID:</strong>
            <span>${payment.transaction_id}</span>
          </div>
          <div class="mb-3">
            <strong class="block text-gray-700">Customer:</strong>
            <span>${payment.user.first_name} ${payment.user.last_name}</span><br>
            <span class="text-sm text-gray-600">${payment.user.email}</span>
          </div>
          <div class="mb-3">
            <strong class="block text-gray-700">Booking ID:</strong>
            <span>${payment.booking.booking_id}</span>
          </div>
          <div class="mb-3">
            <strong class="block text-gray-700">Payment Date:</strong>
            <span>${formatDateTime(payment.payment_date)}</span>
          </div>
          <div class="mb-3">
            <strong class="block text-gray-700">Created:</strong>
            <span>${formatDateTime(payment.created_at)}</span>
          </div>
        </div>
      `,
      showCloseButton: true,
      showConfirmButton: false,
    });
  };

  // Calculate statistics
  const calculateStats = () => {
    const completedPayments = payments.filter(p => 
      p.payment_status === 'success' || p.payment_status === 'completed'
    );
    const pendingPayments = payments.filter(p => p.payment_status === 'pending');
    const failedPayments = payments.filter(p => p.payment_status === 'failed');
    const totalRevenue = completedPayments.reduce((sum, payment) => sum + payment.amount, 0);

    return {
      completed: completedPayments.length,
      pending: pendingPayments.length,
      failed: failedPayments.length,
      revenue: totalRevenue
    };
  };

  const stats = calculateStats();

  return (
    <AdminDashboardLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <DollarSign className="text-green-600" size={24} />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Payment Management</h1>
        </div>
        
        <button
          onClick={() => refetch()}
          className="btn btn-sm btn-outline text-green-600 hover:bg-green-50"
        >
          Refresh Payments
        </button>
      </div>

      {/* Loading State */}
      {paymentsIsLoading ? (
        <div className="flex justify-center items-center py-16">
          <span className="loading loading-spinner loading-lg text-green-600"></span>
          <span className="ml-3 text-gray-600">Loading payments...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="mx-auto text-red-500 mb-3" size={48} />
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Payments</h3>
          <p className="text-red-600 mb-4">Unable to fetch payments. Please check your connection.</p>
          <button
            onClick={() => refetch()}
            className="btn btn-sm btn-outline text-red-600 hover:bg-red-50"
          >
            Try Again
          </button>
        </div>
      ) : payments.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <CreditCard className="mx-auto mb-4 text-gray-400" size={48} />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Payments Found</h3>
          <p className="text-gray-500">No payment transactions have been processed yet.</p>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Revenue</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.revenue)}</p>
                </div>
                <DollarSign className="text-green-500" size={24} />
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Completed</p>
                  <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                </div>
                <CheckCircle className="text-green-500" size={24} />
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <Clock className="text-yellow-500" size={24} />
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Failed</p>
                  <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
                </div>
                <XCircle className="text-red-500" size={24} />
              </div>
            </div>
          </div>

          {/* Payments Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left font-semibold text-gray-700">Transaction ID</th>
                    <th className="text-left font-semibold text-gray-700">Customer</th>
                    <th className="text-left font-semibold text-gray-700">Method</th>
                    <th className="text-left font-semibold text-gray-700">Amount</th>
                    <th className="text-left font-semibold text-gray-700">Status</th>
                    <th className="text-left font-semibold text-gray-700">Date</th>
                    <th className="text-center font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment: Payment) => (
                    <tr key={payment.payment_id} className="hover:bg-gray-50">
                      <td>
                        <div className="font-bold text-gray-800">
                          {payment.transaction_id || 'N/A'}
                        </div>
                        <div className="text-xs text-gray-500">
                          ID: {payment.payment_id.substring(0, 8)}...
                        </div>
                      </td>
                      <td>
                        <div>
                          <div className="font-semibold text-gray-800 flex items-center gap-1">
                            <User size={14} />
                            {payment.user.first_name} {payment.user.last_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {payment.user.email}
                          </div>
                          <div className="text-xs text-gray-400">
                            Booking: {payment.booking.booking_id.substring(0, 8)}...
                          </div>
                        </div>
                      </td>
                      <td>
                        {getMethodBadge(payment.payment_method)}
                      </td>
                      <td className="font-bold text-green-600">
                        {formatCurrency(payment.amount)}
                      </td>
                      <td>
                        {getStatusBadge(payment.payment_status)}
                      </td>
                      <td className="text-sm text-gray-600">
                        {formatDateTime(payment.payment_date || payment.created_at)}
                      </td>
                      <td>
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleViewDetails(payment)}
                            className="btn btn-ghost btn-xs text-blue-600 tooltip"
                            data-tip="View Details"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(payment.payment_id, payment.payment_status)}
                            className="btn btn-ghost btn-xs text-green-600 tooltip"
                            data-tip="Update Status"
                          >
                            <Clock size={14} />
                          </button>
                          {(payment.payment_status === 'success' || payment.payment_status === 'completed') && (
                            <button
                              onClick={() => handleRefundPayment(payment)}
                              className="btn btn-ghost btn-xs text-red-600 tooltip"
                              data-tip="Process Refund"
                            >
                              <DollarSign size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary */}
            <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Total Payments: </span>
                  <span className="font-bold">{payments.length}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-600" />
                  <span className="text-gray-600">Success: </span>
                  <span className="font-bold">{stats.completed}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-yellow-600" />
                  <span className="text-gray-600">Pending: </span>
                  <span className="font-bold">{stats.pending}</span>
                </div>
                <div className="flex items-center gap-2">
                  <XCircle size={16} className="text-red-600" />
                  <span className="text-gray-600">Failed: </span>
                  <span className="font-bold">{stats.failed}</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </AdminDashboardLayout>
  );
};

export default AdminPayments;