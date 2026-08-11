// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2026-07-17',
  devtools: { enabled: true },

  app: {
    head: {
      title: 'Zeroman (Mahrus) — Software Engineer & AI Architect',
      htmlAttrs: {
        lang: 'en'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Website resmi Zeroman (Mahrus) - Software Engineer & AI Architect. Layanan pengembangan aplikasi web kustom, sistem CRM, CMS, HRM, dan asisten AI pintar.' },
        { name: 'keywords', content: 'Zeroman, Mahrus, Software Engineer, AI Architect, Jasa CRM, Pembuatan CMS, Sistem HRM, Web Developer, Asisten AI, Nuxt, Vue, Node.js, AI Agent' },
        { property: 'og:title', content: 'Zeroman (Mahrus) — Software Engineer & AI Architect' },
        { property: 'og:description', content: 'Website resmi Zeroman (Mahrus) - Software Engineer & AI Architect. Layanan pengembangan aplikasi web kustom, sistem CRM, CMS, HRM, dan asisten AI pintar.' },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://zeroman.my.id' },
        { property: 'og:image', content: 'https://zeroman.my.id/images/og-image.png' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Zeroman (Mahrus) — Software Engineer & AI Architect' },
        { name: 'twitter:description', content: 'Website resmi Zeroman (Mahrus) - Software Engineer & AI Architect. Layanan pengembangan aplikasi web kustom, sistem CRM, CMS, HRM, dan asisten AI pintar.' },
        { name: 'twitter:image', content: 'https://zeroman.my.id/images/og-image.png' }
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'preconnect', href: 'https://cdn.jsdelivr.net', crossorigin: '' },
        { rel: 'dns-prefetch', href: 'https://fonts.googleapis.com' },
        { rel: 'dns-prefetch', href: 'https://cdn.jsdelivr.net' },
        { rel: 'preload', as: 'font', type: 'font/woff2', href: 'https://cdn.jsdelivr.net/npm/lucide-static@1.24.0/font/lucide.woff2', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap', media: 'print', onload: "this.media='all'" },
        { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/lucide-static@1.24.0/font/lucide.min.css', media: 'print', onload: "this.media='all'" }
      ]
    }
  },

  css: [
    '~/assets/css/style.css'
  ],

  modules: [
    '@nuxtjs/sitemap'
  ],

  site: {
    url: 'https://zeroman.my.id'
  },

  sitemap: {
    // Static routes + dynamic routes di-generate secara otomatis
    urls: [
      '/',
      '/portfolio',
      '/services',
      '/blog',
      '/about',
      '/contact',
      '/geo'
    ],
    // Dynamic portfolio routes — generate dari project IDs
    sources: [
      '/api/_sitemap/portfolio'
    ]
  },

  runtimeConfig: {
    telegramBotToken: process.env.TELEGRAM_BOT_TOKEN || '',
    telegramChatId: process.env.TELEGRAM_CHAT_ID || '',
    upstashRedisRestUrl: process.env.UPSTASH_REDIS_REST_URL || '',
    upstashRedisRestToken: process.env.UPSTASH_REDIS_REST_TOKEN || '',
    upstashLimitRequests: Number(process.env.UPSTASH_LIMIT_REQUESTS) || 5,
    upstashLimitWindow: process.env.UPSTASH_LIMIT_WINDOW || '60s'
  }
})

