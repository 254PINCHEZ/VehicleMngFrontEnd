import React from 'react'
import DashboardLayout from '../../components/Dashboard/DashboardLayout'
import { User, Calendar, CreditCard, HelpCircle, Settings, ArrowRight, Eye } from 'lucide-react'
import { useSelector } from 'react-redux'
import type { RootState } from '../../store/store'

const UserDashboard: React.FC = () => {
    const { user } = useSelector((state: RootState) => state.auth);

    // Mock data for dashboard stats - replace with actual API calls
    const dashboardStats = {
        totalBookings: 10,
        upcomingBookings: 2,
        totalSpent: 4486,
        activeTickets: 9,
    }

    const quickActions = [
        {
            title: 'My Profile',
            description: 'Update personal information',
            icon: User,
            color: 'bg-gradient-to-br from-blue-500 to-blue-600',
            hoverColor: 'hover:from-blue-600 hover:to-blue-700',
            href: '/dashboard/profile'
        },
        {
            title: 'Booking History',
            description: 'View all your rentals',
            icon: Calendar,
            color: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
            hoverColor: 'hover:from-emerald-600 hover:to-emerald-700',
            href: '/dashboard/bookings'
        },
        {
            title: 'Payment History',
            description: 'View payment records',
            icon: CreditCard,
            color: 'bg-gradient-to-br from-violet-500 to-violet-600',
            hoverColor: 'hover:from-violet-600 hover:to-violet-700',
            href: '/dashboard/payments'
        },
        {
            title: 'Support Tickets',
            description: 'Get help & support',
            icon: HelpCircle,
            color: 'bg-gradient-to-br from-amber-500 to-amber-600',
            hoverColor: 'hover:from-amber-600 hover:to-amber-700',
            href: '/dashboard/support'
        },
        {
            title: 'Account Settings',
            description: 'Manage preferences',
            icon: Settings,
            color: 'bg-gradient-to-br from-slate-500 to-slate-600',
            hoverColor: 'hover:from-slate-600 hover:to-slate-700',
            href: '/dashboard/settings'
        }
    ]

    const recentBookings = [
        {
            id: 'BK-001',
            vehicle: 'Toyota Camry 2023',
            date: '2024-01-15',
            status: 'Active',
            amount: 150
        },
        {
            id: 'BK-002', 
            vehicle: 'Honda Civic 2022',
            date: '2024-01-10',
            status:'Active',
            amount: 180
        }
    ]

    return (
        <DashboardLayout>
            {/* Header Section */}
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                    <User className="text-white" size={28} />
                </div>
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                        Welcome back, {user?.first_name}! 👋
                    </h1>
                    <p className="text-gray-600 text-lg">Manage your vehicle rentals and account settings</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:border-blue-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Bookings</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{dashboardStats.totalBookings}</p>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-xl">
                            <Calendar className="text-blue-600" size={24} />
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-sm text-gray-500">All time bookings</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:border-emerald-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Upcoming</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{dashboardStats.upcomingBookings}</p>
                        </div>
                        <div className="p-3 bg-emerald-50 rounded-xl">
                            <Calendar className="text-emerald-600" size={24} />
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-sm text-gray-500">Active reservations</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:border-violet-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Spent</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">${dashboardStats.totalSpent.toLocaleString()}</p>
                        </div>
                        <div className="p-3 bg-violet-50 rounded-xl">
                            <CreditCard className="text-violet-600" size={24} />
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-sm text-gray-500">Lifetime value</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:border-amber-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Active Tickets</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{dashboardStats.activeTickets}</p>
                        </div>
                        <div className="p-3 bg-amber-50 rounded-xl">
                            <HelpCircle className="text-amber-600" size={24} />
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-sm text-gray-500">Support requests</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Quick Actions */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Settings size={16} className="text-gray-600" />
                        </div>
                    </div>
                    <div className="space-y-4">
                        {quickActions.map((action, index) => {
                            const IconComponent = action.icon
                            return (
                                <a
                                    key={index}
                                    href={action.href}
                                    className="flex items-center p-5 rounded-xl border border-gray-200 hover:border-transparent hover:shadow-lg transition-all duration-300 group bg-gradient-to-r from-white to-gray-50 hover:from-blue-50 hover:to-indigo-50"
                                >
                                    <div className={`p-3 rounded-xl ${action.color} ${action.hoverColor} text-white mr-4 group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                                        <IconComponent size={22} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors duration-300 text-lg mb-1">
                                            {action.title}
                                        </h3>
                                        <p className="text-gray-600 text-sm">{action.description}</p>
                                    </div>
                                    <ArrowRight size={18} className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300" />
                                </a>
                            )
                        })}
                    </div>
                </div>

                {/* Recent Bookings */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900">Recent Bookings</h2>
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Calendar size={16} className="text-gray-600" />
                        </div>
                    </div>
                    <div className="space-y-4">
                        {recentBookings.length === 0 ? (
                            <div className="text-center py-12">
                                <Calendar className="mx-auto text-gray-300 mb-4" size={48} />
                                <p className="text-gray-500 text-lg mb-2">No recent bookings found</p>
                                <p className="text-gray-400 text-sm">Your upcoming and past bookings will appear here</p>
                            </div>
                        ) : (
                            recentBookings.map((booking, index) => (
                                <div key={index} className="flex items-center justify-between p-5 border border-gray-200 rounded-xl hover:shadow-md transition-all duration-300 bg-white group">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <h3 className="font-semibold text-gray-900 text-lg group-hover:text-blue-700 transition-colors duration-300">
                                                {booking.vehicle}
                                            </h3>
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                booking.status === 'Active' 
                                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                                    : 'bg-gray-100 text-gray-800 border border-gray-200'
                                            }`}>
                                                {booking.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-6 text-sm text-gray-600">
                                            <span className="font-mono">#{booking.id}</span>
                                            <span>{new Date(booking.date).toLocaleDateString()}</span>
                                            <span className="font-bold text-gray-900 text-lg">${booking.amount}</span>
                                        </div>
                                    </div>
                                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-blue-300 text-blue-600 hover:bg-blue-600 hover:text-white hover:shadow-md transition-all duration-300 group/btn">
                                        <Eye size={16} />
                                        <span className="text-sm font-medium">Details</span>
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                    
                    {recentBookings.length > 0 && (
                        <div className="mt-6 pt-5 border-t border-gray-200">
                            <a 
                                href="/dashboard/bookings" 
                                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-blue-300 text-blue-600 hover:bg-blue-600 hover:text-white hover:shadow-md transition-all duration-300 font-semibold"
                            >
                                <span>View All Bookings</span>
                                <ArrowRight size={16} />
                            </a>
                        </div>
                    )}
                </div>
            </div>

            {/* Support Quick Action */}
            <div className="mt-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 rounded-2xl p-8 text-white shadow-xl">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                    <div className="flex-1 text-center lg:text-left">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 mx-auto lg:mx-0">
                            <HelpCircle size={24} className="text-white" />
                        </div>
                        <h3 className="text-2xl font-bold mb-3">Need Help with Your Bookings?</h3>
                        <p className="text-blue-100 text-lg max-w-2xl">
                            Our dedicated support team is available 24/7 to assist you with any questions about your vehicle rentals, payments, or account.
                        </p>
                    </div>
                    <a 
                        href="/dashboard/support" 
                        className="flex items-center gap-2 px-8 py-4 bg-white text-blue-600 hover:bg-blue-50 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 whitespace-nowrap"
                    >
                        <HelpCircle size={20} />
                        Contact Support
                    </a>
                </div>
            </div>
        </DashboardLayout>
    )
}

export default UserDashboard