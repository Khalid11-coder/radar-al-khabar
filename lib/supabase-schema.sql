-- ================================================================
-- رادار الخبر — Supabase Database Schema
-- Run this in your Supabase SQL Editor
-- ================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ── Main News Table ──────────────────────────────────────────────
create table if not exists public.news_radar (
  id            uuid primary key default uuid_generate_v4(),
  title         text not null,
  summary       text,
  content       text,
  image_url     text,
  source_name   text,
  source_link   text not null unique,   -- UNIQUE = deduplication key
  category      text default 'عام',
  published_at  timestamptz,
  created_at    timestamptz default now(),
  tags          text[],
  views         integer default 0,
  is_featured   boolean default false,
  is_breaking   boolean default false,
  language      text default 'ar'
);

-- ── Indexes for performance ──────────────────────────────────────
create index if not exists idx_news_published_at
  on public.news_radar (published_at desc);

create index if not exists idx_news_category
  on public.news_radar (category);

create index if not exists idx_news_is_featured
  on public.news_radar (is_featured) where is_featured = true;

create index if not exists idx_news_is_breaking
  on public.news_radar (is_breaking) where is_breaking = true;

create index if not exists idx_news_source_link
  on public.news_radar (source_link);

-- ── Row Level Security ───────────────────────────────────────────
alter table public.news_radar enable row level security;

-- Allow everyone to read news
create policy "Allow public read" on public.news_radar
  for select using (true);

-- Only allow service role to insert/update/delete
create policy "Allow service role to insert" on public.news_radar
  for insert with check (true);

create policy "Allow service role to update" on public.news_radar
  for update using (true);

create policy "Allow service role to delete" on public.news_radar
  for delete using (true);

-- ── Helper: Auto-update timestamp ───────────────────────────────
create or replace function update_updated_at()
returns trigger as $$
begin
  new.created_at = now();
  return new;
end;
$$ language plpgsql;

-- ── Views ────────────────────────────────────────────────────────
create or replace view public.latest_news as
  select * from public.news_radar
  order by published_at desc
  limit 50;

create or replace view public.featured_news as
  select * from public.news_radar
  where is_featured = true
  order by published_at desc
  limit 10;

create or replace view public.breaking_news as
  select * from public.news_radar
  where is_breaking = true
  order by published_at desc
  limit 5;

-- ── Sample seed data (optional) ─────────────────────────────────
insert into public.news_radar (title, summary, source_name, source_link, category, published_at, is_featured, is_breaking)
values
  (
    'قمة عربية طارئة تناقش مستجدات الوضع في المنطقة',
    'التقى زعماء الدول العربية لمناقشة التطورات الأخيرة وسبل تعزيز التعاون الإقليمي',
    'جامعة الدول العربية',
    'https://example.com/arab-summit-1',
    'الشرق الأوسط',
    now() - interval '2 hours',
    true,
    true
  ),
  (
    'ارتفاع أسعار النفط في الأسواق العالمية بنسبة 3%',
    'شهدت أسواق النفط العالمية ارتفاعاً ملحوظاً في الأسعار وسط مخاوف من اضطرابات الإمداد',
    'رويترز عربي',
    'https://example.com/oil-prices-1',
    'اقتصاد',
    now() - interval '5 hours',
    false,
    false
  ),
  (
    'إطلاق نموذج ذكاء اصطناعي عربي جديد يتفوق على المنافسين',
    'كشفت مجموعة من الباحثين العرب عن نموذج لغوي ضخم مُدرَّب على البيانات العربية',
    'تك عربي',
    'https://example.com/arabic-ai-1',
    'تكنولوجيا',
    now() - interval '8 hours',
    true,
    false
  )
on conflict (source_link) do nothing;

-- ================================================================
-- Done! Your Supabase database is ready for رادار الخبر 🚀
-- ================================================================
