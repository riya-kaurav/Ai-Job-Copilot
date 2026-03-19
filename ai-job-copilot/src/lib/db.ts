// ============================================================
// DATABASE CONNECTION — MongoDB via Mongoose
// Uses a cached connection to prevent multiple connections
// in Next.js development hot-reload cycles
// ============================================================

import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI!

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable in .env.local'
  )
}

/**
 * Global cache to preserve connection across hot-reloads in dev.
 * In production, each serverless function invocation may create
 * a new connection, which is handled by the pool.
 */
interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

// Extend NodeJS global type to include our cache
declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined
}

const cached: MongooseCache = global.mongooseCache ?? { conn: null, promise: null }

if (!global.mongooseCache) {
  global.mongooseCache = cached
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  // Return existing connection if available
  if (cached.conn) return cached.conn

  // Reuse pending connection promise (prevents duplicate connections)
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,    // Disable command buffering — fail fast
      maxPoolSize: 10,           // Connection pool for concurrent requests
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    }

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log('✅ MongoDB connected successfully')
        return mongoose
      })
      .catch((err) => {
        console.error('❌ MongoDB connection error:', err)
        cached.promise = null
        throw err
      })
  }

  cached.conn = await cached.promise
  return cached.conn
}

export default connectToDatabase
