"use client"

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Clock, ExternalLink, Share2, BookmarkPlus } from 'lucide-react'

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

interface NewsCardProps {
  item: NewsItem
  index?: number
  variant?: 'default' | 'compact' | 'featured'
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

const CATEGORY_COLORS: Record<string, string> = {
  'تكنولوجيا': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'اقتصاد': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  'شرق أوسط': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  'حروب': 'bg-red-500/20 text-red-400 border-red-500/30',
  'سياسة': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'default': 'bg-slate-500/20 text-slate-400 border-slate-500/30',
}

export default function NewsCard({ item, index = 0, variant = 'default' }: NewsCardProps) {
  const getImage = () => item.image_url || item.urlToImage || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80'
  const getTime = () => item.published_at || item.publishedAt
  const getLink = () => item.source_link || item.url || '#'
  const getSource = () => item.source_name || item.source?.name || 'رادار الخبر'
  const getSummary = () => item.summary || item.description || ''
  const getCategoryColor = () => CATEGORY_COLORS[item.category || ''] || CATEGORY_COLORS['default']

  if (variant === 'compact') {
    return (
      <motion.article
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="flex gap-3 p-3 rounded-xl hover:bg-white/5 transition-all group cursor-pointer border border-transparent hover:border-white/10"
      >
        <Link href={getLink()} target="_blank" rel="noopener noreferrer" className="flex gap-3 w-full">
          <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0">
            <img
              src={getImage()}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&q=60' }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-slate-200 group-hover:text-emerald-400 transition-colors line-clamp-2 leading-snug mb-1">
              {item.title}
            </h3>
            <div className="flex items-center gap-2 text-[10px] text-slate-500">
              <Clock size={9} className="text-emerald-500" />
              <span>{timeAgo(getTime())}</span>
              <span>•</span>
              <span className="text-emerald-500 font-medium truncate">{getSource()}</span>
            </div>
          </div>
        </Link>
      </motion.article>
    )
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      className="news-card glass-card rounded-2xl overflow-hidden border border-white/5 hover:border-emerald-500/20 group"
    >
      {/* Image */}
      <Link href={getLink()} target="_blank" rel="noopener noreferrer">
        <div className="relative h-48 overflow-hidden">
          <img
            src={getImage()}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80' }}
          />
          {/* Category overlay */}
          {item.category && (
            <div className="absolute top-3 right-3">
              <span className={`text-xs px-2.5 py-1 rounded-full font-bold border ${getCategoryColor()}`}>
                {item.category}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1e293b]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        {/* Source & Time */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-emerald-400 text-xs font-bold">{getSource()}</span>
          <span className="flex items-center gap-1 text-[10px] text-slate-500">
            <Clock size={10} />
            {timeAgo(getTime())}
          </span>
        </div>

        {/* Title */}
        <Link href={getLink()} target="_blank" rel="noopener noreferrer">
          <h3 className="text-white font-bold text-base mb-2 line-clamp-2 leading-snug group-hover:text-emerald-400 transition-colors cursor-pointer">
            {item.title}
          </h3>
        </Link>

        {/* Summary */}
        {getSummary() && (
          <p className="text-slate-400 text-sm line-clamp-2 mb-4 leading-relaxed">
            {getSummary()}
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-white/5">
          <Link
            href={getLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
          >
            <ExternalLink size={12} />
            اقرأ المزيد
          </Link>
          <div className="flex items-center gap-2">
            <button
              className="p-1.5 text-slate-500 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition-all"
              title="حفظ"
            >
              <BookmarkPlus size={14} />
            </button>
            <button
              className="p-1.5 text-slate-500 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all"
              title="مشاركة"
            >
              <Share2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  )
}
