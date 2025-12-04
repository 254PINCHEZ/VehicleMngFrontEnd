import React, { useState, useEffect } from 'react';
import { User, Edit, Save, X, Mail, Phone, Calendar, Shield, Check, XCircle } from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { userApi } from '../../API/UserAPI';
import { toast, Toaster } from 'sonner';
import AdminDashboardLayout from '../../components/Dashboard/admDashboardLayout';

const AdminProfile: React.FC = () => {
    const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
    
    // RTK Query pattern matching your reference
    const [updateUserDetails, { isLoading: isUpdating }] = userApi.useUpdateUsersDetailsMutation();
    
    // Using skip pattern like in your reference
    const { 
        data: userData, 
        isLoading: isLoadingUserData, 
        isError: isErrorUserData 
    } = userApi.useGetUserByIdQuery(
        user?.user_id!,
        { skip: !isAuthenticated }
    );

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: ''
    });
    const [originalData, setOriginalData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: ''
    });

    // Initialize form data when user data is available
    useEffect(() => {
        if (userData) {
            const userInfo = {
                first_name: userData.first_name || '',
                last_name: userData.last_name || '',
                email: userData.email || '',
                phone_number: userData.phone_number ? String(userData.phone_number) : ''
            };
            setFormData(userInfo);
            setOriginalData(userInfo);
        }
    }, [userData]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        if (!user?.user_id) return;

        const loadingToastId = toast.loading("Updating profile...");

        try {
            const payload = {
                user_id: user.user_id,
                first_name: formData.first_name,
                last_name: formData.last_name,
                email: formData.email,
                phone_number: formData.phone_number ? Number(formData.phone_number) : undefined
            };
            
            await updateUserDetails(payload).unwrap();

            setOriginalData(formData);
            setIsEditing(false);
            toast.success("Profile updated successfully!", { id: loadingToastId });
        } catch (error: any) {
            console.error('Profile update failed:', error);
            toast.error('Failed to update profile. Please try again.', { id: loadingToastId });
        }
    };

    const handleCancel = () => {
        setFormData(originalData);
        setIsEditing(false);
    };

    // Format date - EXACTLY matches your reference
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalData);

    return (
        <AdminDashboardLayout>
            <Toaster position="top-right" richColors />
            
            {/* Header - matches your reference exactly */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                        <User className="text-green-600" size={24} />
                    </div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-800">User Profile</h1>
                </div>

                {!isEditing ? (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="btn btn-outline border-green-800 text-green-800 hover:bg-green-800 hover:text-white"
                    >
                        <Edit size={16} />
                        Edit Profile
                    </button>
                ) : (
                    <div className="flex gap-2">
                        <button
                            onClick={handleCancel}
                            className="btn btn-outline btn-error"
                        >
                            <X size={16} />
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={!hasChanges || isUpdating}
                            className="btn bg-green-800 hover:bg-green-900 text-white"
                        >
                            {isUpdating ? (
                                <span className="loading loading-spinner loading-sm"></span>
                            ) : (
                                <Save size={16} />
                            )}
                            Save Changes
                        </button>
                    </div>
                )}
            </div>

            {/* Authentication Check - matches your reference */}
            {!isAuthenticated || !user ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                    <h3 className="text-lg font-semibold text-red-800 mb-2">Access Denied</h3>
                    <p className="text-red-600">Please sign in to view your profile.</p>
                </div>
            ) : isLoadingUserData ? (
                <div className="flex justify-center items-center py-16">
                    <span className="loading loading-spinner loading-lg text-green-600"></span>
                </div>
            ) : isErrorUserData ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                    <XCircle className="mx-auto text-red-500 mb-3" size={48} />
                    <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Profile</h3>
                    <p className="text-red-600">There was an error loading your profile. Please try again later.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Profile Card - matches your reference */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-md p-6 text-center">
                            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <User className="text-green-600" size={48} />
                            </div>
                            <h2 className="text-xl font-bold text-gray-800 mb-1">
                                {user.first_name} {user.last_name}
                            </h2>
                            <p className="text-gray-600 mb-2">{user.email}</p>
                            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                                <Shield size={14} className="mr-1" />
                                {user.user_type?.toUpperCase() || 'ADMIN'}
                            </div>
                        </div>
                    </div>

                    {/* Profile Details - matches your reference */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-6">Personal Information</h3>

                            <div className="space-y-4">
                                {/* First Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        First Name
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="first_name"
                                            value={formData.first_name}
                                            onChange={handleInputChange}
                                            className="input input-bordered w-full focus:border-green-500"
                                            placeholder="Enter your first name"
                                        />
                                    ) : (
                                        <div className="p-3 bg-gray-50 rounded-lg">
                                            {user.first_name || 'Not provided'}
                                        </div>
                                    )}
                                </div>

                                {/* Last Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Last Name
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="last_name"
                                            value={formData.last_name}
                                            onChange={handleInputChange}
                                            className="input input-bordered w-full focus:border-green-500"
                                            placeholder="Enter your last name"
                                        />
                                    ) : (
                                        <div className="p-3 bg-gray-50 rounded-lg">
                                            {userData?.last_name || 'Not provided'}
                                        </div>
                                    )}
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <Mail size={16} className="inline mr-1" />
                                        Email Address
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="input input-bordered w-full focus:border-green-500"
                                            placeholder="Enter your email"
                                        />
                                    ) : (
                                        <div className="p-3 bg-gray-50 rounded-lg">
                                            {userData?.email || 'Not provided'}
                                        </div>
                                    )}
                                </div>

                                {/* Phone Number */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <Phone size={16} className="inline mr-1" />
                                        Phone Number
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="tel"
                                            name="phone_number"
                                            value={formData.phone_number}
                                            onChange={handleInputChange}
                                            className="input input-bordered w-full focus:border-green-500"
                                            placeholder="Enter your phone number"
                                        />
                                    ) : (
                                        <div className="p-3 bg-gray-50 rounded-lg">
                                            {userData?.phone_number ? String(userData.phone_number) : 'Not provided'}
                                        </div>
                                    )}
                                </div>

                                {/* Account Information - matches your reference */}
                                <div className="pt-4 border-t border-gray-200">
                                    <h4 className="text-md font-semibold text-gray-800 mb-3">Account Information</h4>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <Calendar size={16} className="inline mr-1" />
                                                Member Since
                                            </label>
                                            <div className="p-3 bg-gray-50 rounded-lg">
                                                {userData?.created_at ? formatDate(userData.created_at) : 'Unknown'}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                User ID
                                            </label>
                                            <div className="p-3 bg-gray-50 rounded-lg font-mono text-sm">
                                                #{userData?.user_id}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Account Stats - matches your reference */}
                    <div className="lg:col-span-3">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-green-800 mb-4">
                                <Check className="inline mr-2" size={20} />
                                Account Status
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                                <div className="bg-white rounded-lg p-4">
                                    <div className="text-2xl font-bold text-green-600">✓</div>
                                    <p className="text-sm text-gray-600 mt-1">Email Verified</p>
                                </div>
                                <div className="bg-white rounded-lg p-4">
                                    <div className="text-2xl font-bold text-green-600">Active</div>
                                    <p className="text-sm text-gray-600 mt-1">Account Status</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminDashboardLayout>
    );
};

export default AdminProfile;