
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Check if user is logged in
  const isLoggedIn = localStorage.getItem('token') || sessionStorage.getItem('token');
  // Get user data from localStorage
  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Get user display name
  const getUserDisplayName = () => {
    if (!user) return "User";
    
    // If user has first_name and last_name fields
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    
    // If user has name field (full name)
    if (user.name) {
      return user.name;
    }
    
    // If user has only email, extract name from email
    if (user.email) {
      const emailParts = user.email.split('@')[0];
      const nameParts = emailParts.split('.');
      if (nameParts.length >= 2) {
        return `${capitalizeFirstLetter(nameParts[0])} ${capitalizeFirstLetter(nameParts[1])}`;
      }
      return capitalizeFirstLetter(emailParts);
    }
    
    return "User";
  };

  // Helper function to capitalize first letter
  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    const displayName = getUserDisplayName();
    const nameParts = displayName.split(' ');
    
    if (nameParts.length >= 2) {
      return `${nameParts[0].charAt(0)}${nameParts[1].charAt(0)}`.toUpperCase();
    }
    
    return displayName.charAt(0).toUpperCase();
  };

  const userName = getUserDisplayName();
  const userInitials = getUserInitials();

  const handleLogout = () => {
    // Clear authentication tokens and user data
    localStorage.removeItem('token');
    localStorage.removeItem('access_token');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('access_token');
    localStorage.removeItem('user');
    localStorage.removeItem('refresh_token');
    // Close mobile menu if open
    closeMenu();
    // Redirect to login page
    navigate('/login');
  };

  // Get link classes for active state
  const getLinkClasses = (path: string) => {
    return `px-4 py-2 rounded-lg text-base font-medium italic transition-all duration-300 ${
      location.pathname === path
        ? "text-red-500 font-semibold"
        : "text-white hover:text-blue-500 hover:scale-105"
    }`;
  };

  return (
    <nav className="bg-gray-900 shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-6 py-2 flex justify-between items-center">

        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-2">
          {/* Logo image */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">TR</span>
          </div>
          <span className="text-white text-xl font-bold italic">TURAGA RENTALS</span>
        </Link>

        {/* Mobile Menu Toggle */}
        <div 
          className={`navbar-toggle md:hidden ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
        >
          <span className="toggle-bar"></span>
          <span className="toggle-bar"></span>
          <span className="toggle-bar"></span>
        </div>

        {/* Navigation Links - Desktop */}
        <ul className="hidden md:flex gap-6 items-center">
          <li>
            <Link to="/" className={getLinkClasses("/")}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/inventory" className={getLinkClasses("/inventory")}>
              Available Vehicle
            </Link>
          </li>
          <li>
            <Link to="/dashboard" className={getLinkClasses("/dashboard")}>
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/about" className={getLinkClasses("/about")}>
              About Us
            </Link>
          </li>
          <li>
            <Link to="/contact" className={getLinkClasses("/contact")}>
              Contact
            </Link>
          </li>
          
          {/* User Profile Section - Only show when logged in */}
          {isLoggedIn && (
            <li className="flex items-center gap-4 ml-4 pl-4 border-l border-gray-600">
              {/* User Profile with Dropdown */}
              <div className="relative group">
                <button className="flex items-center gap-2 text-white hover:text-blue-300 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                    {userInitials}
                  </div>
                  <span className="font-medium">{userName}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Dropdown Menu - ONLY LOGOUT OPTION */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-800">{userName}</p>
                    <p className="text-xs text-gray-500">Welcome back!</p>
                  </div>
                  
                  {/* Only Logout Button - No Dashboard option */}
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>
              </div>
            </li>
          )}
        </ul>

        {/* Mobile Navigation Menu */}
        <div className={`mobile-menu md:hidden ${isMenuOpen ? 'active' : ''}`}>
          <div className="mobile-menu-content">
            <Link 
              to="/inventory" 
              className={`mobile-link ${location.pathname === '/inventory' ? 'active' : ''}`}
              onClick={closeMenu}
            >
              Available Vehicle
            </Link>
            <Link 
              to="/dashboard" 
              className={`mobile-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
              onClick={closeMenu}
            >
              Dashboard
            </Link>
            <Link 
              to="/about" 
              className={`mobile-link ${location.pathname === '/about' ? 'active' : ''}`}
              onClick={closeMenu}
            >
              About Us
            </Link>
            <Link 
              to="/contact" 
              className={`mobile-link ${location.pathname === '/contact' ? 'active' : ''}`}
              onClick={closeMenu}
            >
              Contact
            </Link>

            {/* User Profile in Mobile Menu */}
            {isLoggedIn && (() => {
              // Parse user data from localStorage
              let userName = "User";
              let userInitials = "U";
              
              try {
                const userDataStr = localStorage.getItem('user');
                if (userDataStr) {
                  const userData = JSON.parse(userDataStr);
                  if (userData.first_name && userData.last_name) {
                    userName = `${userData.first_name} ${userData.last_name}`;
                    userInitials = `${userData.first_name[0]}${userData.last_name[0]}`.toUpperCase();
                  } else if (userData.first_name) {
                    userName = userData.first_name;
                    userInitials = userData.first_name[0].toUpperCase();
                  } else if (userData.email) {
                    userName = userData.email.split('@')[0];
                    userInitials = userName[0].toUpperCase();
                  }
                }
              } catch (error) {
                console.error('Error parsing user data:', error);
              }

              return (
                <div className="mobile-user-profile">
                  <div className="mobile-user-info">
                    <div className="mobile-user-avatar">
                      {userInitials}
                    </div>
                    <div className="mobile-user-details">
                      <p className="mobile-user-name">{userName}</p>
                      <p className="mobile-user-welcome">Welcome back!</p>
                    </div>
                  </div>
                  
                  {/* Mobile menu now only has logout button */}
                  <button 
                    onClick={handleLogout}
                    className="mobile-logout-btn"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;



// import React, { useState } from 'react';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import './Navbar.css';

// const Navbar: React.FC = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const location = useLocation();
//   const navigate = useNavigate();

//   // Check if user is logged in
//   const isLoggedIn = localStorage.getItem('token') || sessionStorage.getItem('token');
//   // Get user data from localStorage
//   const userData = localStorage.getItem('user');
//   const user = userData ? JSON.parse(userData) : null;
  
//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//   };

//   const closeMenu = () => {
//     setIsMenuOpen(false);
//   };

//   // Get user display name
//   const getUserDisplayName = () => {
//     if (!user) return "User";
    
//     // If user has first_name and last_name fields
//     if (user.first_name && user.last_name) {
//       return `${user.first_name} ${user.last_name}`;
//     }
    
//     // If user has name field (full name)
//     if (user.name) {
//       return user.name;
//     }
    
//     // If user has only email, extract name from email
//     if (user.email) {
//       const emailParts = user.email.split('@')[0];
//       const nameParts = emailParts.split('.');
//       if (nameParts.length >= 2) {
//         return `${capitalizeFirstLetter(nameParts[0])} ${capitalizeFirstLetter(nameParts[1])}`;
//       }
//       return capitalizeFirstLetter(emailParts);
//     }
    
//     return "User";
//   };

//   // Helper function to capitalize first letter
//   const capitalizeFirstLetter = (str: string) => {
//     return str.charAt(0).toUpperCase() + str.slice(1);
//   };

//   // Get user initials for avatar
//   const getUserInitials = () => {
//     const displayName = getUserDisplayName();
//     const nameParts = displayName.split(' ');
    
//     if (nameParts.length >= 2) {
//       return `${nameParts[0].charAt(0)}${nameParts[1].charAt(0)}`.toUpperCase();
//     }
    
//     return displayName.charAt(0).toUpperCase();
//   };

//   const userName = getUserDisplayName();
//   const userInitials = getUserInitials();

//   const handleLogout = () => {
//     // Clear authentication tokens and user data
//     localStorage.removeItem('token');
//     localStorage.removeItem('access_token');
//     sessionStorage.removeItem('token');
//     sessionStorage.removeItem('access_token');
//     localStorage.removeItem('user');
//     localStorage.removeItem('refresh_token');
//     // Close mobile menu if open
//     closeMenu();
//     // Redirect to login page
//     navigate('/login');
//   };

//   // Get link classes for active state
//   const getLinkClasses = (path: string) => {
//     return `px-4 py-2 rounded-lg text-base font-medium italic transition-all duration-300 ${
//       location.pathname === path
//         ? "text-red-500 font-semibold"
//         : "text-white hover:text-blue-500 hover:scale-105"
//     }`;
//   };

//   return (
//     <nav className="bg-gray-900 shadow-md fixed top-0 left-0 w-full z-50">
//       <div className="max-w-7xl mx-auto px-6 py-2 flex justify-between items-center">

//         {/* Logo Section */}
//         <Link to="/" className="flex items-center gap-2">
//           {/* Logo image */}
//           <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
//             <span className="text-white font-bold text-lg">TR</span>
//           </div>
//           <span className="text-white text-xl font-bold italic">TURAGA RENTALS</span>
//         </Link>

//         {/* Mobile Menu Toggle */}
//         <div 
//           className={`navbar-toggle md:hidden ${isMenuOpen ? 'active' : ''}`}
//           onClick={toggleMenu}
//         >
//           <span className="toggle-bar"></span>
//           <span className="toggle-bar"></span>
//           <span className="toggle-bar"></span>
//         </div>

//         {/* Navigation Links - Desktop */}
//         <ul className="hidden md:flex gap-6 items-center">
//           <li>
//             <Link to="/" className={getLinkClasses("/")}>
//               Home
//             </Link>
//           </li>
//           <li>
//             <Link to="/inventory" className={getLinkClasses("/inventory")}>
//               Available Vehicle
//             </Link>
//           </li>
//           <li>
//             <Link to="/dashboard" className={getLinkClasses("/dashboard")}>
//               Dashboard
//             </Link>
//           </li>
//           <li>
//             <Link to="/about" className={getLinkClasses("/about")}>
//               About Us
//             </Link>
//           </li>
//           <li>
//             <Link to="/contact" className={getLinkClasses("/contact")}>
//               Contact
//             </Link>
//           </li>
          
//           {/* User Profile Section - Only show when logged in */}
//           {isLoggedIn && (
//             <li className="flex items-center gap-4 ml-4 pl-4 border-l border-gray-600">
//               {/* User Profile with Dropdown */}
//               <div className="relative group">
//                 <button className="flex items-center gap-2 text-white hover:text-blue-300 transition-colors">
//                   <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
//                     {userInitials}
//                   </div>
//                   <span className="font-medium">{userName}</span>
//                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                   </svg>
//                 </button>
                
//                 {/* Dropdown Menu */}
//                 <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
//                   <div className="px-4 py-2 border-b border-gray-200">
//                     <p className="text-sm font-medium text-gray-800">{userName}</p>
//                     <p className="text-xs text-gray-500">Welcome back!</p>
//                   </div>
                  
//                   <Link 
//                     to="/user/dashboard" 
//                     className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
//                     onClick={closeMenu}
//                   >
//                     📊 Dashboard
//                   </Link>
                  
//                   <div className="border-t border-gray-200 mt-2 pt-2">
//                     <button 
//                       onClick={handleLogout}
//                       className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
//                     >
//                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
//                       </svg>
//                       Logout
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </li>
//           )}
//         </ul>

//         {/* Mobile Navigation Menu */}
// <div className={`mobile-menu md:hidden ${isMenuOpen ? 'active' : ''}`}>
//   <div className="mobile-menu-content">
//     <Link 
//       to="/inventory" 
//       className={`mobile-link ${location.pathname === '/inventory' ? 'active' : ''}`}
//       onClick={closeMenu}
//     >
//       Available Vehicle
//     </Link>
//     <Link 
//       to="/dashboard" 
//       className={`mobile-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
//       onClick={closeMenu}
//     >
//       Dashboard
//     </Link>
//     <Link 
//       to="/about" 
//       className={`mobile-link ${location.pathname === '/about' ? 'active' : ''}`}
//       onClick={closeMenu}
//     >
//       About Us
//     </Link>
//     <Link 
//       to="/contact" 
//       className={`mobile-link ${location.pathname === '/contact' ? 'active' : ''}`}
//       onClick={closeMenu}
//     >
//       Contact
//     </Link>

//     {/* User Profile in Mobile Menu */}
//     {isLoggedIn && (() => {
//       // Parse user data from localStorage
//       let userName = "User";
//       let userInitials = "U";
      
//       try {
//         const userDataStr = localStorage.getItem('user');
//         if (userDataStr) {
//           const userData = JSON.parse(userDataStr);
//           if (userData.first_name && userData.last_name) {
//             userName = `${userData.first_name} ${userData.last_name}`;
//             userInitials = `${userData.first_name[0]}${userData.last_name[0]}`.toUpperCase();
//           } else if (userData.first_name) {
//             userName = userData.first_name;
//             userInitials = userData.first_name[0].toUpperCase();
//           } else if (userData.email) {
//             userName = userData.email.split('@')[0];
//             userInitials = userName[0].toUpperCase();
//           }
//         }
//       } catch (error) {
//         console.error('Error parsing user data:', error);
//       }

//       return (
//         <div className="mobile-user-profile">
//           <div className="mobile-user-info">
//             <div className="mobile-user-avatar">
//               {userInitials}
//             </div>
//             <div className="mobile-user-details">
//               <p className="mobile-user-name">{userName}</p>
//               <p className="mobile-user-welcome">Welcome back!</p>
//             </div>
//           </div>
//           <Link 
//             to="/dashboard" 
//             className="mobile-profile-link"
//             onClick={closeMenu}
//           >
//             <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
//             </svg>
//             Dashboard
//           </Link>
//           <Link 
//             to="/dashboard/profile" 
//             className="mobile-profile-link"
//             onClick={closeMenu}
//           >
//             <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//             </svg>
//             My Profile
//           </Link>
//           <Link 
//             to="/dashboard/bookings" 
//             className="mobile-profile-link"
//             onClick={closeMenu}
//           >
//             <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//             </svg>
//             My Bookings
//           </Link>
//           <button 
//             onClick={handleLogout}
//             className="mobile-logout-btn"
//           >
//             <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
//             </svg>
//             Logout
//           </button>
//         </div>
//       );
//     })()}
//   </div>
// </div>


































       
       
       
       
       
       





//       </div>
//     </nav>
//   );
// };

// export default Navbar;

