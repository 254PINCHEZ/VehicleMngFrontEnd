import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {type RootState } from '../store/store';
import { logout } from '../slice/Authslice';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    closeMenu();
    navigate('/');
  };

  const getUserInitial = () => {
    if (user?.first_name) return user.first_name.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return 'U';
  };

  const getUserDisplayName = () => {
    if (user?.first_name) return user.first_name;
    if (user?.email) return user.email.split('@')[0];
    return 'User';
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand Name */}
          <Link 
            to="/" 
            className="flex items-center space-x-3" 
            onClick={closeMenu}
          >
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg">
              <span className="text-white font-bold text-xl">TR</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-900 tracking-tight">TURAGA RENTALS</span>
              <span className="text-xs text-blue-600 font-medium">Premium Vehicle Management</span>
            </div>
          </Link>

          {/* Desktop Navigation Menu */}
          <div className="hidden md:flex items-center space-x-1">
            <div className="flex items-center space-x-6">
              <Link 
                to="/" 
                className="nav-link relative group"
                onClick={closeMenu}
              >
                <span className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">
                  Home
                </span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
              {/* <Link 
                to="/inventory" 
                className="nav-link relative group"
                onClick={closeMenu}
              >
                <span className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">
                  Inventory
                </span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
              </Link> */}
              <Link 
                to="/about" 
                className="nav-link relative group"
                onClick={closeMenu}
              >
                <span className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">
                  About Us
                </span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link 
                to="/contact" 
                className="nav-link relative group"
                onClick={closeMenu}
              >
                <span className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">
                  Contact
                </span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
            </div>
          </div>

          {/* User Actions - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              // Logged-in user menu
              <div className="flex items-center space-x-6">
                {/* Dashboard link based on role */}
                {user?.role === 'admin' ? (
                  <Link 
                    to="/admin/dashboard" 
                    className="text-blue-600 hover:text-blue-700 font-medium px-4 py-2 rounded-lg transition-colors duration-200"
                    onClick={closeMenu}
                  >
                    Admin Dashboard
                  </Link>
                ) : (
                  <Link 
                    to="/dashboard" 
                    className="text-blue-600 hover:text-blue-700 font-medium px-4 py-2 rounded-lg transition-colors duration-200"
                    onClick={closeMenu}
                  >
                    My Dashboard
                  </Link>
                )}

                {/* User profile dropdown */}
                <div className="relative group">
                  <button className="flex items-center space-x-2 focus:outline-none">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {getUserInitial()}
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium text-gray-900">
                        {getUserDisplayName()}
                      </span>
                      <span className="text-xs text-gray-500 capitalize">
                        {user?.role || 'User'}
                      </span>
                    </div>
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {/* Dropdown menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border hidden group-hover:block z-10">
                    <Link 
                      to={user?.role === 'admin' ? '/admin/profile' : '/dashboard/profile'} 
                      className="block px-4 py-3 text-gray-700 hover:bg-blue-50 transition-colors duration-200"
                      onClick={closeMenu}
                    >
                      <div className="flex items-center">
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        My Profile
                      </div>
                    </Link>
                    <Link 
                      to={user?.role === 'admin' ? '/admin/settings' : '/dashboard/settings'} 
                      className="block px-4 py-3 text-gray-700 hover:bg-blue-50 transition-colors duration-200"
                      onClick={closeMenu}
                    >
                      <div className="flex items-center">
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Settings
                      </div>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-b-lg transition-colors duration-200 flex items-center"
                    >
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              // Not logged-in - show login/register buttons
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="text-blue-600 hover:text-blue-700 font-medium px-4 py-2 rounded-lg transition-colors duration-200"
                  onClick={closeMenu}
                >
                  Sign In
                </Link>
                <Link 
                  to="/register" 
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 font-medium px-6 py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                  onClick={closeMenu}
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span className={`w-6 h-0.5 bg-gray-700 transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-gray-700 my-1.5 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
            <span className={`w-6 h-0.5 bg-gray-700 transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-96 opacity-100 py-4' : 'max-h-0 opacity-0'}`}>
          <div className="flex flex-col space-y-3 pt-2 pb-3">
            <Link 
              to="/" 
              className="flex items-center text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-3 rounded-lg font-medium transition-colors duration-200"
              onClick={closeMenu}
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Home
            </Link>
            <Link 
              to="/inventory" 
              className="flex items-center text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-3 rounded-lg font-medium transition-colors duration-200"
              onClick={closeMenu}
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Inventory
            </Link>
            <Link 
              to="/about" 
              className="flex items-center text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-3 rounded-lg font-medium transition-colors duration-200"
              onClick={closeMenu}
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              About Us
            </Link>
            <Link 
              to="/contact" 
              className="flex items-center text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-3 rounded-lg font-medium transition-colors duration-200"
              onClick={closeMenu}
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contact
            </Link>

            {/* Conditional Mobile Auth Links */}
            {isAuthenticated ? (
              // Logged-in mobile menu
              <>
                <div className="border-t border-gray-200 my-2 pt-3">
                  <div className="px-4 mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {getUserInitial()}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {getUserDisplayName()}
                        </p>
                        <p className="text-xs text-gray-500 capitalize">
                          {user?.role || 'User'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {user?.role === 'admin' ? (
                    <Link 
                      to="/admin/dashboard" 
                      className="flex items-center text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-3 rounded-lg font-medium transition-colors duration-200"
                      onClick={closeMenu}
                    >
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      Admin Dashboard
                    </Link>
                  ) : (
                    <Link 
                      to="/dashboard" 
                      className="flex items-center text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-3 rounded-lg font-medium transition-colors duration-200"
                      onClick={closeMenu}
                    >
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      My Dashboard
                    </Link>
                  )}
                  
                  <Link 
                    to={user?.role === 'admin' ? '/admin/profile' : '/dashboard/profile'} 
                    className="flex items-center text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-3 rounded-lg font-medium transition-colors duration-200"
                    onClick={closeMenu}
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    My Profile
                  </Link>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full text-left text-red-600 hover:bg-red-50 px-4 py-3 rounded-lg font-medium transition-colors duration-200"
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>
              </>
            ) : (
              // Not logged-in mobile menu
              <div className="flex items-center space-x-3 px-4 pt-4">
                <Link 
                  to="/login" 
                  className="flex-1 text-center text-blue-600 border-2 border-blue-600 hover:bg-blue-600 hover:text-white px-4 py-2.5 rounded-lg font-medium transition-colors duration-200"
                  onClick={closeMenu}
                >
                  Sign In
                </Link>
                <Link 
                  to="/register" 
                  className="flex-1 text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 px-4 py-2.5 rounded-lg font-medium transition-colors duration-200"
                  onClick={closeMenu}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;






// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// // import logo from "../assets/vehicle-logo.png";

// const Header: React.FC = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//   };

//   const closeMenu = () => {
//     setIsMenuOpen(false);
//   };

//   return (
//     <nav className="sticky top-0 z-50 bg-white shadow-md">
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-16">
//           {/* Logo and Brand Name */}
//           <Link 
//             to="/" 
//             className="flex items-center space-x-3" 
//             onClick={closeMenu}
//           >
//             <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg">
//               <span className="text-white font-bold text-xl">TR</span>
//               {/* <img src={logo} alt="VehicleMNG Logo" className="h-8 w-auto" /> */}
//             </div>
//             <div className="flex flex-col">
//               <span className="text-xl font-bold text-gray-900 tracking-tight">TURAGA RENTALS</span>
//               <span className="text-xs text-blue-600 font-medium">Premium Vehicle Management</span>
//             </div>
//           </Link>

//           {/* Desktop Navigation Menu */}
//           <div className="hidden md:flex items-center space-x-1">
//             <div className="flex items-center space-x-6">
//               <Link 
//                 to="/" 
//                 className="nav-link relative group"
//                 onClick={closeMenu}
//               >
//                 <span className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">
//                   Home
//                 </span>
//                 <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
//               </Link>
         
//               <Link 
//                 to="/about" 
//                 className="nav-link relative group"
//                 onClick={closeMenu}
//               >
//                 <span className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">
//                   About Us
//                 </span>
//                 <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
//               </Link>
//               <Link 
//                 to="/contact" 
//                 className="nav-link relative group"
//                 onClick={closeMenu}
//               >
//                 <span className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">
//                   Contact
//                 </span>
//                 <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
//               </Link>
//             </div>
//           </div>

//           {/* User Actions - Desktop */}
//           <div className="hidden md:flex items-center space-x-4">
//             <Link 
//               to="/login" 
//               className="text-blue-600 hover:text-blue-700 font-medium px-4 py-2 rounded-lg transition-colors duration-200"
//             >
//               Sign In
//             </Link>
//             <Link 
//               to="/register" 
//               className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 font-medium px-6 py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
//             >
//               Register
//             </Link>
//           </div>

//           {/* Mobile Menu Toggle */}
//           <button
//             className="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors duration-200"
//             onClick={toggleMenu}
//             aria-label="Toggle menu"
//           >
//             <span className={`w-6 h-0.5 bg-gray-700 transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
//             <span className={`w-6 h-0.5 bg-gray-700 my-1.5 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
//             <span className={`w-6 h-0.5 bg-gray-700 transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
//           </button>
//         </div>

//         {/* Mobile Navigation Menu */}
//         <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-64 opacity-100 py-4' : 'max-h-0 opacity-0'}`}>
//           <div className="flex flex-col space-y-3 pt-2 pb-3">
//             <Link 
//               to="/" 
//               className="flex items-center text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-3 rounded-lg font-medium transition-colors duration-200"
//               onClick={closeMenu}
//             >
//               <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
//               </svg>
//               Home
//             </Link>
//             <Link 
//               to="/inventory" 
//               className="flex items-center text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-3 rounded-lg font-medium transition-colors duration-200"
//               onClick={closeMenu}
//             >
//               <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
//               </svg>
//               Inventory
//             </Link>
//             <Link 
//               to="/about" 
//               className="flex items-center text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-3 rounded-lg font-medium transition-colors duration-200"
//               onClick={closeMenu}
//             >
//               <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//               About Us
//             </Link>
//             <Link 
//               to="/contact" 
//               className="flex items-center text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-3 rounded-lg font-medium transition-colors duration-200"
//               onClick={closeMenu}
//             >
//               <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//               </svg>
//               Contact
//             </Link>
            
//             <div className="flex items-center space-x-3 px-4 pt-4">
//               <Link 
//                 to="/login" 
//                 className="flex-1 text-center text-blue-600 border-2 border-blue-600 hover:bg-blue-600 hover:text-white px-4 py-2.5 rounded-lg font-medium transition-colors duration-200"
//                 onClick={closeMenu}
//               >
//                 Sign In
//               </Link>
//               <Link 
//                 to="/register" 
//                 className="flex-1 text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 px-4 py-2.5 rounded-lg font-medium transition-colors duration-200"
//                 onClick={closeMenu}
//               >
//                 Register
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Header;