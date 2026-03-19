// ============================================================
// API MIDDLEWARE — Request authentication guard
// Verifies JWT on protected route handlers
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import { verifyAccessToken, extractBearerToken, TokenPayload } from './auth'

export interface AuthenticatedRequest extends NextRequest {
  user?: TokenPayload
}

/**
 * Higher-order function that wraps a route handler with JWT auth.
 * Usage: export const GET = withAuth(async (req, context) => { ... })
 */
export function withAuth(
  handler: (req: NextRequest, user: TokenPayload, context?: { params: Record<string, string> }) => Promise<NextResponse>
) {
  return async (req: NextRequest, context?: { params: Record<string, string> }) => {
    try {
      const authHeader = req.headers.get('authorization')
      const token = extractBearerToken(authHeader)

      if (!token) {
        return NextResponse.json(
          { success: false, error: 'Authentication required. Please log in.' },
          { status: 401 }
        )
      }

      const user = verifyAccessToken(token)
      return handler(req, user, context)

    } catch (error) {
      // Token is expired or malformed
      return NextResponse.json(
        { success: false, error: 'Invalid or expired token. Please log in again.' },
        { status: 401 }
      )
    }
  }
}

/**
 * Helper to create standardized API error responses
 */
export function apiError(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status })
}

/**
 * Helper to create standardized API success responses
 */
export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status })
}
