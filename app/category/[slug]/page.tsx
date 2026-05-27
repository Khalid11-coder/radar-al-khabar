import Header from '@/app/components/layout/Header'
import Footer from '@/app/components/layout/Footer'
import BreakingNewsTicker from '@/app/components/layout/BreakingNewsTicker'
import NewsGrid from '@/app/components/news/NewsGrid'
import { fetchArabicNews, NewsAPIArticle } from '@/lib/newsApi'
import { CATEGORY_MAP, CATEGORY_QUERY_MAP } from '@/lib/types'
import { notFound } from 'next/navigation'

export const revalidate = 1800

interface PageProps {
  params: { slug: string }
}

function normalizeArticle(a: NewsAPIArticle, category: string, index: number) {
  return {
    id: `${category}-${index}-${Date.now()}`,
    title: a.title,
    summary: a.snippet,
    description: a.snippet,
    content: a.snippet,
    image_url: a.thumbnail,
    urlToImage: a.thumbnail,
    source_name: typeof a.source === 'string' ? a.source : (a.source?.name || 'رادار الخبر'),
    source_link: a.link,
    url: a.link,
    category: CATEGORY_MAP[category] || category,
    published_at: a.date,
    publishedAt: a.date,
    created_at: new Date().toISOString(),
    views: Math.floor(Math.random() * 8000) + 100,
    is_featured: index < 2,
    is_breaking: false,
    language: 'ar',
  }
}

const CATEGORY_ICONS: Record<string, string> = {
  'middle-east': '🌍',
  'conflicts': '⚔️',
  'economy': '📈',
  'technology': '💡',
}

const CATEGORY_COLORS: Record<string, string> = {
  'middle-east': 'from-amber-600/30 to-transparent',
  'conflicts': 'from-red-900/30 to-transparent',
  'economy': 'from-emerald-900/30 to-transparent',
  'technology': 'from-blue-900/30 to-transparent',
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = params

  if (!CATEGORY_MAP[slug]) {
    notFound()
  }

  const categoryName = CATEGORY_MAP[slug]
  const queryString = CATEGORY_QUERY_MAP[slug] || categoryName
  const icon = CATEGORY_ICONS[slug] || '📰'
  const colorGradient = CATEGORY_COLORS[slug] || 'from-slate-800/30 to-transparent'

  let articles: ReturnType<typeof normalizeArticle>[] = []
  try {
    const rawArticles = await fetchArabicNews(queryString, 18)
    articles = rawArticles.map((a, i) => normalizeArticle(a, slug, i))
  } catch {
    articles = []
  }

  return (
    <div className="min-h-screen bg-[#0f172a]">
      <Header />
      <BreakingNewsTicker />

      {/* Category Hero Banner */}
      <div className={`bg-gradient-to-b ${colorGradient} border-b border-white/5 py-10 px-4`}>
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
            <a href="/" className="hover:text-emerald-400 transition-colors">الرئيسية</a>
            <span>/</span>
            <span className="text-slate-300">{categoryName}</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-5xl">{icon}</span>
            <div>
              <h1 className="text-3xl font-extrabold text-white mb-1">{categoryName}</h1>
              <p className="text-slate-400 text-sm">
                {articles.length > 0 ? `${articles.length} خبر متاح` : 'جاري تحميل الأخبار...'}
                {' · '}
                يتجدد كل 30 دقيقة
              </p>
            </div>
          </div>
        </div>
      </div>

      <main>
        <NewsGrid
          news={articles}
          title={`أخبار ${categoryName}`}
          showSidebar={true}
        />
      </main>

      <Footer />
    </div>
  )
}

export function generateStaticParams() {
  return Object.keys(CATEGORY_MAP).map((slug) => ({ slug }))
}
