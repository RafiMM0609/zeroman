/**
 * Sitemap Source API — Portfolio Routes
 *
 * Digunakan oleh @nuxtjs/sitemap untuk generate URL dinamis
 * setiap proyek portofolio dalam format yang benar.
 *
 * Endpoint: GET /api/_sitemap/portfolio
 */
import { readFileSync } from 'fs'
import { resolve } from 'path'

export default defineEventHandler(() => {
  // Baca portfolio JSON secara langsung (aman untuk Nitro bundling)
  const dataPath = resolve(process.cwd(), 'public/data/portfolio.json')
  const portfolioData = JSON.parse(readFileSync(dataPath, 'utf-8'))
  const projects = portfolioData.projects || []

  return projects.map((project: { id: string }) => ({
    loc: `/portfolio/${project.id}`,
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'monthly',
    priority: 0.8,
    alternatives: [
      { hreflang: 'en', href: `https://zeroman.my.id/portfolio/${project.id}?lang=en` },
      { hreflang: 'id', href: `https://zeroman.my.id/portfolio/${project.id}?lang=id` },
      { hreflang: 'x-default', href: `https://zeroman.my.id/portfolio/${project.id}` }
    ]
  }))
})
