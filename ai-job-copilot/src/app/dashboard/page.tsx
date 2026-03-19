'use client'
// ============================================================
// DASHBOARD PAGE — Overview stats, charts, quick actions
// ============================================================

import { useEffect } from 'react'
import { Briefcase, TrendingUp, Award, XCircle, BarChart2, Target, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  Tooltip, PieChart, Pie, Cell, CartesianGrid
} from 'recharts'
import AppLayout from '@/components/layout/AppLayout'
import StatCard from '@/components/dashboard/StatCard'
import { useJobsStore } from '@/hooks/useJobs'
import { useAuthStore } from '@/hooks/useAuth'
import { formatDate } from '@/utils'

// Custom tooltip for Recharts
const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="glass-card px-3 py-2 text-xs shadow-card">
      <p className="text-text-muted mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }} className="font-medium">
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  )
}

export default function DashboardPage() {
  const { stats, jobs, fetchStats, fetchJobs, isStatsLoading } = useJobsStore()
  const { user } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    fetchStats()
    fetchJobs({ limit: 5, sortBy: 'dateApplied', sortOrder: 'desc' })
  }, [])

  const recentJobs = jobs.slice(0, 5)

  return (
    <AppLayout
      title={`Good ${getGreeting()}, ${user?.name?.split(' ')[0] || 'there'} 👋`}
      subtitle="Here's your job search overview"
      actions={
        <Link href="/jobs" className="btn-primary">
          <Plus size={16} /> Add Application
        </Link>
      }
    >
      <div className="space-y-8 stagger-children">

        {/* STAT CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Applications" value={stats?.total ?? 0}
            icon={Briefcase} iconColor="text-blue-400" iconBg="rgba(59,130,246,0.15)"
            accentColor="#3B82F6" loading={isStatsLoading} />
          <StatCard label="Interviews" value={stats?.interviews ?? 0}
            icon={TrendingUp} iconColor="text-purple-400" iconBg="rgba(168,85,247,0.15)"
            accentColor="#A855F7" loading={isStatsLoading} />
          <StatCard label="Offers Received" value={stats?.offers ?? 0}
            icon={Award} iconColor="text-emerald-400" iconBg="rgba(16,185,129,0.15)"
            accentColor="#10B981" loading={isStatsLoading} />
          <StatCard label="Response Rate" value={stats?.responseRate ?? 0} suffix="%"
            icon={Target} iconColor="text-amber-400" iconBg="rgba(245,158,11,0.15)"
            accentColor="#F59E0B" loading={isStatsLoading} />
        </div>

        {/* CHARTS ROW */}
        <div className="grid grid-cols-3 gap-6">
          {/* Application trend (area chart) */}
          <div className="col-span-2 glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display font-semibold text-text-primary">Application Trend</h2>
                <p className="text-xs text-text-muted mt-0.5">Last 8 weeks</p>
              </div>
              <BarChart2 size={18} className="text-text-muted" />
            </div>
            {isStatsLoading ? (
              <div className="skeleton h-48 rounded-lg" />
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={stats?.weeklyApplications || []} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                  <defs>
                    <linearGradient id="colorApp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorInt" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="week" tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Area type="monotone" dataKey="applications" name="Applications" stroke="#7C3AED" strokeWidth={2} fill="url(#colorApp)" />
                  <Area type="monotone" dataKey="interviews" name="Interviews" stroke="#3B82F6" strokeWidth={2} fill="url(#colorInt)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Status breakdown (pie chart) */}
          <div className="glass-card p-6">
            <h2 className="font-display font-semibold text-text-primary mb-1">Status Breakdown</h2>
            <p className="text-xs text-text-muted mb-6">All applications</p>
            {isStatsLoading ? (
              <div className="skeleton h-48 rounded-lg" />
            ) : stats?.statusBreakdown?.length ? (
              <>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie data={stats.statusBreakdown} cx="50%" cy="50%" innerRadius={45} outerRadius={70}
                      paddingAngle={3} dataKey="value">
                      {stats.statusBreakdown.map((entry, i) => (
                        <Cell key={i} fill={entry.color} stroke="transparent" />
                      ))}
                    </Pie>
                    <Tooltip content={<ChartTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-2">
                  {stats.statusBreakdown.map((s) => (
                    <div key={s.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                        <span className="text-text-secondary">{s.name}</span>
                      </div>
                      <span className="font-semibold text-text-primary">{s.value}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-40 text-sm text-text-muted">No data yet</div>
            )}
          </div>
        </div>

        {/* RECENT APPLICATIONS */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-semibold text-text-primary">Recent Applications</h2>
            <Link href="/jobs" className="text-xs text-accent-purple-light hover:text-white transition-colors">
              View all →
            </Link>
          </div>
          {recentJobs.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase size={40} className="text-text-muted mx-auto mb-3 opacity-40" />
              <p className="text-text-secondary text-sm mb-4">No applications yet</p>
              <Link href="/jobs" className="btn-primary inline-flex"><Plus size={15} /> Add Your First Job</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentJobs.map(job => (
                <div key={job._id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/3 transition-colors group">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(37,99,235,0.2))' }}>
                    {job.company.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-text-primary truncate">{job.company}</p>
                    <p className="text-xs text-text-muted truncate">{job.role}</p>
                  </div>
                  <div className="text-xs text-text-muted">{formatDate(job.dateApplied)}</div>
                  <span className={`badge text-[11px] ${
                    job.status === 'Offer' ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' :
                    job.status === 'Interview' ? 'bg-purple-500/10 text-purple-300 border-purple-500/20' :
                    job.status === 'Rejected' ? 'bg-rose-500/10 text-rose-300 border-rose-500/20' :
                    'bg-blue-500/10 text-blue-300 border-blue-500/20'
                  }`}>{job.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </AppLayout>
  )
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
}
