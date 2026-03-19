'use client'
// ============================================================
// JOB FORM MODAL — Add / Edit a job application
// ============================================================

import { useState, useEffect } from 'react'
import { X, Briefcase, Link, FileText, DollarSign, MapPin, Calendar } from 'lucide-react'
import { Job, CreateJobInput, JobStatus } from '@/types'
import { JOB_STATUSES, cn } from '@/utils'
import toast from 'react-hot-toast'

interface JobFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateJobInput) => Promise<void>
  editJob?: Job | null
}

const EMPTY_FORM: CreateJobInput = {
  company: '',
  role: '',
  status: 'Applied',
  jobLink: '',
  notes: '',
  salary: '',
  location: '',
  jobDescription: '',
  dateApplied: new Date().toISOString().split('T')[0],
}

export default function JobFormModal({ isOpen, onClose, onSubmit, editJob }: JobFormModalProps) {
  const [form, setForm] = useState<CreateJobInput>(EMPTY_FORM)
  const [loading, setLoading] = useState(false)

  // Populate form when editing
  useEffect(() => {
    if (editJob) {
      setForm({
        company: editJob.company,
        role: editJob.role,
        status: editJob.status,
        jobLink: editJob.jobLink || '',
        notes: editJob.notes || '',
        salary: editJob.salary || '',
        location: editJob.location || '',
        jobDescription: editJob.jobDescription || '',
        dateApplied: new Date(editJob.dateApplied).toISOString().split('T')[0],
      })
    } else {
      setForm(EMPTY_FORM)
    }
  }, [editJob, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.company.trim() || !form.role.trim()) {
      toast.error('Company and role are required')
      return
    }
    setLoading(true)
    try {
      await onSubmit(form)
      onClose()
      toast.success(editJob ? 'Application updated!' : 'Application added!')
    } catch (err) {
      toast.error('Failed to save application')
    } finally {
      setLoading(false)
    }
  }

  const set = (key: keyof CreateJobInput, value: string) =>
    setForm(prev => ({ ...prev, [key]: value }))

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-2xl glass-card shadow-glow-purple animate-scale-in overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(124,58,237,0.15)' }}
            >
              <Briefcase size={18} className="text-accent-purple-light" />
            </div>
            <div>
              <h2 className="font-display font-bold text-text-primary">
                {editJob ? 'Edit Application' : 'Add Application'}
              </h2>
              <p className="text-xs text-text-muted mt-0.5">Track your job application journey</p>
            </div>
          </div>
          <button onClick={onClose} className="btn-ghost p-2">
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Company + Role */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">Company *</label>
              <input className="input-field" placeholder="e.g. Google" value={form.company}
                onChange={e => set('company', e.target.value)} required />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">Role *</label>
              <input className="input-field" placeholder="e.g. Software Engineer" value={form.role}
                onChange={e => set('role', e.target.value)} required />
            </div>
          </div>

          {/* Status + Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">Status</label>
              <select className="input-field" value={form.status}
                onChange={e => set('status', e.target.value as JobStatus)}>
                {JOB_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">
                <Calendar size={11} className="inline mr-1" />Date Applied
              </label>
              <input type="date" className="input-field" value={form.dateApplied}
                onChange={e => set('dateApplied', e.target.value)} />
            </div>
          </div>

          {/* Location + Salary */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">
                <MapPin size={11} className="inline mr-1" />Location
              </label>
              <input className="input-field" placeholder="e.g. Remote, NYC" value={form.location}
                onChange={e => set('location', e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">
                <DollarSign size={11} className="inline mr-1" />Salary
              </label>
              <input className="input-field" placeholder="e.g. $120k - $150k" value={form.salary}
                onChange={e => set('salary', e.target.value)} />
            </div>
          </div>

          {/* Job Link */}
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">
              <Link size={11} className="inline mr-1" />Job Posting URL
            </label>
            <input type="url" className="input-field" placeholder="https://..." value={form.jobLink}
              onChange={e => set('jobLink', e.target.value)} />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">Notes</label>
            <textarea className="input-field resize-none" rows={3}
              placeholder="Recruiter contact, key requirements, follow-up notes..."
              value={form.notes} onChange={e => set('notes', e.target.value)} />
          </div>

          {/* Job Description (for AI match) */}
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">
              <FileText size={11} className="inline mr-1" />Job Description
              <span className="text-text-muted ml-1">(optional — used for AI match score)</span>
            </label>
            <textarea className="input-field resize-none" rows={4}
              placeholder="Paste the full job description here for AI analysis..."
              value={form.jobDescription} onChange={e => set('jobDescription', e.target.value)} />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </span>
              ) : editJob ? 'Update Application' : 'Add Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
