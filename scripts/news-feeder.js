#!/usr/bin/env node
/**
 * =========================================================
 * رادار الخبر — News Auto-Feeder Script (SerpApi Version)
 * =========================================================
 */

const { createClient } = require('@supabase/supabase-js')
const axios = require('axios')

/// ── Config ──────────────────────────────────────────────
const NEWS_API_KEY = process.env.NEWS_API_KEY 
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
// الرابط الصحيح لـ SerpApi
const BASE_URL = 'https://serpapi.com/search.json'

// إعدادات الأقسام (تم تعديل الاستعلامات لتناسب محرك بحث جوجل)
const FEED_CATEGORIES = [
  {
    slug: 'middle-east',
    label: 'الشرق الأوسط',
    query: 'أخبار الشرق الأوسط',
  },
  {
    slug: 'conflicts',
    label: 'حروب ونزاعات',
    query: 'حروب ونزاعات عالمية',
  },
  {
    slug: 'economy',
    label: 'اقتصاد',
    query: 'أخبار الاقتصاد العربي',
  },
  {
    slug: 'technology',
    label: 'تكنولوجيا',
    query: 'أحدث التقنيات والذكاء الاصطناعي',
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

// ── SerpApi Fetcher ──────────────────────────────────────
async function fetchCategoryNews(category) {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        engine: 'google_news',    // تحديد محرك بحث الأخبار
        q: category.query,        // كلمة البحث
        gl: 'sa',                 // الموقع: السعودية
        hl: 'ar',                 // اللغة: العربية
        api_key: NEWS_API_KEY,    // المفتاح الخاص بك
      },
      timeout: 15000,
    })

    // في SerpApi النتائج تأتي في مصفوفة news_results
    if (response.data && response.data.news_results) {
      const articles = response.data.news_results;
      log('info', `[${category.label}] جُلب ${articles.length} خبر`)
      return articles
    }
    
    log('warn', `[${category.label}] لا توجد نتائج من SerpApi`)
    return []
  } catch (err) {
    log('error', `[${category.label}] Fetch error: ${err.message}`)
    return []
  }
}

// ── Transform Article ─────────────────────────────────────
function transformArticle(article, categorySlug, categoryLabel) {
  // تحويل صيغة SerpApi إلى صيغة متوافقة مع قاعدة بياناتك
  return {
    title: article.title?.trim().slice(0, 500),
    summary: article.snippet?.trim().slice(0, 1000) || null, // SerpApi يستخدم snippet بدل description
    content: article.snippet || null, 
    image_url: article.thumbnail || null, // SerpApi يستخدم thumbnail
    source_name: article.source?.name || article.source || 'مصدر غير معروف',
    source_link: article.link, // الرابط المباشر للخبر
    category: categoryLabel,
    published_at: article.date ? new Date(article.date).toISOString() : new Date().toISOString(),
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

  const batchSize = 10
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize)

    try {
      const links = batch.map((item) => item.source_link)
      const { data: existing } = await supabase
        .from('news_radar')
        .select('source_link')
        .in('source_link', links)

      const existingLinks = new Set((existing || []).map((e) => e.source_link))
      const newItems = batch.filter((item) => !existingLinks.has(item.source_link))

      duplicates += batch.length - newItems.length

      if (newItems.length > 0) {
        const { data, error } = await supabase
          .from('news_radar')
          .insert(newItems)
          .select('id')

        if (error) {
          log('error', `خطأ في إضافة سوبابيس: ${error.message}`)
        } else {
          inserted += data?.length || 0
        }
      }
    } catch (err) {
      log('error', `خطأ في المعالجة: ${err.message}`)
    }

    if (i + batchSize < items.length) {
      await sleep(500)
    }
  }

  return { inserted, duplicates }
}

// ── Main ──────────────────────────────────────────────────
async function main() {
  log('start', '🚀 بدء تشغيل رادار الخبر — نسخة SerpApi')
  
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY || !NEWS_API_KEY) {
    log('error', 'نقص في المتغيرات! تأكد من وجود المفاتيح في Secrets')
    process.exit(1)
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

  let totalInserted = 0
  let totalFetched = 0

  for (const category of FEED_CATEGORIES) {
    log('info', `📂 معالجة قسم: ${category.label}`)

    const articles = await fetchCategoryNews(category)
    totalFetched += articles.length

    if (articles.length > 0) {
      const items = articles.map((a) => transformArticle(a, category.slug, category.label))
      const { inserted } = await upsertNewsItems(supabase, items)
      totalInserted += inserted
    }

    await sleep(1000) // تأخير بسيط بين الأقسام
  }

  log('success', `✅ تم الانتهاء! المجلوب: ${totalFetched} | الجديد المضاف: ${totalInserted}`)
}

main().catch(err => console.error(err))