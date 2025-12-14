export interface User {
  id: number
  name: string
  email: string
  password: string
  created_at: Date | string
}

export interface UserWithoutPassword {
  id: number
  name: string
  email: string
  created_at: Date | string
}

export interface AuthResponse {
  token: string
  refreshToken?: string
  user: UserWithoutPassword | null
}
