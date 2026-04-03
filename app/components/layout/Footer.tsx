"use client"

import Link from 'next/link'
import { Radio, Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, ChevronLeft } from 'lucide-react'

const footerLinks = {
  about: [
    { label: 'عن رادار الخبر', href: '/about' },
    { label: 'فريق التحرير', href: '/team' },
    { label: 'سياسة التحرير', href: '/editorial' },
    { label: 'ميثاق الشرف الصحفي', href: '/ethics' },
  ],
  sections: [
    { label: 'الرئيسية', href: '/' },
    { label: 'أخبار الشرق الأوسط', href: '/category/middle-east' },
    { label: 'حروب ونزاعات', href: '/category/conflicts' },
    { label: 'اقتصاد وأعمال', href: '/category/economy' },
    { label: 'تكنولوجيا', href: '/category/technology' },
  ],
  legal: [
    { label: 'سياسة الخصوصية', href: '/privacy' },
    { label: 'شروط الاستخدام', href: '/terms' },
    { label: 'سياسة ملفات الارتباط', href: '/cookies' },
    { label: 'إخلاء المسؤولية', href: '/disclaimer' },
  ],
}

const socialLinks = [
  { icon: Facebook, href: '#', label: 'فيسبوك', color: 'hover:text-blue-400' },
  { icon: Twitter, href: '#', label: 'تويتر / X', color: 'hover:text-sky-400' },
  { icon: Instagram, href: '#', label: 'إنستغرام', color: 'hover:text-pink-400' },
  { icon: Youtube, href: '#', label: 'يوتيوب', color: 'hover:text-red-400' },
]

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-white/5">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-l from-emerald-900/20 to-navy-800/30 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-extrabold text-white mb-1">اشترك في النشرة الإخبارية</h3>
              <p className="text-slate-400 text-sm">احصل على أهم الأخبار مباشرة في بريدك الإلكتروني</p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                placeholder="بريدك الإلكتروني..."
                className="flex-1 md:w-72 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-300 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
                dir="rtl"
              />
              <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl text-sm font-bold transition-colors whitespace-nowrap">
                اشتراك
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="bg-[#0a1120]">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center">
                  <Radio size={20} className="text-white" />
                </div>
                <div>
                  <div className="text-lg font-extrabold text-white">رادار الخبر</div>
                  <div className="text-[10px] text-slate-500 tracking-widest">RADAR AL-KHABAR</div>
                </div>
              </Link>
              <p className="text-slate-400 text-sm leading-relaxed mb-5">
                منصة إخبارية عربية احترافية تقدم أحدث الأخبار والتحليلات من الشرق الأوسط والعالم بموضوعية ومصداقية عالية، على مدار الساعة.
              </p>
              {/* Contact */}
              <div className="space-y-2.5 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <Mail size={13} className="text-emerald-500" />
                  <span>info@radar-alkhabar.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={13} className="text-emerald-500" />
                  <span>+966 11 000 0000</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={13} className="text-emerald-500" />
                  <span>الرياض، المملكة العربية السعودية</span>
                </div>
              </div>
            </div>

            {/* About Links */}
            <div>
              <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-1 h-4 bg-emerald-500 rounded-full inline-block" />
                عن الموقع
              </h4>
              <ul className="space-y-2.5">
                {footerLinks.about.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-emerald-400 transition-colors"
                    >
                      <ChevronLeft size={12} className="text-emerald-600" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Sections */}
            <div>
              <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-1 h-4 bg-gold-400 rounded-full inline-block" />
                الأقسام
              </h4>
              <ul className="space-y-2.5">
                {footerLinks.sections.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-emerald-400 transition-colors"
                    >
                      <ChevronLeft size={12} className="text-emerald-600" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal + Contact */}
            <div>
              <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-1 h-4 bg-blue-500 rounded-full inline-block" />
                سياسة الخصوصية
              </h4>
              <ul className="space-y-2.5">
                {footerLinks.legal.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-emerald-400 transition-colors"
                    >
                      <ChevronLeft size={12} className="text-emerald-600" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <h4 className="font-bold text-white mb-3 text-sm">تابعنا</h4>
                <div className="flex items-center gap-2.5">
                  {socialLinks.map(({ icon: Icon, href, label, color }) => (
                    <Link
                      key={label}
                      href={href}
                      aria-label={label}
                      className={`w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-500 ${color} transition-all hover:scale-110`}
                    >
                      <Icon size={14} />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 py-5 px-4">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
            <p>© 2026 رادار الخبر. جميع الحقوق محفوظة.</p>
            <p className="flex items-center gap-1">
              صُنع بـ ❤️ لخدمة الإعلام العربي
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
