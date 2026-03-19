'use client'
// ============================================================
// AI COPILOT PAGE — All AI features in one tabbed interface
// ============================================================

import { useState } from 'react'
import { Bot, Target, TrendingUp, FileText, Mail, BookOpen, Sparkles, Zap } from 'lucide-react'
import AppLayout from '@/components/layout/AppLayout'
import {
  MatchScorePanel, NextActionsPanel, WeeklyReportPanel,
  ResumeOptimizerPanel, FollowUpPanel, InterviewPrepPanel
} from '@/components/ai/AIPanels'
import { cn } from '@/utils'

const AI_FEATURES = [
  {
    id: 'match',
    label: 'Match Score',
    icon: Target,
    description: 'Analyze job fit',
    color: 'text-purple-400',
    bg: 'rgba(168,85,247,0.15)',
    component: MatchScorePanel,
  },
  {
    id: 'actions',
    label: 'Next Actions',
    icon: Zap,
    description: 'Your action plan',
    color: 'text-amber-400',
    bg: 'rgba(245,158,11,0.15)',
    component: NextActionsPanel,
    badge: 'Core',
  },
  {
    id: 'report',
    label: 'Weekly Report',
    icon: TrendingUp,
    description: 'Performance summary',
    color: 'text-blue-400',
    bg: 'rgba(59,130,246,0.15)',
    component: WeeklyReportPanel,
  },
  {
    id: 'resume',
    label: 'Resume AI',
    icon: FileText,
    description: 'Optimize your resume',
    color: 'text-emerald-400',
    bg: 'rgba(16,185,129,0.15)',
    component: ResumeOptimizerPanel,
  },
  {
    id: 'followup',
    label: 'Follow-up',
    icon: Mail,
    description: 'Draft messages',
    color: 'text-cyan-400',
    bg: 'rgba(6,182,212,0.15)',
    component: FollowUpPanel,
  },
  {
    id: 'interview',
    label: 'Interview Prep',
    icon: BookOpen,
    description: 'Practice questions',
    color: 'text-rose-400',
    bg: 'rgba(244,63,94,0.15)',
    component: InterviewPrepPanel,
  },
]

export default function AICopilotPage() {
  const [activeFeature, setActiveFeature] = useState('actions')
  const current = AI_FEATURES.find(f => f.id === activeFeature)!
  const ActivePanel = current.component

  return (
    <AppLayout
      title="AI Copilot"
      subtitle="Your intelligent job search assistant — powered by GPT-4o"
    >
      <div className="flex gap-6">
        {/* Feature selector sidebar */}
        <div className="w-64 flex-shrink-0 space-y-2">
          {/* Header */}
          <div className="glass-card p-4 mb-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(37,99,235,0.3))', boxShadow: '0 0 20px rgba(124,58,237,0.2)' }}>
                <Bot size={20} className="text-accent-purple-light" />
              </div>
              <div>
                <p className="font-display font-bold text-text-primary text-sm">AI Features</p>
                <p className="text-[11px] text-text-muted">6 intelligent tools</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-text-muted">
              <Sparkles size={11} className="text-accent-purple-light" />
              Powered by OpenAI GPT-4o
            </div>
          </div>

          {/* Feature list */}
          {AI_FEATURES.map(feature => {
            const Icon = feature.icon
            const isActive = activeFeature === feature.id
            return (
              <button key={feature.id} onClick={() => setActiveFeature(feature.id)}
                className={cn(
                  'w-full flex items-center gap-3 p-3.5 rounded-xl border transition-all duration-200 text-left group',
                  isActive
                    ? 'border-accent-purple/30 text-text-primary'
                    : 'border-transparent hover:border-border text-text-secondary hover:text-text-primary'
                )}
                style={isActive ? {
                  background: 'linear-gradient(135deg, rgba(124,58,237,0.12), rgba(37,99,235,0.08))',
                } : {
                  background: 'rgba(255,255,255,0.02)',
                }}
              >
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
                  style={{ background: isActive ? feature.bg : 'rgba(255,255,255,0.05)' }}>
                  <Icon size={16} className={isActive ? feature.color : 'text-text-muted'} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold truncate">{feature.label}</span>
                    {feature.badge && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-accent-purple/20 text-purple-300 border border-accent-purple/30">
                        {feature.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-text-muted truncate">{feature.description}</p>
                </div>
              </button>
            )
          })}
        </div>

        {/* Active panel */}
        <div className="flex-1 min-w-0">
          <div className="glass-card p-6">
            {/* Panel header */}
            <div className="flex items-center gap-4 mb-6 pb-5 border-b border-border">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{ background: current.bg, boxShadow: `0 0 20px ${current.bg}` }}>
                <current.icon size={20} className={current.color} />
              </div>
              <div>
                <h2 className="font-display font-bold text-text-primary text-lg">{current.label}</h2>
                <p className="text-sm text-text-secondary">{current.description}</p>
              </div>
            </div>

            {/* Panel content */}
            <ActivePanel />
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
