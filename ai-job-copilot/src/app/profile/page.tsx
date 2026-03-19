'use client'
// ============================================================
// PROFILE PAGE — User settings, resume, skills
// ============================================================

import { useState, useEffect } from 'react'
import { User, FileText, Target, Save, Plus, X, Sparkles } from 'lucide-react'
import AppLayout from '@/components/layout/AppLayout'
import { useAuthStore } from '@/hooks/useAuth'
import { api } from '@/lib/api-client'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore()
  const [name, setName] = useState(user?.name || '')
  const [resume, setResume] = useState(user?.resume || '')
  const [skillInput, setSkillInput] = useState('')
  const [skills, setSkills] = useState<string[]>(user?.skills || [])
  const [targetInput, setTargetInput] = useState('')
  const [targetRoles, setTargetRoles] = useState<string[]>(user?.targetRoles || [])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      setName(user.name || '')
      setResume(user.resume || '')
      setSkills(user.skills || [])
      setTargetRoles(user.targetRoles || [])
    }
  }, [user])

  const addSkill = () => {
    const s = skillInput.trim()
    if (s && !skills.includes(s)) { setSkills(prev => [...prev, s]); setSkillInput('') }
  }

  const addRole = () => {
    const r = targetInput.trim()
    if (r && !targetRoles.includes(r)) { setTargetRoles(prev => [...prev, r]); setTargetInput('') }
  }

  const save = async () => {
    setLoading(true)
    try {
      const res = await api.put<{ data: typeof user }>('/api/auth/profile', { name, resume, skills, targetRoles })
      updateUser(res.data as any)
      toast.success('Profile saved!')
    } catch (e: any) { toast.error(e.message || 'Save failed') }
    finally { setLoading(false) }
  }

  return (
    <AppLayout
      title="Profile"
      subtitle="Manage your account and AI preferences"
      actions={
        <button onClick={save} className="btn-primary" disabled={loading}>
          {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={16} />}
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      }
    >
      <div className="max-w-3xl space-y-6 stagger-children">

        {/* Account Info */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'rgba(124,58,237,0.15)' }}>
              <User size={18} className="text-accent-purple-light" />
            </div>
            <h2 className="font-display font-semibold text-text-primary">Account Info</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">Full Name</label>
              <input className="input-field" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">Email</label>
              <input className="input-field opacity-60 cursor-not-allowed" value={user?.email || ''} disabled />
              <p className="text-xs text-text-muted mt-1">Email cannot be changed</p>
            </div>
          </div>
        </div>

        {/* Resume */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.15)' }}>
                <FileText size={18} className="text-emerald-400" />
              </div>
              <div>
                <h2 className="font-display font-semibold text-text-primary">Resume</h2>
                <p className="text-xs text-text-muted">Used by all AI features for analysis</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-text-muted">
              <Sparkles size={11} className="text-accent-purple-light" />
              AI reads this
            </div>
          </div>
          <textarea className="input-field resize-none font-mono text-xs leading-relaxed" rows={14}
            placeholder={`Paste your resume text here. This will be used by:
• Match Score — to compare against job descriptions
• Resume Optimizer — to suggest improvements  
• Interview Prep — to personalize questions

Example format:
WORK EXPERIENCE
Software Engineer | Google | 2022–Present
- Built scalable React applications...

SKILLS
React, TypeScript, Node.js, Python...`}
            value={resume} onChange={e => setResume(e.target.value)} />
          <p className="text-xs text-text-muted mt-2">{resume.length} characters</p>
        </div>

        {/* Skills */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'rgba(245,158,11,0.15)' }}>
              <Sparkles size={18} className="text-amber-400" />
            </div>
            <h2 className="font-display font-semibold text-text-primary">Your Skills</h2>
          </div>
          <div className="flex gap-2 mb-4">
            <input className="input-field flex-1" placeholder="Add a skill (e.g. React, Python, SQL)"
              value={skillInput} onChange={e => setSkillInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill() } }} />
            <button onClick={addSkill} className="btn-secondary px-4"><Plus size={16} /></button>
          </div>
          <div className="flex flex-wrap gap-2">
            {skills.map(s => (
              <span key={s} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-accent-purple/10 text-purple-300 border border-accent-purple/20">
                {s}
                <button onClick={() => setSkills(prev => prev.filter(x => x !== s))} className="hover:text-white transition-colors"><X size={11} /></button>
              </span>
            ))}
            {skills.length === 0 && <p className="text-xs text-text-muted">No skills added yet</p>}
          </div>
        </div>

        {/* Target Roles */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'rgba(6,182,212,0.15)' }}>
              <Target size={18} className="text-cyan-400" />
            </div>
            <h2 className="font-display font-semibold text-text-primary">Target Roles</h2>
          </div>
          <div className="flex gap-2 mb-4">
            <input className="input-field flex-1" placeholder="Add a role (e.g. Frontend Engineer, Product Manager)"
              value={targetInput} onChange={e => setTargetInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addRole() } }} />
            <button onClick={addRole} className="btn-secondary px-4"><Plus size={16} /></button>
          </div>
          <div className="flex flex-wrap gap-2">
            {targetRoles.map(r => (
              <span key={r} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                {r}
                <button onClick={() => setTargetRoles(prev => prev.filter(x => x !== r))} className="hover:text-white transition-colors"><X size={11} /></button>
              </span>
            ))}
            {targetRoles.length === 0 && <p className="text-xs text-text-muted">No target roles added yet</p>}
          </div>
        </div>

        {/* Save button (bottom) */}
        <div className="flex justify-end">
          <button onClick={save} className="btn-primary" disabled={loading}>
            {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={16} />}
            {loading ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>
      </div>
    </AppLayout>
  )
}
