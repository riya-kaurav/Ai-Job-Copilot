// ============================================================
// SEED SCRIPT — Populate DB with realistic job applications
// Run: node scripts/seed.js
// Make sure your .env.local is configured first
// ============================================================

const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
require('dotenv').config({ path: '.env.local' })

const MONGODB_URI = process.env.MONGODB_URI

// ---- Schemas (inline so we don't need TS compilation) ----

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  resume: String,
  skills: [String],
  targetRoles: [String],
  refreshToken: String,
}, { timestamps: true })

const JobSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  company: String,
  role: String,
  status: String,
  jobLink: String,
  notes: String,
  salary: String,
  location: String,
  jobDescription: String,
  dateApplied: Date,
  lastUpdated: Date,
  matchScore: Number,
  aiSuggestions: [String],
}, { timestamps: true })

const User = mongoose.models.User || mongoose.model('User', UserSchema)
const Job = mongoose.models.Job || mongoose.model('Job', JobSchema)

// ---- Realistic Job Data ----

const JOBS = [
  {
    company: 'Google',
    role: 'Senior Frontend Engineer',
    status: 'Interview',
    jobLink: 'https://careers.google.com',
    salary: '$180k - $240k',
    location: 'Mountain View, CA (Hybrid)',
    notes: 'Had first round with Priya from recruiting. Very positive. System design round scheduled for next week. Focus on scalability and React performance.',
    dateApplied: daysAgo(3),
    matchScore: 82,
    aiSuggestions: ['Brush up on system design patterns', 'Review Google\'s engineering blog', 'Prepare STAR stories for leadership principles'],
    jobDescription: `We are looking for a Senior Frontend Engineer to join our Google Search team. You will build user interfaces used by billions of people.

Requirements:
- 5+ years of experience with modern JavaScript frameworks
- Deep expertise in React, TypeScript, and performance optimization
- Experience with large-scale distributed systems
- Strong understanding of web accessibility and Core Web Vitals
- BS/MS in Computer Science or equivalent

Responsibilities:
- Lead frontend architecture decisions for Google Search features
- Mentor junior engineers and conduct code reviews
- Collaborate with product, design, and backend teams`
  },
  {
    company: 'Stripe',
    role: 'Full Stack Engineer',
    status: 'Applied',
    jobLink: 'https://stripe.com/jobs',
    salary: '$160k - $210k',
    location: 'San Francisco, CA (Remote OK)',
    notes: 'Applied through referral from ex-colleague Rahul. He works on the Payments team. Strong referral, should hear back within 2 weeks.',
    dateApplied: daysAgo(6),
    matchScore: 76,
    aiSuggestions: ['Learn more about payment processing fundamentals', 'Study Stripe\'s API documentation', 'Highlight any fintech experience'],
    jobDescription: `Stripe is looking for a Full Stack Engineer to help build the financial infrastructure of the internet.

Requirements:
- 3+ years building production web applications
- Proficiency in Ruby, Go, or Node.js on the backend
- React or similar framework on the frontend
- Experience with RESTful APIs and webhooks
- Passion for developer experience

You'll work on: Dashboard features, API tooling, internal platform tools`
  },
  {
    company: 'Notion',
    role: 'Software Engineer — Editor',
    status: 'Offer',
    jobLink: 'https://notion.so/careers',
    salary: '$155k - $195k',
    location: 'Remote (US)',
    notes: '🎉 OFFER RECEIVED! $175k base + $40k equity/year. Deadline to accept: Dec 15. Comparing with Google interview outcome. Benefits include $3k learning stipend.',
    dateApplied: daysAgo(21),
    matchScore: 91,
    aiSuggestions: ['Negotiate equity vesting cliff', 'Compare total comp with Google offer', 'Ask about team growth plans'],
    jobDescription: `Join Notion's Editor team to build the core editing experience used by 30M+ users.

We're looking for engineers who are passionate about:
- Rich text editing and collaborative tools
- Performance at scale
- Delightful user experiences

Stack: TypeScript, React, Node.js, PostgreSQL`
  },
  {
    company: 'Vercel',
    role: 'Developer Experience Engineer',
    status: 'Interview',
    jobLink: 'https://vercel.com/careers',
    salary: '$140k - $180k',
    location: 'Remote (Worldwide)',
    notes: 'Take-home assignment submitted. Built a mini Next.js deployment dashboard. Waiting for feedback. Interview with Guillermo\'s team next Thursday.',
    dateApplied: daysAgo(9),
    matchScore: 88,
    aiSuggestions: ['Deep dive into Next.js internals', 'Prepare demo of take-home project', 'Review edge runtime and serverless concepts'],
  },
  {
    company: 'Linear',
    role: 'Product Engineer',
    status: 'Applied',
    jobLink: 'https://linear.app/careers',
    salary: '$130k - $170k',
    location: 'Remote',
    notes: 'Dream company. Love their product philosophy. Applied cold but have a strong portfolio. They value craft and speed.',
    dateApplied: daysAgo(2),
    matchScore: 79,
  },
  {
    company: 'Figma',
    role: 'Frontend Engineer — Plugins',
    status: 'Rejected',
    jobLink: 'https://figma.com/careers',
    salary: '$150k - $200k',
    location: 'San Francisco, CA',
    notes: 'Got to final round (4/5 stages). Rejected after last interview — feedback was "strong candidate but looking for more canvas/rendering experience". Good learning experience.',
    dateApplied: daysAgo(30),
    matchScore: 68,
    aiSuggestions: ['Learn WebGL and canvas rendering', 'Build a browser-based drawing tool for portfolio', 'Re-apply in 6 months with rendering experience'],
  },
  {
    company: 'Shopify',
    role: 'Senior React Developer',
    status: 'Applied',
    jobLink: 'https://shopify.com/careers',
    salary: '$145k - $185k',
    location: 'Remote (Canada/US)',
    notes: 'Polaris design system is fascinating. Would love to work on merchant-facing tools. Applied through their careers portal.',
    dateApplied: daysAgo(1),
  },
  {
    company: 'Anthropic',
    role: 'Software Engineer — Product',
    status: 'Applied',
    jobLink: 'https://anthropic.com/careers',
    salary: '$170k - $230k',
    location: 'San Francisco, CA',
    notes: 'Extremely excited about this one. Working on Claude would be incredible. Tailored resume heavily for this application.',
    dateApplied: daysAgo(4),
    matchScore: 72,
  },
  {
    company: 'Raycast',
    role: 'Frontend Engineer',
    status: 'Interview',
    jobLink: 'https://raycast.com/jobs',
    salary: '$120k - $160k',
    location: 'Remote (Europe/US)',
    notes: 'First round done — great culture fit. They build incredibly fast. Thomas (CTO) mentioned they loved my open source contributions.',
    dateApplied: daysAgo(14),
    matchScore: 85,
  },
  {
    company: 'PlanetScale',
    role: 'Developer Advocate Engineer',
    status: 'Rejected',
    jobLink: 'https://planetscale.com/careers',
    salary: '$130k - $160k',
    location: 'Remote',
    notes: 'Rejected at resume screen. Need more public speaking / content creation experience. Will write more technical blogs this quarter.',
    dateApplied: daysAgo(18),
  },
  {
    company: 'Resend',
    role: 'Founding Engineer',
    status: 'Applied',
    jobLink: 'https://resend.com/careers',
    salary: '$120k - $150k + equity',
    location: 'Remote',
    notes: 'Early stage startup. High risk, high reward. Equity could be significant. Reached out to founder Zeno on Twitter first.',
    dateApplied: daysAgo(5),
  },
  {
    company: 'GitHub',
    role: 'Staff Engineer — Copilot',
    status: 'Applied',
    jobLink: 'https://github.com/about/careers',
    salary: '$190k - $260k',
    location: 'Remote (US)',
    notes: 'Staff level might be a stretch but worth applying. Highlighted all AI/ML adjacent work in resume.',
    dateApplied: daysAgo(7),
    matchScore: 65,
  },
]

function daysAgo(days) {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d
}

// ---- Main Seed Function ----

async function seed() {
  try {
    console.log('🔌 Connecting to MongoDB...')
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected!\n')

    // Check if demo user already exists
    let user = await User.findOne({ email: 'demo@aijobcopilot.com' })

    if (user) {
      console.log('👤 Demo user already exists, using existing account')
    } else {
      console.log('👤 Creating demo user...')
      const salt = await bcrypt.genSalt(12)
      const hashedPassword = await bcrypt.hash('Demo1234!', salt)

      user = await User.create({
        name: 'Riya Kaurav',
        email: 'demo@aijobcopilot.com',
        password: hashedPassword,
        resume: `RIYA KAURAV
Senior Frontend Engineer
riya@email.com | LinkedIn: linkedin.com/in/alexj | GitHub: github.com/alexj

SUMMARY
Senior Frontend Engineer with 5+ years of experience building scalable web applications. 
Specialized in React, TypeScript, and modern JavaScript. Led frontend teams at two startups.

EXPERIENCE

Senior Frontend Engineer | TechCorp Inc. | 2022 – Present
- Led migration of monolithic frontend to micro-frontend architecture (React, Module Federation)
- Improved Core Web Vitals scores by 40% through performance optimization
- Mentored team of 4 junior engineers
- Built real-time collaboration features using WebSockets

Frontend Engineer | StartupXYZ | 2020 – 2022  
- Built customer dashboard from scratch using React + TypeScript
- Implemented design system with 50+ reusable components
- Reduced bundle size by 35% through code splitting and lazy loading

Junior Developer | Agency Co. | 2019 – 2020
- Developed responsive websites for 20+ clients
- Worked with React, Vue.js, and vanilla JavaScript

SKILLS
Languages: TypeScript, JavaScript, HTML, CSS, Python
Frameworks: React, Next.js, Vue.js, Node.js, Express
Tools: Git, Docker, AWS, Figma, Jest, Cypress
Databases: PostgreSQL, MongoDB, Redis

EDUCATION
B.S. Computer Science | State University | 2019

PROJECTS
- Open source React component library (2.1k GitHub stars)
- Built and sold a SaaS app for $40k`,
        skills: ['React', 'TypeScript', 'Next.js', 'Node.js', 'JavaScript', 'CSS', 'PostgreSQL', 'MongoDB', 'Docker', 'AWS', 'Git', 'GraphQL'],
        targetRoles: ['Senior Frontend Engineer', 'Full Stack Engineer', 'Staff Engineer', 'Engineering Lead'],
      })
      console.log('✅ Demo user created: demo@aijobcopilot.com / Demo1234!\n')
    }

    // Clear existing jobs for this user
    const deleted = await Job.deleteMany({ userId: user._id })
    if (deleted.deletedCount > 0) {
      console.log(`🗑️  Cleared ${deleted.deletedCount} existing jobs\n`)
    }

    // Insert all jobs
    console.log('💼 Seeding job applications...')
    const jobsWithUser = JOBS.map(job => ({
      ...job,
      userId: user._id,
      lastUpdated: job.dateApplied,
    }))

    const inserted = await Job.insertMany(jobsWithUser)
    console.log(`✅ Inserted ${inserted.length} job applications\n`)

    // Summary
    const byStatus = JOBS.reduce((acc, j) => {
      acc[j.status] = (acc[j.status] || 0) + 1
      return acc
    }, {})

    console.log('📊 Summary:')
    Object.entries(byStatus).forEach(([status, count]) => {
      const emoji = { Applied: '📤', Interview: '🎤', Offer: '🎉', Rejected: '❌' }[status] || '•'
      console.log(`   ${emoji} ${status}: ${count}`)
    })

    console.log('\n🚀 Seed complete! Login with:')
    console.log('   Email:    demo@aijobcopilot.com')
    console.log('   Password: Demo1234!\n')

  } catch (err) {
    console.error('❌ Seed failed:', err.message)
  } finally {
    await mongoose.disconnect()
    console.log('🔌 Disconnected from MongoDB')
  }
}

seed()
