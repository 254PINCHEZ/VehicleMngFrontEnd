// import React, { useState, useEffect } from 'react';
// import AdminDashboardLayout from '../../components/Dashboard/admDashboardLayout';
// import { 
//   BarChart3, 
//   TrendingUp, 
//   Users, 
//   Car, 
//   Calendar, 
//   DollarSign, 
//   XCircle, 
//   AlertCircle,
//   PieChart,
//   LineChart,
//   TrendingDown,
//   Loader2,
//   Eye,
//   RefreshCw,
//   Shield,
//   CheckCircle2,
//   Globe,
//   Activity,
//   ShieldAlert,
//   Lock,
//   UserCog,
//   Key
// } from 'lucide-react';
// import { analyticsApi } from '../../API/analyticsApi';
// import { useSelector } from 'react-redux';
// import type { RootState } from '../../store/store';
// import { skipToken } from '@reduxjs/toolkit/query';
// import { useNavigate } from 'react-router-dom';

// // Updated interface based on your API definition
// interface AnalyticsData {
//   totalRevenue: number;
//   totalBookings: number;
//   totalUsers: number;
//   activeVehicles: number;
//   revenueChange: number;
//   bookingChange: number;
//   userChange: number;
//   utilizationChange: number;
//   monthlyRevenue?: Array<{ month: string; revenue: number }>;
//   bookingTrends?: Array<{ date: string; count: number }>;
//   userGrowth?: Array<{ date: string; count: number }>;
//   topPerformingVehicles?: Array<{ 
//     vehicle_id: string; 
//     name: string; 
//     revenue: number; 
//     bookings: number;
//     utilization: number;
//   }>;
//   popularVehicleTypes?: Array<{ 
//     type: string; 
//     count: number; 
//     revenue: number;
//   }>;
// }

// // Default empty analytics data
// const defaultAnalyticsData: AnalyticsData = {
//   totalRevenue: 0,
//   totalBookings: 0,
//   totalUsers: 0,
//   activeVehicles: 0,
//   revenueChange: 0,
//   bookingChange: 0,
//   userChange: 0,
//   utilizationChange: 0,
//   monthlyRevenue: [],
//   bookingTrends: [],
//   userGrowth: [],
//   topPerformingVehicles: [],
//   popularVehicleTypes: []
// };

// const AdminAnalytics: React.FC = () => {
//   const { isAuthenticated, token, user } = useSelector((state: RootState) => state.auth);
//   const navigate = useNavigate();
//   const [period, setPeriod] = useState<'day' | 'week' | 'month' | 'quarter' | 'year'>('month');
//   const [showDebug, setShowDebug] = useState(false);
//   const [testResults, setTestResults] = useState<any[]>([]);
//   const [decodedToken, setDecodedToken] = useState<any>(null);

//   // Debug authentication and token
//   useEffect(() => 
//     {
//     console.log('AdminAnalytics - Auth state:', { 
//       isAuthenticated, 
//       token: token ? 'Token exists' : 'No token',
//       tokenLength: token?.length,
//       user: user
//     });
    
//     console.log('LocalStorage token:', localStorage.getItem('token'));
    
//     // Check if token is a string literal or actual JWT
//     if (token) {
//       if (token === 'Token exists') {
//         console.error('❌ Invalid token format in Redux: string literal instead of actual JWT');
//         // Try to recover from localStorage
//         const localToken = localStorage.getItem('token');
//         if (localToken && localToken !== 'Token exists') {
//           console.log('✅ Found valid token in localStorage:', localToken.substring(0, 50) + '...');
//         }
//       } else {
//         // Valid JWT token - ensure it's in localStorage
//         if (!localStorage.getItem('token') || localStorage.getItem('token') !== token) {
//           localStorage.setItem('token', token);
//           console.log('✅ Synced valid Redux token to localStorage');
//         }
        
//         // Decode JWT token to check user info
//         try {
//           const payload = JSON.parse(atob(token.split('.')[1]));
//           setDecodedToken(payload);
//           console.log('🔍 Decoded JWT Payload:', {
//             userId: payload.sub || payload.userId,
//             role: payload.role,
//             isAdmin: payload.isAdmin,
//             email: payload.email,
//             permissions: payload.permissions,
//             expires: new Date(payload.exp * 1000).toLocaleString()
//           });
//         } catch (e) {
//           console.error('Failed to decode JWT:', e);
//         }
//       }
//     }
    
//     // Log user role info
//     console.log('User role from Redux:', user?.role, user?.role);
//     console.log('Full user object from Redux:', user);
//   }, [isAuthenticated, token, user]);

//   // Handle authentication failure
//   useEffect(() => {
//     if (!isAuthenticated || !token) {
//       console.warn('User not authenticated, redirecting to login...');
//       // navigate('/login');
//     }
//   }, [isAuthenticated, token, navigate]);

//   // API call with proper authentication check
//   const { 
//     data: analyticsResponse, 
//     isLoading: analyticsIsLoading, 
//     error,
//     refetch,
//     isError,
//     isFetching
//   } = analyticsApi.useGetAnalyticsDataQuery(
//     isAuthenticated && token && token !== 'Token exists' ? { period } : skipToken
//   );

//   // Extract analytics data from response
//   const analyticsData = analyticsResponse?.data || defaultAnalyticsData;

//   // Test alternative endpoints
//   const { 
//     data: altData1,
//     isLoading: altLoading1 
//   } = analyticsApi.useGetAnalyticsDataAlt1Query(
//     isAuthenticated && token && token !== 'Token exists' ? { period } : skipToken
//   );
  
//   const { 
//     data: altData2,
//     isLoading: altLoading2 
//   } = analyticsApi.useGetAnalyticsDataAlt2Query(
//     isAuthenticated && token && token !== 'Token exists' ? { period } : skipToken
//   );

//   // Handle API errors
//   useEffect(() => {
//     if (error) {
//       const errorStatus = (error as any).status;
//       const errorData = (error as any).data;
      
//       console.log('📊 Analytics API Error Details:', {
//         status: errorStatus,
//         message: errorData?.message,
//         code: errorData?.code,
//         data: errorData
//       });
      
//       if (errorStatus === 403) {
//         console.error('🔒 403 Forbidden - User lacks permissions for analytics endpoint');
//         console.log('User role info:', {
//           decodedTokenRole: decodedToken?.role,
//           reduxUserRole: user?.role,
//           isAdminFromToken: decodedToken?.isAdmin,
//           isAdminFromRedux: user?.isAdmin
//         });
//       }
      
//       if (errorStatus === 401) {
//         console.error('🔐 401 Unauthorized - Token invalid or expired');
//         localStorage.removeItem('token');
//         localStorage.removeItem('user');
//         navigate('/login');
//       }
//     }
//   }, [error, navigate, decodedToken, user]);

//   // Test all possible endpoints
//   const testAllEndpoints = async () => {
//     const endpoints = [
//       'api/analytics',
//       'api/admin/analytics',
//       'api/dashboard/analytics',
//       'api/dashboard/admin/analytics',
//       'admin/analytics',
//       'analytics',
//       'api/analytics/admin'
//     ];
    
//     const tokenToUse = localStorage.getItem('token') || token;
//     const results = [];
    
//     for (const endpoint of endpoints) {
//       try {
//         const response = await fetch(`http://localhost:3001/${endpoint}?period=month`, {
//           headers: {
//             'Authorization': `Bearer ${tokenToUse?.replace('Bearer ', '')}`,
//             'Content-Type': 'application/json'
//           }
//         });
        
//         results.push({
//           endpoint,
//           status: response.status,
//           statusText: response.statusText,
//           ok: response.ok,
//           url: `http://localhost:3001/${endpoint}`
//         });
        
//         if (response.ok) {
//           const data = await response.json();
//           console.log(`✅ ${endpoint}:`, data);
//         }
//       } catch (error: any) {
//         results.push({
//           endpoint,
//           error: error.message,
//           url: `http://localhost:3001/${endpoint}`
//         });
//       }
//     }
    
//     setTestResults(results);
//     console.log('Endpoint Test Results:', results);
//   };

//   // Test token manually
//   const testTokenManually = () => {
//     const tokenToTest = localStorage.getItem('token') || token;
//     if (!tokenToTest) {
//       console.log('No token found');
//       return;
//     }
    
//     console.log('🔍 Token Analysis:', {
//       length: tokenToTest.length,
//       isJWT: tokenToTest.split('.').length === 3,
//       startsWithBearer: tokenToTest.startsWith('Bearer '),
//       firstPart: tokenToTest.substring(0, 50) + '...',
//       rawToken: tokenToTest.replace('Bearer ', '')
//     });
    
//     // Try to decode
//     try {
//       const payload = JSON.parse(atob(tokenToTest.replace('Bearer ', '').split('.')[1]));
//       console.log('✅ Decoded Token Payload:', payload);
//     } catch (e) {
//       console.error('❌ Failed to decode token:', e);
//     }
//   };

//   // Retry function
//   const handleRetry = () => {
//     console.log('Retrying analytics fetch...');
//     refetch();
//   };

//   // SAFE: Format currency with null/undefined check
//   const formatCurrency = (amount: number | undefined | null): string => {
//     if (amount === undefined || amount === null) {
//       return '$0';
//     }
//     return `$${amount.toLocaleString()}`;
//   };

//   // SAFE: Format number with null/undefined check
//   const formatNumber = (num: number | undefined | null): string => {
//     if (num === undefined || num === null) {
//       return '0';
//     }
//     return num.toLocaleString();
//   };

//   // SAFE: Get change value (handle undefined)
//   const getChangeValue = (value?: number): number => {
//     return value !== undefined ? value : 0;
//   };

//   // SAFE: Calculate change color and styling
//   const getChangeStyles = (value: number) => {
//     if (value > 0) return {
//       color: 'text-emerald-400',
//       bg: 'bg-emerald-500/10',
//       border: 'border-emerald-500/20',
//       icon: <TrendingUp className="w-4 h-4" />,
//       text: 'Growing'
//     };
//     if (value < 0) return {
//       color: 'text-red-400',
//       bg: 'bg-red-500/10',
//       border: 'border-red-500/20',
//       icon: <TrendingDown className="w-4 h-4" />,
//       text: 'Declining'
//     };
//     return {
//       color: 'text-slate-400',
//       bg: 'bg-slate-500/10',
//       border: 'border-slate-500/20',
//       icon: <Activity className="w-4 h-4" />,
//       text: 'Stable'
//     };
//   };

//   // Check if error is 403 Forbidden
//   const isForbiddenError = isError && (error as any).status === 403;

//   // Check if we have valid analytics data
//   const hasValidData = analyticsResponse?.success && analyticsData;

//   // Authentication check at the beginning
//   if (!isAuthenticated || !token) {
//     return (
//       <AdminDashboardLayout>
//         <div className="flex flex-col items-center justify-center min-h-[60vh]">
//           <div className="bg-gradient-to-br from-red-900/20 to-red-900/5 border border-red-800/30 rounded-2xl p-8 text-center max-w-md">
//             <AlertCircle className="mx-auto text-red-400 mb-4" size={56} />
//             <h3 className="text-2xl font-bold text-white mb-3">Authentication Required</h3>
//             <p className="text-slate-300 mb-6">
//               You need to be logged in to view analytics.
//             </p>
//             <button 
//               onClick={() => navigate('/login')}
//               className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors"
//             >
//               Go to Login
//             </button>
//           </div>
//         </div>
//       </AdminDashboardLayout>
//     );
//   }

//   return (
//     <AdminDashboardLayout>
//       {/* Header - Professional Gradient */}
//       <div className="mb-8 bg-gradient-to-r from-slate-800 via-slate-800 to-slate-900 p-6 rounded-2xl border border-slate-700/50 shadow-xl">
//         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//           <div>
//             <div className="flex items-center gap-3 mb-2">
//               <div className="p-3 rounded-xl bg-gradient-to-br from-purple-600 to-violet-600 shadow-lg">
//                 <BarChart3 className="w-6 h-6 text-white" />
//               </div>
//               <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-300 bg-clip-text text-transparent">
//                 Advanced Analytics
//               </h1>
//             </div>
//             <p className="text-slate-400 flex items-center">
//               <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-400" />
//               Data-driven insights and performance metrics
//               {decodedToken && (
//                 <span className="ml-4 text-sm bg-slate-700/50 px-2 py-1 rounded">
//                   Role: {decodedToken.role || 'Unknown'}
//                 </span>
//               )}
//             </p>
//           </div>
          
//           <div className="flex items-center gap-3">
//             <select 
//               value={period}
//               onChange={(e) => setPeriod(e.target.value as any)}
//               className="bg-slate-800/50 border border-slate-700/50 text-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
//             >
//               <option value="day">Today</option>
//               <option value="week">Last 7 Days</option>
//               <option value="month">Last 30 Days</option>
//               <option value="quarter">Last Quarter</option>
//               <option value="year">Last Year</option>
//             </select>
            
//             <button
//               onClick={() => setShowDebug(!showDebug)}
//               className="px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors flex items-center gap-2"
//             >
//               <Eye className="w-4 h-4" />
//               Debug
//             </button>
            
//             {isError && (
//               <button 
//                 onClick={handleRetry}
//                 disabled={isFetching}
//                 className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-medium flex items-center gap-2 disabled:opacity-50"
//               >
//                 <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
//                 {isFetching ? 'Retrying...' : 'Retry'}
//               </button>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Debug Panel */}
//       {showDebug && (
//         <div className="mb-6 p-6 bg-gradient-to-br from-blue-900/20 to-blue-900/5 border border-blue-800/30 rounded-2xl">
//           <div className="flex items-center justify-between mb-4">
//             <div className="flex items-center gap-2">
//               <Key className="w-5 h-5 text-blue-400" />
//               <span className="font-medium text-blue-300">Debug Information</span>
//             </div>
//             <div className="flex gap-2">
//               <button 
//                 onClick={testTokenManually}
//                 className="px-3 py-1.5 text-sm bg-blue-700/30 hover:bg-blue-700/50 text-blue-300 rounded-lg border border-blue-600/30"
//               >
//                 Test Token
//               </button>
//               <button 
//                 onClick={testAllEndpoints}
//                 className="px-3 py-1.5 text-sm bg-purple-700/30 hover:bg-purple-700/50 text-purple-300 rounded-lg border border-purple-600/30"
//               >
//                 Test Endpoints
//               </button>
//             </div>
//           </div>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <div className="text-sm text-blue-400">
//                 <span className="font-medium">Period:</span> {period}
//               </div>
//               <div className="text-sm text-blue-400">
//                 <span className="font-medium">Token Status:</span> 
//                 <span className={`ml-2 ${token && token !== 'Token exists' ? 'text-emerald-400' : 'text-red-400'}`}>
//                   {token && token !== 'Token exists' ? '✓ Valid' : '✗ Invalid'}
//                 </span>
//               </div>
//               <div className="text-sm text-blue-400">
//                 <span className="font-medium">User Role:</span> 
//                 <span className="ml-2 text-amber-400">
//                   {decodedToken?.role || user?.role || 'Unknown'}
//                 </span>
//               </div>
//               <div className="text-sm text-blue-400">
//                 <span className="font-medium">API Error:</span> 
//                 <span className={`ml-2 ${isError ? 'text-red-400' : 'text-emerald-400'}`}>
//                   {isError ? `✗ ${(error as any).status}` : '✓ None'}
//                 </span>
//               </div>
//               <div className="text-sm text-blue-400">
//                 <span className="font-medium">Has Data:</span> 
//                 <span className={`ml-2 ${hasValidData ? 'text-emerald-400' : 'text-red-400'}`}>
//                   {hasValidData ? '✓ Yes' : '✗ No'}
//                 </span>
//               </div>
//             </div>
            
//             <div className="space-y-2">
//               <div className="text-sm text-blue-400">
//                 <span className="font-medium">Alternative Endpoint 1:</span> 
//                 <span className={`ml-2 ${altData1 ? 'text-emerald-400' : 'text-slate-400'}`}>
//                   {altLoading1 ? 'Loading...' : altData1 ? '✓ Data' : '✗ No data'}
//                 </span>
//               </div>
//               <div className="text-sm text-blue-400">
//                 <span className="font-medium">Alternative Endpoint 2:</span> 
//                 <span className={`ml-2 ${altData2 ? 'text-emerald-400' : 'text-slate-400'}`}>
//                   {altLoading2 ? 'Loading...' : altData2 ? '✓ Data' : '✗ No data'}
//                 </span>
//               </div>
//             </div>
//           </div>
          
//           {/* Test Results */}
//           {testResults.length > 0 && (
//             <div className="mt-4 pt-4 border-t border-blue-800/30">
//               <h4 className="text-sm font-medium text-blue-300 mb-2">Endpoint Test Results:</h4>
//               <div className="max-h-40 overflow-y-auto">
//                 {testResults.map((result, index) => (
//                   <div key={index} className="text-xs mb-1 p-2 bg-slate-800/30 rounded">
//                     <div className="font-mono text-blue-300">{result.endpoint}</div>
//                     <div className={`text-xs ${result.ok ? 'text-emerald-400' : 'text-red-400'}`}>
//                       Status: {result.status} {result.statusText}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       )}

//       {/* 403 Forbidden Error */}
//       {isForbiddenError ? (
//         <div className="bg-gradient-to-br from-amber-900/20 to-amber-900/5 rounded-2xl shadow-xl border border-amber-800/30 p-8 text-center">
//           <div className="w-24 h-24 bg-amber-900/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-amber-800/30">
//             <ShieldAlert className="text-amber-400" size={48} />
//           </div>
//           <h3 className="text-2xl font-bold text-white mb-3">Access Restricted</h3>
//           <p className="text-slate-300 mb-6 max-w-md mx-auto">
//             Admin privileges are required to view analytics. 
//             {(decodedToken?.role || user?.role) && (
//               <span className="block mt-2 text-amber-300">
//                 Current role: <strong>{decodedToken?.role || user?.role}</strong>
//               </span>
//             )}
//           </p>
//           <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
//             <button 
//               onClick={() => navigate('/dashboard')}
//               className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium border border-slate-600 transition-colors flex items-center gap-2"
//             >
//               <UserCog className="w-4 h-4" />
//               Go to User Dashboard
//             </button>
//             <button 
//               onClick={() => {
//                 localStorage.removeItem('token');
//                 localStorage.removeItem('user');
//                 navigate('/login');
//               }}
//               className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-medium transition-colors flex items-center gap-2"
//             >
//               <Lock className="w-4 h-4" />
//               Switch Account
//             </button>
//             <button 
//               onClick={testAllEndpoints}
//               className="px-6 py-3 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 rounded-xl font-medium border border-blue-500/30 transition-colors flex items-center gap-2"
//             >
//               <Key className="w-4 h-4" />
//               Test Access
//             </button>
//           </div>
//         </div>
//       ) : isError ? (
//         /* Other Error States */
//         <div className="bg-gradient-to-br from-red-900/20 to-red-900/5 rounded-2xl shadow-xl border border-red-800/30 p-8 text-center">
//           <div className="w-24 h-24 bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-800/30">
//             <XCircle className="text-red-400" size={48} />
//           </div>
//           <h3 className="text-2xl font-bold text-white mb-3">
//             {(error as any).status === 401 ? 'Session Expired' : 'Data Load Failed'}
//           </h3>
//           <p className="text-slate-300 mb-6 max-w-md mx-auto">
//             {(error as any).status === 401 
//               ? 'Your authentication session has expired. Please log in again to continue.'
//               : `Unable to fetch analytics data. ${(error as any).data?.message || 'Please check your connection and try again.'}`}
//           </p>
//           <div className="flex gap-3 justify-center">
//             <button 
//               onClick={handleRetry}
//               className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium border border-slate-600 transition-colors"
//             >
//               Try Again
//             </button>
//             {(error as any).status === 401 && (
//               <button 
//                 onClick={() => {
//                   localStorage.removeItem('token');
//                   navigate('/login');
//                 }}
//                 className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors"
//               >
//                 Go to Login
//               </button>
//             )}
//           </div>
//         </div>
//       ) : analyticsIsLoading ? (
//         // Loading state - Professional
//         <div className="flex flex-col items-center justify-center py-20">
//           <Loader2 className="w-16 h-16 text-blue-500 animate-spin mb-6" />
//           <p className="text-slate-300 text-lg font-medium">Loading analytics data...</p>
//           <p className="text-slate-400 text-sm mt-2">Please wait while we fetch the latest insights</p>
//         </div>
//       ) : !hasValidData ? (
//         /* Empty State - Professional */
//         <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl shadow-xl border border-slate-700/50 p-12 text-center">
//           <BarChart3 className="mx-auto mb-6 text-purple-400" size={64} />
//           <h3 className="text-2xl font-bold text-white mb-3">No Analytics Data Available</h3>
//           <p className="text-slate-400 max-w-md mx-auto mb-8">
//             Analytics data will appear once you have sufficient activity and transactions in your system.
//           </p>
//           <div className="flex gap-4 justify-center">
//             <button className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium border border-slate-600 transition-colors">
//               <Globe className="w-4 h-4 inline mr-2" />
//               View Docs
//             </button>
//             <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors">
//               <Shield className="w-4 h-4 inline mr-2" />
//               Setup Analytics
//             </button>
//           </div>
//         </div>
//       ) : (
//         <>
//           {/* Success State - Display Analytics Data */}
//           {/* Key Metrics - Professional Design */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//             {/* Total Revenue */}
//             <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-emerald-500/30">
//               <div className="flex items-start justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-slate-400 mb-2">Total Revenue</p>
//                   <p className="text-3xl font-bold text-white">
//                     {formatCurrency(analyticsData.totalRevenue)}
//                   </p>
//                   <div className="flex items-center mt-3">
//                     <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs ${getChangeStyles(analyticsData.revenueChange).bg} ${getChangeStyles(analyticsData.revenueChange).color} border ${getChangeStyles(analyticsData.revenueChange).border}`}>
//                       {getChangeStyles(analyticsData.revenueChange).icon}
//                       <span className="ml-1.5">{getChangeValue(analyticsData.revenueChange)}%</span>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
//                   <DollarSign className="w-6 h-6 text-emerald-400" />
//                 </div>
//               </div>
//             </div>

//             {/* Total Bookings */}
//             <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-blue-500/30">
//               <div className="flex items-start justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-slate-400 mb-2">Total Bookings</p>
//                   <p className="text-3xl font-bold text-white">
//                     {formatNumber(analyticsData.totalBookings)}
//                   </p>
//                   <div className="flex items-center mt-3">
//                     <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs ${getChangeStyles(analyticsData.bookingChange).bg} ${getChangeStyles(analyticsData.bookingChange).color} border ${getChangeStyles(analyticsData.bookingChange).border}`}>
//                       {getChangeStyles(analyticsData.bookingChange).icon}
//                       <span className="ml-1.5">{getChangeValue(analyticsData.bookingChange)}%</span>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
//                   <Calendar className="w-6 h-6 text-blue-400" />
//                 </div>
//               </div>
//             </div>

//             {/* Total Users */}
//             <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-purple-500/30">
//               <div className="flex items-start justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-slate-400 mb-2">Total Users</p>
//                   <p className="text-3xl font-bold text-white">
//                     {formatNumber(analyticsData.totalUsers)}
//                   </p>
//                   <div className="flex items-center mt-3">
//                     <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs ${getChangeStyles(analyticsData.userChange).bg} ${getChangeStyles(analyticsData.userChange).color} border ${getChangeStyles(analyticsData.userChange).border}`}>
//                       {getChangeStyles(analyticsData.userChange).icon}
//                       <span className="ml-1.5">{getChangeValue(analyticsData.userChange)}%</span>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
//                   <Users className="w-6 h-6 text-purple-400" />
//                 </div>
//               </div>
//             </div>

//             {/* Active Vehicles */}
//             <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-amber-500/30">
//               <div className="flex items-start justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-slate-400 mb-2">Active Vehicles</p>
//                   <p className="text-3xl font-bold text-white">
//                     {formatNumber(analyticsData.activeVehicles)}
//                   </p>
//                   <div className="flex items-center mt-3">
//                     <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs ${getChangeStyles(analyticsData.utilizationChange).bg} ${getChangeStyles(analyticsData.utilizationChange).color} border ${getChangeStyles(analyticsData.utilizationChange).border}`}>
//                       {getChangeStyles(analyticsData.utilizationChange).icon}
//                       <span className="ml-1.5">{getChangeValue(analyticsData.utilizationChange)}%</span>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
//                   <Car className="w-6 h-6 text-amber-400" />
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Performance Summary - Professional */}
//           <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl shadow-xl border border-slate-700/50 p-6 mb-8">
//             <div className="flex items-center justify-between mb-6">
//               <div>
//                 <h3 className="text-xl font-semibold text-white">Performance Insights</h3>
//                 <p className="text-sm text-slate-400 mt-1">Key performance indicators and trends</p>
//               </div>
//               <div className="px-3 py-1.5 rounded-lg bg-slate-700/50 text-slate-300 text-xs border border-slate-600/50">
//                 Real-time Analysis
//               </div>
//             </div>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//               <div className="bg-gradient-to-br from-emerald-900/20 to-emerald-900/5 p-5 rounded-xl border border-emerald-800/30">
//                 <div className="text-sm text-slate-400 mb-2 flex items-center">
//                   <TrendingUp className="w-4 h-4 mr-2 text-emerald-400" />
//                   Revenue Status
//                 </div>
//                 <div className="text-xl font-bold text-white mb-1">
//                   {getChangeStyles(analyticsData.revenueChange).text}
//                 </div>
//                 <div className={`text-sm ${getChangeStyles(analyticsData.revenueChange).color}`}>
//                   {getChangeValue(analyticsData.revenueChange)}% monthly change
//                 </div>
//               </div>
              
//               <div className="bg-gradient-to-br from-blue-900/20 to-blue-900/5 p-5 rounded-xl border border-blue-800/30">
//                 <div className="text-sm text-slate-400 mb-2 flex items-center">
//                   <Calendar className="w-4 h-4 mr-2 text-blue-400" />
//                   Booking Activity
//                 </div>
//                 <div className="text-xl font-bold text-white mb-1">
//                   {getChangeStyles(analyticsData.bookingChange).text}
//                 </div>
//                 <div className={`text-sm ${getChangeStyles(analyticsData.bookingChange).color}`}>
//                   {getChangeValue(analyticsData.bookingChange)}% change
//                 </div>
//               </div>
              
//               <div className="bg-gradient-to-br from-purple-900/20 to-purple-900/5 p-5 rounded-xl border border-purple-800/30">
//                 <div className="text-sm text-slate-400 mb-2 flex items-center">
//                   <Users className="w-4 h-4 mr-2 text-purple-400" />
//                   User Growth
//                 </div>
//                 <div className="text-xl font-bold text-white mb-1">
//                   {getChangeStyles(analyticsData.userChange).text}
//                 </div>
//                 <div className={`text-sm ${getChangeStyles(analyticsData.userChange).color}`}>
//                   {getChangeValue(analyticsData.userChange)}% monthly growth
//                 </div>
//               </div>
              
//               <div className="bg-gradient-to-br from-amber-900/20 to-amber-900/5 p-5 rounded-xl border border-amber-800/30">
//                 <div className="text-sm text-slate-400 mb-2 flex items-center">
//                   <Car className="w-4 h-4 mr-2 text-amber-400" />
//                   Fleet Utilization
//                 </div>
//                 <div className="text-xl font-bold text-white mb-1">
//                   {getChangeStyles(analyticsData.utilizationChange).text}
//                 </div>
//                 <div className={`text-sm ${getChangeStyles(analyticsData.utilizationChange).color}`}>
//                   {getChangeValue(analyticsData.utilizationChange)}% change
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Additional Analytics Data (if available) */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//             {/* Monthly Revenue Trend */}
//             {analyticsData.monthlyRevenue && analyticsData.monthlyRevenue.length > 0 && (
//               <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl shadow-xl border border-slate-700/50 p-6">
//                 <div className="flex items-center justify-between mb-6">
//                   <div>
//                     <h3 className="text-xl font-semibold text-white">Monthly Revenue Trend</h3>
//                     <p className="text-sm text-slate-400 mt-1">Revenue performance over time</p>
//                   </div>
//                   <LineChart className="w-5 h-5 text-emerald-400" />
//                 </div>
//                 <div className="overflow-x-auto">
//                   <table className="w-full">
//                     <thead>
//                       <tr className="border-b border-slate-700/50">
//                         <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Month</th>
//                         <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Revenue</th>
//                         <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Growth</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {analyticsData.monthlyRevenue.slice(0, 6).map((item, index) => (
//                         <tr 
//                           key={index} 
//                           className="border-b border-slate-700/30 hover:bg-slate-800/50 transition-colors"
//                         >
//                           <td className="py-4 px-4 font-medium text-white">{item.month}</td>
//                           <td className="py-4 px-4 font-bold text-emerald-400">
//                             {formatCurrency(item.revenue)}
//                           </td>
//                           <td className="py-4 px-4">
//                             <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
//                               +{Math.round(Math.random() * 20)}%
//                             </span>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             )}

//             {/* Top Performing Vehicles */}
//             {analyticsData.topPerformingVehicles && analyticsData.topPerformingVehicles.length > 0 && (
//               <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl shadow-xl border border-slate-700/50 p-6">
//                 <div className="flex items-center justify-between mb-6">
//                   <div>
//                     <h3 className="text-xl font-semibold text-white">Top Performing Vehicles</h3>
//                     <p className="text-sm text-slate-400 mt-1">Highest revenue generating vehicles</p>
//                   </div>
//                   <PieChart className="w-5 h-5 text-blue-400" />
//                 </div>
//                 <div className="overflow-x-auto">
//                   <table className="w-full">
//                     <thead>
//                       <tr className="border-b border-slate-700/50">
//                         <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Vehicle</th>
//                         <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Bookings</th>
//                         <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Revenue</th>
//                         <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Utilization</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {analyticsData.topPerformingVehicles.slice(0, 5).map((vehicle, index) => (
//                         <tr 
//                           key={index} 
//                           className="border-b border-slate-700/30 hover:bg-slate-800/50 transition-colors"
//                         >
//                           <td className="py-4 px-4 font-medium text-white">{vehicle.name}</td>
//                           <td className="py-4 px-4 font-bold text-blue-400">{vehicle.bookings}</td>
//                           <td className="py-4 px-4 font-bold text-emerald-400">
//                             {formatCurrency(vehicle.revenue)}
//                           </td>
//                           <td className="py-4 px-4">
//                             <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20">
//                               {vehicle.utilization}%
//                             </span>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Quick Stats Footer */}
//           <div className="mt-8 bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl shadow-xl border border-slate-700/50 p-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//               <div className="text-center">
//                 <div className="text-sm text-slate-400 mb-2">Avg. Revenue/Day</div>
//                 <div className="text-2xl font-bold text-white">$1,250</div>
//                 <div className="text-xs text-emerald-400 mt-1">↗ 12.5% increase</div>
//               </div>
              
//               <div className="text-center">
//                 <div className="text-sm text-slate-400 mb-2">Conversion Rate</div>
//                 <div className="text-2xl font-bold text-white">12.5%</div>
//                 <div className="text-xs text-blue-400 mt-1">↗ 2.3% improvement</div>
//               </div>
              
//               <div className="text-center">
//                 <div className="text-sm text-slate-400 mb-2">Customer Satisfaction</div>
//                 <div className="text-2xl font-bold text-white">94.2%</div>
//                 <div className="text-xs text-purple-400 mt-1">↗ 1.8% increase</div>
//               </div>
              
//               <div className="text-center">
//                 <div className="text-sm text-slate-400 mb-2">Peak Hours</div>
//                 <div className="text-2xl font-bold text-white">2PM-5PM</div>
//                 <div className="text-xs text-amber-400 mt-1">↗ 45% more bookings</div>
//               </div>
//             </div>
//           </div>
//         </>
//       )}
//     </AdminDashboardLayout>
//   );
// };

// export default AdminAnalytics;

import React, { useState, useEffect } from 'react';
import AdminDashboardLayout from '../../components/Dashboard/admDashboardLayout';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Car, 
  Calendar, 
  DollarSign, 
  XCircle, 
  AlertCircle,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  TrendingDown,
  Loader2,
  Eye,
  RefreshCw,
  Shield,
  CheckCircle2,
  Globe,
  Activity,
  ShieldAlert,
  Lock,
  UserCog,
  Key,
  Download,
  Filter,
  Target,
  Clock,
  Star,
  Zap
} from 'lucide-react';
import { analyticsApi } from '../../API/analyticsApi';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { skipToken } from '@reduxjs/toolkit/query';
import { useNavigate } from 'react-router-dom';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  ScatterChart,
  Scatter,
  ZAxis
} from 'recharts';

// Updated interface based on your API definition
interface AnalyticsData {
  totalRevenue: number;
  totalBookings: number;
  totalUsers: number;
  activeVehicles: number;
  revenueChange: number;
  bookingChange: number;
  userChange: number;
  utilizationChange: number;
  monthlyRevenue?: Array<{ month: string; revenue: number }>;
  bookingTrends?: Array<{ date: string; count: number }>;
  userGrowth?: Array<{ date: string; count: number }>;
  topPerformingVehicles?: Array<{ 
    vehicle_id: string; 
    name: string; 
    revenue: number; 
    bookings: number;
    utilization: number;
  }>;
  popularVehicleTypes?: Array<{ 
    type: string; 
    count: number; 
    revenue: number;
  }>;
}

// Default empty analytics data
const defaultAnalyticsData: AnalyticsData = {
  totalRevenue: 0,
  totalBookings: 0,
  totalUsers: 0,
  activeVehicles: 0,
  revenueChange: 0,
  bookingChange: 0,
  userChange: 0,
  utilizationChange: 0,
  monthlyRevenue: [],
  bookingTrends: [],
  userGrowth: [],
  topPerformingVehicles: [],
  popularVehicleTypes: []
};

// Mock data for charts when API data is limited
const generateMockChartData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  return {
    monthlyRevenue: months.map(month => ({
      month,
      revenue: Math.floor(Math.random() * 50000) + 20000,
      bookings: Math.floor(Math.random() * 300) + 100,
      users: Math.floor(Math.random() * 200) + 50
    })),
    
    weeklyBookings: weekDays.map(day => ({
      day,
      bookings: Math.floor(Math.random() * 150) + 50,
      revenue: Math.floor(Math.random() * 25000) + 10000
    })),
    
    vehicleTypes: [
      { type: 'SUV', value: 35, color: '#8884d8', revenue: 125000 },
      { type: 'Sedan', value: 25, color: '#82ca9d', revenue: 89000 },
      { type: 'Truck', value: 20, color: '#ffc658', revenue: 75000 },
      { type: 'Van', value: 12, color: '#ff8042', revenue: 45000 },
      { type: 'Sports', value: 8, color: '#0088fe', revenue: 68000 }
    ],
    
    hourlyUsage: Array.from({ length: 24 }, (_, i) => ({
      hour: `${i}:00`,
      usage: Math.floor(Math.random() * 80) + 20,
      bookings: Math.floor(Math.random() * 30) + 5
    })),
    
    performanceTrend: months.slice(0, 6).map(month => ({
      month,
      revenue: Math.floor(Math.random() * 60000) + 25000,
      target: 55000,
      efficiency: Math.floor(Math.random() * 30) + 70
    })),
    
    regionalPerformance: [
      { region: 'North', revenue: 45000, bookings: 120, fill: '#8884d8' },
      { region: 'South', revenue: 38000, bookings: 95, fill: '#82ca9d' },
      { region: 'East', revenue: 52000, bookings: 140, fill: '#ffc658' },
      { region: 'West', revenue: 41000, bookings: 110, fill: '#ff8042' },
      { region: 'Central', revenue: 29000, bookings: 80, fill: '#0088fe' }
    ]
  };
};

const AdminAnalytics: React.FC = () => {
  const { isAuthenticated, token, user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const [period, setPeriod] = useState<'day' | 'week' | 'month' | 'quarter' | 'year'>('month');
  const [showDebug, setShowDebug] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [decodedToken, setDecodedToken] = useState<any>(null);
  const [chartData, setChartData] = useState<any>(null);

  // Debug authentication and token
  useEffect(() => {
    console.log('AdminAnalytics - Auth state:', { 
      isAuthenticated, 
      token: token ? 'Token exists' : 'No token',
      tokenLength: token?.length,
      user: user
    });
    
    // Generate mock chart data
    const mockData = generateMockChartData();
    setChartData(mockData);
    
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setDecodedToken(payload);
      } catch (e) {
        console.error('Failed to decode JWT:', e);
      }
    }
  }, [isAuthenticated, token, user]);

  // Handle authentication failure
  useEffect(() => {
    if (!isAuthenticated || !token) {
      console.warn('User not authenticated, redirecting to login...');
      // navigate('/login');
    }
  }, [isAuthenticated, token, navigate]);

  // API call with proper authentication check
  const { 
    data: analyticsResponse, 
    isLoading: analyticsIsLoading, 
    error,
    refetch,
    isError,
    isFetching
  } = analyticsApi.useGetAnalyticsDataQuery(
    isAuthenticated && token && token !== 'Token exists' ? { period } : skipToken
  );

  // Extract analytics data from response
  const analyticsData = analyticsResponse?.data || defaultAnalyticsData;

  // Handle API errors
  useEffect(() => {
    if (error) {
      const errorStatus = (error as any).status;
      const errorData = (error as any).data;
      
      if (errorStatus === 403) {
        console.error('🔒 403 Forbidden - User lacks permissions for analytics endpoint');
      }
      
      if (errorStatus === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }
    }
  }, [error, navigate, decodedToken, user]);

  // Test all possible endpoints
  const testAllEndpoints = async () => {
    const endpoints = [
      'api/analytics',
      'api/admin/analytics',
      'api/dashboard/analytics'
    ];
    
    const tokenToUse = localStorage.getItem('token') || token;
    const results = [];
    
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(`http://localhost:3001/${endpoint}?period=month`, {
          headers: {
            'Authorization': `Bearer ${tokenToUse?.replace('Bearer ', '')}`,
            'Content-Type': 'application/json'
          }
        });
        
        results.push({
          endpoint,
          status: response.status,
          statusText: response.statusText,
          ok: response.ok,
          url: `http://localhost:3001/${endpoint}`
        });
      } catch (error: any) {
        results.push({
          endpoint,
          error: error.message,
          url: `http://localhost:3001/${endpoint}`
        });
      }
    }
    
    setTestResults(results);
  };

  // SAFE: Format currency with null/undefined check
  const formatCurrency = (amount: number | undefined | null): string => {
    if (amount === undefined || amount === null) {
      return '$0';
    }
    return `$${amount.toLocaleString()}`;
  };

  // SAFE: Format number with null/undefined check
  const formatNumber = (num: number | undefined | null): string => {
    if (num === undefined || num === null) {
      return '0';
    }
    return num.toLocaleString();
  };

  // SAFE: Get change value (handle undefined)
  const getChangeValue = (value?: number): number => {
    return value !== undefined ? value : 0;
  };

  // SAFE: Calculate change color and styling
  const getChangeStyles = (value: number) => {
    if (value > 0) return {
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      icon: <TrendingUp className="w-4 h-4" />,
      text: 'Growing'
    };
    if (value < 0) return {
      color: 'text-red-400',
      bg: 'bg-red-500/10',
      border: 'border-red-500/20',
      icon: <TrendingDown className="w-4 h-4" />,
      text: 'Declining'
    };
    return {
      color: 'text-slate-400',
      bg: 'bg-slate-500/10',
      border: 'border-slate-500/20',
      icon: <Activity className="w-4 h-4" />,
      text: 'Stable'
    };
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800/95 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 shadow-2xl">
          <p className="text-sm font-medium text-slate-300 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.name.includes('Revenue') || entry.name.includes('$') ? formatCurrency(entry.value) : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Custom legend for charts
  const renderCustomLegend = (props: any) => {
    const { payload } = props;
    return (
      <div className="flex flex-wrap gap-3 justify-center mt-4">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-slate-400">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  // Check if error is 403 Forbidden
  const isForbiddenError = isError && (error as any).status === 403;

  // Check if we have valid analytics data
  const hasValidData = analyticsResponse?.success && analyticsData;

  // Authentication check at the beginning
  if (!isAuthenticated || !token) {
    return (
      <AdminDashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="bg-gradient-to-br from-red-900/20 to-red-900/5 border border-red-800/30 rounded-2xl p-8 text-center max-w-md">
            <AlertCircle className="mx-auto text-red-400 mb-4" size={56} />
            <h3 className="text-2xl font-bold text-white mb-3">Authentication Required</h3>
            <p className="text-slate-300 mb-6">
              You need to be logged in to view analytics.
            </p>
            <button 
              onClick={() => navigate('/login')}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors"
            >
              Go to Login
            </button>
          </div>
        </div>
      </AdminDashboardLayout>
    );
  }

  return (
    <AdminDashboardLayout>
      {/* Header - Professional Gradient */}
      <div className="mb-8 bg-gradient-to-r from-slate-800 via-slate-800 to-slate-900 p-6 rounded-2xl border border-slate-700/50 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-600 to-violet-600 shadow-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-300 bg-clip-text text-transparent">
                Advanced Analytics Dashboard
              </h1>
            </div>
            <p className="text-slate-400 flex items-center">
              <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-400" />
              Real-time insights and performance metrics
              {decodedToken && (
                <span className="ml-4 text-sm bg-slate-700/50 px-2 py-1 rounded">
                  Role: {decodedToken.role || 'Unknown'}
                </span>
              )}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <select 
              value={period}
              onChange={(e) => setPeriod(e.target.value as any)}
              className="bg-slate-800/50 border border-slate-700/50 text-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
            >
              <option value="day">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
            </select>
            
            <button
              onClick={() => setShowDebug(!showDebug)}
              className="px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              Debug
            </button>
            
            {isError && (
              <button 
                onClick={refetch}
                disabled={isFetching}
                className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-medium flex items-center gap-2 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
                {isFetching ? 'Retrying...' : 'Retry'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Debug Panel */}
      {showDebug && (
        <div className="mb-6 p-6 bg-gradient-to-br from-blue-900/20 to-blue-900/5 border border-blue-800/30 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Key className="w-5 h-5 text-blue-400" />
              <span className="font-medium text-blue-300">Debug Information</span>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={testAllEndpoints}
                className="px-3 py-1.5 text-sm bg-purple-700/30 hover:bg-purple-700/50 text-purple-300 rounded-lg border border-purple-600/30"
              >
                Test Endpoints
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-sm text-blue-400">
                <span className="font-medium">Period:</span> {period}
              </div>
              <div className="text-sm text-blue-400">
                <span className="font-medium">Token Status:</span> 
                <span className={`ml-2 ${token && token !== 'Token exists' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {token && token !== 'Token exists' ? '✓ Valid' : '✗ Invalid'}
                </span>
              </div>
              <div className="text-sm text-blue-400">
                <span className="font-medium">User Role:</span> 
                <span className="ml-2 text-amber-400">
                  {decodedToken?.role || user?.role || 'Unknown'}
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm text-blue-400">
                <span className="font-medium">API Error:</span> 
                <span className={`ml-2 ${isError ? 'text-red-400' : 'text-emerald-400'}`}>
                  {isError ? `✗ ${(error as any).status}` : '✓ None'}
                </span>
              </div>
              <div className="text-sm text-blue-400">
                <span className="font-medium">Has Data:</span> 
                <span className={`ml-2 ${hasValidData ? 'text-emerald-400' : 'text-red-400'}`}>
                  {hasValidData ? '✓ Yes' : '✗ No'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 403 Forbidden Error */}
      {isForbiddenError ? (
        <div className="bg-gradient-to-br from-amber-900/20 to-amber-900/5 rounded-2xl shadow-xl border border-amber-800/30 p-8 text-center">
          <div className="w-24 h-24 bg-amber-900/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-amber-800/30">
            <ShieldAlert className="text-amber-400" size={48} />
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">Access Restricted</h3>
          <p className="text-slate-300 mb-6 max-w-md mx-auto">
            Admin privileges are required to view analytics. 
            {(decodedToken?.role || user?.role) && (
              <span className="block mt-2 text-amber-300">
                Current role: <strong>{decodedToken?.role || user?.role}</strong>
              </span>
            )}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <button 
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium border border-slate-600 transition-colors flex items-center gap-2"
            >
              <UserCog className="w-4 h-4" />
              Go to User Dashboard
            </button>
            <button 
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
              }}
              className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-medium transition-colors flex items-center gap-2"
            >
              <Lock className="w-4 h-4" />
              Switch Account
            </button>
          </div>
        </div>
      ) : isError ? (
        /* Other Error States */
        <div className="bg-gradient-to-br from-red-900/20 to-red-900/5 rounded-2xl shadow-xl border border-red-800/30 p-8 text-center">
          <div className="w-24 h-24 bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-800/30">
            <XCircle className="text-red-400" size={48} />
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">
            {(error as any).status === 401 ? 'Session Expired' : 'Data Load Failed'}
          </h3>
          <p className="text-slate-300 mb-6 max-w-md mx-auto">
            {(error as any).status === 401 
              ? 'Your authentication session has expired. Please log in again to continue.'
              : `Unable to fetch analytics data. ${(error as any).data?.message || 'Please check your connection and try again.'}`}
          </p>
          <div className="flex gap-3 justify-center">
            <button 
              onClick={refetch}
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium border border-slate-600 transition-colors"
            >
              Try Again
            </button>
            {(error as any).status === 401 && (
              <button 
                onClick={() => {
                  localStorage.removeItem('token');
                  navigate('/login');
                }}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors"
              >
                Go to Login
              </button>
            )}
          </div>
        </div>
      ) : analyticsIsLoading ? (
        // Loading state - Professional
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-16 h-16 text-blue-500 animate-spin mb-6" />
          <p className="text-slate-300 text-lg font-medium">Loading analytics data...</p>
          <p className="text-slate-400 text-sm mt-2">Please wait while we fetch the latest insights</p>
        </div>
      ) : !hasValidData && !chartData ? (
        /* Empty State - Professional */
        <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl shadow-xl border border-slate-700/50 p-12 text-center">
          <BarChart3 className="mx-auto mb-6 text-purple-400" size={64} />
          <h3 className="text-2xl font-bold text-white mb-3">No Analytics Data Available</h3>
          <p className="text-slate-400 max-w-md mx-auto mb-8">
            Analytics data will appear once you have sufficient activity and transactions in your system.
          </p>
          <div className="flex gap-4 justify-center">
            <button className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium border border-slate-600 transition-colors">
              <Globe className="w-4 h-4 inline mr-2" />
              View Docs
            </button>
            <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors">
              <Shield className="w-4 h-4 inline mr-2" />
              Setup Analytics
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Key Metrics - Professional Design */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Revenue */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-emerald-500/30 group">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400 mb-2">Total Revenue</p>
                  <p className="text-3xl font-bold text-white">
                    {formatCurrency(analyticsData.totalRevenue)}
                  </p>
                  <div className="flex items-center mt-3">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs ${getChangeStyles(analyticsData.revenueChange).bg} ${getChangeStyles(analyticsData.revenueChange).color} border ${getChangeStyles(analyticsData.revenueChange).border}`}>
                      {getChangeStyles(analyticsData.revenueChange).icon}
                      <span className="ml-1.5">{getChangeValue(analyticsData.revenueChange)}%</span>
                    </div>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-colors">
                  <DollarSign className="w-6 h-6 text-emerald-400" />
                </div>
              </div>
            </div>

            {/* Total Bookings */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-blue-500/30 group">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400 mb-2">Total Bookings</p>
                  <p className="text-3xl font-bold text-white">
                    {formatNumber(analyticsData.totalBookings)}
                  </p>
                  <div className="flex items-center mt-3">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs ${getChangeStyles(analyticsData.bookingChange).bg} ${getChangeStyles(analyticsData.bookingChange).color} border ${getChangeStyles(analyticsData.bookingChange).border}`}>
                      {getChangeStyles(analyticsData.bookingChange).icon}
                      <span className="ml-1.5">{getChangeValue(analyticsData.bookingChange)}%</span>
                    </div>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 group-hover:bg-blue-500/20 transition-colors">
                  <Calendar className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </div>

            {/* Total Users */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-purple-500/30 group">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400 mb-2">Total Users</p>
                  <p className="text-3xl font-bold text-white">
                    {formatNumber(analyticsData.totalUsers)}
                  </p>
                  <div className="flex items-center mt-3">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs ${getChangeStyles(analyticsData.userChange).bg} ${getChangeStyles(analyticsData.userChange).color} border ${getChangeStyles(analyticsData.userChange).border}`}>
                      {getChangeStyles(analyticsData.userChange).icon}
                      <span className="ml-1.5">{getChangeValue(analyticsData.userChange)}%</span>
                    </div>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 group-hover:bg-purple-500/20 transition-colors">
                  <Users className="w-6 h-6 text-purple-400" />
                </div>
              </div>
            </div>

            {/* Active Vehicles */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-amber-500/30 group">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400 mb-2">Active Vehicles</p>
                  <p className="text-3xl font-bold text-white">
                    {formatNumber(analyticsData.activeVehicles)}
                  </p>
                  <div className="flex items-center mt-3">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs ${getChangeStyles(analyticsData.utilizationChange).bg} ${getChangeStyles(analyticsData.utilizationChange).color} border ${getChangeStyles(analyticsData.utilizationChange).border}`}>
                      {getChangeStyles(analyticsData.utilizationChange).icon}
                      <span className="ml-1.5">{getChangeValue(analyticsData.utilizationChange)}%</span>
                    </div>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 group-hover:bg-amber-500/20 transition-colors">
                  <Car className="w-6 h-6 text-amber-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Main Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Revenue Trend Chart */}
            <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl shadow-xl border border-slate-700/50 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                    Revenue Trend
                  </h3>
                  <p className="text-sm text-slate-400 mt-1">Monthly revenue performance</p>
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-400">{period}</span>
                </div>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={chartData?.monthlyRevenue}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="month" 
                      stroke="#94a3b8"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="#94a3b8"
                      fontSize={12}
                      tickFormatter={(value) => `$${value/1000}k`}
                    />
                    <Tooltip 
                      content={<CustomTooltip />}
                      cursor={{ stroke: '#4b5563', strokeWidth: 1 }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      name="Revenue"
                      stroke="#10b981" 
                      fillOpacity={1} 
                      fill="url(#colorRevenue)" 
                      strokeWidth={3}
                      dot={{ r: 4, strokeWidth: 2 }}
                      activeDot={{ r: 6, strokeWidth: 0 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="bookings" 
                      name="Bookings"
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Vehicle Type Distribution */}
            <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl shadow-xl border border-slate-700/50 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                    <Car className="w-5 h-5 text-blue-400" />
                    Vehicle Type Distribution
                  </h3>
                  <p className="text-sm text-slate-400 mt-1">Revenue share by vehicle category</p>
                </div>
                <div className="text-sm px-3 py-1 rounded-lg bg-slate-700/50 text-slate-300 border border-slate-600/50">
                  Market Share
                </div>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData?.vehicleTypes}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ type, percent }) => `${type}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="type"
                    >
                      {chartData?.vehicleTypes.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      content={<CustomTooltip />}
                      formatter={(value, name) => [
                        name === 'value' ? `${value}%` : formatCurrency(value),
                        name === 'value' ? 'Market Share' : 'Revenue'
                      ]}
                    />
                    <Legend content={renderCustomLegend} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
                {chartData?.vehicleTypes.map((vehicle: any, index: number) => (
                  <div key={index} className="text-center">
                    <div className="text-lg font-bold text-white">{vehicle.type}</div>
                    <div className="text-sm text-slate-400">{vehicle.value}%</div>
                    <div className="text-xs text-emerald-400">{formatCurrency(vehicle.revenue)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Second Row Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Booking Activity Chart */}
            <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl shadow-xl border border-slate-700/50 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-purple-400" />
                    Weekly Bookings
                  </h3>
                  <p className="text-sm text-slate-400 mt-1">Daily booking volume</p>
                </div>
                <Clock className="w-5 h-5 text-purple-400" />
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData?.weeklyBookings}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                    <XAxis 
                      dataKey="day" 
                      stroke="#94a3b8"
                      fontSize={12}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis 
                      stroke="#94a3b8"
                      fontSize={12}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip 
                      content={<CustomTooltip />}
                      cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                    />
                    <Bar 
                      dataKey="bookings" 
                      name="Bookings"
                      fill="#8b5cf6" 
                      radius={[4, 4, 0, 0]}
                      maxBarSize={40}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Performance vs Target */}
            <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl shadow-xl border border-slate-700/50 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                    <Target className="w-5 h-5 text-amber-400" />
                    Performance vs Target
                  </h3>
                  <p className="text-sm text-slate-400 mt-1">Revenue targets achievement</p>
                </div>
                <div className="text-sm px-3 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  {Math.round((analyticsData.totalRevenue / 500000) * 100)}% of Target
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData?.performanceTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="month" 
                      stroke="#94a3b8"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="#94a3b8"
                      fontSize={12}
                      tickFormatter={(value) => `$${value/1000}k`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      name="Actual Revenue"
                      stroke="#f59e0b" 
                      strokeWidth={3}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="target" 
                      name="Revenue Target"
                      stroke="#94a3b8" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Hourly Usage Heatmap */}
            <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl shadow-xl border border-slate-700/50 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                    <Zap className="w-5 h-5 text-emerald-400" />
                    Peak Hours Analysis
                  </h3>
                  <p className="text-sm text-slate-400 mt-1">24-hour usage patterns</p>
                </div>
                <div className="text-sm px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Peak: 2PM-5PM
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="hour" 
                      stroke="#94a3b8"
                      fontSize={10}
                      interval={2}
                    />
                    <YAxis 
                      dataKey="usage"
                      stroke="#94a3b8"
                      fontSize={12}
                      label={{ value: 'Usage %', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
                    />
                    <ZAxis 
                      dataKey="bookings"
                      range={[20, 100]}
                    />
                    <Tooltip 
                      content={<CustomTooltip />}
                      cursor={{ strokeDasharray: '3 3' }}
                    />
                    <Scatter 
                      name="Hourly Usage" 
                      data={chartData?.hourlyUsage} 
                      fill="#10b981"
                      shape="circle"
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Regional Performance */}
          <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl shadow-xl border border-slate-700/50 p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-400" />
                  Regional Performance
                </h3>
                <p className="text-sm text-slate-400 mt-1">Revenue distribution across regions</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 text-sm bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 rounded-lg border border-slate-600/50 transition-colors flex items-center gap-2">
                  <Download className="w-3 h-3" />
                  Export
                </button>
              </div>
            </div>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData?.regionalPerformance}
                  layout="vertical"
                  margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" horizontal={false} />
                  <XAxis 
                    type="number" 
                    stroke="#94a3b8"
                    tickFormatter={(value) => `$${value/1000}k`}
                  />
                  <YAxis 
                    type="category" 
                    dataKey="region" 
                    stroke="#94a3b8"
                    width={80}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar 
                    dataKey="revenue" 
                    name="Revenue" 
                    fill="#3b82f6"
                    radius={[0, 4, 4, 0]}
                    maxBarSize={20}
                  />
                  <Bar 
                    dataKey="bookings" 
                    name="Bookings" 
                    fill="#8b5cf6"
                    radius={[0, 4, 4, 0]}
                    maxBarSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Stats & Insights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Efficiency Score */}
            <div className="bg-gradient-to-br from-emerald-900/20 to-emerald-900/5 rounded-2xl border border-emerald-800/30 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-lg font-semibold text-white">Fleet Efficiency</h4>
                  <p className="text-sm text-emerald-300/80">Utilization Rate</p>
                </div>
                <div className="text-3xl font-bold text-emerald-400">
                  {analyticsData.utilizationChange > 0 ? '↗' : '↘'} {Math.abs(analyticsData.utilizationChange)}%
                </div>
              </div>
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart 
                    innerRadius="30%" 
                    outerRadius="100%" 
                    data={[{ name: 'Efficiency', value: 85, fill: '#10b981' }]}
                    startAngle={180}
                    endAngle={0}
                  >
                    <RadialBar 
                      background={{ fill: '#1f2937' }}
                      dataKey="value"
                      cornerRadius={30}
                    />
                    <text 
                      x="50%" 
                      y="50%" 
                      textAnchor="middle" 
                      dominantBaseline="middle"
                      className="text-2xl font-bold fill-white"
                    >
                      85%
                    </text>
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Performers */}
            <div className="bg-gradient-to-br from-blue-900/20 to-blue-900/5 rounded-2xl border border-blue-800/30 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-lg font-semibold text-white">Top Performers</h4>
                  <p className="text-sm text-blue-300/80">This Month</p>
                </div>
                <Star className="w-6 h-6 text-yellow-400" />
              </div>
              <div className="space-y-3">
                {chartData?.topPerformingVehicles?.slice(0, 3).map((vehicle: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                        <span className="text-sm font-bold text-blue-400">{index + 1}</span>
                      </div>
                      <div>
                        <div className="font-medium text-white">{vehicle.name}</div>
                        <div className="text-xs text-slate-400">{vehicle.bookings} bookings</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-emerald-400">{formatCurrency(vehicle.revenue)}</div>
                      <div className="text-xs text-slate-400">{vehicle.utilization}% util.</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Conversion Metrics */}
            <div className="bg-gradient-to-br from-purple-900/20 to-purple-900/5 rounded-2xl border border-purple-800/30 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-lg font-semibold text-white">Conversion Metrics</h4>
                  <p className="text-sm text-purple-300/80">Performance Indicators</p>
                </div>
                <TrendingUp className="w-6 h-6 text-purple-400" />
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-300">Booking Rate</span>
                    <span className="font-medium text-white">12.5%</span>
                  </div>
                  <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-300">Customer Satisfaction</span>
                    <span className="font-medium text-white">94.2%</span>
                  </div>
                  <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '94%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-300">Repeat Customers</span>
                    <span className="font-medium text-white">42.8%</span>
                  </div>
                  <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: '43%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-slate-700/30 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-slate-700/50">
                  <LineChartIcon className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">Trend Analysis</h4>
                  <p className="text-sm text-slate-400">Key insights from data patterns</p>
                </div>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-sm text-slate-300">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  Revenue growing at {Math.abs(analyticsData.revenueChange)}% monthly
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-300">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  Peak booking hours: 2PM-5PM (45% higher)
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-300">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  SUV category leads with 35% market share
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-slate-700/30 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-slate-700/50">
                  <PieChartIcon className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">Recommendations</h4>
                  <p className="text-sm text-slate-400">Actionable insights</p>
                </div>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-sm text-slate-300">
                  <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                  Increase SUV fleet by 20% to meet demand
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-300">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  Optimize pricing during peak hours (2PM-5PM)
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-300">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  Focus marketing on repeat customer acquisition
                </li>
              </ul>
            </div>
          </div>
        </>
      )}
    </AdminDashboardLayout>
  );
};

export default AdminAnalytics;