// ============================================================
// GET /api/jobs/stats
// Computes dashboard analytics from the user's job data
// ============================================================

import { NextRequest } from 'next/server'
import connectToDatabase from '@/lib/db'
import Job from '@/models/Job'
import { withAuth, apiError, apiSuccess } from '@/lib/middleware'
import { TokenPayload } from '@/lib/auth'
import { subDays, startOfWeek, format } from 'date-fns'

export const GET = withAuth(async (req: NextRequest, user: TokenPayload) => {
  try {
    await connectToDatabase()

    // Fetch all user jobs (lean for performance)
    const jobs = await Job.find({ userId: user.userId }).lean()

    const total = jobs.length
    const applied = jobs.filter(j => j.status === 'Applied').length
    const interviews = jobs.filter(j => j.status === 'Interview').length
    const offers = jobs.filter(j => j.status === 'Offer').length
    const rejected = jobs.filter(j => j.status === 'Rejected').length
    const wishlist = jobs.filter(j => j.status === 'Wishlist').length

    // Response rate = (interviews + offers + rejected) / total applied
    const responded = interviews + offers + rejected
    const responseRate = total > 0 ? Math.round((responded / total) * 100) : 0

    // Interview conversion rate = offers / interviews
    const interviewConversionRate =
      interviews > 0 ? Math.round((offers / interviews) * 100) : 0

    // --- Weekly breakdown (last 8 weeks) ---
    const weeklyApplications = []
    for (let i = 7; i >= 0; i--) {
      const weekStart = startOfWeek(subDays(new Date(), i * 7))
      const weekEnd = startOfWeek(subDays(new Date(), (i - 1) * 7))
      const weekLabel = format(weekStart, 'MMM d')

      const weekJobs = jobs.filter(j => {
        const d = new Date(j.dateApplied)
        return d >= weekStart && d < weekEnd
      })

      weeklyApplications.push({
        week: weekLabel,
        applications: weekJobs.length,
        interviews: weekJobs.filter(j => j.status === 'Interview').length,
        offers: weekJobs.filter(j => j.status === 'Offer').length,
      })
    }

    // --- Status breakdown for pie chart ---
    const statusBreakdown = [
      { name: 'Applied',   value: applied,   color: '#3B82F6' },
      { name: 'Interview', value: interviews, color: '#A855F7' },
      { name: 'Offer',     value: offers,     color: '#10B981' },
      { name: 'Rejected',  value: rejected,   color: '#F43F5E' },
      { name: 'Wishlist',  value: wishlist,   color: '#64748B' },
    ].filter(s => s.value > 0)

    // --- Top companies (most applications) ---
    const companyCounts = jobs.reduce((acc, job) => {
      acc[job.company] = (acc[job.company] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const topCompanies = Object.entries(companyCounts)
      .map(([company, count]) => ({ company, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    return apiSuccess({
      total,
      applied,
      interviews,
      offers,
      rejected,
      wishlist,
      responseRate,
      interviewConversionRate,
      weeklyApplications,
      statusBreakdown,
      topCompanies,
    })
  } catch (error) {
    console.error('[STATS ERROR]', error)
    return apiError('Failed to compute stats.', 500)
  }
})
