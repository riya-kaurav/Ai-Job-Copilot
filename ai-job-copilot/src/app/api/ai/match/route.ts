// ============================================================
// POST /api/ai/match
// Analyzes resume vs job description — returns match score
// ============================================================

import { NextRequest } from 'next/server'
import connectToDatabase from '@/lib/db'
import User from '@/models/User'
import { withAuth, apiError, apiSuccess } from '@/lib/middleware'
import { TokenPayload } from '@/lib/auth'
import { analyzeJobMatch } from '@/lib/openai'

export const POST = withAuth(async (req: NextRequest, user: TokenPayload) => {
  try {
    const body = await req.json()
    const { jobDescription, jobRole, resume: bodyResume } = body

    if (!jobDescription || !jobRole) {
      return apiError('Job description and role are required.')
    }

    // Use provided resume or fetch user's stored resume
    let resume = bodyResume
    if (!resume) {
      await connectToDatabase()
      const dbUser = await User.findById(user.userId)
      resume = dbUser?.resume || ''
    }

    if (!resume) {
      return apiError('Please add your resume in Profile settings before using Match Score.')
    }

    const analysis = await analyzeJobMatch(jobDescription, resume, jobRole)
    return apiSuccess(analysis)
  } catch (error) {
    console.error('[AI MATCH ERROR]', error)
    return apiError('AI analysis failed. Please try again.', 500)
  }
})
