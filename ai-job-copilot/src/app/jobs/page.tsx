'use client'
// ============================================================
// JOBS PAGE — Full list view with search, filter, CRUD
// ============================================================

import { useEffect, useState } from 'react'
import { Plus, Search, SlidersHorizontal, Grid, List } from 'lucide-react'
import AppLayout from '@/components/layout/AppLayout'
import JobCard from '@/components/jobs/JobCard'
import JobFormModal from '@/components/jobs/JobFormModal'
import { useJobsStore } from '@/hooks/useJobs'
import { Job, CreateJobInput, JobStatus } from '@/types'
import { JOB_STATUSES, STATUS_COLORS, cn } from '@/utils'
import toast from 'react-hot-toast'

const ALL_STATUSES = ['All', ...JOB_STATUSES] as const

export default function JobsPage() {
  const { jobs, total, isLoading, filters, fetchJobs, createJob, updateJob, deleteJob, setFilters } = useJobsStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editJob, setEditJob] = useState<Job | null>(null)
  const [search, setSearch] = useState('')
  const [activeStatus, setActiveStatus] = useState<'All' | JobStatus>('All')

  // Fetch on mount and filter changes
  useEffect(() => { fetchJobs(filters) }, [filters])

  // Debounced search
  useEffect(() => {
    const t = setTimeout(() => {
      setFilters({ search, status: activeStatus })
      fetchJobs({ ...filters, search, status: activeStatus, page: 1 })
    }, 350)
    return () => clearTimeout(t)
  }, [search, activeStatus])

  const handleCreate = async (data: CreateJobInput) => {
    await createJob(data)
    fetchJobs(filters)
  }

  const handleUpdate = async (data: CreateJobInput) => {
    if (!editJob) return
    await updateJob({ _id: editJob._id, ...data })
    setEditJob(null)
  }

  const handleDelete = async (id: string) => {
    await deleteJob(id)
    toast.success('Job deleted')
  }

  const openEdit = (job: Job) => { setEditJob(job); setIsModalOpen(true) }
  const openAdd = () => { setEditJob(null); setIsModalOpen(true) }

  return (
    <AppLayout
      title="Applications"
      subtitle={`${total} total application${total !== 1 ? 's' : ''}`}
      actions={
        <button onClick={openAdd} className="btn-primary">
          <Plus size={16} /> Add Application
        </button>
      }
    >
      {/* Filters bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
          <input className="input-field pl-10" placeholder="Search companies, roles..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        {/* Status filter pills */}
        <div className="flex gap-1.5 flex-wrap">
          {ALL_STATUSES.map(status => {
            const isActive = activeStatus === status
            const colors = status !== 'All' ? STATUS_COLORS[status as JobStatus] : null
            return (
              <button key={status}
                onClick={() => setActiveStatus(status)}
                className={cn(
                  'px-3 py-2 rounded-lg text-xs font-semibold border transition-all duration-200',
                  isActive
                    ? status === 'All'
                      ? 'bg-accent-purple/20 text-white border-accent-purple/40'
                      : `${colors?.bg} ${colors?.text} ${colors?.border}`
                    : 'text-text-muted border-border hover:text-text-secondary hover:border-border-strong bg-transparent'
                )}
              >
                {status}
              </button>
            )
          })}
        </div>
      </div>

      {/* Job grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass-card p-5 space-y-3">
              <div className="skeleton h-4 w-3/4 rounded" />
              <div className="skeleton h-3 w-1/2 rounded" />
              <div className="skeleton h-3 w-full rounded" />
              <div className="skeleton h-3 w-2/3 rounded" />
            </div>
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
            style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)' }}>
            <Search size={32} className="text-accent-purple-light opacity-60" />
          </div>
          <h3 className="font-display font-semibold text-text-primary text-lg mb-2">
            {search || activeStatus !== 'All' ? 'No matching applications' : 'No applications yet'}
          </h3>
          <p className="text-text-secondary text-sm mb-6 max-w-sm">
            {search || activeStatus !== 'All'
              ? 'Try adjusting your search or filters'
              : 'Start tracking your job applications to unlock AI insights and analytics'}
          </p>
          {!search && activeStatus === 'All' && (
            <button onClick={openAdd} className="btn-primary">
              <Plus size={16} /> Add Your First Application
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 stagger-children">
          {jobs.map(job => (
            <JobCard key={job._id} job={job} onEdit={openEdit} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <JobFormModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditJob(null) }}
        onSubmit={editJob ? handleUpdate : handleCreate}
        editJob={editJob}
      />
    </AppLayout>
  )
}
