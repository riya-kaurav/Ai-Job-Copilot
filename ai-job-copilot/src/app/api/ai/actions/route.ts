// ============================================================
// POST /api/ai/actions
// Generates personalized next best actions based on job data
// ============================================================

import { NextRequest } from 'next/server'
import connectToDatabase from '@/lib/db'
import Job from '@/models/Job'
import { withAuth, apiError, apiSuccess } from '@/lib/middleware'
import { TokenPayload } from '@/lib/auth'
import { generateNextActions } from '@/lib/openai'

export const POST = withAuth(async (req: NextRequest, user: TokenPayload) => {
  try {
    await connectToDatabase()

    const jobs = await Job.find({ userId: user.userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean()

    const total = jobs.length
    const interviews = jobs.filter(j => j.status === 'Interview').length
    const offers = jobs.filter(j => j.status === 'Offer').length
    const responded = jobs.filter(j => ['Interview', 'Offer', 'Rejected'].includes(j.status)).length
    const responseRate = total > 0 ? Math.round((responded / total) * 100) : 0

    const recentJobs = jobs.slice(0, 5).map(j => ({
      company: j.company,
      role: j.role,
      status: j.status,
      dateApplied: new Date(j.dateApplied).toISOString().split('T')[0],
    }))

    const actions = await generateNextActions(
      { total, interviews, offers, responseRate },
      recentJobs
    )

    return apiSuccess(actions)
  } catch (error) {
    console.error('[AI ACTIONS ERROR]', error)
    return apiError('Failed to generate actions.', 500)
  }
})
