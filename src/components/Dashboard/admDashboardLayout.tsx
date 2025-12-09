// import React, { useState } from 'react';
// import { useSelector } from 'react-redux';
// import { Outlet } from 'react-router-dom'; // Add this
// import { type RootState } from '../../store/store';
// import AdminSidebar from './admnSideBar'; // Adjust path if needed
// import AdminHeader from './admnHeader'; // Adjust path if needed
// import { dashboardDataApi } from '../../API/dashboardDataApi';
// import { skipToken } from '@reduxjs/toolkit/query';

// // Remove this interface
// // interface AdminDashboardLayoutProps {
// //   children: React.ReactNode;
// // }

// const AdminDashboardLayout: React.FC = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

//   // Fetch dashboard data for sidebar stats
//   const { 
//     data: dashboardData, 
//     isLoading: statsLoading,
//     isSuccess: statsLoaded
//   } = dashboardDataApi.useGetAdminDashboardDataQuery(
//     isAuthenticated ? undefined : skipToken
//   );

//   // Extract REAL stats for sidebar from your API response
//   const adminStats = dashboardData ? {
//     totalBookings: dashboardData.totalBookings,
//     totalRevenue: dashboardData.totalRevenue,
//     totalUsers: dashboardData.totalUsers,
//     activeVehicles: dashboardData.activeVehicles,
//     pendingBookings: dashboardData.pendingBookings,
//     completedBookings: dashboardData.completedBookings,
//     activeBookings: dashboardData.activeBookings,
//   } : undefined;

//   // International date and time formatting
//   const currentDateTime = new Date().toLocaleDateString('en-US', {
//     weekday: 'long',
//     year: 'numeric',
//     month: 'long',
//     day: 'numeric',
//     hour: '2-digit',
//     minute: '2-digit',
//     timeZoneName: 'short'
//   });

//   if (!user) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading authentication...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
//       {/* System Status Bar */}
//       <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-1 px-4 text-xs font-medium">
//         <div className="max-w-7xl mx-auto flex justify-between items-center">
//           <div className="flex items-center space-x-4">
//             <span>🌐 System Status: {statsLoading ? 'Loading...' : 'Live Data'}</span>
//             <span className="hidden md:inline">|</span>
//             <span className="hidden md:inline">🕒 {currentDateTime}</span>
//           </div>
//           <div className="flex items-center space-x-4">
//             <span className="hidden lg:inline">🚀 Admin Panel v2.1</span>
//             <span className="flex items-center">
//               <span className={`w-2 h-2 rounded-full mr-2 ${statsLoading ? 'animate-pulse bg-yellow-400' : 'bg-green-400'}`}></span>
//               {statsLoading ? 'Loading...' : 'Live'}
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Sidebar Overlay */}
//       {sidebarOpen && (
//         <div 
//           className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}
      
//       {/* Admin Sidebar */}
//       <div className={`
//         fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-2xl transform transition-all duration-300 ease-in-out
//         ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
//         lg:translate-x-0 lg:static lg:inset-0 border-r border-gray-200
//       `}>
//         <AdminSidebar 
//           user={user} 
//           stats={adminStats}
//           isLoading={statsLoading}
//         />
//       </div>

//       {/* Main Content Area */}
//       <div className="lg:ml-80 flex flex-col min-h-screen">
//         {/* Admin Header */}
//         <AdminHeader 
//           user={user}
//           onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
//         />
        
//         {/* Page Content - Use Outlet */}
//         <main className="flex-1 p-6 lg:p-8">
//           <div className="max-w-7xl mx-auto">
//             <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200/50 min-h-[calc(100vh-12rem)]">
//               <Outlet /> {/* This renders the child routes */}
//             </div>
//           </div>
//         </main>

//         {/* Footer */}
//         <footer className="bg-white border-t border-gray-200 py-4 px-6">
//           <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
//             <div className="flex items-center space-x-4 mb-2 md:mb-0">
//               <span>© 2024 VehicleRent International</span>
//               <span className="hidden md:inline">•</span>
//               <span className="hidden md:inline">🌍 Global Admin System</span>
//             </div>
//             <div className="flex items-center space-x-4">
//               <span>Language: English</span>
//               <span>•</span>
//               <span>Timezone: UTC{new Date().getTimezoneOffset() / -60}</span>
//             </div>
//           </div>
//         </footer>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboardLayout;


import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { type RootState } from '../../store/store';
import AdminSidebar from '../Dashboard/admnSideBar';
import AdminHeader from '../Dashboard/admnHeader';
import { dashboardDataApi } from '../../API/dashboardDataApi';
import { skipToken } from '@reduxjs/toolkit/query';

interface AdminDashboardLayoutProps {
  children: React.ReactNode;
}

const AdminDashboardLayout: React.FC<AdminDashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  // Fetch dashboard data for sidebar stats - This gets REAL data from your database
  const { 
    data: dashboardData, 
    isLoading: statsLoading,
    isSuccess: statsLoaded
  } = dashboardDataApi.useGetAdminDashboardDataQuery(
    isAuthenticated ? undefined : skipToken
  );

  // Extract REAL stats for sidebar from your API response
  const adminStats = dashboardData ? {
    // These are REAL values from your database that will update automatically
    totalBookings: dashboardData.totalBookings, // e.g., 34
    totalRevenue: dashboardData.totalRevenue,
    totalUsers: dashboardData.totalUsers, // e.g., 6
    activeVehicles: dashboardData.activeVehicles, // e.g., 12
    pendingBookings: dashboardData.pendingBookings, // e.g., 5
    completedBookings: dashboardData.completedBookings, // e.g., 15
    activeBookings: dashboardData.activeBookings, // e.g., 8
    // Note: When new users register or bookings are made, these values update automatically
    // because the API fetches fresh data from the database
  } : undefined;

  // International date and time formatting
  const currentDateTime = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* System Status Bar */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-1 px-4 text-xs font-medium">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span>🌐 System Status: {statsLoading ? 'Loading...' : 'Live Data'}</span>
            <span className="hidden md:inline">|</span>
            <span className="hidden md:inline">🕒 {currentDateTime}</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="hidden lg:inline">🚀 Admin Panel v2.1</span>
            <span className="flex items-center">
              <span className={`w-2 h-2 rounded-full mr-2 ${statsLoading ? 'animate-pulse bg-yellow-400' : 'bg-green-400'}`}></span>
              {statsLoading ? 'Loading...' : 'Live'}
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Admin Sidebar with REAL database badge numbers */}
      {/* When stats are loaded, they show ACTUAL database values (e.g., Users: 6) */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-2xl transform transition-all duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0 border-r border-gray-200
      `}>
        <AdminSidebar 
          user={user} 
          stats={adminStats}  // Pass REAL database stats
          isLoading={statsLoading}
        />
      </div>

      {/* Main Content Area */}
      <div className="lg:ml-80 flex flex-col min-h-screen">
        {/* Admin Header */}
        <AdminHeader 
          user={user}
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        />
        
        {/* Page Content */}
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Content Wrapper with International Spacing */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200/50 min-h-[calc(100vh-12rem)]">
              {children}
            </div>
          </div>
        </main>

        {/* International Footer */}
        <footer className="bg-white border-t border-gray-200 py-4 px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
            <div className="flex items-center space-x-4 mb-2 md:mb-0">
              <span>© 2024 VehicleRent International</span>
              <span className="hidden md:inline">•</span>
              <span className="hidden md:inline">🌍 Global Admin System</span>
            </div>
            <div className="flex items-center space-x-4">
              <span>Language: English</span>
              <span>•</span>
              <span>Timezone: UTC{new Date().getTimezoneOffset() / -60}</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;