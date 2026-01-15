import axios, { AxiosError } from 'axios'
import type { AuthResponse, LoginRequest, RegisterRequest, User, DashboardStats } from '../types'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT) || 10000

export interface ApiError {
  message: string
  status?: number
  code?: string
}

export const handleApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string }>
    return {
      message: axiosError.response?.data?.message || axiosError.message || 'An unexpected error occurred',
      status: axiosError.response?.status,
      code: axiosError.code,
    }
  }
  if (error instanceof Error) {
    return { message: error.message }
  }
  return { message: 'An unexpected error occurred' }
}

const api = axios.create({
  baseURL: API_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', data)
    return response.data
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data)
    return response.data
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>('/auth/me')
    return response.data
  },

  logout: (): void => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/login'
  },
}

export const dashboardAPI = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get<DashboardStats>('/dashboard/stats')
    return response.data
  },
}

export const usersAPI = {
  getAllUsers: async (): Promise<User[]> => {
    const response = await api.get<User[]>('/users')
    return response.data
  },

  getUserById: async (id: number): Promise<User> => {
    const response = await api.get<User>(`/users/${id}`)
    return response.data
  },
}

export default api
