// ============================================================
// POST /api/ai/report — Generate AI weekly report
// ============================================================

import { NextRequest } from 'next/server'
import connectToDatabase from '@/lib/db'
import Job from '@/models/Job'
import { withAuth, apiError, apiSuccess } from '@/lib/middleware'
import { TokenPayload } from '@/lib/auth'
import { generateWeeklyReport } from '@/lib/openai'
import { subDays } from 'date-fns'

export const POST = withAuth(async (req: NextRequest, user: TokenPayload) => {
  try {
    await connectToDatabase()

    const allJobs = await Job.find({ userId: user.userId }).lean()
    const weekAgo = subDays(new Date(), 7)
    const weeklyJobs = allJobs.filter(j => new Date(j.dateApplied) >= weekAgo)

    const stats = {
      total: allJobs.length,
      applied: allJobs.filter(j => j.status === 'Applied').length,
      interviews: allJobs.filter(j => j.status === 'Interview').length,
      offers: allJobs.filter(j => j.status === 'Offer').length,
      rejected: allJobs.filter(j => j.status === 'Rejected').length,
      wishlist: allJobs.filter(j => j.status === 'Wishlist').length,
      responseRate: 0,
      interviewConversionRate: 0,
      weeklyApplications: [],
      statusBreakdown: [],
      topCompanies: [],
    }

    const report = await generateWeeklyReport(
      stats,
      weeklyJobs.map(j => ({ company: j.company, role: j.role, status: j.status }))
    )

    return apiSuccess(report)
  } catch (error) {
    console.error('[AI REPORT ERROR]', error)
    return apiError('Failed to generate report.', 500)
  }
})
