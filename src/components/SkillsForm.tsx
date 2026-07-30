import { useState } from 'react'
import { Plus, X, Sparkles, Loader2 } from 'lucide-react'
import { Skill } from '../types/portfolio'

interface SkillsFormProps {
  skills: Skill[]
  onChange: (skills: Skill[]) => void
  title?: string
  bio?: string
}

export default function SkillsForm({ skills, onChange, title = '', bio = '' }: SkillsFormProps) {
  const [newSkill, setNewSkill] = useState({ name: '', level: 'Intermediate' as Skill['level'], category: '' })
  const [isSuggesting, setIsSuggesting] = useState(false)
  const [error, setError] = useState('')

  const addSkill = () => {
    if (newSkill.name && newSkill.category) {
      onChange([
        ...skills,
        { ...newSkill, id: `skill-${Date.now()}` },
      ])
      setNewSkill({ name: '', level: 'Intermediate', category: '' })
    }
  }

  const removeSkill = (id: string) => {
    onChange(skills.filter((skill) => skill.id !== id))
  }

  const handleSuggestSkills = async () => {
    if (!title) {
      setError('Please fill in your Personal Information (title and bio) first.')
      return
    }

    const token = localStorage.getItem('sb-access-token')
    if (!token) {
      setError('Please log in to use AI suggestions')
      return
    }

    setIsSuggesting(true)
    setError('')

    try {
      const response = await fetch('http://localhost:3001/ai/skills-suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: title, bio }),
      })

      const result = await response.json()
      if (result.error) throw new Error(result.error)

      if (result.data && Array.isArray(result.data.skills)) {
        const suggested = result.data.skills.map((s: any, idx: number) => ({
          id: `suggested-${idx}-${Date.now()}`,
          name: s.name,
          level: s.level || 'Intermediate',
          category: s.category || 'General',
        }))

        // Filter out duplicate skills that are already added
        const existingNames = new Set(skills.map(s => s.name.toLowerCase()))
        const filteredSuggested = suggested.filter((s: Skill) => !existingNames.has(s.name.toLowerCase()))

        if (filteredSuggested.length === 0) {
          setError('All recommended skills are already added!')
        } else {
          onChange([...skills, ...filteredSuggested])
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to suggest skills')
    } finally {
      setIsSuggesting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Skills</h2>
          <p className="text-muted-foreground text-sm">
            Add your technical and professional skills to showcase your expertise.
          </p>
        </div>
        <button
          onClick={handleSuggestSkills}
          disabled={isSuggesting || !title}
          className="inline-flex items-center gap-2 text-xs bg-secondary text-secondary-foreground border hover:bg-secondary/80 px-3.5 py-2 rounded-full font-medium transition-colors disabled:opacity-50"
        >
          {isSuggesting ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin" />
              Suggesting...
            </>
          ) : (
            <>
              <Sparkles className="h-3 w-3 text-primary" />
              AI Suggest Skills
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-4 gap-4 p-4 border rounded-lg bg-muted/50">
        <div className="space-y-2">
          <label htmlFor="skillName" className="text-sm font-medium">
            Skill Name
          </label>
          <input
            id="skillName"
            type="text"
            value={newSkill.name}
            onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
            className="w-full px-3 py-2 rounded-md border bg-background"
            placeholder="React"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="skillLevel" className="text-sm font-medium">
            Level
          </label>
          <select
            id="skillLevel"
            value={newSkill.level}
            onChange={(e) => setNewSkill({ ...newSkill, level: e.target.value as Skill['level'] })}
            className="w-full px-3 py-2 rounded-md border bg-background"
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
            <option value="Expert">Expert</option>
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="skillCategory" className="text-sm font-medium">
            Category
          </label>
          <input
            id="skillCategory"
            type="text"
            value={newSkill.category}
            onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
            className="w-full px-3 py-2 rounded-md border bg-background"
            placeholder="Frontend"
          />
        </div>

        <div className="flex items-end">
          <button
            onClick={addSkill}
            disabled={!newSkill.name || !newSkill.category}
            className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="h-4 w-4" />
            Add Skill
          </button>
        </div>
      </div>

      {skills.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-medium">Added Skills ({skills.length})</h3>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <div
                key={skill.id}
                className="flex items-center gap-2 pl-4 pr-2 py-2 border rounded-full bg-card shadow-sm hover:shadow transition-shadow"
              >
                <div>
                  <span className="font-semibold text-sm">{skill.name}</span>
                  <span className="text-xs text-muted-foreground ml-2">
                    {skill.category} • {skill.level}
                  </span>
                </div>
                <button
                  onClick={() => removeSkill(skill.id)}
                  className="inline-flex items-center justify-center p-1 rounded-full hover:bg-destructive hover:text-destructive-foreground transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
