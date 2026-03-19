// POST /api/ai/followup
import { NextRequest } from 'next/server'
import { withAuth, apiError, apiSuccess } from '@/lib/middleware'
import { TokenPayload } from '@/lib/auth'
import { generateFollowUp } from '@/lib/openai'

export const POST = withAuth(async (req: NextRequest, user: TokenPayload) => {
  try {
    const { company, role, daysSinceApplied, tone, recruiterName } = await req.json()
    if (!company || !role) return apiError('Company and role are required.')
    const message = await generateFollowUp(company, role, daysSinceApplied || 7, tone || 'professional', recruiterName)
    return apiSuccess(message)
  } catch (error) {
    return apiError('Failed to generate follow-up message.', 500)
  }
})
