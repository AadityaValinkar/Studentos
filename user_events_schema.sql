-- Standardize user_events table
CREATE TABLE IF NOT EXISTS public.user_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE, -- NULL means single-day event
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Migration: Remove old event_date if it exists
DO $$ 
BEGIN 
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='user_events' AND column_name='event_date') THEN
        ALTER TABLE public.user_events DROP COLUMN event_date;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='user_events' AND column_name='type') THEN
        ALTER TABLE public.user_events ADD COLUMN type TEXT DEFAULT 'EVENT';
    END IF;
END $$;

-- Fix User Reference Constraint manually if the table already existed
ALTER TABLE public.user_events 
DROP CONSTRAINT IF EXISTS user_events_user_id_fkey;

ALTER TABLE public.user_events 
ADD CONSTRAINT user_events_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES auth.users(id) 
ON DELETE CASCADE;

-- Enable RLS
ALTER TABLE public.user_events ENABLE ROW LEVEL SECURITY;

-- Select Policy
DROP POLICY IF EXISTS "Users can view their own events" ON public.user_events;
CREATE POLICY "Users can view their own events" 
ON public.user_events FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

-- Insert Policy
DROP POLICY IF EXISTS "Users can insert their own events" ON public.user_events;
CREATE POLICY "Users can insert their own events" 
ON public.user_events FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- Delete Policy
DROP POLICY IF EXISTS "Users can delete their own events" ON public.user_events;
CREATE POLICY "Users can delete their own events" 
ON public.user_events FOR DELETE 
TO authenticated 
USING (auth.uid() = user_id);

-- Update Policy
DROP POLICY IF EXISTS "Users can update their own events" ON public.user_events;
CREATE POLICY "Users can update their own events" 
ON public.user_events FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
