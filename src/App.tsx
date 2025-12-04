import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Home from './pages/home'
import Inventory from './pages/inventory'
import VehicleDetail from './pages/vehicleDetail'
import Login from './pages/login'
import Register from './pages/register'
import Checkout from './pages/checkout'
import BookingSuccess from './pages/BookingSuccess'

// Import User Dashboard Pages
import UserDashboard from './pages/userPages/userDashboard'
import UserProfile from './pages/userPages/userprofile'
import BookingHistory from './pages/userPages/bookingHistory'
import PaymentHistory from './pages/userPages/Payment History'
import SupportTickets from './pages/userPages/Support Tickets'
import AccountSettings from './pages/userPages/acountSetting'

// Import Admin Dashboard Pages
import AdminDashboard from './pages/admpages/AdminDashboard'
import AdminProfile from './pages/admpages/adProfile'
import AdminUsers from './pages/admpages/AdminUsers'
import AdminVehicles from './pages/admpages/AdminVehicles'
import AdminBookings from './pages/admpages/AdminBookings'
import AdminPayments from './pages/admpages/admnPayments'
import AdminAnalytics from './pages/admpages/AdminAnalytics'
import AdminSupport from './pages/admpages/AdminSupport'
import AdminSettings from './pages/admpages/AdminSettings'
import AddVehicle from './pages/admpages/AddVehicle';

function App() {

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Home />
    },
    {
      path: '/inventory',
      element: <Inventory />
    },
    {
      path: '/vehicles/:id',
      element: <VehicleDetail />
    },
    {
      path: '/register',
      element: <Register />
    },
    {
      path: '/login',
      element: <Login />
    },
    {
      path: '/checkout',
      element: <Checkout />
    },
    {
      path: '/booking-success',
      element: <BookingSuccess />
    },
    {
    path:'/admin/vehicles/add',
     element:<AddVehicle  />
    },

    // User Dashboard routes
    {
      path: '/dashboard',
      element: <UserDashboard />
    },
    {
      path: '/dashboard/profile',
      element: <UserProfile />
    },
    {
      path: '/dashboard/bookings',
      element: <BookingHistory />
    },
    {
      path: '/dashboard/payments',
      element: <PaymentHistory />
    },
    {
      path: '/dashboard/support',
      element: <SupportTickets />
    },
    {
      path: '/dashboard/settings',
      element: <AccountSettings />
    },

    // Admin Dashboard routes
    {
      path: '/admin',
      element: <AdminDashboard />
    },
    {
      path: '/admin/dashboard',
      element: <AdminDashboard />
    },
    {
      path: '/admin/profile',
      element: <AdminProfile />
    },
    {
      path: '/admin/users',
      element: <AdminUsers />
    },
    {
      path: '/admin/vehicles',
      element: <AdminVehicles />
    },
    {
      path: '/admin/bookings',
      element: <AdminBookings />
    },
    {
      path: '/admin/payments',
      element: <AdminPayments />
    },
    {
      path: '/admin/analytics',
      element: <AdminAnalytics />
    },
    {
      path: '/admin/support',
      element: <AdminSupport />
    },
    {
      path: '/admin/settings',
      element: <AdminSettings />
    }
  ])

  return (
    <RouterProvider router={router} />
  )
}

export default App