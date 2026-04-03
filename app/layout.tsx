import type { Metadata } from 'next'
import "./globals.css";

export const metadata: Metadata = {
  title: 'رادار الخبر | أخبار عربية موثوقة',
  description: 'رادار الخبر - منصة إخبارية عربية احترافية تقدم أحدث الأخبار من الشرق الأوسط والعالم',
  keywords: 'أخبار, رادار الخبر, الشرق الأوسط, عاجل, اقتصاد, تكنولوجيا',
  authors: [{ name: 'رادار الخبر' }],
  openGraph: {
    title: 'رادار الخبر | أخبار عربية موثوقة',
    description: 'أحدث الأخبار العربية والعالمية',
    locale: 'ar_SA',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800;900&family=Almarai:wght@300;400;700;800&display=swap"
          rel="stylesheet"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="font-arabic bg-[#0f172a] text-slate-100 antialiased">
        {children}
      </body>
    </html>
  )
}
