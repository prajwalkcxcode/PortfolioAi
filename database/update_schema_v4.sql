-- Add custom styling columns to portfolios table
ALTER TABLE portfolios 
ADD COLUMN IF NOT EXISTS custom_styles JSONB DEFAULT '{"colors": {"primary": "#3b82f6", "secondary": "#1e40af"}, "font": "Inter, sans-serif", "layout": "centered"}';

-- Add SEO fields to portfolios table
ALTER TABLE portfolios 
ADD COLUMN IF NOT EXISTS meta_title TEXT,
ADD COLUMN IF NOT EXISTS meta_description TEXT,
ADD COLUMN IF NOT EXISTS og_image TEXT;

-- Add publishing fields to portfolios table
ALTER TABLE portfolios 
ADD COLUMN IF NOT EXISTS subdomain VARCHAR(100) UNIQUE,
ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS published_at TIMESTAMP WITH TIME ZONE;

-- Create index on subdomain for faster lookups
CREATE INDEX IF NOT EXISTS idx_portfolios_subdomain ON portfolios(subdomain) WHERE is_published = TRUE;

-- Create index on published portfolios
CREATE INDEX IF NOT EXISTS idx_portfolios_published ON portfolios(is_published, published_at) WHERE is_published = TRUE;
