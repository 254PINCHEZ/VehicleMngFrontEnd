import React, { useState } from 'react'
import DashboardLayout from '../../components/Dashboard/DashboardLayout'
import { Settings, Lock, Bell, Shield, Eye, EyeOff, Save} from 'lucide-react'
import { useSelector } from 'react-redux'
import type { RootState } from '../../store/store'
import Swal from 'sweetalert2'

const AccountSettings: React.FC = () => {
    useSelector((state: RootState) => state.auth);
    
    // Password state
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    // Notification preferences state
    const [notifications, setNotifications] = useState({
        emailNotifications: true,
        smsNotifications: false,
        bookingReminders: true,
        paymentReceipts: true,
        promotionalEmails: false,
        securityAlerts: true
    });

    // Privacy settings state
    const [privacySettings, setPrivacySettings] = useState({
        profileVisibility: 'private',
        searchEngineIndexing: false,
        dataSharing: false,
        marketingCommunications: false
    });

    // Handle password change
    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            Swal.fire("Error", "New passwords do not match", "error");
            return;
        }

        if (passwordData.newPassword.length < 6) {
            Swal.fire("Error", "Password must be at least 6 characters long", "error");
            return;
        }

        setIsChangingPassword(true);

        try {
            // Replace with actual API call
            // await userApi.changePassword(passwordData).unwrap();
            
            // Mock success
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            Swal.fire({
                title: "Password Updated!",
                text: "Your password has been changed successfully.",
                icon: "success",
                confirmButtonColor: "#2563eb"
            });

            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            Swal.fire("Error", "Failed to update password. Please try again.", "error");
        } finally {
            setIsChangingPassword(false);
        }
    };

    // Handle notification preferences change
    const handleNotificationChange = (key: string, value: boolean) => {
        setNotifications(prev => ({
            ...prev,
            [key]: value
        }));
    };

    // Handle privacy settings change
    const handlePrivacyChange = (key: string, value: unknown) => {
        setPrivacySettings(prev => ({
            ...prev,
            [key]: value
        }));
    };

    // Save notification preferences
    const saveNotificationPreferences = async () => {

        try {
            // Replace with actual API call
            // await userApi.updateNotifications(notifications).unwrap();
            
            // Mock success
            await new Promise(resolve => setTimeout(resolve, 800));
            
            Swal.fire({
                title: "Preferences Saved!",
                text: "Your notification preferences have been updated.",
                icon: "success",
                confirmButtonColor: "#2563eb"
            });
            
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            Swal.fire("Error", "Failed to update preferences. Please try again.", "error");
        }
    };

    // Save privacy settings
    const savePrivacySettings = async () => {

        try {
            // Replace with actual API call
            // await userApi.updatePrivacySettings(privacySettings).unwrap();
            
            // Mock success
            await new Promise(resolve => setTimeout(resolve, 800));
            
            Swal.fire({
                title: "Settings Saved!",
                text: "Your privacy settings have been updated.",
                icon: "success",
                confirmButtonColor: "#2563eb"
            });
            
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            Swal.fire("Error", "Failed to update settings. Please try again.", "error");
        }
    };

    return (
        <DashboardLayout>
            {/* Header Section */}
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-100 rounded-lg">
                    <Settings className="text-purple-600" size={24} />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Account Settings</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Change Password Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Lock className="text-blue-600" size={20} />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-800">Change Password</h2>
                    </div>

                    <form onSubmit={handlePasswordChange} className="space-y-4">
                        {/* Current Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Current Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showCurrentPassword ? "text" : "password"}
                                    value={passwordData.currentPassword}
                                    onChange={(e) => setPasswordData(prev => ({
                                        ...prev,
                                        currentPassword: e.target.value
                                    }))}
                                    className="input input-bordered w-full pr-10 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                    placeholder="Enter current password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* New Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showNewPassword ? "text" : "password"}
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData(prev => ({
                                        ...prev,
                                        newPassword: e.target.value
                                    }))}
                                    className="input input-bordered w-full pr-10 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                    placeholder="Enter new password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData(prev => ({
                                        ...prev,
                                        confirmPassword: e.target.value
                                    }))}
                                    className="input input-bordered w-full pr-10 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                    placeholder="Confirm new password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isChangingPassword}
                            className="btn bg-blue-600 hover:bg-blue-700 text-white w-full disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isChangingPassword ? (
                                <span className="loading loading-spinner loading-sm"></span>
                            ) : (
                                <Lock size={16} className="mr-2" />
                            )}
                            Update Password
                        </button>
                    </form>
                </div>

                {/* Notification Preferences */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <Bell className="text-green-600" size={20} />
                            </div>
                            <h2 className="text-lg font-semibold text-gray-800">Notification Preferences</h2>
                        </div>
                        <button
                            onClick={saveNotificationPreferences}
                            className="btn btn-outline btn-sm border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                        >
                            <Save size={14} className="mr-1" />
                            Save
                        </button>
                    </div>

                    <div className="space-y-4">
                        {Object.entries(notifications).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-150">
                                <div>
                                    <label className="font-medium text-gray-700 capitalize">
                                        {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                                    </label>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {getNotificationDescription(key)}
                                    </p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={value}
                                    onChange={(e) => handleNotificationChange(key, e.target.checked)}
                                    className="toggle toggle-success"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Privacy Settings */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:col-span-2">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-100 rounded-lg">
                                <Shield className="text-red-600" size={20} />
                            </div>
                            <h2 className="text-lg font-semibold text-gray-800">Privacy Settings</h2>
                        </div>
                        <button
                            onClick={savePrivacySettings}
                            className="btn btn-outline btn-sm border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                        >
                            <Save size={14} className="mr-1" />
                            Save
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Profile Visibility */}
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-gray-700">
                                Profile Visibility
                            </label>
                            <select
                                value={privacySettings.profileVisibility}
                                onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
                                className="select select-bordered w-full focus:border-red-500 focus:ring-2 focus:ring-red-200"
                            >
                                <option value="public">Public</option>
                                <option value="private">Private</option>
                                <option value="contacts">Contacts Only</option>
                            </select>
                            <p className="text-sm text-gray-500">
                                Control who can see your profile information
                            </p>
                        </div>

                        {/* Search Engine Indexing */}
                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                            <div>
                                <label className="font-medium text-gray-700 block">
                                    Search Engine Indexing
                                </label>
                                <p className="text-sm text-gray-500">
                                    Allow search engines to index your profile
                                </p>
                            </div>
                            <input
                                type="checkbox"
                                checked={privacySettings.searchEngineIndexing}
                                onChange={(e) => handlePrivacyChange('searchEngineIndexing', e.target.checked)}
                                className="toggle toggle-error"
                            />
                        </div>

                        {/* Data Sharing */}
                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                            <div>
                                <label className="font-medium text-gray-700 block">
                                    Data Sharing
                                </label>
                                <p className="text-sm text-gray-500">
                                    Share anonymous usage data to improve our services
                                </p>
                            </div>
                            <input
                                type="checkbox"
                                checked={privacySettings.dataSharing}
                                onChange={(e) => handlePrivacyChange('dataSharing', e.target.checked)}
                                className="toggle toggle-error"
                            />
                        </div>

                        {/* Marketing Communications */}
                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                            <div>
                                <label className="font-medium text-gray-700 block">
                                    Marketing Communications
                                </label>
                                <p className="text-sm text-gray-500">
                                    Receive promotional emails and offers
                                </p>
                            </div>
                            <input
                                type="checkbox"
                                checked={privacySettings.marketingCommunications}
                                onChange={(e) => handlePrivacyChange('marketingCommunications', e.target.checked)}
                                className="toggle toggle-error"
                            />
                        </div>
                    </div>
                </div>

                {/* Account Actions */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:col-span-2">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Account Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button
                            onClick={() => Swal.fire("Info", "Export feature coming soon", "info")}
                            className="btn btn-outline border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white"
                        >
                            Export Data
                        </button>
                        <button
                            onClick={() => {
                                Swal.fire({
                                    title: "Delete Account?",
                                    text: "This action cannot be undone. All your data will be permanently deleted.",
                                    icon: "warning",
                                    showCancelButton: true,
                                    confirmButtonColor: "#dc2626",
                                    cancelButtonColor: "#6b7280",
                                    confirmButtonText: "Yes, Delete Account",
                                    cancelButtonText: "Cancel"
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        Swal.fire("Deleted!", "Your account has been scheduled for deletion.", "success");
                                    }
                                });
                            }}
                            className="btn btn-outline btn-error hover:bg-red-600 hover:text-white"
                        >
                            Delete Account
                        </button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

// Helper function for notification descriptions
const getNotificationDescription = (key: string): string => {
    const descriptions: { [key: string]: string } = {
        emailNotifications: "Receive important updates via email",
        smsNotifications: "Get SMS alerts for urgent matters",
        bookingReminders: "Reminders before your booking starts",
        paymentReceipts: "Email receipts for all payments",
        promotionalEmails: "Special offers and promotions",
        securityAlerts: "Important security and account notifications"
    };
    return descriptions[key] || "Notification preference";
};

export default AccountSettings;