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
  Activity,
  Globe,
  Database,
  AlertTriangle,
  MessageSquare
} from 'lucide-react';
import { type User as UserType } from '../../types/types';

interface AdminSidebarProps {
  user: UserType;
  onLogout?: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ user, onLogout }) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  // Simplified admin navigation
  const adminNavigationItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard className="w-5 h-5" />, badge: null },
    { name: 'Users', path: '/admin/users', icon: <Users className="w-5 h-5" />, badge: '24' },
    { name: 'Vehicles', path: '/admin/vehicles', icon: <Car className="w-5 h-5" />, badge: '45' },
    { name: 'Bookings', path: '/admin/bookings', icon: <Calendar className="w-5 h-5" />, badge: '18' },
    { name: 'Payments', path: '/admin/payments', icon: <CreditCard className="w-5 h-5" />, badge: '7' },
    { name: 'Analytics', path: '/admin/analytics', icon: <BarChart3 className="w-5 h-5" />, badge: null },
    { name: 'Content', path: '/admin/content', icon: <Database className="w-5 h-5" />, badge: '3' },
    { name: 'Support', path: '/admin/support', icon: <MessageSquare className="w-5 h-5" />, badge: '12' },
    { name: 'Settings', path: '/admin/settings', icon: <Settings className="w-5 h-5" />, badge: null }
  ];

  const handleLogout = () => {
    onLogout?.();
  };

  // Simplified system metrics
  const systemMetrics = {
    activeUsers: '1.2K',
    totalBookings: '45K'
  };

  return (
    <div className="bg-white border-r border-gray-200 shadow-lg w-72 min-h-screen fixed left-0 top-0 z-40 flex flex-col">
      {/* Logo Section */}
      <div className="p-5 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">VehicleRent</h1>
            <p className="text-xs text-gray-600">Admin System</p>
          </div>
        </div>
      </div>

      {/* Admin Profile */}
      <div className="p-5 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-semibold">
                {user.first_name.charAt(0)}{user.last_name.charAt(0)}
              </span>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">
              {user.first_name} {user.last_name}
            </p>
            <p className="text-xs text-gray-500">{user.email}</p>
            <div className="flex items-center mt-1">
              <div className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                <Shield className="w-3 h-3 mr-1" />
                Admin
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="p-4 border-b border-gray-200 bg-green-50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-green-800">
            System Status
          </span>
          <div className="flex items-center text-xs text-green-700">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
            Online
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="text-center p-2 bg-white rounded">
            <div className="font-semibold text-gray-900">{systemMetrics.activeUsers}</div>
            <div className="text-gray-500">Active Users</div>
          </div>
          <div className="text-center p-2 bg-white rounded">
            <div className="font-semibold text-gray-900">{systemMetrics.totalBookings}</div>
            <div className="text-gray-500">Total Bookings</div>
          </div>
        </div>
      </div>

      {/* Active Alerts - Simplified */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2 text-amber-600 mb-2">
          <AlertTriangle className="w-4 h-4" />
          <span className="text-xs font-semibold">Alerts</span>
        </div>
        <div className="text-xs">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Pending Approvals</span>
            <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full">5</span>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <div className="text-xs font-semibold text-gray-500 uppercase mb-3 px-2">
          Menu
        </div>
        {adminNavigationItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
              isActive(item.path)
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center">
              <span className="mr-3">
                {item.icon}
              </span>
              <span className="text-sm font-medium">{item.name}</span>
            </div>
            {item.badge && (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                isActive(item.path) 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {item.badge}
              </span>
            )}
          </Link>
        ))}
      </nav>

      {/* Footer Section */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        <Link
          to="/"
          className="flex items-center p-3 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
        >
          <Home className="w-5 h-5 mr-3 text-gray-400" />
          <span>Main Site</span>
        </Link>
        
        <button 
          onClick={handleLogout}
          className="flex items-center w-full p-3 rounded-lg text-sm text-gray-700 hover:bg-red-50 hover:text-red-700"
        >
          <LogOut className="w-5 h-5 mr-3 text-gray-400" />
          <span>Sign Out</span>
        </button>

        {/* System Info */}
        <div className="pt-2">
          <div className="text-xs text-gray-500 text-center">
            <div>v2.1.4 • All systems normal</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;