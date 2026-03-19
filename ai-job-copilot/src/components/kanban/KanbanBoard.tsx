'use client'
// ============================================================
// KANBAN BOARD — Drag-and-drop job pipeline
// Uses @dnd-kit for accessible, touch-friendly DnD
// ============================================================

import { useState } from 'react'
import {
  DndContext, DragEndEvent, DragOverlay, DragStartEvent,
  PointerSensor, useSensor, useSensors, closestCorners,
} from '@dnd-kit/core'
import {
  SortableContext, verticalListSortingStrategy, useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Job, JobStatus } from '@/types'
import { KANBAN_COLUMNS, STATUS_COLORS, formatDate, cn } from '@/utils'
import { ExternalLink, GripVertical, Calendar } from 'lucide-react'

// --- Draggable Job Mini-Card ---
function KanbanCard({ job, isDragging = false }: { job: Job; isDragging?: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition, isSorting } = useSortable({
    id: job._id,
    data: { job, status: job.status },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1,
  }

  return (
    <div ref={setNodeRef} style={style}
      className={cn(
        'glass-card p-3.5 cursor-grab active:cursor-grabbing group select-none',
        isSorting && 'opacity-50'
      )}
    >
      <div className="flex items-start gap-2">
        <div {...attributes} {...listeners} className="mt-0.5 flex-shrink-0 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity cursor-grab">
          <GripVertical size={14} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="font-semibold text-sm text-text-primary truncate">{job.company}</span>
            {job.jobLink && (
              <a href={job.jobLink} target="_blank" rel="noopener noreferrer"
                className="text-text-muted hover:text-accent-blue-light flex-shrink-0"
                onClick={e => e.stopPropagation()}
              >
                <ExternalLink size={11} />
              </a>
            )}
          </div>
          <p className="text-xs text-text-secondary truncate">{job.role}</p>
          <div className="flex items-center gap-1 mt-2 text-[11px] text-text-muted">
            <Calendar size={10} />
            {formatDate(job.dateApplied)}
          </div>
        </div>
      </div>
    </div>
  )
}

// --- Droppable Column ---
function KanbanColumn({
  column, jobs, onStatusChange
}: {
  column: typeof KANBAN_COLUMNS[0]
  jobs: Job[]
  onStatusChange: (jobId: string, status: JobStatus) => void
}) {
  const jobIds = jobs.map(j => j._id)

  return (
    <div className="flex flex-col gap-3 min-w-0">
      {/* Column header */}
      <div className="glass-card px-4 py-3 border-t-2" style={{ borderTopColor: column.color.replace('border-t-', '') }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className={cn('font-display font-semibold text-sm', column.accent)}>
              {column.label}
            </h3>
          </div>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/5 text-text-muted">
            {jobs.length}
          </span>
        </div>
      </div>

      {/* Job cards */}
      <SortableContext items={jobIds} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-2 min-h-[200px]"
          style={{
            padding: '8px',
            background: 'rgba(255,255,255,0.01)',
            borderRadius: '12px',
            border: '1px dashed rgba(30,42,58,0.6)',
          }}
          data-column={column.id}
        >
          {jobs.length === 0 ? (
            <div className="flex items-center justify-center h-24 text-xs text-text-muted">
              Drop here
            </div>
          ) : (
            jobs.map(job => <KanbanCard key={job._id} job={job} />)
          )}
        </div>
      </SortableContext>
    </div>
  )
}

// --- Main Kanban Board ---
interface KanbanBoardProps {
  jobs: Job[]
  onStatusChange: (jobId: string, status: JobStatus) => Promise<void>
}

export default function KanbanBoard({ jobs, onStatusChange }: KanbanBoardProps) {
  const [activeJob, setActiveJob] = useState<Job | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  // Group jobs by status
  const jobsByStatus = KANBAN_COLUMNS.reduce((acc, col) => {
    acc[col.id] = jobs.filter(j => j.status === col.id)
    return acc
  }, {} as Record<JobStatus, Job[]>)

  const handleDragStart = (event: DragStartEvent) => {
    const job = jobs.find(j => j._id === event.active.id)
    if (job) setActiveJob(job)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveJob(null)
    const { active, over } = event
    if (!over) return

    // Find the target column from the over element's data
    const overData = over.data.current
    const targetStatus = overData?.job?.status || over.id as JobStatus

    const draggedJob = jobs.find(j => j._id === active.id)
    if (!draggedJob || draggedJob.status === targetStatus) return

    // Valid status?
    if (KANBAN_COLUMNS.find(c => c.id === targetStatus)) {
      await onStatusChange(draggedJob._id, targetStatus)
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${KANBAN_COLUMNS.length}, minmax(0, 1fr))` }}>
        {KANBAN_COLUMNS.map(column => (
          <KanbanColumn
            key={column.id}
            column={column}
            jobs={jobsByStatus[column.id] || []}
            onStatusChange={onStatusChange}
          />
        ))}
      </div>

      {/* Drag overlay — shows card while dragging */}
      <DragOverlay>
        {activeJob && (
          <div className="rotate-2 opacity-90">
            <KanbanCard job={activeJob} isDragging />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}
