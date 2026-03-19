// ============================================================
// /api/jobs/[id] — Single Job CRUD
// GET    — Fetch a specific job
// PUT    — Update a job application
// DELETE — Remove a job application
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/db'
import Job from '@/models/Job'
import { withAuth, apiError, apiSuccess } from '@/lib/middleware'
import { TokenPayload } from '@/lib/auth'

// --- GET /api/jobs/[id] ---
export const GET = withAuth(
  async (req: NextRequest, user: TokenPayload, context?: { params: Record<string, string> }) => {
    try {
      await connectToDatabase()
      const job = await Job.findOne({ _id: context?.params?.id, userId: user.userId })
      if (!job) return apiError('Job not found.', 404)
      return apiSuccess(job)
    } catch (error) {
      return apiError('Failed to fetch job.', 500)
    }
  }
)

// --- PUT /api/jobs/[id] ---
export const PUT = withAuth(
  async (req: NextRequest, user: TokenPayload, context?: { params: Record<string, string> }) => {
    try {
      await connectToDatabase()
      const body = await req.json()

      const job = await Job.findOneAndUpdate(
        { _id: context?.params?.id, userId: user.userId },
        { ...body, lastUpdated: new Date() },
        { new: true, runValidators: true }
      )

      if (!job) return apiError('Job not found.', 404)
      return apiSuccess(job)
    } catch (error) {
      console.error('[UPDATE JOB ERROR]', error)
      return apiError('Failed to update job.', 500)
    }
  }
)

// --- DELETE /api/jobs/[id] ---
export const DELETE = withAuth(
  async (req: NextRequest, user: TokenPayload, context?: { params: Record<string, string> }) => {
    try {
      await connectToDatabase()
      const job = await Job.findOneAndDelete({ _id: context?.params?.id, userId: user.userId })
      if (!job) return apiError('Job not found.', 404)
      return apiSuccess({ message: 'Job deleted successfully.' })
    } catch (error) {
      return apiError('Failed to delete job.', 500)
    }
  }
)
