// ============================================================
// JOB MODEL — Mongoose Schema
// Stores job applications with AI-generated insights
// ============================================================

import mongoose, { Document, Schema, Model, Types } from 'mongoose'
import { JobStatus } from '@/types'

export interface IJob extends Document {
  userId: Types.ObjectId
  company: string
  role: string
  status: JobStatus
  jobLink?: string
  notes?: string
  salary?: string
  location?: string
  jobDescription?: string
  dateApplied: Date
  lastUpdated: Date
  // AI-enhanced fields
  matchScore?: number
  aiSuggestions?: string[]
  followUpDate?: Date
  createdAt: Date
  updatedAt: Date
}

const JobSchema = new Schema<IJob>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,           // Fast queries by user
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      maxlength: [200, 'Company name cannot exceed 200 characters'],
    },
    role: {
      type: String,
      required: [true, 'Job role is required'],
      trim: true,
      maxlength: [200, 'Role cannot exceed 200 characters'],
    },
    status: {
      type: String,
      enum: ['Wishlist', 'Applied', 'Interview', 'Offer', 'Rejected'],
      default: 'Applied',
      required: true,
    },
    jobLink: {
      type: String,
      trim: true,
      maxlength: [2000, 'URL cannot exceed 2000 characters'],
    },
    notes: {
      type: String,
      maxlength: [5000, 'Notes cannot exceed 5000 characters'],
    },
    salary: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    jobDescription: {
      type: String,
      maxlength: [20000, 'Job description cannot exceed 20000 characters'],
    },
    dateApplied: {
      type: Date,
      default: Date.now,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
    // AI-generated fields
    matchScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    aiSuggestions: {
      type: [String],
      default: [],
    },
    followUpDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
)

// --- PRE-SAVE HOOK: Update lastUpdated on every save ---
JobSchema.pre('save', function (next) {
  if (!this.isNew) {
    this.lastUpdated = new Date()
  }
  next()
})

// --- COMPOUND INDEX: Fast user-specific queries with sorting ---
JobSchema.index({ userId: 1, createdAt: -1 })
JobSchema.index({ userId: 1, status: 1 })
JobSchema.index({ userId: 1, company: 'text', role: 'text' }) // Text search

const Job: Model<IJob> =
  mongoose.models.Job || mongoose.model<IJob>('Job', JobSchema)

export default Job
