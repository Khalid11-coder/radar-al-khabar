export interface NewsItem {
  id: string
  title: string
  summary?: string | null
  content?: string | null
  image_url?: string | null
  source_name?: string | null
  source_link: string
  category?: string | null
  published_at?: string | null
  created_at: string
  tags?: string[] | null
  views: number
  is_featured: boolean
  is_breaking: boolean
  language: string
}

export type NewsCategory = 
  | 'middle-east'
  | 'conflicts'
  | 'economy'
  | 'technology'
  | 'politics'
  | 'sports'
  | 'general'

export const CATEGORY_MAP: Record<string, string> = {
  'middle-east': 'الشرق الأوسط',
  'conflicts': 'حروب ونزاعات',
  'economy': 'اقتصاد',
  'technology': 'تكنولوجيا',
  'politics': 'سياسة',
  'sports': 'رياضة',
  'general': 'عام',
}

export const CATEGORY_QUERY_MAP: Record<string, string> = {
  'middle-east': 'الشرق الأوسط OR Middle East OR عرب',
  'conflicts': 'حرب OR نزاع OR war OR conflict OR عملية عسكرية',
  'economy': 'اقتصاد OR بورصة OR نفط OR economy OR oil',
  'technology': 'تكنولوجيا OR ذكاء اصطناعي OR technology OR AI',
  'politics': 'سياسة OR دبلوماسية OR politics',
  'general': 'أخبار عربية',
}
