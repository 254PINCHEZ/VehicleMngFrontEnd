import React, { useState } from 'react';
import AdminDashboardLayout from '../../components/Dashboard/admDashboardLayout';
import { MessageSquare, Eye, Reply, CheckCircle, Clock, AlertCircle, User, Mail, Calendar, Phone, XCircle } from 'lucide-react';
import { supportApi } from '../../API/supportAPi';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { skipToken } from '@reduxjs/toolkit/query';

// Define TypeScript interface for support tickets
interface SupportTicket {
    ticket_id: number;
    ticket_reference: string;
    customer_name: string;
    customer_email: string;
    subject: string;
    description?: string;
    status: string;
    priority: string;
    category: string;
    created_at: string;
    phone?: string;
}

const AdminSupport: React.FC = () => {
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    
    // RTK Query Hook to fetch all support tickets - matches your reference pattern
    const { 
        data: allTickets, 
        isLoading: ticketsIsLoading, 
        error 
    } = supportApi.useGetAllTicketsQuery(
        isAuthenticated ? undefined : skipToken
    );

    // RTK mutation to update ticket status
    const [updateTicketStatus] = supportApi.useUpdateTicketStatusMutation();

    // Format date - matches your AllOrders.tsx pattern
    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Get status badge - matches your AllOrders.tsx pattern
    const getStatusBadge = (status: string) => {
        const statusConfig = {
            open: { color: 'badge-warning', icon: Clock, label: 'Open' },
            in_progress: { color: 'badge-info', icon: AlertCircle, label: 'In Progress' },
            resolved: { color: 'badge-success', icon: CheckCircle, label: 'Resolved' },
            closed: { color: 'badge-neutral', icon: CheckCircle, label: 'Closed' },
            urgent: { color: 'badge-error', icon: AlertCircle, label: 'Urgent' }
        };

        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.open;
        const IconComponent = config.icon;

        return (
            <span className={`badge ${config.color} text-white inline-flex items-center gap-1`}>
                <IconComponent size={12} />
                {config.label}
            </span>
        );
    };

    // Get priority badge
    const getPriorityBadge = (priority: string) => {
        const priorityConfig = {
            low: { color: 'badge-neutral', label: 'Low' },
            medium: { color: 'badge-info', label: 'Medium' },
            high: { color: 'badge-warning', label: 'High' },
            urgent: { color: 'badge-error', label: 'Urgent' }
        };

        const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.medium;

        return (
            <span className={`badge ${config.color} text-white`}>
                {config.label}
            </span>
        );
    };

    // Get category badge
    const getCategoryBadge = (category: string) => {
        const categoryConfig = {
            technical: { color: 'badge-primary', label: 'Technical' },
            billing: { color: 'badge-success', label: 'Billing' },
            booking: { color: 'badge-info', label: 'Booking' },
            general: { color: 'badge-neutral', label: 'General' },
            vehicle: { color: 'badge-warning', label: 'Vehicle' }
        };

        const config = categoryConfig[category as keyof typeof categoryConfig] || categoryConfig.general;

        return (
            <span className={`badge ${config.color} text-white`}>
                {config.label}
            </span>
        );
    };

    // Handle status update - matches your AllOrders.tsx pattern
    const handleStatusUpdate = async (ticketId: number, currentStatus: string) => {
        const statusOptions = ['open', 'in_progress', 'resolved', 'closed'];
        const currentIndex = statusOptions.indexOf(currentStatus);
        const nextStatuses = statusOptions.slice(currentIndex + 1);

        if (nextStatuses.length === 0) {
            Swal.fire("Info", "This ticket is already at the final status", "info");
            return;
        }

        const { value: newStatus } = await Swal.fire({
            title: 'Update Ticket Status',
            input: 'select',
            inputOptions: nextStatuses.reduce((acc, status) => {
                acc[status] = status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                return acc;
            }, {} as Record<string, string>),
            inputPlaceholder: 'Select new status',
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
                const res = await updateTicketStatus({ ticket_id: ticketId, status: newStatus }).unwrap();
                Swal.fire("Updated", res.message, "success");
            } catch (error) {
                Swal.fire("Error", "Failed to update ticket status", "error");
            }
        }
    };

    // Handle view ticket details - simplified modal
    const handleViewTicket = (ticket: SupportTicket) => {
        Swal.fire({
            title: ticket.subject,
            html: `
                <div class="text-left">
                    <p><strong>Description:</strong> ${ticket.description || 'No description provided'}</p>
                    <p><strong>Customer:</strong> ${ticket.customer_name} (${ticket.customer_email})</p>
                    <p><strong>Created:</strong> ${formatDateTime(ticket.created_at)}</p>
                    <p><strong>Priority:</strong> ${ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}</p>
                    <p><strong>Category:</strong> ${ticket.category.charAt(0).toUpperCase() + ticket.category.slice(1)}</p>
                    <p><strong>Status:</strong> ${ticket.status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</p>
                    ${ticket.phone ? `<p><strong>Phone:</strong> ${ticket.phone}</p>` : ''}
                </div>
            `,
            confirmButtonText: 'Close',
            confirmButtonColor: '#3b82f6'
        });
    };

    return (
        <AdminDashboardLayout>
            {/* Header - matches your AllCustomers.tsx pattern */}
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                    <MessageSquare className="text-blue-600" size={24} />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Support Tickets</h1>
            </div>

            {/* Loading State - matches your AllCustomers.tsx pattern */}
            {ticketsIsLoading ? (
                <div className="flex justify-center items-center py-16">
                    <span className="loading loading-spinner loading-lg text-blue-600"></span>
                    <span className="ml-3 text-gray-600">Loading support tickets...</span>
                </div>
            ) : error ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                    <XCircle className="mx-auto text-red-500 mb-3" size={48} />
                    <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Tickets</h3>
                    <p className="text-red-600">Unable to fetch support tickets. Please try again later.</p>
                </div>
            ) : !allTickets || allTickets.length === 0 ? (
                /* Empty State - matches your AllCustomers.tsx pattern */
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <MessageSquare className="mx-auto mb-4 text-blue-600" size={48} />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No Support Tickets</h3>
                    <p className="text-gray-500">No support tickets have been created yet.</p>
                </div>
            ) : (
                /* Tickets Table - matches your AllCustomers.tsx pattern */
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="table table-zebra w-full">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="text-left font-semibold text-gray-700">Ticket ID</th>
                                    <th className="text-left font-semibold text-gray-700">Customer</th>
                                    <th className="text-left font-semibold text-gray-700">Subject</th>
                                    <th className="text-left font-semibold text-gray-700">Category</th>
                                    <th className="text-left font-semibold text-gray-700">Status</th>
                                    <th className="text-left font-semibold text-gray-700">Date</th>
                                    <th className="text-center font-semibold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allTickets.map((ticket: SupportTicket) => (
                                    <tr key={ticket.ticket_id} className="hover:bg-gray-50">
                                        <td className="font-bold text-gray-800">#{ticket.ticket_reference}</td>
                                        <td>
                                            <div>
                                                <div className="font-semibold text-gray-800 flex items-center gap-1">
                                                    <User size={14} />
                                                    {ticket.customer_name}
                                                </div>
                                                <div className="text-sm text-gray-500 flex items-center gap-1">
                                                    <Mail size={12} />
                                                    {ticket.customer_email}
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="font-medium text-gray-900">{ticket.subject}</div>
                                            <div className="text-sm text-gray-500 truncate max-w-xs">
                                                {ticket.description || 'No description'}
                                            </div>
                                        </td>
                                        <td>
                                            {getCategoryBadge(ticket.category)}
                                        </td>
                                        <td>
                                            {getStatusBadge(ticket.status)}
                                        </td>
                                        <td className="text-sm text-gray-600">
                                            <div className="flex items-center gap-1">
                                                <Calendar size={14} />
                                                {formatDateTime(ticket.created_at)}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleViewTicket(ticket)}
                                                    className="btn btn-ghost btn-xs text-green-600 tooltip"
                                                    data-tip="View Details"
                                                >
                                                    <Eye size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleStatusUpdate(ticket.ticket_id, ticket.status)}
                                                    className="btn btn-ghost btn-xs text-blue-600 tooltip"
                                                    data-tip="Update Status"
                                                >
                                                    <Reply size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Support Summary Stats - matches your AllCustomers.tsx pattern */}
                    <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
                        <div className="flex flex-wrap gap-6 text-sm">
                            <div className="flex items-center gap-2">
                                <MessageSquare size={16} className="text-blue-600" />
                                <span className="text-gray-600">Total Tickets: </span>
                                <span className="font-bold">{allTickets.length}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock size={16} className="text-yellow-600" />
                                <span className="text-gray-600">Open: </span>
                                <span className="font-bold">
                                    {allTickets.filter((t: SupportTicket) => t.status === 'open').length}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <AlertCircle size={16} className="text-orange-600" />
                                <span className="text-gray-600">In Progress: </span>
                                <span className="font-bold">
                                    {allTickets.filter((t: SupportTicket) => t.status === 'in_progress').length}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle size={16} className="text-green-600" />
                                <span className="text-gray-600">Resolved: </span>
                                <span className="font-bold">
                                    {allTickets.filter((t: SupportTicket) => t.status === 'resolved').length}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminDashboardLayout>
    );
};

export default AdminSupport;