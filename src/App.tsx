import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Home from './pages/home'
import Inventory from './pages/inventory'
import VehicleDetail from './pages/vehicleDetail'
import Login from './pages/login'
import Register from './pages/register'
import Checkout from './pages/checkout'
import BookingSuccess from './pages/BookingSuccess'
// import UserDashboard from './pages/user/UserDashboard'
// import MyBookings from './pages/user/MyBookings'
// import UserProfile from './pages/user/UserProfile'
// import SupportTickets from './pages/user/SupportTickets'
// import AdminDashboard from './pages/admin/AdminDashboard'
// import AllBookings from './pages/admin/AllBookings'
// import AllVehicles from './pages/admin/AllVehicles'
// import AllUsers from './pages/admin/AllUsers'
// import AllTickets from './pages/admin/AllTickets'
// import AdminProfile from './pages/admin/AdminProfile'
// import Checkout from './pages/Checkout'

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
    // {
    //   path: '/checkout',
    //   element: <Checkout />
    // },
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

    // User Dashboard routes
    // {
    //   path: '/dashboard',
    //   element: <UserDashboard />
    // },
    // {
    //   path: '/dashboard/my-bookings',
    //   element: <MyBookings />
    // },
    // {
    //   path: '/dashboard/profile',
    //   element: <UserProfile />
    // },
    // {
    //   path: '/dashboard/support-tickets',
    //   element: <SupportTickets />
    // },
    // Admin dashboard routes
    // {
    //   path: '/admin/dashboard',
    //   element: <AdminDashboard />
    // },
    // {
    //   path: '/admin/dashboard/all-bookings',
    //   element: <AllBookings />
    // },
    // {
    //   path: '/admin/dashboard/all-vehicles',
    //   element: <AllVehicles />
    // },
    // {
    //   path: '/admin/dashboard/all-users',
    //   element: <AllUsers />
    // },
    // {
    //   path: '/admin/dashboard/all-tickets',
    //   element: <AllTickets />
    // },
    // {
    //   path: '/admin/dashboard/admin-profile',
    //   element: <AdminProfile />
    // }
  ])

  return (
    <RouterProvider router={router} />
  )
}

export default App