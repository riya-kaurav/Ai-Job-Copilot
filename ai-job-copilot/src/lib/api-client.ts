// ============================================================
// API CLIENT — Centralized fetch wrapper
// Automatically attaches JWT, handles 401 → token refresh
// ============================================================

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || ''

class ApiClient {
  private getAccessToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('accessToken')
  }

  private getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('refreshToken')
  }

  private setTokens(accessToken: string, refreshToken?: string) {
    localStorage.setItem('accessToken', accessToken)
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken)
  }

  private clearTokens() {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
  }

  /** Attempt to refresh the access token using stored refresh token */
  private async refreshAccessToken(): Promise<string | null> {
    const refreshToken = this.getRefreshToken()
    if (!refreshToken) return null

    try {
      const res = await fetch(`${BASE_URL}/api/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      })

      if (!res.ok) {
        this.clearTokens()
        window.location.href = '/login'
        return null
      }

      const data = await res.json()
      const newToken = data.data?.accessToken
      if (newToken) {
        this.setTokens(newToken)
        return newToken
      }
    } catch {
      this.clearTokens()
    }
    return null
  }

  /** Core fetch wrapper with auth + retry logic */
  async fetch<T>(
    endpoint: string,
    options: RequestInit = {},
    retry = true
  ): Promise<T> {
    const token = this.getAccessToken()
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    }

    if (token) headers['Authorization'] = `Bearer ${token}`

    const res = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers })

    // If 401, try to refresh token once
    if (res.status === 401 && retry) {
      const newToken = await this.refreshAccessToken()
      if (newToken) {
        return this.fetch<T>(endpoint, options, false)
      }
      throw new Error('Session expired. Please log in again.')
    }

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.error || 'Request failed')
    }

    return data
  }

  // Convenience methods
  get<T>(endpoint: string) {
    return this.fetch<T>(endpoint, { method: 'GET' })
  }

  post<T>(endpoint: string, body: unknown) {
    return this.fetch<T>(endpoint, { method: 'POST', body: JSON.stringify(body) })
  }

  put<T>(endpoint: string, body: unknown) {
    return this.fetch<T>(endpoint, { method: 'PUT', body: JSON.stringify(body) })
  }

  delete<T>(endpoint: string) {
    return this.fetch<T>(endpoint, { method: 'DELETE' })
  }

  // Auth helpers
  storeTokens(accessToken: string, refreshToken: string) {
    this.setTokens(accessToken, refreshToken)
  }

  logout() {
    this.clearTokens()
  }
}

export const api = new ApiClient()
