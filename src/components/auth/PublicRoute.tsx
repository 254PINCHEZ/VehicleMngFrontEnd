import React from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '../../store/store'

interface PublicRouteProps {
    children: React.ReactNode
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth)

    // If user is already authenticated, redirect to appropriate dashboard
    if (isAuthenticated && user) {
        if (user.role === 'admin') {
            return <Navigate to="/admin/dashboard" replace />
        }
        // FIXED: Handle both 'user' and 'customer' roles
        if (user.role === 'user' || user.role === 'customer') {
            return <Navigate to="/inventory" replace />  // ← Changed from '/dashboard' to '/inventory'
        }
        return <Navigate to="/" replace />
    }

    return <>{children}</>
}

export default PublicRoute