// ============================================================
// /api/jobs — Job Application CRUD
// GET  — List jobs with filters, search, pagination
// POST — Create a new job application
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/db'
import Job from '@/models/Job'
import { withAuth, apiError, apiSuccess } from '@/lib/middleware'
import { TokenPayload } from '@/lib/auth'
import { JobFilters } from '@/types'

// --- GET /api/jobs ---
export const GET = withAuth(async (req: NextRequest, user: TokenPayload) => {
  try {
    await connectToDatabase()

    // Parse query params
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status') || 'All'
    const search = searchParams.get('search') || ''
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    // --- Build MongoDB query ---
    const query: Record<string, unknown> = { userId: user.userId }

    // Filter by status if not 'All'
    if (status !== 'All') {
      query.status = status
    }

    // Full-text search across company and role
    if (search) {
      query.$or = [
        { company: { $regex: search, $options: 'i' } },
        { role: { $regex: search, $options: 'i' } },
        { notes: { $regex: search, $options: 'i' } },
      ]
    }

    // --- Execute query with pagination ---
    const skip = (page - 1) * limit
    const sortQuery: Record<string, 1 | -1> = {
      [sortBy]: sortOrder === 'asc' ? 1 : -1,
    }

    const [jobs, total] = await Promise.all([
      Job.find(query).sort(sortQuery).skip(skip).limit(limit).lean(),
      Job.countDocuments(query),
    ])

    return apiSuccess({
      jobs,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error('[GET JOBS ERROR]', error)
    return apiError('Failed to fetch jobs.', 500)
  }
})

// --- POST /api/jobs ---
export const POST = withAuth(async (req: NextRequest, user: TokenPayload) => {
  try {
    await connectToDatabase()

    const body = await req.json()
    const { company, role, status, jobLink, notes, salary, location, jobDescription, dateApplied } = body

    // Validation
    if (!company || !role) {
      return apiError('Company name and role are required.')
    }

    const job = await Job.create({
      userId: user.userId,
      company,
      role,
      status: status || 'Applied',
      jobLink,
      notes,
      salary,
      location,
      jobDescription,
      dateApplied: dateApplied ? new Date(dateApplied) : new Date(),
    })

    return apiSuccess(job, 201)
  } catch (error) {
    console.error('[CREATE JOB ERROR]', error)
    return apiError('Failed to create job application.', 500)
  }
})
