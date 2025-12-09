// import React from 'react'
// import { RouterProvider, createBrowserRouter, Navigate } from 'react-router-dom'
// import { Provider } from 'react-redux'
// import { store } from './store/store'
// import ProtectedRoute from './components/auth/ProtectedRoute'

// // --- LAYOUTS ---
// import PublicLayout from '../src/components/Dashboard/PublicLayout'
// import AuthLayout from '../src/components/Dashboard/AuthLayout'
// import DashboardLayout from '../src/components/Dashboard/DashboardLayout'
// import AdminDashboardLayout from '../src/components/Dashboard/admDashboardLayout'

// // --- PAGES ---
// import Home from './pages/home'
// import Inventory from './pages/inventory'
// import VehicleDetail from './pages/vehicleDetail'
// import Login from './pages/login'
// import Register from './pages/register'
// import AboutUs from './pages/AboutUs'
// import Contact from './pages/contact'

// // --- USER DASHBOARD PAGES ---
// import UserDashboard from './pages/userPages/userDashboard'
// import UserProfile from './pages/userPages/userprofile'
// import BookingHistory from './pages/userPages/bookingHistory'
// import PaymentHistory from './pages/userPages/Payment History'
// import SupportTickets from './pages/userPages/Support Tickets'
// import AccountSettings from './pages/userPages/acountSetting'

// // --- ADMIN DASHBOARD PAGES ---
// import AdminDashboard from './pages/admpages/AdminDashboard'
// import AdminProfile from './pages/admpages/adProfile'
// import AdminUsers from './pages/admpages/AdminUsers'
// import AdminVehicles from './pages/admpages/AdminVehicles'
// import AdminBookings from './pages/admpages/AdminBookings'
// import AdminPayments from './pages/admpages/admnPayments'
// import AdminAnalytics from './pages/admpages/AdminAnalytics'
// import AdminSupport from './pages/admpages/AdminSupport'
// import AdminSettings from './pages/admpages/AdminSettings'
// import AddVehicle from './pages/admpages/AddVehicle'
// import AdminContent from './pages/admpages/AdminContent'

// // --- PROTECTED PAGES (Standalone) ---
// import Checkout from './pages/checkout'
// import BookingSuccess from './pages/BookingSuccess'

// const App: React.FC = () => {
//     const router = createBrowserRouter([
//         // 1. MAIN ROUTE WITH HOMEPAGE AND PUBLIC LAYOUT
//         {
//             path: '/',
//             element: <PublicLayout />,
//             children: [
//                 { index: true, element: <Home /> }, // Homepage as index route
//                 { path: 'inventory', element: <Inventory /> },
//                 { path: 'about', element: <AboutUs /> },
//                 { path: 'vehicles/:id', element: <VehicleDetail /> },
//                 { path: 'contact', element: <Contact /> },
                
//                 // Protected standalone pages
//                 {
//                     path: 'checkout',
//                     element: (
//                         <ProtectedRoute allowedRoles={['customer', 'user', 'admin']}>
//                             <Checkout />
//                         </ProtectedRoute>
//                     )
//                 },
//                 {
//                     path: 'booking-success',
//                     element: (
//                         <ProtectedRoute allowedRoles={['customer', 'user', 'admin']}>
//                             <BookingSuccess />
//                         </ProtectedRoute>
//                     )
//                 },
//             ],
//         },

//         // 2. AUTH PAGES (Login/Register) - Separate layout with redirect
//         {
//             path: '/',
//             element: <AuthLayout />,
//             children: [
//                 { 
//                     path: 'login', 
//                     element: <Login /> 
//                 },
//                 { 
//                     path: 'register', 
//                     element: <Register /> 
//                 },
//             ],
//         },

//         // 3. USER DASHBOARD ROUTES
//         {
//             path: '/dashboard',
//             element: (
//                 <ProtectedRoute allowedRoles={['customer', 'user']}>
//                     <DashboardLayout />
//                 </ProtectedRoute>
//             ),
//             children: [
//                 { index: true, element: <UserDashboard /> },
//                 { path: 'profile', element: <UserProfile /> },
//                 { path: 'bookings', element: <BookingHistory /> },
//                 { path: 'payments', element: <PaymentHistory /> },
//                 { path: 'support', element: <SupportTickets /> },
//                 { path: 'settings', element: <AccountSettings /> },
//             ],
//         },

//         // 4. ADMIN DASHBOARD ROUTES
//         {
//             path: '/admin',
//             element: (
//                 <ProtectedRoute allowedRoles={['admin']}>
//                     <AdminDashboardLayout />
//                 </ProtectedRoute>
//             ),
//             children: [
//                 { index: true, element: <AdminDashboard /> },
//                 { path: 'dashboard', element: <AdminDashboard /> },
//                 { path: 'profile', element: <AdminProfile /> },
//                 { path: 'users', element: <AdminUsers /> },
//                 { path: 'vehicles', element: <AdminVehicles /> },
//                 { path: 'vehicles/add', element: <AddVehicle /> },
//                 { path: 'bookings', element: <AdminBookings /> },
//                 { path: 'payments', element: <AdminPayments /> },
//                 { path: 'analytics', element: <AdminAnalytics /> },
//                 { path: 'support', element: <AdminSupport /> },
//                 { path: 'settings', element: <AdminSettings /> },
//                 { path: 'content', element: <AdminContent /> },
//             ],
//         },

//         // 5. CATCH ALL / REDIRECTS
//         {
//             path: '*',
//             element: <Navigate to="/" replace />,
//         },
//     ])

//     return (
//         <Provider store={store}>
//             <RouterProvider router={router} />
//         </Provider>
//     )
// }

// export default App


// import React from 'react'
// import { RouterProvider, createBrowserRouter, Navigate } from 'react-router-dom'
// import { Provider } from 'react-redux'
// import { store } from './store/store'
// import ProtectedRoute from './components/auth/ProtectedRoute'

// // --- LAYOUTS ---
// import PublicLayout from '../src/components/Dashboard/PublicLayout'
// import AuthLayout from '../src/components/Dashboard/AuthLayout' // Add this
// import DashboardLayout from '../src/components/Dashboard/DashboardLayout'
// import AdminDashboardLayout from '../src/components/Dashboard/admDashboardLayout'

// // --- PAGES ---
// import Home from './pages/home'
// import Inventory from './pages/inventory'
// import VehicleDetail from './pages/vehicleDetail'
// import Login from './pages/login'
// import Register from './pages/register'
// import AboutUs from './pages/AboutUs'
// import Contact from './pages/contact'

// // --- USER DASHBOARD PAGES ---
// import UserDashboard from './pages/userPages/userDashboard'
// import UserProfile from './pages/userPages/userprofile'
// import BookingHistory from './pages/userPages/bookingHistory'
// import PaymentHistory from './pages/userPages/Payment History'
// import SupportTickets from './pages/userPages/Support Tickets'
// import AccountSettings from './pages/userPages/acountSetting'

// // --- ADMIN DASHBOARD PAGES ---
// import AdminDashboard from './pages/admpages/AdminDashboard'
// import AdminProfile from './pages/admpages/adProfile'
// import AdminUsers from './pages/admpages/AdminUsers'
// import AdminVehicles from './pages/admpages/AdminVehicles'
// import AdminBookings from './pages/admpages/AdminBookings'
// import AdminPayments from './pages/admpages/admnPayments'
// import AdminAnalytics from './pages/admpages/AdminAnalytics'
// import AdminSupport from './pages/admpages/AdminSupport'
// import AdminSettings from './pages/admpages/AdminSettings'
// import AddVehicle from './pages/admpages/AddVehicle'
// import AdminContent from './pages/admpages/AdminContent'

// // --- PROTECTED PAGES (Standalone) ---
// import Checkout from './pages/checkout'
// import BookingSuccess from './pages/BookingSuccess'

// const App: React.FC = () => {
//     const router = createBrowserRouter([
//         // 1. HOMEPAGE (Standalone)
//         {
//             path: '/',
//             element: <Home />
//         },

//         // 2. AUTH PAGES (Login/Register) - Redirects if already logged in
//         {
//             path: '/',
//             element: <AuthLayout />,
//             children: [
//                 { 
//                     path: 'login', 
//                     element: <Login /> 
//                 },
//                 { 
//                     path: 'register', 
//                     element: <Register /> 
//                 },
//             ],
//         },

//         // 3. PUBLIC PAGES (No redirection)
//         {
//             path: '/',
//             element: <PublicLayout />,
//             children: [
//                 { path: 'inventory', element: <Inventory /> },
//                 { path: 'about', element: <AboutUs /> },
//                 { path: 'vehicles/:id', element: <VehicleDetail /> },
//                 { path: 'contact', element: <Contact /> },
                
//                 // Protected standalone pages
//                 {
//                     path: 'checkout',
//                     element: (
//                         <ProtectedRoute allowedRoles={['customer', 'admin']}>
//                             <Checkout />
//                         </ProtectedRoute>
//                     )
//                 },
//                 {
//                     path: 'booking-success',
//                     element: (
//                         <ProtectedRoute allowedRoles={['customer', 'admin']}>
//                             <BookingSuccess />
//                         </ProtectedRoute>
//                     )
//                 },
//             ],
//         },

//         // 4. USER DASHBOARD ROUTES
//         {
//             path: '/dashboard',
//             element: (
//                 <ProtectedRoute allowedRoles={['customer', 'user']}>
//                     <DashboardLayout />
//                 </ProtectedRoute>
//             ),
//             children: [
//                 { index: true, element: <UserDashboard /> },
//                 { path: 'profile', element: <UserProfile /> },
//                 { path: 'bookings', element: <BookingHistory /> },
//                 { path: 'payments', element: <PaymentHistory /> },
//                 { path: 'support', element: <SupportTickets /> },
//                 { path: 'settings', element: <AccountSettings /> },
//             ],
//         },

//         // 5. ADMIN DASHBOARD ROUTES
//         {
//             path: '/admin',
//             element: (
//                 <ProtectedRoute allowedRoles={['admin']}>
//                     <AdminDashboardLayout />
//                 </ProtectedRoute>
//             ),
//             children: [
//                 { index: true, element: <AdminDashboard /> },
//                 { path: 'dashboard', element: <AdminDashboard /> },
//                 { path: 'profile', element: <AdminProfile /> },
//                 { path: 'users', element: <AdminUsers /> },
//                 { path: 'vehicles', element: <AdminVehicles /> },
//                 { path: 'vehicles/add', element: <AddVehicle /> },
//                 { path: 'bookings', element: <AdminBookings /> },
//                 { path: 'payments', element: <AdminPayments /> },
//                 { path: 'analytics', element: <AdminAnalytics /> },
//                 { path: 'support', element: <AdminSupport /> },
//                 { path: 'settings', element: <AdminSettings /> },
//                 { path: 'content', element: <AdminContent /> },
//             ],
//         },

//         // 6. CATCH ALL / REDIRECTS
//         {
//             path: '*',
//             element: <Navigate to="/" replace />,
//         },
//     ])

//     return (
//         <Provider store={store}>
//             <RouterProvider router={router} />
//         </Provider>
//     )
// }

// export default App








import React from 'react'


import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store/store'


// Public Pages
import Home from './pages/home'
import Inventory from './pages/inventory'
import VehicleDetail from './pages/vehicleDetail'
import Login from './pages/login'
import Register from './pages/register'
import AboutUs from './pages/AboutUs'
import Contact from './pages/contact'

// User Dashboard Pages
import UserDashboard from './pages/userPages/userDashboard'
import UserProfile from './pages/userPages/userprofile'
import BookingHistory from './pages/userPages/bookingHistory'
import PaymentHistory from './pages/userPages/Payment History'
import SupportTickets from './pages/userPages/Support Tickets'
import AccountSettings from './pages/userPages/acountSetting'

// Admin Dashboard Pages
import AdminDashboard from './pages/admpages/AdminDashboard'
import AdminProfile from './pages/admpages/adProfile'
import AdminUsers from './pages/admpages/AdminUsers'
import AdminVehicles from './pages/admpages/AdminVehicles'
import AdminBookings from './pages/admpages/AdminBookings'
import AdminPayments from './pages/admpages/admnPayments'
import AdminAnalytics from './pages/admpages/AdminAnalytics'
import AdminSupport from './pages/admpages/AdminSupport'
import AdminSettings from './pages/admpages/AdminSettings'
import AddVehicle from './pages/admpages/AddVehicle'
import AdminContent from './pages/admpages/AdminContent'

// Protected Pages
import Checkout from './pages/checkout'
import BookingSuccess from './pages/BookingSuccess'
import PublicRoute from './components/auth/PublicRoute'
import ProtectedRoute from './components/auth/ProtectedRoute'
import UserRoute from './components/auth/UserRoute'
import AdminRoute from './components/auth/AdminRoute'

const App: React.FC = () => {
    const router = createBrowserRouter([
        // Public Routes - Accessible only to non-authenticated users
        {
            path: '/login',
            element: (
                <PublicRoute>
                    <Login />
                </PublicRoute>
            )
        },
        {
            path: '/register',
            element: (
                <PublicRoute>
                    <Register />
                </PublicRoute>
            )
        },
        
        // Public Routes - Accessible to everyone (even authenticated users)
        {
            path: '/',
            element: <Home />
        },
        {
            path: '/inventory',
            element: <Inventory />
        },
        {
            path: '/about',
            element: <AboutUs />
        },
        {
            path: '/vehicles/:id',
            element: <VehicleDetail />
        },
        {
            path: '/contact',
            element: <Contact />
        },

        // Protected Routes - Require any authenticated user
        {
            path: '/checkout',
            element: (
                <ProtectedRoute>
                    <Checkout />
                </ProtectedRoute>
            )
        },
        {
            path: '/booking-success',
            element: (
                <ProtectedRoute>
                    <BookingSuccess />
                </ProtectedRoute>
            )
        },

        // User Routes - Only for customers
        {
            path: '/dashboard',
            element: (
                <UserRoute>
                    <UserDashboard />
                </UserRoute>
            )
        },
        {
            path: '/dashboard/profile',
            element: (
                <UserRoute>
                    <UserProfile />
                </UserRoute>
            )
        },
        {
            path: '/dashboard/bookings',
            element: (
                <UserRoute>
                    <BookingHistory />
                </UserRoute>
            )
        },
        {
            path: '/dashboard/payments',
            element: (
                <UserRoute>
                    <PaymentHistory />
                </UserRoute>
            )
        },
        {
            path: '/dashboard/support',
            element: (
                <UserRoute>
                    <SupportTickets />
                </UserRoute>
            )
        },
        {
            path: '/dashboard/settings',
            element: (
                <UserRoute>
                    <AccountSettings />
                </UserRoute>
            )
        },

        // Admin Routes - Only for admins
        {
            path: '/admin',
            element: (
                <AdminRoute>
                    <AdminDashboard />
                </AdminRoute>
            )
        },
        {
            path: '/admin/dashboard',
            element: (
                <AdminRoute>
                    <AdminDashboard />
                </AdminRoute>
            )
        },
        {
            path: '/admin/profile',
            element: (
                <AdminRoute>
                    <AdminProfile />
                </AdminRoute>
            )
        },
        {
            path: '/admin/users',
            element: (
                <AdminRoute>
                    <AdminUsers />
                </AdminRoute>
            )
        },
        {
            path: '/admin/vehicles',
            element: (
                <AdminRoute>
                    <AdminVehicles />
                </AdminRoute>
            )
        },
        {
            path: '/admin/vehicles/add',
            element: (
                <AdminRoute>
                    <AddVehicle />
                </AdminRoute>
            )
        },
        {
            path: '/admin/bookings',
            element: (
                <AdminRoute>
                    <AdminBookings />
                </AdminRoute>
            )
        },
        {
            path: '/admin/payments',
            element: (
                <AdminRoute>
                    <AdminPayments />
                </AdminRoute>
            )
        },
        {
            path: '/admin/analytics',
            element: (
                <AdminRoute>
                    <AdminAnalytics />
                </AdminRoute>
            )
        },
        {
            path: '/admin/support',
            element: (
                <AdminRoute>
                    <AdminSupport />
                </AdminRoute>
            )
        },
        {
            path: '/admin/settings',
            element: (
                <AdminRoute>
                    <AdminSettings />
                </AdminRoute>
            )
        },
        {
            path: '/admin/content',
            element: (
                <AdminRoute>
                    <AdminContent />
                </AdminRoute>
            )
        }
    ])

    return (
        // <Provider store={store}>
            <RouterProvider router={router} />
        // </Provider>
    )
}

export default App







