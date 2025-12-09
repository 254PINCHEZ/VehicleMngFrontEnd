import React from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '../../store/store'

interface UserRouteProps {
    children: React.ReactNode
}

const UserRoute: React.FC<UserRouteProps> = ({ children }) => {
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth)

    // Check if user is authenticated
    if (!isAuthenticated || !user) {
        return <Navigate to="/login" replace />
    }

    // Check if user has access to customer routes
    // Accept both 'user' and 'customer' roles for customer access
    const isCustomer = user.role === 'user' || user.role === 'customer'
    
    if (!isCustomer) {
        if (user.role === 'admin') {
            return <Navigate to="/admin/dashboard" replace />
        }
        // Any other role (like 'guest', 'manager', etc.) goes to login
        return <Navigate to="/login" replace />
    }

    return <>{children}</>
}

export default UserRoute