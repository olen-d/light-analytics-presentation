'use strict'

import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { verifyBearerToken } from '../services/jsonwebtoken.mjs'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate()

  const [bearerToken, setBearerToken] = useState(null)
  const [btExp, setBtExp] = useState(0)
  const [btRole, setBtRole] = useState(null)
  const [btSub, setBtSub] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const bearerTokenPublicKey = useRef(null)

  const apiKey = import.meta.env.VITE_ANALYTICS_API_KEY
  const apiKeyRead = import.meta.env.VITE_ANALYTICS_API_KEY_READ
  const baseAnalyticsApiUrl = import.meta.env.VITE_ANALYTICS_API_BASE_URL

  useEffect(() => {
    const fetchData = async () => {
      const requestOptions = {
        method: 'GET',
        headers: {
          'api-key': apiKeyRead
        }
      }
  
      try {
        const response = await fetch(`${baseAnalyticsApiUrl}/api/v1/auth/token/bearer/public-key`, requestOptions)
        const result = await response.json()
        
        if(result.status === 'ok') {
          const { data: { publicKey }, } = result
          bearerTokenPublicKey.current = publicKey
        }
      } catch (error) {
        console.log(error)
      }
    }

    fetchData()
  }, [])

  const updateVerification = async () => {
    try {
      if (bearerToken) {
        const result = await verifyBearerToken(bearerToken, bearerTokenPublicKey.current)
        const { payload : { exp, role, sub }, } = result
  
        const currentTimestamp = Date.now() / 1000
        const secondsToExpiration =  exp - currentTimestamp
        if (secondsToExpiration < 3600) {
          const url = `${baseAnalyticsApiUrl}/api/v1/auth/token/grant-type/refresh-token`
          const requestOptions = {
            method: 'POST',
            headers: {
              'api-key': apiKey,
            },
            body: JSON.stringify({ refreshToken: 'none' })
          }
          
          const response = await fetch(url, requestOptions)
          const result = await response.json()
          if (result.status === 'ok') {
          // Destructure the data
            const { data: { tokenType, accessToken, refreshToken } } = result
            if (tokenType === 'bearer') {
              // login(accessToken, refreshToken)
            }
          } else {
            // Deal with the error
          }
        }
        setBtExp(exp)
        setBtRole(role)
        setBtSub(sub)
        setIsAuthenticated(true)
      } else {
        const refreshToken = localStorage.getItem('refreshTokenSPA') ? localStorage.getItem('refreshTokenSPA') : false

        if (refreshToken) {
          const url = `${baseAnalyticsApiUrl}/api/v1/auth/token/grant-type/refresh-token`
          const requestOptions = {
            method: 'POST',
            headers: {
              'api-key': apiKey,
            },
            body: JSON.stringify({ refreshToken, test:'doritos' })
          }
          
          const response = await fetch(url, requestOptions)
          const result = await response.json()
          if (result.status === 'ok') {
          // Destructure the data
            const { data: { tokenType, accessToken, refreshToken } } = result
            if (tokenType === 'bearer') {
              login(accessToken, refreshToken)
            }
          }
        }
      }
    } catch (error) {
      console.log(error)
      return false
    }
  }

  const login = async (accessToken, refreshToken) => {
    try {
      const result = await verifyBearerToken(accessToken, bearerTokenPublicKey.current)

      if (result) {
        setBearerToken(accessToken)
        setIsAuthenticated(true)
        localStorage.setItem('refreshTokenSPA', refreshToken)
        navigate('/admin')
      }
    } catch (error) {
      return false
    }
  }

  const logout = () => {
    // TODO: Need to hit /logout endpoint to delete the httponly cookie
    setBearerToken(null)
    setBtExp(0)
    setBtRole(null)
    setBtSub(null)
    // localStorage.removeItem('refreshToken')
    navigate('/')
  }

  const refreshBearerToken = (bearerToken) => {
    const isValidBearerToken = verifyBearerToken(bearerToken)

    if (isValidBearerToken) {
      setIsAuthenticated(true)
      setBearerToken(bearerToken)
    } else {
      setIsAuthenticated(false)
      setBearerToken(null)
      navigate('/')
    }
    
  }
  
  const value = useMemo(
    () => ({
      bearerToken,
      btExp,
      btRole,
      btSub,
      isAuthenticated,
      login,
      logout,
      refreshBearerToken,
      updateVerification
    }),
    [bearerToken, isAuthenticated]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  return useContext(AuthContext)
}

