// POST /api/ai/interview
import { NextRequest } from 'next/server'
import connectToDatabase from '@/lib/db'
import User from '@/models/User'
import { withAuth, apiError, apiSuccess } from '@/lib/middleware'
import { TokenPayload } from '@/lib/auth'
import { generateInterviewPrep } from '@/lib/openai'

export const POST = withAuth(async (req: NextRequest, user: TokenPayload) => {
  try {
    const { company, role, jobDescription } = await req.json()
    if (!company || !role) return apiError('Company and role are required.')
    await connectToDatabase()
    const dbUser = await User.findById(user.userId)
    const prep = await generateInterviewPrep(company, role, jobDescription, dbUser?.resume)
    return apiSuccess(prep)
  } catch (error) {
    return apiError('Failed to generate interview prep.', 500)
  }
})
