import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { fetchArabicNews } from '@/lib/newsApi'

export const revalidate = 1800 // 30 دقيقة

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const limit = parseInt(searchParams.get('limit') || '20')
  const page = parseInt(searchParams.get('page') || '1')
  const featured = searchParams.get('featured') === 'true'
  const breaking = searchParams.get('breaking') === 'true'

  try {
    // 1. محاولة جلب البيانات من Supabase باستخدام الاسم الصحيح للجدول
    let query = supabase
      .from('news_radar') // تم تعديل الاسم من radar-al-khabar إلى news_radar
      .select('*')
      .order('published_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    if (category) query = query.eq('category', category)
    if (featured) query = query.eq('is_featured', true)
    if (breaking) query = query.eq('is_breaking', true)

    const { data, error } = await query

    // إذا وجدت بيانات في سوبابيس، نرجعها فوراً
    if (!error && data && data.length > 0) {
      return NextResponse.json({ success: true, data, source: 'supabase' })
    }

    // 2. الحل الاحتياطي: الجلب المباشر من SerpApi (في حال كان الجدول فارغاً)
    const queryStr = category ? `${category} أخبار` : 'أخبار عربية'
    const articles = await fetchArabicNews(queryStr, limit)

    // 3. تطبيع البيانات لتطابق أسماء حقول SerpApi الجديدة
    const normalized = articles.map((a, i) => ({
      id: `serpapi-${i}-${Date.now()}`,
      title: a.title,
      summary: a.snippet || null,      // استخدام snippet بدل description
      content: a.snippet || null, 
      image_url: a.thumbnail || null,  // استخدام thumbnail بدل urlToImage
      source_name: typeof a.source === 'string' ? a.source : (a.source?.name || 'مصدر غير معروف'),
      source_link: a.link,             // استخدام link بدل url
      category: category || 'عام',
      published_at: a.date || new Date().toISOString(), // استخدام date بدل publishedAt
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