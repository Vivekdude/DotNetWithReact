import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authAPI } from '../services/api'
import type { AuthResponse, LoginRequest, RegisterRequest, User } from '../types'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (data: LoginRequest) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token')
      if (token) {
        try {
          const currentUser = await authAPI.getCurrentUser()
          setUser(currentUser)
        } catch (error) {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
        }
      }
      setIsLoading(false)
    }

    initAuth()
  }, [])

  const login = async (data: LoginRequest) => {
    const response: AuthResponse = await authAPI.login(data)
    localStorage.setItem('token', response.token)
    localStorage.setItem('user', JSON.stringify(response))

    const currentUser = await authAPI.getCurrentUser()
    setUser(currentUser)
  }

  const register = async (data: RegisterRequest) => {
    const response: AuthResponse = await authAPI.register(data)
    localStorage.setItem('token', response.token)
    localStorage.setItem('user', JSON.stringify(response))

    const currentUser = await authAPI.getCurrentUser()
    setUser(currentUser)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    window.location.href = '/login'
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
