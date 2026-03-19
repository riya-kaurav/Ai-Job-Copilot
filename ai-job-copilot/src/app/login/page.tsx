'use client'
// ============================================================
// LOGIN PAGE — JWT authentication entry point
// ============================================================

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Zap, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react'
import { useAuthStore } from '@/hooks/useAuth'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const router = useRouter()
  const { login, isAuthenticated, isLoading } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)

  // Already logged in → go to dashboard
  useEffect(() => {
    if (isAuthenticated) router.push('/dashboard')
  }, [isAuthenticated, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await login(email, password)
      toast.success('Welcome back!')
      router.push('/dashboard')
    } catch (err: any) {
      toast.error(err.message || 'Login failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Background grid */}
      <div className="fixed inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(rgba(124,58,237,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.5) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      <div className="relative w-full max-w-md">
        {/* Glow behind card */}
        <div className="absolute -inset-4 rounded-3xl opacity-20 blur-2xl"
          style={{ background: 'radial-gradient(ellipse, #7C3AED, #2563EB, transparent)' }} />

        <div className="relative glass-card p-8 shadow-glow-purple animate-fade-in-up">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #7C3AED, #5B21B6)', boxShadow: '0 0 20px rgba(124,58,237,0.4)' }}>
              <Zap size={20} className="text-white" fill="white" />
            </div>
            <div>
              <div className="font-display font-bold text-white text-lg leading-tight">AI Job Copilot</div>
              <div className="text-[11px] text-text-muted">Intelligent Career OS</div>
            </div>
          </div>

          <h1 className="font-display font-bold text-2xl text-text-primary mb-1">Welcome back</h1>
          <p className="text-text-secondary text-sm mb-8">Sign in to continue your job search journey</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">Email</label>
              <input type="email" className="input-field" placeholder="you@example.com"
                value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">Password</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} className="input-field pr-10"
                  placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-primary w-full mt-6" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center gap-2 justify-center">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center gap-2 justify-center">
                  Sign In <ArrowRight size={16} />
                </span>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-text-muted">
              Don't have an account?{' '}
              <Link href="/signup" className="text-accent-purple-light hover:text-white transition-colors font-medium">
                Create account
              </Link>
            </p>
          </div>

          {/* Demo hint */}
          <div className="mt-6 p-3 rounded-lg border border-accent-purple/20 bg-accent-purple/5">
            <p className="text-xs text-text-muted flex items-center gap-1.5">
              <Sparkles size={11} className="text-accent-purple-light" />
              New here? Create an account to explore all AI features.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
