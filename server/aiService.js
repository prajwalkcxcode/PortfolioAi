import dotenv from 'dotenv'

dotenv.config()

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'

async function callOpenRouter(messages, model = 'anthropic/claude-3-haiku') {
  if (!OPENROUTER_API_KEY) {
    throw new Error('OPENROUTER_API_KEY environment variable is not configured')
  }

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:5173',
        'X-Title': 'PortfolioAI',
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.7,
        max_tokens: 1200,
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

async function callOpenRouterWithRetry(messages, model = 'anthropic/claude-3-haiku', retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await callOpenRouter(messages, model)
    } catch (error) {
      console.warn(`AI request attempt ${i + 1} failed: ${error.message}`)
      if (i === retries - 1) throw error
      // Exponential backoff: 1s, 2s, 4s...
      await new Promise((resolve) => setTimeout(resolve, Math.pow(2, i) * 1000))
    }
  }
}

async function checkUsageLimit(userId, supabaseClient) {
  try {
    let { data: credits, error } = await supabaseClient
      .from('ai_credits')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error || !credits) {
      // Create default credit row if it doesn't exist
      const { data: newCredits, error: createError } = await supabaseClient
        .from('ai_credits')
        .insert({
          user_id: userId,
          credits_remaining: 50,
          credits_used: 0,
          period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        })
        .select()
        .single()

      if (createError) {
        console.error('Error creating default AI credits:', createError)
        return { allowed: true, remaining: 50 }
      }
      credits = newCredits
    }

    if (credits.credits_remaining <= 0) {
      return { allowed: false, remaining: 0 }
    }

    return { allowed: true, remaining: credits.credits_remaining }
  } catch (error) {
    console.error('Failed to check usage limits:', error)
    return { allowed: true, remaining: 1 } // Graceful fallback
  }
}

async function decrementCredits(userId, supabaseClient) {
  try {
    const { data: credits, error } = await supabaseClient
      .from('ai_credits')
      .select('credits_remaining, credits_used')
      .eq('user_id', userId)
      .single()

    if (error || !credits) return

    await supabaseClient
      .from('ai_credits')
      .update({
        credits_remaining: Math.max(0, credits.credits_remaining - 1),
        credits_used: credits.credits_used + 1,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
  } catch (error) {
    console.error('Failed to decrement credits:', error)
  }
}

export async function generateHeroSection(name, role, skills, userId, supabaseClient) {
  const usageCheck = await checkUsageLimit(userId, supabaseClient)
  if (!usageCheck.allowed) {
    throw new Error('Daily AI usage limit reached. Try again tomorrow.')
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
    const response = await callOpenRouterWithRetry(messages)
    await decrementCredits(userId, supabaseClient)
    
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    
    throw new Error('Failed to parse AI response')
  } catch (error) {
    throw new Error(`Hero generation failed: ${error.message}`)
  }
}

export async function generateAboutSection(name, role, skills, experience, userId, supabaseClient) {
  const usageCheck = await checkUsageLimit(userId, supabaseClient)
  if (!usageCheck.allowed) {
    throw new Error('Daily AI usage limit reached. Try again tomorrow.')
  }

  const messages = [
    {
      role: 'system',
      content: 'You are a professional portfolio content writer. Generate compelling biography content in JSON format only. No markdown, no code blocks, just raw JSON.',
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
    const response = await callOpenRouterWithRetry(messages)
    await decrementCredits(userId, supabaseClient)
    
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    
    throw new Error('Failed to parse AI response')
  } catch (error) {
    throw new Error(`About section generation failed: ${error.message}`)
  }
}

export async function improveProject(projectName, technologies, userId, supabaseClient) {
  const usageCheck = await checkUsageLimit(userId, supabaseClient)
  if (!usageCheck.allowed) {
    throw new Error('Daily AI usage limit reached. Try again tomorrow.')
  }

  const messages = [
    {
      role: 'system',
      content: 'You are a professional portfolio content writer. Generate compelling project descriptions in JSON format only. No markdown, no code blocks, just raw JSON.',
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
    const response = await callOpenRouterWithRetry(messages)
    await decrementCredits(userId, supabaseClient)
    
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    
    throw new Error('Failed to parse AI response')
  } catch (error) {
    throw new Error(`Project improvement failed: ${error.message}`)
  }
}

export async function generateResumeSummary(name, role, skills, experience, userId, supabaseClient) {
  const usageCheck = await checkUsageLimit(userId, supabaseClient)
  if (!usageCheck.allowed) {
    throw new Error('Daily AI usage limit reached. Try again tomorrow.')
  }

  const messages = [
    {
      role: 'system',
      content: 'You are a professional resume writer. Generate compelling resume summaries in JSON format only. No markdown, no code blocks, just raw JSON.',
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
    const response = await callOpenRouterWithRetry(messages)
    await decrementCredits(userId, supabaseClient)
    
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    
    throw new Error('Failed to parse AI response')
  } catch (error) {
    throw new Error(`Resume summary generation failed: ${error.message}`)
  }
}

export async function getUsageStats(userId, supabaseClient) {
  try {
    const { data: credits, error } = await supabaseClient
      .from('ai_credits')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error || !credits) {
      return { used: 0, remaining: 50, max: 50 }
    }

    return {
      used: credits.credits_used,
      remaining: credits.credits_remaining,
      max: credits.credits_used + credits.credits_remaining,
    }
  } catch (error) {
    console.error('Failed to get usage stats:', error)
    return { used: 0, remaining: 50, max: 50 }
  }
}

export async function parseResumeText(text, userId, supabaseClient) {
  const usageCheck = await checkUsageLimit(userId, supabaseClient)
  if (!usageCheck.allowed) {
    throw new Error('Daily AI usage limit reached. Try again tomorrow.')
  }

  const messages = [
    {
      role: 'system',
      content: 'You are an expert resume parsing AI. Extract professional profile details from raw text and return it in JSON format only. Keep the JSON perfectly structured and do not return markdown wrappers.',
    },
    {
      role: 'user',
      content: `Parse the following resume text and extract the details.
      
Resume Text:
${text}

Return JSON with this structure:
{
  "personalInfo": {
    "fullName": "Full name",
    "email": "Email address",
    "phone": "Phone number or null",
    "location": "Location (City, State or City, Country)",
    "title": "Professional title (e.g. Senior Software Engineer)",
    "bio": "A summary profile bio (2-3 sentences)"
  },
  "skills": [
    { "name": "Skill Name", "level": "Beginner/Intermediate/Advanced/Expert", "category": "Frontend/Backend/Design/Database/Mobile/etc." }
  ],
  "projects": [
    {
      "title": "Project Title",
      "description": "Short project description (2-3 sentences)",
      "technologies": ["Tech1", "Tech2"],
      "startDate": "YYYY-MM",
      "endDate": "YYYY-MM or null"
    }
  ]
}`,
    },
  ]

  try {
    // Parsing can be complex, use a larger model or haiku.
    const response = await callOpenRouterWithRetry(messages)
    await decrementCredits(userId, supabaseClient)

    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    throw new Error('No JSON object found in response')
  } catch (error) {
    console.error('Resume parsing failed:', error)
    throw new Error(`Resume parsing failed: ${error.message}`)
  }
}

export async function generateSkillsSuggestions(role, bio, userId, supabaseClient) {
  const usageCheck = await checkUsageLimit(userId, supabaseClient)
  if (!usageCheck.allowed) {
    throw new Error('Daily AI usage limit reached. Try again tomorrow.')
  }

  const messages = [
    {
      role: 'system',
      content: 'You are a technical career advisor. Output skill recommendations in JSON format only. No markdown, no explanations.',
    },
    {
      role: 'user',
      content: `Suggest technical skills based on the role and bio.
      
Role: ${role}
Bio: ${bio}

Return JSON with this structure:
{
  "skills": [
    { "name": "Skill Name", "level": "Intermediate/Advanced/Expert", "category": "Frontend/Backend/DevOps/Mobile/Data Science/etc." }
  ]
}`,
    },
  ]

  try {
    const response = await callOpenRouterWithRetry(messages)
    await decrementCredits(userId, supabaseClient)

    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    throw new Error('Failed to parse AI response')
  } catch (error) {
    throw new Error(`Skills suggestions failed: ${error.message}`)
  }
}
