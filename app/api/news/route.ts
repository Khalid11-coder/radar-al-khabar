import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { fetchArabicNews } from '@/lib/newsApi'

export const revalidate = 1800 // 30 minutes

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const limit = parseInt(searchParams.get('limit') || '20')
  const page = parseInt(searchParams.get('page') || '1')
  const featured = searchParams.get('featured') === 'true'
  const breaking = searchParams.get('breaking') === 'true'

  try {
    // Try Supabase first
    let query = supabase
      .from('news_radar')
      .select('*')
      .order('published_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    if (category) query = query.eq('category', category)
    if (featured) query = query.eq('is_featured', true)
    if (breaking) query = query.eq('is_breaking', true)

    const { data, error } = await query

    if (!error && data && data.length > 0) {
      return NextResponse.json({ success: true, data, source: 'supabase' })
    }

    // Fallback to NewsAPI direct fetch
    const queryStr = category ? `${category} أخبار` : 'أخبار عربية'
    const articles = await fetchArabicNews(queryStr, limit, page)

    const normalized = articles.map((a, i) => ({
      id: `newsapi-${i}-${Date.now()}`,
      title: a.title,
      summary: a.description,
      content: a.content,
      image_url: a.urlToImage,
      source_name: a.source.name,
      source_link: a.url,
      category: category || 'عام',
      published_at: a.publishedAt,
      created_at: new Date().toISOString(),
      views: 0,
      is_featured: i < 3,
      is_breaking: false,
      language: 'ar',
    }))

    return NextResponse.json({ success: true, data: normalized, source: 'newsapi' })
  } catch (error) {
    console.error('API Route error:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch news' }, { status: 500 })
  }
}
