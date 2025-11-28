// Form Value Types
export type LoginFormValues = {
    email: string;
    password: string;
}

export type RegisterFormValues = {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    contact_phone?: string;
    address?: string;
}

export type BookingFormValues = {
    vehicle_id: string;
    location_id: string;
    booking_date: string;
    return_date: string;
    user_id: number;
}

export type VehicleFormValues = {
    vehicle_spec_id: string;
    rental_rate: number;
    availability: boolean;
}

export type VehicleSpecFormValues = {
    manufacturer: string;
    model: string;
    year: number;
    fuel_type: string;
    engine_capacity?: string;
    transmission?: string;
    seating_capacity: number;
    color: string;
    features: string;
}

export type SupportTicketFormValues = {
    subject: string;
    message: string;
}

export type PaymentFormValues = {
    booking_id: string;
    amount: number;
    payment_method: string;
}

// Core Entity Types - UPDATED BASED ON DATABASE
export interface User {
    user_id: number;  // Changed to number
    first_name: string;
    last_name: string;
    email: string;
    contact_phone?: string;  // Updated field name
    address?: string;
    role: 'user' | 'admin';
    created_at: string;
    updated_at: string;
}

export interface Vehicle {
    vehicle_id: string;
    vehicle_spec_id: string;
    rental_rate: number;  // Updated field name
    availability: boolean;  // Updated field name
    created_at: string;
    updated_at: string;
    vehicle_spec?: VehicleSpecification;
    location?: Location;  // Added location relation
}

export interface VehicleSpecification {
    vehicleSpec_id: string;
    manufacturer: string;
    model: string;
    year: number;
    fuel_type: string;
    engine_capacity?: string;  // New field
    transmission?: string;  // New field
    seating_capacity: number;
    color: string;
    features: string;  // Changed from string[] to string (NVARCHAR(MAX))
}

export interface Location {
    location_id: string;
    name: string;
    address?: string;
    city: string;
    country: string;
    created_at: string;
}

export interface Booking {
    booking_id: string;
    user_id: number;  // Changed to number
    vehicle_id: string;
    location_id: string;  // New field
    booking_date: string;  // Updated field name
    return_date: string;  // Updated field name
    total_amount: number;  // Updated field name
    booking_status: string;  // Updated field name
    created_at: string;
    updated_at: string;
    vehicle?: Vehicle;
    user?: User;
    location?: Location;  // Added location relation
    payment?: Payment;
}

export interface Payment {
    payment_id: string;
    booking_id: string;
    amount: number;
    payment_status: string;  // Updated field name
    payment_date?: string;  // New field
    payment_method?: string;  // Updated field name
    transaction_id?: string;
    created_at: string;
    updated_at: string;
}

export interface SupportTicket {
    ticket_id: string;
    user_id: string;
    subject: string;
    message: string;
    status: 'Open' | 'InProgress' | 'Resolved' | 'Closed';
    assigned_admin_id?: string;
    created_at: string;
    updated_at: string;
    user?: User;
    assigned_admin?: User;
}

// Dashboard & Stats Types - UNCHANGED
export interface AdminDashboardStats {
    totalBookings: number;
    totalRevenue: number;
    totalUsers: number;
    totalVehicles: number;
    activeBookings: number;
    pendingTickets: number;
}

export interface UserStats {
    totalBookings: number;
    totalSpent: number;
    favoriteVehicleType: string;
    upcomingBookings: number;
}

export interface FavoriteVehicles {
    vehicle_id: string;
    title: string;
    daily_price: number;
    main_image_url: string;
    bookings: number;
}

export interface AllBookingData {
    booking_id: string;
    user_id: string;
    vehicle_id: string;
    total_cost: number;
    status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';
    vehicle_title: string;
    customer_name: string;
    customer_email: string;
    created_at: string;
}

export interface RecentBooking {
    booking_id: string;
    customer_name: string;
    amount: number;
    status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';
    created_at: string;
}

// API Response Types - UNCHANGED
export interface ApiResponse<T> {
    data: T;
    message?: string;
    success: boolean;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

// Filter & Search Types - UNCHANGED
export interface VehicleFilters {
    vehicle_type?: 'two-wheeler' | 'four-wheeler' | '';
    min_price?: number;
    max_price?: number;
    location?: string;
    year_min?: number;
    year_max?: number;
    fuel_type?: string;
    seating_capacity?: number;
    features?: string[];
    search_query?: string;
}

export interface BookingFilters {
    status?: string;
    date_from?: string;
    date_to?: string;
    vehicle_type?: string;
}

// Auth State Types - UNCHANGED
export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

// Booking State Types - UNCHANGED
export interface BookingState {
    currentBooking: {
        vehicle: Vehicle | null;
        startDate: string;
        endDate: string;
        totalCost: number;
    };
    bookings: Booking[];
    loading: boolean;
}

// Vehicle State Types - UNCHANGED
export interface VehicleState {
    vehicles: Vehicle[];
    featuredVehicles: Vehicle[];
    currentVehicle: Vehicle | null;
    filters: VehicleFilters;
    loading: boolean;
}

// Payment State Types - UNCHANGED
export interface PaymentState {
    currentPayment: Payment | null;
    paymentIntent?: string;
    loading: boolean;
}

// Support State Types - UNCHANGED
export interface SupportState {
    tickets: SupportTicket[];
    currentTicket: SupportTicket | null;
    loading: boolean;
}

// Chart Data Types - UNCHANGED
export interface RevenueChartData {
    month: string;
    revenue: number;
    bookings: number;
}

export interface VehicleTypeStats {
    type: string;
    count: number;
    percentage: number;
}

export interface BookingStatusStats {
    status: string;
    count: number;
    color: string;
}

// Feature Types - UNCHANGED
export interface VehicleFeature {
    id: string;
    name: string;
    category: string;
    icon?: string;
}

// Fuel Type Options - UNCHANGED
export type FuelType = 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid' | 'CNG';

// Error Types - UNCHANGED
export interface ApiError {
    errorCode: string;
    message: string;
    details?: string;
}

// File Upload Types - UNCHANGED
export interface FileUploadResponse {
    url: string;
    filename: string;
    size: number;
    mimetype: string;
}

// Webhook Types - UNCHANGED
export interface StripeWebhookPayload {
    type: string;
    data: {
        object: string;
    };
}

export interface MpesaWebhookPayload {
    Body: {
        stkCallback: {
            MerchantRequestID: string;
            CheckoutRequestID: string;
            ResultCode: number;
            ResultDesc: string;
            CallbackMetadata?: {
                Item: Array<{
                    Name: string;
                    Value: string | number;
                }>;
            };
        };
    };
}