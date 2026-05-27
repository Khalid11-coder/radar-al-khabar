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

    // فلترة الأقسام (لو كانت الرئيسية، لا تفلتر)
    if (category && category !== 'الرئيسية') {
      query = query.eq('category', category)
    }
    
    if (featured) query = query.eq('is_featured', true)
    if (breaking) query = query.eq('is_breaking', true)

    // تطبيق الـ Range بعد الفلترة
    query = query.range((page - 1) * limit, page * limit - 1)

    const { data, error } = await query

    // إذا فيه بيانات في سوبابيس، بترجع فوراً للموقع
    if (!error && data && data.length > 0) {
      return NextResponse.json({ success: true, data, source: 'supabase' })
    }

    // 2. الخطة البديلة: السحب المباشر من SerpApi لو سوبابيس فاضي
    const queryStr = category && category !== 'الرئيسية' ? `${category} أخبار عربية` : 'أخبار عربية'
    const articles = await fetchArabicNews(queryStr, limit)

    // تحويل البيانات لتناسب الواجهة وتدعم الصور والروابط
    const normalized = articles.map((a: any, i: number) => ({
      id: `serpapi-${i}-${Date.now()}`,
      title: a.title,
      summary: a.snippet || '',               // SerpApi يستخدم snippet
      description: a.snippet || '',           // دعم المكونات القديمة
      content: a.snippet || '', 
      image_url: a.thumbnail || null,         // SerpApi يستخدم thumbnail
      urlToImage: a.thumbnail || null,        // دعم الصور في NewsCard
      source_name: typeof a.source === 'string' ? a.source : (a.source?.name || 'مصدر'),
      source_link: a.link,                    // SerpApi يستخدم link
      url: a.link,                            // دعم الرابط في NewsCard
      category: category || 'عام',
      published_at: a.date || new Date().toISOString(),
      publishedAt: a.date || new Date().toISOString(),
      language: 'ar',
    }))

    return NextResponse.json({ success: true, data: normalized, source: 'serpapi' })
  } catch (error) {
    console.error('API Route error:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch news' }, { status: 500 })
  }
}