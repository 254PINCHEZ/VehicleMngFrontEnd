import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Car, 
  Calendar,
  CreditCard, 
  BarChart3,
  Settings,
  Home,
  LogOut,
  Shield,
  Globe,
  Database,
  AlertTriangle,
  MessageSquare,
  Loader2,
  ChevronRight,
  Bell,
  CheckCircle2
} from 'lucide-react';
import { type User as UserType } from '../../types/types';

// Define stats interface based on your dashboard API
interface AdminStats {
  totalBookings?: number;
  totalRevenue?: number;
  totalUsers?: number;
  activeVehicles?: number;
  revenueChange?: number;
  bookingChange?: number;
  userChange?: number;
  utilizationChange?: number;
  pendingBookings?: number;
  completedBookings?: number;
  activeBookings?: number;
  contentCount?: number;
  supportTickets?: number;
  totalPayments?: number;
}

interface AdminSidebarProps {
  user: UserType;
  onLogout?: () => void;
  stats?: AdminStats;
  isLoading?: boolean;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ 
  user, 
  onLogout, 
  stats = {}, 
  isLoading = false 
}) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  // Dynamic admin navigation with REAL badge numbers from database
  const adminNavigationItems = [
    { 
      name: 'Dashboard', 
      path: '/admin', 
      icon: <LayoutDashboard className="w-5 h-5" />, 
      badge: null 
    },
    { 
      name: 'Users', 
      path: '/admin/users', 
      icon: <Users className="w-5 h-5" />, 
      badge: stats.totalUsers !== undefined ? `${stats.totalUsers}` : null
    },
    { 
      name: 'Vehicles', 
      path: '/admin/vehicles', 
      icon: <Car className="w-5 h-5" />, 
      badge: stats.activeVehicles !== undefined ? `${stats.activeVehicles}` : null
    },
    { 
      name: 'Bookings', 
      path: '/admin/bookings', 
      icon: <Calendar className="w-5 h-5" />, 
      badge: stats.totalBookings !== undefined ? `${stats.totalBookings}` : null
    },
    { 
      name: 'Payments', 
      path: '/admin/payments', 
      icon: <CreditCard className="w-5 h-5" />, 
      badge: stats.completedBookings !== undefined ? `${stats.completedBookings}` : null
    },
    { 
      name: 'Analytics', 
      path: '/admin/analytics', 
      icon: <BarChart3 className="w-5 h-5" />, 
      badge: null 
    },
    { 
      name: 'Content', 
      path: '/admin/content', 
      icon: <Database className="w-5 h-5" />, 
      badge: stats.contentCount !== undefined ? `${stats.contentCount}` : null
    },
    { 
      name: 'Support', 
      path: '/admin/support', 
      icon: <MessageSquare className="w-5 h-5" />, 
      badge: stats.pendingBookings !== undefined ? `${stats.pendingBookings}` : null
    },
    { 
      name: 'Settings', 
      path: '/admin/settings', 
      icon: <Settings className="w-5 h-5" />, 
      badge: null 
    }
  ];

  const handleLogout = () => {
    onLogout?.();
  };

  return (
    <div className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-slate-200 w-72 min-h-screen fixed left-0 top-0 z-40 flex flex-col border-r border-slate-700/50 shadow-2xl">
      {/* Logo Section - Elegant Header */}
      <div className="p-6 border-b border-slate-700/50 bg-slate-800/30 backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg ring-2 ring-blue-500/20">
            <Globe className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-200 to-indigo-200 bg-clip-text text-transparent">
              VehicleRent
            </h1>
            <p className="text-xs text-slate-400 mt-1">Administration Portal</p>
          </div>
        </div>
      </div>

      {/* Admin Profile - Subtle Card */}
      <div className="p-5 border-b border-slate-700/50 bg-slate-800/20">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg ring-2 ring-purple-500/20">
              <span className="text-white font-semibold text-lg">
                {user.first_name.charAt(0)}{user.last_name.charAt(0)}
              </span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-slate-800 flex items-center justify-center">
              <CheckCircle2 className="w-3 h-3 text-white" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">
              {user.first_name} {user.last_name}
            </p>
            <p className="text-xs text-slate-400 truncate">{user.email}</p>
            <div className="flex items-center mt-1.5">
              <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-slate-700/50 text-slate-300 border border-slate-600/50">
                <Shield className="w-3 h-3 mr-1.5" />
                Super Admin
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System Stats - Elegant Cards */}
      <div className="p-4 border-b border-slate-700/50">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            System Overview
          </span>
          <div className="flex items-center text-xs text-green-400">
            {isLoading ? (
              <Loader2 className="w-3 h-3 mr-1.5 animate-spin" />
            ) : (
              <div className="w-2 h-2 bg-green-400 rounded-full mr-1.5 animate-pulse"></div>
            )}
            {isLoading ? 'Syncing...' : 'Live'}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-800/40 backdrop-blur-sm rounded-lg p-3 border border-slate-700/30 hover:border-slate-600/50 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400">Users</p>
                <p className="text-lg font-semibold text-white mt-0.5">
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    stats.totalUsers || '0'
                  )}
                </p>
              </div>
              <div className="bg-blue-500/10 p-2 rounded-lg">
                <Users className="w-4 h-4 text-blue-400" />
              </div>
            </div>
          </div>
          <div className="bg-slate-800/40 backdrop-blur-sm rounded-lg p-3 border border-slate-700/30 hover:border-slate-600/50 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400">Bookings</p>
                <p className="text-lg font-semibold text-white mt-0.5">
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    stats.totalBookings || '0'
                  )}
                </p>
              </div>
              <div className="bg-emerald-500/10 p-2 rounded-lg">
                <Calendar className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Alerts - Subtle Notification Area */}
      <div className="p-4 border-b border-slate-700/50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Bell className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-semibold text-slate-300">Alerts</span>
          </div>
          {stats.pendingBookings !== undefined && stats.pendingBookings > 0 && (
            <span className="px-2 py-1 bg-amber-500/10 text-amber-400 rounded-full text-xs border border-amber-500/20">
              {stats.pendingBookings} pending
            </span>
          )}
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Pending Actions</span>
            <span className="px-2 py-1 bg-amber-500/10 text-amber-400 rounded-full">
              {isLoading ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                stats.pendingBookings || '0'
              )}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Active Sessions</span>
            <span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded-full">
              {isLoading ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                stats.activeBookings || '0'
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Menu - Professional & Clean */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-2">
          Navigation
        </div>
        <div className="space-y-1.5">
          {adminNavigationItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center justify-between group px-3 py-2.5 rounded-lg transition-all duration-200 ${
                  active
                    ? 'bg-gradient-to-r from-blue-600/20 to-indigo-600/20 text-white border-l-4 border-blue-500 shadow-lg shadow-blue-500/10'
                    : 'text-slate-300 hover:bg-slate-800/50 hover:text-white hover:border-l-4 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center">
                  <span className={`mr-3 transition-colors ${
                    active ? 'text-blue-400' : 'text-slate-400 group-hover:text-blue-400'
                  }`}>
                    {item.icon}
                  </span>
                  <span className="text-sm font-medium">{item.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {item.badge && (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium min-w-[2rem] flex justify-center ${
                      active
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        : 'bg-slate-700/50 text-slate-300 border border-slate-600/50 group-hover:bg-slate-600/50'
                    }`}>
                      {isLoading ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        item.badge
                      )}
                    </span>
                  )}
                  {!active && (
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-400 transition-colors" />
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer Section - Subtle & Professional */}
      <div className="p-4 border-t border-slate-700/50 bg-slate-800/30 backdrop-blur-sm space-y-3">
        {/* Quick Actions */}
        <Link
          to="/"
          className="flex items-center p-3 rounded-lg text-sm text-slate-300 hover:bg-slate-700/50 hover:text-white transition-colors group"
        >
          <div className="bg-slate-700/50 p-2 rounded-lg group-hover:bg-slate-600/50 transition-colors mr-3">
            <Home className="w-4 h-4" />
          </div>
          <span>Visit Main Site</span>
          <ChevronRight className="w-4 h-4 ml-auto text-slate-500 group-hover:text-slate-400" />
        </Link>
        
        {/* Logout Button */}
        <button 
          onClick={handleLogout}
          className="flex items-center w-full p-3 rounded-lg text-sm text-slate-300 hover:bg-red-900/20 hover:text-red-300 transition-colors group border border-transparent hover:border-red-900/30"
        >
          <div className="bg-slate-700/50 p-2 rounded-lg group-hover:bg-red-900/30 transition-colors mr-3">
            <LogOut className="w-4 h-4" />
          </div>
          <span>Sign Out</span>
          <ChevronRight className="w-4 h-4 ml-auto text-slate-500 group-hover:text-red-400" />
        </button>

        {/* System Status Footer */}
        <div className="pt-3 border-t border-slate-700/50">
          <div className="text-xs text-slate-500 space-y-1">
            <div className="flex items-center justify-between">
              <span>Database Status</span>
              <span className={`flex items-center ${isLoading ? 'text-amber-400' : 'text-emerald-400'}`}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-3 h-3 mr-1.5 animate-spin" />
                    Syncing
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 bg-emerald-400 rounded-full mr-1.5 animate-pulse"></div>
                    Connected
                  </>
                )}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Version</span>
              <span className="text-slate-300">v2.1.4</span>
            </div>
            {!isLoading && stats.totalRevenue !== undefined && (
              <div className="text-center pt-2">
                <span className="text-emerald-400 font-medium text-sm">
                  ${stats.totalRevenue.toLocaleString()} Revenue
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;