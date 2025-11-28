import React from 'react';
import {type User } from '../../types/types';

interface ProfileHeaderProps {
  user: User;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user }) => {
  const getInitials = () => {
    return `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`.toUpperCase();
  };

  const getMemberDuration = () => {
    const joinDate = new Date(user.created_at);
    const now = new Date();
    const years = now.getFullYear() - joinDate.getFullYear();
    const months = now.getMonth() - joinDate.getMonth();
    
    if (years > 0) {
      return `${years} year${years > 1 ? 's' : ''}`;
    }
    return `${months} month${months > 1 ? 's' : ''}`;
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        {/* User Info */}
        <div className="flex items-center space-x-6">
          {/* Avatar */}
          <div className="relative">
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center border-2 border-white border-opacity-30">
              <span className="text-2xl font-bold text-white">
                {getInitials()}
              </span>
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          {/* User Details */}
          <div>
            <h1 className="text-2xl font-bold mb-2">
              {user.first_name} {user.last_name}
            </h1>
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-blue-100">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-sm">{user.email}</span>
              </div>
              {user.contact_phone && (
                <div className="flex items-center space-x-2 text-blue-100">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-sm">{user.contact_phone}</span>
                </div>
              )}
              <div className="flex items-center space-x-2 text-blue-100">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm">Member for {getMemberDuration()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 lg:mt-0 flex space-x-6">
          <div className="text-center">
            <div className="text-2xl font-bold">12</div>
            <div className="text-blue-200 text-sm">Bookings</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">4.8</div>
            <div className="text-blue-200 text-sm">Rating</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{getMemberDuration().split(' ')[0]}</div>
            <div className="text-blue-200 text-sm">Loyalty</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-white border-opacity-20">
        <button className="btn btn-sm btn-outline text-white border-white border-opacity-40 hover:bg-white hover:bg-opacity-10">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Change Photo
        </button>
        <button className="btn btn-sm btn-outline text-white border-white border-opacity-40 hover:bg-white hover:bg-opacity-10">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          Share Profile
        </button>
        <button className="btn btn-sm btn-outline text-white border-white border-opacity-40 hover:bg-white hover:bg-opacity-10">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Export Data
        </button>
      </div>
    </div>
  );
};

export default ProfileHeader;