"use client"

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'

interface TickerItem {
  id: string
  title: string
  category?: string
}

interface BreakingNewsTickerProps {
  items?: TickerItem[]
}

const DEFAULT_ITEMS: TickerItem[] = [
  { id: '1', title: 'عاجل: اجتماع طارئ لمجلس الأمن الدولي بشأن التوترات في الشرق الأوسط', category: 'عاجل' },
  { id: '2', title: 'أسواق النفط ترتفع بنسبة 3% في ظل المخاوف الجيوسياسية', category: 'اقتصاد' },
  { id: '3', title: 'تقرير: ذكاء اصطناعي جديد يتفوق على أطباء في تشخيص الأمراض بدقة 98%', category: 'تكنولوجيا' },
  { id: '4', title: 'وزراء خارجية دول الخليج يبحثون ملفات المنطقة في الرياض', category: 'شرق أوسط' },
  { id: '5', title: 'إطلاق أول قمر صناعي عربي للاتصالات من جيل جديد', category: 'تكنولوجيا' },
  { id: '6', title: 'البنك المركزي الأوروبي يُبقي على أسعار الفائدة دون تغيير', category: 'اقتصاد' },
]

export default function BreakingNewsTicker({ items = DEFAULT_ITEMS }: BreakingNewsTickerProps) {
  const [isPaused, setIsPaused] = useState(false)
  const displayItems = items.length > 0 ? items : DEFAULT_ITEMS

  return (
    <div className="bg-[#0f172a] border-b border-red-900/20 overflow-hidden h-9 flex items-center">
      {/* تم استخدام items-center لضمان المحاذاة الأفقية مع الهيدر */}
      <div className="flex items-center h-full w-full">
        {/* URGENT Badge - تم تعديله ليكون متسقاً مع ارتفاع h-9 */}
        <div className="flex items-center gap-2 px-4 h-full bg-red-600 shrink-0 z-10">
          <Zap size={14} className="text-white badge-urgent" />
          <span className="text-white font-bold text-xs tracking-wider whitespace-nowrap">عـاجـل</span>
        </div>

        {/* Divider */}
        <div className="w-px bg-red-700/50 h-full" />

        {/* Scrolling Content - أضفنا h-full و items-center لضمان الاستقامة */}
        <div
          className="flex-1 overflow-hidden relative h-full flex items-center"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div 
            className="ticker-content flex items-center h-full py-0" 
            style={{ animationPlayState: isPaused ? 'paused' : 'running' }}
          >
            {/* تكرار المصفوفة 4 مرات يضمن عدم اختفاء الشريط أو ظهور فراغ أسود */}
            {[...displayItems, ...displayItems, ...displayItems, ...displayItems].map((item, i) => (
              <span key={`${item.id}-${i}`} className="flex items-center gap-3 cursor-pointer group px-4 whitespace-nowrap">
                {item.category && (
                  <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full font-semibold border border-emerald-500/30 whitespace-nowrap">
                    {item.category}
                  </span>
                )}
                <span className="text-slate-300 text-sm group-hover:text-white transition-colors font-medium">
                  {item.title}
                </span>
                <span className="text-emerald-600 mx-2">•</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}