import React from 'react'
import Header from '../components/Header'
import Footer from '../components/footer'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useLoginMutation } from '../API/AuthApi'
import { toast, Toaster } from 'sonner'
import { useDispatch } from 'react-redux'
import { setCredentials } from '../slice/Authslice'
import { type LoginFormValues } from '../types/types'
const Login: React.FC = () => {
  const [loginUser, { isLoading }] = useLoginMutation();
  const { register, handleSubmit, formState: { errors, isValid } } = useForm<LoginFormValues>({
    mode: 'onChange'
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLoginForm = async (data: LoginFormValues) => {
    try {
        const response = await loginUser(data).unwrap();
        
        // Debug: Check the actual structure
        console.log('🔍 Login Response:', response);
        console.log('User object:', response.user);
        console.log('User role:', response.user?.role);
        console.log('🎯 ACTUAL ROLE FROM API:', `"${response.user.role}"`);
        
        dispatch(setCredentials({ 
            token: response.token, 
            user: response.user 
        }));

        toast.success(response.message || `Welcome back, ${response.user.first_name || response.user.email}!`);

        // Handle all possible role cases
        if (response.user.role === 'admin') {
            // Admin goes to admin dashboard
            navigate('/admin/dashboard', { replace: true });
        } else if (response.user.role === 'user' || response.user.role === 'customer') {
            // Both 'user' and 'customer' roles go to inventory
            navigate('/inventory', { replace: true });
        } else {
            // Fallback for any other role - log for debugging
            console.warn(`⚠️ Unknown role "${response.user.role}", redirecting to inventory`);
            navigate('/inventory', { replace: true });
        }
    } catch (error: any) {
        console.error('Login failed:', error);
        toast.error(error.data?.message || 'Login failed. Please check your credentials and try again.');
    }
  };



// const Login: React.FC = () => {
//   const [loginUser, { isLoading }] = useLoginMutation();
//   const { register, handleSubmit, formState: { errors, isValid } } = useForm<LoginFormValues>({
//     mode: 'onChange'
//   });
//   const dispatch = useDispatch();
//   const navigate = useNavigate();



//   const handleLoginForm = async (data: LoginFormValues) => {
//     try {
//         const response = await loginUser(data).unwrap();
        
//         // Debug: Check the actual structure
//         console.log('🔍 Login Response:', response);
//         console.log('User object:', response.user);
//         console.log('User role:', response.user?.role);
       
        
//         dispatch(setCredentials({ 
//             token: response.token, 
//             user: response.user 
//         }));

//         toast.success(response.message || `Welcome back, ${response.user.first_name || response.user.email}!`);

      
//             if (response.user.role === 'admin') {
//                 navigate('/admin/dashboard');
//             } else {
//                 navigate('/inventory');
// //             } 
//     } catch (error: any) {
//         console.error('Login failed:', error);
//         toast.error(error.data?.message || 'Login failed. Please check your credentials and try again.');
//     }
// };



  return (
    <div className="min-h-screen flex flex-col">
      <Toaster position="top-right" richColors />
      <Header />
      <div className="flex-grow bg-gray-50 flex items-center justify-center py-10 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 bg-white rounded-3xl overflow-hidden w-full max-w-6xl shadow-2xl">
          {/* Image Section */}                    
          <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-8">
            <div className="text-center">
              <img
                src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
                alt="Vehicle Rental Login"
                className="w-full max-w-96 rounded-2xl h-auto shadow-xl"
              />
              <h3 className="text-2xl font-bold text-gray-900 mt-6">Welcome Back</h3>
              <p className="text-gray-600 mt-2 max-w-md">
                Access your vehicle rental account and discover amazing vehicles for your next adventure
              </p>
            </div>
          </div>

          {/* Form Section */}
          <div className="flex items-center justify-center p-8">
            <div className="w-full max-w-96 bg-white rounded-2xl p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-blue-800 mb-2">
                  Welcome Back
                </h2>
                <p className="text-gray-500 text-base">
                  Sign in to your VehicleRent account
                </p>
              </div>

              <form className="flex flex-col gap-6" onSubmit={handleSubmit(handleLoginForm)}>
                {/* Email Field */}
                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 mb-2"
                    htmlFor="email"
                  >
                    Email Address
                  </label>
                  <input
                    {...register('email', { 
                      required: "Email address is required", 
                      pattern: { 
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 
                        message: "Please enter a valid email address" 
                      } 
                    })}
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm bg-white transition-all duration-300 outline-none focus:border-blue-800 focus:ring-2 focus:ring-blue-100"
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 mb-2"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <input
                    {...register('password', { 
                      required: "Password is required", 
                      minLength: { 
                        value: 6, 
                        message: "Password must be at least 6 characters" 
                      } 
                    })}
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm bg-white transition-all duration-300 outline-none focus:border-blue-800 focus:ring-2 focus:ring-blue-100"
                  />
                  {errors.password && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Forgot Password Link */}
                <div className="text-right">
                  <Link 
                    to="/forgot-password" 
                    className="text-blue-600 no-underline text-sm hover:text-blue-700 transition-colors font-medium"
                  >
                    Forgot your password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !isValid}
                  className="bg-blue-800 hover:bg-blue-900 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-4 border-none rounded-lg text-base font-semibold cursor-pointer transition-all duration-300 mt-2 shadow-md hover:shadow-lg w-full flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Signing In...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </button>

                <div className="flex flex-col gap-3 text-center mt-6">
                  <Link 
                    to="/" 
                    className="text-blue-800 no-underline flex items-center justify-center gap-2 text-sm hover:text-blue-900 transition-colors font-medium"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Return to Homepage
                  </Link>
                  <div className="text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link 
                      to="/register" 
                      className="text-blue-600 no-underline hover:text-blue-700 transition-colors font-medium"
                    >
                      Create account
                    </Link>
                  </div>
                </div>
              </form>

              {/* Demo Accounts Info */}
              <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-900 text-sm mb-3">Demo Accounts:</h4>
                <div className="text-xs text-blue-700 space-y-2">
                  <p><strong className="font-semibold">User Account:</strong> user@demo.com / password</p>
                  <p><strong className="font-semibold">Admin Account:</strong> admin@demo.com / password</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Login