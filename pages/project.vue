<template>
  <div v-if="project">
    <section class="section" style="padding-top: 80px;">
      <div class="container">
        
        <div class="project-detail">
          <!-- Back Link -->
          <NuxtLink 
            to="/" 
            id="back-link" 
            style="
              display: inline-flex;
              align-items: center;
              gap: 8px;
              font-family: var(--font-mono);
              font-size: 0.72rem;
              font-weight: 700;
              letter-spacing: 0.1em;
              text-transform: uppercase;
              color: var(--fg-muted);
              text-decoration: none;
              margin-bottom: 40px;
              transition: color 0.25s;
            "
          >
            {{ lang === 'id' ? '← Kembali' : '← Back' }}
          </NuxtLink>

          <!-- Header -->
          <div class="project-detail-header fade-up">
            <div class="section-eyebrow" style="margin-bottom: 16px;">
              {{ lang === 'id' ? '// detail proyek' : '// project detail' }}
            </div>
            <h1 class="section-title" style="font-size: clamp(1.8rem, 3vw, 2.6rem); margin-bottom: 16px;">
              {{ translate(project, 'title') }}
            </h1>
            <p style="font-size: 1.05rem; color: var(--fg-dim); line-height: 1.75; max-width: 680px; font-weight: 300;">
              {{ getEeatField(project, 'executive_summary') || translate(project, 'short_desc') }}
            </p>

            <!-- Meta row -->
            <div style="display: flex; align-items: center; gap: 16px; margin-top: 24px; flex-wrap: wrap;">
              <div class="project-tags">
                <span v-for="t in project.tags" :key="t" class="tag">{{ t }}</span>
              </div>
              <span :class="`project-status ${project.status}`" style="display: inline-block;">
                {{ getStatusLabel(project.status) }}
              </span>
              <span style="font-family: var(--font-mono); font-size: 0.68rem; color: var(--fg-muted); letter-spacing: 0.08em;">
                {{ project.year }}
              </span>
            </div>

            <!-- Action Links -->
            <div v-if="project.live || (project.github && project.github !== '#')" style="display: flex; align-items: center; gap: 12px; margin-top: 24px; flex-wrap: wrap;">
              <a 
                v-if="project.live" 
                :href="formatUrl(project.live)" 
                target="_blank"
                rel="noopener noreferrer"
                class="btn-primary" 
                id="project-live-link"
                style="display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; font-size: 0.85rem;"
              >
                <span>🚀 {{ lang === 'id' ? 'Buka Aplikasi' : 'Live Application' }}</span>
                <span>↗</span>
              </a>
              <a 
                v-if="project.github && project.github !== '#'" 
                :href="project.github" 
                target="_blank"
                rel="noopener noreferrer"
                class="btn-ghost" 
                id="project-github-link"
                style="display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; font-size: 0.85rem;"
              >
                <span>💻 {{ lang === 'id' ? 'Repository' : 'Source Code' }}</span>
                <span>↗</span>
              </a>
            </div>
          </div>

          <!-- E-E-A-T Structured Content (Clean Linear Report Layout) -->
          <div v-if="hasEeatData(project)" class="eeat-container fade-up delay-1">
            <!-- Key Challenges -->
            <div v-if="getEeatList(project, 'challenges')" class="eeat-section">
              <h2 class="eeat-h2">
                <span class="title-accent">//</span>
                {{ lang === 'id' ? 'Tantangan Utama' : 'Key Challenges' }}
              </h2>
              <ul class="eeat-bullet-list">
                <li v-for="(item, idx) in getEeatList(project, 'challenges')" :key="idx" v-html="formatChallenge(item)">
                </li>
              </ul>
            </div>

            <!-- Approach & Solutions -->
            <div v-if="getEeatList(project, 'solutions')" class="eeat-section">
              <h2 class="eeat-h2">
                <span class="title-accent">//</span>
                {{ lang === 'id' ? 'Pendekatan & Solusi' : 'Approach & Solutions' }}
              </h2>
              <div class="eeat-solutions-list">
                <div 
                  v-for="(sol, idx) in getEeatList(project, 'solutions')" 
                  :key="idx"
                  class="eeat-solution-item"
                >
                  <h3 class="eeat-h3">{{ idx + 1 }}. {{ translate(sol, 'title') }}</h3>
                  <p class="eeat-p">{{ translate(sol, 'desc') }}</p>
                </div>
              </div>
            </div>

            <!-- Tech Stack Table -->
            <div v-if="getEeatList(project, 'tech_reasons')" class="eeat-section">
              <h2 class="eeat-h2">
                <span class="title-accent">//</span>
                {{ lang === 'id' ? 'Mengapa Tech Stack Ini?' : 'Tech Stack' }}
              </h2>
              <div class="eeat-table-wrapper">
                <table class="eeat-tech-table">
                  <thead>
                    <tr>
                      <th>{{ lang === 'id' ? 'Teknologi' : 'Technology' }}</th>
                      <th>{{ lang === 'id' ? 'Alasan Pemilihan' : 'Reason' }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(tr, idx) in getEeatList(project, 'tech_reasons')" :key="idx">
                      <td class="tech-name">
                        <span class="tech-badge">{{ tr.tech }}</span>
                      </td>
                      <td class="tech-reason">{{ translate(tr, 'reason') }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Business Results & Impact -->
            <div v-if="getEeatList(project, 'impacts')" class="eeat-section">
              <h2 class="eeat-h2">
                <span class="title-accent">//</span>
                {{ lang === 'id' ? 'Hasil & Dampak Bisnis' : 'Results & Business Impact' }}
              </h2>
              <ul class="eeat-bullet-list impact-list">
                <li v-for="(imp, idx) in getEeatList(project, 'impacts')" :key="idx">
                  <span class="impact-highlight">{{ imp.value }}</span>
                  <span class="impact-label"> - {{ translate(imp, 'label') }}</span>
                  <span v-if="translate(imp, 'sub')" class="impact-sub"> ({{ translate(imp, 'sub') }})</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- Fallback Detail Content for Standard Projects -->
          <div v-else class="project-content fade-up delay-1">
            <p v-html="translate(project, 'full_desc')"></p>
          </div>

          <!-- Project Gallery -->
          <div v-if="project.images && project.images.length" class="project-gallery fade-up delay-2">
            <h2 style="
              font-family: var(--font-mono); 
              font-size: 0.72rem; 
              color: var(--accent-primary); 
              letter-spacing: 0.15em; 
              text-transform: uppercase; 
              margin-bottom: 24px;
              display: flex;
              align-items: center;
              gap: 8px;
            ">
              <span>//</span> {{ lang === 'id' ? 'Galeri Proyek' : 'Project Gallery' }}
            </h2>
            
            <div class="gallery-grid">
              <div 
                v-for="(img, idx) in project.images" 
                :key="idx" 
                class="gallery-item"
                @click="openLightbox(img)"
              >
                <div class="gallery-image-wrapper">
                  <img :src="img" :alt="`${translate(project, 'title')} - screenshot ${idx + 1}`" loading="lazy" />
                  <div class="gallery-overlay">
                    <span class="zoom-icon">🔍</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer CTA -->
          <div class="fade-up delay-3" style="
            margin-top: 48px;
            padding: 40px;
            background: var(--glass);
            border: 1px solid var(--border-mid);
            border-radius: var(--radius-lg);
            backdrop-filter: blur(16px);
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 20px;
          ">
            <div>
              <div style="font-size: 1.1rem; font-weight: 700; color: var(--fg); margin-bottom: 6px;">
                {{ lang === 'id' ? 'Tertarik dengan proyek seperti ini?' : 'Interested in a project like this?' }}
              </div>
              <div style="font-size: 0.88rem; color: var(--fg-dim); font-weight: 300;">
                {{ lang === 'id' ? 'Mari diskusikan proyek Anda.' : 'Let\'s discuss your project.' }}
              </div>
            </div>
            <NuxtLink to="/contact" class="btn-primary" id="project-cta">
              <span>{{ lang === 'id' ? 'Hubungi Saya' : 'Contact Me' }}</span>
            </NuxtLink>
          </div>
        </div>

      </div>
    </section>

    <!-- Lightbox Modal -->
    <Transition name="fade">
      <div v-if="lightboxImage" class="lightbox-modal" @click="closeLightbox">
        <button class="lightbox-close" @click="closeLightbox">&times;</button>
        <img :src="lightboxImage" class="lightbox-content" @click.stop />
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useLanguage } from '~/composables/useLanguage'
import { useScrollReveal } from '~/composables/useScrollReveal'
import portfolioData from '~/public/data/portfolio.json'

const { translate, lang } = useLanguage()

const route = useRoute()
const router = useRouter()

const projectId = computed(() => route.query.id)

const project = computed(() => {
  const list = portfolioData.projects || []
  
  // Legacy aliases support (from server.js)
  const legacyAlias = {
    'portofolio': 'zeroman-portfolio',
    'manajemen-data': 'data-management'
  }
  const id = legacyAlias[projectId.value] || projectId.value
  
  return list.find(p => p.id === id)
})

// Safely handle missing project ID or nonexistent project without breaking reactivity/transitions
if (import.meta.server) {
  if (!projectId.value) {
    navigateTo('/')
  } else if (!project.value) {
    showError({ statusCode: 404, statusMessage: 'Project not found' })
  }
}

onMounted(async () => {
  await router.isReady()
  if (!projectId.value) {
    navigateTo('/')
  } else if (!project.value) {
    showError({ statusCode: 404, statusMessage: 'Project not found' })
  }
})

watch(project, (newProject) => {
  if (import.meta.client && !newProject && projectId.value) {
    showError({ statusCode: 404, statusMessage: 'Project not found' })
  }
})

// Dynamic SEO Head tags
const seoTitle = computed(() => {
  if (project.value) {
    return `${translate(project.value, 'title')} — ${lang.value === 'id' ? 'Karya Mahrus' : "Mahrus's Work"}`
  }
  return lang.value === 'id' ? 'Proyek — Portofolio Mahrus' : 'Project — Mahrus\'s Portfolio'
})

const seoDescription = computed(() => {
  if (project.value) {
    return translate(project.value, 'short_desc')
  }
  return lang.value === 'id'
    ? 'Detail proyek pengembangan perangkat lunak dan arsitektur AI oleh Mahrus.'
    : 'Detailed project page of software development and AI architecture works by Mahrus.'
})

const seoImage = computed(() => {
  if (project.value && project.value.images && project.value.images.length) {
    return `https://zeroman.my.id${project.value.images[0]}`
  }
  return 'https://zeroman.my.id/images/og-image.png'
})

const jsonLd = computed(() => {
  if (!project.value) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    'name': translate(project.value, 'title'),
    'description': translate(project.value, 'short_desc'),
    'url': `https://zeroman.my.id/project?id=${project.value.id}`,
    'image': seoImage.value,
    'creator': {
      '@type': 'Person',
      'name': 'Mahrus'
    }
  }
})

const canonicalUrl = computed(() => {
  const langQuery = route.query?.lang
  const idQuery = project.value?.id || route.query?.id
  const params = []
  if (langQuery === 'en' || langQuery === 'id') params.push(`lang=${langQuery}`)
  if (idQuery) params.push(`id=${idQuery}`)
  return `https://zeroman.my.id/project${params.length ? `?${params.join('&')}` : ''}`
})

useHead({
  title: seoTitle,
  meta: [
    { name: 'description', content: seoDescription },
    { property: 'og:title', content: seoTitle },
    { property: 'og:description', content: seoDescription },
    { property: 'og:type', content: 'article' },
    { property: 'og:url', content: canonicalUrl },
    { property: 'og:image', content: seoImage },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: seoTitle },
    { name: 'twitter:description', content: seoDescription },
    { name: 'twitter:image', content: seoImage }
  ],
  link: [
    { rel: 'canonical', href: canonicalUrl },
    { rel: 'alternate', hreflang: 'en', href: computed(() => `https://zeroman.my.id/project?lang=en${project.value?.id ? `&id=${project.value.id}` : ''}`) },
    { rel: 'alternate', hreflang: 'id', href: computed(() => `https://zeroman.my.id/project?lang=id${project.value?.id ? `&id=${project.value.id}` : ''}`) },
    { rel: 'alternate', hreflang: 'x-default', href: computed(() => `https://zeroman.my.id/project${project.value?.id ? `?id=${project.value.id}` : ''}`) }
  ],
  script: computed(() => {
    const data = jsonLd.value
    if (!data) return []
    return [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify(data)
      }
    ]
  })
})

const lightboxImage = ref(null)

const openLightbox = (img) => {
  lightboxImage.value = img
  if (typeof document !== 'undefined') {
    document.body.style.overflow = 'hidden'
  }
}

const closeLightbox = () => {
  lightboxImage.value = null
  if (typeof document !== 'undefined') {
    document.body.style.overflow = ''
  }
}

// Setup scroll reveal animation hook
useScrollReveal()

const formatUrl = (url) => {
  if (!url) return ''
  return url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`
}

const getStatusLabel = (status) => {
  const statusLabelsEn = { live: 'Live', complete: 'Complete', client: 'Client Work' }
  const statusLabelsId = { live: 'Live', complete: 'Selesai', client: 'Proyek Klien' }
  
  if (lang.value === 'id') {
    return statusLabelsId[status] || status
  }
  return statusLabelsEn[status] || status
}

const hasEeatData = (p) => {
  if (!p) return false
  return !!(p.executive_summary || p.executive_summary_id || p.challenges || p.challenges_id || p.solutions || p.solutions_id)
}

const getEeatField = (p, key) => {
  if (!p) return ''
  if (lang.value === 'id' && p[key + '_id']) return p[key + '_id']
  return p[key] || ''
}

const getEeatList = (p, key) => {
  if (!p) return null
  if (lang.value === 'id' && p[key + '_id']) return p[key + '_id']
  return p[key] || null
}

const formatChallenge = (item) => {
  if (!item) return ''
  const colonIdx = item.indexOf(':')
  if (colonIdx !== -1) {
    const key = item.substring(0, colonIdx)
    const rest = item.substring(colonIdx + 1)
    return `<strong class="challenge-kw"><u>${key}:</u></strong>${rest}`
  }
  return item
}
</script>

<style scoped>
/* E-E-A-T Container & Components (Linear Report Style) */
.eeat-container {
  margin-top: 36px;
  display: flex;
  flex-direction: column;
  gap: 36px;
}

.eeat-executive-summary {
  background: rgba(255, 255, 255, 0.02);
  border-left: 3px solid var(--accent-primary, #6366f1);
  padding: 20px 24px;
  border-radius: 0 var(--radius-md, 12px) var(--radius-md, 12px) 0;
}

.eeat-summary-label {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--accent-primary, #6366f1);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 8px;
}

.eeat-summary-paragraph {
  font-size: 1.05rem;
  line-height: 1.8;
  color: var(--fg);
  font-weight: 300;
}

.eeat-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.eeat-h2 {
  font-family: var(--font-mono);
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--fg);
  display: flex;
  align-items: center;
  gap: 8px;
  letter-spacing: -0.01em;
  margin-bottom: 4px;
}

.title-accent {
  color: var(--accent-primary);
}

.eeat-h3 {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--fg);
  margin-bottom: 6px;
}

.eeat-p {
  font-size: 0.95rem;
  color: var(--fg-dim);
  line-height: 1.7;
  font-weight: 300;
}

/* Linear Lists */
.eeat-bullet-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.eeat-bullet-list li {
  position: relative;
  padding-left: 20px;
  font-size: 0.95rem;
  color: var(--fg-dim);
  line-height: 1.7;
  font-weight: 300;
}

.eeat-bullet-list li::before {
  content: "—";
  position: absolute;
  left: 0;
  color: var(--accent-primary);
  font-weight: 700;
}

:deep(.challenge-kw) {
  font-weight: 700;
  color: var(--fg);
  text-decoration: underline;
  text-underline-offset: 3px;
}

/* Impact Bullet List */
.impact-list li {
  padding-left: 20px;
}

.impact-list li::before {
  content: "—";
  color: var(--accent-primary);
}

.impact-highlight {
  color: var(--fg);
  font-family: var(--font-mono);
  font-size: 1.05rem;
  font-weight: 700;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.impact-label {
  color: var(--fg);
  font-weight: 600;
}

.impact-sub {
  color: var(--fg-muted);
  font-size: 0.88rem;
  font-weight: 300;
}

/* Linear Solutions List */
.eeat-solutions-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.eeat-solution-item {
  padding-left: 16px;
  border-left: 1px solid var(--border-mid, rgba(255, 255, 255, 0.1));
}

/* Tech Rationale Table */
.eeat-table-wrapper {
  overflow-x: auto;
  border-radius: var(--radius-lg, 12px);
  border: 1px solid var(--border-mid, rgba(255, 255, 255, 0.08));
  background: var(--glass, rgba(255, 255, 255, 0.02));
}

.eeat-tech-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.9rem;
}

.eeat-tech-table th {
  background: rgba(255, 255, 255, 0.04);
  padding: 12px 18px;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--fg-muted);
  border-bottom: 1px solid var(--border-mid, rgba(255, 255, 255, 0.08));
}

.eeat-tech-table td {
  padding: 14px 18px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  vertical-align: middle;
}

.eeat-tech-table tr:last-child td {
  border-bottom: none;
}

.tech-name {
  width: 180px;
  white-space: nowrap;
}

.tech-badge {
  display: inline-block;
  font-family: var(--font-mono);
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--accent-primary, #d4a574);
  background: rgba(212, 165, 116, 0.08);
  border: 1px solid rgba(212, 165, 116, 0.2);
  padding: 4px 10px;
  border-radius: 6px;
}

.tech-reason {
  color: var(--fg-dim);
  line-height: 1.6;
  font-weight: 300;
}
</style>
