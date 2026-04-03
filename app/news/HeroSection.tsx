"use client"

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Clock, ArrowLeft, TrendingUp, Eye } from 'lucide-react'

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
  views?: number
}

interface HeroSectionProps {
  featuredNews?: NewsItem[]
}

function timeAgo(dateStr: string | null | undefined): string {
  if (!dateStr) return 'منذ قليل'
  const date = new Date(dateStr)
  const now = new Date()
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000)
  if (diff < 60) return 'منذ لحظات'
  if (diff < 3600) return `منذ ${Math.floor(diff / 60)} دقيقة`
  if (diff < 86400) return `منذ ${Math.floor(diff / 3600)} ساعة`
  return `منذ ${Math.floor(diff / 86400)} يوم`
}

const FALLBACK_NEWS: NewsItem[] = [
  {
    id: '1',
    title: 'قمة عربية طارئة تناقش مستقبل السلام في المنطقة وآفاق التعاون الإقليمي',
    summary: 'التقى زعماء الدول العربية في قمة طارئة تاريخية لمناقشة التطورات الأخيرة والبحث عن حلول دبلوماسية شاملة تُعيد الاستقرار إلى المنطقة',
    image_url: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=1200&q=80',
    source_name: 'جامعة الدول العربية',
    category: 'شرق أوسط',
    published_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    views: 12400,
  },
  {
    id: '2',
    title: 'ثورة الذكاء الاصطناعي تُعيد رسم ملامح سوق العمل العالمي',
    summary: 'تقرير دولي: 40% من الوظائف الحالية ستتأثر بالأتمتة خلال العقد القادم',
    image_url: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80',
    source_name: 'معهد التقنية الدولي',
    category: 'تكنولوجيا',
    published_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    views: 8900,
  },
  {
    id: '3',
    title: 'أسواق الخليج تُسجل مكاسب قياسية وسط تفاؤل بانتعاش النفط',
    summary: 'ارتفعت مؤشرات بورصات الخليج بشكل لافت خلال تداولات اليوم',
    image_url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80',
    source_name: 'رويترز عربي',
    category: 'اقتصاد',
    published_at: new Date(Date.now() - 3600000 * 7).toISOString(),
    views: 6700,
  },
]

export default function HeroSection({ featuredNews = [] }: HeroSectionProps) {
  const news = featuredNews.length > 0 ? featuredNews : FALLBACK_NEWS
  const mainStory = news[0]
  const sideStories = news.slice(1, 3)

  const getImage = (item: NewsItem) => item.image_url || item.urlToImage || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80'
  const getTime = (item: NewsItem) => item.published_at || item.publishedAt
  const getLink = (item: NewsItem) => item.source_link || item.url || '#'
  const getSource = (item: NewsItem) => item.source_name || item.source?.name || 'رادار الخبر'
  const getSummary = (item: NewsItem) => item.summary || item.description || ''

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2">
          <TrendingUp size={18} className="text-emerald-400" />
          <h2 className="text-lg font-bold text-white">أبرز الأخبار</h2>
        </div>
        <div className="flex-1 h-px bg-gradient-to-l from-emerald-500/50 to-transparent" />
        <span className="text-xs text-slate-500">يتم التحديث كل 30 دقيقة</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-auto lg:h-[520px]">
        {/* Main Featured Story */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-2 relative rounded-2xl overflow-hidden group cursor-pointer"
        >
          <Link href={getLink(mainStory)} target="_blank" rel="noopener noreferrer" className="block h-full min-h-[300px] lg:h-full">
            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                src={getImage(mainStory)}
                alt={mainStory.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            </div>

            {/* Content */}
            <div className="absolute bottom-0 right-0 left-0 p-6">
              {/* Category Badge */}
              {mainStory.category && (
                <span className="inline-block bg-emerald-500 text-white text-xs px-3 py-1 rounded-full font-bold mb-3">
                  {mainStory.category}
                </span>
              )}

              {/* Title */}
              <h1 className="text-2xl lg:text-3xl font-extrabold text-white mb-3 leading-tight line-clamp-2 group-hover:text-emerald-300 transition-colors">
                {mainStory.title}
              </h1>

              {/* Summary */}
              <p className="text-slate-300 text-sm mb-4 line-clamp-2 leading-relaxed">
                {getSummary(mainStory)}
              </p>

              {/* Meta */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock size={12} className="text-emerald-400" />
                    {timeAgo(getTime(mainStory))}
                  </span>
                  <span className="text-emerald-400 font-semibold">{getSource(mainStory)}</span>
                  {mainStory.views && (
                    <span className="flex items-center gap-1">
                      <Eye size={12} />
                      {mainStory.views.toLocaleString('ar')}
                    </span>
                  )}
                </div>
                <span className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-white text-xs px-4 py-2 rounded-xl font-bold transition-colors">
                  اقرأ المزيد
                  <ArrowLeft size={12} />
                </span>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Side Stories */}
        <div className="flex flex-col gap-4">
          {sideStories.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.15 }}
              className="flex-1 relative rounded-2xl overflow-hidden group cursor-pointer"
            >
              <Link href={getLink(item)} target="_blank" rel="noopener noreferrer" className="block h-full min-h-[150px]">
                <div className="absolute inset-0">
                  <img
                    src={getImage(item)}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                </div>
                <div className="absolute bottom-0 right-0 left-0 p-4">
                  {item.category && (
                    <span className="inline-block bg-gold-400/80 text-white text-[10px] px-2 py-0.5 rounded-full font-bold mb-2">
                      {item.category}
                    </span>
                  )}
                  <h3 className="text-sm font-bold text-white mb-1 line-clamp-2 group-hover:text-emerald-300 transition-colors leading-snug">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400">
                    <Clock size={10} className="text-emerald-400" />
                    <span>{timeAgo(getTime(item))}</span>
                    <span className="text-emerald-500">•</span>
                    <span className="text-emerald-400">{getSource(item)}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
