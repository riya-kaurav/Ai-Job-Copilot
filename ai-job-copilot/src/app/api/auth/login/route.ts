// ============================================================
// POST /api/auth/login
// Authenticates user and returns JWT access + refresh tokens
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/db'
import User from '@/models/User'
import { generateTokenPair } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase()

    const body = await req.json()
    const { email, password } = body

    // --- Validation ---
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required.' },
        { status: 400 }
      )
    }

    // --- Find user (explicitly select password which is excluded by default) ---
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password')
    if (!user) {
      // Use generic message to prevent email enumeration attacks
      return NextResponse.json(
        { success: false, error: 'Invalid email or password.' },
        { status: 401 }
      )
    }

    // --- Verify password ---
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password.' },
        { status: 401 }
      )
    }

    // --- Generate fresh token pair ---
    const tokens = generateTokenPair(user._id.toString(), user.email)

    // Update stored refresh token
    user.refreshToken = tokens.refreshToken
    await user.save({ validateBeforeSave: false })

    return NextResponse.json({
      success: true,
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          resume: user.resume,
          skills: user.skills,
          targetRoles: user.targetRoles,
        },
        ...tokens,
      },
    })
  } catch (error) {
    console.error('[LOGIN ERROR]', error)
    return NextResponse.json(
      { success: false, error: 'Login failed. Please try again.' },
      { status: 500 }
    )
  }
}
