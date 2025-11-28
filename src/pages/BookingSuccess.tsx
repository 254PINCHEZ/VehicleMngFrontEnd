import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/footer';

const BookingSuccess: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      
      <div className="flex items-center justify-center min-h-[80vh] px-4">
        <div className="max-w-md w-full text-center">
          {/* Success Icon */}
          <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-8">
            <svg className="w-12 h-12 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Booking Confirmed!
          </h1>
          <p className="text-gray-600 mb-8 text-lg leading-relaxed">
            Your vehicle reservation has been successfully confirmed. A confirmation email has been sent to your inbox.
          </p>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Link 
              to="/" 
              className="btn btn-primary btn-lg w-full text-white font-semibold py-4 rounded-xl hover:shadow-lg transition-all duration-300 block"
            >
              Return to Home
            </Link>
            <Link 
              to="/inventory" 
              className="btn btn-outline btn-lg w-full font-semibold py-4 rounded-xl hover:shadow-lg transition-all duration-300 block"
            >
              Browse More Vehicles
            </Link>
          </div>

          {/* Additional Info */}
          <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <p className="text-sm text-blue-700">
              <span className="font-semibold">Need help?</span> Contact our support team for any assistance.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BookingSuccess;