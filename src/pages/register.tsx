import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast, Toaster } from 'sonner';
import Header from '../components/Header';
import Footer from '../components/footer';
import { type RegisterFormValues } from '../types/types';
import { useRegisterMutation } from '../API/AuthApi';

const Register: React.FC = () => {
  // RTK Query mutation hook for registration 
  const [registerUser, { isLoading }] = useRegisterMutation();
  
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>();
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmitForm = async (data: RegisterFormValues) => {
    try {
      const response = await registerUser(data).unwrap();
      console.log('Registration successful:', response);
      toast.success('Registration successful! Please check your email to verify your account.');
      
      // Navigate to login page after successful registration
      navigate('/login');
    } catch (error: any) {
      console.error('Registration failed:', error);
      toast.error(error.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Toaster position="top-right" richColors />
      <Header />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-4 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 bg-white rounded-3xl overflow-hidden w-full max-w-6xl shadow-2xl">
          {/* Form Section */}
          <div className="flex items-center justify-center p-8">
            <div className="w-full max-w-96 bg-white rounded-2xl p-8">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-blue-800 mb-1">
                  Join VehicleRent
                </h2>
                <p className="text-gray-500 text-base">
                  Create your account
                </p>
              </div>

              <form className="flex flex-col gap-5" onSubmit={handleSubmit(handleSubmitForm)}>
                {/* First Row - First Name & Last Name */}
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label
                      className="block text-sm font-medium text-gray-700 mb-1.5"
                      htmlFor="first_name"
                    >
                      First Name
                    </label>
                    <input
                      {...register('first_name', { 
                        required: "First name is required", 
                        minLength: { value: 2, message: "First name must be at least 2 characters" } 
                      })}
                      type="text"
                      id="first_name"
                      name="first_name"
                      placeholder="First Name"
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg text-sm bg-transparent transition-all duration-300 outline-none focus:border-blue-800 focus:ring-2 focus:ring-blue-100"
                    />
                    {errors.first_name && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        {errors.first_name.message}
                      </p>
                    )}
                  </div>

                  <div className="flex-1">
                    <label
                      className="block text-sm font-medium text-gray-700 mb-1.5"
                      htmlFor="last_name"
                    >
                      Last Name
                    </label>
                    <input
                      {...register('last_name', { 
                        required: "Last name is required", 
                        minLength: { value: 2, message: "Last name must be at least 2 characters" } 
                      })}
                      type="text"
                      id="last_name"
                      name="last_name"
                      placeholder="Last Name"
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg text-sm bg-transparent transition-all duration-300 outline-none focus:border-blue-800 focus:ring-2 focus:ring-blue-100"
                    />
                    {errors.last_name && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        {errors.last_name.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <input
                    {...register('email', { 
                      required: "Email is required", 
                      pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" } 
                    })}
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Email address"
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg text-sm bg-transparent transition-all duration-300 outline-none focus:border-blue-800 focus:ring-2 focus:ring-blue-100"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Phone Number Field */}
                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                    htmlFor="contact_phone"
                  >
                    Phone Number
                  </label>
                  <input
                    {...register('contact_phone', { 
                      pattern: { value: /^[0-9]{10,15}$/, message: "Invalid phone number" } 
                    })}
                    type="tel"
                    id="contact_phone"
                    name="contact_phone"
                    placeholder="Phone Number"
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg text-sm bg-transparent transition-all duration-300 outline-none focus:border-blue-800 focus:ring-2 focus:ring-blue-100"
                  />
                  {errors.contact_phone && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      {errors.contact_phone.message}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <input
                    {...register('password', { 
                      required: "Password is required", 
                      minLength: { value: 6, message: "Password must be at least 6 characters" } 
                    })}
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Password"
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg text-sm bg-transparent transition-all duration-300 outline-none focus:border-blue-800 focus:ring-2 focus:ring-blue-100"
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-4 border-none rounded-lg text-base font-semibold cursor-pointer transition-all duration-300 mt-2 shadow-md hover:shadow-lg w-full flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Creating Account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </button>

                <div className="flex flex-col gap-2 text-center mt-4">
                  <Link to="/" className="text-blue-800 no-underline flex items-center justify-center gap-1 text-sm hover:text-blue-900 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Go to HomePage
                  </Link>
                  <Link to="/login" className="text-blue-600 no-underline flex items-center justify-center gap-1 text-sm hover:text-blue-700 transition-colors">
                    Already have an account? Login
                  </Link>
                </div>
              </form>
            </div>
          </div>

          {/* Image Section */}
          <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-8">
            <div className="text-center">
              <img
                src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
                alt="Vehicle Rental Registration"
                className="w-full max-w-96 rounded-2xl h-auto shadow-xl"
              />
              <h3 className="text-2xl font-bold text-gray-900 mt-6">Start Your Journey</h3>
              <p className="text-gray-600 mt-2 max-w-md">
                Join thousands of satisfied customers who trust us for their vehicle rental needs. 
                Experience seamless booking and premium service.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Register;