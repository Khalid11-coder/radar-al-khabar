<div align="center">

# 📡 رادار الخبر — Radar Al-Khabar

**منصة إخبارية عربية احترافية | Professional Arabic AI News Platform**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-RTL-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ecf8e?style=for-the-badge&logo=supabase)](https://supabase.com)
[![NewsAPI](https://img.shields.io/badge/NewsAPI-Live-orange?style=for-the-badge)](https://newsapi.org)
[![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-30min-2088ff?style=for-the-badge&logo=github-actions)](https://github.com/features/actions)

</div>

---

## 🌟 المميزات | Features

| الميزة | الوصف |
|--------|-------|
| 🌍 **RTL كامل** | تخطيط من اليمين إلى اليسار بالكامل |
| 🎨 **Dark Theme** | ثيم داكن احترافي بألوان Navy + Emerald |
| ⚡ **شريط عاجل** | شريط إخباري متحرك بـ Framer Motion |
| 🖼️ **Hero Section** | قسم مميز بتصميم بطولي ضخم |
| 🗃️ **News Cards** | بطاقات أخبار بتأثيرات hover وGlassmorphism |
| 🔄 **Auto-Feeder** | تغذية تلقائية كل 30 دقيقة عبر GitHub Actions |
| 🚫 **No Duplicates** | تحقق تلقائي من التكرار بناءً على source_link |
| 📱 **Responsive** | تصميم متجاوب لجميع الأجهزة |
| 🔠 **Cairo Font** | خط Cairo العربي الاحترافي |
| ⚡ **ISR** | Incremental Static Regeneration كل 30 دقيقة |

---

## 🏗️ هيكل المشروع | Project Structure

```
radar-al-khabar/
├── app/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx          # الهيدر مع قائمة التنقل
│   │   │   ├── BreakingNewsTicker.tsx  # شريط الأخبار العاجلة
│   │   │   └── Footer.tsx          # الفوتر متعدد الأعمدة
│   │   └── news/
│   │       ├── HeroSection.tsx     # قسم الأخبار المميزة
│   │       ├── NewsCard.tsx        # بطاقة الخبر
│   │       └── NewsGrid.tsx        # شبكة الأخبار + Sidebar
│   ├── api/
│   │   └── news/
│   │       └── route.ts            # API Route للأخبار
│   ├── category/
│   │   └── [slug]/
│   │       └── page.tsx            # صفحة التصنيف الديناميكية
│   ├── globals.css                 # الأنماط العامة + RTL
│   ├── layout.tsx                  # Layout الرئيسي
│   └── page.tsx                    # الصفحة الرئيسية
├── lib/
│   ├── supabase.ts                 # Supabase Client
│   ├── newsApi.ts                  # NewsAPI Client
│   └── types.ts                    # TypeScript Types
├── scripts/
│   └── news-feeder.js              # سكريبت التغذية التلقائية
├── .github/
│   └── workflows/
│       └── news-feeder.yml         # GitHub Actions Workflow
├── supabase-schema.sql             # مخطط قاعدة البيانات
├── .env.local                      # متغيرات البيئة
├── tailwind.config.ts
├── next.config.js
└── package.json
```

---

## 🚀 خطوات الإعداد | Setup Guide

### 1️⃣ نسخ المستودع

```bash
git clone https://github.com/yourusername/radar-al-khabar.git
cd radar-al-khabar
npm install
```

### 2️⃣ إعداد Supabase

1. انتقل إلى [supabase.com](https://supabase.com) وأنشئ مشروعاً جديداً
2. اذهب إلى **SQL Editor** وشغّل ملف `supabase-schema.sql`
3. انسخ بيانات الاتصال من **Settings → API**

### 3️⃣ إعداد متغيرات البيئة

أنشئ ملف `.env.local` وعبّئ القيم:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# NewsAPI (مُرفق مسبقاً)
NEWS_API_KEY=eea864e38578439fba48f9fc239598ea
```

### 4️⃣ تشغيل المشروع

```bash
npm run dev          # وضع التطوير
npm run build        # بناء الإنتاج
npm run start        # تشغيل الإنتاج
npm run feed         # تشغيل المُغذّي يدوياً
```

---

## ⚙️ GitHub Actions — Auto-Feeder

### إضافة Secrets

اذهب إلى **GitHub → Settings → Secrets and variables → Actions** وأضف:

| Secret | القيمة |
|--------|--------|
| `NEWS_API_KEY` | `eea864e38578439fba48f9fc239598ea` |
| `NEXT_PUBLIC_SUPABASE_URL` | رابط مشروع Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | مفتاح Service Role |

### آلية العمل

```
كل 30 دقيقة → GitHub Actions يُشغّل news-feeder.js
    ↓
جلب أخبار من NewsAPI (4 تصنيفات)
    ↓
فلترة المكررات بناءً على source_link
    ↓
حفظ الأخبار الجديدة في Supabase
    ↓
تحديث is_featured للأخبار المميزة
    ↓
حذف الأخبار القديمة (أكثر من 7 أيام)
```

---

## 🎨 التصميم | Design System

| العنصر | القيمة |
|--------|--------|
| **Background** | `#0f172a` (Deep Navy) |
| **Cards** | `#1e293b` مع Glassmorphism |
| **Primary Color** | `#10b981` (Emerald Green) |
| **Accent** | `#f59e0b` (Gold/Amber) |
| **Urgent** | `#ef4444` (Red) |
| **Font** | Cairo 300–900 weight |
| **Direction** | RTL (Right-to-Left) |

---

## 📋 الصفحات | Pages

| المسار | الصفحة |
|--------|--------|
| `/` | الرئيسية |
| `/category/middle-east` | أخبار الشرق الأوسط |
| `/category/conflicts` | حروب ونزاعات |
| `/category/economy` | اقتصاد |
| `/category/technology` | تكنولوجيا |
| `/api/news` | API جلب الأخبار |

---

## 📦 التقنيات المستخدمة | Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS + RTL
- **Animations:** Framer Motion
- **Database:** Supabase (PostgreSQL)
- **News Source:** NewsAPI.org
- **CI/CD:** GitHub Actions
- **Icons:** Lucide React
- **Fonts:** Google Fonts (Cairo, Almarai)
- **Language:** TypeScript

---

<div align="center">
صُنع بـ ❤️ لخدمة الإعلام العربي | Built with ❤️ for Arabic Media
</div>
