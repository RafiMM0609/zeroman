<template>
  <div>
    <section class="section" style="padding-top: 100px;">
      <div class="container">

        <!-- Breadcrumb -->
        <nav class="breadcrumb" aria-label="Breadcrumb" id="breadcrumb-services">
          <NuxtLink to="/" class="breadcrumb-link">{{ lang === 'id' ? 'Beranda' : 'Home' }}</NuxtLink>
          <span class="breadcrumb-sep" aria-hidden="true">/</span>
          <span class="breadcrumb-current" aria-current="page">Services</span>
        </nav>

        <!-- Header -->
        <div class="section-header fade-up">
          <div class="section-eyebrow" id="eyebrow-services">
            {{ lang === 'id' ? '// apa yang saya lakukan' : '// what I do' }}
          </div>
          <h1 class="section-title" id="title-services">
            {{ lang === 'id' ? 'Layanan & Keahlian' : 'Services & Expertise' }}
          </h1>
          <p class="services-lead fade-up delay-1">
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
            class="service-detail-card fade-up"
            :class="`delay-${i + 1}`"
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

        <!-- Working Process Section -->
        <div class="process-section fade-up">
          <div class="section-header" style="margin-bottom: 40px;">
            <div class="section-eyebrow" id="eyebrow-process">
              {{ lang === 'id' ? '// cara kerja' : '// how it works' }}
            </div>
            <h2 class="section-title" id="title-process" style="font-size: clamp(1.4rem, 2.5vw, 2rem);">
              {{ lang === 'id' ? 'Proses Kolaborasi' : 'Collaboration Process' }}
            </h2>
          </div>
          <div class="process-steps" id="process-steps">
            <div
              v-for="(step, idx) in processSteps"
              :key="idx"
              class="process-step fade-up"
              :class="`delay-${idx + 1}`"
              :id="`process-step-${idx + 1}`"
            >
              <div class="process-num">{{ String(idx + 1).padStart(2, '0') }}</div>
              <div class="process-body">
                <h3 class="process-title">{{ lang === 'id' ? step.titleId : step.titleEn }}</h3>
                <p class="process-desc">{{ lang === 'id' ? step.descId : step.descEn }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- CTA -->
        <div class="services-cta fade-up" id="services-cta-section">
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
                <span>{{ lang === 'id' ? 'Konsultasi Gratis →' : 'Free Consultation →' }}</span>
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
import portfolioData from '~/public/data/portfolio.json'

const { translate, lang } = useLanguage()
useScrollReveal()

const portfolio = portfolioData

const processSteps = [
  {
    titleEn: 'Discovery & Brief',
    titleId: 'Diskusi & Brief',
    descEn: 'We start with a conversation to understand your goals, constraints, and desired outcomes.',
    descId: 'Mulai dengan diskusi untuk memahami tujuan, batasan, dan hasil yang Anda inginkan.'
  },
  {
    titleEn: 'Proposal & Planning',
    titleId: 'Proposal & Perencanaan',
    descEn: 'I prepare a detailed proposal with timeline, tech stack choices, and milestone breakdown.',
    descId: 'Saya menyiapkan proposal detail dengan timeline, pilihan tech stack, dan breakdown milestone.'
  },
  {
    titleEn: 'Development & Iterations',
    titleId: 'Pengembangan & Iterasi',
    descEn: 'Agile-style development with regular check-ins and demos so you stay in the loop.',
    descId: 'Pengembangan gaya agile dengan check-in rutin dan demo agar Anda selalu up-to-date.'
  },
  {
    titleEn: 'Launch & Handover',
    titleId: 'Launch & Serah Terima',
    descEn: 'Deployment to production, full documentation, and knowledge transfer to your team.',
    descId: 'Deployment ke produksi, dokumentasi lengkap, dan transfer pengetahuan ke tim Anda.'
  }
]

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
  gap: 24px;
  margin: 48px 0 72px;
}

.service-detail-card {
  background: var(--glass);
  border: 1px solid var(--border-mid);
  border-radius: var(--radius-lg);
  padding: 32px;
  backdrop-filter: blur(12px);
  transition: border-color 0.25s ease, transform 0.25s ease;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.service-detail-card:hover {
  border-color: var(--accent-primary);
  transform: translateY(-3px);
}

.service-detail-icon-wrap {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-mid);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  color: var(--accent-primary);
}

.service-detail-label {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--accent-primary);
}

.service-detail-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--fg);
  line-height: 1.3;
  margin: 0;
}

.service-detail-desc {
  font-size: 0.9rem;
  color: var(--fg-dim);
  line-height: 1.7;
  font-weight: 300;
  margin: 0;
}

.service-detail-features {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-top: 1px solid var(--border-mid);
  padding-top: 16px;
  margin-top: auto;
}

.service-detail-features li {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.85rem;
  color: var(--fg-dim);
  font-weight: 300;
}

.feature-check {
  color: var(--accent-primary);
  font-weight: 700;
  font-size: 0.9rem;
  flex-shrink: 0;
}

/* Process Section */
.process-section { margin-bottom: 72px; }

.process-steps {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 24px;
}

.process-step {
  display: flex;
  gap: 20px;
  align-items: flex-start;
  padding: 24px;
  background: var(--glass);
  border: 1px solid var(--border-mid);
  border-radius: var(--radius-lg);
  backdrop-filter: blur(8px);
}

.process-num {
  font-family: var(--font-mono);
  font-size: 2rem;
  font-weight: 900;
  color: var(--accent-primary);
  opacity: 0.3;
  line-height: 1;
  flex-shrink: 0;
}

.process-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--fg);
  margin: 0 0 8px;
}

.process-desc {
  font-size: 0.85rem;
  color: var(--fg-dim);
  line-height: 1.65;
  font-weight: 300;
  margin: 0;
}

.services-cta { margin-top: 32px; }

@media (max-width: 640px) {
  .services-detail-grid,
  .process-steps { grid-template-columns: 1fr; }
}
</style>
