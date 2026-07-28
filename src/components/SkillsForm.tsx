import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { Skill } from '../types/portfolio'

interface SkillsFormProps {
  skills: Skill[]
  onChange: (skills: Skill[]) => void
}

export default function SkillsForm({ skills, onChange }: SkillsFormProps) {
  const [newSkill, setNewSkill] = useState({ name: '', level: 'Intermediate' as Skill['level'], category: '' })

  const addSkill = () => {
    if (newSkill.name && newSkill.category) {
      onChange([
        ...skills,
        { ...newSkill, id: Date.now().toString() },
      ])
      setNewSkill({ name: '', level: 'Intermediate', category: '' })
    }
  }

  const removeSkill = (id: string) => {
    onChange(skills.filter((skill) => skill.id !== id))
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Skills</h2>
      <p className="text-muted-foreground">
        Add your technical and professional skills to showcase your expertise.
      </p>

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
          <div className="grid gap-3">
            {skills.map((skill) => (
              <div
                key={skill.id}
                className="flex items-center justify-between p-4 border rounded-lg bg-card"
              >
                <div>
                  <div className="font-medium">{skill.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {skill.category} • {skill.level}
                  </div>
                </div>
                <button
                  onClick={() => removeSkill(skill.id)}
                  className="inline-flex items-center justify-center p-2 rounded-md hover:bg-destructive hover:text-destructive-foreground transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
