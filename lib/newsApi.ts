import axios from 'axios'

// حذف المفتاح العام والاعتماد كلياً على متغيرات البيئة للأمان
const NEWS_API_KEY = process.env.NEWS_API_KEY || process.env.NEXT_PUBLIC_NEWS_API_KEY;
const BASE_URL = 'https://serpapi.com/search.json'

// تحديث الواجهة لتناسب بيانات SerpApi (Google News)
export interface NewsAPIArticle {
  source: string | { name: string }
  title: string
  link: string        // SerpApi يستخدم link بدل url
  thumbnail: string | null // SerpApi يستخدم thumbnail بدل urlToImage
  date: string        // SerpApi يستخدم date بدل publishedAt
  snippet: string | null // SerpApi يستخدم snippet بدل description
}

// واجهة الرد الخاصة بـ SerpApi
export interface SerpApiResponse {
  news_results: NewsAPIArticle[]
  search_metadata: {
    status: string
  }
}

export async function fetchArabicNews(
  query: string = 'أخبار عربية',
  num: number = 20
): Promise<NewsAPIArticle[]> {
  try {
    const response = await axios.get<SerpApiResponse>(BASE_URL, {
      params: {
        engine: 'google_news', // محرك البحث المطلوب
        q: query,
        gl: 'sa',              // الموقع: السعودية
        hl: 'ar',              // اللغة: العربية
        api_key: NEWS_API_KEY, // المفتاح الجديد الخاص بك
      },
      timeout: 10000,
    })

    // التأكد من وجود نتائج وتحويلها
    if (response.data && response.data.news_results) {
      return response.data.news_results
    }
    return []
  } catch (error) {
    console.error('SerpApi fetch error:', error)
    return []
  }
}

/**
 * ملاحظة لـ خالد: SerpApi في محرك google_news لا يستخدم endpoint منفصل لـ top-headlines
 * بل يتم التحكم بذلك عبر كلمات البحث (Query)
 */
export async function fetchTopHeadlines(
  category: string = 'أهم الأخبار',
  num: number = 20
): Promise<NewsAPIArticle[]> {
  // نستخدم نفس الدالة السابقة مع تغيير كلمة البحث لتجلب العناوين الرئيسية
  return fetchArabicNews(category, num)
}