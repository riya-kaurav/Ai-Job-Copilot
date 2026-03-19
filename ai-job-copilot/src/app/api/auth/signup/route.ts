// ============================================================
// POST /api/auth/signup
// Creates a new user account and returns JWT tokens
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/db'
import User from '@/models/User'
import { generateTokenPair } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase()

    const body = await req.json()
    const { name, email, password } = body

    // --- Input Validation ---
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and password are required.' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 8 characters.' },
        { status: 400 }
      )
    }

    // --- Duplicate Check ---
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'An account with this email already exists.' },
        { status: 409 }
      )
    }

    // --- Create User (password hashed by pre-save hook) ---
    const user = await User.create({ name, email, password })

    // --- Generate JWT tokens ---
    const tokens = generateTokenPair(user._id.toString(), user.email)

    // Store refresh token (hashed ideally in production)
    user.refreshToken = tokens.refreshToken
    await user.save({ validateBeforeSave: false })

    return NextResponse.json(
      {
        success: true,
        data: {
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
          },
          ...tokens,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('[SIGNUP ERROR]', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create account. Please try again.' },
      { status: 500 }
    )
  }
}
