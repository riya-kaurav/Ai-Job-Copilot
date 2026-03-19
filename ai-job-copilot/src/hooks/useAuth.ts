// ============================================================
// AUTH STORE — Zustand global state for authentication
// Persists user info to localStorage
// ============================================================

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '@/types'
import { api } from '@/lib/api-client'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  // Actions
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  updateUser: (data: Partial<User>) => void
  refreshUser: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true })
        try {
          const res = await api.post<{ data: { user: User; accessToken: string; refreshToken: string } }>(
            '/api/auth/login',
            { email, password }
          )
          api.storeTokens(res.data.accessToken, res.data.refreshToken)
          set({ user: res.data.user, isAuthenticated: true })
        } finally {
          set({ isLoading: false })
        }
      },

      signup: async (name, email, password) => {
        set({ isLoading: true })
        try {
          const res = await api.post<{ data: { user: User; accessToken: string; refreshToken: string } }>(
            '/api/auth/signup',
            { name, email, password }
          )
          api.storeTokens(res.data.accessToken, res.data.refreshToken)
          set({ user: res.data.user, isAuthenticated: true })
        } finally {
          set({ isLoading: false })
        }
      },

      logout: () => {
        api.logout()
        set({ user: null, isAuthenticated: false })
      },

      updateUser: (data) => {
        const current = get().user
        if (current) set({ user: { ...current, ...data } })
      },

      refreshUser: async () => {
        try {
          const res = await api.get<{ data: User }>('/api/auth/profile')
          set({ user: res.data })
        } catch {
          // Silently fail — session may have expired
        }
      },
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
)
