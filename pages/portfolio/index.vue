<template>
  <div>
    <section class="section" style="padding-top: 48px;">
      <div class="container">

        <!-- Breadcrumb -->
        <AppBreadcrumb :items="breadcrumbItems" />

        <!-- Header -->
        <div class="section-header fade-up">
          <div class="section-eyebrow" id="eyebrow-portfolio">
            {{ lang === 'id' ? '// seleksi karya' : '// selected work' }}
          </div>
          <h1 class="section-title" id="title-portfolio">
            {{ lang === 'id' ? 'Portofolio Proyek' : 'Project Portfolio' }}
          </h1>
          <p class="portfolio-lead fade-up delay-1">
            {{ lang === 'id'
              ? 'Koleksi proyek nyata — dari sistem enterprise, aplikasi web, hingga arsitektur AI yang telah dibangun dan dioperasikan.'
              : 'A collection of real-world projects — from enterprise systems and web applications to AI architectures built and deployed in production.'
            }}
          </p>
        </div>

        <!-- Filter Tabs -->
        <div class="portfolio-filter fade-up delay-1" id="portfolio-filter" role="tablist" aria-label="Filter proyek">
          <button
            v-for="tab in filterTabs"
            :key="tab.key"
            class="filter-tab"
            :class="{ active: activeFilter === tab.key }"
            @click="activeFilter = tab.key"
            :id="`filter-${tab.key}`"
            role="tab"
            :aria-selected="activeFilter === tab.key"
          >
            {{ lang === 'id' ? tab.labelId : tab.labelEn }}
            <span class="filter-count">{{ getCount(tab.key) }}</span>
          </button>
        </div>

        <!-- Projects Grid -->
        <div class="portfolio-grid" id="portfolio-grid" role="tabpanel">
          <NuxtLink
            v-for="p in filteredProjects"
            :key="p.id"
            :to="`/portfolio/${p.id}`"
            class="portfolio-card fade-up"
            :id="`portfolio-card-${p.id}`"
          >
            <!-- Card Thumbnail -->
            <div class="portfolio-card-thumb">
              <img
                v-if="p.images && p.images.length"
                :src="p.images[0]"
                :alt="`Screenshot proyek ${translate(p, 'title')}`"
                width="360"
                height="200"
                loading="lazy"
                decoding="async"
              />
              <div v-else class="portfolio-card-placeholder">
                <i class="icon-layers"></i>
              </div>
              <div class="portfolio-card-overlay">
                <span class="portfolio-card-cta">{{ lang === 'id' ? 'Lihat Detail →' : 'View Detail →' }}</span>
              </div>
            </div>

            <!-- Card Body -->
            <div class="portfolio-card-body">
              <div class="portfolio-card-meta">
                <span :class="`project-status ${p.status}`">{{ getStatusLabel(p.status) }}</span>
                <span class="portfolio-card-year">{{ p.year }}</span>
              </div>
              <h2 class="portfolio-card-title">{{ translate(p, 'title') }}</h2>
              <p class="portfolio-card-desc">{{ translate(p, 'short_desc') }}</p>
              <div class="portfolio-card-tags">
                <span v-for="t in (p.tags || []).slice(0, 4)" :key="t" class="tag">{{ t }}</span>
              </div>
            </div>
          </NuxtLink>
        </div>

        <!-- Empty State -->
        <div v-if="filteredProjects.length === 0" class="portfolio-empty fade-up">
          <p>{{ lang === 'id' ? 'Tidak ada proyek di kategori ini.' : 'No projects in this category.' }}</p>
        </div>

        <!-- CTA -->
        <div class="portfolio-cta fade-up" id="portfolio-cta-section">
          <div class="cta-banner" style="text-align: center;">
            <div class="cta-overlay" aria-hidden="true"></div>
            <div class="cta-content">
              <div class="section-eyebrow" style="justify-content: center; margin-bottom: 16px;">
                {{ lang === 'id' ? '// kolaborasi' : '// collaborate' }}
              </div>
              <h2 class="cta-title" style="font-size: clamp(1.4rem, 2.5vw, 2rem);">
                {{ lang === 'id' ? 'Punya ide proyek?' : 'Have a project in mind?' }}
              </h2>
              <p class="cta-desc">
                {{ lang === 'id'
                  ? 'Mari diskusikan dan wujudkan bersama.'
                  : "Let's discuss and build it together."
                }}
              </p>
              <NuxtLink to="/contact" class="btn-primary" id="portfolio-cta-btn" style="display: inline-flex;">
                <span>{{ lang === 'id' ? 'Mulai Diskusi' : 'Start a Conversation' }}</span>
              </NuxtLink>
            </div>
          </div>
        </div>

      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useLanguage } from '~/composables/useLanguage'
import { useScrollReveal } from '~/composables/useScrollReveal'
import portfolioData from '~/public/data/portfolio.json'

const { translate, lang } = useLanguage()
useScrollReveal()

const breadcrumbItems = computed(() => [
  { label: lang.value === 'id' ? 'Beranda' : 'Home', to: '/' },
  { label: 'Portfolio' }
])

const projects = portfolioData.projects || []

const filterTabs = [
  { key: 'all', labelEn: 'All Projects', labelId: 'Semua Proyek' },
  { key: 'live', labelEn: 'Live', labelId: 'Live' },
  { key: 'client', labelEn: 'Client Work', labelId: 'Klien' },
  { key: 'complete', labelEn: 'Completed', labelId: 'Selesai' }
]

const activeFilter = ref('all')

const filteredProjects = computed(() => {
  if (activeFilter.value === 'all') return projects
  return projects.filter(p => p.status === activeFilter.value)
})

const getCount = (key) => {
  if (key === 'all') return projects.length
  return projects.filter(p => p.status === key).length
}

const getStatusLabel = (status) => {
  const statusLabelsEn = { live: 'Live', complete: 'Complete', client: 'Client Work' }
  const statusLabelsId = { live: 'Live', complete: 'Selesai', client: 'Proyek Klien' }
  return lang.value === 'id' ? (statusLabelsId[status] || status) : (statusLabelsEn[status] || status)
}

// === SEO ===
const seoTitle = computed(() =>
  lang.value === 'id'
    ? 'Portofolio Proyek — Zeroman (Mahrus) Software Engineer & AI Architect'
    : 'Project Portfolio — Zeroman (Mahrus) Software Engineer & AI Architect'
)
const seoDescription = computed(() =>
  lang.value === 'id'
    ? 'Kumpulan proyek nyata Mahrus: sistem CRM, CMS, HRM, chatbot AI, dan aplikasi web enterprise yang sudah live dan digunakan klien.'
    : 'Real-world projects by Mahrus: CRM systems, CMS, HRM, AI chatbots, and enterprise web applications live and used by clients.'
)

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  'name': 'Portofolio — Zeroman (Mahrus)',
  'description': 'Kumpulan proyek software engineering dan AI architecture oleh Mahrus.',
  'url': 'https://zeroman.my.id/portfolio',
  'author': {
    '@type': 'Person',
    'name': 'Mahrus',
    'url': 'https://zeroman.my.id'
  }
}

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  'itemListElement': [
    {
      '@type': 'ListItem',
      'position': 1,
      'name': 'Home',
      'item': 'https://zeroman.my.id'
    },
    {
      '@type': 'ListItem',
      'position': 2,
      'name': 'Portfolio',
      'item': 'https://zeroman.my.id/portfolio'
    }
  ]
}

useHead({
  title: seoTitle,
  meta: [
    { name: 'description', content: seoDescription },
    { property: 'og:title', content: seoTitle },
    { property: 'og:description', content: seoDescription },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://zeroman.my.id/portfolio' },
    { property: 'og:image', content: 'https://zeroman.my.id/images/og-image.png' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: seoTitle },
    { name: 'twitter:description', content: seoDescription },
    { name: 'twitter:image', content: 'https://zeroman.my.id/images/og-image.png' }
  ],
  link: [
    { rel: 'canonical', href: 'https://zeroman.my.id/portfolio' },
    { rel: 'alternate', hreflang: 'en', href: 'https://zeroman.my.id/portfolio?lang=en' },
    { rel: 'alternate', hreflang: 'id', href: 'https://zeroman.my.id/portfolio?lang=id' },
    { rel: 'alternate', hreflang: 'x-default', href: 'https://zeroman.my.id/portfolio' }
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(jsonLd)
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(breadcrumbJsonLd)
    }
  ]
})
</script>

<style scoped>
.portfolio-lead {
  font-size: 1.05rem;
  color: var(--fg-dim);
  line-height: 1.75;
  max-width: 620px;
  font-weight: 300;
  margin-top: 16px;
}

/* Filter Tabs */
.portfolio-filter {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin: 40px 0 32px;
}

.filter-tab {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 18px;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  background: transparent;
  border: 1px solid var(--border-mid);
  border-radius: 100px;
  color: var(--fg-muted);
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-tab:hover {
  border-color: var(--accent-primary);
  color: var(--fg);
}

.filter-tab.active {
  background: var(--accent-primary);
  border-color: var(--accent-primary);
  color: #fff;
}

.filter-count {
  font-size: 0.68rem;
  opacity: 0.75;
}

/* Grid */
.portfolio-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
  margin-bottom: 64px;
}

/* Card */
.portfolio-card {
  display: flex;
  flex-direction: column;
  background: var(--glass);
  border: 1px solid var(--border-mid);
  border-radius: var(--radius-lg);
  overflow: hidden;
  text-decoration: none;
  transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
  backdrop-filter: blur(12px);
}

.portfolio-card:hover {
  transform: translateY(-4px);
  border-color: var(--accent-primary);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
}

.portfolio-card-thumb {
  position: relative;
  width: 100%;
  aspect-ratio: 16/9;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.02);
}

.portfolio-card-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.portfolio-card:hover .portfolio-card-thumb img {
  transform: scale(1.04);
}

.portfolio-card-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--fg-muted);
  font-size: 2rem;
}

.portfolio-card-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.25s ease;
}

.portfolio-card:hover .portfolio-card-overlay {
  opacity: 1;
}

.portfolio-card-cta {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #fff;
  text-transform: uppercase;
}

.portfolio-card-body {
  padding: 20px 24px 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
}

.portfolio-card-meta {
  display: flex;
  align-items: center;
  gap: 10px;
}

.portfolio-card-year {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  color: var(--fg-muted);
  letter-spacing: 0.08em;
}

.portfolio-card-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--fg);
  line-height: 1.35;
  margin: 0;
}

.portfolio-card-desc {
  font-size: 0.88rem;
  color: var(--fg-dim);
  line-height: 1.65;
  font-weight: 300;
  margin: 0;
  flex: 1;
}

.portfolio-card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 4px;
}

/* Empty state */
.portfolio-empty {
  text-align: center;
  padding: 64px 0;
  color: var(--fg-muted);
  font-family: var(--font-mono);
  font-size: 0.88rem;
}

/* CTA */
.portfolio-cta {
  margin-top: 32px;
}

@media (max-width: 640px) {
  .portfolio-grid {
    grid-template-columns: 1fr;
  }
}
</style>
