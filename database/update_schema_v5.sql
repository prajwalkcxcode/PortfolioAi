-- Trigger to automatically create a user profile in public.users when a user signs up via Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, name, email, avatar)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    new.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  
  -- Also initialize default AI credits
  INSERT INTO public.ai_credits (user_id, credits_remaining, credits_used, period_end)
  VALUES (
    new.id,
    50,
    0,
    NOW() + INTERVAL '1 month'
  )
  ON CONFLICT DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add user role column to public.users
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'user';

-- Create teams table
CREATE TABLE IF NOT EXISTS public.teams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  owner_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create team members table
CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'member', -- 'owner', 'admin', 'member'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(team_id, user_id)
);

-- Add team_id to portfolios table for collaboration
ALTER TABLE public.portfolios 
ADD COLUMN IF NOT EXISTS team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL;

-- Enable RLS for teams and team_members
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Policies for teams
CREATE POLICY "Users can view teams they belong to" ON public.teams
  FOR SELECT USING (
    owner_id = auth.uid() OR 
    id IN (SELECT team_id FROM public.team_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can create teams" ON public.teams
  FOR INSERT WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Owners can update teams" ON public.teams
  FOR UPDATE USING (owner_id = auth.uid());

CREATE POLICY "Owners can delete teams" ON public.teams
  FOR DELETE USING (owner_id = auth.uid());

-- Policies for team members
CREATE POLICY "Users can view members of teams they belong to" ON public.team_members
  FOR SELECT USING (
    user_id = auth.uid() OR
    team_id IN (
      SELECT id FROM public.teams WHERE owner_id = auth.uid()
      UNION
      SELECT team_id FROM public.team_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Owners and admins can manage members" ON public.team_members
  FOR ALL USING (
    team_id IN (
      SELECT id FROM public.teams WHERE owner_id = auth.uid()
      UNION
      SELECT team_id FROM public.team_members WHERE user_id = auth.uid() AND role = 'admin'
    )
  );
