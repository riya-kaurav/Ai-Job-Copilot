// ============================================================
// CORE TYPE DEFINITIONS — AI Job Copilot
// Central type registry for the entire application
// ============================================================

// --- Job Application ---

export type JobStatus = 'Applied' | 'Interview' | 'Offer' | 'Rejected' | 'Wishlist'

export interface Job {
  _id: string
  userId: string
  company: string
  role: string
  status: JobStatus
  jobLink?: string
  notes?: string
  salary?: string
  location?: string
  jobDescription?: string
  dateApplied: string
  lastUpdated: string
  createdAt: string
  updatedAt: string
  // AI-generated fields
  matchScore?: number
  aiSuggestions?: string[]
  followUpDate?: string
}

export interface CreateJobInput {
  company: string
  role: string
  status: JobStatus
  jobLink?: string
  notes?: string
  salary?: string
  location?: string
  jobDescription?: string
  dateApplied: string
}

export interface UpdateJobInput extends Partial<CreateJobInput> {
  _id: string
}

// --- User ---

export interface User {
  _id: string
  name: string
  email: string
  avatar?: string
  resume?: string          // Resume text for AI analysis
  skills?: string[]        // User's skill set
  targetRoles?: string[]   // Desired job roles
  createdAt: string
  updatedAt: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface AuthUser extends User {
  tokens: AuthTokens
}

// --- Dashboard Stats ---

export interface DashboardStats {
  total: number
  applied: number
  interviews: number
  offers: number
  rejected: number
  wishlist: number
  responseRate: number         // % of applications that got a response
  interviewConversionRate: number  // % of interviews that became offers
  weeklyApplications: WeeklyData[]
  statusBreakdown: StatusData[]
  topCompanies: CompanyData[]
}

export interface WeeklyData {
  week: string
  applications: number
  interviews: number
  offers: number
}

export interface StatusData {
  name: JobStatus
  value: number
  color: string
}

export interface CompanyData {
  company: string
  count: number
}

// --- AI Copilot Types ---

// Smart Match Score response
export interface MatchAnalysis {
  matchScore: number           // 0-100 percentage
  matchedSkills: string[]      // Skills user has that match JD
  missingSkills: string[]      // Skills in JD but not in resume
  suggestions: string[]        // Actionable improvement tips
  summary: string              // Brief AI summary
}

// Next Best Action recommendation
export interface NextAction {
  id: string
  type: 'follow-up' | 'resume' | 'apply' | 'prepare' | 'network' | 'skill'
  priority: 'high' | 'medium' | 'low'
  title: string
  description: string
  jobId?: string               // Related job if action is job-specific
  company?: string
  deadline?: string
  actionUrl?: string
}

// Weekly AI Report
export interface WeeklyReport {
  period: string               // e.g., "March 11–17, 2025"
  generatedAt: string
  stats: {
    applicationsThisWeek: number
    interviewsThisWeek: number
    offersThisWeek: number
    responseRate: number
  }
  strengths: string[]
  weakAreas: string[]
  suggestions: string[]
  summary: string
  overallScore: number         // 0-100 job search health score
}

// Resume optimization suggestion
export interface ResumeOptimization {
  overallScore: number
  sections: {
    name: string
    score: number
    suggestions: string[]
  }[]
  keywordGaps: string[]
  formattingTips: string[]
  summary: string
}

// Follow-up message
export interface FollowUpMessage {
  subject: string
  body: string
  tone: 'professional' | 'friendly' | 'assertive'
}

// Interview prep
export interface InterviewPrep {
  technicalQuestions: InterviewQuestion[]
  behavioralQuestions: InterviewQuestion[]
  topicsToRevise: string[]
  companyInsights: string[]
  tipsAndAdvice: string[]
}

export interface InterviewQuestion {
  question: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
  hint?: string
}

// --- Kanban Board ---

export interface KanbanColumn {
  id: JobStatus
  title: string
  color: string
  jobs: Job[]
}

// --- API Response wrappers ---

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// --- Filter / Search ---

export interface JobFilters {
  status?: JobStatus | 'All'
  search?: string
  sortBy?: 'dateApplied' | 'company' | 'role' | 'updatedAt'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}
