-- RUN THIS IN THE SUPABASE SQL EDITOR TO REPAIR THE SCHEMA

-- 1. Ensure the reaction_enum exists
DO $$ BEGIN
    CREATE TYPE reaction_enum AS ENUM ('insightful', 'strong', 'facts', 'useful', 'motivating');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Ensure posts table has required columns
ALTER TABLE posts ADD COLUMN IF NOT EXISTS media_path text;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS media_type text;

-- 3. Repair post_votes Table & Relationships
CREATE TABLE IF NOT EXISTS post_votes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id uuid,
    user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    created_at timestamp DEFAULT now(),
    UNIQUE(post_id, user_id)
);

-- Explicitly add the foreign key if it's missing
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'post_votes_post_id_fkey') THEN
        ALTER TABLE post_votes 
        ADD CONSTRAINT post_votes_post_id_fkey 
        FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE;
    END IF;
END $$;

-- 4. Repair post_reactions Table & Relationships
CREATE TABLE IF NOT EXISTS post_reactions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id uuid,
    user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    reaction_type reaction_enum NOT NULL,
    created_at timestamp DEFAULT now(),
    UNIQUE(post_id, user_id)
);

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'post_reactions_post_id_fkey') THEN
        ALTER TABLE post_reactions 
        ADD CONSTRAINT post_reactions_post_id_fkey 
        FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE;
    END IF;
END $$;

-- 5. Repair saved_posts Table & Relationships
CREATE TABLE IF NOT EXISTS saved_posts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id uuid,
    user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    created_at timestamp DEFAULT now(),
    UNIQUE(post_id, user_id)
);

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'saved_posts_post_id_fkey') THEN
        ALTER TABLE saved_posts 
        ADD CONSTRAINT saved_posts_post_id_fkey 
        FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE;
    END IF;
END $$;

-- 6. Enable RLS & Basic Select Policies
ALTER TABLE post_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view votes" ON post_votes;
CREATE POLICY "Anyone can view votes" ON post_votes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can view reactions" ON post_reactions;
CREATE POLICY "Anyone can view reactions" ON post_reactions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can view their own saved posts" ON saved_posts;
CREATE POLICY "Users can view their own saved posts" ON saved_posts FOR SELECT USING (auth.uid() = user_id);

-- 7. STORAGE POLICIES (Fixes RLS error)
-- Ensure the bucket exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('community-media', 'community-media', false)
ON CONFLICT (id) DO NOTHING;

-- Policy: Allow authenticated users to upload files
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'community-media');

-- Policy: Allow authenticated users to view files
DROP POLICY IF EXISTS "Allow authenticated viewing" ON storage.objects;
CREATE POLICY "Allow authenticated viewing"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'community-media');

-- Policy: Allow users to delete their own uploads
DROP POLICY IF EXISTS "Allow individual delete" ON storage.objects;
CREATE POLICY "Allow individual delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'community-media' AND (storage.foldername(name))[1] = auth.uid()::text);
-- Note: Simplified delete check. In a production app, owner column or folder name check is best.
