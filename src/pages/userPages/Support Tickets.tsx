import React, { useState } from 'react'
import DashboardLayout from '../../components/Dashboard/DashboardLayout'
import { MessageCircle, Plus, Clock, CheckCircle, XCircle, AlertCircle, Search, Filter } from 'lucide-react'
import { useSelector } from 'react-redux'
// import { skipToken } from '@reduxjs/toolkit/query'
import type { RootState } from '../../store/store'
import Swal from 'sweetalert2'

// Mock support API - replace with your actual support API
// import { supportApi } from '../../features/api/SupportApi'

const SupportTickets: React.FC = () => {
    useSelector((state: RootState) => state.auth);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    // RTK Query logic for fetching support tickets for the logged-in user
    // const { data: userTickets, isLoading, error } = supportApi.useGetUserTicketsQuery(
    //     isAuthenticated ? user!.user_id : skipToken
    // )

    // RTK mutation for creating new tickets
    // const [createTicket, { isLoading: isCreating }] = supportApi.useCreateTicketMutation()

    // Mock data - replace with actual API call
    const isLoading = false;
    const error = null;
    const userTickets = [
        {
            ticket_id: 'TKT-001',
            subject: 'Vehicle Damage Report',
            message: 'I noticed some scratches on the vehicle after my rental period. Can you please advise on the process?',
            status: 'Open',
            created_at: '2024-01-15T10:30:00Z',
            updated_at: '2024-01-15T10:30:00Z',
            assigned_admin: null
        },
        {
            ticket_id: 'TKT-002',
            subject: 'Billing Inquiry',
            message: 'I was charged an extra fee that I don\'t understand. Can you explain the breakdown?',
            status: 'InProgress',
            created_at: '2024-01-12T14:20:00Z',
            updated_at: '2024-01-13T09:15:00Z',
            assigned_admin: {
                first_name: 'John',
                last_name: 'Doe'
            }
        },
        {
            ticket_id: 'TKT-003',
            subject: 'Extension Request',
            message: 'I need to extend my rental for 2 more days. Is this possible?',
            status: 'Resolved',
            created_at: '2024-01-08T16:45:00Z',
            updated_at: '2024-01-09T11:30:00Z',
            assigned_admin: {
                first_name: 'Sarah',
                last_name: 'Smith'
            }
        },
        {
            ticket_id: 'TKT-004',
            subject: 'Vehicle Not Available',
            message: 'The vehicle I booked was not available at pickup time. Very disappointed.',
            status: 'Closed',
            created_at: '2024-01-05T08:15:00Z',
            updated_at: '2024-01-07T14:20:00Z',
            assigned_admin: {
                first_name: 'Mike',
                last_name: 'Johnson'
            }
        }
    ];

    // New ticket form state
    const [newTicket, setNewTicket] = useState({
        subject: '',
        message: ''
    });

    // Helper functions
    const getStatusBadge = (status: string) => {
        const statusConfig = {
            Open: { color: 'bg-blue-100 text-blue-800 border border-blue-200', icon: Clock, label: 'Open' },
            InProgress: { color: 'bg-yellow-100 text-yellow-800 border border-yellow-200', icon: AlertCircle, label: 'In Progress' },
            Resolved: { color: 'bg-green-100 text-green-800 border border-green-200', icon: CheckCircle, label: 'Resolved' },
            Closed: { color: 'bg-gray-100 text-gray-800 border border-gray-200', icon: XCircle, label: 'Closed' },
        };

        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.Open;
        const IconComponent = config.icon;

        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
                <IconComponent size={14} className="mr-1" />
                {config.label}
            </span>
        );
    };

    const getPriorityBadge = (ticket: unknown) => {
        const isUrgent = ticket.subject.toLowerCase().includes('damage') || 
                         ticket.subject.toLowerCase().includes('emergency') ||
                         ticket.subject.toLowerCase().includes('not available');
        
        if (isUrgent) {
            return (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                    Urgent
                </span>
            );
        }
        return null;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatMessagePreview = (message: string) => {
        return message.length > 100 ? message.substring(0, 100) + '...' : message;
    };

    // Filter tickets based on search and status
    const filteredTickets = userTickets.filter(ticket => {
        const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            ticket.message.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || ticket.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // Function to handle new ticket creation
    const handleCreateTicket = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!newTicket.subject.trim() || !newTicket.message.trim()) {
            Swal.fire("Error", "Please fill in all fields", "error");
            return;
        }


        try {
            // Replace with actual API call
            // await createTicket({
            //     subject: newTicket.subject,
            //     message: newTicket.message
            // }).unwrap()

            // Mock success response
            Swal.fire({
                title: "Ticket Created!",
                text: "Your support ticket has been created successfully. We'll get back to you soon.",
                icon: "success",
                confirmButtonColor: "#2563eb"
            });

            setNewTicket({ subject: '', message: '' });
            setShowCreateForm(false);
            
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            Swal.fire("Error", "Failed to create ticket. Please try again.", "error");
        }
    };

    // Function to handle input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewTicket(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <DashboardLayout>
            {/* Header Section */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <MessageCircle className="text-blue-600" size={24} />
                    </div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Support Tickets</h1>
                </div>

                <button
                    onClick={() => setShowCreateForm(true)}
                    className="btn bg-blue-600 hover:bg-blue-700 text-white border-0"
                >
                    <Plus size={16} className="mr-2" />
                    New Ticket
                </button>
            </div>

            {/* Create Ticket Modal */}
            {showCreateForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-800">Create Support Ticket</h2>
                                <button
                                    onClick={() => setShowCreateForm(false)}
                                    className="btn btn-ghost btn-sm text-gray-500 hover:text-gray-700"
                                >
                                    <XCircle size={20} />
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleCreateTicket} className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Subject *
                                    </label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={newTicket.subject}
                                        onChange={handleInputChange}
                                        className="input input-bordered w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                        placeholder="Brief description of your issue"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Message *
                                    </label>
                                    <textarea
                                        name="message"
                                        value={newTicket.message}
                                        onChange={handleInputChange}
                                        rows={6}
                                        className="textarea textarea-bordered w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                        placeholder="Please provide detailed information about your issue..."
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 justify-end mt-6 pt-4 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateForm(false)}
                                    className="btn btn-outline border-gray-300 text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                    Create Ticket
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Search and Filter Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search tickets..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="input input-bordered w-full pl-10 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            />
                        </div>
                    </div>
                    <div className="sm:w-48">
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="select select-bordered w-full pl-10 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            >
                                <option value="All">All Status</option>
                                <option value="Open">Open</option>
                                <option value="InProgress">In Progress</option>
                                <option value="Resolved">Resolved</option>
                                <option value="Closed">Closed</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tickets Content */}
            {isLoading ? (
                <div className="flex justify-center items-center py-16">
                    <span className="loading loading-spinner loading-lg text-blue-600"></span>
                    <span className="ml-3 text-gray-600">Loading your tickets...</span>
                </div>
            ) : error ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                    <XCircle className="mx-auto text-red-500 mb-3" size={48} />
                    <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Tickets</h3>
                    <p className="text-red-600">Unable to fetch your support tickets. Please try again later.</p>
                </div>
            ) : !filteredTickets || filteredTickets.length === 0 ? (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
                    <MessageCircle className="mx-auto text-gray-400 mb-4" size={64} />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                        {searchTerm || statusFilter !== 'All' ? 'No Matching Tickets' : 'No Support Tickets'}
                    </h3>
                    <p className="text-gray-500 mb-6">
                        {searchTerm || statusFilter !== 'All' 
                            ? 'No tickets match your search criteria.' 
                            : 'You haven\'t created any support tickets yet.'}
                    </p>
                    {!searchTerm && statusFilter === 'All' && (
                        <button
                            onClick={() => setShowCreateForm(true)}
                            className="btn bg-blue-600 hover:bg-blue-700 text-white border-0"
                        >
                            Create Your First Ticket
                        </button>
                    )}
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="table table-zebra w-full">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="text-left font-semibold text-gray-700 p-4">Ticket ID</th>
                                    <th className="text-left font-semibold text-gray-700 p-4">Subject</th>
                                    <th className="text-left font-semibold text-gray-700 p-4">Message</th>
                                    <th className="text-left font-semibold text-gray-700 p-4">Status</th>
                                    <th className="text-left font-semibold text-gray-700 p-4">Assigned To</th>
                                    <th className="text-left font-semibold text-gray-700 p-4">Created Date</th>
                                    <th className="text-left font-semibold text-gray-700 p-4">Last Updated</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTickets.map((ticket) => (
                                    <tr key={ticket.ticket_id} className="hover:bg-gray-50 transition-colors duration-150">
                                        <td className="font-bold text-gray-800 p-4">
                                            #{ticket.ticket_id}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-blue-800">
                                                    {ticket.subject}
                                                </span>
                                                {getPriorityBadge(ticket)}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-gray-600 max-w-md">
                                                {formatMessagePreview(ticket.message)}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            {getStatusBadge(ticket.status)}
                                        </td>
                                        <td className="p-4">
                                            {ticket.assigned_admin ? (
                                                <span className="text-gray-700">
                                                    {ticket.assigned_admin.first_name} {ticket.assigned_admin.last_name}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400 text-sm">Not assigned</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-sm text-gray-600">
                                            {formatDate(ticket.created_at)}
                                        </td>
                                        <td className="p-4 text-sm text-gray-600">
                                            {formatDate(ticket.updated_at)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Summary Section */}
                    <div className="bg-gray-50 border-t border-gray-200 p-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="text-sm text-gray-600">
                                Showing {filteredTickets.length} of {userTickets.length} ticket{userTickets.length !== 1 ? 's' : ''}
                            </div>
                            <div className="flex flex-wrap gap-4">
                                <div className="text-sm">
                                    <span className="text-gray-600">Open: </span>
                                    <span className="font-semibold text-blue-600">
                                        {userTickets.filter(t => t.status === 'Open').length}
                                    </span>
                                </div>
                                <div className="text-sm">
                                    <span className="text-gray-600">In Progress: </span>
                                    <span className="font-semibold text-yellow-600">
                                        {userTickets.filter(t => t.status === 'InProgress').length}
                                    </span>
                                </div>
                                <div className="text-sm">
                                    <span className="text-gray-600">Resolved: </span>
                                    <span className="font-semibold text-green-600">
                                        {userTickets.filter(t => t.status === 'Resolved').length}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}

export default SupportTickets;