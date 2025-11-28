import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {type RootState } from '../../store/store';
import ProfileHeader from '../profile/ProfileHeader';
import ProfileForm from '../profile/ProfileForm';
import ChangePassword from '../profile/ChangePassword';
// import AccountSettings from '../profile/';

const Profile: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'settings'>('profile');

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
          <p className="text-slate-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'profile' as const, label: 'Personal Information', icon: '👤' },
    { id: 'security' as const, label: 'Security', icon: '🔐' },
    { id: 'settings' as const, label: 'Preferences', icon: '⚙️' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Account Settings</h1>
          <p className="text-slate-600">
            Manage your personal information, security settings, and preferences
          </p>
        </div>
        <div className="mt-4 lg:mt-0">
          <div className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            Member since {new Date(user.created_at).getFullYear()}
          </div>
        </div>
      </div>

      {/* Profile Header */}
      <ProfileHeader user={user} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="xl:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 sticky top-6">
            <h3 className="font-semibold text-slate-900 mb-4 text-sm uppercase tracking-wide">
              Account Settings
            </h3>
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>

            {/* Account Status */}
            <div className="mt-8 pt-6 border-t border-slate-200">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Account Status</span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200">
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Email Verified</span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200">
                    Verified
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Role</span>
                  <span className="text-sm font-medium text-slate-900 capitalize">
                    {user.role}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="xl:col-span-3 space-y-6">
          {/* Personal Information Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                <div className="flex items-center mb-6">
                  <h2 className="text-xl font-bold text-slate-900 flex items-center">
                    <span className="w-2 h-6 bg-blue-600 rounded-full mr-3"></span>
                    Personal Information
                  </h2>
                </div>
                <ProfileForm user={user} />
              </div>

              {/* Driver's License Section */}
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-slate-900 flex items-center">
                    <span className="w-2 h-6 bg-emerald-600 rounded-full mr-3"></span>
                    Driver's License
                  </h2>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                    Pending Verification
                  </span>
                </div>
                <div className="space-y-4">
                  <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-amber-600 text-sm">📄</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-amber-800 mb-1">
                          License Verification Required
                        </p>
                        <p className="text-amber-700 text-sm">
                          Please upload a clear photo of your driver's license to complete verification.
                          This is required for vehicle rentals.
                        </p>
                      </div>
                    </div>
                  </div>
                  <button className="btn btn-primary">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Upload Driver's License
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
              <div className="flex items-center mb-6">
                <h2 className="text-xl font-bold text-slate-900 flex items-center">
                  <span className="w-2 h-6 bg-blue-600 rounded-full mr-3"></span>
                  Security Settings
                </h2>
              </div>
              <ChangePassword />
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
              <div className="flex items-center mb-6">
                <h2 className="text-xl font-bold text-slate-900 flex items-center">
                  <span className="w-2 h-6 bg-blue-600 rounded-full mr-3"></span>
                  Account Preferences
                </h2>
              </div>
              {/* <AccountSettings /> */}
            </div>
          )}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-2xl shadow-lg border border-red-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-red-900 mb-2">Danger Zone</h3>
            <p className="text-red-700 text-sm">
              Once you delete your account, there is no going back. Please be certain.
            </p>
          </div>
          <button className="btn btn-error btn-outline">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;