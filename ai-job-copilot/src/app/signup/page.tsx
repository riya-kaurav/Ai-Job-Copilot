'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Zap, Eye, EyeOff, ArrowRight, Check } from 'lucide-react'
import { useAuthStore } from '@/hooks/useAuth'
import toast from 'react-hot-toast'

const PERKS = ['AI-powered match scoring', 'Smart next-action suggestions', 'Weekly performance reports', 'Interview preparation AI']

export default function SignupPage() {
  const router = useRouter()
  const { signup, isAuthenticated, isLoading } = useAuthStore()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)

  useEffect(() => { if (isAuthenticated) router.push('/dashboard') }, [isAuthenticated, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 8) { toast.error('Password must be at least 8 characters'); return }
    try {
      await signup(name, email, password)
      toast.success('Account created! Welcome aboard 🚀')
      router.push('/dashboard')
    } catch (err: any) { toast.error(err.message || 'Signup failed') }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="fixed inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(rgba(37,99,235,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.5) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      <div className="relative w-full max-w-md">
        <div className="absolute -inset-4 rounded-3xl opacity-20 blur-2xl"
          style={{ background: 'radial-gradient(ellipse, #2563EB, #7C3AED, transparent)' }} />

        <div className="relative glass-card p-8 shadow-glow-blue animate-fade-in-up">
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

          <h1 className="font-display font-bold text-2xl text-text-primary mb-1">Create your account</h1>
          <p className="text-text-secondary text-sm mb-6">Start your AI-powered job search today</p>

          {/* Perks */}
          <div className="grid grid-cols-2 gap-2 mb-6">
            {PERKS.map(p => (
              <div key={p} className="flex items-center gap-1.5 text-xs text-text-muted">
                <Check size={11} className="text-emerald-400 flex-shrink-0" />
                {p}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">Full Name</label>
              <input className="input-field" placeholder="Alex Johnson" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">Email</label>
              <input type="email" className="input-field" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">Password</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} className="input-field pr-10"
                  placeholder="Min. 8 characters" value={password} onChange={e => setPassword(e.target.value)} required minLength={8} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-primary w-full mt-2" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center gap-2 justify-center">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating account...
                </span>
              ) : (
                <span className="flex items-center gap-2 justify-center">Create Account <ArrowRight size={16} /></span>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-text-muted">
              Already have an account?{' '}
              <Link href="/login" className="text-accent-purple-light hover:text-white transition-colors font-medium">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
