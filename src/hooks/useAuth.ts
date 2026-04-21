import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, register, getToken, setToken, removeToken } from '../services/apiService'

interface User {
  id: number
  name: string
  email: string
  role: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const token = getToken()
    if (token) {
      // You could add a token validation endpoint here
      setLoading(false)
    } else {
      setLoading(false)
    }
  }, [])

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await login(email, password)
      if (response.accessToken) {
        setToken(response.accessToken)
        setUser(response.user)
        return { success: true }
      } else {
        return { success: false, error: response.error || 'Login failed' }
      }
    } catch (error) {
      return { success: false, error: 'Network error' }
    }
  }

  const handleRegister = async (name: string, email: string, password: string) => {
    try {
      const response = await register(name, email, password)
      if (response.message) {
        // Auto-login after successful registration
        const loginResult = await handleLogin(email, password)
        return loginResult
      } else {
        return { success: false, error: response.error || 'Registration failed' }
      }
    } catch (error) {
      return { success: false, error: 'Network error' }
    }
  }

  const handleLogout = () => {
    removeToken()
    setUser(null)
    navigate('/application-portal')
  }

  return {
    user,
    loading,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    isAuthenticated: !!getToken()
  }
}
