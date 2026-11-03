<template>
  <div>
    <section class="section" style="padding-top: 48px;">
      <div class="container">

        <!-- Breadcrumb -->
        <AppBreadcrumb :items="breadcrumbItems" />

        <!-- Header -->
        <div class="section-header" data-reveal="rise">
          <div class="section-eyebrow" id="eyebrow-services">
            {{ lang === 'id' ? '// apa yang saya lakukan' : '// what I do' }}
          </div>
          <h1 class="section-title" id="title-services">
            {{ lang === 'id' ? 'Layanan & Keahlian' : 'Services & Expertise' }}
          </h1>
          <p class="services-lead" data-reveal="drift" data-reveal-step="1">
            {{ lang === 'id'
              ? 'Dari website kustom hingga sistem AI multi-agent — saya membangun solusi digital yang scalable, cepat, dan benar-benar berfungsi untuk bisnis Anda.'
              : 'From custom websites to multi-agent AI systems — I build scalable, fast digital solutions that actually work for your business.'
            }}
          </p>
        </div>

        <!-- Services Grid -->
        <div class="services-detail-grid" id="services-detail-grid">
          <div
            v-for="(s, i) in portfolio.services || []"
            :key="s.id"
            class="service-detail-card"
            data-spotlight
            data-reveal="settle"
            :data-reveal-step="i"
            :id="`service-card-${s.id}`"
          >
            <div class="service-detail-icon-wrap">
              <i :class="`icon-${s.icon || 'zap'}`"></i>
            </div>
            <div class="service-detail-content">
              <div class="service-detail-label">{{ translate(s, 'subtitle') }}</div>
              <h2 class="service-detail-title">{{ translate(s, 'title') }}</h2>
              <p class="service-detail-desc">{{ translate(s, 'desc') }}</p>
              <ul class="service-detail-features" :aria-label="`Fitur ${translate(s, 'title')}`">
                <li v-for="(f, idx) in translate(s, 'features')" :key="idx">
                  <span class="feature-check" aria-hidden="true">✓</span>
                  {{ f }}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- CTA -->
        <div class="services-cta" data-reveal="rise" id="services-cta-section">
          <div class="cta-banner" style="text-align: center;">
            <div class="cta-overlay" aria-hidden="true"></div>
            <div class="cta-content">
              <div class="section-eyebrow" style="justify-content: center; margin-bottom: 16px;">
                {{ lang === 'id' ? '// mulai sekarang' : '// get started' }}
              </div>
              <h2 class="cta-title" style="font-size: clamp(1.4rem, 2.5vw, 2rem);">
                {{ lang === 'id' ? 'Siap Memulai Proyek Anda?' : 'Ready to Start Your Project?' }}
              </h2>
              <p class="cta-desc">
                {{ lang === 'id'
                  ? 'Diskusikan kebutuhan Anda — konsultasi awal gratis.'
                  : 'Discuss your needs — free initial consultation.'
                }}
              </p>
              <NuxtLink to="/contact" class="btn-primary" id="services-cta-btn" style="display: inline-flex;">
                <span>{{ lang === 'id' ? 'Konsultasi Gratis' : 'Free Consultation' }}</span>
              </NuxtLink>
            </div>
          </div>
        </div>

      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useLanguage } from '~/composables/useLanguage'
import { useScrollReveal } from '~/composables/useScrollReveal'
import { useCardSpotlight } from '~/composables/useCardSpotlight'
import portfolioData from '~/public/data/portfolio.json'

const { translate, lang } = useLanguage()
useScrollReveal()
useCardSpotlight()

const portfolio = portfolioData

const breadcrumbItems = computed(() => [
  { label: lang.value === 'id' ? 'Beranda' : 'Home', to: '/' },
  { label: 'Services' }
])

// === SEO ===
const seoTitle = computed(() =>
  lang.value === 'id'
    ? 'Layanan Pengembangan Web & AI — Zeroman (Mahrus)'
    : 'Web Development & AI Services — Zeroman (Mahrus)'
)
const seoDescription = computed(() =>
  lang.value === 'id'
    ? 'Layanan jasa pengembangan website kustom, sistem CRM/CMS/HRM, asisten AI, dan konsultasi digital oleh Mahrus — Software Engineer & AI Architect.'
    : 'Custom web development services, CRM/CMS/HRM systems, AI assistants, and digital consulting by Mahrus — Software Engineer & AI Architect.'
)

const jsonLd = computed(() => ([
  {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    'name': 'Zeroman — Mahrus Software Engineer & AI Architect',
    'url': 'https://zeroman.my.id/services',
    'description': 'Custom web development, AI systems, and digital consulting services.',
    'provider': {
      '@type': 'Person',
      'name': 'Mahrus',
      'jobTitle': 'Software Engineer & AI Architect',
      'url': 'https://zeroman.my.id'
    },
    'areaServed': 'ID',
    'serviceType': ['Web Development', 'AI Development', 'CRM Systems', 'Digital Consulting']
  },
  ...(portfolioData.services || []).map(s => ({
    '@context': 'https://schema.org',
    '@type': 'Service',
    'name': s.title,
    'description': s.desc,
    'provider': {
      '@type': 'Person',
      'name': 'Mahrus',
      'url': 'https://zeroman.my.id'
    }
  }))
]))

useHead({
  title: seoTitle,
  meta: [
    { name: 'description', content: seoDescription },
    { property: 'og:title', content: seoTitle },
    { property: 'og:description', content: seoDescription },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://zeroman.my.id/services' },
    { property: 'og:image', content: 'https://zeroman.my.id/images/og-image.png' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: seoTitle },
    { name: 'twitter:description', content: seoDescription },
    { name: 'twitter:image', content: 'https://zeroman.my.id/images/og-image.png' }
  ],
  link: [
    { rel: 'canonical', href: 'https://zeroman.my.id/services' },
    { rel: 'alternate', hreflang: 'en', href: 'https://zeroman.my.id/services?lang=en' },
    { rel: 'alternate', hreflang: 'id', href: 'https://zeroman.my.id/services?lang=id' },
    { rel: 'alternate', hreflang: 'x-default', href: 'https://zeroman.my.id/services' }
  ],
  script: computed(() => [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(jsonLd.value)
    }
  ])
})
</script>

<style scoped>
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 40px;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.06em;
}
.breadcrumb-link { color: var(--fg-muted); text-decoration: none; transition: color 0.2s; }
.breadcrumb-link:hover { color: var(--accent-primary); }
.breadcrumb-sep { color: var(--border-mid); }
.breadcrumb-current { color: var(--fg-dim); font-weight: 600; }

.services-lead {
  font-size: 1.05rem;
  color: var(--fg-dim);
  line-height: 1.75;
  max-width: 640px;
  font-weight: 300;
  margin-top: 16px;
}

/* Services Detail Grid */
.services-detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--space-5);
  margin: var(--space-7) 0 var(--space-8);
}

.service-detail-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  background: var(--surface-2);
  border: 1px solid var(--border-mid);
  border-radius: var(--radius-lg);
  padding: var(--card-pad);
  box-shadow: var(--edge-highlight);
  overflow: hidden;
  transition: var(--t-lift);
}

/* Same accent treatment as the homepage service cards: cursor spotlight plus
   corner brackets, replacing the left bar. */
.service-detail-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: radial-gradient(240px circle at var(--mx, 50%) var(--my, 0%),
      rgba(212, 165, 116, 0.09),
      transparent 62%);
  opacity: 0;
  transition: opacity var(--dur-base) var(--ease-smooth);
  pointer-events: none;
}

.service-detail-card:hover {
  border-color: rgba(212, 165, 116, 0.28);
  transform: translateY(-3px);
  box-shadow: var(--edge-highlight-strong), var(--shadow-3);
}

.service-detail-card:hover::before {
  opacity: 1;
}

.service-detail-card::after {
  content: '';
  position: absolute;
  inset: 10px;
  pointer-events: none;
  opacity: 0;
  transform: scale(1.015);
  transition: opacity var(--dur-base) var(--ease-smooth),
              transform var(--dur-base) var(--ease-out);
  background-image:
    linear-gradient(var(--accent-primary), var(--accent-primary)),
    linear-gradient(var(--accent-primary), var(--accent-primary)),
    linear-gradient(var(--accent-primary), var(--accent-primary)),
    linear-gradient(var(--accent-primary), var(--accent-primary)),
    linear-gradient(var(--accent-primary), var(--accent-primary)),
    linear-gradient(var(--accent-primary), var(--accent-primary)),
    linear-gradient(var(--accent-primary), var(--accent-primary)),
    linear-gradient(var(--accent-primary), var(--accent-primary));
  background-repeat: no-repeat;
  background-size:
    14px 1px, 1px 14px,
    14px 1px, 1px 14px,
    14px 1px, 1px 14px,
    14px 1px, 1px 14px;
  background-position:
    left top, left top,
    right top, right top,
    left bottom, left bottom,
    right bottom, right bottom;
}

.service-detail-card:hover::after {
  opacity: 0.5;
  transform: scale(1);
}

.service-detail-icon-wrap {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  background: rgba(212, 165, 116, 0.07);
  border: 1px solid rgba(212, 165, 116, 0.16);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.15rem;
  color: var(--accent-primary);
  flex-shrink: 0;
}

/* BUGFIX: this wrapper had no internal rhythm, so the label, title and
   description sat flush against each other with zero breathing room. */
.service-detail-content {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.service-detail-label {
  font-family: var(--font-mono);
  font-size: 0.66rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--accent-primary);
  margin-bottom: var(--space-2);
}

.service-detail-title {
  font-family: var(--font-serif);
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--text);
  line-height: 1.25;
  letter-spacing: -0.015em;
  margin: 0 0 var(--space-3);
}

.service-detail-desc {
  font-size: 0.9rem;
  color: var(--text-muted);
  line-height: 1.65;
  font-weight: 300;
  margin: 0 0 var(--space-5);
}

.service-detail-features {
  list-style: none;
  padding: var(--space-4) 0 0;
  margin: auto 0 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  border-top: 1px solid var(--border-mid);
}

.service-detail-features li {
  display: flex;
  align-items: flex-start;
  gap: var(--space-2);
  font-size: 0.85rem;
  color: var(--text-subtle);
  font-weight: 300;
  line-height: 1.5;
}

.feature-check {
  color: var(--accent-primary);
  font-weight: 700;
  font-size: 0.9rem;
  flex-shrink: 0;
}

/* Process Section */
.process-section { margin-bottom: var(--space-8); }

.process-steps {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: var(--space-5);
}

.process-step {
  display: flex;
  gap: var(--space-4);
  align-items: flex-start;
  padding: var(--card-pad-sm);
  background: var(--surface-1);
  border: 1px solid var(--border-mid);
  border-radius: var(--radius-lg);
  box-shadow: var(--edge-highlight);
  transition: border-color var(--dur-base) var(--ease-smooth);
}

.process-step:hover {
  border-color: rgba(212, 165, 116, 0.22);
}

.process-num {
  font-family: var(--font-mono);
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--accent-primary);
  opacity: 0.35;
  line-height: 1;
  flex-shrink: 0;
}

.process-title {
  font-family: var(--font-serif);
  font-size: 1rem;
  font-weight: 600;
  color: var(--text);
  margin: 0 0 var(--space-2);
  line-height: 1.3;
}

.process-desc {
  font-size: 0.85rem;
  color: var(--text-muted);
  line-height: 1.6;
  font-weight: 300;
  margin: 0;
}

.services-cta { margin-top: var(--space-6); }

@media (max-width: 640px) {
  .services-detail-grid,
  .process-steps { grid-template-columns: 1fr; }
}
</style>