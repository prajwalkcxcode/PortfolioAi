import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'
import {
  generateHeroSection,
  generateAboutSection,
  improveProject,
  generateResumeSummary,
  getUsageStats,
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

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

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

    // Create user profile in users table
    if (data.user) {
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: data.user.id,
          email: data.user.email,
          name: name,
          avatar: null
        })

      if (profileError) console.error('Profile creation error:', profileError)
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
    
    const { data, error } = await supabase.auth.getUser(token)

    if (error) throw error

    // Get user profile from users table
    if (data.user) {
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single()

      if (profileError) throw profileError

      res.json({ user: { ...data.user, profile }, error: null })
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
    const { data: { user } } = await supabase.auth.getUser(token)

    if (!user) throw new Error('Unauthorized')

    const { data, error } = await supabase
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
    const { data: { user } } = await supabase.auth.getUser(token)

    if (!user) throw new Error('Unauthorized')

    const { template, theme, bio, personal_info, custom_styles, meta_title, meta_description, og_image } = req.body

    const { data, error } = await supabase
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
    const { data: { user } } = await supabase.auth.getUser(token)

    if (!user) throw new Error('Unauthorized')

    const { id } = req.params
    const { template, theme, bio, personal_info, custom_styles, meta_title, meta_description, og_image } = req.body

    const { data, error } = await supabase
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
    const { data: { user } } = await supabase.auth.getUser(token)

    if (!user) throw new Error('Unauthorized')

    const { id } = req.params
    const { subdomain } = req.body

    // Validate subdomain
    if (!subdomain || !/^[a-z0-9-]{3,30}$/.test(subdomain)) {
      throw new Error('Invalid subdomain. Must be 3-30 characters, lowercase letters, numbers, and hyphens only.')
    }

    // Check if subdomain is already taken
    const { data: existing } = await supabase
      .from('portfolios')
      .select('id')
      .eq('subdomain', subdomain)
      .single()

    if (existing) {
      throw new Error('This subdomain is already taken. Please choose another.')
    }

    // Update portfolio with subdomain and publish status
    const { data, error } = await supabase
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
    const { data: { user } } = await supabase.auth.getUser(token)

    if (!user) throw new Error('Unauthorized')

    const { id } = req.params

    const { data, error } = await supabase
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
    const { data: { user } } = await supabase.auth.getUser(token)

    if (!user) throw new Error('Unauthorized')

    const { id } = req.params

    const { error } = await supabase
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
      .order('created_at', { ascending: false })

    if (error) throw error

    res.json({ data, error: null })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.post('/projects', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    const { data: { user } } = await supabase.auth.getUser(token)

    if (!user) throw new Error('Unauthorized')

    const { portfolio_id, title, description, technologies, github_url, live_url, image_url } = req.body

    const { data, error } = await supabase
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
    const { data: { user } } = await supabase.auth.getUser(token)

    if (!user) throw new Error('Unauthorized')

    const { id } = req.params
    const { title, description, technologies, github_url, live_url, image_url } = req.body

    const { data, error } = await supabase
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
    const { data: { user } } = await supabase.auth.getUser(token)

    if (!user) throw new Error('Unauthorized')

    const { id } = req.params

    const { error } = await supabase
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
      .order('created_at', { ascending: false })

    if (error) throw error

    res.json({ data, error: null })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.post('/skills', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    const { data: { user } } = await supabase.auth.getUser(token)

    if (!user) throw new Error('Unauthorized')

    const { portfolio_id, skill_name, level, category } = req.body

    const { data, error } = await supabase
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
    const { data: { user } } = await supabase.auth.getUser(token)

    if (!user) throw new Error('Unauthorized')

    const { id } = req.params
    const { skill_name, level, category } = req.body

    const { data, error } = await supabase
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
    const { data: { user } } = await supabase.auth.getUser(token)

    if (!user) throw new Error('Unauthorized')

    const { id } = req.params

    const { error } = await supabase
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
    console.log('Headers received:', req.headers)
    const token = req.headers.authorization?.replace('Bearer ', '')
    console.log('Token extracted:', token ? 'exists' : 'missing')
    
    const { data: { user } } = await supabase.auth.getUser(token)

    if (!user) throw new Error('Unauthorized')

    const { name, role, skills, experience } = req.body

    if (!name || !role || !skills) {
      throw new Error('Missing required fields: name, role, skills')
    }

    const result = await generateAboutSection(name, role, skills, experience, user.id)
    res.json({ data: result, error: null })
  } catch (error) {
    console.error('AI generation error:', error)
    res.status(400).json({ error: error.message })
  }
})

app.post('/ai/improve-project', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    const { data: { user } } = await supabase.auth.getUser(token)

    if (!user) throw new Error('Unauthorized')

    const { projectName, technologies } = req.body

    if (!projectName || !technologies) {
      throw new Error('Missing required fields: projectName, technologies')
    }

    const result = await improveProject(projectName, technologies, user.id)
    res.json({ data: result, error: null })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.post('/ai/generate-resume-summary', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    const { data: { user } } = await supabase.auth.getUser(token)

    if (!user) throw new Error('Unauthorized')

    const { name, role, skills, experience } = req.body

    if (!name || !role || !skills) {
      throw new Error('Missing required fields: name, role, skills')
    }

    const result = await generateResumeSummary(name, role, skills, experience, user.id)
    res.json({ data: result, error: null })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.get('/ai/usage', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    const { data: { user } } = await supabase.auth.getUser(token)

    if (!user) throw new Error('Unauthorized')

    const stats = getUsageStats(user.id)
    res.json({ data: stats, error: null })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Stripe Subscription Routes
app.post('/subscriptions/create-checkout-session', async (req, res) => {
  if (!stripe) {
    return res.status(400).json({ error: 'Stripe not configured' })
  }

  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    const { data: { user } } = await supabase.auth.getUser(token)

    if (!user) throw new Error('Unauthorized')

    const { priceId } = req.body

    // Get or create Stripe customer
    let customerId
    const { data: existingSubscription } = await supabase
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
      success_url: `${process.env.FRONTEND_URL}/dashboard?subscription=success`,
      cancel_url: `${process.env.FRONTEND_URL}/pricing?subscription=canceled`,
    })

    res.json({ data: { url: session.url }, error: null })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.post('/subscriptions/cancel', async (req, res) => {
  if (!stripe) {
    return res.status(400).json({ error: 'Stripe not configured' })
  }

  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    const { data: { user } } = await supabase.auth.getUser(token)

    if (!user) throw new Error('Unauthorized')

    const { data: subscription } = await supabase
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

    await supabase
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
    const { data: { user } } = await supabase.auth.getUser(token)

    if (!user) throw new Error('Unauthorized')

    const { data: subscription } = await supabase
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
      const session = event.data.object
      // Handle successful checkout
      await handleCheckoutSessionCompleted(session)
      break
    case 'customer.subscription.updated':
      const subscription = event.data.object
      await handleSubscriptionUpdated(subscription)
      break
    case 'customer.subscription.deleted':
      const deletedSubscription = event.data.object
      await handleSubscriptionDeleted(deletedSubscription)
      break
    case 'checkout.session.async_payment_succeeded':
      const asyncSession = event.data.object
      await handleCheckoutSessionCompleted(asyncSession)
      break
    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  res.json({ received: true })
})

async function handleCheckoutSessionCompleted(session) {
  const { customer, subscription: stripeSubscriptionId, metadata } = session
  
  // Check if this is a template purchase (one-time payment)
  if (metadata?.templateId && metadata?.userId) {
    await handleTemplatePurchase(session)
    return
  }
  
  // Get user from customer metadata
  const customerData = await stripe.customers.retrieve(customer)
  const userId = customerData.metadata.userId

  // Get subscription details
  const subscription = await stripe.subscriptions.retrieve(stripeSubscriptionId)
  const priceId = subscription.items.data[0].price.id

  // Get pricing plan
  const { data: pricingPlan } = await supabase
    .from('pricing_plans')
    .select('*')
    .eq('stripe_price_id', priceId)
    .single()

  // Create or update subscription
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

  // Initialize AI credits
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
  
  // Record the template purchase
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

    // Upsert analytics record
    const { data, error } = await supabase
      .from('portfolio_analytics')
      .upsert({
        portfolio_id: portfolioId,
        date: today,
      })
      .select()
      .single()

    if (error) throw error

    // Increment the appropriate counter
    const updateData = type === 'view' 
      ? { views: (data?.views || 0) + 1 }
      : { clicks: (data?.clicks || 0) + 1 }

    if (type === 'view') {
      await supabase
        .from('portfolio_analytics')
        .update({ 
          views: (data?.views || 0) + 1,
          unique_visitors: (data?.unique_visitors || 0) + 1 // Simplified for now
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

    // Aggregate data
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
    const { data: { user } } = await supabase.auth.getUser(token)

    if (!user) throw new Error('Unauthorized')

    // Get all premium templates
    const { data: templates, error } = await supabase
      .from('premium_templates')
      .select('*')
      .eq('is_active', true)

    if (error) throw error

    // Check which templates the user has purchased
    const { data: purchases } = await supabase
      .from('template_purchases')
      .select('template_id')
      .eq('user_id', user.id)

    const purchasedTemplateIds = purchases?.map(p => p.template_id) || []

    // Add purchase status to each template
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
    const { data: { user } } = await supabase.auth.getUser(token)

    if (!user) throw new Error('Unauthorized')

    const { templateId } = req.body

    // Get template details
    const { data: template } = await supabase
      .from('premium_templates')
      .select('*')
      .eq('id', templateId)
      .single()

    if (!template) throw new Error('Template not found')

    // Check if already purchased
    const { data: existingPurchase } = await supabase
      .from('template_purchases')
      .select('*')
      .eq('user_id', user.id)
      .eq('template_id', templateId)
      .single()

    if (existingPurchase) {
      throw new Error('You already own this template')
    }

    // Create Stripe checkout session for one-time payment
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
      success_url: `${process.env.FRONTEND_URL}/marketplace?purchase=success`,
      cancel_url: `${process.env.FRONTEND_URL}/marketplace?purchase=canceled`,
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
    const { data: { user } } = await supabase.auth.getUser(token)

    if (!user) throw new Error('Unauthorized')

    const { domain, portfolioId } = req.body

    // Validate domain format
    if (!domain || !/^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.[a-zA-Z]{2,}$/.test(domain)) {
      throw new Error('Invalid domain format')
    }

    // Check if domain is already taken
    const { data: existing } = await supabase
      .from('custom_domains')
      .select('id')
      .eq('domain', domain)
      .single()

    if (existing) {
      throw new Error('This domain is already in use')
    }

    // Create custom domain record
    const { data, error } = await supabase
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
    const { data: { user } } = await supabase.auth.getUser(token)

    if (!user) throw new Error('Unauthorized')

    const { data, error } = await supabase
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
    const { data: { user } } = await supabase.auth.getUser(token)

    if (!user) throw new Error('Unauthorized')

    const { id } = req.params

    const { error } = await supabase
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

