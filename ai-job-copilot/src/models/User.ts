// ============================================================
// USER MODEL — Mongoose Schema
// Stores user accounts with hashed passwords
// ============================================================

import mongoose, { Document, Schema, Model } from 'mongoose'
import bcrypt from 'bcryptjs'

export interface IUser extends Document {
  name: string
  email: string
  password: string
  avatar?: string
  resume?: string
  skills?: string[]
  targetRoles?: string[]
  refreshToken?: string
  createdAt: Date
  updatedAt: Date
  // Instance methods
  comparePassword(candidatePassword: string): Promise<boolean>
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, // Exclude from queries by default for security
    },
    avatar: {
      type: String,
      default: null,
    },
    resume: {
      type: String,    // Plain text resume content for AI analysis
      default: '',
    },
    skills: {
      type: [String],
      default: [],
    },
    targetRoles: {
      type: [String],
      default: [],
    },
    refreshToken: {
      type: String,
      select: false,   // Never expose refresh token in responses
    },
  },
  {
    timestamps: true,  // Auto-manage createdAt + updatedAt
  }
)

// --- PRE-SAVE HOOK: Hash password before storing ---
UserSchema.pre('save', async function (next) {
  // Only hash if password was modified
  if (!this.isModified('password')) return next()

  try {
    const salt = await bcrypt.genSalt(12)   // 12 rounds = good security/perf balance
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (err) {
    next(err as Error)
  }
})

// --- METHOD: Compare plaintext password against stored hash ---
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password)
}

// --- INDEX: Fast lookup by email (login) ---
UserSchema.index({ email: 1 })

// Prevent model redefinition during Next.js hot-reload
const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema)

export default User
