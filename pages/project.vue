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
              {{ translate(project, 'short_desc') }}
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

          <!-- Detail Content -->
          <div class="project-content fade-up delay-1">
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
              {{ lang === 'id' ? 'Hubungi Saya →' : 'Contact Me →' }}
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
    return `${translate(project.value, 'title')} — ${lang.value === 'id' ? 'Karya Anton' : "Anton's Work"}`
  }
  return lang.value === 'id' ? 'Proyek — Portofolio Anton' : 'Project — Anton\'s Portfolio'
})

const seoDescription = computed(() => {
  if (project.value) {
    return translate(project.value, 'short_desc')
  }
  return lang.value === 'id'
    ? 'Detail proyek pengembangan perangkat lunak dan arsitektur AI oleh Anton.'
    : 'Detailed project page of software development and AI architecture works by Anton.'
})

useHead({
  title: seoTitle,
  meta: [
    { name: 'description', content: seoDescription },
    { property: 'og:title', content: seoTitle },
    { property: 'og:description', content: seoDescription }
  ]
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
</script>
