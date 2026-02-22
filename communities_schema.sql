-- 1. Enable Extensions
create extension if not exists "pgcrypto";

-- 2. PROFILES (Permanent Identity Layer)
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  global_username text unique not null,
  avatar_url text,
  reputation integer default 0,
  created_at timestamp default now()
);

alter table profiles enable row level security;

-- Profiles RLS
create policy "Users insert own profile"
on profiles
for insert
with check (auth.uid() = id);

create policy "Users update own profile"
on profiles
for update
using (auth.uid() = id);

create policy "Profiles are public"
on profiles
for select
using (true);

-- 3. COMMUNITIES (Open Creation Allowed)
create table communities (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  description text,
  icon text,
  created_by uuid references profiles(id) on delete cascade,
  is_private boolean default false,
  member_count integer default 0,
  created_at timestamp default now()
);

alter table communities enable row level security;

-- Communities RLS
create policy "Anyone can view communities"
on communities
for select
using (true);

create policy "Authenticated users can create communities"
on communities
for insert
with check (auth.uid() = created_by);

-- 4. COMMUNITY MEMBERS
create table community_members (
  id uuid primary key default gen_random_uuid(),
  community_id uuid references communities(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  community_alias text,
  role text default 'member',
  joined_at timestamp default now(),
  unique (community_id, user_id)
);

alter table community_members enable row level security;

-- Community Members RLS
create policy "Users can join communities"
on community_members
for insert
with check (auth.uid() = user_id);

create policy "Users can view members"
on community_members
for select
using (true);

create policy "Users can leave communities"
on community_members
for delete
using (auth.uid() = user_id);

-- 5. POSTS
create table posts (
  id uuid primary key default gen_random_uuid(),
  community_id uuid references communities(id) on delete cascade,
  author_id uuid references profiles(id) on delete cascade,
  content text not null,
  media_url text,
  upvotes integer default 0,
  deleted boolean default false,
  created_at timestamp default now()
);

create index idx_posts_created_at on posts(created_at desc);

alter table posts enable row level security;

-- Posts RLS (CRITICAL)
create policy "Users can view posts"
on posts
for select
using (deleted = false);

create policy "Users can post only if member"
on posts
for insert
with check (
  exists (
    select 1 from community_members
    where community_members.community_id = posts.community_id
    and community_members.user_id = auth.uid()
  )
);

create policy "Users can delete own posts"
on posts
for update
using (auth.uid() = author_id);

-- 6. COMMENTS
create table comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references posts(id) on delete cascade,
  author_id uuid references profiles(id) on delete cascade,
  content text not null,
  deleted boolean default false,
  created_at timestamp default now()
);

alter table comments enable row level security;

-- Comments RLS
create policy "Users can view comments"
on comments
for select
using (deleted = false);

create policy "Users can comment only if member"
on comments
for insert
with check (
  exists (
    select 1
    from posts
    join community_members
      on community_members.community_id = posts.community_id
    where posts.id = comments.post_id
    and community_members.user_id = auth.uid()
  )
);

create policy "Users can delete own comments"
on comments
for update
using (auth.uid() = author_id);

-- 7. Pre-seed Default Communities
-- We will pre-seed after the tables exist, but you can run these inserts:
-- Wait to insert until a 'system' profile exists, or leave created_by as null for system communities.
-- To allow null created_by for system communities, we can alter the created_by column to allow nulls (which it does by default).

insert into communities (name, description, is_private, icon) values 
('Coding', 'Algorithms, LeetCode, Hackathons, and Web Dev.', false, '💻'),
('Gaming', 'Valorant, CS:GO, FIFA, and everything gaming.', false, '🎮'),
('Placements', 'Interview prep, referrals, and CTC discussions.', false, '💼'),
('GATE 2026', 'Preparation strategies, notes, and serious discussions.', false, '📚'),
('Campus Memes', 'The unofficial stress-relief zone.', false, '🤡'),
('Doubts', 'Stuck on an assignment? Ask anonymously here.', false, '❓')
on conflict (name) do nothing;
