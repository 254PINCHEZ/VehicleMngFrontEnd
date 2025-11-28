import React from 'react'
import { 
    CheckCircle, 
    Calendar, 
    PartyPopper, 
    XCircle, 
    CreditCard, 
    User, 
    Mail, 
    Phone, 
    Car,
    FileText
} from 'lucide-react'

interface Booking {
    id: number
    vehicle: string
    image: string
    startDate: string
    endDate: string
    status: 'upcoming' | 'confirmed' | 'completed' | 'cancelled'
    totalCost: number
    vehicleType: string
    bookingDate: string
    paymentStatus: string
    paymentMethod: string
    transactionId: string
    userDetails: {
        name: string
        email: string
        phone: string
        licenseNumber: string
    }
}

interface BookingDetailsCardProps {
    booking: Booking
}

const BookingDetailsCard: React.FC<BookingDetailsCardProps> = ({ booking }) => {
    // Helper functions
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    const getStatusConfig = (status: string) => {
        const config = {
            confirmed: { 
                color: 'bg-blue-100 text-blue-800 border-blue-200', 
                label: 'Confirmed',
                icon: <CheckCircle className="w-4 h-4" />
            },
            upcoming: { 
                color: 'bg-emerald-100 text-emerald-800 border-emerald-200', 
                label: 'Upcoming',
                icon: <Calendar className="w-4 h-4" />
            },
            completed: { 
                color: 'bg-green-100 text-green-800 border-green-200', 
                label: 'Completed',
                icon: <PartyPopper className="w-4 h-4" />
            },
            cancelled: { 
                color: 'bg-red-100 text-red-800 border-red-200', 
                label: 'Cancelled',
                icon: <XCircle className="w-4 h-4" />
            },
        }
        return config[status as keyof typeof config] || config.confirmed
    }

    const getPaymentMethodText = (method: string) => {
        const methods: { [key: string]: string } = {
            credit_card: 'Credit Card',
            debit_card: 'Debit Card',
            paypal: 'PayPal',
            mpesa: 'M-Pesa',
            bank_transfer: 'Bank Transfer'
        }
        return methods[method] || method
    }

    const statusConfig = getStatusConfig(booking.status)

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {/* Header Section */}
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="text-blue-600" size={24} />
                </div>
                <div className="flex-1">
                    <h1 className="text-xl font-bold text-gray-800">Booking Information</h1>
                </div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${statusConfig.color}`}>
                    <span className="mr-2">
                        {statusConfig.icon}
                    </span>
                    {statusConfig.label}
                </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - Booking Details */}
                <div className="space-y-4">
                    {/* Booking ID & Dates */}
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <h3 className="font-semibold text-gray-800 mb-3 text-sm uppercase tracking-wide">Booking Reference</h3>
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-2xl font-bold text-gray-900">#{booking.id}</span>
                            <span className="text-sm text-gray-500 bg-white px-2 py-1 rounded border">
                                {new Date(booking.bookingDate).getFullYear()}
                            </span>
                        </div>
                        <div className="text-sm text-gray-600">
                            Booked on {formatDate(booking.bookingDate)}
                        </div>
                    </div>

                    {/* Rental Period */}
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <h3 className="font-semibold text-gray-800 mb-3 text-sm uppercase tracking-wide">Rental Period</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-sm text-gray-600">Pickup Date</div>
                                    <div className="font-semibold text-gray-900">{formatDate(booking.startDate)}</div>
                                </div>
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    <Calendar className="w-4 h-4 text-blue-600" />
                                </div>
                            </div>
                            <div className="border-t border-blue-200 pt-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-sm text-gray-600">Return Date</div>
                                        <div className="font-semibold text-gray-900">{formatDate(booking.endDate)}</div>
                                    </div>
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                        <Calendar className="w-4 h-4 text-blue-600" />
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-lg p-3 border border-blue-100">
                                <div className="text-center">
                                    <div className="text-sm text-gray-600">Total Duration</div>
                                    <div className="text-lg font-bold text-blue-700">
                                        {Math.ceil((new Date(booking.endDate).getTime() - new Date(booking.startDate).getTime()) / (1000 * 3600 * 24))} days
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Payment & User Info */}
                <div className="space-y-4">
                    {/* Payment Information */}
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                        <div className="flex items-center gap-3 mb-3">
                            <CreditCard className="text-green-600 w-5 h-5" />
                            <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">Payment Information</h3>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Total Amount</span>
                                <span className="text-xl font-bold text-green-700">${booking.totalCost}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Payment Status</span>
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200">
                                    {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Payment Method</span>
                                <span className="text-sm font-medium text-gray-900">{getPaymentMethodText(booking.paymentMethod)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Transaction ID</span>
                                <span className="text-sm font-mono text-gray-700 bg-white px-2 py-1 rounded border">{booking.transactionId}</span>
                            </div>
                        </div>
                    </div>

                    {/* User Information */}
                    <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                        <div className="flex items-center gap-3 mb-3">
                            <User className="text-purple-600 w-5 h-5" />
                            <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">Renter Information</h3>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-sm text-gray-600">Full Name</div>
                                    <div className="font-semibold text-gray-900">{booking.userDetails.name}</div>
                                </div>
                                <User className="text-gray-400 w-4 h-4" />
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-sm text-gray-600">Email Address</div>
                                    <div className="font-semibold text-gray-900">{booking.userDetails.email}</div>
                                </div>
                                <Mail className="text-gray-400 w-4 h-4" />
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-sm text-gray-600">Phone Number</div>
                                    <div className="font-semibold text-gray-900">{booking.userDetails.phone}</div>
                                </div>
                                <Phone className="text-gray-400 w-4 h-4" />
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-sm text-gray-600">Driver's License</div>
                                    <div className="font-semibold text-gray-900">{booking.userDetails.licenseNumber}</div>
                                </div>
                                <Car className="text-gray-400 w-4 h-4" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BookingDetailsCard