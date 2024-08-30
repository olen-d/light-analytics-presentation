'use strict'

import { Navigate, Outlet } from 'react-router-dom'

import { useAuth } from '../hooks/useAuth'  

const ProtectedRoute = () => {
  const { isAuthenticated, updateVerification } = useAuth()
  updateVerification()

  if (!isAuthenticated) {
    return <Navigate to='/login' />
  }
  return (<Outlet />)
}

export default ProtectedRoute
