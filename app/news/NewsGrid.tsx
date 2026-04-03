"use client"

import { motion } from 'framer-motion'
import { Newspaper, RefreshCw } from 'lucide-react'
import NewsCard from './NewsCard'

interface NewsItem {
  id: string
  title: string
  summary?: string | null
  description?: string | null
  image_url?: string | null
  urlToImage?: string | null
  source_name?: string | null
  source?: { name?: string }
  category?: string | null
  published_at?: string | null
  publishedAt?: string | null
  source_link?: string | null
  url?: string | null
}

interface NewsGridProps {
  news: NewsItem[]
  title?: string
  loading?: boolean
  showSidebar?: boolean
}

const SAMPLE_SIDEBAR: NewsItem[] = [
  {
    id: 's1',
    title: 'تقرير: انخفاض أسعار المواد الغذائية عالمياً للشهر الثالث على التوالي',
    image_url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=70',
    source_name: 'بلومبرغ عربي',
    category: 'اقتصاد',
    published_at: new Date(Date.now() - 3600000 * 1).toISOString(),
  },
  {
    id: 's2',
    title: 'شركة أبل تكشف عن نظارة الواقع المختلط الجديدة في مؤتمر WWDC',
    image_url: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=400&q=70',
    source_name: 'تك كرنش عربي',
    category: 'تكنولوجيا',
    published_at: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 's3',
    title: 'الأمم المتحدة تدعو إلى وقف فوري لإطلاق النار في مناطق النزاع',
    image_url: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=400&q=70',
    source_name: 'العربية',
    category: 'حروب',
    published_at: new Date(Date.now() - 3600000 * 6).toISOString(),
  },
  {
    id: 's4',
    title: 'مبادرة سعودية لتطوير الطاقة الشمسية تستهدف إنتاج 50 جيجاواط',
    image_url: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&q=70',
    source_name: 'Arab News',
    category: 'اقتصاد',
    published_at: new Date(Date.now() - 3600000 * 9).toISOString(),
  },
]

export default function NewsGrid({ news, title = 'آخر الأخبار', loading = false, showSidebar = true }: NewsGridProps) {
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Newspaper size={18} className="text-emerald-400" />
          <h2 className="text-lg font-bold text-white">{title}</h2>
          <div className="flex-1 h-px bg-gradient-to-l from-emerald-500/50 to-transparent" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass-card rounded-2xl overflow-hidden animate-pulse">
              <div className="h-48 bg-slate-700/50" />
              <div className="p-4 space-y-3">
                <div className="h-3 bg-slate-700/50 rounded w-1/3" />
                <div className="h-4 bg-slate-700/50 rounded" />
                <div className="h-4 bg-slate-700/50 rounded w-5/6" />
                <div className="h-3 bg-slate-700/50 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      {/* Section Title */}
      <div className="flex items-center gap-3 mb-6">
        <Newspaper size={18} className="text-emerald-400" />
        <h2 className="text-lg font-bold text-white">{title}</h2>
        <div className="flex-1 h-px bg-gradient-to-l from-emerald-500/50 to-transparent" />
        <button className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-emerald-400 transition-colors">
          <RefreshCw size={12} />
          تحديث
        </button>
      </div>

      <div className={`grid gap-6 ${showSidebar ? 'grid-cols-1 lg:grid-cols-4' : 'grid-cols-1'}`}>
        {/* Main Grid */}
        <div className={showSidebar ? 'lg:col-span-3' : ''}>
          {news.length === 0 ? (
            <div className="glass-card rounded-2xl p-12 text-center">
              <Newspaper size={40} className="text-slate-600 mx-auto mb-4" />
              <p className="text-slate-500 text-lg">لا توجد أخبار متاحة حالياً</p>
              <p className="text-slate-600 text-sm mt-1">يرجى المحاولة مرة أخرى لاحقاً</p>
            </div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {news.map((item, i) => (
                <NewsCard key={item.id} item={item} index={i} />
              ))}
            </motion.div>
          )}
        </div>

        {/* Sidebar */}
        {showSidebar && (
          <aside className="lg:col-span-1">
            <div className="glass-card rounded-2xl p-4 sticky top-24">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                <div className="w-1 h-5 bg-gradient-to-b from-emerald-400 to-emerald-600 rounded-full" />
                <h3 className="font-bold text-white text-sm">الأكثر تداولاً</h3>
              </div>
              <div className="space-y-1">
                {SAMPLE_SIDEBAR.map((item, i) => (
                  <NewsCard key={item.id} item={item} index={i} variant="compact" />
                ))}
              </div>
            </div>
          </aside>
        )}
      </div>
    </section>
  )
}
