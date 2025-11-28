import React from 'react'
import { DollarSign, Shield, Building, Gift, Calendar, Info } from 'lucide-react'

interface RentalDetails {
    dailyRate: number
    days: number
    insurance: number
    taxes: number
    discount: number
}

interface RentalSummaryCardProps {
    rentalDetails: RentalDetails
    totalCost: number
}

const RentalSummaryCard: React.FC<RentalSummaryCardProps> = ({ rentalDetails, totalCost }) => {
    // Helper functions
    const calculateSubtotal = () => {
        return rentalDetails.dailyRate * rentalDetails.days
    }

    const calculateTotalBeforeDiscount = () => {
        return calculateSubtotal() + rentalDetails.insurance + rentalDetails.taxes
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
        }).format(amount)
    }

    const getDaysUntilTrip = () => {
        // This would normally come from booking data
        const tripDate = new Date()
        tripDate.setDate(tripDate.getDate() + 7) // Example: trip in 7 days
        return 7
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {/* Header Section */}
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                    <DollarSign className="text-blue-600" size={24} />
                </div>
                <div className="flex-1">
                    <h1 className="text-xl font-bold text-gray-800">Rental Summary</h1>
                </div>
                <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {rentalDetails.days} {rentalDetails.days === 1 ? 'Day' : 'Days'}
                </div>
            </div>

            <div className="space-y-6">
                {/* Cost Breakdown */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <DollarSign className="text-blue-600 w-4 h-4" />
                        </div>
                        <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">
                            Cost Breakdown
                        </h3>
                    </div>
                    <div className="space-y-3">
                        {/* Daily Rate */}
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <DollarSign className="text-blue-600 w-4 h-4" />
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-gray-900">Daily Rate</div>
                                    <div className="text-xs text-gray-500">
                                        {rentalDetails.days} days × {formatCurrency(rentalDetails.dailyRate)}/day
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm font-semibold text-gray-900">
                                    {formatCurrency(calculateSubtotal())}
                                </div>
                            </div>
                        </div>

                        {/* Insurance */}
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                    <Shield className="text-green-600 w-4 h-4" />
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-gray-900">Insurance & Protection</div>
                                    <div className="text-xs text-gray-500">Full coverage insurance</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm font-semibold text-gray-900">
                                    {formatCurrency(rentalDetails.insurance)}
                                </div>
                            </div>
                        </div>

                        {/* Taxes & Fees */}
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <Building className="text-purple-600 w-4 h-4" />
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-gray-900">Taxes & Fees</div>
                                    <div className="text-xs text-gray-500">State and local taxes</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm font-semibold text-gray-900">
                                    {formatCurrency(rentalDetails.taxes)}
                                </div>
                            </div>
                        </div>

                        {/* Discount (if applicable) */}
                        {rentalDetails.discount > 0 && (
                            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-green-200 bg-green-50">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                        <Gift className="text-green-600 w-4 h-4" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-green-900">Promotional Discount</div>
                                        <div className="text-xs text-green-700">Special offer applied</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-semibold text-green-900">
                                        -{formatCurrency(rentalDetails.discount)}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Total Summary */}
                <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-5 text-white">
                    <h3 className="font-semibold mb-4 text-sm uppercase tracking-wide opacity-90">
                        Total Amount
                    </h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm opacity-90">
                            <span>Subtotal</span>
                            <span>{formatCurrency(calculateSubtotal())}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm opacity-90">
                            <span>Insurance</span>
                            <span>{formatCurrency(rentalDetails.insurance)}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm opacity-90">
                            <span>Taxes & Fees</span>
                            <span>{formatCurrency(rentalDetails.taxes)}</span>
                        </div>
                        {rentalDetails.discount > 0 && (
                            <div className="flex items-center justify-between text-sm opacity-90">
                                <span>Discount</span>
                                <span>-{formatCurrency(rentalDetails.discount)}</span>
                            </div>
                        )}
                        <div className="border-t border-white border-opacity-30 pt-3 mt-2">
                            <div className="flex items-center justify-between text-lg font-bold">
                                <span>Total</span>
                                <span>{formatCurrency(totalCost)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payment Status & Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <h4 className="font-semibold text-gray-800 text-sm">Payment Status</h4>
                        </div>
                        <span className="text-sm font-medium text-green-700">Paid in Full</span>
                        <div className="text-xs text-gray-600 mt-1">
                            Payment completed successfully
                        </div>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <div className="flex items-center gap-3 mb-2">
                            <Calendar className="text-blue-600 w-4 h-4" />
                            <h4 className="font-semibold text-gray-800 text-sm">Rental Period</h4>
                        </div>
                        <div className="text-sm text-gray-700">
                            {rentalDetails.days} {rentalDetails.days === 1 ? 'day' : 'days'} rental
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                            Daily rate: {formatCurrency(rentalDetails.dailyRate)}
                        </div>
                    </div>
                </div>

                {/* Savings Information */}
                {rentalDetails.discount > 0 && (
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                    <Gift className="text-green-600 w-5 h-5" />
                                </div>
                                <div>
                                    <div className="font-semibold text-green-800">You Saved!</div>
                                    <div className="text-sm text-green-700">
                                        {formatCurrency(rentalDetails.discount)} saved with promotional discount
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-lg font-bold text-green-800">
                                    {Math.round((rentalDetails.discount / calculateTotalBeforeDiscount()) * 100)}% OFF
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Cancellation Policy Reminder */}
                <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                    <div className="flex items-start gap-3">
                        <div className="shrink-0 mt-0.5">
                            <Info className="text-amber-600 w-5 h-5" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-amber-800 mb-1">
                                Cancellation Policy
                            </p>
                            <p className="text-amber-700 text-xs">
                                {getDaysUntilTrip() > 7 
                                    ? 'Full refund available if cancelled 7+ days before pickup'
                                    : getDaysUntilTrip() > 2 
                                    ? '50% refund available if cancelled 2-7 days before pickup'
                                    : 'No refund available for cancellations within 48 hours of pickup'
                                }
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RentalSummaryCard