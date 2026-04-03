"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Menu, X, Zap, Globe, Radio } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const categories = [
  { label: 'الرئيسية', href: '/', icon: '🏠' },
  { label: 'أخبار الشرق الأوسط', href: '/category/middle-east', icon: '🌍' },
  { label: 'حروب ونزاعات', href: '/category/conflicts', icon: '⚔️' },
  { label: 'اقتصاد', href: '/category/economy', icon: '📈' },
  { label: 'تكنولوجيا', href: '/category/technology', icon: '💡' },
]

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentTime, setCurrentTime] = useState('')
  const [currentDate, setCurrentDate] = useState('')

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
  const updateTime = () => {
    const now = new Date();
    
    // تحديث الوقت بالثانية والدقيقة
    setCurrentTime(now.toLocaleTimeString('ar-SA', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }));

    // تحديث التاريخ ليصبح "الجمعة، 3 أبريل 2026"
    setCurrentDate(now.toLocaleDateString('ar-SA', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }));
  };
    updateTime()
    const interval = setInterval(updateTime, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      {/* Top Bar */}
      <div className="bg-gradient-to-l from-emerald-900/50 to-navy-900 border-b border-emerald-900/30 py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse inline-block" />
              بث مباشر
            </span>
            <span className="hidden sm:block">{currentDate}</span>
          </div>
          <div className="flex items-center gap-3">
            <Globe size={12} className="text-emerald-400" />
            <span>{currentTime}</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'glass shadow-2xl shadow-black/50'
            : 'bg-[#0f172a]/95 backdrop-blur-md'
        } border-b border-white/5`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-900/50">
                  <Radio size={20} className="text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              </div>
              <div className="hidden sm:flex flex-col leading-tight">
                <span className="text-lg font-extrabold bg-gradient-to-l from-emerald-400 to-emerald-300 bg-clip-text text-transparent">
                  رادار الخبر
                </span>
                <span className="text-[10px] text-slate-500 font-light tracking-wider">
                  RADAR AL-KHABAR
                </span>
              </div>
            </Link>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-6">
              <div className="relative w-full group">
                <input
                  type="text"
                  placeholder="بحث في الأخبار..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pr-4 pl-10 text-sm text-slate-300 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:bg-white/8 transition-all"
                  dir="rtl"
                />
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors"
                />
              </div>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {categories.map((cat) => (
                <Link
                  key={cat.href}
                  href={cat.href}
                  className="px-3 py-2 text-sm text-slate-300 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all duration-200 font-medium whitespace-nowrap"
                >
                  {cat.label}
                </Link>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
              aria-label="القائمة"
            >
              {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="lg:hidden border-t border-white/5 bg-[#0f172a]/98 backdrop-blur-xl"
            >
              {/* Mobile Search */}
              <div className="px-4 pt-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="بحث..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pr-4 pl-10 text-sm text-slate-300 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
                    dir="rtl"
                  />
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                </div>
              </div>
              {/* Mobile Nav Links */}
              <nav className="px-4 py-3 space-y-1">
                {categories.map((cat, i) => (
                  <motion.div
                    key={cat.href}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={cat.href}
                      className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-xl transition-all font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span>{cat.icon}</span>
                      {cat.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}
