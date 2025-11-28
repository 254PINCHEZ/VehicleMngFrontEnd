import React from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ArrowLeft, Download, Car, Phone, Mail, Calendar, CheckCircle } from 'lucide-react'
import { type RootState } from '../../store/store'
import BookingDetailsCard from '../bookingDetails/BookingDetailsCard'
import BookingActions from '../bookingDetails/BookingActions'
import VehicleDetailsCard from '../bookingDetails/VehicleDetailsCard'
import RentalSummaryCard from '../bookingDetails/RentalSummaryCard'
import SupportTicketCard from '../tickets/SupportTicketCard'

const BookingDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { user } = useSelector((state: RootState) => state.auth)

    // Mock booking data - will be replaced with API call
    const booking = {
        id: parseInt(id || '1'),
        vehicle: 'Honda Civic',
        image: '🚗',
        startDate: '2024-06-15',
        endDate: '2024-06-20',
        status: 'upcoming' as 'upcoming' | 'confirmed' | 'completed' | 'cancelled',
        totalCost: 450,
        vehicleType: 'sedan',
        bookingDate: '2024-05-10',
        paymentStatus: 'paid',
        paymentMethod: 'credit_card',
        transactionId: 'TXN_789012345',
        vehicleDetails: {
            manufacturer: 'Honda',
            model: 'Civic',
            year: 2023,
            fuelType: 'Petrol',
            seatingCapacity: 5,
            transmission: 'Automatic',
            features: ['Air Conditioning', 'Bluetooth', 'Backup Camera', 'Cruise Control'],
        },
        rentalDetails: {
            dailyRate: 90,
            days: 5,
            insurance: 50,
            taxes: 10,
            discount: 0,
        },
        userDetails: {
            name: `${user?.first_name} ${user?.last_name}`,
            email: user?.email,
            phone: user?.contact_phone || 'Not provided',
            licenseNumber: 'DL-123456789',
        }
    }

    if (!user) {
        return (
            <div className="flex justify-center items-center py-16">
                <span className="loading loading-spinner loading-lg text-green-600"></span>
                <span className="ml-3 text-gray-600">Loading booking details...</span>
            </div>
        )
    }

    // Helper functions
    const getStatusMessage = () => {
        const messages = {
            upcoming: { 
                title: 'Your Trip is Coming Up!', 
                message: `Your ${booking.vehicle} rental starts on ${new Date(booking.startDate).toLocaleDateString()}` 
            },
            confirmed: { 
                title: 'Booking Confirmed!', 
                message: 'Your vehicle is ready for pickup as scheduled' 
            },
            completed: { 
                title: 'Trip Completed!', 
                message: 'We hope you enjoyed your rental experience' 
            },
            cancelled: { 
                title: 'Booking Cancelled', 
                message: 'This booking has been cancelled' 
            },
        }
        return messages[booking.status] || messages.upcoming
    }

    const statusMessage = getStatusMessage()

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex items-center gap-3 mb-6">
                <button
                    onClick={() => navigate('/dashboard/bookings')}
                    className="btn btn-ghost btn-circle hover:bg-gray-100 transition-colors duration-200"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="p-2 bg-green-100 rounded-lg">
                    <Car className="text-green-600" size={24} />
                </div>
                <div className="flex-1">
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Booking Details</h1>
                    <p className="text-gray-600">
                        Booking #{booking.id} • {booking.vehicle}
                    </p>
                </div>
                <div className="flex gap-3">
                    <button className="btn btn-outline">
                        <Download className="w-4 h-4 mr-2" />
                        Download Receipt
                    </button>
                    <Link to="/inventory" className="btn bg-green-800 hover:bg-green-900 text-white">
                        Book Similar Vehicle
                    </Link>
                </div>
            </div>

            {/* Status Banner */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-6 text-white">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h2 className="text-xl font-bold mb-2">
                            {statusMessage.title}
                        </h2>
                        <p className="text-green-100 opacity-90">
                            {statusMessage.message}
                        </p>
                    </div>
                    <div className="mt-4 lg:mt-0">
                        <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-white bg-opacity-20 border border-white border-opacity-30">
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Left Column - Booking Info & Actions */}
                <div className="xl:col-span-2 space-y-6">
                    {/* Booking Details Card */}
                    <BookingDetailsCard booking={booking} />
                    
                    {/* Vehicle Details Card */}
                    <VehicleDetailsCard vehicle={booking.vehicleDetails} image={booking.image} />
                    
                    {/* Rental Summary Card */}
                    <RentalSummaryCard 
                        rentalDetails={booking.rentalDetails}
                        totalCost={booking.totalCost}
                    />
                </div>

                {/* Right Column - Actions & Support */}
                <div className="space-y-6">
                    {/* Booking Actions */}
                    <BookingActions 
                        booking={booking}
                        onActionComplete={() => {
                            // Refresh data or show notification
                        }}
                    />
                    
                    {/* Support Ticket Card */}
                    <SupportTicketCard 
                        bookingId={booking.id}
                        vehicle={booking.vehicle}
                    />

                    {/* Quick Help Card */}
                    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Phone className="text-blue-600 w-4 h-4" />
                            </div>
                            <h3 className="font-semibold text-gray-800">Need Immediate Help?</h3>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                                <span className="text-sm text-gray-700">Roadside Assistance</span>
                                <span className="text-sm font-semibold text-blue-600">+1-555-HELP</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                                <span className="text-sm text-gray-700">Customer Support</span>
                                <span className="text-sm font-semibold text-blue-600">support@vehiclerent.com</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Timeline Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <Calendar className="text-blue-600" size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">Booking Timeline</h3>
                </div>
                <div className="space-y-4">
                    <div className="flex items-center gap-4 text-sm">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <div className="flex-1">
                            <span className="font-medium text-gray-900">Booking Confirmed</span>
                            <span className="text-gray-500 ml-2">{new Date(booking.bookingDate).toLocaleDateString()}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <div className="flex-1">
                            <span className="font-medium text-gray-900">Payment Processed</span>
                            <span className="text-gray-500 ml-2">{new Date(booking.bookingDate).toLocaleDateString()}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                        <div className={`w-3 h-3 rounded-full ${booking.status === 'upcoming' ? 'bg-orange-500' : 'bg-gray-300'}`}></div>
                        <div className="flex-1">
                            <span className={`font-medium ${booking.status === 'upcoming' ? 'text-gray-900' : 'text-gray-500'}`}>
                                Vehicle Pickup
                            </span>
                            <span className="text-gray-500 ml-2">{new Date(booking.startDate).toLocaleDateString()}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                        <div className={`w-3 h-3 rounded-full ${booking.status === 'completed' ? 'bg-purple-500' : 'bg-gray-300'}`}></div>
                        <div className="flex-1">
                            <span className={`font-medium ${booking.status === 'completed' ? 'text-gray-900' : 'text-gray-500'}`}>
                                Vehicle Return
                            </span>
                            <span className="text-gray-500 ml-2">{new Date(booking.endDate).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BookingDetails