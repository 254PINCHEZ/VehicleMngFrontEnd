import React, { useState } from 'react';
import {  useSelector } from 'react-redux';
import {type User } from '../../types/types';
import {type RootState } from '../../store/store';

interface ProfileFormProps {
  user: User;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ user }) => {
//   const dispatch = useDispatch();
  const { isLoading } = useSelector((state: RootState) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    contact_phone: user.contact_phone || '',
    address: user.address || '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (formData.contact_phone && !/^[\+]?[1-9][\d]{0,15}$/.test(formData.contact_phone.replace(/\D/g, ''))) {
      newErrors.contact_phone = 'Phone number is invalid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      // Simulate API call
      console.log('Updating profile:', formData);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Here you would dispatch an action to update the user profile
      // dispatch(updateProfile(formData));
      
      setIsEditing(false);
      // Show success message
    } catch (error) {
      console.error('Failed to update profile:', error);
      setErrors({ submit: 'Failed to update profile. Please try again.' });
    }
  };

  const handleCancel = () => {
    setFormData({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      contact_phone: user.contact_phone || '',
      address: user.address || '',
    });
    setErrors({});
    setIsEditing(false);
  };

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{1,3})?(\d{0,3})?(\d{0,4})?$/);
    if (match) {
      return !match[2] ? match[1] : `(${match[1]}) ${match[2]}${match[3] ? `-${match[3]}` : ''}`;
    }
    return value;
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Form Fields Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* First Name */}
        <div>
          <label htmlFor="first_name" className="block text-sm font-medium text-slate-700 mb-2">
            First Name *
          </label>
          <input
            type="text"
            id="first_name"
            value={formData.first_name}
            onChange={(e) => handleInputChange('first_name', e.target.value)}
            disabled={!isEditing}
            className={`input input-bordered w-full ${errors.first_name ? 'input-error' : ''} ${!isEditing ? 'bg-slate-50' : ''}`}
            placeholder="Enter your first name"
          />
          {errors.first_name && (
            <p className="mt-1 text-sm text-red-600">{errors.first_name}</p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label htmlFor="last_name" className="block text-sm font-medium text-slate-700 mb-2">
            Last Name *
          </label>
          <input
            type="text"
            id="last_name"
            value={formData.last_name}
            onChange={(e) => handleInputChange('last_name', e.target.value)}
            disabled={!isEditing}
            className={`input input-bordered w-full ${errors.last_name ? 'input-error' : ''} ${!isEditing ? 'bg-slate-50' : ''}`}
            placeholder="Enter your last name"
          />
          {errors.last_name && (
            <p className="mt-1 text-sm text-red-600">{errors.last_name}</p>
          )}
        </div>

        {/* Email */}
        <div className="md:col-span-2">
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            disabled={!isEditing}
            className={`input input-bordered w-full ${errors.email ? 'input-error' : ''} ${!isEditing ? 'bg-slate-50' : ''}`}
            placeholder="Enter your email address"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
          {!isEditing && (
            <p className="mt-1 text-sm text-slate-500">
              Contact support to change your email address
            </p>
          )}
        </div>

        {/* Phone Number */}
        <div className="md:col-span-2">
          <label htmlFor="contact_phone" className="block text-sm font-medium text-slate-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            id="contact_phone"
            value={formData.contact_phone}
            onChange={(e) => handleInputChange('contact_phone', formatPhoneNumber(e.target.value))}
            disabled={!isEditing}
            className={`input input-bordered w-full ${errors.contact_phone ? 'input-error' : ''} ${!isEditing ? 'bg-slate-50' : ''}`}
            placeholder="(555) 123-4567"
            maxLength={18}
          />
          {errors.contact_phone && (
            <p className="mt-1 text-sm text-red-600">{errors.contact_phone}</p>
          )}
          <p className="mt-1 text-sm text-slate-500">
            Used for important notifications and rental updates
          </p>
        </div>

        {/* Address */}
        <div className="md:col-span-2">
          <label htmlFor="address" className="block text-sm font-medium text-slate-700 mb-2">
            Address
          </label>
          <textarea
            id="address"
            rows={3}
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            disabled={!isEditing}
            className={`textarea textarea-bordered w-full ${errors.address ? 'textarea-error' : ''} ${!isEditing ? 'bg-slate-50' : ''}`}
            placeholder="Enter your full address"
          />
          <p className="mt-1 text-sm text-slate-500">
            Used for billing and rental documentation
          </p>
        </div>
      </div>

      {/* Submit Error */}
      {errors.submit && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center space-x-2 text-red-800">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium">{errors.submit}</span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-200">
        {!isEditing ? (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="btn btn-primary sm:flex-1"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Profile
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={handleCancel}
              className="btn btn-outline sm:flex-1"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary sm:flex-1"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner loading-sm mr-2"></span>
                  Saving...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save Changes
                </>
              )}
            </button>
          </>
        )}
      </div>

      {/* Read-only Notice */}
      {!isEditing && (
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-blue-600 text-sm">ℹ️</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-800 mb-1">
                Profile Information
              </p>
              <p className="text-blue-700 text-sm">
                Click "Edit Profile" to update your personal information. Required fields are marked with an asterisk (*).
              </p>
            </div>
          </div>
        </div>
      )}
    </form>
  );
};

export default ProfileForm;