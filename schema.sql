-- Supabase Schema Migration for StudentOS

-- 1. Create Users Table
CREATE TABLE public.users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  image TEXT,
  attendance JSONB DEFAULT '{"totalClasses": 0, "attendedClasses": 0, "targetPercentage": 75}'::jsonb,
  skills JSONB DEFAULT '[]'::jsonb,
  projects JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create User Events Table (Custom Calendar Entries)
CREATE TABLE public.user_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  type TEXT DEFAULT 'CUSTOM'::text CHECK (type IN ('CUSTOM', 'MAJOR_EXAM', 'REMINDER')),
  priority TEXT DEFAULT 'LOW'::text CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
  is_pinned BOOLEAN DEFAULT false,
  description TEXT,
  color TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Event Overrides Table (Hiding System Academic Events)
CREATE TABLE public.event_overrides (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  academic_event_id TEXT NOT NULL,
  hidden BOOLEAN DEFAULT false,
  replaced_with TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, academic_event_id)
);

-- Enable Row Level Security (RLS) for all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_overrides ENABLE ROW LEVEL SECURITY;

-- Important: Since we are querying server-side bypassing RLS with a service role / API key for now (NextAuth API paradigm), 
-- you can leave RLS enabled unconditionally for protection but allow admin override internally. Alternatively, create permissive policies.
-- By default, without policies, RLS blocks all client-side browser reads/writes.
