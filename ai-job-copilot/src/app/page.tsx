'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/hooks/useAuth'
import { Zap, Bot, BarChart3, Kanban, Target, ArrowRight, CheckCircle, Sparkles } from 'lucide-react'

const FEATURES = [
  { icon: Target, label: 'Smart Match Score', desc: 'AI analyzes your resume against job descriptions and shows exact skill gaps.' },
  { icon: Zap, label: 'Next Best Actions', desc: 'Personalized AI recommendations on exactly what to do next in your job search.' },
  { icon: BarChart3, label: 'Weekly AI Report', desc: 'Automated weekly summaries of job search health, response rates, and improvement tips.' },
  { icon: Bot, label: 'Interview Prep', desc: 'AI generates role-specific interview questions and revision topics.' },
  { icon: Kanban, label: 'Kanban Pipeline', desc: 'Visual drag-and-drop board to track applications across every stage.' },
  { icon: Sparkles, label: 'Follow-up Generator', desc: 'Generate professional follow-up emails in seconds with the perfect tone.' },
]

export default function LandingPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  useEffect(() => { if (isAuthenticated) router.push('/dashboard') }, [isAuthenticated, router])

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="border-b border-border px-8 py-4 flex items-center justify-between sticky top-0 z-50"
        style={{ background: 'rgba(8,11,20,0.9)', backdropFilter: 'blur(12px)' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #7C3AED, #5B21B6)', boxShadow: '0 0 16px rgba(124,58,237,0.4)' }}>
            <Zap size={16} className="text-white" fill="white" />
          </div>
          <span className="font-display font-bold text-white">AI Job Copilot</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="btn-ghost text-sm">Sign In</Link>
          <Link href="/signup" className="btn-primary text-sm">Get Started Free</Link>
        </div>
      </nav>
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-24">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-8" style={{ background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.3)', color: '#C4B5FD' }}>
          <Sparkles size={12} /> AI-Powered Job Search Intelligence
        </div>
        <h1 className="font-display font-bold text-6xl md:text-7xl text-text-primary max-w-4xl leading-tight mb-6">
          Land Your Dream Job{' '}
          <span style={{ background: 'linear-gradient(135deg, #7C3AED, #3B82F6, #06B6D4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>10x Faster</span>
        </h1>
        <p className="text-text-secondary text-xl max-w-2xl mb-10 leading-relaxed">The intelligent career OS that tracks applications, analyzes your fit with AI, and tells you exactly what to do next to get hired.</p>
        <div className="flex items-center gap-4">
          <Link href="/signup" className="btn-primary text-base py-3 px-8 gap-2">Start for Free <ArrowRight size={16} /></Link>
          <Link href="/login" className="btn-secondary text-base py-3 px-8">Sign In</Link>
        </div>
        <div className="flex items-center gap-6 mt-8 text-sm text-text-muted">
          {['No credit card required', 'Set up in 2 minutes', 'Free forever'].map(t => (
            <span key={t} className="flex items-center gap-1.5"><CheckCircle size={13} className="text-emerald-400" />{t}</span>
          ))}
        </div>
      </section>
      <section className="px-8 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-4xl text-text-primary mb-4">Everything you need to get hired</h2>
            <p className="text-text-secondary text-lg">Six AI-powered features working together for your success</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => {
              const Icon = f.icon
              return (
                <div key={f.label} className="glass-card-hover p-6">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background: 'rgba(124,58,237,0.15)' }}>
                    <Icon size={20} className="text-accent-purple-light" />
                  </div>
                  <h3 className="font-display font-bold text-text-primary mb-2">{f.label}</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">{f.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>
      <section className="px-8 py-20 text-center border-t border-border">
        <h2 className="font-display font-bold text-4xl text-text-primary mb-6">Ready to land your dream job?</h2>
        <Link href="/signup" className="btn-primary text-base py-3.5 px-10 inline-flex items-center gap-2">Get Started — It&apos;s Free <ArrowRight size={16} /></Link>
      </section>
      <footer className="border-t border-border px-8 py-6 text-center text-text-muted text-sm">
        © {new Date().getFullYear()} AI Job Copilot. Built for ambitious job seekers.
      </footer>
    </div>
  )
}
