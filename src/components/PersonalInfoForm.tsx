import { useState } from 'react'
import { PersonalInfo } from '../types/portfolio'
import { Upload, X, Sparkles, Loader2 } from 'lucide-react'

interface PersonalInfoFormProps {
  data: PersonalInfo
  onChange: (data: PersonalInfo) => void
}

export default function PersonalInfoForm({ data, onChange }: PersonalInfoFormProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (field: keyof PersonalInfo, value: string) => {
    onChange({ ...data, [field]: value })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        handleChange('avatar', reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    handleChange('avatar', '')
  }

  const handleGenerateBio = async () => {
    if (!data.fullName || !data.title) {
      setError('Please enter your name and title first')
      return
    }

    const token = localStorage.getItem('sb-access-token')
    console.log('Token check:', token ? 'exists' : 'missing')
    if (!token) {
      setError('Please log in to use AI generation')
      return
    }

    setIsGenerating(true)
    setError('')

    try {
      console.log('Making AI request...')
      const response = await fetch('http://localhost:3001/ai/generate-about', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: data.fullName,
          role: data.title,
          skills: [],
          experience: '',
        }),
      })

      console.log('Response status:', response.status)
      const result = await response.json()
      console.log('Response data:', result)
      
      if (result.error) throw new Error(result.error)

      handleChange('bio', result.data.bio)
    } catch (err: any) {
      console.error('AI generation error:', err)
      setError(err.message || 'Failed to generate bio')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Personal Information</h2>
      <p className="text-muted-foreground">
        Tell us about yourself. This information will be displayed on your portfolio.
      </p>

      {/* Profile Image Upload */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Profile Image</label>
        <div className="flex items-center gap-4">
          {data.avatar ? (
            <div className="relative">
              <img
                src={data.avatar}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-2 border-border"
              />
              <button
                onClick={handleRemoveImage}
                className="absolute -top-2 -right-2 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="w-24 h-24 rounded-full border-2 border-dashed border-border flex items-center justify-center bg-muted/50">
              <Upload className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
          <div>
            <input
              id="avatar"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <label
              htmlFor="avatar"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md border hover:bg-accent cursor-pointer"
            >
              <Upload className="h-4 w-4" />
              {data.avatar ? 'Change Image' : 'Upload Image'}
            </label>
            <p className="text-xs text-muted-foreground mt-1">
              Recommended: Square image, at least 200x200px
            </p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="fullName" className="text-sm font-medium">
            Full Name *
          </label>
          <input
            id="fullName"
            type="text"
            value={data.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            className="w-full px-3 py-2 rounded-md border bg-background"
            placeholder="John Doe"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email *
          </label>
          <input
            id="email"
            type="email"
            value={data.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className="w-full px-3 py-2 rounded-md border bg-background"
            placeholder="john@example.com"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium">
            Phone
          </label>
          <input
            id="phone"
            type="tel"
            value={data.phone || ''}
            onChange={(e) => handleChange('phone', e.target.value)}
            className="w-full px-3 py-2 rounded-md border bg-background"
            placeholder="+1 234 567 890"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="location" className="text-sm font-medium">
            Location *
          </label>
          <input
            id="location"
            type="text"
            value={data.location}
            onChange={(e) => handleChange('location', e.target.value)}
            className="w-full px-3 py-2 rounded-md border bg-background"
            placeholder="San Francisco, CA"
            required
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label htmlFor="title" className="text-sm font-medium">
            Professional Title *
          </label>
          <input
            id="title"
            type="text"
            value={data.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className="w-full px-3 py-2 rounded-md border bg-background"
            placeholder="Full Stack Developer"
            required
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <div className="flex items-center justify-between">
            <label htmlFor="bio" className="text-sm font-medium">
              Bio *
            </label>
            <button
              onClick={handleGenerateBio}
              disabled={isGenerating}
              className="inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full border hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-3 w-3" />
                  AI Generate
                </>
              )}
            </button>
          </div>
          <textarea
            id="bio"
            value={data.bio}
            onChange={(e) => handleChange('bio', e.target.value)}
            className="w-full px-3 py-2 rounded-md border bg-background min-h-[120px]"
            placeholder="A brief description about yourself and your work..."
            required
          />
          {error && (
            <p className="text-xs text-destructive">{error}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="linkedin" className="text-sm font-medium">
            LinkedIn URL
          </label>
          <input
            id="linkedin"
            type="url"
            value={data.linkedin || ''}
            onChange={(e) => handleChange('linkedin', e.target.value)}
            className="w-full px-3 py-2 rounded-md border bg-background"
            placeholder="https://linkedin.com/in/johndoe"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="github" className="text-sm font-medium">
            GitHub URL
          </label>
          <input
            id="github"
            type="url"
            value={data.github || ''}
            onChange={(e) => handleChange('github', e.target.value)}
            className="w-full px-3 py-2 rounded-md border bg-background"
            placeholder="https://github.com/johndoe"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="twitter" className="text-sm font-medium">
            Twitter URL
          </label>
          <input
            id="twitter"
            type="url"
            value={data.twitter || ''}
            onChange={(e) => handleChange('twitter', e.target.value)}
            className="w-full px-3 py-2 rounded-md border bg-background"
            placeholder="https://twitter.com/johndoe"
          />
        </div>
      </div>
    </div>
  )
}
