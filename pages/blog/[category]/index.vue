<template>
  <div>
    <section class="section" style="padding-top: 100px;">
      <div class="container">

        <!-- Breadcrumb -->
        <nav class="breadcrumb" aria-label="Breadcrumb" id="breadcrumb-blog-cat">
          <NuxtLink to="/" class="breadcrumb-link">{{ lang === 'id' ? 'Beranda' : 'Home' }}</NuxtLink>
          <span class="breadcrumb-sep" aria-hidden="true">/</span>
          <NuxtLink to="/blog" class="breadcrumb-link">Blog</NuxtLink>
          <span class="breadcrumb-sep" aria-hidden="true">/</span>
          <span class="breadcrumb-current" aria-current="page">{{ categoryLabel }}</span>
        </nav>

        <!-- Header -->
        <div class="section-header fade-up">
          <div class="section-eyebrow" id="eyebrow-blog-cat">
            {{ lang === 'id' ? '// kategori' : '// category' }}
          </div>
          <h1 class="section-title" id="title-blog-cat">{{ categoryLabel }}</h1>
          <p class="blog-cat-lead fade-up delay-1">
            {{ lang === 'id'
              ? `Semua artikel dalam kategori "${categoryLabel}".`
              : `All articles in the "${categoryLabel}" category.`
            }}
          </p>
        </div>

        <!-- Articles -->
        <div class="blog-grid" id="blog-cat-grid">
          <NuxtLink
            v-for="article in categoryArticles"
            :key="article.slug"
            :to="`/blog/${category}/${article.slug}`"
            class="blog-card fade-up"
            :id="`blog-card-${article.slug}`"
          >
            <div class="blog-card-top">
              <span class="blog-card-category">{{ formatCategoryLabel(article.category) }}</span>
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

        <!-- Empty State -->
        <div v-if="categoryArticles.length === 0" class="blog-empty fade-up" id="blog-cat-empty">
          <div class="blog-empty-icon">📂</div>
          <h2 class="blog-empty-title">
            {{ lang === 'id' ? 'Belum Ada Artikel' : 'No Articles Yet' }}
          </h2>
          <p class="blog-empty-desc">
            {{ lang === 'id'
              ? 'Kategori ini sedang dalam penyusunan.'
              : 'This category is being prepared.'
            }}
          </p>
          <NuxtLink to="/blog" class="btn-ghost" id="blog-cat-back-btn">
            ← {{ lang === 'id' ? 'Kembali ke Blog' : 'Back to Blog' }}
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

const route = useRoute()
const category = computed(() => route.params.category)

/**
 * Data artikel — sama dengan blog/index.vue.
 * Nantinya ekstrak ke composable / @nuxt/content.
 */
const { data: rawArticles } = await useAsyncData(`blog-category-${category.value}`, () =>
  queryCollection('blog').order('date', 'DESC').all()
)

const categoryArticles = computed(() => {
  if (!rawArticles.value) return []
  return rawArticles.value
    .map(item => {
      const pathParts = (item.path || item._path || '').split('/').filter(Boolean)
      const cat = item.category || (pathParts.length >= 3 ? pathParts[1] : 'general')
      const articleSlug = item.stem ? item.stem.split('/').pop() : pathParts[pathParts.length - 1]

      return {
        ...item,
        slug: articleSlug,
        category: cat,
        title: item.title || '',
        titleId: item.titleId || item.title || '',
        excerpt: item.excerpt || item.description || '',
        excerptId: item.excerptId || item.description || '',
        date: item.date || '',
        readTime: item.readTime || 5,
        tags: item.tags || [],
        featured: Boolean(item.featured)
      }
    })
    .filter(a => a.category.toLowerCase() === (category.value || '').toLowerCase())
})

const categoryLabel = computed(() => {
  return formatCategoryLabel(category.value)
})

// === SEO ===
const seoTitle = computed(() =>
  lang.value === 'id'
    ? `${categoryLabel.value} — Blog Zeroman (Mahrus)`
    : `${categoryLabel.value} — Zeroman Blog`
)
const seoDescription = computed(() =>
  lang.value === 'id'
    ? `Kumpulan artikel dan catatan teknis kategori ${categoryLabel.value} oleh Mahrus.`
    : `Collection of articles and technical notes on ${categoryLabel.value} by Mahrus.`
)
const canonicalUrl = computed(() => `https://zeroman.my.id/blog/${category.value}`)

const jsonLd = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  'name': `${categoryLabel.value} — Blog Zeroman`,
  'description': seoDescription.value,
  'url': canonicalUrl.value,
  'isPartOf': {
    '@type': 'Blog',
    'url': 'https://zeroman.my.id/blog',
    'name': 'Blog Zeroman'
  }
}))

useHead({
  title: seoTitle,
  meta: [
    { name: 'description', content: seoDescription },
    { property: 'og:title', content: seoTitle },
    { property: 'og:description', content: seoDescription },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: canonicalUrl },
    { property: 'og:image', content: 'https://zeroman.my.id/images/og-image.png' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: seoTitle },
    { name: 'twitter:description', content: seoDescription },
    { name: 'twitter:image', content: 'https://zeroman.my.id/images/og-image.png' }
  ],
  link: [
    { rel: 'canonical', href: canonicalUrl },
    { rel: 'alternate', hreflang: 'x-default', href: canonicalUrl }
  ],
  script: computed(() => [
    { type: 'application/ld+json', innerHTML: JSON.stringify(jsonLd.value) }
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

.blog-cat-lead {
  font-size: 1rem;
  color: var(--fg-dim);
  line-height: 1.75;
  font-weight: 300;
  margin-top: 12px;
}

.blog-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
  margin-top: 40px;
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
.blog-card:hover { border-color: var(--accent-primary); transform: translateY(-3px); }

.blog-card-top { display: flex; align-items: center; justify-content: space-between; }
.blog-card-category { font-family: var(--font-mono); font-size: 0.68rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--accent-primary); }
.blog-card-read-time { font-family: var(--font-mono); font-size: 0.65rem; color: var(--fg-muted); }
.blog-card-title { font-size: 1.05rem; font-weight: 700; color: var(--fg); line-height: 1.35; margin: 0; }
.blog-card-excerpt { font-size: 0.87rem; color: var(--fg-dim); line-height: 1.65; font-weight: 300; margin: 0; flex: 1; }
.blog-card-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 4px; }
.blog-card-date { font-family: var(--font-mono); font-size: 0.67rem; color: var(--fg-muted); }
.blog-card-tags { display: flex; gap: 4px; }

.blog-empty { text-align: center; padding: 80px 24px; display: flex; flex-direction: column; align-items: center; gap: 16px; }
.blog-empty-icon { font-size: 3rem; }
.blog-empty-title { font-size: 1.4rem; font-weight: 700; color: var(--fg); margin: 0; }
.blog-empty-desc { font-size: 0.95rem; color: var(--fg-dim); line-height: 1.7; font-weight: 300; max-width: 380px; margin: 0; }

@media (max-width: 640px) {
  .blog-grid { grid-template-columns: 1fr; }
}
</style>
