import React, { useState } from 'react';
import {  useSelector } from 'react-redux';
import {type RootState } from '../../store/store';

const ChangePassword: React.FC = () => {
//   const dispatch = useDispatch();
  const { isLoading } = useSelector((state: RootState) => state.auth);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.currentPassword.trim()) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!formData.newPassword.trim()) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.newPassword)) {
      newErrors.newPassword = 'Password must include uppercase, lowercase, and numbers';
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: '', color: '' };
    
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    const strengthMap = {
      0: { label: 'Very Weak', color: 'bg-red-500' },
      1: { label: 'Weak', color: 'bg-red-400' },
      2: { label: 'Fair', color: 'bg-orange-500' },
      3: { label: 'Good', color: 'bg-yellow-500' },
      4: { label: 'Strong', color: 'bg-green-500' },
      5: { label: 'Very Strong', color: 'bg-green-600' },
    };

    return { strength, ...strengthMap[strength as keyof typeof strengthMap] };
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const togglePasswordVisibility = (field: keyof typeof showPassword) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      // Simulate API call
      console.log('Changing password...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would dispatch an action to change the password
      // dispatch(changePassword(formData));
      
      // Reset form on success
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setErrors({});
      
      // Show success message
      console.log('Password changed successfully');
    } catch (error) {
      console.error('Failed to change password:', error);
      setErrors({ submit: 'Failed to change password. Please try again.' });
    }
  };

  const passwordStrength = getPasswordStrength(formData.newPassword);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Security Notice */}
      <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-blue-600 text-sm">🔒</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-blue-800 mb-1">
              Password Security
            </p>
            <p className="text-blue-700 text-sm">
              For your security, choose a strong password that you haven't used before on other sites.
            </p>
          </div>
        </div>
      </div>

      {/* Current Password */}
      <div>
        <label htmlFor="currentPassword" className="block text-sm font-medium text-slate-700 mb-2">
          Current Password *
        </label>
        <div className="relative">
          <input
            type={showPassword.current ? "text" : "password"}
            id="currentPassword"
            value={formData.currentPassword}
            onChange={(e) => handleInputChange('currentPassword', e.target.value)}
            className={`input input-bordered w-full pr-10 ${errors.currentPassword ? 'input-error' : ''}`}
            placeholder="Enter your current password"
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility('current')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
          >
            {showPassword.current ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>
        {errors.currentPassword && (
          <p className="mt-1 text-sm text-red-600">{errors.currentPassword}</p>
        )}
      </div>

      {/* New Password */}
      <div>
        <label htmlFor="newPassword" className="block text-sm font-medium text-slate-700 mb-2">
          New Password *
        </label>
        <div className="relative">
          <input
            type={showPassword.new ? "text" : "password"}
            id="newPassword"
            value={formData.newPassword}
            onChange={(e) => handleInputChange('newPassword', e.target.value)}
            className={`input input-bordered w-full pr-10 ${errors.newPassword ? 'input-error' : ''}`}
            placeholder="Create a new password"
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility('new')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
          >
            {showPassword.new ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>
        
        {/* Password Strength Meter */}
        {formData.newPassword && (
          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Password strength:</span>
              <span className={`font-medium ${
                passwordStrength.strength <= 2 ? 'text-red-600' :
                passwordStrength.strength <= 3 ? 'text-orange-600' :
                passwordStrength.strength <= 4 ? 'text-yellow-600' : 'text-green-600'
              }`}>
                {passwordStrength.label}
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {errors.newPassword && (
          <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
        )}

        {/* Password Requirements */}
        <div className="mt-3 space-y-1">
          <p className="text-sm text-slate-600 mb-2">Password must contain:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-sm">
            <div className="flex items-center space-x-2">
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${
                formData.newPassword.length >= 8 ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'
              }`}>
                {formData.newPassword.length >= 8 ? '✓' : '•'}
              </span>
              <span className={formData.newPassword.length >= 8 ? 'text-green-600' : 'text-slate-500'}>
                8+ characters
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${
                /[a-z]/.test(formData.newPassword) ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'
              }`}>
                {/[a-z]/.test(formData.newPassword) ? '✓' : '•'}
              </span>
              <span className={/[a-z]/.test(formData.newPassword) ? 'text-green-600' : 'text-slate-500'}>
                Lowercase letter
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${
                /[A-Z]/.test(formData.newPassword) ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'
              }`}>
                {/[A-Z]/.test(formData.newPassword) ? '✓' : '•'}
              </span>
              <span className={/[A-Z]/.test(formData.newPassword) ? 'text-green-600' : 'text-slate-500'}>
                Uppercase letter
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${
                /[0-9]/.test(formData.newPassword) ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'
              }`}>
                {/[0-9]/.test(formData.newPassword) ? '✓' : '•'}
              </span>
              <span className={/[0-9]/.test(formData.newPassword) ? 'text-green-600' : 'text-slate-500'}>
                Number
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Password */}
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-2">
          Confirm New Password *
        </label>
        <div className="relative">
          <input
            type={showPassword.confirm ? "text" : "password"}
            id="confirmPassword"
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            className={`input input-bordered w-full pr-10 ${errors.confirmPassword ? 'input-error' : ''}`}
            placeholder="Confirm your new password"
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility('confirm')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
          >
            {showPassword.confirm ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
        )}
        {formData.confirmPassword && formData.newPassword === formData.confirmPassword && (
          <p className="mt-1 text-sm text-green-600 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Passwords match
          </p>
        )}
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

      {/* Submit Button */}
      <div className="pt-6 border-t border-slate-200">
        <button
          type="submit"
          className="btn btn-primary w-full sm:w-auto"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="loading loading-spinner loading-sm mr-2"></span>
              Updating Password...
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Update Password
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ChangePassword;