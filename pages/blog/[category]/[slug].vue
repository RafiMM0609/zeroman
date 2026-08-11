<template>
  <div v-if="article">
    <article class="section" style="padding-top: 80px;" itemscope itemtype="https://schema.org/BlogPosting">

      <div class="container">

        <!-- Breadcrumb -->
        <nav class="breadcrumb" aria-label="Breadcrumb" id="breadcrumb-article">
          <NuxtLink to="/" class="breadcrumb-link">{{ lang === 'id' ? 'Beranda' : 'Home' }}</NuxtLink>
          <span class="breadcrumb-sep" aria-hidden="true">/</span>
          <NuxtLink to="/blog" class="breadcrumb-link">Blog</NuxtLink>
          <span class="breadcrumb-sep" aria-hidden="true">/</span>
          <NuxtLink :to="`/blog/${category}`" class="breadcrumb-link">{{ categoryLabel }}</NuxtLink>
          <span class="breadcrumb-sep" aria-hidden="true">/</span>
          <span class="breadcrumb-current" aria-current="page">{{ articleTitle }}</span>
        </nav>

        <!-- Article Header -->
        <header class="article-header fade-up">
          <div class="article-meta-top">
            <NuxtLink :to="`/blog/${category}`" class="article-category-badge" :id="`article-cat-${category}`">
              {{ categoryLabel }}
            </NuxtLink>
            <span class="article-read-time" itemprop="timeRequired">
              {{ article.readTime }} {{ lang === 'id' ? 'menit baca' : 'min read' }}
            </span>
          </div>

          <h1 class="article-title" itemprop="headline">{{ articleTitle }}</h1>
          <p class="article-excerpt" itemprop="description">{{ articleExcerpt }}</p>

          <div class="article-meta-row">
            <div class="article-author" itemprop="author" itemscope itemtype="https://schema.org/Person">
              <div class="article-author-avatar">M</div>
              <div>
                <div class="article-author-name" itemprop="name">Mahrus</div>
                <div class="article-author-title" itemprop="jobTitle">Software Engineer & AI Architect</div>
              </div>
            </div>
            <div class="article-date-info">
              <time :datetime="article.date" itemprop="datePublished">{{ article.date }}</time>
              <span v-if="article.updated">· {{ lang === 'id' ? 'Diperbarui' : 'Updated' }}: <time :datetime="article.updated" itemprop="dateModified">{{ article.updated }}</time></span>
            </div>
          </div>

          <div v-if="article.tags" class="article-tags">
            <span v-for="tag in article.tags" :key="tag" class="tag" itemprop="keywords">{{ tag }}</span>
          </div>
        </header>

        <!-- Divider -->
        <hr class="article-divider" aria-hidden="true" />

        <!-- Article Body -->
        <div class="article-body fade-up delay-1" itemprop="articleBody">
          <div v-html="articleContent"></div>
        </div>

        <!-- Related Articles -->
        <div v-if="relatedArticles.length > 0" class="related-articles fade-up delay-2" id="related-articles">
          <h2 class="related-title">{{ lang === 'id' ? 'Artikel Terkait' : 'Related Articles' }}</h2>
          <div class="related-grid">
            <NuxtLink
              v-for="related in relatedArticles"
              :key="related.slug"
              :to="`/blog/${related.category}/${related.slug}`"
              class="related-card"
              :id="`related-${related.slug}`"
            >
              <span class="related-cat">{{ related.category }}</span>
              <h3 class="related-card-title">{{ lang === 'id' ? related.titleId : related.title }}</h3>
              <span class="related-arrow">→</span>
            </NuxtLink>
          </div>
        </div>

        <!-- CTA -->
        <div class="article-cta fade-up delay-3" id="article-cta">
          <div class="cta-banner" style="text-align: center;">
            <div class="cta-overlay" aria-hidden="true"></div>
            <div class="cta-content">
              <div class="section-eyebrow" style="justify-content: center; margin-bottom: 16px;">
                {{ lang === 'id' ? '// diskusi lebih lanjut' : '// let\'s discuss' }}
              </div>
              <h2 class="cta-title" style="font-size: clamp(1.2rem, 2vw, 1.6rem);">
                {{ lang === 'id' ? 'Ada proyek atau pertanyaan?' : 'Have a project or question?' }}
              </h2>
              <NuxtLink to="/contact" class="btn-primary" id="article-cta-btn" style="display: inline-flex; margin-top: 20px;">
                <span>{{ lang === 'id' ? 'Hubungi Saya →' : 'Contact Me →' }}</span>
              </NuxtLink>
            </div>
          </div>
        </div>

      </div>
    </article>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useLanguage } from '~/composables/useLanguage'
import { useScrollReveal } from '~/composables/useScrollReveal'

const { lang } = useLanguage()
useScrollReveal()

const route = useRoute()
const category = computed(() => route.params.category)
const slug = computed(() => route.params.slug)

/**
 * Data artikel — nantinya ganti dengan @nuxt/content atau fetch API.
 * Struktur ini memudahkan migrasi ke @nuxt/content di masa depan.
 */
const allArticles = []

const article = computed(() =>
  allArticles.find(a => a.category === category.value && a.slug === slug.value) || null
)

// Jika artikel tidak ditemukan
if (import.meta.server && !article.value) {
  showError({ statusCode: 404, statusMessage: 'Article not found' })
}

const categoryLabel = computed(() =>
  (category.value || '').split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
)

const articleTitle = computed(() =>
  article.value ? (lang.value === 'id' ? article.value.titleId : article.value.title) : ''
)

const articleExcerpt = computed(() =>
  article.value ? (lang.value === 'id' ? article.value.excerptId : article.value.excerpt) : ''
)

const articleContent = computed(() =>
  article.value ? (lang.value === 'id' ? (article.value.contentId || article.value.content) : article.value.content) : ''
)

const relatedArticles = computed(() =>
  allArticles
    .filter(a => a.category === category.value && a.slug !== slug.value)
    .slice(0, 3)
)

// === SEO ===
const canonicalUrl = computed(() => `https://zeroman.my.id/blog/${category.value}/${slug.value}`)
const seoTitle = computed(() => article.value
  ? `${articleTitle.value} — Zeroman Blog`
  : 'Blog — Zeroman'
)
const seoDescription = computed(() => articleExcerpt.value)
const seoImage = computed(() =>
  article.value?.ogImage || 'https://zeroman.my.id/images/og-image.png'
)

const jsonLd = computed(() => {
  if (!article.value) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    'headline': articleTitle.value,
    'description': articleExcerpt.value,
    'url': canonicalUrl.value,
    'image': seoImage.value,
    'datePublished': article.value.date,
    'dateModified': article.value.updated || article.value.date,
    'author': {
      '@type': 'Person',
      'name': 'Mahrus',
      'jobTitle': 'Software Engineer & AI Architect',
      'url': 'https://zeroman.my.id'
    },
    'publisher': {
      '@type': 'Person',
      'name': 'Mahrus',
      'url': 'https://zeroman.my.id'
    },
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': canonicalUrl.value
    },
    'keywords': article.value.tags?.join(', '),
    'articleSection': categoryLabel.value,
    'inLanguage': lang.value === 'id' ? 'id-ID' : 'en-US'
  }
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
    { rel: 'alternate', hreflang: 'x-default', href: canonicalUrl }
  ],
  script: computed(() => {
    const data = jsonLd.value
    if (!data) return []
    return [{ type: 'application/ld+json', innerHTML: JSON.stringify(data) }]
  })
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
  flex-wrap: wrap;
}
.breadcrumb-link { color: var(--fg-muted); text-decoration: none; transition: color 0.2s; }
.breadcrumb-link:hover { color: var(--accent-primary); }
.breadcrumb-sep { color: var(--border-mid); }
.breadcrumb-current { color: var(--fg-dim); font-weight: 600; }

/* Article Header */
.article-header { margin-bottom: 40px; }

.article-meta-top {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.article-category-badge {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--accent-primary);
  text-decoration: none;
  padding: 4px 12px;
  border: 1px solid var(--accent-primary);
  border-radius: 100px;
  transition: all 0.2s;
}

.article-category-badge:hover {
  background: var(--accent-primary);
  color: #fff;
}

.article-read-time {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--fg-muted);
}

.article-title {
  font-size: clamp(1.8rem, 4vw, 3rem);
  font-weight: 900;
  color: var(--fg);
  line-height: 1.2;
  margin: 0 0 20px;
  max-width: 800px;
}

.article-excerpt {
  font-size: 1.1rem;
  color: var(--fg-dim);
  line-height: 1.75;
  font-weight: 300;
  max-width: 680px;
  margin: 0 0 28px;
}

.article-meta-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 20px;
}

.article-author {
  display: flex;
  align-items: center;
  gap: 12px;
}

.article-author-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--accent-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1rem;
  color: #fff;
  flex-shrink: 0;
}

.article-author-name { font-weight: 700; font-size: 0.9rem; color: var(--fg); }
.article-author-title { font-size: 0.78rem; color: var(--fg-muted); font-weight: 300; }

.article-date-info {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--fg-muted);
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.article-tags { display: flex; gap: 6px; flex-wrap: wrap; }

.article-divider {
  border: none;
  border-top: 1px solid var(--border-mid);
  margin: 32px 0 40px;
}

/* Article Body */
.article-body {
  max-width: 720px;
  font-size: 1rem;
  line-height: 1.85;
  color: var(--fg-dim);
  font-weight: 300;
  margin-bottom: 64px;
}

.article-body :deep(h2) {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--fg);
  margin: 40px 0 16px;
  line-height: 1.3;
}

.article-body :deep(h3) {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--fg);
  margin: 28px 0 12px;
}

.article-body :deep(p) { margin: 0 0 20px; }
.article-body :deep(a) { color: var(--accent-primary); }

.article-body :deep(code) {
  font-family: var(--font-mono);
  font-size: 0.85em;
  background: rgba(255, 255, 255, 0.07);
  padding: 2px 6px;
  border-radius: 4px;
  color: var(--accent-primary);
}

.article-body :deep(pre) {
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid var(--border-mid);
  border-radius: var(--radius-lg);
  padding: 20px 24px;
  overflow-x: auto;
  margin: 24px 0;
}

.article-body :deep(pre code) {
  background: none;
  padding: 0;
  font-size: 0.88rem;
  color: var(--fg-dim);
}

.article-body :deep(blockquote) {
  border-left: 3px solid var(--accent-primary);
  padding: 16px 24px;
  margin: 24px 0;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 0 var(--radius-md) var(--radius-md) 0;
  color: var(--fg-dim);
  font-style: italic;
}

.article-body :deep(ul),
.article-body :deep(ol) {
  padding-left: 24px;
  margin: 0 0 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* Related Articles */
.related-articles { margin-bottom: 64px; }

.related-title {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--accent-primary);
  margin-bottom: 20px;
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
}

.related-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 20px 24px;
  background: var(--glass);
  border: 1px solid var(--border-mid);
  border-radius: var(--radius-lg);
  text-decoration: none;
  transition: border-color 0.2s ease, transform 0.2s ease;
  position: relative;
}

.related-card:hover { border-color: var(--accent-primary); transform: translateY(-2px); }

.related-cat {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--accent-primary);
}

.related-card-title {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--fg);
  line-height: 1.4;
  margin: 0;
  flex: 1;
}

.related-arrow {
  font-size: 0.85rem;
  color: var(--fg-muted);
  align-self: flex-end;
}

.article-cta { margin-top: 32px; }

@media (max-width: 640px) {
  .article-title { font-size: 1.8rem; }
  .article-meta-row { flex-direction: column; align-items: flex-start; }
}
</style>
