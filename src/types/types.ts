// Form Value Types (Keep as is)
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
export interface User {
    user_id: number | string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number?: string;
    role: string;
    created_at: string;
    updated_at?: string;
    address?: string;
    status?: string;
}

// Core Entity Types
// export interface User {
//     user_id: number;
//     first_name: string;
//     last_name: string;
//     email: string;
//     contact_phone?: string;
//     address?: string;
//     role: 'user' | 'admin';
//     created_at: string;
//     updated_at: string;
//     phone_number?: string;
//     name?: string; // For compatibility with existing code
// }

export interface Vehicle {
    vehicle_id: string;
    vehicle_spec_id: string;
    rental_rate: number;
    availability: boolean;
    created_at: string;
    updated_at: string;
    vehicle_spec?: VehicleSpecification;
    location?: Location;
}

export interface VehicleSpecification {
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
    user_id: number;
    vehicle_id: string;
    location_id: string;
    booking_date: string;
    return_date: string;
    total_amount: number;
    booking_status: string;
    created_at: string;
    updated_at: string;
    vehicle?: Vehicle;
    user?: User;
    location?: Location;
    payment?: Payment;
    
    // For display purposes (optional)
    // status?: any;
    // vehicle_type?: ReactNode;
    // vehicle_name?: ReactNode;
    // customer_email?: ReactNode;
    // customer_name?: ReactNode;
}

export interface Payment {
    payment_id: string;
    booking_id: string;
    amount: number;
    payment_status: string;
    payment_date?: string;
    payment_method?: string;
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
    
    // For dashboard/display purposes
    ticket_reference?: string;
    customer_id?: string;
    customer_name?: string;
    customer_email?: string;
    phone?: string;
    description?: string;
    category?: 'technical' | 'billing' | 'booking' | 'general' | 'vehicle';
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    assigned_to?: string;
    last_reply_at?: string;
}

export interface TicketReply {
    reply_id: string;
    ticket_id: string;
    user_id: string;
    user_name: string;
    user_type: 'customer' | 'admin';
    message: string;
    is_admin: boolean;
    created_at: string;
}

// Dashboard Stats Types - UPDATED
export interface DashboardStats {
    totalBookings: number;
    totalRevenue: number;
    totalUsers: number;
    activeVehicles: number;
    revenueChange: number;
    bookingChange: number;
    userChange: number;
    utilizationChange: number;
    pendingBookings: number;
    completedBookings: number;
    activeBookings: number;
}

// Analytics Types - UPDATED to include all missing properties
export interface AnalyticsData {
    totalRevenue: number;
    totalBookings: number;
    totalUsers: number;
    activeVehicles: number;
    revenueChange: number;
    bookingChange: number;
    userChange: number;
    utilizationChange: number;
    monthlyRevenue: Array<{ month: string; revenue: number }>;
    bookingTrends: Array<{ date: string; count: number }>;
    userGrowth: Array<{ date: string; count: number }>;
    topPerformingVehicles: Array<{ 
        vehicle_id: string; 
        name: string; 
        revenue: number; 
        bookings: number;
        utilization: number;
    }>;
    popularVehicleTypes: Array<{ 
        type: string; 
        count: number; 
        revenue: number;
    }>;
    revenueSources: Array<{
        source: string;
        amount: number;
        percentage: number;
    }>;
}

// Additional Analytics Interfaces
export interface RevenueAnalytics {
    totalRevenue: number;
    monthlyRevenue: Array<{ month: string; revenue: number }>;
    revenueChange: number;
    averageBookingValue: number;
    revenueByVehicleType: Array<{ type: string; revenue: number }>;
}

export interface BookingAnalytics {
    totalBookings: number;
    bookingTrends: Array<{ date: string; count: number }>;
    bookingStatus: {
        pending: number;
        confirmed: number;
        active: number;
        completed: number;
        cancelled: number;
    };
    peakHours: Array<{ hour: number; bookings: number }>;
    popularVehicles: Array<{ vehicle_id: string; name: string; bookings: number }>;
}

export interface UserAnalytics {
    totalUsers: number;
    newUsers: number;
    activeUsers: number;
    userGrowth: number;
    userByType: {
        customer: number;
        admin: number;
        staff: number;
    };
    signupTrends: Array<{ date: string; count: number }>;
}

export interface FleetAnalytics {
    totalVehicles: number;
    availableVehicles: number;
    rentedVehicles: number;
    maintenanceVehicles: number;
    utilizationRate: number;
    revenueByVehicle: Array<{ vehicle_id: string; name: string; revenue: number }>;
    topPerformingVehicles: Array<{ vehicle_id: string; name: string; bookings: number; revenue: number }>;
}

// Recent Booking Interface
export interface RecentBooking {
    booking_id: string;
    booking_reference: string;
    customer_name: string;
    customer_email: string;
    vehicle_name: string;
    vehicle_type: string;
    total_amount: number;
    daily_rate?: number;
    status: 'pending' | 'confirmed' | 'active' | 'cancelled' | 'completed';
    created_at: string;
    start_date: string;
    end_date: string;
    pickup_location?: string;
    vehicle_license_plate?: string;
}

// Settings Types
export interface SystemSettings {
    siteName: string;
    siteDescription: string;
    adminEmail: string;
    supportEmail: string;
    timezone: string;
    language: string;
    dateFormat: string;
    emailNotifications: boolean;
    smsNotifications: boolean;
    bookingAlerts: boolean;
    paymentAlerts: boolean;
    systemAlerts: boolean;
    dailyReports: boolean;
    twoFactorAuth: boolean;
    sessionTimeout: number;
    passwordPolicy: string;
    loginAttempts: number;
    ipWhitelist: string;
    auditLogging: boolean;
    currency: string;
    paymentMethods: string[];
    taxRate: number;
    autoCancelPending: boolean;
    refundPolicy: string;
    theme: string;
    primaryColor: string;
    secondaryColor: string;
    logoUrl: string;
    faviconUrl: string;
}

// Additional types
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

export interface AdvancedAnalytics {
    forecastedRevenue: Array<{ month: string; predicted: number; actual?: number }>;
    bookingPredictions: Array<{ date: string; predicted: number }>;
    customerSegmentation: {
        newCustomers: number;
        returningCustomers: number;
        vipCustomers: number;
        atRiskCustomers: number;
    };
    customerLifetimeValue: Array<{
        segment: string;
        averageValue: number;
        retentionRate: number;
    }>;
    bookingsByRegion: Array<{ region: string; bookings: number; revenue: number }>;
    popularLocations: Array<{ location: string; pickups: number; returns: number }>;
    peakHours: Array<{ hour: number; bookings: number }>;
    peakDays: Array<{ day: string; bookings: number; revenue: number }>;
    seasonalTrends: Array<{ season: string; bookings: number; revenue: number }>;
}

export interface KpiMetrics {
    averageBookingValue: number;
    revenuePerVehicle: number;
    revenuePerCustomer: number;
    profitMargin: number;
    vehicleUtilizationRate: number;
    bookingSuccessRate: number;
    cancellationRate: number;
    averageResponseTime: number;
    customerSatisfactionScore: number;
    netPromoterScore: number;
    customerRetentionRate: number;
    churnRate: number;
    averageBookingDuration: number;
    peakUtilizationTime: string;
    turnaroundTime: number;
}

export interface RealtimeStats {
    activeBookings: number;
    activeUsers: number;
    todayRevenue: number;
    todayBookings: number;
    systemHealth: {
        api: 'healthy' | 'degraded' | 'down';
        database: 'healthy' | 'degraded' | 'down';
        storage: 'healthy' | 'degraded' | 'down';
    };
}

// API Response Types
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

// Filter & Search Types
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

// State Types
export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

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

export interface VehicleState {
    vehicles: Vehicle[];
    featuredVehicles: Vehicle[];
    currentVehicle: Vehicle | null;
    filters: VehicleFilters;
    loading: boolean;
}

export interface PaymentState {
    currentPayment: Payment | null;
    paymentIntent?: string;
    loading: boolean;
}

export interface SupportState {
    tickets: SupportTicket[];
    currentTicket: SupportTicket | null;
    loading: boolean;
}

// Chart Data Types
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

// Additional Types
export interface VehicleFeature {
    id: string;
    name: string;
    category: string;
    icon?: string;
}

export type FuelType = 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid' | 'CNG';

export interface ApiError {
    errorCode: string;
    message: string;
    details?: string;
}

export interface FileUploadResponse {
    url: string;
    filename: string;
    size: number;
    mimetype: string;
}

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