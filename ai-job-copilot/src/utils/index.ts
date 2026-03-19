// ============================================================
// UTILITY FUNCTIONS — Shared helpers
// ============================================================

import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { formatDistanceToNow, format, differenceInDays } from 'date-fns'
import { JobStatus } from '@/types'

/**
 * Merge Tailwind classes safely (resolves conflicts)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format date for display
 */
export function formatDate(date: string | Date): string {
  return format(new Date(date), 'MMM d, yyyy')
}

/**
 * Relative time (e.g., "3 days ago")
 */
export function timeAgo(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

/**
 * Days since a date
 */
export function daysSince(date: string | Date): number {
  return differenceInDays(new Date(), new Date(date))
}

/**
 * Status badge color mapping
 */
export const STATUS_COLORS: Record<JobStatus, { bg: string; text: string; border: string; dot: string }> = {
  Wishlist:  { bg: 'bg-slate-500/10',   text: 'text-slate-300',  border: 'border-slate-500/30',  dot: 'bg-slate-400' },
  Applied:   { bg: 'bg-blue-500/10',    text: 'text-blue-300',   border: 'border-blue-500/30',   dot: 'bg-blue-400'  },
  Interview: { bg: 'bg-purple-500/10',  text: 'text-purple-300', border: 'border-purple-500/30', dot: 'bg-purple-400'},
  Offer:     { bg: 'bg-emerald-500/10', text: 'text-emerald-300',border: 'border-emerald-500/30',dot: 'bg-emerald-400'},
  Rejected:  { bg: 'bg-rose-500/10',    text: 'text-rose-300',   border: 'border-rose-500/30',   dot: 'bg-rose-400'  },
}

/**
 * Kanban column config
 */
export const KANBAN_COLUMNS: Array<{ id: JobStatus; label: string; color: string; accent: string }> = [
  { id: 'Applied',   label: 'Applied',   color: 'border-t-blue-500',    accent: 'text-blue-400'    },
  { id: 'Interview', label: 'Interview', color: 'border-t-purple-500',  accent: 'text-purple-400'  },
  { id: 'Offer',     label: 'Offer',     color: 'border-t-emerald-500', accent: 'text-emerald-400' },
  { id: 'Rejected',  label: 'Rejected',  color: 'border-t-rose-500',    accent: 'text-rose-400'    },
]

/**
 * All available job statuses
 */
export const JOB_STATUSES: JobStatus[] = ['Wishlist', 'Applied', 'Interview', 'Offer', 'Rejected']

/**
 * Match score color thresholds
 */
export function getMatchScoreColor(score: number): string {
  if (score >= 80) return 'text-emerald-400'
  if (score >= 60) return 'text-yellow-400'
  if (score >= 40) return 'text-orange-400'
  return 'text-rose-400'
}

/**
 * Match score background for progress bar
 */
export function getMatchScoreBg(score: number): string {
  if (score >= 80) return 'bg-emerald-500'
  if (score >= 60) return 'bg-yellow-500'
  if (score >= 40) return 'bg-orange-500'
  return 'bg-rose-500'
}

/**
 * Priority badge styles
 */
export const PRIORITY_STYLES = {
  high:   { bg: 'bg-rose-500/10',   text: 'text-rose-300',   border: 'border-rose-500/30'   },
  medium: { bg: 'bg-amber-500/10',  text: 'text-amber-300',  border: 'border-amber-500/30'  },
  low:    { bg: 'bg-slate-500/10',  text: 'text-slate-300',  border: 'border-slate-500/30'  },
}

/**
 * Action type icons (returns Lucide icon name)
 */
export const ACTION_ICONS: Record<string, string> = {
  'follow-up': 'Mail',
  'resume':    'FileText',
  'apply':     'Send',
  'prepare':   'BookOpen',
  'network':   'Users',
  'skill':     'Zap',
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

/**
 * Calculate response rate from job data
 */
export function calculateResponseRate(total: number, responded: number): number {
  if (total === 0) return 0
  return Math.round((responded / total) * 100)
}
