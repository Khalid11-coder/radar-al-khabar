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
    // 1. محاولة جلب البيانات من سوبابيس (باسم الجدول الصحيح)
    let query = supabase
      .from('news_radar')
      .select('*')
      .order('published_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    // فلترة الأقسام (لو كانت الرئيسية، لا تفلتر)
    if (category && category !== 'الرئيسية') {
      query = query.eq('category', category)
    }
    if (featured) query = query.eq('is_featured', true)
    if (breaking) query = query.eq('is_breaking', true)

    const { data, error } = await query

    // إذا فيه بيانات في سوبابيس (326 خبر)، بترجع فوراً للموقع
    if (!error && data && data.length > 0) {
      return NextResponse.json({ success: true, data, source: 'supabase' })
    }

    // 2. الخطة البديلة: السحب المباشر من SerpApi لو سوبابيس فاضي
    const queryStr = category && category !== 'الرئيسية' ? `${category} أخبار` : 'أخبار عربية'
    const articles = await fetchArabicNews(queryStr, limit)

    // تصحيح الـ Mapping ليتناسب مع SerpApi الجديد
    const normalized = articles.map((a, i) => ({
      id: `serpapi-${i}-${Date.now()}`,
      title: a.title,
      summary: a.snippet || '',               // SerpApi يستخدم snippet بدل description
      content: a.snippet || '', 
      image_url: a.thumbnail || '',           // SerpApi يستخدم thumbnail بدل urlToImage
      source_name: typeof a.source === 'string' ? a.source : (a.source?.name || 'مصدر'),
      source_link: a.link,                    // SerpApi يستخدم link بدل url
      category: category || 'عام',
      published_at: a.date || new Date().toISOString(), // SerpApi يستخدم date بدل publishedAt
      created_at: new Date().toISOString(),
      views: 0,
      is_featured: i < 3,
      is_breaking: false,
      language: 'ar',
    }))

    return NextResponse.json({ success: true, data: normalized, source: 'serpapi' })
  } catch (error) {
    console.error('API Route error:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch news' }, { status: 500 })
  }
}