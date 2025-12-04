import React, { useState, useEffect } from 'react';
import AdminDashboardLayout from '../../components/Dashboard/admDashboardLayout';
import { Settings, Save, RefreshCw, XCircle } from 'lucide-react';
import { settingsApi } from '../../API/settingsAPi';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { skipToken } from '@reduxjs/toolkit/query';

// Define TypeScript interface for settings
interface SystemSettings {
    siteName: string;
    adminEmail: string;
    supportEmail: string;
    timezone: string;
    language: string;
    currency: string;
}

const AdminSettings: React.FC = () => {
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    const [isSaving, setIsSaving] = useState(false);

    // RTK Query Hook to fetch settings - matches your reference pattern
    const { 
        data: settingsData, 
        isLoading: settingsIsLoading, 
        error 
    } = settingsApi.useGetSettingsQuery(
        isAuthenticated ? undefined : skipToken
    );

    // RTK mutation to update settings
    const [updateSettings] = settingsApi.useUpdateSettingsMutation();

    // Settings state - simplified to essential fields
    const [settings, setSettings] = useState<SystemSettings>({
        siteName: '',
        adminEmail: '',
        supportEmail: '',
        timezone: 'UTC-5',
        language: 'en',
        currency: 'USD'
    });

    // Initialize settings from API data
    useEffect(() => {
        if (settingsData) {
            setSettings({
                siteName: settingsData.siteName || '',
                adminEmail: settingsData.adminEmail || '',
                supportEmail: settingsData.supportEmail || '',
                timezone: settingsData.timezone || 'UTC-5',
                language: settingsData.language || 'en',
                currency: settingsData.currency || 'USD'
            });
        }
    }, [settingsData]);

    // Handle input changes
    const handleInputChange = (field: keyof SystemSettings, value: string) => {
        setSettings(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Handle save settings - matches your AllCustomers.tsx pattern
    const handleSaveSettings = async () => {
        setIsSaving(true);
        
        try {
            await updateSettings(settings).unwrap();
            
            Swal.fire({
                title: 'Success!',
                text: 'Settings updated successfully.',
                icon: 'success',
                confirmButtonColor: '#10b981'
            });
        } catch (error: any) {
            Swal.fire({
                title: 'Error!',
                text: 'Failed to update settings. Please try again.',
                icon: 'error',
                confirmButtonColor: '#ef4444'
            });
        } finally {
            setIsSaving(false);
        }
    };

    // Handle reset to defaults
    const handleResetDefaults = async () => {
        const result = await Swal.fire({
            title: 'Reset to Defaults?',
            text: 'This will reset all settings to their default values.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, Reset',
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280'
        });

        if (result.isConfirmed) {
            setSettings({
                siteName: 'VehicleRent Pro',
                adminEmail: 'admin@vehiclerent.com',
                supportEmail: 'support@vehiclerent.com',
                timezone: 'UTC-5',
                language: 'en',
                currency: 'USD'
            });

            Swal.fire("Reset", "Settings have been reset to default values.", "success");
        }
    };

    return (
        <AdminDashboardLayout>
            {/* Header - matches your AllCustomers.tsx pattern */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <Settings className="text-blue-600" size={24} />
                    </div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-800">System Settings</h1>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={handleResetDefaults}
                        className="btn btn-outline btn-error"
                    >
                        <RefreshCw size={16} />
                        Reset
                    </button>
                    <button
                        onClick={handleSaveSettings}
                        disabled={isSaving}
                        className="btn bg-green-800 hover:bg-green-900 text-white"
                    >
                        {isSaving ? (
                            <span className="loading loading-spinner loading-sm"></span>
                        ) : (
                            <Save size={16} />
                        )}
                        Save Changes
                    </button>
                </div>
            </div>

            {/* Loading State - matches your AllCustomers.tsx pattern */}
            {settingsIsLoading ? (
                <div className="flex justify-center items-center py-16">
                    <span className="loading loading-spinner loading-lg text-green-600"></span>
                    <span className="ml-3 text-gray-600">Loading settings...</span>
                </div>
            ) : error ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                    <XCircle className="mx-auto text-red-500 mb-3" size={48} />
                    <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Settings</h3>
                    <p className="text-red-600">Unable to fetch system settings. Please try again later.</p>
                </div>
            ) : (
                /* Settings Form - matches your AllMenuItems.tsx pattern (form layout) */
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-6">General Settings</h3>

                    <div className="space-y-6">
                        {/* Site Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Site Name
                            </label>
                            <input
                                type="text"
                                value={settings.siteName}
                                onChange={(e) => handleInputChange('siteName', e.target.value)}
                                className="input input-bordered w-full"
                                placeholder="Enter site name"
                            />
                        </div>

                        {/* Admin Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Admin Email
                            </label>
                            <input
                                type="email"
                                value={settings.adminEmail}
                                onChange={(e) => handleInputChange('adminEmail', e.target.value)}
                                className="input input-bordered w-full"
                                placeholder="Enter admin email"
                            />
                        </div>

                        {/* Support Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Support Email
                            </label>
                            <input
                                type="email"
                                value={settings.supportEmail}
                                onChange={(e) => handleInputChange('supportEmail', e.target.value)}
                                className="input input-bordered w-full"
                                placeholder="Enter support email"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Timezone */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Timezone
                                </label>
                                <select
                                    value={settings.timezone}
                                    onChange={(e) => handleInputChange('timezone', e.target.value)}
                                    className="select select-bordered w-full"
                                >
                                    <option value="UTC-5">EST (UTC-5)</option>
                                    <option value="UTC-8">PST (UTC-8)</option>
                                    <option value="UTC+0">GMT (UTC+0)</option>
                                    <option value="UTC+1">CET (UTC+1)</option>
                                </select>
                            </div>

                            {/* Language */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Language
                                </label>
                                <select
                                    value={settings.language}
                                    onChange={(e) => handleInputChange('language', e.target.value)}
                                    className="select select-bordered w-full"
                                >
                                    <option value="en">English</option>
                                    <option value="es">Spanish</option>
                                    <option value="fr">French</option>
                                    <option value="de">German</option>
                                </select>
                            </div>

                            {/* Currency */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Currency
                                </label>
                                <select
                                    value={settings.currency}
                                    onChange={(e) => handleInputChange('currency', e.target.value)}
                                    className="select select-bordered w-full"
                                >
                                    <option value="USD">USD ($)</option>
                                    <option value="EUR">EUR (€)</option>
                                    <option value="GBP">GBP (£)</option>
                                    <option value="CAD">CAD (C$)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Current Settings Summary - matches your reference patterns */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <h4 className="text-md font-semibold text-gray-800 mb-4">Current Configuration</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="text-sm text-gray-600">Site Name</div>
                                <div className="font-medium">{settings.siteName || 'Not set'}</div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="text-sm text-gray-600">Timezone</div>
                                <div className="font-medium">{settings.timezone}</div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="text-sm text-gray-600">Admin Email</div>
                                <div className="font-medium">{settings.adminEmail || 'Not set'}</div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="text-sm text-gray-600">Currency</div>
                                <div className="font-medium">{settings.currency}</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminDashboardLayout>
    );
};

export default AdminSettings;