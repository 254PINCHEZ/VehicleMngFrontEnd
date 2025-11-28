import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {type RootState } from '../../store/store';
import Sidebar from '../Dashboard/SideBar';
import Header from './Header';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);

  if (!user) {
    return null; // Or redirect to login
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900 bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0
      `}>
        <Sidebar user={user} />
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <Header 
          user={user}
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        />
        
        {/* Page Content */}
        <main className="min-h-screen p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;