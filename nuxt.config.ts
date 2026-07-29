// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2026-07-17',
  devtools: { enabled: true },

  app: {
    head: {
      title: 'Mahrus — Software Engineer & AI Architect | zeroman',
      htmlAttrs: {
        lang: 'en'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: "Mahrus's Portfolio — Software Engineer & AI Architect. Specialized in custom web applications, multi-agent AI systems, and scalable backend architecture." },
        { name: 'keywords', content: 'software engineer, ai architect, web development, go, node.js, ai agents, fullstack, Mahrus, zeroman' },
        { property: 'og:title', content: 'Mahrus — Software Engineer & AI Architect Portfolio' },
        { property: 'og:description', content: 'I build systems that actually work — from custom web architecture to intelligent AI agent workflows.' },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://zeroman.my.id' },
        { property: 'og:image', content: 'https://zeroman.my.id/images/og-image.png' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Mahrus — Software Engineer & AI Architect | zeroman' },
        { name: 'twitter:description', content: "Mahrus's Portfolio — Software Engineer & AI Architect. Specialized in custom web applications, multi-agent AI systems, and scalable backend architecture." },
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

  runtimeConfig: {
    telegramBotToken: process.env.TELEGRAM_BOT_TOKEN || '',
    telegramChatId: process.env.TELEGRAM_CHAT_ID || '',
    upstashRedisRestUrl: process.env.UPSTASH_REDIS_REST_URL || '',
    upstashRedisRestToken: process.env.UPSTASH_REDIS_REST_TOKEN || '',
    upstashLimitRequests: Number(process.env.UPSTASH_LIMIT_REQUESTS) || 5,
    upstashLimitWindow: process.env.UPSTASH_LIMIT_WINDOW || '60s'
  }
})

