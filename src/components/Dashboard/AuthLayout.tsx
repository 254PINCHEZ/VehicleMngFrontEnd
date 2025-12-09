import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '../../store/store'
import Header from '../Header'
import Footer from '../footer'

const AuthLayout: React.FC = () => {
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth)

    // If user is already authenticated, redirect to appropriate dashboard
    if (isAuthenticated && user) {
        if (user.role === 'admin') {
            return <Navigate to="/admin" replace />
        }
        if (user.role === 'customer') {
            return <Navigate to="/dashboard" replace />
        }
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}

export default AuthLayout