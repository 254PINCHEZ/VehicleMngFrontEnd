import React, { useState } from 'react';
import AdminDashboardLayout from '../../components/Dashboard/admDashboardLayout';
import { Users, Edit, Trash2, UserCheck, Calendar, XCircle, Save, X } from 'lucide-react';
import { userApi } from '../../API/UserAPI';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { skipToken } from '@reduxjs/toolkit/query';

interface User {
    user_id: string;
    first_name: string;
    last_name: string;
    email: string;
    contact_phone?: string;
    role: string;
    address?: string;
    created_at: string;
    updated_at: string;
}

interface EditUserData {
    first_name?: string;
    last_name?: string;
    email?: string;
    contact_phone?: string;
    address?: string;
    role?: string;
}

const AdminUsers: React.FC = () => {
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    const [editingUserId, setEditingUserId] = useState<string | null>(null);
    const [editFormData, setEditFormData] = useState<EditUserData>({});
    const [originalUserData, setOriginalUserData] = useState<User | null>(null);

    // RTK Query Hook to fetch all users
    const { 
        data: allUsers, 
        isLoading: usersIsLoading, 
        error,
        refetch: refetchUsers 
    } = userApi.useGetAllUsersQuery(
        isAuthenticated ? undefined : skipToken
    );

    // RTK mutation to update user details (PATCH method)
    const [updateUserDetails] = userApi.useUpdateUsersDetailsMutation();
    
    // RTK mutation to update user role (PATCH method)
    const [updateUserRole] = userApi.useUpdateUserRoleStatusMutation();
    
    // RTK mutation to delete user
    const [deleteUser] = userApi.useDeleteUserMutation();

    // Start editing a user
    const handleEditClick = (user: User) => {
        setEditingUserId(user.user_id);
        setOriginalUserData(user);
        setEditFormData({
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            contact_phone: user.contact_phone || '',
            address: user.address || '',
            role: user.role
        });
    };

    // Cancel editing
    const handleCancelEdit = () => {
        setEditingUserId(null);
        setOriginalUserData(null);
        setEditFormData({});
    };

    // Handle form input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle textarea changes for address
    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Save edited user data using PATCH
    const handleSaveEdit = async (userId: string) => {
        // Check if any fields have changed
        const changedFields: EditUserData = {};
        const original = originalUserData;
        
        if (!original) return;

        if (editFormData.first_name && editFormData.first_name !== original.first_name) {
            changedFields.first_name = editFormData.first_name;
        }
        if (editFormData.last_name && editFormData.last_name !== original.last_name) {
            changedFields.last_name = editFormData.last_name;
        }
        if (editFormData.email && editFormData.email !== original.email) {
            changedFields.email = editFormData.email;
        }
        if (editFormData.contact_phone && editFormData.contact_phone !== (original.contact_phone || '')) {
            changedFields.contact_phone = editFormData.contact_phone;
        }
        if (editFormData.address && editFormData.address !== (original.address || '')) {
            changedFields.address = editFormData.address;
        }
        if (editFormData.role && editFormData.role !== original.role) {
            changedFields.role = editFormData.role;
        }

        if (Object.keys(changedFields).length === 0) {
            Swal.fire({
                title: 'No Changes',
                text: 'No fields have been modified',
                icon: 'info',
                confirmButtonColor: '#3b82f6'
            });
            return;
        }

        // Validate email if it's being changed
        if (changedFields.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(changedFields.email)) {
                Swal.fire({
                    title: 'Invalid Email',
                    text: 'Please enter a valid email address',
                    icon: 'error',
                    confirmButtonColor: '#ef4444'
                });
                return;
            }
        }

        try {
            const updateData = {
                user_id: userId,
                ...changedFields
            };

            console.log('Sending PATCH update data:', updateData);
            
            await updateUserDetails(updateData).unwrap();
            
            Swal.fire({
                title: 'Success!',
                text: 'User details updated successfully',
                icon: 'success',
                confirmButtonColor: '#10b981'
            });

            setEditingUserId(null);
            setOriginalUserData(null);
            refetchUsers();
        } catch (error: any) {
            console.error('Update error:', error);
            Swal.fire({
                title: 'Error!',
                text: error?.data?.error || error?.data?.message || 'Failed to update user details.',
                icon: 'error',
                confirmButtonColor: '#ef4444'
            });
        }
    };

    // Handle user role update (PATCH method) - UPDATED ROLES
    const handleUserRoleUpdate = async (userId: string, currentRole: string, userName: string) => {
        const validRoles = ['admin', 'customer', 'user']; // Changed from 'staff' to 'user'
        const roleOptions = validRoles.reduce((acc, role) => {
            acc[role] = role.charAt(0).toUpperCase() + role.slice(1);
            return acc;
        }, {} as Record<string, string>);

        const { value: newRole } = await Swal.fire({
            title: `Update User Role for ${userName}`,
            text: `Current role: ${currentRole.charAt(0).toUpperCase() + currentRole.slice(1)}`,
            input: 'select',
            inputOptions: roleOptions,
            inputValue: currentRole,
            showCancelButton: true,
            confirmButtonText: 'Update Role',
            confirmButtonColor: '#3b82f6',
            cancelButtonColor: '#ef4444',
            inputValidator: (value) => {
                if (!value) {
                    return 'Please select a user role';
                }
                if (value === currentRole) {
                    return 'Please select a different user role';
                }
                if (!validRoles.includes(value)) {
                    return `Invalid role. Must be one of: ${validRoles.join(', ')}`;
                }
            }
        });

        if (newRole) {
            try {
                const updateData = { 
                    user_id: userId,
                    role: newRole
                };
                
                console.log('Updating user role with data:', updateData);
                
                await updateUserRole(updateData).unwrap();
                
                Swal.fire({
                    title: 'Success!',
                    text: `User role updated to ${newRole.charAt(0).toUpperCase() + newRole.slice(1)}`,
                    icon: 'success',
                    confirmButtonColor: '#10b981'
                });
                
                refetchUsers();
            } catch (error: any) {
                console.error('Role update error:', error);
                let errorMessage = 'Failed to update user role.';
                
                if (error?.data?.error) {
                    errorMessage = error.data.error;
                } else if (error?.data?.message) {
                    errorMessage = error.data.message;
                } else if (error?.status === 400) {
                    errorMessage = 'Bad request. Please check the role value.';
                } else if (error?.status === 500) {
                    errorMessage = 'Server error. Please try again later.';
                }

                Swal.fire({
                    title: 'Error!',
                    text: errorMessage,
                    icon: 'error',
                    confirmButtonColor: '#ef4444'
                });
            }
        }
    };

    // Handle delete user
    const handleDeleteUser = async (userId: string, userName: string) => {
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
                    await deleteUser({ user_id: userId }).unwrap();
                    return true;
                } catch (error: any) {
                    Swal.showValidationMessage(
                        error?.data?.error || error?.data?.message || 'Failed to delete user.'
                    );
                    return false;
                }
            },
            allowOutsideClick: () => !Swal.isLoading()
        }).then(async (result) => {
            if (result.isConfirmed) {
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

    // Format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Get user role badge - UPDATED FOR 'user' ROLE
    const getUserRoleBadge = (role: string) => {
        const roleConfig = {
            customer: { color: 'bg-blue-100 text-blue-800', label: 'Customer' },
            admin: { color: 'bg-purple-100 text-purple-800', label: 'Admin' },
            user: { color: 'bg-green-100 text-green-800', label: 'User' } // Changed from 'staff' to 'user'
        };

        const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.customer;

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
            const currentValue = editFormData[field] || '';
            
            switch (field) {
                case 'first_name':
                case 'last_name':
                case 'email':
                case 'contact_phone':
                    return (
                        <input
                            type="text"
                            name={field}
                            value={currentValue}
                            onChange={handleInputChange}
                            className="input input-bordered input-sm w-full"
                        />
                    );
                case 'address':
                    return (
                        <textarea
                            name="address"
                            value={currentValue}
                            onChange={handleTextareaChange}
                            className="textarea textarea-bordered textarea-sm w-full h-20"
                            rows={3}
                        />
                    );
                case 'role':
                    return (
                        <select
                            name="role"
                            value={currentValue}
                            onChange={handleInputChange}
                            className="select select-bordered select-sm w-full"
                        >
                            <option value="customer">Customer</option>
                            <option value="admin">Admin</option>
                            <option value="user">User</option> {/* Changed from 'staff' to 'user' */}
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
            case 'contact_phone':
                return <div className="text-gray-700">{user.contact_phone || 'N/A'}</div>;
            case 'address':
                return (
                    <div className="text-gray-700 max-w-xs truncate" title={user.address}>
                        {user.address || 'N/A'}
                    </div>
                );
            case 'role':
                return getUserRoleBadge(user.role);
            default:
                return null;
        }
    };

    return (
        <AdminDashboardLayout>
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="text-blue-600" size={24} />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">User Management</h1>
            </div>

            {usersIsLoading ? (
                <div className="flex justify-center items-center py-16">
                    <span className="loading loading-spinner loading-lg text-blue-600"></span>
                    <span className="ml-3 text-gray-600">Loading users...</span>
                </div>
            ) : error ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                    <XCircle className="mx-auto text-red-500 mb-3" size={48} />
                    <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Users</h3>
                    <p className="text-red-600">
                        {(error as any)?.data?.error || (error as any)?.data?.message || 'Unable to fetch users.'}
                    </p>
                    <button 
                        onClick={() => refetchUsers()} 
                        className="btn btn-sm btn-outline btn-error mt-3"
                    >
                        Retry
                    </button>
                </div>
            ) : !allUsers || allUsers.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <Users className="mx-auto mb-4 text-blue-600" size={48} />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No Users Found</h3>
                    <p className="text-gray-500">No users have registered yet.</p>
                </div>
            ) : (
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
                                    <th className="text-left font-semibold text-gray-700">Address</th>
                                    <th className="text-left font-semibold text-gray-700">Role</th>
                                    <th className="text-left font-semibold text-gray-700">Join Date</th>
                                    <th className="text-center font-semibold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allUsers.map((user: User) => (
                                    <tr key={user.user_id} className={editingUserId === user.user_id ? "bg-blue-50" : "hover:bg-gray-50"}>
                                        <td className="font-mono text-sm text-gray-800">
                                            <span title={user.user_id}>
                                                #{user.user_id.substring(0, 8)}...
                                            </span>
                                        </td>
                                        <td>{renderUserField(user, 'first_name')}</td>
                                        <td>{renderUserField(user, 'last_name')}</td>
                                        <td>{renderUserField(user, 'email')}</td>
                                        <td>{renderUserField(user, 'contact_phone')}</td>
                                        <td className="max-w-xs">{renderUserField(user, 'address')}</td>
                                        <td>{renderUserField(user, 'role')}</td>
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
                                                            onClick={() => handleUserRoleUpdate(
                                                                user.user_id,
                                                                user.role,
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

                    {/* UPDATED STATISTICS - Changed 'Staff' to 'Users' */}
                    <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
                        <div className="flex flex-wrap gap-6 text-sm">
                            <div className="flex items-center gap-2">
                                <Users size={16} className="text-blue-600" />
                                <span className="text-gray-600">Total Users: </span>
                                <span className="font-bold">{allUsers.length}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <UserCheck size={16} className="text-purple-600" />
                                <span className="text-gray-600">Admins: </span>
                                <span className="font-bold">
                                    {allUsers.filter((u: User) => u.role === 'admin').length}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Users size={16} className="text-green-600" />
                                <span className="text-gray-600">Users: </span>
                                <span className="font-bold">
                                    {allUsers.filter((u: User) => u.role === 'user').length}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar size={16} className="text-gray-600" />
                                <span className="text-gray-600">Customers: </span>
                                <span className="font-bold text-blue-600">
                                    {allUsers.filter((u: User) => u.role === 'customer').length}
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