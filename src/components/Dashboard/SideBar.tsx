import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Calendar, 
  User, 
  HelpCircle, 
  Home, 
  LogOut,
  ChevronRight,
  Settings
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
    <div className="bg-gradient-to-b from-slate-50 to-white border-r border-slate-200 w-72 min-h-screen fixed left-0 top-0 z-40 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
      {/* Logo Section */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">VR</span>
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white"></div>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              VehicleRent
            </h1>
            <p className="text-xs text-slate-500 font-medium">Management Dashboard</p>
          </div>
        </div>
      </div>

      {/* User Profile Section */}
      <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-blue-50/50 to-indigo-50/30">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-14 h-14 bg-gradient-to-br from-slate-700 to-slate-900 rounded-2xl flex items-center justify-center shadow-lg ring-2 ring-white ring-offset-2 ring-offset-blue-50">
              <span className="text-white font-semibold text-lg">
                {user.first_name.charAt(0)}{user.last_name.charAt(0)}
              </span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
              <Settings className="w-3 h-3 text-white" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-900 truncate">
                {user.first_name} {user.last_name}
              </p>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
            <p className="text-xs text-slate-600 truncate mt-0.5">{user.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-100 to-blue-50 text-blue-800 border border-blue-200">
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </span>
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="p-6">
        <div className="mb-4">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-3">
            Navigation
          </h2>
          <nav className="space-y-1.5">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`group flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isActive(item.path)
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                    : 'text-slate-700 hover:bg-white hover:text-slate-900 hover:shadow-md hover:border hover:border-slate-100'
                }`}
              >
                <span className={`shrink-0 mr-3 transition-transform duration-300 group-hover:scale-110 ${
                  isActive(item.path) ? 'text-white' : 'text-slate-500 group-hover:text-blue-600'
                }`}>
                  {item.icon}
                </span>
                {item.name}
                {isActive(item.path) && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                )}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Footer Section */}
      <div className="p-6 border-t border-slate-200 mt-auto bg-white/50 backdrop-blur-sm absolute bottom-0 w-full">
        <div className="space-y-2">
          <Link
            to="/"
            className="group flex items-center px-4 py-3 rounded-xl text-sm font-medium text-slate-700 hover:bg-white hover:text-slate-900 hover:shadow-md hover:border hover:border-slate-100 transition-all duration-300"
          >
            <span className="shrink-0 mr-3 text-slate-500 group-hover:text-blue-600 transition-colors duration-300">
              <Home className="w-5 h-5" />
            </span>
            Back to Home
            <ChevronRight className="w-4 h-4 ml-auto text-slate-300 group-hover:text-slate-400 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          
          <button className="group flex items-center w-full px-4 py-3 rounded-xl text-sm font-medium text-slate-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 hover:text-red-700 hover:shadow-md hover:border hover:border-red-100 transition-all duration-300">
            <span className="shrink-0 mr-3 text-slate-500 group-hover:text-red-600 transition-colors duration-300">
              <LogOut className="w-5 h-5" />
            </span>
            Logout
            <ChevronRight className="w-4 h-4 ml-auto text-slate-300 group-hover:text-red-400 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
        
        <div className="mt-6 pt-4 border-t border-slate-100">
          <p className="text-xs text-slate-500 text-center">
            © 2024 VehicleRent v2.1
          </p>
        </div>
      </div>
    </div>
  )
}

export default Sidebar