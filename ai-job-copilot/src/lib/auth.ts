// ============================================================
// JWT AUTHENTICATION UTILITIES
// Handles signing and verifying access + refresh tokens
// Access tokens: short-lived (15m) — for API authorization
// Refresh tokens: long-lived (7d) — to issue new access tokens
// ============================================================

import jwt from 'jsonwebtoken'

const ACCESS_SECRET = process.env.JWT_SECRET!
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!
const ACCESS_EXPIRY = process.env.JWT_ACCESS_EXPIRY || '15m'
const REFRESH_EXPIRY = process.env.JWT_REFRESH_EXPIRY || '7d'

export interface TokenPayload {
  userId: string
  email: string
  iat?: number
  exp?: number
}

/**
 * Generate a short-lived access token (15 minutes default).
 * Sent with every API request in Authorization header.
 */
export function generateAccessToken(payload: Omit<TokenPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, ACCESS_SECRET, {
    expiresIn: ACCESS_EXPIRY,
  } as jwt.SignOptions)
}

/**
 * Generate a long-lived refresh token (7 days default).
 * Stored in httpOnly cookie; used to get new access tokens.
 */
export function generateRefreshToken(payload: Omit<TokenPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, REFRESH_SECRET, {
    expiresIn: REFRESH_EXPIRY,
  } as jwt.SignOptions)
}

/**
 * Verify and decode an access token.
 * Throws if expired or invalid.
 */
export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, ACCESS_SECRET) as TokenPayload
}

/**
 * Verify and decode a refresh token.
 * Throws if expired or invalid.
 */
export function verifyRefreshToken(token: string): TokenPayload {
  return jwt.verify(token, REFRESH_SECRET) as TokenPayload
}

/**
 * Generate both tokens at once — used on login/signup.
 */
export function generateTokenPair(userId: string, email: string) {
  const payload = { userId, email }
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  }
}

/**
 * Extract bearer token from Authorization header.
 * Format: "Bearer <token>"
 */
export function extractBearerToken(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null
  return authHeader.split(' ')[1]
}
