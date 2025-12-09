import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../Navbar'
import Footer from '../footer'

const PublicLayout: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}

export default PublicLayout

// import React from 'react'
// import { Outlet, Navigate } from 'react-router-dom'
// import { useSelector } from 'react-redux'
// import type { RootState } from '../../store/store'
// import Navbar from '../Navbar'
// import Footer from '../footer'

// const PublicLayout: React.FC = () => {
//     const { isAuthenticated, user } = useSelector((state: RootState) => state.auth)

//     // Check if current path is login or register
//     const isAuthPage = window.location.pathname === '/login' || window.location.pathname === '/register'

//     // If user is authenticated and trying to access login/register pages, redirect them
//     if (isAuthenticated && user && isAuthPage) {
//         if (user.user_type === 'admin') {
//             return <Navigate to="/admin" replace />
//         }
//         if (user.user_type === 'customer') {
//             return <Navigate to="/dashboard" replace />
//         }
//     }

//     return (
//         <div className="min-h-screen flex flex-col">
//             <Navbar />
//             <main className="flex-grow">
//                 <Outlet />
//             </main>
//             <Footer />
//         </div>
//     )
// }

// export default PublicLayout