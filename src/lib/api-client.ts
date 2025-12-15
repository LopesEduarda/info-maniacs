import type { ApiResponse } from '@/types/api'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api'

class ApiClient {
  private getToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('token')
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = this.getToken()
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 401) {
          const refreshToken = localStorage.getItem('refreshToken')
          if (refreshToken) {
            try {
              const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken }),
              })

              if (refreshResponse.ok) {
                const refreshData = await refreshResponse.json()
                if (refreshData.data?.token) {
                  localStorage.setItem('token', refreshData.data.token)
                  headers['Authorization'] = `Bearer ${refreshData.data.token}`
                  
                  const retryResponse = await fetch(`${API_BASE_URL}${endpoint}`, {
                    ...options,
                    headers,
                  })
                  const retryData = await retryResponse.json()
                  
                  if (!retryResponse.ok) {
                    return {
                      success: false,
                      error: retryData.error || 'Erro na requisição',
                      message: retryData.message,
                    }
                  }

                  return {
                    success: true,
                    data: retryData.data || retryData,
                    message: retryData.message,
                  }
                }
              }
            } catch (refreshError) {
              localStorage.removeItem('token')
              localStorage.removeItem('refreshToken')
              window.location.href = '/login'
            }
          }
        }

        return {
          success: false,
          error: data.error || 'Erro na requisição',
          message: data.message,
        }
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message,
      }
    } catch (error) {
      console.error('Erro na requisição:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      }
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  async post<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    })
  }

  async put<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    })
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }
}

export const apiClient = new ApiClient()
