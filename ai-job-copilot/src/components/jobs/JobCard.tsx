'use client'
// ============================================================
// JOB CARD — Individual job application card
// Shows job info, status badge, action buttons
// ============================================================

import { useState } from 'react'
import { ExternalLink, MoreHorizontal, Trash2, Edit, Bot, Calendar, MapPin, DollarSign } from 'lucide-react'
import { Job } from '@/types'
import { STATUS_COLORS, formatDate, timeAgo, cn } from '@/utils'
import toast from 'react-hot-toast'

interface JobCardProps {
  job: Job
  onEdit: (job: Job) => void
  onDelete: (id: string) => void
  onAIAnalyze?: (job: Job) => void
}

export default function JobCard({ job, onEdit, onDelete, onAIAnalyze }: JobCardProps) {
  const [showMenu, setShowMenu] = useState(false)
  const statusStyle = STATUS_COLORS[job.status]

  const handleDelete = async () => {
    setShowMenu(false)
    if (!confirm(`Delete ${job.company} — ${job.role}?`)) return
    onDelete(job._id)
    toast.success('Job deleted')
  }

  return (
    <div className="glass-card-hover p-5 group relative">
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          {/* Company with link */}
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-display font-semibold text-text-primary text-base truncate">
              {job.company}
            </h3>
            {job.jobLink && (
              <a href={job.jobLink} target="_blank" rel="noopener noreferrer"
                className="text-text-muted hover:text-accent-blue-light transition-colors flex-shrink-0"
                onClick={e => e.stopPropagation()}
              >
                <ExternalLink size={13} />
              </a>
            )}
          </div>
          {/* Role */}
          <p className="text-text-secondary text-sm truncate">{job.role}</p>
        </div>

        {/* Status badge + menu */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={cn('badge', statusStyle.bg, statusStyle.text, statusStyle.border)}>
            <span className={cn('w-1.5 h-1.5 rounded-full', statusStyle.dot)} />
            {job.status}
          </span>
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/5 transition-all opacity-0 group-hover:opacity-100"
            >
              <MoreHorizontal size={16} />
            </button>
            {showMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 top-8 z-20 w-44 glass-card py-1 shadow-card animate-scale-in">
                  <button
                    onClick={() => { setShowMenu(false); onEdit(job) }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
                  >
                    <Edit size={14} /> Edit Application
                  </button>
                  {onAIAnalyze && (
                    <button
                      onClick={() => { setShowMenu(false); onAIAnalyze(job) }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-text-secondary hover:text-accent-purple-light hover:bg-accent-purple/5 transition-colors"
                    >
                      <Bot size={14} /> AI Analysis
                    </button>
                  )}
                  <hr className="my-1 border-border" />
                  <button
                    onClick={handleDelete}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Meta info row */}
      <div className="flex flex-wrap items-center gap-3 text-xs text-text-muted mt-3">
        <span className="flex items-center gap-1">
          <Calendar size={11} />
          {formatDate(job.dateApplied)}
        </span>
        {job.location && (
          <span className="flex items-center gap-1">
            <MapPin size={11} />
            {job.location}
          </span>
        )}
        {job.salary && (
          <span className="flex items-center gap-1">
            <DollarSign size={11} />
            {job.salary}
          </span>
        )}
        <span className="ml-auto text-text-muted">{timeAgo(job.updatedAt || job.createdAt)}</span>
      </div>

      {/* Notes preview */}
      {job.notes && (
        <p className="mt-3 text-xs text-text-muted line-clamp-2 pt-3 border-t border-border/50">
          {job.notes}
        </p>
      )}

      {/* Match score if available */}
      {job.matchScore !== undefined && (
        <div className="mt-3 flex items-center gap-2 pt-3 border-t border-border/50">
          <Bot size={12} className="text-accent-purple-light" />
          <span className="text-xs text-text-muted">Match:</span>
          <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
            <div className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${job.matchScore}%`,
                background: job.matchScore >= 70 ? '#10B981' : job.matchScore >= 50 ? '#F59E0B' : '#F43F5E',
              }}
            />
          </div>
          <span className="text-xs font-semibold" style={{
            color: job.matchScore >= 70 ? '#10B981' : job.matchScore >= 50 ? '#F59E0B' : '#F43F5E'
          }}>
            {job.matchScore}%
          </span>
        </div>
      )}
    </div>
  )
}
