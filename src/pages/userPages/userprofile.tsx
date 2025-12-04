import React, { useState, useEffect } from 'react'
import DashboardLayout from '../../components/Dashboard/DashboardLayout'
import { User, Edit, Save, X, Mail, Phone, Calendar, Shield, MapPin, Check } from 'lucide-react'
import { useSelector } from 'react-redux'
import type { RootState } from '../../store/store'
import { userApi } from '../../API/UserAPI'
import { toast, Toaster } from 'sonner'

const UserProfile: React.FC = () => {
    // Get user from Redux store (this should contain your login credentials)
    const { user: authUser, isAuthenticated } = useSelector((state: RootState) => state.auth)
    
    // RTK Query hooks
    const [updateUserDetails, { isLoading: isUpdating }] = userApi.useUpdateUsersDetailsMutation()
    
    // Use the authUser's ID to fetch full profile data
    const { 
        data: userData, 
        isLoading: isLoadingUserData,
        refetch: refetchUserData 
    } = userApi.useGetUserByIdQuery(
        { user_id: authUser?.user_id || '' },
        { skip: !isAuthenticated || !authUser?.user_id }
    )

    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        contact_phone: '',
        address: ''
    })
    const [originalData, setOriginalData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        contact_phone: '',
        address: ''
    })

    // FIXED: Better initialization logic
    useEffect(() => {
        if (userData) {
            // Use fetched API data if available
            const newData = {
                first_name: userData.first_name || authUser?.first_name || '',
                last_name: userData.last_name || authUser?.last_name || '',
                email: userData.email || authUser?.email || '',
                contact_phone: userData.contact_phone || '',
                address: userData.address || ''
            }
            
            setFormData(newData)
            setOriginalData(newData)
        } else if (authUser && isAuthenticated) {
            // Fallback to Redux auth data if API data isn't available yet
            const authData = {
                first_name: authUser.first_name || '',
                last_name: authUser.last_name || '',
                email: authUser.email || '',
                contact_phone: authUser.contact_phone || '',
                address: authUser.address || ''
            }
            
            setFormData(authData)
            setOriginalData(authData)
        }
    }, [userData, authUser, isAuthenticated])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSave = async () => {
        if (!authUser?.user_id) {
            toast.error("User ID not found. Please login again.")
            return
        }

        const loadingToastId = toast.loading("Updating profile...")

        try {
            // Send update request
            await updateUserDetails({
                user_id: authUser.user_id.toString(),
                ...formData
            }).unwrap()

            // Update original data and refetch
            setOriginalData(formData)
            setIsEditing(false)
            
            // Refetch user data to ensure UI is in sync
            await refetchUserData()
            
            toast.success("Profile updated successfully!", { id: loadingToastId })
        } catch (error: any) {
            console.error('Profile update failed:', error)
            const errorMessage = error?.data?.message || error?.message || 'Failed to update profile'
            toast.error(errorMessage, { id: loadingToastId })
        }
    }

    const handleCancel = () => {
        setFormData(originalData)
        setIsEditing(false)
    }

    const formatDate = (dateString: string) => {
        if (!dateString) return 'Not available'
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalData)

    // Display data - prioritize API data, fallback to auth data
    const displayUser = userData || authUser

    return (
        <DashboardLayout>
            <Toaster position="top-right" richColors />
            
            {/* Header Section */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <User className="text-blue-600" size={24} />
                    </div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-800">User Profile</h1>
                </div>

                {!isEditing ? (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="btn btn-outline border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-200"
                    >
                        <Edit size={16} className="mr-2" />
                        Edit Profile
                    </button>
                ) : (
                    <div className="flex gap-2">
                        <button
                            onClick={handleCancel}
                            className="btn btn-outline btn-error hover:bg-red-600 hover:text-white transition-all duration-200"
                        >
                            <X size={16} className="mr-2" />
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={!hasChanges || isUpdating}
                            className="btn bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isUpdating ? (
                                <span className="loading loading-spinner loading-sm"></span>
                            ) : (
                                <Save size={16} className="mr-2" />
                            )}
                            Save Changes
                        </button>
                    </div>
                )}
            </div>

            {!isAuthenticated ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                    <h3 className="text-lg font-semibold text-red-800 mb-2">Access Denied</h3>
                    <p className="text-red-600">Please sign in to view your profile.</p>
                </div>
            ) : isLoadingUserData && !displayUser ? (
                <div className="flex justify-center items-center py-16">
                    <span className="loading loading-spinner loading-lg text-blue-600"></span>
                    <span className="ml-3 text-gray-600">Loading profile...</span>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Profile Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                            <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                                <User className="text-white" size={48} />
                            </div>
                            <h2 className="text-xl font-bold text-gray-800 mb-1">
                                {displayUser?.first_name || 'User'} {displayUser?.last_name || ''}
                            </h2>
                            <p className="text-gray-600 mb-2">{displayUser?.email || 'No email provided'}</p>
                            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 border border-blue-200">
                                <Shield size={14} className="mr-1" />
                                {displayUser?.role?.toUpperCase() || 'USER'}
                            </div>
                        </div>
                    </div>

                    {/* Profile Details */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-6">Personal Information</h3>

                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                                className="input input-bordered w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                                                placeholder="Enter your first name"
                                            />
                                        ) : (
                                            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                                <span className="text-gray-800">{displayUser?.first_name || 'Not provided'}</span>
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
                                                className="input input-bordered w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                                                placeholder="Enter your last name"
                                            />
                                        ) : (
                                            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                                <span className="text-gray-800">{displayUser?.last_name || 'Not provided'}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                        <Mail size={16} className="mr-2 text-blue-600" />
                                        Email Address
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="input input-bordered w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                                            placeholder="Enter your email"
                                        />
                                    ) : (
                                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                            <span className="text-gray-800">{displayUser?.email || 'Not provided'}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Phone Number */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                        <Phone size={16} className="mr-2 text-blue-600" />
                                        Phone Number
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="tel"
                                            name="contact_phone"
                                            value={formData.contact_phone}
                                            onChange={handleInputChange}
                                            className="input input-bordered w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                                            placeholder="Enter your phone number"
                                        />
                                    ) : (
                                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                            <span className="text-gray-800">{displayUser?.contact_phone || 'Not provided'}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Address */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                        <MapPin size={16} className="mr-2 text-blue-600" />
                                        Address
                                    </label>
                                    {isEditing ? (
                                        <textarea
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            rows={3}
                                            className="textarea textarea-bordered w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                                            placeholder="Enter your address"
                                        />
                                    ) : (
                                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                            <span className="text-gray-800">{displayUser?.address || 'Not provided'}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Account Information (Read-only) */}
                                <div className="pt-6 border-t border-gray-200">
                                    <h4 className="text-md font-semibold text-gray-800 mb-4">Account Information</h4>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                                <Calendar size={16} className="mr-2 text-blue-600" />
                                                Member Since
                                            </label>
                                            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                                <span className="text-gray-800">
                                                    {displayUser?.created_at ? formatDate(displayUser.created_at) : 'Unknown'}
                                                </span>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                User ID
                                            </label>
                                            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                                <span className="font-mono text-sm text-gray-800">
                                                    #{displayUser?.user_id || authUser?.user_id || 'N/A'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Account Status Card */}
                    <div className="lg:col-span-3">
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                            <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                                <Check className="mr-2" size={20} />
                                Account Status
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-white rounded-lg p-4 text-center border border-blue-100 shadow-sm">
                                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                        <Check className="text-green-600" size={24} />
                                    </div>
                                    <p className="text-sm font-medium text-gray-700">Email Verified</p>
                                    <p className="text-xs text-green-600 mt-1">Verified</p>
                                </div>
                                <div className="bg-white rounded-lg p-4 text-center border border-blue-100 shadow-sm">
                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                        <Shield className="text-blue-600" size={24} />
                                    </div>
                                    <p className="text-sm font-medium text-gray-700">Account Status</p>
                                    <p className="text-xs text-blue-600 mt-1">Active</p>
                                </div>
                                <div className="bg-white rounded-lg p-4 text-center border border-blue-100 shadow-sm">
                                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                        <User className="text-purple-600" size={24} />
                                    </div>
                                    <p className="text-sm font-medium text-gray-700">User Role</p>
                                    <p className="text-xs text-purple-600 mt-1 capitalize">{displayUser?.role || 'user'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    )
}

export default UserProfile