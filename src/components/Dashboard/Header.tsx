import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Add this import
import { type User } from '../../types/types';
import { 
  Bell, 
  ChevronDown, 
  User as UserIcon, 
  HelpCircle, 
  LogOut, 
  Settings,
  Menu
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '../../slice/Authslice';

interface HeaderProps {
  user: User;
  onMenuToggle: () => void;
  // Remove onLogout from props since we'll handle it internally
}

const Header: React.FC<HeaderProps> = ({ user, onMenuToggle }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const handleLogout = async () => {
    setIsDropdownOpen(false);
    

    // Add your logout logic here (clear tokens, etc.)
    // Example:
    localStorage.removeItem('auth_token'); // Remove token if stored
    localStorage.removeItem('token'); // Remove token if stored
    localStorage.removeItem('user'); // Remove user data if stored
    dispatch(logout())
    navigate("/login")
    
    await new Promise(resolve => setTimeout(resolve, 200)); // Smooth close animation
    
    // Redirect to login page
    navigate('/login');
  };

  // Close dropdown when clicking outside
  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
  //       setIsDropdownOpen(false);
  //     }
  //   };

  //   document.addEventListener('mousedown', handleClickOutside);
  //   return () => document.removeEventListener('mousedown', handleClickOutside);
  // }, []);

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left Section - Menu Button & Greeting */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2.5 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all duration-300 active:scale-95"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Greeting */}
          <div className="hidden sm:block">
            <div className="flex items-center gap-3">
              <div className="w-2 h-8 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  {getGreeting()}, {user.first_name} 👋
                </h1>
                <p className="text-sm text-slate-600 mt-0.5">
                  Welcome back to your dashboard
                </p>
              </div>
            </div>
          </div>

          {/* Mobile Greeting */}
          <div className="sm:hidden">
            <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">Welcome back</p>
          </div>
        </div>

        {/* Right Section - User Menu & Actions */}
        <div className="flex items-center gap-3">
          {/* Notifications Bell */}
          <button className="relative p-2.5 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all duration-300 group">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
              <span className="text-xs text-white font-semibold">3</span>
            </span>
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>

          {/* User Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-100 transition-all duration-300 active:scale-95 group"
            >
              <div className="relative">
                <div className="w-9 h-9 bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl flex items-center justify-center shadow-md ring-2 ring-white">
                  <span className="text-white font-semibold text-sm">
                    {user.first_name.charAt(0)}{user.last_name.charAt(0)}
                  </span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></div>
              </div>
              
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-slate-900">
                  {user.first_name} {user.last_name}
                </p>
                <p className="text-xs text-slate-500 capitalize">{user.role}</p>
              </div>
              
              <ChevronDown 
                className={`w-4 h-4 text-slate-400 transition-all duration-300 group-hover:text-slate-600 ${
                  isDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            <div
              className={`absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden transition-all duration-300 ${
                isDropdownOpen
                  ? 'opacity-100 scale-100 translate-y-0'
                  : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
              }`}
            >
              {/* User Info */}
              <div className="px-5 py-4 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 border-b border-slate-200/60">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl flex items-center justify-center shadow-md">
                    <span className="text-white font-semibold text-base">
                      {user.first_name.charAt(0)}{user.last_name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">
                      {user.first_name} {user.last_name}
                    </p>
                    <p className="text-xs text-slate-600 truncate mt-0.5">{user.email}</p>
                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-100 to-blue-50 text-blue-800 border border-blue-200 mt-1.5">
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Dropdown Links */}
              <div className="py-2">
                <a
                  href="/dashboard/profile"
                  className="group flex items-center gap-3 px-5 py-3 text-sm text-slate-700 hover:bg-slate-50/80 transition-all duration-200"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-200">
                    <UserIcon className="w-4 h-4 text-blue-600 group-hover:text-white transition-colors duration-200" />
                  </div>
                  <div>
                    <span className="font-medium">Profile Settings</span>
                    <p className="text-xs text-slate-500 mt-0.5">Manage your account</p>
                  </div>
                </a>

                <a
                  href="/dashboard/support"
                  className="group flex items-center gap-3 px-5 py-3 text-sm text-slate-700 hover:bg-slate-50/80 transition-all duration-200"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-600 transition-colors duration-200">
                    <HelpCircle className="w-4 h-4 text-emerald-600 group-hover:text-white transition-colors duration-200" />
                  </div>
                  <div>
                    <span className="font-medium">Help & Support</span>
                    <p className="text-xs text-slate-500 mt-0.5">Get help and support</p>
                  </div>
                </a>
              </div>

              {/* Logout */}
              <div className="border-t border-slate-200/60">
                <button
                  onClick={handleLogout}
                  className="group flex items-center gap-3 w-full px-5 py-3 text-sm text-slate-700 hover:bg-red-50/80 transition-all duration-200"
                >
                  <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center group-hover:bg-red-600 transition-colors duration-200">
                    <LogOut className="w-4 h-4 text-red-600 group-hover:text-white transition-colors duration-200" />
                  </div>
                  <div>
                    <span className="font-medium text-red-600 group-hover:text-red-700">Sign Out</span>
                    <p className="text-xs text-slate-500 mt-0.5">Log out of your account</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;