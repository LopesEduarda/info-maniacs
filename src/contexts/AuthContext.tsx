'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { UserWithoutPassword, AuthResponse } from '@/types/user'
import { apiClient } from '@/lib/api-client'

interface AuthContextType {
  user: UserWithoutPassword | null
  token: string | null
  refreshToken: string | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  refreshAccessToken: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserWithoutPassword | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [refreshToken, setRefreshToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    const storedRefreshToken = localStorage.getItem('refreshToken')
    const storedUser = localStorage.getItem('user')

    if (storedToken && storedUser) {
      try {
        setToken(storedToken)
        setRefreshToken(storedRefreshToken)
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error)
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
      }
    }

    setIsLoading(false)
  }, [])

  const refreshAccessToken = async (): Promise<boolean> => {
    const currentRefreshToken = refreshToken || localStorage.getItem('refreshToken')
    
    if (!currentRefreshToken) {
      return false
    }

    try {
      const response = await apiClient.post<AuthResponse>('/auth/refresh', {
        refreshToken: currentRefreshToken,
      })

      if (response.success && response.data) {
        const newToken = response.data.token
        setToken(newToken)
        localStorage.setItem('token', newToken)
        return true
      }

      return false
    } catch (error) {
      return false
    }
  }

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', {
        email,
        password,
      })

      if (response.success && response.data) {
        const { token: newToken, refreshToken: newRefreshToken, user: newUser } = response.data

        setToken(newToken)
        setRefreshToken(newRefreshToken || null)
        setUser(newUser)

        localStorage.setItem('token', newToken)
        if (newRefreshToken) {
          localStorage.setItem('refreshToken', newRefreshToken)
        }
        if (newUser) {
          localStorage.setItem('user', JSON.stringify(newUser))
        }

        return { success: true }
      }

      return {
        success: false,
        error: response.error || response.message || 'Erro ao fazer login',
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      }
    }
  }

  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await apiClient.post<{ message: string; user: UserWithoutPassword }>(
        '/auth/register',
        {
          name,
          email,
          password,
        }
      )

      if (response.success && response.data) {
        const loginResponse = await apiClient.post<AuthResponse>('/auth/login', {
          email,
          password,
        })

        if (loginResponse.success && loginResponse.data) {
          const { token: newToken, refreshToken: newRefreshToken, user: newUser } = loginResponse.data

          setToken(newToken)
          setRefreshToken(newRefreshToken || null)
          setUser(newUser)

          localStorage.setItem('token', newToken)
          if (newRefreshToken) {
            localStorage.setItem('refreshToken', newRefreshToken)
          }
          if (newUser) {
            localStorage.setItem('user', JSON.stringify(newUser))
          }

          return { success: true }
        }

        return { success: true }
      }

      return {
        success: false,
        error: response.error || response.message || 'Erro ao registrar',
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      }
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    setRefreshToken(null)
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    router.push('/login')
  }

  const value: AuthContextType = {
    user,
    token,
    refreshToken,
    isLoading,
    isAuthenticated: !!user && !!token,
    login,
    register,
    logout,
    refreshAccessToken,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}
