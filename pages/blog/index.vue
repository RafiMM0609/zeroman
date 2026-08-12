<template>
  <div>
    <section class="section" style="padding-top: 48px;">
      <div class="container">

        <!-- Breadcrumb -->
        <AppBreadcrumb :items="breadcrumbItems" />

        <!-- Header -->
        <div class="section-header fade-up">
          <div class="section-eyebrow" id="eyebrow-blog">
            {{ lang === 'id' ? '// catatan & artikel' : '// notes & articles' }}
          </div>
          <h1 class="section-title" id="title-blog">
            {{ lang === 'id' ? 'Blog & Artikel' : 'Blog & Articles' }}
          </h1>
          <p class="blog-lead fade-up delay-1">
            {{ lang === 'id'
              ? 'Catatan teknis, studi kasus, dan panduan seputar software engineering, arsitektur sistem, dan AI dari pengalaman nyata.'
              : 'Technical notes, case studies, and guides on software engineering, system architecture, and AI from real-world experience.'
            }}
          </p>
        </div>

        <!-- Category Pills -->
        <div class="blog-categories fade-up delay-1" id="blog-categories" role="navigation" aria-label="Kategori Blog">
          <NuxtLink
            to="/blog"
            class="category-pill"
            :class="{ active: !activeCategory }"
            id="blog-cat-all"
          >
            {{ lang === 'id' ? 'Semua' : 'All' }}
            <span class="cat-count">{{ articles.length }}</span>
          </NuxtLink>
          <NuxtLink
            v-for="cat in categories"
            :key="cat.slug"
            :to="`/blog/${cat.slug}`"
            class="category-pill"
            :id="`blog-cat-${cat.slug}`"
          >
            {{ lang === 'id' ? cat.labelId : cat.labelEn }}
            <span class="cat-count">{{ cat.count }}</span>
          </NuxtLink>
        </div>

        <!-- Featured Article -->
        <div v-if="featuredArticle" class="blog-featured fade-up delay-2" id="blog-featured">
          <NuxtLink :to="`/blog/${featuredArticle.category}/${featuredArticle.slug}`" class="featured-card" id="featured-article-link">
            <div class="featured-card-body">
              <div class="featured-label">
                <span class="featured-badge">{{ lang === 'id' ? '★ Unggulan' : '★ Featured' }}</span>
                <span class="featured-category">{{ featuredArticle.category }}</span>
              </div>
              <h2 class="featured-title">{{ lang === 'id' ? featuredArticle.titleId : featuredArticle.title }}</h2>
              <p class="featured-excerpt">{{ lang === 'id' ? featuredArticle.excerptId : featuredArticle.excerpt }}</p>
              <div class="featured-meta">
                <span>{{ featuredArticle.date }}</span>
                <span>·</span>
                <span>{{ featuredArticle.readTime }} {{ lang === 'id' ? 'menit baca' : 'min read' }}</span>
              </div>
            </div>
          </NuxtLink>
        </div>

        <!-- Articles Grid -->
        <div class="blog-grid" id="blog-grid">
          <NuxtLink
            v-for="article in regularArticles"
            :key="article.slug"
            :to="`/blog/${article.category}/${article.slug}`"
            class="blog-card fade-up"
            :id="`blog-card-${article.slug}`"
          >
            <div class="blog-card-top">
              <span class="blog-card-category">{{ article.category }}</span>
              <span class="blog-card-read-time">{{ article.readTime }} {{ lang === 'id' ? 'menit' : 'min' }}</span>
            </div>
            <h2 class="blog-card-title">{{ lang === 'id' ? article.titleId : article.title }}</h2>
            <p class="blog-card-excerpt">{{ lang === 'id' ? article.excerptId : article.excerpt }}</p>
            <div class="blog-card-footer">
              <span class="blog-card-date">{{ article.date }}</span>
              <div class="blog-card-tags">
                <span v-for="tag in article.tags.slice(0, 2)" :key="tag" class="tag">{{ tag }}</span>
              </div>
            </div>
          </NuxtLink>
        </div>

        <!-- Empty / Coming Soon State -->
        <div v-if="articles.length === 0" class="blog-empty fade-up" id="blog-empty">
          <div class="blog-empty-icon">📝</div>
          <h2 class="blog-empty-title">
            {{ lang === 'id' ? 'Artikel Segera Hadir' : 'Articles Coming Soon' }}
          </h2>
          <p class="blog-empty-desc">
            {{ lang === 'id'
              ? 'Sedang menyiapkan catatan teknis dan studi kasus menarik. Pantau terus!'
              : 'Preparing technical notes and interesting case studies. Stay tuned!'
            }}
          </p>
          <NuxtLink to="/contact" class="btn-ghost" id="blog-empty-cta">
            {{ lang === 'id' ? 'Beritahu saya topik yang Anda inginkan' : 'Tell me topics you want' }}
          </NuxtLink>
        </div>

      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useLanguage } from '~/composables/useLanguage'
import { useScrollReveal } from '~/composables/useScrollReveal'

const { lang } = useLanguage()
useScrollReveal()

const breadcrumbItems = computed(() => [
  { label: lang.value === 'id' ? 'Beranda' : 'Home', to: '/' },
  { label: 'Blog' }
])

const route = useRoute()
const activeCategory = computed(() => route.query.category || null)

/**
 * Data artikel — nantinya bisa diganti dengan @nuxt/content atau fetch dari API.
 * Format slug: gunakan deskriptif-hyphenated sesuai standar SEO.
 */
const articles = [
  // Contoh struktur — isi dengan artikel nyata
  // {
  //   slug: 'membangun-multi-agent-ai-nuxt',
  //   title: 'Building a Multi-Agent AI System with Nuxt 3',
  //   titleId: 'Membangun Sistem AI Multi-Agent dengan Nuxt 3',
  //   excerpt: 'A deep dive into architecting AI agent pipelines...',
  //   excerptId: 'Eksplorasi mendalam membangun pipeline AI agent...',
  //   category: 'ai-architecture',
  //   date: '2025-01-15',
  //   readTime: 8,
  //   tags: ['AI', 'Nuxt', 'Multi-Agent'],
  //   featured: true
  // }
]

const categories = computed(() => {
  const catMap = {}
  articles.forEach(a => {
    if (!catMap[a.category]) {
      catMap[a.category] = { slug: a.category, labelEn: a.category, labelId: a.category, count: 0 }
    }
    catMap[a.category].count++
  })
  return Object.values(catMap)
})

const featuredArticle = computed(() => articles.find(a => a.featured) || null)
const regularArticles = computed(() => articles.filter(a => !a.featured))

// === SEO ===
const seoTitle = computed(() =>
  lang.value === 'id'
    ? 'Blog & Artikel Teknis — Zeroman (Mahrus)'
    : 'Blog & Technical Articles — Zeroman (Mahrus)'
)
const seoDescription = computed(() =>
  lang.value === 'id'
    ? 'Catatan teknis, studi kasus, dan panduan seputar software engineering, AI architecture, dan web development dari Mahrus.'
    : 'Technical notes, case studies, and guides on software engineering, AI architecture, and web development by Mahrus.'
)

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Blog',
  'name': 'Blog — Zeroman (Mahrus)',
  'description': 'Technical articles on software engineering, AI architecture, and web development.',
  'url': 'https://zeroman.my.id/blog',
  'author': {
    '@type': 'Person',
    'name': 'Mahrus',
    'url': 'https://zeroman.my.id'
  }
}

useHead({
  title: seoTitle,
  meta: [
    { name: 'description', content: seoDescription },
    { property: 'og:title', content: seoTitle },
    { property: 'og:description', content: seoDescription },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://zeroman.my.id/blog' },
    { property: 'og:image', content: 'https://zeroman.my.id/images/og-image.png' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: seoTitle },
    { name: 'twitter:description', content: seoDescription },
    { name: 'twitter:image', content: 'https://zeroman.my.id/images/og-image.png' }
  ],
  link: [
    { rel: 'canonical', href: 'https://zeroman.my.id/blog' },
    { rel: 'alternate', hreflang: 'en', href: 'https://zeroman.my.id/blog?lang=en' },
    { rel: 'alternate', hreflang: 'id', href: 'https://zeroman.my.id/blog?lang=id' },
    { rel: 'alternate', hreflang: 'x-default', href: 'https://zeroman.my.id/blog' }
  ],
  script: [
    { type: 'application/ld+json', innerHTML: JSON.stringify(jsonLd) }
  ]
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

.blog-lead {
  font-size: 1.05rem;
  color: var(--fg-dim);
  line-height: 1.75;
  max-width: 620px;
  font-weight: 300;
  margin-top: 16px;
}

/* Category Pills */
.blog-categories {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin: 36px 0 40px;
}

.category-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 16px;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  background: transparent;
  border: 1px solid var(--border-mid);
  border-radius: 100px;
  color: var(--fg-muted);
  text-decoration: none;
  transition: all 0.2s ease;
}

.category-pill:hover,
.category-pill.active {
  background: var(--accent-primary);
  border-color: var(--accent-primary);
  color: #fff;
}

.cat-count {
  font-size: 0.62rem;
  opacity: 0.7;
}

/* Featured Article */
.blog-featured { margin-bottom: 48px; }

.featured-card {
  display: block;
  padding: 40px;
  background: var(--glass);
  border: 1px solid var(--accent-primary);
  border-radius: var(--radius-lg);
  text-decoration: none;
  backdrop-filter: blur(16px);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.featured-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
}

.featured-label {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.featured-badge {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--accent-primary);
}

.featured-category {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  color: var(--fg-muted);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.featured-title {
  font-size: clamp(1.3rem, 2.5vw, 1.8rem);
  font-weight: 700;
  color: var(--fg);
  line-height: 1.3;
  margin: 0 0 12px;
}

.featured-excerpt {
  font-size: 1rem;
  color: var(--fg-dim);
  line-height: 1.7;
  font-weight: 300;
  margin: 0 0 20px;
  max-width: 680px;
}

.featured-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--fg-muted);
}

/* Articles Grid */
.blog-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 64px;
}

.blog-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 28px;
  background: var(--glass);
  border: 1px solid var(--border-mid);
  border-radius: var(--radius-lg);
  text-decoration: none;
  backdrop-filter: blur(12px);
  transition: border-color 0.25s ease, transform 0.25s ease;
}

.blog-card:hover {
  border-color: var(--accent-primary);
  transform: translateY(-3px);
}

.blog-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.blog-card-category {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--accent-primary);
}

.blog-card-read-time {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  color: var(--fg-muted);
}

.blog-card-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--fg);
  line-height: 1.35;
  margin: 0;
}

.blog-card-excerpt {
  font-size: 0.87rem;
  color: var(--fg-dim);
  line-height: 1.65;
  font-weight: 300;
  margin: 0;
  flex: 1;
}

.blog-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 4px;
}

.blog-card-date {
  font-family: var(--font-mono);
  font-size: 0.67rem;
  color: var(--fg-muted);
}

.blog-card-tags {
  display: flex;
  gap: 4px;
}

/* Empty State */
.blog-empty {
  text-align: center;
  padding: 80px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.blog-empty-icon { font-size: 3rem; }

.blog-empty-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--fg);
  margin: 0;
}

.blog-empty-desc {
  font-size: 0.95rem;
  color: var(--fg-dim);
  line-height: 1.7;
  font-weight: 300;
  max-width: 400px;
  margin: 0;
}

@media (max-width: 640px) {
  .blog-grid { grid-template-columns: 1fr; }
  .featured-card { padding: 24px; }
}
</style>
