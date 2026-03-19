'use client'
// ============================================================
// APP LAYOUT — Wraps all authenticated pages with sidebar
// Handles auth guard redirect if not logged in
// ============================================================

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from './Sidebar'
import { useAuthStore } from '@/hooks/useAuth'

interface AppLayoutProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
  actions?: React.ReactNode
}

export default function AppLayout({ children, title, subtitle, actions }: AppLayoutProps) {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()

  // Guard: redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) return null

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      {/* Main content area — offset for sidebar width */}
      <main className="flex-1 ml-64 min-h-screen">
        {/* Page header */}
        {(title || actions) && (
          <div className="sticky top-0 z-40 px-8 py-5 border-b border-border"
            style={{
              background: 'rgba(8, 11, 20, 0.9)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                {title && (
                  <h1 className="font-display font-bold text-2xl text-text-primary">
                    {title}
                  </h1>
                )}
                {subtitle && (
                  <p className="text-text-secondary text-sm mt-0.5">{subtitle}</p>
                )}
              </div>
              {actions && <div className="flex items-center gap-3">{actions}</div>}
            </div>
          </div>
        )}

        {/* Page content */}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
