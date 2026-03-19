// ============================================================
// POST /api/auth/refresh
// Issues a new access token using a valid refresh token
// This allows seamless re-auth without requiring re-login
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/db'
import User from '@/models/User'
import { verifyRefreshToken, generateAccessToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { refreshToken } = body

    if (!refreshToken) {
      return NextResponse.json(
        { success: false, error: 'Refresh token required.' },
        { status: 400 }
      )
    }

    // --- Verify the refresh token signature ---
    const decoded = verifyRefreshToken(refreshToken)

    // --- Validate token against stored value in DB ---
    // This allows token revocation (logout invalidates stored token)
    await connectToDatabase()
    const user = await User.findById(decoded.userId).select('+refreshToken')

    if (!user || user.refreshToken !== refreshToken) {
      return NextResponse.json(
        { success: false, error: 'Invalid refresh token. Please log in again.' },
        { status: 401 }
      )
    }

    // --- Issue new access token ---
    const newAccessToken = generateAccessToken({
      userId: user._id.toString(),
      email: user.email,
    })

    return NextResponse.json({
      success: true,
      data: { accessToken: newAccessToken },
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Invalid or expired refresh token.' },
      { status: 401 }
    )
  }
}
