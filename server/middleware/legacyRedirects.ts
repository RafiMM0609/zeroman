/**
 * Server Middleware: Legacy Redirect
 *
 * Menangani 301 Permanent Redirect dari URL legacy ke URL baru.
 * Diperlukan agar crawler (Googlebot, dll.) & backlink lama tetap mendapat
 * respons 301 di sisi server, bukan hanya client-side navigation.
 *
 * Pola yang dihandle:
 *   GET /project?id=xxx  → /portfolio/xxx  (301)
 *   GET /project         → /portfolio      (301)
 */
export default defineEventHandler((event) => {
  const url = event.node.req.url || ''

  // Hanya proses path yang dimulai dengan /project
  if (!url.startsWith('/project')) return

  const { pathname, searchParams } = new URL(url, 'http://localhost')

  if (pathname === '/project') {
    const id = searchParams.get('id')
    const newUrl = id ? `/portfolio/${id}` : '/portfolio'
    return sendRedirect(event, newUrl, 301)
  }
})
