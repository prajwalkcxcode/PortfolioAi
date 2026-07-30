import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const pdfParse = require('pdf-parse')
import {
  generateHeroSection,
  generateAboutSection,
  improveProject,
  generateResumeSummary,
  getUsageStats,
  parseResumeText,
  generateSkillsSuggestions,
} from './aiService.js'

dotenv.config()

// Initialize Stripe only if API key is provided
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null
const app = express()
const PORT = process.env.PORT || 3001

app.listen(PORT, '0.0.0.0', () => {
  console.log(`PortfolioAI API server running on port ${PORT}`)
})

// Middleware
app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))

// Rate limiting middleware (in-memory)
const rateLimitWindowMs = 15 * 60 * 1000 // 15 minutes
const maxRequestsPerWindow = 150 // limit each IP to 150 requests per window
const ipRequestCounts = new Map()

function rateLimiter(req, res, next) {
  const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress
  const now = Date.now()
  const requestLog = ipRequestCounts.get(ip) || []
  
  // Filter out requests older than the window
  const activeRequests = requestLog.filter(time => now - time < rateLimitWindowMs)
  
  if (activeRequests.length >= maxRequestsPerWindow) {
    return res.status(429).json({ error: 'Too many requests. Please try again later.' })
  }
  
  activeRequests.push(now)
  ipRequestCounts.set(ip, activeRequests)
  next()
}

app.use('/ai', rateLimiter)
app.use('/resume', rateLimiter)

// Supabase client (fallback/anonymous global client)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

// Helper to get request-specific Supabase client using client JWT
function getSupabaseClient(req) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (token) {
    return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    })
  }
  return supabase
}

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'PortfolioAI API is running' })
})

// Auth routes
app.post('/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }
      }
    })

    if (error) throw error

    // Create user profile in users table (if trigger failed or not run)
    if (data.user) {
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: data.user.id,
          email: data.user.email,
          name: name,
          avatar: null
        })

      if (profileError && profileError.code !== '23505') { // Ignore duplicate keys
        console.error('Profile creation error:', profileError)
      }
    }

    res.json({ data, error: null })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw error

    res.json({ data, error: null })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.post('/auth/logout', async (req, res) => {
  try {
    const { token } = req.body
    const { error } = await supabase.auth.signOut(token)

    if (error) throw error

    res.json({ error: null })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.get('/auth/user', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    const supabaseClient = getSupabaseClient(req)
    
    const { data, error } = await supabaseClient.auth.getUser(token)

    if (error) throw error

    if (data.user) {
      const { data: profile, error: profileError } = await supabaseClient
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single()

      if (profileError) {
        console.error('Failed to get user profile:', profileError)
      }

      res.json({ user: { ...data.user, profile: profile || null }, error: null })
    } else {
      res.json({ user: null, error: null })
    }
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Portfolio routes
app.get('/portfolios', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    const supabaseClient = getSupabaseClient(req)
    const { data: { user } } = await supabaseClient.auth.getUser(token)

    if (!user) throw new Error('Unauthorized')

    const { data, error } = await supabaseClient
      .from('portfolios')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    res.json({ data, error: null })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.get('/portfolios/:id', async (req, res) => {
  try {
    const { id } = req.params
    // Allow public access for templates rendering
    const { data, error } = await supabase
      .from('portfolios')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error

    res.json({ data, error: null })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.post('/portfolios', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    const supabaseClient = getSupabaseClient(req)
    const { data: { user } } = await supabaseClient.auth.getUser(token)

    if (!user) throw new Error('Unauthorized')

    const { template, theme, bio, personal_info, custom_styles, meta_title, meta_description, og_image } = req.body

    const { data, error } = await supabaseClient
      .from('portfolios')
      .insert({
        user_id: user.id,
        template,
        theme: theme || 'light',
        bio,
        personal_info,
        custom_styles: custom_styles || {},
        meta_title: meta_title || null,
        meta_description: meta_description || null,
        og_image: og_image || null,
      })
      .select()
      .single()

    if (error) throw error

    res.json({ data, error: null })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.put('/portfolios/:id', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    const supabaseClient = getSupabaseClient(req)
    const { data: { user } } = await supabaseClient.auth.getUser(token)

    if (!user) throw new Error('Unauthorized')

    const { id } = req.params
    const { template, theme, bio, personal_info, custom_styles, meta_title, meta_description, og_image } = req.body

    const { data, error } = await supabaseClient
      .from('portfolios')
      .update({
        template,
        theme,
        bio,
        personal_info,
        custom_styles,
        meta_title,
        meta_description,
        og_image,
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) throw error

    res.json({ data, error: null })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Publishing routes
app.post('/portfolios/:id/publish', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    const supabaseClient = getSupabaseClient(req)
    const { data: { user } } = await supabaseClient.auth.getUser(token)

    if (!user) throw new Error('Unauthorized')

    const { id } = req.params
    const { subdomain } = req.body

    if (!subdomain || !/^[a-z0-9-]{3,30}$/.test(subdomain)) {
      throw new Error('Invalid subdomain. Must be 3-30 characters, lowercase letters, numbers, and hyphens only.')
    }

    // Check if subdomain is already taken
    const { data: existing } = await supabaseClient
      .from('portfolios')
      .select('id')
      .eq('subdomain', subdomain)
      .single()

    if (existing && existing.id !== id) {
      throw new Error('This subdomain is already taken. Please choose another.')
    }

    const { data, error } = await supabaseClient
      .from('portfolios')
      .update({
        subdomain,
        is_published: true,
        published_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) throw error

    res.json({ 
      data: { 
        ...data, 
        url: `${subdomain}.portfolioai.com` 
      }, 
      error: null 
    })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.post('/portfolios/:id/unpublish', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    const supabaseClient = getSupabaseClient(req)
    const { data: { user } } = await supabaseClient.auth.getUser(token)

    if (!user) throw new Error('Unauthorized')

    const { id } = req.params

    const { data, error } = await supabaseClient
      .from('portfolios')
      .update({
        is_published: false,
        subdomain: null,
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) throw error

    res.json({ data, error: null })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.delete('/portfolios/:id', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    const supabaseClient = getSupabaseClient(req)
    const { data: { user } } = await supabaseClient.auth.getUser(token)

    if (!user) throw new Error('Unauthorized')

    const { id } = req.params

    const { error } = await supabaseClient
      .from('portfolios')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) throw error

    res.json({ error: null })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Projects routes
app.get('/portfolios/:portfolioId/projects', async (req, res) => {
  try {
    const { portfolioId } = req.params
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('portfolio_id', portfolioId)
      .order('created_at', { ascending: true })

    if (error) throw error

    res.json({ data, error: null })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.post('/projects', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    const supabaseClient = getSupabaseClient(req)
    const { data: { user } } = await supabaseClient.auth.getUser(token)

    if (!user) throw new Error('Unauthorized')

    const { portfolio_id, title, description, technologies, github_url, live_url, image_url } = req.body

    const { data, error } = await supabaseClient
      .from('projects')
      .insert({
        portfolio_id,
        title,
        description,
        technologies,
        github_url,
        live_url,
        image_url
      })
      .select()
      .single()

    if (error) throw error

    res.json({ data, error: null })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.put('/projects/:id', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    const supabaseClient = getSupabaseClient(req)
    const { data: { user } } = await supabaseClient.auth.getUser(token)

    if (!user) throw new Error('Unauthorized')

    const { id } = req.params
    const { title, description, technologies, github_url, live_url, image_url } = req.body

    const { data, error } = await supabaseClient
      .from('projects')
      .update({
        title,
        description,
        technologies,
        github_url,
        live_url,
        image_url,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    res.json({ data, error: null })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.delete('/projects/:id', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    const supabaseClient = getSupabaseClient(req)
    const { data: { user } } = await supabaseClient.auth.getUser(token)

    if (!user) throw new Error('Unauthorized')

    const { id } = req.params

    const { error } = await supabaseClient
      .from('projects')
      .delete()
      .eq('id', id)

    if (error) throw error

    res.json({ error: null })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Skills routes
app.get('/portfolios/:portfolioId/skills', async (req, res) => {
  try {
    const { portfolioId } = req.params
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .eq('portfolio_id', portfolioId)
      .order('created_at', { ascending: true })

    if (error) throw error

    res.json({ data, error: null })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.post('/skills', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    const supabaseClient = getSupabaseClient(req)
    const { data: { user } } = await supabaseClient.auth.getUser(token)

    if (!user) throw new Error('Unauthorized')

    const { portfolio_id, skill_name, level, category } = req.body

    const { data, error } = await supabaseClient
      .from('skills')
      .insert({
        portfolio_id,
        skill_name,
        level,
        category
      })
      .select()
      .single()

    if (error) throw error

    res.json({ data, error: null })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.put('/skills/:id', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    const supabaseClient = getSupabaseClient(req)
    const { data: { user } } = await supabaseClient.auth.getUser(token)

    if (!user) throw new Error('Unauthorized')

    const { id } = req.params
    const { skill_name, level, category } = req.body

    const { data, error } = await supabaseClient
      .from('skills')
      .update({
        skill_name,
        level,
        category,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    res.json({ data, error: null })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.delete('/skills/:id', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    const supabaseClient = getSupabaseClient(req)
    const { data: { user } } = await supabaseClient.auth.getUser(token)

    if (!user) throw new Error('Unauthorized')

    const { id } = req.params

    const { error } = await supabaseClient
      .from('skills')
      .delete()
      .eq('id', id)

    if (error) throw error

    res.json({ error: null })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// AI Generation Routes
app.post('/ai/generate-about', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    const supabaseClient = getSupabaseClient(req)
    const { data: { user } } = await supabaseClient.auth.getUser(token)

    if (!user) throw new Error('Unauthorized')

    const { name, role, skills, experience } = req.body

    if (!name || !role || !skills) {
      throw new Error('Missing required fields: name, role, skills')
    }

    const result = await generateAboutSection(name, role, skills, experience, user.id, supabaseClient)
    res.json({ data: result, error: null })
  } catch (error) {
    console.error('AI generation error:', error)
    res.status(400).json({ error: error.message })
  }
})

app.post('/ai/improve-project', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    const supabaseClient = getSupabaseClient(req)
    const { data: { user } } = await supabaseClient.auth.getUser(token)

    if (!user) throw new Error('Unauthorized')

    const { projectName, technologies } = req.body

    if (!projectName || !technologies) {
      throw new Error('Missing required fields: projectName, technologies')
    }

    const result = await improveProject(projectName, technologies, user.id, supabaseClient)
    res.json({ data: result, error: null })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.post('/ai/generate-resume-summary', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    const supabaseClient = getSupabaseClient(req)
    const { data: { user } } = await supabaseClient.auth.getUser(token)

    if (!user) throw new Error('Unauthorized')

    const { name, role, skills, experience } = req.body

    if (!name || !role || !skills) {
      throw new Error('Missing required fields: name, role, skills')
    }

    const result = await generateResumeSummary(name, role, skills, experience, user.id, supabaseClient)
    res.json({ data: result, error: null })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.post('/ai/skills-suggestions', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    const supabaseClient = getSupabaseClient(req)
    const { data: { user } } = await supabaseClient.auth.getUser(token)

    if (!user) throw new Error('Unauthorized')

    const { role, bio } = req.body

    const result = await generateSkillsSuggestions(role, bio, user.id, supabaseClient)
    res.json({ data: result, error: null })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.get('/ai/usage', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    const supabaseClient = getSupabaseClient(req)
    const { data: { user } } = await supabaseClient.auth.getUser(token)

    if (!user) throw new Error('Unauthorized')

    const stats = await getUsageStats(user.id, supabaseClient)
    res.json({ data: stats, error: null })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Resume Parsing Route
app.post('/resume/parse', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    const supabaseClient = getSupabaseClient(req)
    const { data: { user } } = await supabaseClient.auth.getUser(token)
    if (!user) throw new Error('Unauthorized')

    const { fileData, fileName } = req.body
    if (!fileData) throw new Error('No resume file data provided')

    const base64Content = fileData.split(';base64,').pop()
    const buffer = Buffer.from(base64Content, 'base64')

    let text = ''
    if (fileName?.toLowerCase().endsWith('.pdf')) {
      const parsedPdf = await pdfParse(buffer)
      text = parsedPdf.text
    } else {
      text = buffer.toString('utf-8')
    }

    if (!text || text.trim().length === 0) {
      throw new Error('Failed to extract text from resume')
    }

    const parsedDetails = await parseResumeText(text, user.id, supabaseClient)
    res.json({ data: parsedDetails, error: null })
  } catch (error) {
    console.error('Resume parse error:', error)
    res.status(400).json({ error: error.message })
  }
})

// Teams Routes
app.post('/teams', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    const supabaseClient = getSupabaseClient(req)
    const { data: { user } } = await supabaseClient.auth.getUser(token)
    if (!user) throw new Error('Unauthorized')

    const { name } = req.body
    if (!name) throw new Error('Team name is required')

    const { data: team, error: teamError } = await supabaseClient
      .from('teams')
      .insert({ name, owner_id: user.id })
      .select()
      .single()

    if (teamError) throw teamError

    const { error: memberError } = await supabaseClient
      .from('team_members')
      .insert({ team_id: team.id, user_id: user.id, role: 'owner' })

    if (memberError) throw memberError

    res.json({ data: team, error: null })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.get('/teams', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    const supabaseClient = getSupabaseClient(req)
    const { data: { user } } = await supabaseClient.auth.getUser(token)
    if (!user) throw new Error('Unauthorized')

    // Retrieve teams owned by user or where they are a member
    const { data: ownedTeams, error: ownedError } = await supabaseClient
      .from('teams')
      .select('*, team_members(*)')
      .eq('owner_id', user.id)

    if (ownedError) throw ownedError

    const { data: memberTeams, error: memberError } = await supabaseClient
      .from('team_members')
      .select('teams(*, team_members(*))')
      .eq('user_id', user.id)
      .neq('role', 'owner')

    if (memberError) throw memberError

    const collatedTeams = [
      ...(ownedTeams || []),
      ...(memberTeams?.map(mt => mt.teams).filter(Boolean) || [])
    ]

    // Deduplicate just in case
    const uniqueTeams = Array.from(new Map(collatedTeams.map(t => [t.id, t])).values())

    res.json({ data: uniqueTeams, error: null })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.post('/teams/:id/members', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    const supabaseClient = getSupabaseClient(req)
    const { data: { user } } = await supabaseClient.auth.getUser(token)
    if (!user) throw new Error('Unauthorized')

    const { id } = req.params
    const { email, role = 'member' } = req.body
    if (!email) throw new Error('Member email is required')

    // Verify requesting user is owner or admin of the team
    const { data: teamCheck } = await supabaseClient
      .from('teams')
      .select('owner_id')
      .eq('id', id)
      .single()

    const { data: memberCheck } = await supabaseClient
      .from('team_members')
      .select('role')
      .eq('team_id', id)
      .eq('user_id', user.id)
      .single()

    const isOwner = teamCheck?.owner_id === user.id
    const isAdmin = memberCheck?.role === 'admin'

    if (!isOwner && !isAdmin) {
      throw new Error('Only team owners and admins can invite members.')
    }

    // Find invitee by email
    const { data: invitee, error: findError } = await supabaseClient
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (findError || !invitee) {
      throw new Error('User not found. Invitees must sign up on the platform first.')
    }

    const { data, error } = await supabaseClient
      .from('team_members')
      .insert({ team_id: id, user_id: invitee.id, role })
      .select()
      .single()

    if (error) {
      if (error.code === '23505') throw new Error('User is already a member of this team')
      throw error
    }

    res.json({ data, error: null })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Stripe Subscription Routes
app.post('/subscriptions/create-checkout-session', async (req, res) => {
  if (!stripe) {
    return res.status(400).json({ error: 'Stripe is not configured on this server.' })
  }

  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    const supabaseClient = getSupabaseClient(req)
    const { data: { user } } = await supabaseClient.auth.getUser(token)

    if (!user) throw new Error('Unauthorized')

    const { priceId } = req.body

    // Get or create Stripe customer
    let customerId
    const { data: existingSubscription } = await supabaseClient
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .single()

    if (existingSubscription?.stripe_customer_id) {
      customerId = existingSubscription.stripe_customer_id
    } else {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { userId: user.id }
      })
      customerId = customer.id
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard?subscription=success`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/pricing?subscription=canceled`,
    })

    res.json({ data: { url: session.url }, error: null })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.post('/subscriptions/cancel', async (req, res) => {
  if (!stripe) {
    return res.status(400).json({ error: 'Stripe is not configured on this server.' })
  }

  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    const supabaseClient = getSupabaseClient(req)
    const { data: { user } } = await supabaseClient.auth.getUser(token)

    if (!user) throw new Error('Unauthorized')

    const { data: subscription } = await supabaseClient
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (!subscription || !subscription.stripe_subscription_id) {
      throw new Error('No active subscription found')
    }

    await stripe.subscriptions.update(subscription.stripe_subscription_id, {
      cancel_at_period_end: true,
    })

    await supabaseClient
      .from('subscriptions')
      .update({ cancel_at_period_end: true })
      .eq('user_id', user.id)

    res.json({ data: { success: true }, error: null })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.get('/subscriptions/current', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    const supabaseClient = getSupabaseClient(req)
    const { data: { user } } = await supabaseClient.auth.getUser(token)

    if (!user) throw new Error('Unauthorized')

    const { data: subscription } = await supabaseClient
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single()

    res.json({ data: subscription || null, error: null })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.post('/webhooks/stripe', async (req, res) => {
  if (!stripe) {
    return res.status(400).json({ error: 'Stripe not configured' })
  }

  const sig = req.headers['stripe-signature']
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  let event

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret)
  } catch (err) {
    return res.status(400).json({ error: `Webhook Error: ${err.message}` })
  }

  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutSessionCompleted(event.data.object)
      break
    case 'customer.subscription.updated':
      await handleSubscriptionUpdated(event.data.object)
      break
    case 'customer.subscription.deleted':
      await handleSubscriptionDeleted(event.data.object)
      break
    case 'checkout.session.async_payment_succeeded':
      await handleCheckoutSessionCompleted(event.data.object)
      break
    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  res.json({ received: true })
})

async function handleCheckoutSessionCompleted(session) {
  const { customer, subscription: stripeSubscriptionId, metadata } = session
  
  if (metadata?.templateId && metadata?.userId) {
    await handleTemplatePurchase(session)
    return
  }
  
  const customerData = await stripe.customers.retrieve(customer)
  const userId = customerData.metadata.userId

  const subscription = await stripe.subscriptions.retrieve(stripeSubscriptionId)
  const priceId = subscription.items.data[0].price.id

  const { data: pricingPlan } = await supabase
    .from('pricing_plans')
    .select('*')
    .eq('stripe_price_id', priceId)
    .single()

  await supabase
    .from('subscriptions')
    .upsert({
      user_id: userId,
      stripe_customer_id: customer,
      stripe_subscription_id: stripeSubscriptionId,
      stripe_price_id: priceId,
      status: subscription.status,
      plan_type: pricingPlan?.slug || 'free',
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    })

  await supabase
    .from('ai_credits')
    .upsert({
      user_id: userId,
      credits_remaining: pricingPlan?.ai_credits_per_month || 50,
      period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    })
}

async function handleTemplatePurchase(session) {
  const { metadata } = session
  await supabase
    .from('template_purchases')
    .insert({
      user_id: metadata.userId,
      template_id: metadata.templateId,
      stripe_payment_intent_id: session.payment_intent,
    })
}

async function handleSubscriptionUpdated(subscription) {
  const { data: existingSubscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('stripe_subscription_id', subscription.id)
    .single()

  if (existingSubscription) {
    await supabase
      .from('subscriptions')
      .update({
        status: subscription.status,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        cancel_at_period_end: subscription.cancel_at_period_end,
      })
      .eq('stripe_subscription_id', subscription.id)
  }
}

async function handleSubscriptionDeleted(subscription) {
  await supabase
    .from('subscriptions')
    .update({
      status: 'canceled',
      plan_type: 'free',
    })
    .eq('stripe_subscription_id', subscription.id)
}

// Analytics Routes
app.post('/analytics/track', async (req, res) => {
  try {
    const { portfolioId, type } = req.body // type: 'view', 'click'
    
    if (!portfolioId || !type) {
      throw new Error('Missing required fields: portfolioId, type')
    }

    const today = new Date().toISOString().split('T')[0]

    // Upsert analytics record for today
    const { data, error } = await supabase
      .from('portfolio_analytics')
      .upsert({
        portfolio_id: portfolioId,
        date: today,
      })
      .select()
      .single()

    if (error) throw error

    if (type === 'view') {
      await supabase
        .from('portfolio_analytics')
        .update({ 
          views: (data?.views || 0) + 1,
          unique_visitors: (data?.unique_visitors || 0) + 1
        })
        .eq('portfolio_id', portfolioId)
        .eq('date', today)
    } else {
      await supabase
        .from('portfolio_analytics')
        .update({ clicks: (data?.clicks || 0) + 1 })
        .eq('portfolio_id', portfolioId)
        .eq('date', today)
    }

    res.json({ data: { success: true }, error: null })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.get('/analytics/:portfolioId', async (req, res) => {
  try {
    const { portfolioId } = req.params
    const { days = 30 } = req.query

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - parseInt(days))
    const startDateStr = startDate.toISOString().split('T')[0]

    const { data, error } = await supabase
      .from('portfolio_analytics')
      .select('*')
      .eq('portfolio_id', portfolioId)
      .gte('date', startDateStr)
      .order('date', { ascending: true })

    if (error) throw error

    const totalViews = data.reduce((sum, record) => sum + (record.views || 0), 0)
    const totalClicks = data.reduce((sum, record) => sum + (record.clicks || 0), 0)
    const totalUniqueVisitors = data.reduce((sum, record) => sum + (record.unique_visitors || 0), 0)

    res.json({ 
      data: {
        daily: data,
        totals: {
          views: totalViews,
          clicks: totalClicks,
          uniqueVisitors: totalUniqueVisitors,
        }
      }, 
      error: null 
    })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Premium Template Routes
app.get('/premium-templates', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    const supabaseClient = getSupabaseClient(req)
    const { data: { user } } = await supabaseClient.auth.getUser(token)

    if (!user) throw new Error('Unauthorized')

    const { data: templates, error } = await supabaseClient
      .from('premium_templates')
      .select('*')
      .eq('is_active', true)

    if (error) throw error

    const { data: purchases } = await supabaseClient
      .from('template_purchases')
      .select('template_id')
      .eq('user_id', user.id)

    const purchasedTemplateIds = purchases?.map(p => p.template_id) || []

    const templatesWithStatus = templates?.map(template => ({
      ...template,
      is_purchased: purchasedTemplateIds.includes(template.id),
      features: template.features || []
    })) || []

    res.json({ data: templatesWithStatus, error: null })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.post('/premium-templates/purchase', async (req, res) => {
  if (!stripe) {
    return res.status(400).json({ error: 'Stripe not configured' })
  }

  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    const supabaseClient = getSupabaseClient(req)
    const { data: { user } } = await supabaseClient.auth.getUser(token)

    if (!user) throw new Error('Unauthorized')

    const { templateId } = req.body

    const { data: template } = await supabaseClient
      .from('premium_templates')
      .select('*')
      .eq('id', templateId)
      .single()

    if (!template) throw new Error('Template not found')

    const { data: existingPurchase } = await supabaseClient
      .from('template_purchases')
      .select('*')
      .eq('user_id', user.id)
      .eq('template_id', templateId)
      .single()

    if (existingPurchase) {
      throw new Error('You already own this template')
    }

    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      payment_method_types: ['card'],
      line_items: [
        {
          price: template.stripe_price_id,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/marketplace?purchase=success`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/marketplace?purchase=canceled`,
      metadata: {
        userId: user.id,
        templateId: templateId,
      },
    })

    res.json({ data: { url: session.url }, error: null })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Custom Domain Routes
app.post('/custom-domains', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    const supabaseClient = getSupabaseClient(req)
    const { data: { user } } = await supabaseClient.auth.getUser(token)

    if (!user) throw new Error('Unauthorized')

    const { domain, portfolioId } = req.body

    if (!domain || !/^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.[a-zA-Z]{2,}$/.test(domain)) {
      throw new Error('Invalid domain format')
    }

    const { data: existing } = await supabaseClient
      .from('custom_domains')
      .select('id')
      .eq('domain', domain)
      .single()

    if (existing) {
      throw new Error('This domain is already in use')
    }

    const { data, error } = await supabaseClient
      .from('custom_domains')
      .insert({
        user_id: user.id,
        portfolio_id: portfolioId,
        domain,
        ssl_status: 'pending',
        verified: false,
      })
      .select()
      .single()

    if (error) throw error

    res.json({ data, error: null })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.get('/custom-domains', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    const supabaseClient = getSupabaseClient(req)
    const { data: { user } } = await supabaseClient.auth.getUser(token)

    if (!user) throw new Error('Unauthorized')

    const { data, error } = await supabaseClient
      .from('custom_domains')
      .select('*')
      .eq('user_id', user.id)

    if (error) throw error

    res.json({ data: data || [], error: null })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.delete('/custom-domains/:id', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    const supabaseClient = getSupabaseClient(req)
    const { data: { user } } = await supabaseClient.auth.getUser(token)

    if (!user) throw new Error('Unauthorized')

    const { id } = req.params

    const { error } = await supabaseClient
      .from('custom_domains')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) throw error

    res.json({ data: { success: true }, error: null })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Bulk Projects Deletion
app.delete('/portfolios/:portfolioId/projects', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    const supabaseClient = getSupabaseClient(req)
    const { data: { user } } = await supabaseClient.auth.getUser(token)

    if (!user) throw new Error('Unauthorized')

    const { portfolioId } = req.params

    const { error } = await supabaseClient
      .from('projects')
      .delete()
      .eq('portfolio_id', portfolioId)

    if (error) throw error

    res.json({ error: null })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Bulk Skills Deletion
app.delete('/portfolios/:portfolioId/skills', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    const supabaseClient = getSupabaseClient(req)
    const { data: { user } } = await supabaseClient.auth.getUser(token)

    if (!user) throw new Error('Unauthorized')

    const { portfolioId } = req.params

    const { error } = await supabaseClient
      .from('skills')
      .delete()
      .eq('portfolio_id', portfolioId)

    if (error) throw error

    res.json({ error: null })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})
