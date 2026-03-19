// ============================================================
// OPENAI SERVICE — AI Copilot Features
// All AI-powered analysis lives here.
// Uses GPT-4o with structured prompts for reliable JSON output.
// ============================================================

import OpenAI from 'openai'
import type {
  MatchAnalysis,
  NextAction,
  WeeklyReport,
  ResumeOptimization,
  FollowUpMessage,
  InterviewPrep,
  DashboardStats,
} from '@/types'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const MODEL = process.env.OPENAI_MODEL || 'gpt-4o'

// --- Helper: Parse JSON from AI response ---
function parseJSON<T>(text: string): T {
  // Strip markdown code fences if present
  const clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
  return JSON.parse(clean) as T
}

// --- Helper: Safe AI call with error handling ---
async function askAI(systemPrompt: string, userPrompt: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.7,
    max_tokens: 1500,
  })
  return response.choices[0]?.message?.content || ''
}

// ============================================================
// FEATURE 1: SMART MATCH SCORE
// Analyzes job description against user resume
// Returns percentage match, gaps, and suggestions
// ============================================================
export async function analyzeJobMatch(
  jobDescription: string,
  resume: string,
  jobRole: string
): Promise<MatchAnalysis> {
  const systemPrompt = `You are an expert technical recruiter and career coach. 
Analyze resume-job description compatibility and return ONLY valid JSON matching the exact schema provided.
Be specific, actionable, and honest in your analysis.`

  const userPrompt = `Analyze this job match and return ONLY JSON (no markdown, no explanation):

JOB ROLE: ${jobRole}

JOB DESCRIPTION:
${jobDescription}

RESUME/SKILLS:
${resume}

Return this exact JSON structure:
{
  "matchScore": <number 0-100>,
  "matchedSkills": ["skill1", "skill2"],
  "missingSkills": ["skill1", "skill2"],
  "suggestions": ["suggestion1", "suggestion2", "suggestion3"],
  "summary": "2-sentence summary of the match"
}`

  const response = await askAI(systemPrompt, userPrompt)
  return parseJSON<MatchAnalysis>(response)
}

// ============================================================
// FEATURE 2: NEXT BEST ACTION
// Analyzes user's job search activity and suggests
// the most impactful next steps
// ============================================================
export async function generateNextActions(
  stats: Partial<DashboardStats>,
  recentJobs: Array<{ company: string; role: string; status: string; dateApplied: string }>
): Promise<NextAction[]> {
  const systemPrompt = `You are a job search strategist and career coach AI.
Analyze job search data and generate prioritized, actionable next steps.
Return ONLY valid JSON. Be specific and realistic.`

  const userPrompt = `Based on this job search data, generate 4-6 personalized next actions. Return ONLY JSON:

STATS:
- Total applications: ${stats.total || 0}
- Interviews: ${stats.interviews || 0}
- Offers: ${stats.offers || 0}
- Response rate: ${stats.responseRate || 0}%

RECENT APPLICATIONS (last 5):
${JSON.stringify(recentJobs, null, 2)}

Return this exact JSON array:
[
  {
    "id": "action-1",
    "type": "follow-up|resume|apply|prepare|network|skill",
    "priority": "high|medium|low",
    "title": "Short action title",
    "description": "2-3 sentence explanation of why and how",
    "company": "Company name if job-specific (optional)",
    "deadline": "Relative deadline like 'Today' or 'This week' (optional)"
  }
]`

  const response = await askAI(systemPrompt, userPrompt)
  return parseJSON<NextAction[]>(response)
}

// ============================================================
// FEATURE 3: WEEKLY AI REPORT
// Summarizes job search performance for the week
// ============================================================
export async function generateWeeklyReport(
  stats: DashboardStats,
  weeklyJobs: Array<{ company: string; role: string; status: string }>
): Promise<WeeklyReport> {
  const systemPrompt = `You are a professional career analytics AI.
Generate insightful weekly job search reports. Be encouraging but honest.
Return ONLY valid JSON.`

  const userPrompt = `Generate a weekly job search report. Return ONLY JSON:

THIS WEEK'S DATA:
${JSON.stringify({ stats, weeklyJobs }, null, 2)}

Return this exact JSON:
{
  "period": "Week summary period",
  "generatedAt": "${new Date().toISOString()}",
  "stats": {
    "applicationsThisWeek": ${weeklyJobs.length},
    "interviewsThisWeek": ${weeklyJobs.filter(j => j.status === 'Interview').length},
    "offersThisWeek": ${weeklyJobs.filter(j => j.status === 'Offer').length},
    "responseRate": <calculated number>
  },
  "strengths": ["strength1", "strength2"],
  "weakAreas": ["area1", "area2"],
  "suggestions": ["suggestion1", "suggestion2", "suggestion3"],
  "summary": "3-4 sentence personalized summary",
  "overallScore": <number 0-100>
}`

  const response = await askAI(systemPrompt, userPrompt)
  return parseJSON<WeeklyReport>(response)
}

// ============================================================
// FEATURE 4: RESUME OPTIMIZATION
// Suggests resume improvements for a target role
// ============================================================
export async function optimizeResume(
  resume: string,
  targetRole: string
): Promise<ResumeOptimization> {
  const systemPrompt = `You are an expert resume writer and ATS optimization specialist.
Provide specific, actionable resume improvement suggestions.
Return ONLY valid JSON.`

  const userPrompt = `Analyze this resume for the role of "${targetRole}". Return ONLY JSON:

RESUME:
${resume}

Return this exact JSON:
{
  "overallScore": <number 0-100>,
  "sections": [
    { "name": "Summary/Objective", "score": <0-100>, "suggestions": ["tip1", "tip2"] },
    { "name": "Skills", "score": <0-100>, "suggestions": ["tip1", "tip2"] },
    { "name": "Experience", "score": <0-100>, "suggestions": ["tip1", "tip2"] },
    { "name": "Education", "score": <0-100>, "suggestions": ["tip1"] }
  ],
  "keywordGaps": ["keyword1", "keyword2", "keyword3"],
  "formattingTips": ["tip1", "tip2"],
  "summary": "2-3 sentence overall assessment"
}`

  const response = await askAI(systemPrompt, userPrompt)
  return parseJSON<ResumeOptimization>(response)
}

// ============================================================
// FEATURE 5: FOLLOW-UP MESSAGE GENERATOR
// Generates professional follow-up emails for applications
// ============================================================
export async function generateFollowUp(
  company: string,
  role: string,
  daysSinceApplied: number,
  tone: 'professional' | 'friendly' | 'assertive' = 'professional',
  recruiterName?: string
): Promise<FollowUpMessage> {
  const systemPrompt = `You are an expert job search communications specialist.
Write compelling, professional follow-up messages that get responses.
Return ONLY valid JSON.`

  const userPrompt = `Generate a follow-up message for this situation. Return ONLY JSON:

DETAILS:
- Company: ${company}
- Role: ${role}
- Days since applied: ${daysSinceApplied}
- Tone: ${tone}
- Recruiter name: ${recruiterName || 'unknown (use generic greeting)'}

Return this exact JSON:
{
  "subject": "Email subject line",
  "body": "Full email body with proper formatting",
  "tone": "${tone}"
}`

  const response = await askAI(systemPrompt, userPrompt)
  return parseJSON<FollowUpMessage>(response)
}

// ============================================================
// FEATURE 6: INTERVIEW PREPARATION
// Generates likely interview questions and study topics
// ============================================================
export async function generateInterviewPrep(
  company: string,
  role: string,
  jobDescription?: string,
  resume?: string
): Promise<InterviewPrep> {
  const systemPrompt = `You are a senior technical interviewer and career coach.
Generate realistic, targeted interview preparation materials.
Return ONLY valid JSON.`

  const userPrompt = `Generate interview prep for this position. Return ONLY JSON:

POSITION: ${role} at ${company}
JOB DESCRIPTION: ${jobDescription || 'Not provided'}
CANDIDATE BACKGROUND: ${resume || 'Not provided'}

Return this exact JSON:
{
  "technicalQuestions": [
    { "question": "...", "category": "...", "difficulty": "easy|medium|hard", "hint": "Brief hint" }
  ],
  "behavioralQuestions": [
    { "question": "...", "category": "STAR", "difficulty": "medium", "hint": "..." }
  ],
  "topicsToRevise": ["topic1", "topic2", "topic3", "topic4"],
  "companyInsights": ["insight1", "insight2"],
  "tipsAndAdvice": ["tip1", "tip2", "tip3"]
}
Generate 5 technical, 4 behavioral questions, 5 topics, 3 insights, 3 tips.`

  const response = await askAI(systemPrompt, userPrompt)
  return parseJSON<InterviewPrep>(response)
}
