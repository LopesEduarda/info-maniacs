export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface JwtPayload {
  userId: number
  email: string
  iat?: number
  exp?: number
}
