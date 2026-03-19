'use client'
// ============================================================
// KANBAN PAGE — Drag-and-drop pipeline view
// ============================================================

import { useEffect, useState } from 'react'
import { Plus, LayoutGrid, RefreshCw } from 'lucide-react'
import AppLayout from '@/components/layout/AppLayout'
import KanbanBoard from '@/components/kanban/KanbanBoard'
import JobFormModal from '@/components/jobs/JobFormModal'
import { useJobsStore } from '@/hooks/useJobs'
import { Job, JobStatus, CreateJobInput } from '@/types'
import toast from 'react-hot-toast'

export default function KanbanPage() {
  const { jobs, isLoading, fetchJobs, createJob, updateJobStatus } = useJobsStore()
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => { fetchJobs({ limit: 100 }) }, [])

  const handleStatusChange = async (jobId: string, newStatus: JobStatus) => {
    try {
      await updateJobStatus(jobId, newStatus)
      toast.success(`Moved to ${newStatus}`, { duration: 2000 })
    } catch { toast.error('Failed to update status') }
  }

  const handleCreate = async (data: CreateJobInput) => {
    await createJob(data)
    await fetchJobs({ limit: 100 })
    toast.success('Application added!')
  }

  return (
    <AppLayout
      title="Kanban Board"
      subtitle="Drag jobs between columns to update their status"
      actions={
        <div className="flex items-center gap-2">
          <button onClick={() => fetchJobs({ limit: 100 })} className="btn-ghost p-2.5">
            <RefreshCw size={16} />
          </button>
          <button onClick={() => setIsModalOpen(true)} className="btn-primary">
            <Plus size={16} /> Add Job
          </button>
        </div>
      }
    >
      {isLoading ? (
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="skeleton h-14 rounded-xl" />
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="skeleton h-24 rounded-xl" />
              ))}
            </div>
          ))}
        </div>
      ) : (
        <KanbanBoard jobs={jobs} onStatusChange={handleStatusChange} />
      )}

      <JobFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreate}
      />
    </AppLayout>
  )
}
