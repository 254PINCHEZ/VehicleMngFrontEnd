import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { type User as UserType } from '../../types/types';
import { 
  Bell, 
  Search, 
  Settings,
  LogOut,
  User,
  HelpCircle,
  Shield,
  Globe,
  Moon,
  Sun,
  Activity,
  Menu,
  ChevronDown,
  ExternalLink,
  CheckCircle2,
  Cpu,
  Database
} from 'lucide-react';
import { logout } from '../../slice/Authslice';
import { useDispatch } from 'react-redux';

interface AdminHeaderProps {
  user: UserType;
  onMenuToggle: () => void;
  onLogout?: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ user, onMenuToggle,  }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch()

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

    return greetings[timeKey][0];
  };

  const handleLogout = () => {
    setIsDropdownOpen(false);
     localStorage.removeItem('auth_token'); // Remove token if stored
        localStorage.removeItem('token'); // Remove token if stored
        localStorage.removeItem('user'); // Remove user data if stored
        dispatch(logout())
    
    navigate('/login');
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // Implement dark mode logic here
  };

  return (
    <header className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700/50 sticky top-0 z-30 shadow-xl backdrop-blur-lg bg-opacity-95">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left Section - Menu & Greeting */}
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-3 rounded-xl text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all duration-300 hover:shadow-lg border border-slate-700/50"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* International Greeting */}
          <div className="hidden lg:block">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                {getInternationalGreeting()}, {user.first_name}
              </h1>
              <span className="text-xs px-2 py-1 bg-slate-800/50 text-slate-300 rounded-full border border-slate-700/50">
                Admin
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-1 flex items-center">
              <Cpu className="w-4 h-4 mr-2" />
              System Administration & Global Monitoring
            </p>
          </div>

          {/* Mobile Greeting */}
          <div className="lg:hidden">
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold text-white">Admin Panel</h1>
              <span className="text-xs px-2 py-1 bg-slate-800/50 text-slate-300 rounded-full">
                Global
              </span>
            </div>
            <p className="text-xs text-slate-400">Management Dashboard</p>
          </div>
        </div>

        {/* Right Section - Global Controls */}
        <div className="flex items-center space-x-3">
          {/* Global Search */}
          <div className="hidden xl:block relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Search users, vehicles, bookings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-2.5 w-72 border border-slate-700/50 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 bg-slate-800/50 backdrop-blur-sm text-slate-200 placeholder-slate-500"
            />
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2.5 rounded-xl text-slate-400 hover:bg-slate-700/50 hover:text-slate-200 transition-all duration-300 border border-slate-700/50"
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* System Activity */}
          <button className="relative p-2.5 rounded-xl text-slate-400 hover:bg-slate-700/50 hover:text-slate-200 transition-all duration-300 group border border-slate-700/50">
            <Activity className="w-4 h-4" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 border-2 border-slate-900 rounded-full animate-pulse"></div>
            <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 hidden group-hover:block bg-slate-800 text-slate-200 text-xs rounded-lg px-3 py-1.5 whitespace-nowrap shadow-xl border border-slate-700/50">
              <div className="flex items-center">
                <CheckCircle2 className="w-3 h-3 mr-1.5 text-green-400" />
                System Active
              </div>
            </div>
          </button>

          {/* Notifications */}
          <button className="relative p-2.5 rounded-xl text-slate-400 hover:bg-slate-700/50 hover:text-slate-200 transition-all duration-300 border border-slate-700/50">
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 border-2 border-slate-900 rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-bold">12</span>
            </span>
          </button>

          {/* User Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-3 p-2 rounded-xl hover:bg-slate-700/50 transition-all duration-300 group border border-slate-700/50"
            >
              <div className="relative">
                <div className="w-9 h-9 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg ring-2 ring-purple-500/20">
                  <span className="text-white font-semibold text-sm">
                    {user.first_name.charAt(0)}{user.last_name.charAt(0)}
                  </span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-slate-900 rounded-full flex items-center justify-center">
                  <Shield className="w-2 h-2 text-white" />
                </div>
              </div>
              
              <div className="hidden xl:block text-left">
                <p className="text-sm font-semibold text-slate-200">
                  {user.first_name} {user.last_name}
                </p>
                <p className="text-xs text-slate-400 flex items-center">
                  <Database className="w-3 h-3 mr-1" />
                  Administrator
                </p>
              </div>
              
              <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Professional User Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-gradient-to-b from-slate-800 to-slate-900 rounded-xl shadow-2xl border border-slate-700/50 py-3 z-50 backdrop-blur-xl">
                {/* User Info Section */}
                <div className="px-4 py-3 border-b border-slate-700/50">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg ring-2 ring-purple-500/20">
                        <span className="text-white font-semibold text-base">
                          {user.first_name.charAt(0)}{user.last_name.charAt(0)}
                        </span>
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-slate-800 rounded-full flex items-center justify-center">
                        <Shield className="w-2.5 h-2.5 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-200 truncate">
                        {user.first_name} {user.last_name}
                      </p>
                      <p className="text-sm text-slate-400 truncate">{user.email}</p>
                      <div className="flex items-center mt-1.5 space-x-2">
                        <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-700/50 text-slate-300 border border-slate-600/50">
                          <Shield className="w-3 h-3 mr-1.5" />
                          Super Admin
                        </div>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Admin Actions */}
                <div className="py-2">
                  <a 
                    href="/admin/profile" 
                    className="flex items-center justify-between px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-700/50 transition-colors duration-200 rounded-lg mx-2 group"
                  >
                    <div className="flex items-center">
                      <div className="p-1.5 rounded-lg bg-slate-700/30 group-hover:bg-slate-600/50 transition-colors mr-3">
                        <User className="w-4 h-4" />
                      </div>
                      <span>Admin Profile</span>
                    </div>
                    <span className="text-xs text-slate-500 group-hover:text-slate-400">Settings</span>
                  </a>
                  
                  <a 
                    href="/admin/system" 
                    className="flex items-center justify-between px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-700/50 transition-colors duration-200 rounded-lg mx-2 group"
                  >
                    <div className="flex items-center">
                      <div className="p-1.5 rounded-lg bg-slate-700/30 group-hover:bg-slate-600/50 transition-colors mr-3">
                        <Settings className="w-4 h-4" />
                      </div>
                      <span>System Configuration</span>
                    </div>
                    <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-slate-400" />
                  </a>
                  
                  <a 
                    href="/admin/support" 
                    className="flex items-center justify-between px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-700/50 transition-colors duration-200 rounded-lg mx-2 group"
                  >
                    <div className="flex items-center">
                      <div className="p-1.5 rounded-lg bg-slate-700/30 group-hover:bg-slate-600/50 transition-colors mr-3">
                        <HelpCircle className="w-4 h-4" />
                      </div>
                      <span>Admin Support</span>
                    </div>
                    <span className="text-xs px-2 py-1 bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20">24/7</span>
                  </a>
                </div>

                {/* System Status */}
                <div className="px-4 py-2 border-t border-slate-700/50">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center">
                      <Globe className="w-3 h-3 mr-1.5" />
                      System Health
                    </span>
                    <span className="flex items-center text-green-400">
                      <CheckCircle2 className="w-3 h-3 mr-1.5" />
                      Optimal
                    </span>
                  </div>
                </div>

                {/* Logout Section */}
                <div className="border-t border-slate-700/50 pt-2 mt-2">
                  <button 
                    onClick={handleLogout}
                    className="flex items-center justify-between w-full px-4 py-2.5 text-sm text-red-400 hover:bg-red-900/20 transition-colors duration-200 rounded-lg mx-2 group"
                  >
                    <div className="flex items-center">
                      <div className="p-1.5 rounded-lg bg-red-900/10 group-hover:bg-red-900/30 transition-colors mr-3">
                        <LogOut className="w-4 h-4" />
                      </div>
                      <span>Sign Out</span>
                    </div>
                    <span className="text-xs text-red-400/70 group-hover:text-red-300">Ctrl+Q</span>
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
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" 
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </header>
  );
};

export default AdminHeader;