// PUT /api/auth/profile — Update user profile
import { NextRequest } from 'next/server'
import connectToDatabase from '@/lib/db'
import User from '@/models/User'
import { withAuth, apiError, apiSuccess } from '@/lib/middleware'
import { TokenPayload } from '@/lib/auth'

export const GET = withAuth(async (req: NextRequest, user: TokenPayload) => {
  try {
    await connectToDatabase()
    const dbUser = await User.findById(user.userId)
    if (!dbUser) return apiError('User not found.', 404)
    return apiSuccess({ _id: dbUser._id, name: dbUser.name, email: dbUser.email, resume: dbUser.resume, skills: dbUser.skills, targetRoles: dbUser.targetRoles })
  } catch (error) {
    return apiError('Failed to fetch profile.', 500)
  }
})

export const PUT = withAuth(async (req: NextRequest, user: TokenPayload) => {
  try {
    await connectToDatabase()
    const { name, resume, skills, targetRoles } = await req.json()
    const updated = await User.findByIdAndUpdate(
      user.userId,
      { name, resume, skills, targetRoles },
      { new: true, runValidators: true }
    )
    if (!updated) return apiError('User not found.', 404)
    return apiSuccess({ _id: updated._id, name: updated.name, email: updated.email, resume: updated.resume, skills: updated.skills, targetRoles: updated.targetRoles })
  } catch (error) {
    return apiError('Failed to update profile.', 500)
  }
})
