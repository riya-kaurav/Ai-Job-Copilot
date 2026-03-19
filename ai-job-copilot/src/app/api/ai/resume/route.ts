// POST /api/ai/resume
import { NextRequest } from 'next/server'
import connectToDatabase from '@/lib/db'
import User from '@/models/User'
import { withAuth, apiError, apiSuccess } from '@/lib/middleware'
import { TokenPayload } from '@/lib/auth'
import { optimizeResume } from '@/lib/openai'

export const POST = withAuth(async (req: NextRequest, user: TokenPayload) => {
  try {
    const { targetRole, resume: bodyResume } = await req.json()
    if (!targetRole) return apiError('Target role is required.')
    let resume = bodyResume
    if (!resume) {
      await connectToDatabase()
      const dbUser = await User.findById(user.userId)
      resume = dbUser?.resume || ''
    }
    if (!resume) return apiError('Please add your resume in Profile before using this feature.')
    const optimization = await optimizeResume(resume, targetRole)
    return apiSuccess(optimization)
  } catch (error) {
    return apiError('Failed to optimize resume.', 500)
  }
})
