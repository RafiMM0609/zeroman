import type { ComputedRef } from 'vue'

/**
 * Shared blog article access.
 *
 * Two things this exists to guarantee:
 *
 * 1. LIST queries never pull the markdown `body`. `queryCollection().all()`
 *    returns the full parsed document — including the syntax-highlighted AST —
 *    which measured at ~73% of the /blog payload for content the index never
 *    renders. Every list query here goes through LIST_FIELDS.
 *
 * 2. Detail lookups match on the exact path, never with LIKE. A slug like
 *    "fundamental" is a substring of "rag-fundamental", so a LIKE match
 *    silently served the wrong article for /blog/apps-architecture/fundamental.
 */

/** Fields the list/card views actually render. `body` is deliberately absent. */
const LIST_FIELDS = [
  'path',
  'stem',
  'title',
  'titleId',
  'description',
  'excerpt',
  'excerptId',
  'category',
  'date',
  'readTime',
  'tags',
  'featured',
  'ogImage',
] as const

export interface BlogListItem {
  slug: string
  category: string
  path: string
  title: string
  titleId: string
  excerpt: string
  excerptId: string
  date: string
  readTime: number
  tags: string[]
  featured: boolean
  ogImage?: string
}

/** Normalises a raw content document into the shape the templates use. */
export const normalizeBlogItem = (item: Record<string, any>): BlogListItem => {
  const pathParts = (item.path || item._path || '').split('/').filter(Boolean)
  const category = item.category || (pathParts.length >= 3 ? pathParts[1] : 'general')
  const slug = item.stem ? item.stem.split('/').pop() : pathParts[pathParts.length - 1]

  return {
    slug,
    category,
    path: item.path || '',
    title: item.title || '',
    titleId: item.titleId || item.title || '',
    excerpt: item.excerpt || item.description || '',
    excerptId: item.excerptId || item.description || '',
    date: item.date || '',
    readTime: item.readTime || 5,
    tags: item.tags || [],
    featured: Boolean(item.featured),
    ogImage: item.ogImage,
  }
}

/**
 * Fetch the article list without bodies.
 * Pass a category to filter in the query instead of in the browser.
 */
export const fetchBlogList = (category?: string | null) => {
  let query = queryCollection('blog').select(...LIST_FIELDS)

  if (category) {
    query = query.where('category', '=', category)
  }

  return query.order('date', 'DESC').all()
}

/** Fetch a single article by its exact route path, body included. */
export const fetchBlogByPath = (category: string, slug: string) =>
  queryCollection('blog')
    .where('path', '=', `/blog/${category}/${slug}`)
    .first()

/**
 * Slim list used for "related articles" — no body, and limited so we don't
 * ship every article's AST just to render three cards.
 */
export const fetchRelatedBlog = (category: string, excludeSlug: string, limit = 3) =>
  queryCollection('blog')
    .select(...LIST_FIELDS)
    .where('category', '=', category)
    .order('date', 'DESC')
    .all()
    .then(items =>
      (items || [])
        .map(normalizeBlogItem)
        .filter(a => a.slug !== excludeSlug)
        .slice(0, limit)
    )

/** Groups normalised articles into category facets with counts. */
export const buildCategoryFacets = (articles: BlogListItem[]) => {
  const map = new Map<string, { slug: string; labelEn: string; labelId: string; count: number }>()

  for (const article of articles) {
    const existing = map.get(article.category)
    if (existing) {
      existing.count++
    } else {
      map.set(article.category, {
        slug: article.category,
        labelEn: article.category,
        labelId: article.category,
        count: 1,
      })
    }
  }

  return Array.from(map.values())
}

export type { ComputedRef }
