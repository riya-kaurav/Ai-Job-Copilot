// ============================================================
// ROOT LAYOUT — Next.js App Router entry point
// Sets up fonts, theme provider, toast notifications
// ============================================================

import type { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Job Copilot — Your Intelligent Job Search Assistant',
  description: 'Track applications, get AI-powered insights, and land your dream job faster.',
  keywords: ['job tracker', 'AI job search', 'career assistant', 'job applications'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-background text-text-primary font-body antialiased noise-bg">
        {/* Ambient background glow orbs */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
          <div
            className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-[0.07]"
            style={{ background: 'radial-gradient(circle, #7C3AED 0%, transparent 70%)' }}
          />
          <div
            className="absolute top-[40%] right-[-15%] w-[500px] h-[500px] rounded-full opacity-[0.05]"
            style={{ background: 'radial-gradient(circle, #2563EB 0%, transparent 70%)' }}
          />
          <div
            className="absolute bottom-[-10%] left-[30%] w-[400px] h-[400px] rounded-full opacity-[0.04]"
            style={{ background: 'radial-gradient(circle, #06B6D4 0%, transparent 70%)' }}
          />
        </div>

        {/* Main content */}
        <div className="relative z-10">
          {children}
        </div>

        {/* Toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#0F1623',
              color: '#F1F5F9',
              border: '1px solid #1E2A3A',
              borderRadius: '10px',
              fontSize: '14px',
              fontFamily: 'DM Sans, system-ui',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            },
            success: {
              iconTheme: { primary: '#10B981', secondary: '#0F1623' },
            },
            error: {
              iconTheme: { primary: '#F43F5E', secondary: '#0F1623' },
            },
          }}
        />
      </body>
    </html>
  )
}
