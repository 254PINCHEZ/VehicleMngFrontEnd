import React, { useState } from 'react';
import { type User as UserType } from '../../types/types'; // Renamed import
import { 
  Bell, 
  Search, 
  Settings,
  LogOut,
  User, // This is the Lucide icon
  HelpCircle,
  Shield,
  Globe,
  Moon,
  Sun,
  Activity
} from 'lucide-react';

interface AdminHeaderProps {
  user: UserType; // Using the renamed type
  onMenuToggle: () => void;
  onLogout?: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ user, onMenuToggle, onLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  // International greeting based on time
  const getInternationalGreeting = () => {
    const hour = new Date().getHours();
    const greetings = {
      morning: ['Good morning', 'Bonjour', 'Buenos días', 'Guten Morgen', 'おはよう'],
      afternoon: ['Good afternoon', 'Bon après-midi', 'Buenas tardes', 'Guten Tag', 'こんにちは'],
      evening: ['Good evening', 'Bonsoir', 'Buenas noches', 'Guten Abend', 'こんばんは']
    };

    let timeKey: keyof typeof greetings = 'morning';
    if (hour >= 12 && hour < 18) timeKey = 'afternoon';
    if (hour >= 18) timeKey = 'evening';

    return greetings[timeKey][0]; // English as default
  };

  const handleLogout = () => {
    setIsDropdownOpen(false);
    onLogout?.();
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // Implement dark mode logic here
  };

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-gray-200/75 sticky top-0 z-30 shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left Section - Menu & Greeting */}
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-3 rounded-2xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all duration-300 hover:shadow-lg"
            aria-label="Toggle navigation menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* International Greeting */}
          <div className="hidden lg:block">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-700 bg-clip-text text-transparent">
              {getInternationalGreeting()}, {user.first_name} 👑
            </h1>
            <p className="text-sm text-slate-600 mt-1 flex items-center">
              <Globe className="w-4 h-4 mr-2" />
              System Administration & Global Monitoring
            </p>
          </div>

          {/* Mobile Greeting */}
          <div className="lg:hidden">
            <h1 className="text-xl font-bold text-slate-900">Admin Panel</h1>
            <p className="text-xs text-slate-500">Global Management</p>
          </div>
        </div>

        {/* Right Section - Global Controls */}
        <div className="flex items-center space-x-3">
          {/* Global Search */}
          <div className="hidden xl:block relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="🔍 Search users, vehicles, bookings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-3 w-80 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-gray-50/50 backdrop-blur-sm"
            />
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-3 rounded-2xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all duration-300"
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* System Activity */}
          <button className="relative p-3 rounded-2xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all duration-300 group">
            <Activity className="w-5 h-5" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full animate-pulse"></div>
            <div className="absolute top-full mt-2 hidden group-hover:block bg-slate-900 text-white text-xs rounded-lg px-2 py-1 whitespace-nowrap">
              System Active
            </div>
          </button>

          {/* Notifications */}
          <button className="relative p-3 rounded-2xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all duration-300">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 border-2 border-white rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-bold">12</span>
            </span>
          </button>

          {/* User Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-3 p-2 rounded-2xl hover:bg-slate-100 transition-all duration-300 group"
            >
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-semibold text-sm">
                    {user.first_name.charAt(0)}{user.last_name.charAt(0)}
                  </span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full flex items-center justify-center">
                  <Shield className="w-2 h-2 text-white" />
                </div>
              </div>
              
              <div className="hidden xl:block text-left">
                <p className="text-sm font-semibold text-slate-900">
                  {user.first_name} {user.last_name}
                </p>
                <p className="text-xs text-slate-500 flex items-center">
                  <Globe className="w-3 h-3 mr-1" />
                  Global Administrator
                </p>
              </div>
              
              <svg 
                className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* International User Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200/75 py-3 z-50 backdrop-blur-md">
                {/* User Info Section */}
                <div className="px-4 py-3 border-b border-gray-200/50">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-white font-semibold text-base">
                        {user.first_name.charAt(0)}{user.last_name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">
                        {user.first_name} {user.last_name}
                      </p>
                      <p className="text-sm text-slate-600 truncate">{user.email}</p>
                      <div className="flex items-center mt-1 space-x-2">
                        <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          <Shield className="w-3 h-3 mr-1" />
                          Super Admin
                        </div>
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Admin Actions */}
                <div className="py-2">
                  <a href="/admin/profile" className="flex items-center justify-between px-4 py-3 text-sm text-slate-700 hover:bg-slate-50/80 transition-colors duration-200 rounded-lg mx-2">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-3" />
                      <span>Admin Profile</span>
                    </div>
                    <span className="text-xs text-slate-400">Settings</span>
                  </a>
                  
                  <a href="/admin/system" className="flex items-center justify-between px-4 py-3 text-sm text-slate-700 hover:bg-slate-50/80 transition-colors duration-200 rounded-lg mx-2">
                    <div className="flex items-center">
                      <Settings className="w-4 h-4 mr-3" />
                      <span>System Configuration</span>
                    </div>
                    <span className="text-xs text-slate-400">Global</span>
                  </a>
                  
                  <a href="/admin/support" className="flex items-center justify-between px-4 py-3 text-sm text-slate-700 hover:bg-slate-50/80 transition-colors duration-200 rounded-lg mx-2">
                    <div className="flex items-center">
                      <HelpCircle className="w-4 h-4 mr-3" />
                      <span>Admin Support</span>
                    </div>
                    <span className="text-xs text-slate-400">24/7</span>
                  </a>
                </div>

                {/* System Status */}
                <div className="px-4 py-2 border-t border-gray-200/50">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>System Health</span>
                    <span className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      Optimal
                    </span>
                  </div>
                </div>

                {/* Logout Section */}
                <div className="border-t border-gray-200/50 pt-2">
                  <button 
                    onClick={handleLogout}
                    className="flex items-center justify-between w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50/80 transition-colors duration-200 rounded-lg mx-2"
                  >
                    <div className="flex items-center">
                      <LogOut className="w-4 h-4 mr-3" />
                      <span>Sign Out</span>
                    </div>
                    <span className="text-xs text-red-400">Ctrl+Q</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Close dropdown when clicking outside */}
      {isDropdownOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </header>
  );
};

export default AdminHeader;