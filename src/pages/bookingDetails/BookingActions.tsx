import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Download, MessageCircle, Edit, X, Calendar, Car, Star, Info } from 'lucide-react'
import Swal from 'sweetalert2'

interface Booking {
  id: number
  vehicle: string
  image: string
  startDate: string
  endDate: string
  status: 'upcoming' | 'confirmed' | 'completed' | 'cancelled'
  totalCost: number
  vehicleType: string
}

interface BookingActionsProps {
  booking: Booking
  onActionComplete: () => void
}

const BookingActions: React.FC<BookingActionsProps> = ({ booking, onActionComplete }) => {
    const navigate = useNavigate()
    const [isCancelling, setIsCancelling] = useState(false)
    const [isModifying, setIsModifying] = useState(false)

    // Function to handle booking cancellation
    const handleCancelBooking = async () => {
        Swal.fire({
            title: "Are you sure?",
            text: "You want to cancel this booking?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#2563eb",
            cancelButtonColor: "#f44336",
            confirmButtonText: "Yes, Cancel it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                setIsCancelling(true)
                try {
                    // Simulate API call
                    await new Promise(resolve => setTimeout(resolve, 2000))
                    console.log('Cancelling booking:', booking.id)
                    onActionComplete()
                    Swal.fire("Cancelled", "Your booking has been cancelled successfully", "success")
                } catch (error) {
                    console.error('Failed to cancel booking:', error)
                    Swal.fire("Something went wrong", "Please try again later", "error")
                } finally {
                    setIsCancelling(false)
                }
            }
        })
    }

    const handleModifyBooking = () => {
        setIsModifying(true)
        // Navigate to modification page or open modal
        console.log('Modify booking:', booking.id)
        setTimeout(() => setIsModifying(false), 1000)
    }

    const handleDownloadReceipt = () => {
        // Generate and download receipt
        console.log('Download receipt for booking:', booking.id)
        Swal.fire("Success", "Receipt download started", "success")
    }

    const handleContactSupport = () => {
        navigate('/dashboard/support', { 
            state: { 
                prefill: { 
                    subject: `Support for Booking #${booking.id}`,
                    message: `I need assistance with my booking #${booking.id} for ${booking.vehicle}.` 
                } 
            } 
        })
    }

    // Helper functions
    const getCancellationPolicy = () => {
        const startDate = new Date(booking.startDate)
        const today = new Date()
        const daysUntilTrip = Math.ceil((startDate.getTime() - today.getTime()) / (1000 * 3600 * 24))
        
        if (daysUntilTrip > 7) {
            return { text: 'Full refund available', color: 'text-green-600' }
        } else if (daysUntilTrip > 2) {
            return { text: '50% refund available', color: 'text-orange-600' }
        } else {
            return { text: 'No refund available', color: 'text-red-600' }
        }
    }

    const getAvailableActions = () => {
        const baseActions = [
            {
                id: 'receipt',
                label: 'Download Receipt',
                icon: <Download className="w-4 h-4" />,
                color: 'btn-outline',
                onClick: handleDownloadReceipt,
                available: ['upcoming', 'confirmed', 'completed'],
            },
            {
                id: 'support',
                label: 'Get Support',
                icon: <MessageCircle className="w-4 h-4" />,
                color: 'btn-outline',
                onClick: handleContactSupport,
                available: ['upcoming', 'confirmed', 'completed', 'cancelled'],
            },
        ]

        const statusActions = {
            upcoming: [
                {
                    id: 'modify',
                    label: 'Modify Booking',
                    icon: <Edit className="w-4 h-4" />,
                    color: 'btn-primary',
                    onClick: handleModifyBooking,
                    loading: isModifying,
                },
                {
                    id: 'cancel',
                    label: 'Cancel Booking',
                    icon: <X className="w-4 h-4" />,
                    color: 'btn-error',
                    onClick: handleCancelBooking,
                    loading: isCancelling,
                },
            ],
            confirmed: [
                {
                    id: 'modify',
                    label: 'Modify Dates',
                    icon: <Calendar className="w-4 h-4" />,
                    color: 'btn-primary',
                    onClick: handleModifyBooking,
                    loading: isModifying,
                },
            ],
            completed: [],
            cancelled: [],
        }

        return [
            ...(statusActions[booking.status] || []),
            ...baseActions.filter(action => action.available.includes(booking.status))
        ]
    }

    const actions = getAvailableActions()
    const cancellationPolicy = getCancellationPolicy()

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {/* Header Section */}
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                    <Car className="text-blue-600" size={24} />
                </div>
                <h1 className="text-xl font-bold text-gray-800">Booking Actions</h1>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
                {actions.map((action) => (
                    <button
                        key={action.id}
                        onClick={action.onClick}
                        disabled={action.loading}
                        className={`btn ${action.color} w-full justify-start py-3 text-left transition-all duration-200 hover:shadow-md disabled:opacity-50`}
                    >
                        {action.loading ? (
                            <>
                                <span className="loading loading-spinner loading-sm mr-3"></span>
                                Processing...
                            </>
                        ) : (
                            <>
                                <span className="shrink-0 mr-3">
                                    {action.icon}
                                </span>
                                <span className="flex-1 font-medium">{action.label}</span>
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </>
                        )}
                    </button>
                ))}
            </div>

            {/* Cancellation Policy */}
            {booking.status === 'upcoming' && (
                <div className="mt-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="flex items-start gap-3">
                        <div className="shrink-0 mt-0.5">
                            <Info className="text-orange-600 w-5 h-5" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-orange-800 text-sm mb-1">
                                Cancellation Policy
                            </h4>
                            <p className={`text-xs font-medium ${cancellationPolicy.color}`}>
                                {cancellationPolicy.text}
                            </p>
                            <p className="text-orange-700 text-xs mt-2">
                                Free cancellation up to 7 days before pickup
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Status-specific Information */}
            {booking.status === 'upcoming' && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-3">
                        <Car className="text-blue-600 w-5 h-5 shrink-0" />
                        <div className="flex-1">
                            <p className="text-sm font-medium text-blue-800">
                                Ready for pickup on {new Date(booking.startDate).toLocaleDateString()}
                            </p>
                            <p className="text-blue-700 text-xs mt-1">
                                Bring your driver's license and payment method
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {booking.status === 'completed' && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-3">
                        <Star className="text-green-600 w-5 h-5 shrink-0" />
                        <div className="flex-1">
                            <p className="text-sm font-medium text-green-800">
                                How was your experience?
                            </p>
                            <p className="text-green-700 text-xs mt-1">
                                Consider leaving a review to help other renters
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Quick Stats */}
            <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-lg font-bold text-gray-900">
                            {Math.ceil((new Date(booking.endDate).getTime() - new Date(booking.startDate).getTime()) / (1000 * 3600 * 24))}
                        </div>
                        <div className="text-xs text-gray-600">Rental Days</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-lg font-bold text-gray-900">
                            ${Math.round(booking.totalCost / Math.ceil((new Date(booking.endDate).getTime() - new Date(booking.startDate).getTime()) / (1000 * 3600 * 24)))}
                        </div>
                        <div className="text-xs text-gray-600">Per Day</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BookingActions