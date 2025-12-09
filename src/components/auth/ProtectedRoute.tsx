


import React from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '../../store/store'

interface ProtectedRouteProps {
    children: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    // CHANGE THIS LINE: Use 'auth' instead of 'authSlice'
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth)

    // Check if user is authenticated
    if (!isAuthenticated || !user) {
        return <Navigate to="/login" replace />
    }

    return <>{children}</>
}

export default ProtectedRoute