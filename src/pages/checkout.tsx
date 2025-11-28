import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { type RootState } from '../store/store';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/footer';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  const [mpesaNumber, setMpesaNumber] = useState('');

  // Get booking data from localStorage
  const bookingData = JSON.parse(localStorage.getItem('currentBooking') || '{}');

  React.useEffect(() => {
    if (!bookingData.vehicle) {
      toast.error('No booking data found. Please select a vehicle first.');
      navigate('/inventory');
    }
  }, [bookingData, navigate]);

  const handleConfirmBooking = async () => {
    if (!user) {
      toast.error('Please login to complete your booking');
      navigate('/login');
      return;
    }

    // Validate M-Pesa number if selected
    if (selectedPaymentMethod === 'mpesa' && !isValidMpesaNumber(mpesaNumber)) {
      toast.error('Please enter a valid M-Pesa phone number (e.g., 254712345678)');
      return;
    }

    setIsProcessing(true);

    try {
      const paymentData = {
        booking_id: generateBookingId(),
        amount: bookingData.totalCost,
        payment_status: 'Pending',
        payment_method: selectedPaymentMethod,
        transaction_id: generateTransactionId(),
        payment_date: new Date().toISOString(),
        ...(selectedPaymentMethod === 'mpesa' && { mpesa_number: mpesaNumber })
      };

      console.log('Payment data:', paymentData);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      if (selectedPaymentMethod === 'mpesa') {
        toast.success('M-Pesa prompt sent to your phone. Please complete the payment.');
        // Simulate M-Pesa payment processing
        await new Promise(resolve => setTimeout(resolve, 3000));
        toast.success('M-Pesa payment confirmed!');
      } else {
        toast.success('Payment processed successfully!');
      }
      
      localStorage.removeItem('currentBooking');
      navigate('/booking-success');
    } catch (error) {
      toast.error('Payment failed. Please try again.');
      console.error('Payment error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const isValidMpesaNumber = (number: string): boolean => {
    const mpesaRegex = /^(254|0)(7[0-9]|1[0-1])[0-9]{7}$/;
    return mpesaRegex.test(number.replace(/\s+/g, ''));
  };

  const formatMpesaNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.startsWith('0')) {
      return '254' + cleaned.slice(1);
    }
    return cleaned;
  };

  const generateBookingId = () => {
    return 'booking-' + Date.now();
  };

  const generateTransactionId = () => {
    return 'txn-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleCardInputChange = (field: string, value: string) => {
    setCardDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!bookingData.vehicle) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
            <p className="text-slate-600 text-lg font-medium">Redirecting...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-slate-900 mb-3">Complete Your Booking</h1>
            <p className="text-slate-600 text-lg">Review your reservation details and secure your vehicle</p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Booking Summary */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
                <div className="flex items-center mb-6">
                  <div className="w-1.5 h-8 bg-blue-600 rounded-full mr-4"></div>
                  <h2 className="text-2xl font-bold text-slate-900">Booking Summary</h2>
                </div>
                
                <div className="space-y-6">
                  {/* Vehicle Info */}
                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                    <h3 className="font-semibold text-slate-900 text-lg mb-4 flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      Vehicle Details
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-600 font-medium">Vehicle</span>
                        <span className="text-slate-900 font-semibold">
                          {bookingData.vehicle.vehicle_spec?.manufacturer} {bookingData.vehicle.vehicle_spec?.model}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 font-medium">Year</span>
                        <span className="text-slate-900 font-semibold">{bookingData.vehicle.vehicle_spec?.year}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 font-medium">Daily Rate</span>
                        <span className="text-slate-900 font-semibold">${bookingData.vehicle.rental_rate}/day</span>
                      </div>
                    </div>
                  </div>

                  {/* Rental Period */}
                  <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-100">
                    <h3 className="font-semibold text-slate-900 text-lg mb-4 flex items-center">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></span>
                      Rental Period
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-600 font-medium">Start Date</span>
                        <span className="text-slate-900 font-semibold">
                          {new Date(bookingData.startDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 font-medium">End Date</span>
                        <span className="text-slate-900 font-semibold">
                          {new Date(bookingData.endDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 font-medium">Duration</span>
                        <span className="text-slate-900 font-semibold">
                          {Math.ceil((new Date(bookingData.endDate).getTime() - new Date(bookingData.startDate).getTime()) / (1000 * 3600 * 24))} days
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="bg-violet-50 rounded-xl p-6 border border-violet-100">
                    <h3 className="font-semibold text-slate-900 text-lg mb-4 flex items-center">
                      <span className="w-2 h-2 bg-violet-500 rounded-full mr-3"></span>
                      Customer Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-600 font-medium">Name</span>
                        <span className="text-slate-900 font-semibold">{user?.name || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 font-medium">Email</span>
                        <span className="text-slate-900 font-semibold">{user?.email}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Section */}
            <div className="space-y-6">
              {/* Total Amount */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-xl font-semibold mb-2">Total Amount</h3>
                <div className="text-4xl font-bold mb-3">${bookingData.totalCost}</div>
                <p className="text-blue-100 text-sm">Inclusive of all taxes and insurance</p>
              </div>

              {/* Payment Methods */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
                <div className="flex items-center mb-6">
                  <div className="w-1.5 h-8 bg-green-600 rounded-full mr-4"></div>
                  <h2 className="text-2xl font-bold text-slate-900">Payment Method</h2>
                </div>

                <div className="space-y-4">
                  {/* Card Payment */}
                  <div className="form-control">
                    <label className="label cursor-pointer justify-start p-4 hover:bg-slate-50 rounded-lg transition-colors">
                      <input 
                        type="radio" 
                        name="paymentMethod" 
                        className="radio radio-primary" 
                        value="card"
                        checked={selectedPaymentMethod === 'card'}
                        onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                      />
                      <div className="ml-4">
                        <span className="label-text font-semibold text-slate-900">Credit/Debit Card</span>
                        <p className="text-slate-500 text-sm">Pay securely with your card</p>
                      </div>
                    </label>
                  </div>

                  {selectedPaymentMethod === 'card' && (
                    <div className="space-y-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="grid gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Card Number</label>
                          <input
                            type="text"
                            placeholder="1234 5678 9012 3456"
                            className="input input-bordered w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={cardDetails.number}
                            onChange={(e) => handleCardInputChange('number', e.target.value)}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Expiry Date</label>
                            <input
                              type="text"
                              placeholder="MM/YY"
                              className="input input-bordered w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              value={cardDetails.expiry}
                              onChange={(e) => handleCardInputChange('expiry', e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">CVV</label>
                            <input
                              type="text"
                              placeholder="123"
                              className="input input-bordered w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              value={cardDetails.cvv}
                              onChange={(e) => handleCardInputChange('cvv', e.target.value)}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Cardholder Name</label>
                          <input
                            type="text"
                            placeholder="John Doe"
                            className="input input-bordered w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={cardDetails.name}
                            onChange={(e) => handleCardInputChange('name', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* M-Pesa Payment */}
                  <div className="form-control">
                    <label className="label cursor-pointer justify-start p-4 hover:bg-slate-50 rounded-lg transition-colors">
                      <input 
                        type="radio" 
                        name="paymentMethod" 
                        className="radio radio-primary" 
                        value="mpesa"
                        checked={selectedPaymentMethod === 'mpesa'}
                        onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                      />
                      <div className="ml-4">
                        <span className="label-text font-semibold text-slate-900">M-Pesa</span>
                        <p className="text-slate-500 text-sm">Pay via M-Pesa mobile money</p>
                      </div>
                    </label>
                  </div>

                  {selectedPaymentMethod === 'mpesa' && (
                    <div className="space-y-4 p-4 bg-green-50 rounded-xl border border-green-200">
                      <div className="flex items-center mb-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-green-600 font-bold text-sm">M</span>
                        </div>
                        <div>
                          <p className="font-semibold text-green-800">M-Pesa Payment</p>
                          <p className="text-green-700 text-sm">Enter your M-Pesa registered number</p>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                        <input
                          type="tel"
                          placeholder="254712345678"
                          className="input input-bordered w-full focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          value={mpesaNumber}
                          onChange={(e) => setMpesaNumber(e.target.value)}
                        />
                        <p className="text-slate-500 text-xs mt-2">Format: 2547XXXXXXXX</p>
                      </div>
                    </div>
                  )}

                  {/* Other Payment Methods */}
                  <div className="form-control">
                    <label className="label cursor-pointer justify-start p-4 hover:bg-slate-50 rounded-lg transition-colors">
                      <input 
                        type="radio" 
                        name="paymentMethod" 
                        className="radio radio-primary" 
                        value="paypal"
                        checked={selectedPaymentMethod === 'paypal'}
                        onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                      />
                      <div className="ml-4">
                        <span className="label-text font-semibold text-slate-900">PayPal</span>
                        <p className="text-slate-500 text-sm">Pay with your PayPal account</p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <button
                  onClick={handleConfirmBooking}
                  disabled={isProcessing}
                  className="btn btn-primary btn-lg w-full py-4 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:transform-none disabled:hover:shadow-lg"
                >
                  {isProcessing ? (
                    <>
                      <span className="loading loading-spinner loading-sm mr-3"></span>
                      Processing {selectedPaymentMethod === 'mpesa' ? 'M-Pesa' : 'Payment'}...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Confirm {selectedPaymentMethod === 'mpesa' ? 'M-Pesa' : ''} Payment - ${bookingData.totalCost}
                    </>
                  )}
                </button>
                
                <button
                  onClick={handleCancel}
                  disabled={isProcessing}
                  className="btn btn-outline btn-lg w-full py-4 rounded-xl font-semibold border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all duration-300"
                >
                  Cancel Booking
                </button>
              </div>

              {/* Security Notice */}
              <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200">
                <div className="flex items-start space-x-4">
                  <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-amber-800 mb-1">Secure Payment</p>
                    <p className="text-amber-700 text-sm">Your payment information is encrypted and processed securely.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Checkout;