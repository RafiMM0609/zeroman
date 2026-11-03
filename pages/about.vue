<template>
  <div>
    <section class="section" style="padding-top: 48px;">
      <div class="container">

        <!-- ═══ BREADCRUMB ═══ -->
        <AppBreadcrumb :items="breadcrumbItems" />

        <!-- ═══ HEADLINE & MANIFESTO ═══ -->
        <div class="about-hook-wrap" data-reveal="rise" id="about-headline-container">
          <div class="section-eyebrow">{{ translate(aboutHeadline, 'eyebrow') }}</div>
          <h1 class="section-title" style="margin-bottom: 0;" v-html="translate(aboutHeadline, 'title')"></h1>

          <!-- Hook Manifesto -->
          <div class="about-manifesto">
            <p class="about-manifesto-lead" v-html="translate(aboutHeadline, 'lead')"></p>
            <p class="about-manifesto-sub">{{ translate(aboutHeadline, 'sub') }}</p>
          </div>

          <!-- Stats Bar -->
          <div class="about-stats-row">
            <template v-for="(stat, i) in (aboutHeadline.stats || [])" :key="i">
              <AboutStatItem 
                :target="stat.number" 
                :unit="stat.unit" 
                :label="translate(stat, 'label')" 
              />
              <div 
                v-if="i < (aboutHeadline.stats.length - 1)" 
                class="about-stat-divider" 
                aria-hidden="true"
              ></div>
            </template>
          </div>
        </div>

        <!-- ═══ SKILLS SECTION ═══ -->
        <div class="section-header" data-reveal="rise" style="margin-bottom: var(--space-7); margin-top: var(--space-9);">
          <div class="section-eyebrow">{{ lang === 'id' ? '// stack & tools' : '// stack & tools' }}</div>
          <h2 class="section-title">
            <template v-if="lang === 'id'">Yang biasa saya <em>gunakan</em></template>
            <template v-else>What I <em>work with</em></template>
          </h2>
        </div>

        <div class="skills-section-inner" style="margin-bottom: 100px;">
          <!-- Skill Bars -->
          <div>
            <div id="skill-bars-container">
              <div 
                v-for="s in (portfolio.skills || []).slice(0, 8)" 
                :key="s.name" 
                class="skill-bar-item" data-reveal="settle"
              >
                <div class="skill-bar-header">
                  <span class="skill-bar-name">{{ s.name }}</span>
                  <span class="skill-bar-level">{{ s.level }}%</span>
                </div>
                <div class="skill-bar-track">
                  <div 
                    class="skill-bar-fill" 
                    :style="{ '--skill-level': s.level + '%', '--glow-color': s.glow }"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Skill Cloud -->
          <div>
            <div id="skill-cloud-container" class="skill-cloud">
              <span 
                v-for="s in (portfolio.skills || [])" 
                :key="s.name" 
                class="skill-cloud-tag" data-reveal="focus" 
                :data-cat="s.category"
              >
                {{ s.name }}
              </span>
            </div>
          </div>
        </div>

        <!-- ═══ TIMELINE ═══ -->
        <div class="section-header" data-reveal="rise" style="margin-top: 0; margin-bottom: var(--space-7);">
          <div class="section-eyebrow">{{ lang === 'id' ? '// perjalanan' : '// journey' }}</div>
          <h2 class="section-title">
            <template v-if="lang === 'id'">Dari mana saya <em>berasal</em></template>
            <template v-else>Where I <em>came from</em></template>
          </h2>
        </div>

        <div class="timeline" data-reveal="rise">
          <div 
            v-for="(t, i) in (portfolio.timeline || [])" 
            :key="i" 
            class="timeline-item"
          >
            <div class="timeline-dot"></div>
            <div class="timeline-period">{{ translate(t, 'period') }}</div>
            <div class="timeline-title">{{ translate(t, 'title') }}</div>
            <div class="timeline-sub">{{ translate(t, 'sub') }}</div>
            <p class="timeline-desc">{{ translate(t, 'desc') }}</p>
          </div>
        </div>

        <!-- ═══ CTA BANNER ═══ -->
        <!-- Replaced a hand-inlined duplicate of .cta-banner (which had its own
             blur, radius, and cobalt accent leaking in) with the real shared
             component classes, so this panel now matches the rest of the site. -->
        <div class="cta-banner" data-reveal="rise">
          <div class="cta-overlay" aria-hidden="true"></div>
          <div class="cta-content">
            <div class="section-eyebrow" style="justify-content: center; margin-bottom: var(--space-4);">
              {{ lang === 'id' ? '// siap berkolaborasi?' : '// ready to collaborate?' }}
            </div>
            <h2 class="cta-title">
              <template v-if="lang === 'id'">Punya proyek yang ingin<br><span class="text-gradient">kita bangun bersama?</span></template>
              <template v-else>Got a project you want<br><span class="text-gradient">to build together?</span></template>
            </h2>
            <p class="cta-desc">
              {{ lang === 'id' ? 'Saya membalas dalam waktu 24 jam.' : 'I reply within 24 hours.' }}
            </p>
            <NuxtLink to="/contact" class="btn-primary" id="about-cta-bottom" style="display: inline-flex;">
              <span>{{ lang === 'id' ? 'Ayo Bicara' : 'Let\'s Talk' }}</span>
            </NuxtLink>
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

// Breadcrumb items
const breadcrumbItems = computed(() => [
  { label: lang.value === 'id' ? 'Beranda' : 'Home', to: '/' },
  { label: lang.value === 'id' ? 'Tentang' : 'About' }
])

// Dynamic SEO Head tags
const title = computed(() => {
  return lang.value === 'id'
    ? 'Tentang Mahrus — Software Engineer & Arsitek AI | zeroman'
    : 'About Mahrus — Software Engineer & AI Architect | zeroman'
})

const description = computed(() => {
  return lang.value === 'id'
    ? 'Pelajari perjalanan Mahrus, seorang Software Engineer & Arsitek AI yang berfokus pada kecepatan, keterbacaan, dan sistem yang terukur.'
    : 'Learn about Mahrus\'s journey as a Software Engineer & AI Architect focusing on speed, readability, and scalable systems.'
})

const route = useRoute()

const canonicalUrl = computed(() => {
  const langQuery = route.query?.lang
  if (langQuery === 'en' || langQuery === 'id') {
    return `https://zeroman.my.id/about?lang=${langQuery}`
  }
  return 'https://zeroman.my.id/about'
})

useHead({
  title,
  meta: [
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:type', content: 'profile' },
    { property: 'og:url', content: canonicalUrl },
    { property: 'og:image', content: 'https://zeroman.my.id/images/og-image.png' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: 'https://zeroman.my.id/images/og-image.png' }
  ],
  link: [
    { rel: 'canonical', href: canonicalUrl },
    { rel: 'alternate', hreflang: 'en', href: 'https://zeroman.my.id/about?lang=en' },
    { rel: 'alternate', hreflang: 'id', href: 'https://zeroman.my.id/about?lang=id' },
    { rel: 'alternate', hreflang: 'x-default', href: 'https://zeroman.my.id/about' }
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        'name': 'About Mahrus',
        'description': 'Learn about Mahrus, a Software Engineer & AI Architect specializing in custom web apps and multi-agent systems.',
        'url': 'https://zeroman.my.id/about'
      })
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
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
            'name': 'About',
            'item': 'https://zeroman.my.id/about'
          }
        ]
      })
    }
  ]
})

// Setup scroll reveal animation hook
useScrollReveal()

const portfolio = portfolioData
const aboutHeadline = portfolioData.about_headline || {}
</script>