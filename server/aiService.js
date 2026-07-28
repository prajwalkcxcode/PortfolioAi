import dotenv from 'dotenv'

dotenv.config()

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'

// AI usage tracking (in-memory for now, should use database in production)
const aiUsageMap = new Map()

const MAX_DAILY_REQUESTS = 50 // Limit per user per day

async function callOpenRouter(messages, model = 'anthropic/claude-3-haiku') {
  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:5176',
        'X-Title': 'PortfolioAI',
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || 'AI API request failed')
    }

    const data = await response.json()
    return data.choices[0].message.content
  } catch (error) {
    console.error('OpenRouter API error:', error)
    throw error
  }
}

function checkUsageLimit(userId) {
  const today = new Date().toDateString()
  const userUsage = aiUsageMap.get(userId) || { date: today, count: 0 }

  if (userUsage.date !== today) {
    userUsage.date = today
    userUsage.count = 0
  }

  if (userUsage.count >= MAX_DAILY_REQUESTS) {
    return { allowed: false, remaining: 0 }
  }

  return { allowed: true, remaining: MAX_DAILY_REQUESTS - userUsage.count }
}

function incrementUsage(userId) {
  const userUsage = aiUsageMap.get(userId) || { date: new Date().toDateString(), count: 0 }
  userUsage.count++
  aiUsageMap.set(userId, userUsage)
}

export async function generateHeroSection(name, role, skills, userId) {
  const usageCheck = checkUsageLimit(userId)
  if (!usageCheck.allowed) {
    throw new Error(`Daily AI usage limit reached. Try again tomorrow.`)
  }

  const messages = [
    {
      role: 'system',
      content: 'You are a professional portfolio content writer. Generate compelling portfolio content in JSON format only. No markdown, no code blocks, just raw JSON.',
    },
    {
      role: 'user',
      content: `Generate a hero section for a portfolio.
      
Name: ${name}
Role: ${role}
Skills: ${skills.join(', ')}

Return JSON with this structure:
{
  "headline": "Professional headline (2-3 words)",
  "introduction": "Short introduction (1-2 sentences)"
}`,
    },
  ]

  try {
    const response = await callOpenRouter(messages)
    incrementUsage(userId)
    
    // Parse JSON response
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    
    throw new Error('Failed to parse AI response')
  } catch (error) {
    throw new Error(`Hero generation failed: ${error.message}`)
  }
}

export async function generateAboutSection(name, role, skills, experience, userId) {
  const usageCheck = checkUsageLimit(userId)
  if (!usageCheck.allowed) {
    throw new Error(`Daily AI usage limit reached. Try again tomorrow.`)
  }

  const messages = [
    {
      role: 'system',
      content: 'You are a professional portfolio content writer. Generate compelling portfolio content in JSON format only. No markdown, no code blocks, just raw JSON.',
    },
    {
      role: 'user',
      content: `Generate a professional biography for a portfolio.
      
Name: ${name}
Role: ${role}
Skills: ${skills.join(', ')}
Experience: ${experience || 'Not specified'}

Return JSON with this structure:
{
  "bio": "Professional biography (2-3 paragraphs)"
}`,
    },
  ]

  try {
    const response = await callOpenRouter(messages)
    incrementUsage(userId)
    
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    
    throw new Error('Failed to parse AI response')
  } catch (error) {
    throw new Error(`About section generation failed: ${error.message}`)
  }
}

export async function improveProject(projectName, technologies, userId) {
  const usageCheck = checkUsageLimit(userId)
  if (!usageCheck.allowed) {
    throw new Error(`Daily AI usage limit reached. Try again tomorrow.`)
  }

  const messages = [
    {
      role: 'system',
      content: 'You are a professional portfolio content writer. Generate compelling portfolio content in JSON format only. No markdown, no code blocks, just raw JSON.',
    },
    {
      role: 'user',
      content: `Improve this project description for a professional portfolio.
      
Project Name: ${projectName}
Technologies: ${technologies.join(', ')}

Return JSON with this structure:
{
  "description": "Professional project description (2-3 sentences)",
  "technologies_explanation": "How technologies were used (1-2 sentences)",
  "impact": "Impact statement (1 sentence)"
}`,
    },
  ]

  try {
    const response = await callOpenRouter(messages)
    incrementUsage(userId)
    
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    
    throw new Error('Failed to parse AI response')
  } catch (error) {
    throw new Error(`Project improvement failed: ${error.message}`)
  }
}

export async function generateResumeSummary(name, role, skills, experience, userId) {
  const usageCheck = checkUsageLimit(userId)
  if (!usageCheck.allowed) {
    throw new Error(`Daily AI usage limit reached. Try again tomorrow.`)
  }

  const messages = [
    {
      role: 'system',
      content: 'You are a professional resume writer. Generate compelling resume content in JSON format only. No markdown, no code blocks, just raw JSON.',
    },
    {
      role: 'user',
      content: `Generate a professional resume summary.
      
Name: ${name}
Role: ${role}
Skills: ${skills.join(', ')}
Experience: ${experience || 'Not specified'}

Return JSON with this structure:
{
  "summary": "Professional summary (2-3 sentences highlighting key strengths and experience)"
}`,
    },
  ]

  try {
    const response = await callOpenRouter(messages)
    incrementUsage(userId)
    
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    
    throw new Error('Failed to parse AI response')
  } catch (error) {
    throw new Error(`Resume summary generation failed: ${error.message}`)
  }
}

export function getUsageStats(userId) {
  const userUsage = aiUsageMap.get(userId) || { date: new Date().toDateString(), count: 0 }
  return {
    used: userUsage.count,
    remaining: MAX_DAILY_REQUESTS - userUsage.count,
    max: MAX_DAILY_REQUESTS,
  }
}
