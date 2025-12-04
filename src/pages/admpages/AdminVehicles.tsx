import React, { useEffect } from 'react';
import AdminDashboardLayout from '../../components/Dashboard/admDashboardLayout';
import { Car, Edit, Trash2, Plus, Calendar, Fuel, Users, CheckCircle, XCircle } from 'lucide-react';
import { vehicleApi } from '../../API/VehicleAPI';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { skipToken } from '@reduxjs/toolkit/query';

// Define TypeScript interface for vehicles - MATCHING BACKEND RESPONSE
interface Vehicle {
    vehicle_id: string;
    vehicle_spec_id: string;
    rental_rate: number; // This is the daily rate
    availability: boolean;
    created_at: string;
    updated_at: string;
    vehicle_spec: {
        vehicleSpec_id: string;
        manufacturer: string;
        model: string;
        year: number;
        fuel_type: string;
        engine_capacity?: string;
        transmission?: string;
        seating_capacity: number;
        color: string;
        features: string;
    };
    location?: {
        location_id: string;
        name: string;
        address: string;
        city: string;
        country: string;
        created_at: string;
    };
}

const AdminVehicles: React.FC = () => {
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    // RTK Query Hooks
    const { 
        data: allVehicles = [],
        isLoading: vehiclesIsLoading, 
        error,
        refetch: refetchVehicles
    } = vehicleApi.useGetAllVehiclesQuery(
        isAuthenticated ? undefined : skipToken
    );

    // Use the correct mutation - updateVehicleStatus
    const [updateVehicleStatus] = vehicleApi.useUpdateVehicleStatusMutation();
    const [deleteVehicle] = vehicleApi.useDeleteVehicleMutation();

    // Format currency - FIXED THIS FUNCTION
    const formatCurrency = (amount: number | undefined | null): string => {
        // Handle undefined, null, or invalid numbers
        if (amount === undefined || amount === null || isNaN(Number(amount))) {
            return '$0.00';
        }
        
        const numAmount = Number(amount);
        return `$${numAmount.toFixed(2)}`;
    };

    // Format date - FIXED with better error handling
    const formatDate = (dateString: string | undefined): string => {
        if (!dateString) return 'N/A';
        
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'Invalid Date';
            
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch {
            return 'Invalid Date';
        }
    };

    // Get status badge - FIXED
    const getStatusBadge = (availability: boolean | undefined) => {
        const isAvailable = availability === true;
        
        if (isAvailable) {
            return (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    <CheckCircle size={14} className="mr-1" />
                    Available
                </span>
            );
        } else {
            return (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                    <XCircle size={14} className="mr-1" />
                    Unavailable
                </span>
            );
        }
    };

    // Get vehicle type badge - FIXED
    const getTypeBadge = (vehicle: Vehicle) => {
        const model = vehicle?.vehicle_spec?.model?.toLowerCase() || '';
        let badgeClass = 'badge-primary';
        let label = 'Standard';
        
        if (model.includes('suv')) {
            badgeClass = 'badge-success';
            label = 'SUV';
        } else if (model.includes('truck')) {
            badgeClass = 'badge-warning';
            label = 'Truck';
        } else if (model.includes('premium') || model.includes('luxury')) {
            badgeClass = 'badge-secondary';
            label = 'Luxury';
        }

        return (
            <span className={`badge ${badgeClass}`}>
                {label}
            </span>
        );
    };

    // Handle status update - FIXED
    const handleStatusUpdate = async (vehicleId: string, currentAvailability: boolean | undefined, vehicleName: string) => {
        const newAvailability = !currentAvailability;
        const statusText = newAvailability ? 'Available' : 'Unavailable';
        const currentStatusText = currentAvailability ? 'Available' : 'Unavailable';
        
        const { isConfirmed } = await Swal.fire({
            title: `Update ${vehicleName}`,
            html: `Change from <strong>${currentStatusText}</strong> to <strong>${statusText}</strong>?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, update',
            confirmButtonColor: '#10b981',
            cancelButtonColor: '#ef4444'
        });

        if (isConfirmed) {
            try {
                // Find the vehicle to get rental_rate
                const vehicle = allVehicles.find(v => v.vehicle_id === vehicleId);
                
                if (!vehicle) {
                    Swal.fire({
                        title: 'Error!',
                        text: 'Vehicle not found',
                        icon: 'error',
                        confirmButtonColor: '#ef4444'
                    });
                    return;
                }
                
                await updateVehicleStatus({ 
                    vehicle_id: vehicleId, 
                    availability: newAvailability,
                    rental_rate: vehicle.rental_rate || 0
                }).unwrap();
                
                Swal.fire({
                    title: 'Updated!',
                    text: `Vehicle is now ${statusText}`,
                    icon: 'success',
                    confirmButtonColor: '#10b981'
                });
                
                refetchVehicles(); // Refresh the list
            } catch (error: any) {
                console.error('Update error:', error);
                Swal.fire({
                    title: 'Error!',
                    text: error?.data?.message || error?.data?.error || 'Failed to update vehicle status',
                    icon: 'error',
                    confirmButtonColor: '#ef4444'
                });
            }
        }
    };

    // Handle delete vehicle - FIXED
    const handleDeleteVehicle = async (vehicleId: string, vehicleName: string) => {
        const { isConfirmed } = await Swal.fire({
            title: `Delete ${vehicleName}?`,
            text: "This action cannot be undone!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        });

        if (isConfirmed) {
            try {
                await deleteVehicle(vehicleId).unwrap();
                
                Swal.fire({
                    title: 'Deleted!',
                    text: 'Vehicle has been removed from the fleet.',
                    icon: 'success',
                    confirmButtonColor: '#10b981'
                });
                
                refetchVehicles(); // Refresh the list
            } catch (error: any) {
                console.error('Delete error:', error);
                Swal.fire({
                    title: 'Error!',
                    text: error?.data?.message || error?.data?.error || 'Failed to delete vehicle',
                    icon: 'error',
                    confirmButtonColor: '#ef4444'
                });
            }
        }
    };

    // Debug - optional
    useEffect(() => {
        if (allVehicles.length > 0) {
            console.log('Vehicles loaded:', allVehicles.length);
            console.log('Sample vehicle:', allVehicles[0]);
            
            // Check for vehicles with undefined rental_rate
            const vehiclesWithIssues = allVehicles.filter(v => 
                v.rental_rate === undefined || 
                v.vehicle_spec?.manufacturer === undefined ||
                v.vehicle_spec?.model === undefined
            );
            
            if (vehiclesWithIssues.length > 0) {
                console.warn('Vehicles with missing data:', vehiclesWithIssues);
            }
        }
    }, [allVehicles]);

    // Calculate stats - FIXED
    const availableCount = allVehicles.filter(v => v.availability === true).length;
    const unavailableCount = allVehicles.filter(v => v.availability === false).length;
    const totalRevenue = allVehicles.reduce((sum, v) => sum + (v.rental_rate || 0), 0);

    return (
        <AdminDashboardLayout>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <Car className="text-blue-600" size={24} />
                    </div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Vehicle Management</h1>
                </div>
                <button className="btn bg-green-600 hover:bg-green-700 text-white flex items-center gap-2">
                    <Plus size={16} />
                    Add New Vehicle
                </button>
            </div>

            {/* Loading State */}
            {vehiclesIsLoading ? (
                <div className="flex justify-center items-center py-16">
                    <span className="loading loading-spinner loading-lg text-green-600"></span>
                    <span className="ml-3 text-gray-600">Loading vehicles...</span>
                </div>
            ) : error ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                    <Car className="mx-auto text-red-500 mb-3" size={48} />
                    <h3 className="text-lg font-semibold text-red-800 mb-2">
                        {error.status === 'FETCH_ERROR' ? 'Backend Connection Failed' : 'Error Loading Vehicles'}
                    </h3>
                    <p className="text-red-600">
                        {error.status === 'FETCH_ERROR' 
                            ? 'Cannot connect to backend server. Please make sure it is running.'
                            : 'Unable to fetch vehicles. Please try again later.'}
                    </p>
                    <button 
                        onClick={() => refetchVehicles()}
                        className="btn btn-sm btn-primary mt-3"
                    >
                        Try Again
                    </button>
                </div>
            ) : !allVehicles || allVehicles.length === 0 ? (
                /* Empty State */
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <Car className="mx-auto mb-4 text-blue-600" size={48} />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No Vehicles Found</h3>
                    <p className="text-gray-500">No vehicles are available in the fleet.</p>
                </div>
            ) : (
                /* Vehicles Table - FIXED with safe property access */
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="table table-zebra w-full">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="text-left font-semibold text-gray-700">Vehicle</th>
                                    <th className="text-left font-semibold text-gray-700">Type</th>
                                    <th className="text-left font-semibold text-gray-700">Rate/Day</th>
                                    <th className="text-left font-semibold text-gray-700">Status</th>
                                    <th className="text-left font-semibold text-gray-700">Added</th>
                                    <th className="text-center font-semibold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allVehicles.map((vehicle: Vehicle) => (
                                    <tr key={vehicle.vehicle_id} className="hover:bg-gray-50">
                                        <td>
                                            <div>
                                                <div className="font-bold text-gray-800">
                                                    {vehicle?.vehicle_spec?.manufacturer || 'Unknown'} {vehicle?.vehicle_spec?.model || 'Vehicle'}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {vehicle?.vehicle_spec?.year || 'N/A'} • {vehicle?.vehicle_spec?.color || 'N/A'}
                                                </div>
                                                {vehicle?.vehicle_spec?.fuel_type && (
                                                    <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                                        <Fuel size={14} />
                                                        {vehicle.vehicle_spec.fuel_type}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            {getTypeBadge(vehicle)}
                                        </td>
                                        <td className="font-bold text-green-600">
                                            {formatCurrency(vehicle?.rental_rate)}
                                            <div className="text-sm text-gray-500">per day</div>
                                        </td>
                                        <td>
                                            {getStatusBadge(vehicle?.availability)}
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-1 text-sm text-gray-600">
                                                <Calendar size={14} />
                                                {formatDate(vehicle?.created_at)}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleStatusUpdate(
                                                        vehicle.vehicle_id,
                                                        vehicle.availability,
                                                        `${vehicle?.vehicle_spec?.manufacturer || ''} ${vehicle?.vehicle_spec?.model || ''}`
                                                    )}
                                                    className="btn btn-ghost btn-xs text-green-600 tooltip"
                                                    data-tip={`Mark as ${vehicle.availability ? 'Unavailable' : 'Available'}`}
                                                >
                                                    {vehicle.availability ? <XCircle size={14} /> : <CheckCircle size={14} />}
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteVehicle(
                                                        vehicle.vehicle_id,
                                                        `${vehicle?.vehicle_spec?.manufacturer || ''} ${vehicle?.vehicle_spec?.model || ''}`
                                                    )}
                                                    className="btn btn-ghost btn-xs text-red-600 tooltip"
                                                    data-tip="Delete Vehicle"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Vehicle Summary Stats */}
                    <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
                        <div className="flex flex-wrap gap-6 text-sm">
                            <div className="flex items-center gap-2">
                                <CheckCircle size={16} className="text-green-600" />
                                <span className="text-gray-600">Available: </span>
                                <span className="font-bold">{availableCount}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <XCircle size={16} className="text-red-600" />
                                <span className="text-gray-600">Unavailable: </span>
                                <span className="font-bold">{unavailableCount}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Car size={16} className="text-blue-600" />
                                <span className="text-gray-600">Total Vehicles: </span>
                                <span className="font-bold">{allVehicles.length}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-gray-600">Total Daily Revenue: </span>
                                <span className="font-bold text-green-600">{formatCurrency(totalRevenue)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminDashboardLayout>
    );
};

export default AdminVehicles;