import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Calendar, 
  User, 
  HelpCircle, 
  Home, 
  LogOut 
} from 'lucide-react'
import { type User as UserType } from '../../types/types'

interface SidebarProps {
  user: UserType
}

const Sidebar: React.FC<SidebarProps> = ({ user }) => {
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  const navigationItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />
    },
    {
      name: 'My Bookings',
      path: '/dashboard/bookings',
      icon: <Calendar className="w-5 h-5" />
    },
    {
      name: 'Profile',
      path: '/dashboard/profile',
      icon: <User className="w-5 h-5" />
    },
    {
      name: 'Support',
      path: '/dashboard/support',
      icon: <HelpCircle className="w-5 h-5" />
    }
  ]

  return (
    <div className="bg-white border-r border-gray-200 shadow-sm transition-all duration-300 w-64 min-h-screen fixed left-0 top-0 z-40">
      {/* Logo Section */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">VR</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">VehicleRent</h1>
            <p className="text-xs text-slate-500">Dashboard</p>
          </div>
        </div>
      </div>

      {/* User Profile Section */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-800 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {user.first_name.charAt(0)}{user.last_name.charAt(0)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate">
              {user.first_name} {user.last_name}
            </p>
            <p className="text-xs text-slate-500 truncate">{user.email}</p>
            <div className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="p-4 space-y-2">
        {navigationItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              isActive(item.path)
                ? 'bg-blue-50 text-blue-700 border border-blue-100 shadow-sm'
                : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900 hover:shadow-sm'
            }`}
          >
            <span className="shrink-0 mr-3">
              {item.icon}
            </span>
            {item.name}
          </Link>
        ))}
      </nav>

      {/* Footer Section */}
      <div className="p-4 border-t border-gray-200 absolute bottom-0 w-full bg-white">
        <Link
          to="/"
          className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all duration-200 mb-2"
        >
          <span className="shrink-0 mr-3">
            <Home className="w-5 h-5" />
          </span>
          Back to Home
        </Link>
        
        <button className="flex items-center w-full px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all duration-200">
          <span className="shrink-0 mr-3">
            <LogOut className="w-5 h-5" />
          </span>
          Logout
        </button>
      </div>
    </div>
  )
}

export default Sidebar