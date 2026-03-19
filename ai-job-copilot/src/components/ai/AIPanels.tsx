'use client'
// ============================================================
// AI COPILOT PANELS — All 6 AI feature UI panels
// ============================================================

import { useState } from 'react'
import { Target, Zap, BarChart3, FileText, Mail, BookOpen, Loader2, Copy, Check, XCircle } from 'lucide-react'
import { api } from '@/lib/api-client'
import { MatchAnalysis, NextAction, WeeklyReport, ResumeOptimization, FollowUpMessage, InterviewPrep } from '@/types'
import { cn, PRIORITY_STYLES } from '@/utils'
import toast from 'react-hot-toast'

// ─── Shared Shell ─────────────────────────────────────────

function AIPanelShell({ icon: Icon, title, subtitle, color, children, onRun, loading, ran }:
  { icon: any; title: string; subtitle: string; color: string; children?: React.ReactNode; onRun?: () => void; loading?: boolean; ran?: boolean }) {
  return (
    <div className="glass-card overflow-hidden">
      <div className="p-6 border-b border-border flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: color }}>
            <Icon size={20} className="text-white" />
          </div>
          <div>
            <h3 className="font-display font-bold text-text-primary">{title}</h3>
            <p className="text-xs text-text-muted mt-0.5">{subtitle}</p>
          </div>
        </div>
        {onRun && (
          <button onClick={onRun} disabled={loading} className="btn-primary text-sm py-2 px-4 flex-shrink-0 disabled:opacity-60">
            {loading ? <Loader2 size={15} className="animate-spin" /> : ran ? 'Re-run' : 'Analyze'}
          </button>
        )}
      </div>
      {children && <div className="p-6">{children}</div>}
    </div>
  )
}

// ─── 1. Smart Match Score ─────────────────────────────────

export function MatchScorePanel() {
  const [jd, setJd] = useState('')
  const [role, setRole] = useState('')
  const [result, setResult] = useState<MatchAnalysis | null>(null)
  const [loading, setLoading] = useState(false)

  const run = async () => {
    if (!jd.trim() || !role.trim()) { toast.error('Enter role and job description'); return }
    setLoading(true)
    try {
      const res = await api.post<{ data: MatchAnalysis }>('/api/ai/match', { jobRole: role, jobDescription: jd })
      setResult(res.data)
    } catch (e: any) { toast.error(e.message || 'Analysis failed') }
    finally { setLoading(false) }
  }

  const scoreColor = (s: number) => s >= 70 ? '#10B981' : s >= 50 ? '#F59E0B' : '#F43F5E'

  return (
    <AIPanelShell icon={Target} title="Smart Match Score" subtitle="Analyze resume vs job description"
      color="rgba(124,58,237,0.25)" onRun={run} loading={loading} ran={!!result}>
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">Target Role</label>
            <input className="input-field" placeholder="e.g. Senior React Developer" value={role} onChange={e => setRole(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">Job Description</label>
            <textarea className="input-field resize-none" rows={4} placeholder="Paste full JD here..." value={jd} onChange={e => setJd(e.target.value)} />
          </div>
        </div>
        {result && (
          <div className="space-y-4 animate-fade-in-up pt-4 border-t border-border">
            <div className="flex items-center gap-6">
              <div className="relative w-24 h-24 flex-shrink-0">
                <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                  <circle cx="50" cy="50" r="40" fill="none" strokeWidth="10"
                    stroke={scoreColor(result.matchScore)}
                    strokeDasharray={`${result.matchScore * 2.51} 251`} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-display font-bold" style={{ color: scoreColor(result.matchScore) }}>{result.matchScore}</span>
                  <span className="text-[10px] text-text-muted">/ 100</span>
                </div>
              </div>
              <p className="text-sm text-text-secondary">{result.summary}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold text-emerald-400 mb-2">✅ Matched Skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {result.matchedSkills.map(s => <span key={s} className="px-2 py-0.5 rounded-full text-[11px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">{s}</span>)}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-rose-400 mb-2">❌ Missing Skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {result.missingSkills.map(s => <span key={s} className="px-2 py-0.5 rounded-full text-[11px] bg-rose-500/10 text-rose-300 border border-rose-500/20">{s}</span>)}
                </div>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-text-secondary mb-2">💡 Suggestions</p>
              <ul className="space-y-1.5">{result.suggestions.map((s, i) => <li key={i} className="text-sm text-text-secondary flex gap-2"><span className="text-accent-purple-light">→</span>{s}</li>)}</ul>
            </div>
          </div>
        )}
      </div>
    </AIPanelShell>
  )
}

// ─── 2. Next Best Actions ─────────────────────────────────

export function NextActionsPanel() {
  const [actions, setActions] = useState<NextAction[]>([])
  const [loading, setLoading] = useState(false)
  const typeIcons: Record<string, string> = { 'follow-up': '📧', resume: '📄', apply: '🚀', prepare: '📚', network: '🤝', skill: '⚡' }

  const run = async () => {
    setLoading(true)
    try {
      const res = await api.post<{ data: NextAction[] }>('/api/ai/actions', {})
      setActions(res.data)
    } catch (e: any) { toast.error(e.message) }
    finally { setLoading(false) }
  }

  return (
    <AIPanelShell icon={Zap} title="Next Best Actions" subtitle="AI-powered personalized recommendations"
      color="rgba(37,99,235,0.25)" onRun={run} loading={loading} ran={actions.length > 0}>
      {actions.length > 0 && (
        <div className="space-y-3 animate-fade-in-up">
          {actions.map((action) => {
            const p = PRIORITY_STYLES[action.priority]
            return (
              <div key={action.id} className="p-4 rounded-xl border border-border bg-white/[0.02] hover:bg-white/[0.04] transition-all">
                <div className="flex items-start gap-3">
                  <span className="text-xl flex-shrink-0">{typeIcons[action.type] || '💡'}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-semibold text-sm text-text-primary">{action.title}</span>
                      <span className={cn('badge text-[10px]', p.bg, p.text, p.border)}>{action.priority}</span>
                      {action.deadline && <span className="text-[11px] text-text-muted bg-white/5 px-2 py-0.5 rounded-full">{action.deadline}</span>}
                    </div>
                    <p className="text-sm text-text-secondary">{action.description}</p>
                    {action.company && <p className="text-xs text-text-muted mt-1">🏢 {action.company}</p>}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </AIPanelShell>
  )
}

// ─── 3. Weekly AI Report ──────────────────────────────────

export function WeeklyReportPanel() {
  const [report, setReport] = useState<WeeklyReport | null>(null)
  const [loading, setLoading] = useState(false)

  const run = async () => {
    setLoading(true)
    try {
      const res = await api.post<{ data: WeeklyReport }>('/api/ai/report', {})
      setReport(res.data)
    } catch (e: any) { toast.error(e.message) }
    finally { setLoading(false) }
  }

  const scoreColor = (s: number) => s >= 70 ? '#10B981' : s >= 50 ? '#F59E0B' : '#F43F5E'

  return (
    <AIPanelShell icon={BarChart3} title="AI Weekly Report" subtitle="Personalized job search performance summary"
      color="rgba(6,182,212,0.2)" onRun={run} loading={loading} ran={!!report}>
      {report && (
        <div className="space-y-5 animate-fade-in-up">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-border">
            <div className="text-center flex-shrink-0">
              <div className="text-4xl font-display font-bold" style={{ color: scoreColor(report.overallScore) }}>{report.overallScore}</div>
              <div className="text-xs text-text-muted">Health Score</div>
            </div>
            <div>
              <p className="text-sm font-medium text-text-primary mb-1">{report.period}</p>
              <p className="text-sm text-text-secondary">{report.summary}</p>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: 'Applied', val: report.stats.applicationsThisWeek, color: '#3B82F6' },
              { label: 'Interviews', val: report.stats.interviewsThisWeek, color: '#A855F7' },
              { label: 'Offers', val: report.stats.offersThisWeek, color: '#10B981' },
              { label: 'Response %', val: `${report.stats.responseRate}%`, color: '#F59E0B' },
            ].map(s => (
              <div key={s.label} className="text-center p-3 rounded-xl bg-white/[0.02] border border-border">
                <div className="text-2xl font-display font-bold" style={{ color: s.color }}>{s.val}</div>
                <div className="text-[11px] text-text-muted mt-1">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-emerald-400 mb-2">✅ Strengths</p>
              <ul className="space-y-1">{report.strengths.map((s, i) => <li key={i} className="text-sm text-text-secondary">• {s}</li>)}</ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-amber-400 mb-2">⚠️ Weak Areas</p>
              <ul className="space-y-1">{report.weakAreas.map((s, i) => <li key={i} className="text-sm text-text-secondary">• {s}</li>)}</ul>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-accent-purple-light mb-2">💡 This Week's Suggestions</p>
            <ul className="space-y-1.5">{report.suggestions.map((s, i) => <li key={i} className="text-sm text-text-secondary flex gap-2"><span className="text-accent-purple-light">→</span>{s}</li>)}</ul>
          </div>
        </div>
      )}
    </AIPanelShell>
  )
}

// ─── 4. Resume Optimizer ──────────────────────────────────

export function ResumeOptimizerPanel() {
  const [targetRole, setTargetRole] = useState('')
  const [result, setResult] = useState<ResumeOptimization | null>(null)
  const [loading, setLoading] = useState(false)

  const run = async () => {
    if (!targetRole) { toast.error('Enter target role'); return }
    setLoading(true)
    try {
      const res = await api.post<{ data: ResumeOptimization }>('/api/ai/resume', { targetRole })
      setResult(res.data)
    } catch (e: any) { toast.error(e.message) }
    finally { setLoading(false) }
  }

  return (
    <AIPanelShell icon={FileText} title="Resume Optimizer" subtitle="AI-powered resume improvement suggestions"
      color="rgba(16,185,129,0.2)" onRun={run} loading={loading} ran={!!result}>
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1.5">Target Role</label>
          <input className="input-field" placeholder="e.g. Full Stack Developer" value={targetRole} onChange={e => setTargetRole(e.target.value)} />
        </div>
        {result && (
          <div className="space-y-4 animate-fade-in-up pt-4 border-t border-border">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-text-secondary">Overall Score</span>
                <span className="font-bold text-sm" style={{ color: result.overallScore >= 70 ? '#10B981' : '#F59E0B' }}>{result.overallScore}/100</span>
              </div>
              <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${result.overallScore}%`, background: result.overallScore >= 70 ? '#10B981' : '#F59E0B' }} />
              </div>
            </div>
            {result.sections.map(section => (
              <div key={section.name} className="p-3 rounded-xl bg-white/[0.02] border border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-text-primary">{section.name}</span>
                  <span className="text-sm font-bold" style={{ color: section.score >= 70 ? '#10B981' : '#F59E0B' }}>{section.score}%</span>
                </div>
                <ul className="space-y-1">{section.suggestions.map((s, i) => <li key={i} className="text-xs text-text-secondary flex gap-1.5"><span className="text-accent-purple-light">→</span>{s}</li>)}</ul>
              </div>
            ))}
            <div>
              <p className="text-xs font-semibold text-amber-400 mb-2">🔑 Keyword Gaps</p>
              <div className="flex flex-wrap gap-1.5">
                {result.keywordGaps.map(k => <span key={k} className="px-2 py-0.5 rounded-full text-[11px] bg-amber-500/10 text-amber-300 border border-amber-500/20">{k}</span>)}
              </div>
            </div>
          </div>
        )}
      </div>
    </AIPanelShell>
  )
}

// ─── 5. Follow-up Generator ───────────────────────────────

export function FollowUpPanel() {
  const [form, setForm] = useState({ company: '', role: '', days: '7', tone: 'professional' })
  const [result, setResult] = useState<FollowUpMessage | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const run = async () => {
    if (!form.company || !form.role) { toast.error('Company and role required'); return }
    setLoading(true)
    try {
      const res = await api.post<{ data: FollowUpMessage }>('/api/ai/followup', { ...form, daysSinceApplied: Number(form.days) })
      setResult(res.data)
    } catch (e: any) { toast.error(e.message) }
    finally { setLoading(false) }
  }

  const copyAll = () => {
    if (!result) return
    navigator.clipboard.writeText(`Subject: ${result.subject}\n\n${result.body}`)
    setCopied(true); setTimeout(() => setCopied(false), 2000)
    toast.success('Copied!')
  }

  return (
    <AIPanelShell icon={Mail} title="Follow-up Generator" subtitle="Professional follow-up emails in seconds"
      color="rgba(245,158,11,0.2)" onRun={run} loading={loading} ran={!!result}>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div><label className="block text-xs font-medium text-text-secondary mb-1.5">Company</label><input className="input-field" placeholder="Google" value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} /></div>
          <div><label className="block text-xs font-medium text-text-secondary mb-1.5">Role</label><input className="input-field" placeholder="Software Engineer" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} /></div>
          <div><label className="block text-xs font-medium text-text-secondary mb-1.5">Days Since Applied</label><input type="number" className="input-field" value={form.days} onChange={e => setForm(f => ({ ...f, days: e.target.value }))} /></div>
          <div><label className="block text-xs font-medium text-text-secondary mb-1.5">Tone</label>
            <select className="input-field" value={form.tone} onChange={e => setForm(f => ({ ...f, tone: e.target.value }))}>
              <option value="professional">Professional</option><option value="friendly">Friendly</option><option value="assertive">Assertive</option>
            </select>
          </div>
        </div>
        {result && (
          <div className="animate-fade-in-up pt-4 border-t border-border space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-text-secondary">Generated Message</p>
              <button onClick={copyAll} className="btn-ghost text-xs py-1 px-2 gap-1">{copied ? <><Check size={12} />Copied!</> : <><Copy size={12} />Copy All</>}</button>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-border space-y-3">
              <p className="text-sm"><span className="text-text-muted">Subject: </span><span className="text-text-primary font-medium">{result.subject}</span></p>
              <hr className="border-border" />
              <p className="text-sm text-text-secondary whitespace-pre-line leading-relaxed">{result.body}</p>
            </div>
          </div>
        )}
      </div>
    </AIPanelShell>
  )
}

// ─── 6. Interview Prep ────────────────────────────────────

export function InterviewPrepPanel() {
  const [form, setForm] = useState({ company: '', role: '' })
  const [result, setResult] = useState<InterviewPrep | null>(null)
  const [loading, setLoading] = useState(false)
  const [tab, setTab] = useState<'technical' | 'behavioral' | 'topics'>('technical')

  const run = async () => {
    if (!form.company || !form.role) { toast.error('Company and role required'); return }
    setLoading(true)
    try {
      const res = await api.post<{ data: InterviewPrep }>('/api/ai/interview', form)
      setResult(res.data)
    } catch (e: any) { toast.error(e.message) }
    finally { setLoading(false) }
  }

  const diffStyle = (d: string) => d === 'easy' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : d === 'medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'

  return (
    <AIPanelShell icon={BookOpen} title="Interview Prep" subtitle="Questions, topics & tips tailored to your role"
      color="rgba(244,63,94,0.2)" onRun={run} loading={loading} ran={!!result}>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div><label className="block text-xs font-medium text-text-secondary mb-1.5">Company</label><input className="input-field" placeholder="Meta" value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} /></div>
          <div><label className="block text-xs font-medium text-text-secondary mb-1.5">Role</label><input className="input-field" placeholder="Frontend Engineer" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} /></div>
        </div>
        {result && (
          <div className="animate-fade-in-up pt-4 border-t border-border space-y-4">
            <div className="flex gap-1 p-1 rounded-lg bg-white/5">
              {(['technical', 'behavioral', 'topics'] as const).map(t => (
                <button key={t} onClick={() => setTab(t)} className={cn('flex-1 py-1.5 text-xs font-medium rounded-md transition-all capitalize', tab === t ? 'bg-accent-purple text-white' : 'text-text-muted hover:text-text-primary')}>
                  {t === 'topics' ? '📚 Topics' : t === 'technical' ? '💻 Technical' : '🎯 Behavioral'}
                </button>
              ))}
            </div>
            {tab === 'technical' && <div className="space-y-3">{result.technicalQuestions.map((q, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-white/[0.02] border border-border">
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <p className="text-sm text-text-primary font-medium">{q.question}</p>
                  <span className={cn('text-[10px] px-2 py-0.5 rounded-full border flex-shrink-0', diffStyle(q.difficulty))}>{q.difficulty}</span>
                </div>
                {q.hint && <p className="text-xs text-text-muted italic">💡 {q.hint}</p>}
              </div>
            ))}</div>}
            {tab === 'behavioral' && <div className="space-y-3">{result.behavioralQuestions.map((q, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-white/[0.02] border border-border">
                <p className="text-sm text-text-primary font-medium mb-1">{q.question}</p>
                {q.hint && <p className="text-xs text-text-muted italic">💡 {q.hint}</p>}
              </div>
            ))}</div>}
            {tab === 'topics' && <div className="space-y-4">
              <div><p className="text-xs font-semibold text-text-secondary mb-2">📚 Topics to Revise</p><div className="flex flex-wrap gap-2">{result.topicsToRevise.map((t, i) => <span key={i} className="px-3 py-1 rounded-full text-xs bg-accent-purple/10 text-accent-purple-light border border-accent-purple/20">{t}</span>)}</div></div>
              <div><p className="text-xs font-semibold text-text-secondary mb-2">🏢 Company Insights</p><ul className="space-y-1.5">{result.companyInsights.map((s, i) => <li key={i} className="text-sm text-text-secondary flex gap-2"><span className="text-cyan-400">→</span>{s}</li>)}</ul></div>
              <div><p className="text-xs font-semibold text-text-secondary mb-2">💡 Tips & Advice</p><ul className="space-y-1.5">{result.tipsAndAdvice.map((s, i) => <li key={i} className="text-sm text-text-secondary flex gap-2"><span className="text-amber-400">→</span>{s}</li>)}</ul></div>
            </div>}
          </div>
        )}
      </div>
    </AIPanelShell>
  )
}
