// ============================================================
// JOBS STORE — Zustand state for job applications
// ============================================================

import { create } from 'zustand'
import { Job, CreateJobInput, UpdateJobInput, JobFilters, DashboardStats } from '@/types'
import { api } from '@/lib/api-client'

interface JobsState {
  jobs: Job[]
  stats: DashboardStats | null
  isLoading: boolean
  isStatsLoading: boolean
  filters: JobFilters
  total: number
  // Actions
  fetchJobs: (filters?: JobFilters) => Promise<void>
  fetchStats: () => Promise<void>
  createJob: (data: CreateJobInput) => Promise<Job>
  updateJob: (data: UpdateJobInput) => Promise<void>
  deleteJob: (id: string) => Promise<void>
  setFilters: (filters: Partial<JobFilters>) => void
  updateJobStatus: (id: string, status: Job['status']) => Promise<void>
}

export const useJobsStore = create<JobsState>((set, get) => ({
  jobs: [],
  stats: null,
  isLoading: false,
  isStatsLoading: false,
  total: 0,
  filters: {
    status: 'All',
    search: '',
    sortBy: 'dateApplied',
    sortOrder: 'desc',
    page: 1,
    limit: 20,
  },

  fetchJobs: async (overrideFilters?) => {
    set({ isLoading: true })
    try {
      const filters = overrideFilters || get().filters
      const params = new URLSearchParams()
      if (filters.status && filters.status !== 'All') params.set('status', filters.status)
      if (filters.search) params.set('search', filters.search)
      if (filters.sortBy) params.set('sortBy', filters.sortBy)
      if (filters.sortOrder) params.set('sortOrder', filters.sortOrder)
      if (filters.page) params.set('page', String(filters.page))
      if (filters.limit) params.set('limit', String(filters.limit))

      const res = await api.get<{ data: { jobs: Job[]; total: number } }>(
        `/api/jobs?${params.toString()}`
      )
      set({ jobs: res.data.jobs, total: res.data.total })
    } finally {
      set({ isLoading: false })
    }
  },

  fetchStats: async () => {
    set({ isStatsLoading: true })
    try {
      const res = await api.get<{ data: DashboardStats }>('/api/jobs/stats')
      set({ stats: res.data })
    } finally {
      set({ isStatsLoading: false })
    }
  },

  createJob: async (data) => {
    const res = await api.post<{ data: Job }>('/api/jobs', data)
    set(state => ({ jobs: [res.data, ...state.jobs], total: state.total + 1 }))
    return res.data
  },

  updateJob: async (data) => {
    const { _id, ...rest } = data
    const res = await api.put<{ data: Job }>(`/api/jobs/${_id}`, rest)
    set(state => ({
      jobs: state.jobs.map(j => (j._id === _id ? res.data : j)),
    }))
  },

  deleteJob: async (id) => {
    await api.delete(`/api/jobs/${id}`)
    set(state => ({
      jobs: state.jobs.filter(j => j._id !== id),
      total: state.total - 1,
    }))
  },

  updateJobStatus: async (id, status) => {
    await api.put(`/api/jobs/${id}`, { status })
    set(state => ({
      jobs: state.jobs.map(j => (j._id === id ? { ...j, status } : j)),
    }))
  },

  setFilters: (filters) => {
    set(state => ({ filters: { ...state.filters, ...filters } }))
  },
}))
