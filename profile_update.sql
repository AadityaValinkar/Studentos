-- Refactor Profile System into Progressive Completion Architecture

-- 1. Extend profiles table with new optional fields
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS branch TEXT,
ADD COLUMN IF NOT EXISTS career_goal TEXT,
ADD COLUMN IF NOT EXISTS skills TEXT[] DEFAULT '{}';

-- 2. Update RLS policies to be more permissive and secure
-- Users can view all profiles (needed for community features)
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
CREATE POLICY "Public profiles are viewable by everyone" 
ON profiles FOR SELECT 
USING (true);

-- Users can only update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Users can insert their own profile
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" 
ON profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- 3. Diagnostic View (Internal use)
-- COMMENTED OUT: SELECT * FROM profiles LIMIT 5;
