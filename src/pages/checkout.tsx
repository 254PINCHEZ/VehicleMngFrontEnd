import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { type RootState } from '../store/store';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/footer';

// Stripe imports
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import StripeCheckoutForm from '../pages/StripeCheckoutForm';

// Initialize Stripe with proper error handling
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51SZ5DORuDYV3WjJBFW0G2HKs92MHHyPDl5RmIZVJ6YbCyc4Qg4OinU2FhkMbWZoTtsadTrWNghdPcLrOVCMppKGQ00qVDMZmAA');

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [mpesaNumber, setMpesaNumber] = useState('');
  
  // Stripe state
  const [clientSecret, setClientSecret] = useState<string>('');
  const [stripeError, setStripeError] = useState<string>('');

  // Get booking data from localStorage
  const bookingData = JSON.parse(localStorage.getItem('currentBooking') || '{}');

  // API base URL
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

  useEffect(() => {
    if (!bookingData.vehicle) {
      toast.error('No booking data found. Please select a vehicle first.');
      navigate('/inventory');
    }
  }, [bookingData, navigate]);

  // Initialize Stripe payment when card is selected
  useEffect(() => {
    if (selectedPaymentMethod === 'card' && bookingData.totalCost && user) {
      initializeStripePayment();
    } else {
      setClientSecret('');
      setStripeError('');
    }
  }, [selectedPaymentMethod, bookingData.totalCost, user]);

  const initializeStripePayment = async () => {
    try {
      setIsProcessing(true);
      setStripeError('');
      
      // Generate a proper GUID for the booking
      const bookingId = generateUUID();
      
      // Store the booking ID for later use
      localStorage.setItem('tempBookingId', bookingId);
      
      // Call backend to create PaymentIntent
      const response = await fetch(`${API_BASE_URL}/api/payments/create-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({
          amount: Math.round(bookingData.totalCost * 100), // Convert to cents
          currency: 'usd',
          metadata: {
            booking_id: bookingId,
            vehicle_id: bookingData.vehicle?.vehicle_id,
            user_id: user?.user_id
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Payment intent error:', errorText);
        throw new Error(`Failed to initialize payment: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setClientSecret(data.clientSecret);
      
    } catch (error: any) {
      console.error('Stripe initialization error:', error);
      setStripeError('Failed to initialize payment. Please try another method.');
      toast.error('Payment system temporarily unavailable');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStripeSuccess = async (paymentIntentId: string) => {
    try {
      console.log('✅ Stripe payment successful, creating booking...');
      
      const authToken = localStorage.getItem('token') || localStorage.getItem('access_token');
      
      if (!authToken) {
        toast.error('Please login again to complete your booking');
        navigate('/login');
        return;
      }

      // Extract vehicle_id correctly
      const vehicleId = bookingData.vehicle?.vehicle_id;
      
      if (!vehicleId) {
        toast.error('Vehicle information is missing. Please select a vehicle again.');
        console.error('❌ Missing vehicle_id:', bookingData);
        return;
      }

      // Get or generate booking ID
      const bookingId = localStorage.getItem('tempBookingId') || generateUUID();

      // ✅ FIXED: Send clean, properly formatted data to backend
      // The backend expects GUIDs for user_id, vehicle_id, and will generate booking_id
      const paymentConfirmationPayload = {
        paymentIntentId: paymentIntentId,
        userId: user?.user_id,  // This should be a GUID
        vehicleId: vehicleId,    // This should be a GUID
        bookingId: bookingId,    // This should be a GUID
        amount: bookingData.totalCost,
        startDate: new Date(bookingData.startDate).toISOString(),
        endDate: new Date(bookingData.endDate).toISOString(),
        paymentMethod: 'stripe'
      };

      console.log('📦 Sending payment confirmation to backend:', {
        paymentIntentId: paymentConfirmationPayload.paymentIntentId,
        userId: paymentConfirmationPayload.userId,
        vehicleId: paymentConfirmationPayload.vehicleId,
        bookingId: paymentConfirmationPayload.bookingId,
        amount: paymentConfirmationPayload.amount
      });

      // Validate GUID format
      const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      
      if (!guidRegex.test(bookingId)) {
        throw new Error(`Invalid booking ID format. Expected GUID, got: ${bookingId}`);
      }
      
      if (vehicleId && !guidRegex.test(vehicleId)) {
        console.warn('⚠️ Vehicle ID is not in standard GUID format:', vehicleId);
      }
      
      if (user?.user_id && !guidRegex.test(user.user_id)) {
        console.warn('⚠️ User ID is not in standard GUID format:', user.user_id);
      }

      // Call backend to confirm the payment and create booking
      const response = await fetch(`${API_BASE_URL}/api/payments/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(paymentConfirmationPayload)
      });

      console.log('📥 Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Backend error response:', errorText);
        
        // Parse error for better user feedback
        let errorMessage = 'Failed to confirm booking';
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || errorJson.error || errorMessage;
        } catch {
          if (errorText.includes('uniqueidentifier')) {
            errorMessage = 'Database error: Invalid ID format. Please contact support.';
          } else if (errorText.includes('foreign key') || errorText.includes('reference')) {
            errorMessage = 'Booking creation failed. Please try selecting the vehicle again.';
          }
        }
        
        throw new Error(errorMessage);
      }

      const result = await response.json();
      
      if (result.success) {
        toast.success('Payment confirmed! Booking created successfully.');
        // Clean up temporary data
        localStorage.removeItem('currentBooking');
        localStorage.removeItem('tempBookingId');
        
        navigate('/booking-success', {
          state: {
            bookingId: result.bookingId || bookingId,
            amount: bookingData.totalCost,
            vehicle: `${bookingData.vehicle?.vehicle_spec?.manufacturer} ${bookingData.vehicle?.vehicle_spec?.model}`,
            paymentId: paymentIntentId,
            paymentMethod: 'stripe'
          }
        });
      } else {
        throw new Error(result.error || 'Booking creation failed');
      }
    } catch (error: any) {
      console.error('Booking confirmation error:', error);
      
      // User-friendly error messages
      if (error.message.includes('uniqueidentifier') || error.message.includes('GUID') || error.message.includes('UUID')) {
        toast.error('System configuration error. Please contact support.');
      } else if (error.message.includes('foreign key') || error.message.includes('vehicle')) {
        toast.error('Vehicle information error. Please try selecting the vehicle again.');
        navigate('/inventory');
      } else if (error.message.includes('user') || error.message.includes('session')) {
        toast.error('Session expired. Please login again.');
        navigate('/login');
      } else {
        toast.error(`Payment confirmation failed: ${error.message.substring(0, 60)}`);
      }
    }
  };

  const handleConfirmBooking = async () => {
    if (!user) {
      toast.error('Please login to complete your booking');
      navigate('/login');
      return;
    }

    // For M-Pesa payments
    if (selectedPaymentMethod === 'mpesa') {
      if (!isValidMpesaNumber(mpesaNumber)) {
        toast.error('Please enter a valid M-Pesa phone number (e.g., 254712345678)');
        return;
      }
      await processMpesaPayment();
    }
    // For PayPal payments
    else if (selectedPaymentMethod === 'paypal') {
      await processPaypalPayment();
    }
  };

  const processMpesaPayment = async () => {
    setIsProcessing(true);
    try {
      // Generate a proper GUID for the booking
      const bookingId = generateUUID();
      
      const paymentData = {
        bookingId: bookingId,
        amount: bookingData.totalCost,
        paymentMethod: 'mpesa',
        transactionId: generateTransactionId(),
        mpesaNumber: mpesaNumber,
        userId: user?.user_id,
        vehicleId: bookingData.vehicle?.vehicle_id,
        startDate: new Date(bookingData.startDate).toISOString(),
        endDate: new Date(bookingData.endDate).toISOString()
      };

      // In a real app, you would call your backend API here
      const response = await fetch(`${API_BASE_URL}/api/payments/mpesa`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || localStorage.getItem('access_token')}`
        },
        body: JSON.stringify(paymentData)
      });

      if (!response.ok) {
        throw new Error('M-Pesa payment failed');
      }

      const result = await response.json();
      
      if (result.success) {
        toast.success('M-Pesa payment initiated! Please check your phone to complete.');
        
        // Wait for payment confirmation (in real app, you might use webhooks or polling)
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        localStorage.removeItem('currentBooking');
        navigate('/booking-success', {
          state: {
            bookingId: result.bookingId || bookingId,
            amount: bookingData.totalCost,
            vehicle: `${bookingData.vehicle?.vehicle_spec?.manufacturer} ${bookingData.vehicle?.vehicle_spec?.model}`,
            paymentMethod: 'mpesa'
          }
        });
      } else {
        throw new Error(result.error || 'M-Pesa payment failed');
      }
    } catch (error: any) {
      toast.error('M-Pesa payment failed. Please try again.');
      console.error('M-Pesa payment error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const processPaypalPayment = async () => {
    setIsProcessing(true);
    try {
      // Generate a proper GUID for the booking
      const bookingId = generateUUID();
      
      const paymentData = {
        bookingId: bookingId,
        amount: bookingData.totalCost,
        paymentMethod: 'paypal',
        userId: user?.user_id,
        vehicleId: bookingData.vehicle?.vehicle_id,
        startDate: new Date(bookingData.startDate).toISOString(),
        endDate: new Date(bookingData.endDate).toISOString()
      };

      // In a real app, you would integrate with PayPal API here
      const response = await fetch(`${API_BASE_URL}/api/payments/paypal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || localStorage.getItem('access_token')}`
        },
        body: JSON.stringify(paymentData)
      });

      if (!response.ok) {
        throw new Error('PayPal payment failed');
      }

      const result = await response.json();
      
      if (result.success) {
        toast.success('PayPal payment processed successfully!');
        localStorage.removeItem('currentBooking');
        navigate('/booking-success', {
          state: {
            bookingId: result.bookingId || bookingId,
            amount: bookingData.totalCost,
            vehicle: `${bookingData.vehicle?.vehicle_spec?.manufacturer} ${bookingData.vehicle?.vehicle_spec?.model}`,
            paymentMethod: 'paypal'
          }
        });
      } else {
        throw new Error(result.error || 'PayPal payment failed');
      }
    } catch (error: any) {
      toast.error('PayPal payment failed. Please try again.');
      console.error('PayPal payment error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const isValidMpesaNumber = (number: string): boolean => {
    const mpesaRegex = /^(254|0)(7[0-9]|1[0-1])[0-9]{7}$/;
    return mpesaRegex.test(number.replace(/\s+/g, ''));
  };

  // ✅ FIXED: Generate proper UUID/GUID format for SQL Server uniqueidentifier
  const generateUUID = (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  const generateTransactionId = (): string => {
    return 'MPESA-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6).toUpperCase();
  };

  const handleCancel = (): void => {
    localStorage.removeItem('tempBookingId');
    navigate(-1);
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
                        <p className="text-slate-500 text-sm">Pay securely with Stripe</p>
                      </div>
                    </label>
                  </div>

                  {selectedPaymentMethod === 'card' && (
                    <div className="space-y-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                      {stripeError ? (
                        <div className="text-center py-4">
                          <div className="text-red-600 mb-2">
                            <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <p className="text-red-600 font-medium mb-2">Payment System Error</p>
                          <p className="text-slate-600 text-sm mb-4">{stripeError}</p>
                          <button 
                            onClick={initializeStripePayment}
                            className="btn btn-sm btn-outline"
                            disabled={isProcessing}
                          >
                            {isProcessing ? 'Initializing...' : 'Try Again'}
                          </button>
                        </div>
                      ) : clientSecret ? (
                        <Elements stripe={stripePromise} options={{ clientSecret }}>
                          <StripeCheckoutForm 
                            amount={bookingData.totalCost}
                            onSuccess={handleStripeSuccess}
                          />
                        </Elements>
                      ) : (
                        <div className="text-center py-4">
                          <div className="loading loading-spinner loading-md text-primary mb-2"></div>
                          <p className="text-slate-600 text-sm">Initializing secure payment...</p>
                        </div>
                      )}
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

                  {/* PayPal Payment */}
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

              {/* Action Buttons - Only show for non-Stripe payments */}
              {selectedPaymentMethod !== 'card' && (
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
              )}

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