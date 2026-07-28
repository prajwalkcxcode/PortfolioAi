-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  stripe_customer_id VARCHAR(255),
  stripe_subscription_id VARCHAR(255) UNIQUE,
  stripe_price_id VARCHAR(255),
  status VARCHAR(50) DEFAULT 'active',
  plan_type VARCHAR(50) DEFAULT 'free',
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create pricing plans table
CREATE TABLE IF NOT EXISTS pricing_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  interval VARCHAR(20) DEFAULT 'month',
  stripe_price_id VARCHAR(255) UNIQUE,
  features JSONB,
  ai_credits_per_month INTEGER DEFAULT 50,
  max_portfolios INTEGER DEFAULT 1,
  premium_templates BOOLEAN DEFAULT FALSE,
  custom_domains BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create AI credits table
CREATE TABLE IF NOT EXISTS ai_credits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  credits_remaining INTEGER DEFAULT 50,
  credits_used INTEGER DEFAULT 0,
  period_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create premium templates table
CREATE TABLE IF NOT EXISTS premium_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  preview_image TEXT,
  price DECIMAL(10, 2) NOT NULL,
  stripe_price_id VARCHAR(255) UNIQUE,
  template_file TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create template purchases table
CREATE TABLE IF NOT EXISTS template_purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  template_id UUID REFERENCES premium_templates(id) ON DELETE CASCADE,
  stripe_payment_intent_id VARCHAR(255),
  purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create analytics table
CREATE TABLE IF NOT EXISTS portfolio_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE,
  views INTEGER DEFAULT 0,
  unique_visitors INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(portfolio_id, date)
);

-- Create custom domains table
CREATE TABLE IF NOT EXISTS custom_domains (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE,
  domain VARCHAR(255) UNIQUE NOT NULL,
  ssl_status VARCHAR(50) DEFAULT 'pending',
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default pricing plans
INSERT INTO pricing_plans (name, slug, description, price, interval, features, ai_credits_per_month, max_portfolios, premium_templates, custom_domains) VALUES
('Free', 'free', 'Perfect for getting started', 0, 'month', '["1 portfolio", "50 AI credits/month", "Basic templates", "portfolioai.com subdomain"]'::jsonb, 50, 1, FALSE, FALSE),
('Pro', 'pro', 'For professionals and businesses', 29, 'month', '["Unlimited portfolios", "500 AI credits/month", "Premium templates", "Custom domains", "Priority support"]'::jsonb, 500, -1, TRUE, TRUE)
ON CONFLICT (slug) DO NOTHING;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_sub_id ON subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_ai_credits_user_id ON ai_credits(user_id);
CREATE INDEX IF NOT EXISTS idx_template_purchases_user_id ON template_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_analytics_portfolio_id ON portfolio_analytics(portfolio_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_analytics_date ON portfolio_analytics(date);
CREATE INDEX IF NOT EXISTS idx_custom_domains_user_id ON custom_domains(user_id);
CREATE INDEX IF NOT EXISTS idx_custom_domains_domain ON custom_domains(domain);
