'use strict'

import { Navigate } from 'react-router-dom'

import { useAuth } from '../hooks/useAuth'  

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, updateVerification } = useAuth()
    updateVerification()

    if (!isAuthenticated) {
        return <Navigate to='/' />
    }
    return children
}

export default ProtectedRoute
