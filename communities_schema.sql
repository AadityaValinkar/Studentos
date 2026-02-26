-- 1. ENUMS
do $$ 
begin
  if not exists (select 1 from pg_type where typname = 'reaction_enum') then
    create type reaction_enum as enum ('insightful', 'strong', 'facts', 'useful', 'motivating');
  end if;
end $$;

-- 2. Enable Extensions
create extension if not exists "pgcrypto";

-- 3. PROFILES (Permanent Identity Layer)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  global_username text unique not null,
  avatar_url text,
  reputation integer default 0,
  created_at timestamp default now()
);

-- Safely add reputation if table already existed but didn't have it
do $$ 
begin
  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='profiles' and column_name='reputation') then
    alter table profiles add column reputation integer default 0;
  end if;
end $$;

alter table profiles enable row level security;

-- 4. COMMUNITIES (Open Creation Allowed)
create table if not exists communities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  icon text,
  created_by uuid references profiles(id) on delete cascade,
  is_private boolean default false,
  member_count integer default 0,
  created_at timestamp default now()
);

-- Safely add slug column if table already existed without it (for backward compatibility during dev)
do $$ 
begin
  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='communities' and column_name='slug') then
    alter table communities add column slug text unique;
  end if;
end $$;

alter table communities enable row level security;

-- 5. COMMUNITY MEMBERS
create table if not exists community_members (
  id uuid primary key default gen_random_uuid(),
  community_id uuid references communities(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  community_alias text,
  role text default 'member',
  joined_at timestamp default now(),
  unique (community_id, user_id)
);

alter table community_members enable row level security;

-- 6. POSTS
create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  community_id uuid references communities(id) on delete cascade,
  author_id uuid references profiles(id) on delete cascade,
  content text not null,
  media_path text,
  media_type text,
  deleted boolean default false,
  created_at timestamp default now()
);

alter table posts enable row level security;

-- 7. COMMENTS
create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references posts(id) on delete cascade,
  author_id uuid references profiles(id) on delete cascade,
  content text not null,
  deleted boolean default false,
  created_at timestamp default now()
);

alter table comments enable row level security;

-- 8. POST VOTES (Support System)
create table if not exists post_votes (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references posts(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  created_at timestamp default now(),
  unique(post_id, user_id)
);

alter table post_votes enable row level security;

-- 9. POST REACTIONS
create table if not exists post_reactions (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references posts(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  reaction_type reaction_enum not null,
  created_at timestamp default now(),
  unique(post_id, user_id)
);

alter table post_reactions enable row level security;

-- 10. SAVED POSTS (Bookmarks)
create table if not exists saved_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  post_id uuid references posts(id) on delete cascade,
  created_at timestamp default now(),
  unique(user_id, post_id)
);

alter table saved_posts enable row level security;

-- 11. INDEXES
create index if not exists idx_posts_created_at on posts(created_at desc);
create index if not exists idx_votes_post on post_votes(post_id);
create index if not exists idx_reactions_post on post_reactions(post_id);
create index if not exists idx_posts_community on posts(community_id, created_at desc);
create index if not exists idx_posts_deleted on posts(deleted) where (deleted = false);
create index if not exists idx_saved_posts_user on saved_posts(user_id);

-- 12. POLICIES
do $$
begin
    -- Profiles policies
    if not exists (select 1 from pg_policies where tablename = 'profiles' and policyname = 'Users insert own profile') then
        create policy "Users insert own profile" on profiles for insert with check (auth.uid() = id);
        create policy "Users update own profile" on profiles for update using (auth.uid() = id);
        create policy "Profiles are public" on profiles for select using (true);
    end if;

    -- Communities policies
    if not exists (select 1 from pg_policies where tablename = 'communities' and policyname = 'Anyone can view communities') then
        create policy "Anyone can view communities" on communities for select using (true);
        create policy "Authenticated users can create communities" on communities for insert with check (auth.uid() = created_by);
    end if;

    -- Community Members policies
    if not exists (select 1 from pg_policies where tablename = 'community_members' and policyname = 'Users can join communities') then
        create policy "Users can join communities" on community_members for insert with check (auth.uid() = user_id);
        create policy "Users can view members" on community_members for select using (true);
        create policy "Users can leave communities" on community_members for delete using (auth.uid() = user_id);
    end if;

    -- Posts policies
    drop policy if exists "Users can view posts" on posts;
    create policy "Users can view posts" on posts for select using (deleted = false);
    
    if not exists (select 1 from pg_policies where tablename = 'posts' and policyname = 'Users can post only if member') then
        create policy "Users can post only if member" on posts for insert with check (
            exists (
                select 1 from community_members
                where community_members.community_id = posts.community_id
                and community_members.user_id = auth.uid()
            )
        );
        create policy "Users can delete own posts" on posts for update using (auth.uid() = author_id);
    end if;

    -- Comments policies
    if not exists (select 1 from pg_policies where tablename = 'comments' and policyname = 'Users can view comments') then
        create policy "Users can view comments" on comments for select using (deleted = false);
        create policy "Users can comment only if member" on comments for insert with check (
            exists (
                select 1 from posts join community_members on community_members.community_id = posts.community_id
                where posts.id = comments.post_id and community_members.user_id = auth.uid()
            )
        );
        create policy "Users can delete own comments" on comments for update using (auth.uid() = author_id);
    end if;

    -- Post Votes
    if not exists (select 1 from pg_policies where tablename = 'post_votes' and policyname = 'Users can view all votes') then
        create policy "Users can view all votes" on post_votes for select using (true);
        create policy "Users can manage own vote" on post_votes for all using (auth.uid() = user_id);
    end if;

    -- Post Reactions
    if not exists (select 1 from pg_policies where tablename = 'post_reactions' and policyname = 'Users can view all reactions') then
        create policy "Users can view all reactions" on post_reactions for select using (true);
        create policy "Users can manage own reaction" on post_reactions for all using (auth.uid() = user_id);
    end if;

    -- Saved Posts
    if not exists (select 1 from pg_policies where tablename = 'saved_posts' and policyname = 'Users can view own saved posts') then
        create policy "Users can view own saved posts" on saved_posts for select using (auth.uid() = user_id);
        create policy "Users can manage own saved posts" on saved_posts for all using (auth.uid() = user_id);
    end if;
end $$;

-- 13. Pre-seed Default Communities
-- We will pre-seed after the tables exist, but you can run these inserts:
-- Wait to insert until a 'system' profile exists, or leave created_by as null for system communities.
-- To allow null created_by for system communities, we can alter the created_by column to allow nulls (which it does by default).

insert into communities (name, slug, description, is_private, icon) values 
('Coding', 'coding', 'Algorithms, LeetCode, Hackathons, and Web Dev.', false, '💻'),
('Gaming', 'gaming', 'Valorant, CS:GO, FIFA, and everything gaming.', false, '🎮'),
('Placements', 'placements', 'Interview prep, referrals, and CTC discussions.', false, '💼'),
('GATE 2026', 'gate-2026', 'Preparation strategies, notes, and serious discussions.', false, '📚'),
('Campus Memes', 'campus-memes', 'The unofficial stress-relief zone.', false, '🤡'),
('Doubts', 'doubts', 'Stuck on an assignment? Ask anonymously here.', false, '❓')
on conflict on constraint communities_name_key
do update set
    slug = excluded.slug,
    description = excluded.description,
    is_private = excluded.is_private,
    icon = excluded.icon;

-- To allow null created_by for system communities, we can alter the created_by column to allow nulls (which it does by default).

insert into communities (name, slug, description, icon, is_private, created_by) values 
('The Codebase', 'the-codebase', 'For CS students hacking through the night.', '💻', false, '00000000-0000-0000-0000-000000000000'),
('Design Club', 'design-club', 'Figma, UX, UI, and aesthetics.', '🎨', false, '00000000-0000-0000-0000-000000000000'),
('Late Night Library', 'late-night-library', 'Cramming for exams? Vent here.', '📚', false, '00000000-0000-0000-0000-000000000000'),
('Placement Prep', 'placement-prep', 'Interview questions, LeetCode, and salaries.', '💼', false, '00000000-0000-0000-0000-000000000000')
ON CONFLICT ON CONSTRAINT communities_name_key DO UPDATE SET
  slug = EXCLUDED.slug,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon;

-- 6. Trigger for User Count Synchronization
CREATE OR REPLACE FUNCTION update_community_member_count()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        UPDATE communities
        SET member_count = member_count + 1
        WHERE id = NEW.community_id;
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        UPDATE communities
        SET member_count = member_count - 1
        WHERE id = OLD.community_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS community_member_count_trigger ON community_members;

CREATE TRIGGER community_member_count_trigger
AFTER INSERT OR DELETE ON community_members
FOR EACH ROW
EXECUTE FUNCTION update_community_member_count();
