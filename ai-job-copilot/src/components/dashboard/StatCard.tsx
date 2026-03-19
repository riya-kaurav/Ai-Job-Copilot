'use client'
// ============================================================
// STAT CARD — Dashboard metric display card
// Shows a number metric with icon, label, and trend
// ============================================================

import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '@/utils'

interface StatCardProps {
  label: string
  value: number | string
  icon: LucideIcon
  iconColor?: string
  iconBg?: string
  trend?: number    // Positive = up, negative = down
  suffix?: string   // e.g. "%"
  loading?: boolean
  accentColor?: string
}

export default function StatCard({
  label, value, icon: Icon, iconColor = 'text-accent-purple-light',
  iconBg = 'rgba(124,58,237,0.15)', trend, suffix = '', loading = false, accentColor
}: StatCardProps) {

  if (loading) {
    return (
      <div className="glass-card p-6">
        <div className="skeleton h-4 w-24 mb-4 rounded" />
        <div className="skeleton h-8 w-16 mb-2 rounded" />
        <div className="skeleton h-3 w-20 rounded" />
      </div>
    )
  }

  return (
    <div className="glass-card-hover p-6 group">
      {/* Top row: icon + trend */}
      <div className="flex items-start justify-between mb-4">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 duration-300"
          style={{ background: iconBg }}
        >
          <Icon size={20} className={iconColor} />
        </div>

        {/* Trend indicator */}
        {trend !== undefined && (
          <div className={cn(
            'flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg',
            trend > 0  ? 'text-emerald-400 bg-emerald-400/10' :
            trend < 0  ? 'text-rose-400 bg-rose-400/10' :
                         'text-text-muted bg-white/5'
          )}>
            {trend > 0 ? <TrendingUp size={12} /> : trend < 0 ? <TrendingDown size={12} /> : <Minus size={12} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>

      {/* Value */}
      <div className="font-display font-bold text-3xl text-text-primary mb-1"
        style={accentColor ? { color: accentColor } : undefined}
      >
        {value}{suffix}
      </div>

      {/* Label */}
      <div className="text-sm text-text-secondary font-medium">{label}</div>

      {/* Bottom accent line */}
      <div className="mt-4 h-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: accentColor || 'linear-gradient(90deg, #7C3AED, #2563EB)' }}
      />
    </div>
  )
}
