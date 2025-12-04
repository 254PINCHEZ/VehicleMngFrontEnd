import React, { useState } from 'react';
import AdminDashboardLayout from '../../components/Dashboard/admDashboardLayout';
import { Users, Edit, Trash2, UserCheck, Calendar, XCircle, Save, X } from 'lucide-react';
import { userApi } from '../../API/UserAPI';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { skipToken } from '@reduxjs/toolkit/query';

// Define TypeScript interface for users
interface User {
    user_id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone_number?: string;
    user_type: string;
    created_at: string;
    status?: string;
}

interface EditUserData {
    first_name: string;
    last_name: string;
    email: string;
    phone_number?: string;
    user_type: string;
}

const AdminUsers: React.FC = () => {
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    const [editingUserId, setEditingUserId] = useState<number | null>(null);
    const [editFormData, setEditFormData] = useState<EditUserData>({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        user_type: 'customer'
    });

    // RTK Query Hook to fetch all users
    const { 
        data: allUsers, 
        isLoading: usersIsLoading, 
        error,
        refetch: refetchUsers 
    } = userApi.useGetAllUsersQuery(
        isAuthenticated ? undefined : skipToken
    );

    // RTK mutation to update user details
    const [updateUsersDetails] = userApi.useUpdateUserRoleStatusMutation();
    
    // RTK mutation to delete user
    const [deleteUser] = userApi.useDeleteUserMutation();

    // Start editing a user
    const handleEditClick = (user: User) => {
        setEditingUserId(user.user_id);
        setEditFormData({
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            phone_number: user.phone_number || '',
            user_type: user.user_type
        });
    };

    // Cancel editing
    const handleCancelEdit = () => {
        setEditingUserId(null);
        setEditFormData({
            first_name: '',
            last_name: '',
            email: '',
            phone_number: '',
            user_type: 'customer'
        });
    };

    // Handle form input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Save edited user data
    const handleSaveEdit = async (userId: number) => {
        if (!editFormData.first_name.trim() || !editFormData.last_name.trim() || !editFormData.email.trim()) {
            Swal.fire({
                title: 'Validation Error',
                text: 'Please fill in all required fields (First Name, Last Name, Email)',
                icon: 'error',
                confirmButtonColor: '#ef4444'
            });
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(editFormData.email)) {
            Swal.fire({
                title: 'Invalid Email',
                text: 'Please enter a valid email address',
                icon: 'error',
                confirmButtonColor: '#ef4444'
            });
            return;
        }

        try {
            const updateData = {
                user_id: userId,
                ...editFormData
            };

            await updateUsersDetails(updateData).unwrap();
            
            Swal.fire({
                title: 'Success!',
                text: 'User details updated successfully',
                icon: 'success',
                confirmButtonColor: '#10b981'
            });

            setEditingUserId(null);
            refetchUsers(); // Refresh the user list
        } catch (error: any) {
            console.error('Update error:', error);
            Swal.fire({
                title: 'Error!',
                text: error?.data?.message || 'Failed to update user details. Please try again.',
                icon: 'error',
                confirmButtonColor: '#ef4444'
            });
        }
    };

    // Handle user type update (keeping your existing functionality)
    const handleUserTypeUpdate = async (userId: number, currentUserType: string, userName: string) => {
        const userTypes = ['customer', 'admin', 'staff'];
        const typeOptions = userTypes.reduce((acc, type) => {
            acc[type] = type.charAt(0).toUpperCase() + type.slice(1);
            return acc;
        }, {} as Record<string, string>);

        const { value: newUserType } = await Swal.fire({
            title: `Update User Role for ${userName}`,
            text: `Current role: ${currentUserType.charAt(0).toUpperCase() + currentUserType.slice(1)}`,
            input: 'select',
            inputOptions: typeOptions,
            inputValue: currentUserType,
            showCancelButton: true,
            confirmButtonText: 'Update Role',
            confirmButtonColor: '#3b82f6',
            cancelButtonColor: '#ef4444',
            inputValidator: (value) => {
                if (!value) {
                    return 'Please select a user role';
                }
                if (value === currentUserType) {
                    return 'Please select a different user role';
                }
            }
        });

        if (newUserType) {
            try {
                const updateData = { 
                    user_id: userId,
                    user_type: newUserType 
                };
                await updateUsersDetails(updateData).unwrap();
                Swal.fire({
                    title: 'Success!',
                    text: `User role updated to ${newUserType}`,
                    icon: 'success',
                    confirmButtonColor: '#10b981'
                });
                refetchUsers(); // Refresh the user list
            } catch (error: any) {
                Swal.fire({
                    title: 'Error!',
                    text: 'Failed to update user role. Please try again.',
                    icon: 'error',
                    confirmButtonColor: '#ef4444'
                });
            }
        }
    };

    // Handle delete user - now with actual API call
    const handleDeleteUser = async (userId: number, userName: string) => {
        Swal.fire({
            title: "Are you sure?",
            text: `You want to delete user "${userName}"? This action cannot be undone.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc2626",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Yes, Delete User",
            cancelButtonText: "Cancel",
            showLoaderOnConfirm: true,
            preConfirm: async () => {
                try {
                    // Call the delete API
                    await deleteUser({ user_id: userId }).unwrap();
                    return true;
                } catch (error) {
                    Swal.showValidationMessage('Failed to delete user. Please try again.');
                    return false;
                }
            },
            allowOutsideClick: () => !Swal.isLoading()
        }).then(async (result) => {
            if (result.isConfirmed) {
                // Refresh user list
                await refetchUsers();
                Swal.fire({
                    title: "Deleted!",
                    text: "User has been deleted successfully.",
                    icon: "success",
                    confirmButtonColor: "#10b981"
                });
            }
        });
    };

    // Format date - matches your pattern
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Get user type badge - matches your pattern
    const getUserTypeBadge = (userType: string) => {
        const typeConfig = {
            customer: { color: 'bg-blue-100 text-blue-800', label: 'Customer' },
            admin: { color: 'bg-purple-100 text-purple-800', label: 'Admin' },
            staff: { color: 'bg-green-100 text-green-800', label: 'Staff' }
        };

        const config = typeConfig[userType as keyof typeof typeConfig] || typeConfig.customer;

        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
                <UserCheck size={14} className="mr-1" />
                {config.label}
            </span>
        );
    };

    // Render edit form or display data
    const renderUserField = (user: User, field: keyof EditUserData) => {
        if (editingUserId === user.user_id) {
            switch (field) {
                case 'first_name':
                case 'last_name':
                case 'email':
                case 'phone_number':
                    return (
                        <input
                            type="text"
                            name={field}
                            value={editFormData[field] || ''}
                            onChange={handleInputChange}
                            className="input input-bordered input-sm w-full"
                        />
                    );
                case 'user_type':
                    return (
                        <select
                            name="user_type"
                            value={editFormData.user_type}
                            onChange={handleInputChange}
                            className="select select-bordered select-sm w-full"
                        >
                            <option value="customer">Customer</option>
                            <option value="admin">Admin</option>
                            <option value="staff">Staff</option>
                        </select>
                    );
                default:
                    return null;
            }
        }
        
        // Display mode
        switch (field) {
            case 'first_name':
                return <div className="font-semibold text-gray-800">{user.first_name}</div>;
            case 'last_name':
                return <div className="font-semibold text-gray-800">{user.last_name}</div>;
            case 'email':
                return <div className="text-gray-700">{user.email}</div>;
            case 'phone_number':
                return <div className="text-gray-700">{user.phone_number || 'N/A'}</div>;
            case 'user_type':
                return getUserTypeBadge(user.user_type);
            default:
                return null;
        }
    };

    return (
        <AdminDashboardLayout>
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="text-blue-600" size={24} />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">User Management</h1>
            </div>

            {/* Loading State */}
            {usersIsLoading ? (
                <div className="flex justify-center items-center py-16">
                    <span className="loading loading-spinner loading-lg text-blue-600"></span>
                    <span className="ml-3 text-gray-600">Loading users...</span>
                </div>
            ) : error ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                    <XCircle className="mx-auto text-red-500 mb-3" size={48} />
                    <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Users</h3>
                    <p className="text-red-600">Unable to fetch users. Please try again later.</p>
                </div>
            ) : !allUsers || allUsers.length === 0 ? (
                /* Empty State */
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <Users className="mx-auto mb-4 text-blue-600" size={48} />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No Users Found</h3>
                    <p className="text-gray-500">No users have registered yet.</p>
                </div>
            ) : (
                /* Users Table */
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="table table-zebra w-full">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="text-left font-semibold text-gray-700">ID</th>
                                    <th className="text-left font-semibold text-gray-700">First Name</th>
                                    <th className="text-left font-semibold text-gray-700">Last Name</th>
                                    <th className="text-left font-semibold text-gray-700">Email</th>
                                    <th className="text-left font-semibold text-gray-700">Phone</th>
                                    <th className="text-left font-semibold text-gray-700">User Role</th>
                                    <th className="text-left font-semibold text-gray-700">Join Date</th>
                                    <th className="text-center font-semibold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allUsers.map((user: User) => (
                                    <tr key={user.user_id} className={editingUserId === user.user_id ? "bg-blue-50" : "hover:bg-gray-50"}>
                                        <td className="font-bold text-gray-800">#{user.user_id}</td>
                                        <td>{renderUserField(user, 'first_name')}</td>
                                        <td>{renderUserField(user, 'last_name')}</td>
                                        <td>{renderUserField(user, 'email')}</td>
                                        <td>{renderUserField(user, 'phone_number')}</td>
                                        <td>{renderUserField(user, 'user_type')}</td>
                                        <td>
                                            <div className="flex items-center gap-1 text-sm text-gray-600">
                                                <Calendar size={14} />
                                                {formatDate(user.created_at)}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex items-center justify-center gap-2">
                                                {editingUserId === user.user_id ? (
                                                    <>
                                                        <button
                                                            onClick={() => handleSaveEdit(user.user_id)}
                                                            className="btn btn-xs btn-success tooltip"
                                                            data-tip="Save Changes"
                                                        >
                                                            <Save size={14} />
                                                        </button>
                                                        <button
                                                            onClick={handleCancelEdit}
                                                            className="btn btn-xs btn-error tooltip"
                                                            data-tip="Cancel"
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button
                                                            onClick={() => handleEditClick(user)}
                                                            className="btn btn-ghost btn-xs text-blue-600 tooltip"
                                                            data-tip="Edit User Details"
                                                        >
                                                            <Edit size={14} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleUserTypeUpdate(
                                                                user.user_id,
                                                                user.user_type,
                                                                `${user.first_name} ${user.last_name}`
                                                            )}
                                                            className="btn btn-ghost btn-xs text-green-600 tooltip"
                                                            data-tip="Update User Role"
                                                        >
                                                            <UserCheck size={14} />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDeleteUser(
                                                                user.user_id, 
                                                                `${user.first_name} ${user.last_name}`
                                                            )}
                                                            className="btn btn-ghost btn-xs text-red-600 tooltip" 
                                                            data-tip="Delete User"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* User Summary Stats */}
                    <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
                        <div className="flex flex-wrap gap-6 text-sm">
                            <div className="flex items-center gap-2">
                                <Users size={16} className="text-blue-600" />
                                <span className="text-gray-600">Total Users: </span>
                                <span className="font-bold">{allUsers.length}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <UserCheck size={16} className="text-purple-600" />
                                <span className="text-gray-600">Admin Users: </span>
                                <span className="font-bold">
                                    {allUsers.filter((u: User) => u.user_type === 'admin').length}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Users size={16} className="text-green-600" />
                                <span className="text-gray-600">Staff Users: </span>
                                <span className="font-bold">
                                    {allUsers.filter((u: User) => u.user_type === 'staff').length}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar size={16} className="text-gray-600" />
                                <span className="text-gray-600">Customers: </span>
                                <span className="font-bold text-blue-600">
                                    {allUsers.filter((u: User) => u.user_type === 'customer').length}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminDashboardLayout>
    );
};

export default AdminUsers;