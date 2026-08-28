export const formatCategoryLabel = (slug?: string): string => {
  if (!slug) return ''
  const normalized = slug.toLowerCase().trim()
  const categoryMap: Record<string, string> = {
    'ai-architecture': 'AI Architecture',
    'apps-architecture': 'Apps Architecture',
    'web-dev': 'Web Development'
  }

  if (categoryMap[normalized]) {
    return categoryMap[normalized]
  }

  return slug
    .split('-')
    .map(word => {
      if (word.toUpperCase() === 'AI') return 'AI'
      if (word.toUpperCase() === 'SEO') return 'SEO'
      return word.charAt(0).toUpperCase() + word.slice(1)
    })
    .join(' ')
}
