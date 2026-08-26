#   AI Job Copilot

> **Your Intelligent Career OS** — An AI-powered job search assistant that tracks applications, analyzes job fit, and tells you exactly what to do next.



---

## 🎯 Project Overview

AI Job Copilot is a **full-stack SaaS application** that transforms job searching from a chaotic spreadsheet exercise into an intelligent, data-driven workflow. It combines a beautiful dark-mode UI with powerful AI features to give you a real edge in your job search.


---

## ✨ Features

### 🔐 Authentication System
- JWT-based auth with **access + refresh token** pattern
- Short-lived access tokens (15 min) + long-lived refresh tokens (7 days)
- Auto token refresh — seamless re-auth without re-login
- Protected routes with middleware guard

### 📊 Dashboard
- Real-time stats: total applications, interviews, offers, response rate
- **Area chart**: application trend over 8 weeks (Recharts)
- **Pie chart**: status breakdown visualization
- Recent applications quick-view

### 💼 Job Management
- Full CRUD — add, edit, delete job applications
- Fields: company, role, status, link, notes, salary, location, job description, date
- Advanced filtering by status + full-text search
- Responsive card grid layout

### 📌 Kanban Board
- **Drag-and-drop** pipeline view using `@dnd-kit`
- 4 columns: Applied → Interview → Offer → Rejected
- Drag a card to automatically update its status in the DB
- Touch-friendly for mobile use

### 🤖 AI Copilot (6 Features — Core USP)

| Feature | What it does |
|---|---|
| **Smart Match Score** | Analyzes resume vs job description. Returns match %, matched skills, missing skills, suggestions |
| **Next Best Actions** | AI studies your job search data and generates a prioritized action plan |
| **Weekly AI Report** | Generates a full performance summary: strengths, weak areas, suggestions, health score |
| **Resume Optimizer** | Scores each resume section, identifies keyword gaps, gives ATS improvement tips |
| **Follow-up Generator** | Writes professional follow-up emails in professional/friendly/assertive tone |
| **Interview Prep** | Generates technical + behavioral questions, study topics, company insights |

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 14 (App Router) + TypeScript |
| **Styling** | Tailwind CSS (custom premium design system) |
| **State** | Zustand (global store with persistence) |
| **Backend** | Next.js API Route Handlers |
| **Database** | MongoDB (Mongoose ODM) |
| **Auth** | JWT (jsonwebtoken + bcryptjs) |
| **AI** | Open Router Api |
| **Charts** | Recharts |
| **DnD** | @dnd-kit/core + @dnd-kit/sortable |
| **Fonts** | Syne (display) + DM Sans (body) + JetBrains Mono |
| **Toasts** | react-hot-toast |

---

## 🗂️ Project Architecture

```
src/
├── app/                        # Next.js App Router
│   ├── api/                    # API Route Handlers
│   │   ├── auth/
│   │   │   ├── login/route.ts  # POST /api/auth/login
│   │   │   ├── signup/route.ts # POST /api/auth/signup
│   │   │   ├── refresh/route.ts# POST /api/auth/refresh
│   │   │   └── profile/route.ts# GET/PUT /api/auth/profile
│   │   ├── jobs/
│   │   │   ├── route.ts        # GET (list) + POST (create)
│   │   │   ├── [id]/route.ts   # GET + PUT + DELETE by ID
│   │   │   └── stats/route.ts  # GET dashboard analytics
│   │   └── ai/
│   │       ├── match/route.ts  # POST — match score
│   │       ├── actions/route.ts# POST — next actions
│   │       ├── report/route.ts # POST — weekly report
│   │       ├── resume/route.ts # POST — resume optimizer
│   │       ├── followup/route.ts# POST — follow-up generator
│   │       └── interview/route.ts# POST — interview prep
│   ├── dashboard/page.tsx      # Stats + charts
│   ├── jobs/page.tsx           # Job list with filters
│   ├── kanban/page.tsx         # Drag-and-drop board
│   ├── ai-copilot/page.tsx     # All 6 AI features
│   ├── profile/page.tsx        # User settings
│   ├── login/page.tsx          # Auth pages
│   ├── signup/page.tsx
│   ├── layout.tsx              # Root layout + providers
│   └── globals.css             # Design system + animations
│
├── components/                 # Reusable UI components
│   ├── layout/
│   │   ├── Sidebar.tsx         # Main navigation
│   │   └── AppLayout.tsx       # Authenticated page wrapper
│   ├── dashboard/
│   │   └── StatCard.tsx        # Metric display card
│   ├── jobs/
│   │   ├── JobCard.tsx         # Job application card
│   │   └── JobFormModal.tsx    # Add/edit modal
│   ├── kanban/
│   │   └── KanbanBoard.tsx     # DnD board
│   └── ai/
│       └── AIPanels.tsx        # All 6 AI feature panels
│
├── hooks/                      # Zustand stores (state management)
│   ├── useAuth.ts              # Auth state + actions
│   └── useJobs.ts              # Jobs state + CRUD actions
│
├── lib/                        # Core utilities
│   ├── db.ts                   # MongoDB connection (cached)
│   ├── auth.ts                 # JWT sign/verify helpers
│   ├── middleware.ts           # withAuth() route guard
│   ├── openai.ts               # All AI feature functions
│   └── api-client.ts           # Frontend HTTP client (auto-refresh)
│
├── models/                     # Mongoose schemas
│   ├── User.ts                 # User model (with bcrypt hook)
│   └── Job.ts                  # Job application model
│
├── types/                      # TypeScript type definitions
│   └── index.ts                # All shared types
│
└── utils/                      # Shared utilities
    └── index.ts                # cn(), formatDate(), constants
```

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier works)
- OpenAI API key

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/ai-job-copilot.git
cd ai-job-copilot
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key-min-32-chars
JWT_REFRESH_SECRET=your-refresh-secret-min-32-chars
LLM_API_KEY=sk-proj-...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Start development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll be redirected to login.

### 5. Create an account
Navigate to `/signup`, create an account. No email verification required in development.

---

## 🔐 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `MONGODB_URI` | ✅ | MongoDB connection string |
| `JWT_SECRET` | ✅ | Secret for signing access tokens (min 32 chars) |
| `JWT_REFRESH_SECRET` | ✅ | Secret for refresh tokens (different from above) |
| `OPENAI_API_KEY` | ✅ | Your OpenAI API key (for all AI features) |
| `NEXT_PUBLIC_APP_URL` | ✅ | Your app's base URL |
| `JWT_ACCESS_EXPIRY` | ❌ | Access token expiry (default: `15m`) |
| `JWT_REFRESH_EXPIRY` | ❌ | Refresh token expiry (default: `7d`) |
| `AI_MODEL` | ❌ | AI model to use |

---

## 🤖 How AI Copilot Works

The AI layer (`src/lib/openai.ts`) uses **structured prompt engineering** to get reliable JSON from GPT-4o:

```
1. User triggers an AI feature (e.g., Match Score)
2. Frontend POSTs to /api/ai/match with job data
3. API route (protected by withAuth middleware) fetches user's resume from DB
4. openai.ts constructs a system + user prompt with strict JSON schema
5. GPT-4o returns structured JSON (match score, skills, suggestions)
6. API validates and returns to frontend
7. Frontend renders the AI results with rich UI
```

**Key design decisions:**
- System prompt defines the AI's role and instructs JSON-only output
- User prompt injects real data (resume, job description, stats)
- Responses parsed with a `parseJSON<T>()` helper that strips markdown fences
- Each feature has its own typed interface (e.g., `MatchAnalysis`, `NextAction`)
- All AI calls are wrapped in try/catch with user-friendly error messages

---

## 🎨 Design System

The UI is built on a **custom premium dark theme**:

- **Colors**: Deep black (#080B14) backgrounds, purple (#7C3AED) accent, blue (#2563EB) secondary
- **Typography**: Syne (display/headings) + DM Sans (body) — chosen for premium SaaS feel
- **Effects**: Glassmorphism cards, glow shadows, ambient background orbs, grid pattern
- **Animations**: Staggered fade-in-up, shimmer skeletons, hover lift, spin loaders
- **Components**: All in `globals.css` as `@layer components` — `glass-card`, `btn-primary`, `input-field`, `badge`, `nav-item`

---

## 📸 Pages Overview

| Page | Route | Description |
|---|---|---|
| Login | `/login` | JWT authentication |
| Signup | `/signup` | Account creation |
| Dashboard | `/dashboard` | Stats, charts, recent jobs |
| Applications | `/jobs` | Full list with search/filter |
| Kanban | `/kanban` | Drag-and-drop pipeline |
| AI Copilot | `/ai-copilot` | All 6 AI features |
| Profile | `/profile` | Resume, skills, target roles |

---

## 🔮 Future Improvements

- [ ] Email notifications for follow-up reminders
- [ ] Browser extension to auto-import jobs from LinkedIn/Indeed
- [ ] AI-generated cover letters
- [ ] Calendar integration for interview scheduling
- [ ] Team/referral features (share job leads with connections)
- [ ] Export to CSV / PDF report
- [ ] Dark/light mode toggle
- [ ] Mobile app (React Native)
- [ ] Job market analytics (trends by role/location)
- [ ] Integration with Glassdoor for salary data

---

## 🧠 What I Learned Building This

1. **JWT refresh token flow** — implementing secure silent token refresh without user interruption
2. **OpenAI structured outputs** — prompting for reliable JSON with type-safe parsing
3. **DnD-kit** — building accessible drag-and-drop that works on touch devices
4. **Mongoose connection caching** — preventing hot-reload from spawning too many DB connections
5. **Zustand with persistence** — persisting auth state across page refreshes without Redux complexity
6. **Next.js App Router patterns** — route handlers, server components, client components

---


<div align="center">
  <p>Built with ❤️ | AI Job Copilot</p>
  
