#!/usr/bin/env node
/**
 * =========================================================
 * رادار الخبر — News Auto-Feeder Script
 * =========================================================
 * Fetches Arabic news from NewsAPI and saves to Supabase.
 * Run via: node scripts/news-feeder.js
 * Scheduled via: GitHub Actions every 30 minutes
 * =========================================================
 */

const { createClient } = require('@supabase/supabase-js')
const axios = require('axios')

// ── Config ──────────────────────────────────────────────
const NEWS_API_KEY = process.env.NEWS_API_KEY || 'eea864e38578439fba48f9fc239598ea'
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const BASE_URL = 'https://newsapi.org/v2'

// Category configurations
const FEED_CATEGORIES = [
  {
    slug: 'middle-east',
    label: 'الشرق الأوسط',
    query: 'الشرق الأوسط OR عرب OR Middle East',
    pageSize: 20,
  },
  {
    slug: 'conflicts',
    label: 'حروب ونزاعات',
    query: 'حرب OR نزاع OR conflict OR war OR عملية عسكرية',
    pageSize: 15,
  },
  {
    slug: 'economy',
    label: 'اقتصاد',
    query: 'اقتصاد OR نفط OR بورصة OR economy OR oil',
    pageSize: 15,
  },
  {
    slug: 'technology',
    label: 'تكنولوجيا',
    query: 'تكنولوجيا OR ذكاء اصطناعي OR technology OR AI OR تقنية',
    pageSize: 15,
  },
]

// ── Helpers ──────────────────────────────────────────────
function log(level, message, ...args) {
  const icons = { info: 'ℹ️', success: '✅', warn: '⚠️', error: '❌', start: '🚀' }
  const timestamp = new Date().toLocaleTimeString('ar-SA')
  console.log(`[${timestamp}] ${icons[level] || '•'} ${message}`, ...args)
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// ── NewsAPI Fetcher ──────────────────────────────────────
async function fetchCategoryNews(category) {
  try {
    const response = await axios.get(`${BASE_URL}/everything`, {
      params: {
        q: category.query,
        language: 'ar',
        sortBy: 'publishedAt',
        pageSize: category.pageSize,
        apiKey: NEWS_API_KEY,
      },
      timeout: 15000,
    })

    if (response.data.status === 'ok') {
      const articles = response.data.articles.filter(
        (a) =>
          a.title &&
          a.title !== '[Removed]' &&
          a.url &&
          !a.url.includes('removed') &&
          a.publishedAt
      )
      log('info', `[${category.label}] جُلب ${articles.length} خبر`)
      return articles
    }
    log('warn', `[${category.label}] NewsAPI response not ok: ${response.data.message}`)
    return []
  } catch (err) {
    log('error', `[${category.label}] Fetch error: ${err.message}`)
    return []
  }
}

// ── Transform Article ─────────────────────────────────────
function transformArticle(article, categorySlug, categoryLabel) {
  return {
    title: article.title?.trim().slice(0, 500),
    summary: article.description?.trim().slice(0, 1000) || null,
    content: article.content?.trim().slice(0, 5000) || null,
    image_url: article.urlToImage || null,
    source_name: article.source?.name || null,
    source_link: article.url,
    category: categoryLabel,
    published_at: article.publishedAt,
    language: 'ar',
    tags: [categorySlug],
    views: 0,
    is_featured: false,
    is_breaking: false,
  }
}

// ── Supabase Upsert ──────────────────────────────────────
async function upsertNewsItems(supabase, items) {
  if (!items.length) return { inserted: 0, duplicates: 0 }

  let inserted = 0
  let duplicates = 0

  // Process in batches of 10
  const batchSize = 10
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize)

    try {
      // Check for existing source_links (deduplication)
      const links = batch.map((item) => item.source_link)
      const { data: existing } = await supabase
        .from('radar-al-khabar')
        .select('source_link')
        .in('source_link', links)

      const existingLinks = new Set((existing || []).map((e) => e.source_link))
      const newItems = batch.filter((item) => !existingLinks.has(item.source_link))

      duplicates += batch.length - newItems.length

      if (newItems.length > 0) {
        const { data, error } = await supabase
          .from('radar-al-khabar')
          .insert(newItems)
          .select('id')

        if (error) {
          log('error', `Supabase insert error: ${error.message}`)
        } else {
          inserted += data?.length || 0
        }
      }
    } catch (err) {
      log('error', `Batch processing error: ${err.message}`)
    }

    // Rate limiting — small delay between batches
    if (i + batchSize < items.length) {
      await sleep(500)
    }
  }

  return { inserted, duplicates }
}

// ── Mark Featured ─────────────────────────────────────────
async function markFeaturedItems(supabase) {
  try {
    // Get latest 3 high-quality items to mark as featured
    const { data: recent } = await supabase
      .from('radar-al-khabar')
      .select('id')
      .not('image_url', 'is', null)
      .order('published_at', { ascending: false })
      .limit(3)

    if (recent && recent.length > 0) {
      const ids = recent.map((r) => r.id)
      // Reset all featured
      await supabase.from('news_radar').update({ is_featured: false }).neq('id', 'none')
      // Set new featured
      await supabase.from('news_radar').update({ is_featured: true }).in('id', ids)
      log('success', `Marked ${ids.length} items as featured`)
    }
  } catch (err) {
    log('warn', `Could not mark featured items: ${err.message}`)
  }
}

// ── Cleanup Old News ──────────────────────────────────────
async function cleanupOldNews(supabase, keepDays = 7) {
  try {
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - keepDays)

    const { count, error } = await supabase
      .from('news_radar')
      .delete()
      .lt('published_at', cutoff.toISOString())
      .select('id', { count: 'exact', head: true })

    if (!error && count) {
      log('info', `Cleaned up ${count} old news items (older than ${keepDays} days)`)
    }
  } catch (err) {
    log('warn', `Cleanup error: ${err.message}`)
  }
}

// ── Main ──────────────────────────────────────────────────
async function main() {
  log('start', '🚀 بدء تشغيل رادار الخبر — News Feeder')
  log('info', `الوقت: ${new Date().toLocaleString('ar-SA', { timeZone: 'Asia/Riyadh' })}`)

  // Validate environment
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    log('error', 'Missing Supabase credentials! Check NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
    process.exit(1)
  }

  // Initialize Supabase
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  let totalInserted = 0
  let totalDuplicates = 0
  let totalFetched = 0

  // Process each category
  for (const category of FEED_CATEGORIES) {
    log('info', `
📂 معالجة قسم: ${category.label}`)

    // Add delay between categories to avoid rate limiting
    if (FEED_CATEGORIES.indexOf(category) > 0) {
      await sleep(2000)
    }

    const articles = await fetchCategoryNews(category)
    totalFetched += articles.length

    if (articles.length === 0) {
      log('warn', `تخطي قسم ${category.label} — لا توجد أخبار`)
      continue
    }

    const items = articles.map((a) => transformArticle(a, category.slug, category.label))
    const { inserted, duplicates } = await upsertNewsItems(supabase, items)

    totalInserted += inserted
    totalDuplicates += duplicates

    log('success', `[${category.label}] أُضيف: ${inserted} | مكرر: ${duplicates}`)
  }

  // Mark featured items
  await markFeaturedItems(supabase)

  // Cleanup old news (keep last 7 days)
  await cleanupOldNews(supabase, 7)

  // Summary
  console.log('\n' + '═'.repeat(50))
  log('success', '✅ اكتملت عملية التغذية بنجاح!')
  console.log(`   📥 إجمالي الأخبار المجلوبة:  ${totalFetched}`)
  console.log(`   ✨ إجمالي الأخبار المضافة:   ${totalInserted}`)
  console.log(`   🔁 الأخبار المكررة (تخطي):   ${totalDuplicates}`)
  console.log('═'.repeat(50) + '\n')
}

main().catch((err) => {
  log('error', 'Fatal error:', err.message)
  console.error(err)
  process.exit(1)
})
