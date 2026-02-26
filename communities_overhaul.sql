-- Communities Overhaul Migration

-- 1. ENUMS
do $$ 
begin
  if not exists (select 1 from pg_type where typname = 'reaction_enum') then
    create type reaction_enum as enum ('insightful', 'strong', 'facts', 'useful', 'motivating');
  end if;
end $$;

-- 2. POSTS TABLE UPDATES
alter table posts drop column if exists upvotes;
alter table posts drop column if exists media_url; -- Replaced by media_path and media_type

do $$ 
begin
  if not exists (select 1 from information_schema.columns where table_name='posts' and column_name='media_path') then
    alter table posts add column media_path text;
  end if;
  if not exists (select 1 from information_schema.columns where table_name='posts' and column_name='media_type') then
    alter table posts add column media_type text;
  end if;
  if not exists (select 1 from information_schema.columns where table_name='posts' and column_name='deleted') then
    alter table posts add column deleted boolean default false;
  end if;
end $$;

-- 3. POST VOTES (Support System)
create table if not exists post_votes (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references posts(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  created_at timestamp default now(),
  unique(post_id, user_id)
);

alter table post_votes enable row level security;

-- 4. POST REACTIONS
create table if not exists post_reactions (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references posts(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  reaction_type reaction_enum not null,
  created_at timestamp default now(),
  unique(post_id, user_id)
);

alter table post_reactions enable row level security;

-- 5. SAVED POSTS (Bookmarks)
create table if not exists saved_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  post_id uuid references posts(id) on delete cascade,
  created_at timestamp default now(),
  unique(user_id, post_id)
);

alter table saved_posts enable row level security;

-- 6. INDEXES
create index if not exists idx_votes_post on post_votes(post_id);
create index if not exists idx_reactions_post on post_reactions(post_id);
create index if not exists idx_posts_community on posts(community_id, created_at desc);
create index if not exists idx_posts_deleted on posts(deleted) where (deleted = false);
create index if not exists idx_saved_posts_user on saved_posts(user_id);

-- 7. POLICIES

-- Post Votes
do $$ begin
    if not exists (select 1 from pg_policies where tablename = 'post_votes' and policyname = 'Users can view all votes') then
        create policy "Users can view all votes" on post_votes for select using (true);
    end if;
    if not exists (select 1 from pg_policies where tablename = 'post_votes' and policyname = 'Users can manage own vote') then
        create policy "Users can manage own vote" on post_votes for all using (auth.uid() = user_id);
    end if;
end $$;

-- Post Reactions
do $$ begin
    if not exists (select 1 from pg_policies where tablename = 'post_reactions' and policyname = 'Users can view all reactions') then
        create policy "Users can view all reactions" on post_reactions for select using (true);
    end if;
    if not exists (select 1 from pg_policies where tablename = 'post_reactions' and policyname = 'Users can manage own reaction') then
        create policy "Users can manage own reaction" on post_reactions for all using (auth.uid() = user_id);
    end if;
end $$;

-- Saved Posts
do $$ begin
    if not exists (select 1 from pg_policies where tablename = 'saved_posts' and policyname = 'Users can view own saved posts') then
        create policy "Users can view own saved posts" on saved_posts for select using (auth.uid() = user_id);
    end if;
    if not exists (select 1 from pg_policies where tablename = 'saved_posts' and policyname = 'Users can manage own saved posts') then
        create policy "Users can manage own saved posts" on saved_posts for all using (auth.uid() = user_id);
    end if;
end $$;

-- Update existing Posts policy to respect deleted flag
drop policy if exists "Users can view posts" on posts;
create policy "Users can view posts" on posts for select using (deleted = false);
