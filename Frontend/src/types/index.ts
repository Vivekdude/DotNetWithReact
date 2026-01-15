export interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  role: string
  createdAt: string
  lastLoginAt?: string
  isActive: boolean
}

export interface AuthResponse {
  token: string
  email: string
  firstName: string
  lastName: string
  role: string
  expiresAt: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  firstName: string
  lastName: string
}

export interface DashboardStats {
  totalUsers: number
  activeUsers: number
  newUsersThisMonth: number
  userActivityChart: UserActivityData[]
  roleDistribution: RoleDistribution[]
}

export interface UserActivityData {
  date: string
  count: number
}

export interface RoleDistribution {
  role: string
  count: number
}
