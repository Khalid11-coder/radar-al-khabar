import axios from 'axios'

const NEWS_API_KEY = process.env.NEWS_API_KEY || process.env.NEXT_PUBLIC_NEWS_API_KEY || 'eea864e38578439fba48f9fc239598ea'
const BASE_URL = 'https://newsapi.org/v2'

export interface NewsAPIArticle {
  source: { id: string | null; name: string }
  author: string | null
  title: string
  description: string | null
  url: string
  urlToImage: string | null
  publishedAt: string
  content: string | null
}

export interface NewsAPIResponse {
  status: string
  totalResults: number
  articles: NewsAPIArticle[]
}

export async function fetchArabicNews(
  query: string = 'أخبار عربية',
  pageSize: number = 20,
  page: number = 1
): Promise<NewsAPIArticle[]> {
  try {
    const response = await axios.get<NewsAPIResponse>(`${BASE_URL}/everything`, {
      params: {
        q: query,
        language: 'ar',
        sortBy: 'publishedAt',
        pageSize,
        page,
        apiKey: NEWS_API_KEY,
      },
      timeout: 10000,
    })

    if (response.data.status === 'ok') {
      return response.data.articles.filter(
        (article) =>
          article.title &&
          article.title !== '[Removed]' &&
          article.url &&
          !article.url.includes('removed')
      )
    }
    return []
  } catch (error) {
    console.error('NewsAPI fetch error:', error)
    return []
  }
}

export async function fetchTopHeadlines(
  country: string = 'ae',
  category?: string,
  pageSize: number = 20
): Promise<NewsAPIArticle[]> {
  try {
    const params: Record<string, string | number> = {
      country,
      pageSize,
      apiKey: NEWS_API_KEY,
    }
    if (category) params.category = category

    const response = await axios.get<NewsAPIResponse>(`${BASE_URL}/top-headlines`, {
      params,
      timeout: 10000,
    })

    if (response.data.status === 'ok') {
      return response.data.articles.filter(
        (a) => a.title && a.title !== '[Removed]'
      )
    }
    return []
  } catch (error) {
    console.error('NewsAPI top-headlines error:', error)
    return []
  }
}
