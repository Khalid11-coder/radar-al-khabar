import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import BreakingNewsTicker from './components/layout/BreakingNewsTicker'
import HeroSection from './components/news/HeroSection'
import NewsGrid from './components/news/NewsGrid'
import NewsCard from './components/news/NewsCard'
import { fetchArabicNews, NewsAPIArticle } from '@/lib/newsApi'

export const revalidate = 1800 // 30 min ISR

function normalizeArticle(a: NewsAPIArticle, category: string, index: number) {
  return {
    id: `${category}-${index}-${a.url?.slice(-10) || index}`,
    title: a.title,
    summary: a.description,
    content: a.content,
    image_url: a.urlToImage,
    source_name: a.source?.name || 'رادار الخبر',
    source_link: a.url,
    category,
    published_at: a.publishedAt,
    created_at: new Date().toISOString(),
    views: Math.floor(Math.random() * 12000) + 200,
    is_featured: index < 2,
    is_breaking: index === 0,
    language: 'ar',
  }
}

async function getHomeNews() {
  try {
    const [generalArticles, techArticles, economyArticles] = await Promise.all([
      fetchArabicNews('الشرق الأوسط عرب أخبار', 12),
      fetchArabicNews('تكنولوجيا ذكاء اصطناعي', 6),
      fetchArabicNews('اقتصاد نفط أسواق', 6),
    ])

    return {
      featured: generalArticles.slice(0, 3).map((a, i) => normalizeArticle(a, 'الشرق الأوسط', i)),
      mainNews: generalArticles.slice(3).map((a, i) => normalizeArticle(a, 'الشرق الأوسط', i + 3)),
      techNews: techArticles.map((a, i) => normalizeArticle(a, 'تكنولوجيا', i)),
      economyNews: economyArticles.map((a, i) => normalizeArticle(a, 'اقتصاد', i)),
    }
  } catch (err) {
    console.error('Failed to fetch home news:', err)
    return { featured: [], mainNews: [], techNews: [], economyNews: [] }
  }
}

export default async function HomePage() {
  const { featured, mainNews, techNews, economyNews } = await getHomeNews()

  return (
    <div className="min-h-screen bg-[#0f172a]">
      <Header />
      <BreakingNewsTicker />

      <main>
        {/* Hero */}
        <HeroSection featuredNews={featured} />

        {/* Main News Grid + Sidebar */}
        <NewsGrid
          news={mainNews}
          title="آخر الأخبار"
          showSidebar={true}
        />

        {/* Technology Section */}
        {techNews.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 py-4 pb-10">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">💡</span>
              <h2 className="text-lg font-bold text-white">أخبار التكنولوجيا</h2>
              <div className="flex-1 h-px bg-gradient-to-l from-blue-500/50 to-transparent" />
              <a href="/category/technology" className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
                عرض الكل ←
              </a>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {techNews.slice(0, 3).map((item, i) => (
                <NewsCard key={item.id} item={item} index={i} />
              ))}
            </div>
          </section>
        )}

        {/* Economy Section */}
        {economyNews.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 py-4 pb-12">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">📈</span>
              <h2 className="text-lg font-bold text-white">أخبار الاقتصاد</h2>
              <div className="flex-1 h-px bg-gradient-to-l from-emerald-500/50 to-transparent" />
              <a href="/category/economy" className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
                عرض الكل ←
              </a>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {economyNews.slice(0, 3).map((item, i) => (
                <NewsCard key={item.id} item={item} index={i} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}
