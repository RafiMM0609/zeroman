<template>
  <div>
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content" style="z-index: 2;">
        <div 
          class="hero-chip" 
          id="hero-chip" 
          style="margin-bottom: 24px;"
          ref="heroChip"
          @mousemove="handleChipMouseMove"
          @mouseleave="handleChipMouseLeave"
        >
          <span>{{ translate(portfolio.hero, 'chip') }}</span>
        </div>
        <h1 class="hero-title" id="hero-title" v-html="translate(portfolio.hero, 'title')"></h1>
        <p class="hero-desc" id="hero-desc">
          {{ translate(portfolio.hero, 'desc') }}
        </p>
        <div style="display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;">
          <NuxtLink to="/contact" class="btn-primary" id="hero-cta-primary">
            <span>{{ translate(portfolio.hero, 'cta_primary') }}</span>
          </NuxtLink>
          <a href="#projects" class="btn-ghost" id="hero-cta-secondary" @click.prevent="scrollTo('#projects')">
            {{ translate(portfolio.hero, 'cta_secondary') }}
          </a>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="section" id="stats" style="padding-top: 0;">
      <div class="container">
        <div class="stats-grid">
          <div 
            v-for="(stat, i) in (portfolio.stats || [])" 
            :key="i"
            class="stat-card fade-up"
            :class="`delay-${i + 1}`"
          >
            <div v-if="stat.icon" class="stat-icon-wrap">
              <i :class="`icon-${stat.icon}`"></i>
            </div>
            <span class="stat-number">
              {{ stat.number }}{{ stat.suffix }}
            </span>
            <span class="stat-label">
              {{ translate(stat, 'label') }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- Ticker Section -->
    <div class="ticker-wrap">
      <div class="ticker-content">
        <!-- Duplicate items for seamless infinite scrolling loop -->
        <span 
          v-for="(item, i) in tickerItems" 
          :key="i" 
          class="ticker-item"
        >
          {{ item }}
        </span>
      </div>
    </div>

    <!-- Projects Section -->
    <section class="section" id="projects">
      <div class="container">
        <div class="section-header fade-up">
          <div class="section-eyebrow" id="eyebrow-projects">
            {{ translate(portfolio.sections, 'selected_work') }}
          </div>
          <h2 class="section-title" id="title-projects" v-html="translate(portfolio.sections, 'things_built')"></h2>
        </div>
        
        <div class="projects-list" id="projects-list">
          <NuxtLink 
            v-for="p in (portfolio.projects || [])" 
            :key="p.id" 
            :to="`/portfolio/${p.id}`" 
            class="project-item fade-up" 
            role="link" 
            tabindex="0"
          >
            <div class="project-num">{{ p.num }}</div>
            <div v-if="p.images && p.images.length" class="project-img-preview">
              <img :src="p.images[0]" :alt="translate(p, 'title')" width="180" height="110" loading="lazy" />
            </div>
            <div class="project-info">
              <h3 class="project-name">{{ translate(p, 'title') }}</h3>
              <p class="project-desc">{{ translate(p, 'short_desc') }}</p>
              <div class="project-meta">
                <div class="project-tags">
                  <span v-for="t in (p.tags || []).slice(0, 4)" :key="t" class="tag">{{ t }}</span>
                </div>
                <span :class="`project-status ${p.status}`">
                  {{ getStatusLabel(p.status) }}
                </span>
              </div>
            </div>
            <div class="project-arrow">↗</div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Services Section -->
    <section class="section" id="services">
      <div class="container">
        <div class="section-header fade-up">
          <div class="section-eyebrow" id="eyebrow-services">
            {{ translate(portfolio.sections, 'what_i_do') }}
          </div>
          <h2 class="section-title" id="title-services" v-html="translate(portfolio.sections, 'how_help')"></h2>
        </div>
        
        <div class="services-grid" id="services-grid">
          <div 
            v-for="(s, i) in (portfolio.services || [])" 
            :key="s.id" 
            class="service-card fade-up"
            :class="{ ['delay-' + i]: i > 0 }"
            :id="`service-${s.id}`"
          >
            <div class="service-icon-wrap">
              <i :class="`icon-${s.icon || 'zap'}`"></i>
            </div>
            <h3 class="service-title">{{ translate(s, 'title') }}</h3>
            <p class="service-subtitle">{{ translate(s, 'subtitle') }}</p>
            <p class="service-desc">{{ translate(s, 'desc') }}</p>
            <ul class="service-features">
              <li v-for="(f, idx) in translate(s, 'features')" :key="idx">
                {{ f }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="section" id="testimonials">
      <div class="container">
        <div class="section-header fade-up">
          <div class="section-eyebrow" id="eyebrow-testimonials">
            {{ translate(portfolio.sections, 'client_stories') }}
          </div>
          <h2 class="section-title" id="title-testimonials" v-html="translate(portfolio.sections, 'what_clients_say')"></h2>
        </div>
        
        <div class="testimonials-grid" id="testimonials-grid">
          <div 
            v-for="(t, i) in (portfolio.testimonials || [])" 
            :key="t.id"
            class="testimonial-card fade-up"
            :class="`delay-${i + 1}`"
          >
            <div class="testimonial-stars">
              <span v-for="n in (t.rating || 5)" :key="n">★</span>
            </div>
            <p class="testimonial-text">
              {{ translate(t, 'text') }}
            </p>
            <div class="testimonial-author">
              <div class="testimonial-avatar">{{ t.avatar }}</div>
              <div>
                <div class="testimonial-name">{{ t.name }}</div>
                <div class="testimonial-role">{{ t.role }} @ {{ t.company }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Banner Section -->
    <section class="section" style="padding-bottom: 2rem;">
      <div class="container">
        <div class="cta-banner fade-up">
          <div class="cta-overlay" aria-hidden="true"></div>
          <div class="cta-content">
            <div class="section-eyebrow" id="cta-eyebrow" style="justify-content: center; margin-bottom: 20px;">
              {{ translate(portfolio.sections, 'ready_collab') }}
            </div>
            <h2 class="cta-title" id="cta-title" v-html="translate(portfolio.sections, 'cta_title')"></h2>
            <p class="cta-desc" id="cta-desc">
              {{ translate(portfolio.sections, 'cta_desc') }}
            </p>
            <NuxtLink to="/contact" class="btn-primary" id="cta-btn" style="display: inline-flex;">
              <span>{{ translate(portfolio.sections, 'cta_btn') }}</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useLanguage } from '~/composables/useLanguage'
import { useScrollReveal } from '~/composables/useScrollReveal'
import portfolioData from '~/public/data/portfolio.json'

const { translate, lang } = useLanguage()

const heroChip = ref(null)

const handleChipMouseMove = (e) => {
  if (!heroChip.value) return
  const rect = heroChip.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  heroChip.value.style.setProperty('--mouse-x', `${x}px`)
  heroChip.value.style.setProperty('--mouse-y', `${y}px`)
}

const handleChipMouseLeave = () => {
  if (!heroChip.value) return
  heroChip.value.style.setProperty('--mouse-x', `-100px`)
  heroChip.value.style.setProperty('--mouse-y', `-100px`)
}

// Dynamic SEO Head tags
const title = computed(() => {
  return lang.value === 'id'
    ? 'Zeroman (Mahrus) — Software Engineer & AI Architect'
    : 'Zeroman (Mahrus) — Software Engineer & AI Architect'
})

const description = computed(() => {
  return lang.value === 'id'
    ? 'Website resmi Zeroman (Mahrus) - Software Engineer & AI Architect. Layanan pengembangan aplikasi web kustom, sistem CRM, CMS, HRM, dan asisten AI pintar.'
    : 'Official website of Zeroman (Mahrus) - Software Engineer & AI Architect. Custom web applications, CRM, CMS, HRM systems, and intelligent AI agents.'
})

const keywords = computed(() => {
  return lang.value === 'id'
    ? 'Zeroman, Mahrus, Software Engineer, AI Architect, Jasa CRM, Pembuatan CMS, Sistem HRM, Web Developer, Asisten AI, Nuxt, Vue, Node.js, AI Agent'
    : 'Zeroman, Mahrus, Software Engineer, AI Architect, Custom CRM, CMS Development, HRM Systems, Web Developer, AI Assistant, Nuxt, Vue, Node.js, AI Agent'
})

const route = useRoute()

const canonicalUrl = computed(() => {
  const langQuery = route.query?.lang
  if (langQuery === 'en' || langQuery === 'id') {
    return `https://zeroman.my.id/?lang=${langQuery}`
  }
  return 'https://zeroman.my.id/'
})

useHead({
  title,
  htmlAttrs: {
    lang: computed(() => lang.value)
  },
  meta: [
    { name: 'description', content: description },
    { name: 'keywords', content: keywords },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: canonicalUrl },
    { property: 'og:image', content: 'https://zeroman.my.id/images/og-image.png' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: 'https://zeroman.my.id/images/og-image.png' }
  ],
  link: [
    { rel: 'canonical', href: canonicalUrl },
    { rel: 'alternate', hreflang: 'en', href: 'https://zeroman.my.id/?lang=en' },
    { rel: 'alternate', hreflang: 'id', href: 'https://zeroman.my.id/?lang=id' },
    { rel: 'alternate', hreflang: 'x-default', href: 'https://zeroman.my.id/' }
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify([
        {
          '@context': 'https://schema.org',
          '@type': 'Person',
          'name': 'Mahrus',
          'jobTitle': 'Software Engineer & AI Architect',
          'url': 'https://zeroman.my.id',
          'sameAs': [
            portfolioData.profile?.github,
            portfolioData.profile?.linkedin
          ].filter(Boolean),
          'description': 'Mahrus is a Software Engineer & AI Architect specializing in custom web applications and multi-agent AI systems.'
        },
        {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          'name': 'zeroman',
          'url': 'https://zeroman.my.id/'
        }
      ])
    }
  ]
})

// Setup scroll reveal animation hook
useScrollReveal()

const portfolio = portfolioData

const tickerItems = computed(() => {
  const items = translate(portfolioData, 'ticker_items') || []
  // Duplicate for infinite CSS animation loop
  return [...items, ...items]
})

const getStatusLabel = (status) => {
  const statusLabelsEn = { live: 'Live', complete: 'Complete', client: 'Client Work' }
  const statusLabelsId = { live: 'Live', complete: 'Selesai', client: 'Proyek Klien' }
  
  if (lang.value === 'id') {
    return statusLabelsId[status] || status
  }
  return statusLabelsEn[status] || status
}

const scrollTo = (selector) => {
  const el = document.querySelector(selector)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
</script>
