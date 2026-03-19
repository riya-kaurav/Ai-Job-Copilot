'use client'
// ============================================================
// SIDEBAR — Main navigation component
// Premium dark sidebar with active state highlighting
// ============================================================

import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard, Briefcase, Kanban, Bot, User,
  LogOut, Zap, ChevronRight, Bell
} from 'lucide-react'
import { useAuthStore } from '@/hooks/useAuth'
import { cn } from '@/utils'
import toast from 'react-hot-toast'

const NAV_ITEMS = [
  { href: '/dashboard',    label: 'Dashboard',    icon: LayoutDashboard, description: 'Overview & stats' },
  { href: '/jobs',         label: 'Applications', icon: Briefcase,       description: 'Track your jobs'  },
  { href: '/kanban',       label: 'Kanban Board', icon: Kanban,          description: 'Visual pipeline'  },
  { href: '/ai-copilot',  label: 'AI Copilot',   icon: Bot,             description: 'AI insights',     badge: 'AI' },
  { href: '/profile',      label: 'Profile',      icon: User,            description: 'Your account'     },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    router.push('/login')
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 flex flex-col z-50"
      style={{
        background: 'linear-gradient(180deg, #080B14 0%, #0A0F1E 100%)',
        borderRight: '1px solid rgba(30, 42, 58, 0.8)',
      }}
    >
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)',
              boxShadow: '0 0 20px rgba(124, 58, 237, 0.4)',
            }}
          >
            <Zap size={18} className="text-white" fill="white" />
          </div>
          <div>
            <div className="font-display font-bold text-white text-sm leading-tight tracking-wide">
              AI Job Copilot
            </div>
            <div className="text-[11px] text-text-muted mt-0.5">Intelligent Career OS</div>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <div className="text-[10px] font-semibold text-text-muted uppercase tracking-widest px-3 mb-3">
          Navigation
        </div>
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          const Icon = item.icon
          return (
            <Link key={item.href} href={item.href}>
              <div className={cn('nav-item group', isActive && 'active')}>
                <Icon size={18} className={cn(
                  'flex-shrink-0 transition-colors',
                  isActive ? 'text-accent-purple-light' : 'text-text-muted group-hover:text-text-secondary'
                )} />
                <span className="flex-1 text-sm">{item.label}</span>
                {item.badge && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded"
                    style={{
                      background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(59,130,246,0.3))',
                      border: '1px solid rgba(124,58,237,0.4)',
                      color: '#C4B5FD',
                    }}
                  >
                    {item.badge}
                  </span>
                )}
                {isActive && <ChevronRight size={14} className="text-accent-purple-light opacity-70" />}
              </div>
            </Link>
          )
        })}
      </nav>

      {/* User footer */}
      <div className="p-4 border-t border-border">
        <div className="glass-card p-3 flex items-center gap-3">
          {/* Avatar */}
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, #7C3AED, #2563EB)',
              fontSize: '13px',
            }}
          >
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-text-primary truncate">{user?.name || 'User'}</div>
            <div className="text-[11px] text-text-muted truncate">{user?.email || ''}</div>
          </div>
          <button onClick={handleLogout}
            className="p-1.5 rounded-lg text-text-muted hover:text-rose-400 transition-colors"
            title="Logout"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  )
}
