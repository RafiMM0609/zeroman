<template>
  <div class="geo-page-body">
    <!-- Background grid & floating orbs -->
    <div class="bg-grid" aria-hidden="true"></div>
    <div class="bg-orbs" aria-hidden="true">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="orb orb-3"></div>
    </div>

    <Navbar />

    <div class="geo-container">
      <NuxtLink to="/" class="back-link" id="back-link">
        <span class="back-arrow">←</span>
        <span>zeroman</span>
      </NuxtLink>

      <div class="detector-card" :class="'lang-' + currentLang">
        <!-- Eyebrow -->
        <div class="card-eyebrow">// LOCATION DETECTOR & GEOLOCATION SERVED</div>

        <!-- Radar animation -->
        <div class="radar-wrap">
          <div class="radar" :class="{ detecting: isLoading, ['lang-' + currentLang]: !isLoading }">
            <div class="radar-ring"></div>
            <div class="radar-ring"></div>
            <div class="radar-ring"></div>
            <div class="radar-core" id="radar-core">
              {{ currentLang === 'id' ? '🇮🇩' : '🌐' }}
            </div>
          </div>
        </div>

        <!-- Greeting & Status -->
        <div class="status-line fade-up in" id="status-section">
          <h1 id="main-greeting">
            <span :class="currentLang === 'id' ? 'highlight-id' : 'highlight'">
              {{ greetingSpan }}
            </span>
          </h1>
          <p class="status-desc" id="status-desc">{{ statusDesc }}</p>
        </div>

        <!-- Language badge -->
        <div style="display: flex; justify-content: center; margin-bottom: 32px;">
          <div class="lang-badge visible" :class="'lang-' + currentLang" id="lang-badge">
            <span class="lang-dot"></span>
            <span id="lang-badge-text">{{ badgeText }}</span>
          </div>
        </div>

        <!-- Error notice -->
        <div class="error-notice" :class="{ visible: hasError }" id="error-notice">
          ⚠️ Could not detect your location automatically. Defaulting to English.
        </div>

        <!-- Info tiles -->
        <div class="info-grid fade-up in" id="info-grid">
          <div class="info-tile">
            <span class="tile-label">Country / Negara</span>
            <span class="tile-value" :class="{ skeleton: isLoading }" id="tile-country">
              {{ country }}
            </span>
          </div>
          <div class="info-tile">
            <span class="tile-label">City / Kota</span>
            <span class="tile-value" :class="{ skeleton: isLoading }" id="tile-city">
              {{ city }}
            </span>
          </div>
          <div class="info-tile">
            <span class="tile-label">Region / Wilayah</span>
            <span class="tile-value" :class="{ skeleton: isLoading }" id="tile-region">
              {{ region }}
            </span>
          </div>
          <div class="info-tile">
            <span class="tile-label">Language Served</span>
            <span class="tile-value" :class="{ skeleton: isLoading }" id="tile-lang">
              {{ langLabel }}
            </span>
          </div>
        </div>

        <!-- Notice text -->
        <div class="notice-box" id="notice-box">
          <strong id="notice-title">{{ noticeTitle }}</strong><br>
          <span id="notice-body">{{ noticeBody }}</span>
        </div>

        <!-- Footer row -->
        <div class="footer-row">
          <div class="ip-pill">
            <span class="ip-dot"></span>
            <span id="ip-display">{{ ipAddress }}</span>
          </div>
          <button class="btn-toggle" id="toggle-btn" @click="toggleLanguage">
            <span class="btn-icon">🔄</span>
            <span id="toggle-label">{{ toggleLabel }}</span>
          </button>
        </div>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Navbar from '~/components/Navbar.vue'
import Footer from '~/components/Footer.vue'

definePageMeta({
  layout: false
})

// Dynamic SEO Head tags
const title = computed(() => {
  return currentLang.value === 'id'
    ? 'Detektor Lokasi — Layanan Bahasa Kustom | zeroman'
    : 'Location Detector — Custom Geolocation Content | zeroman'
})

const description = computed(() => {
  return currentLang.value === 'id'
    ? 'Deteksi lokasi pengunjung secara otomatis untuk menyajikan konten bahasa terbaik yang sesuai dengan wilayah Anda.'
    : 'Automatically detect visitor location to serve the best customized content corresponding to your region.'
})

const route = useRoute()

const canonicalUrl = computed(() => {
  const langQuery = route.query?.lang
  if (langQuery === 'en' || langQuery === 'id') {
    return `https://zeroman.my.id/geo?lang=${langQuery}`
  }
  return 'https://zeroman.my.id/geo'
})

useHead({
  title,
  meta: [
    { name: 'description', content: description },
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
    { rel: 'alternate', hreflang: 'en', href: 'https://zeroman.my.id/geo?lang=en' },
    { rel: 'alternate', hreflang: 'id', href: 'https://zeroman.my.id/geo?lang=id' },
    { rel: 'alternate', hreflang: 'x-default', href: 'https://zeroman.my.id/geo' }
  ]
})

const STRINGS = {
  id: {
    greetingSpan: 'Kamu ada di Indonesia!',
    desc:         'Kami mendeteksimu dari Indonesia. Konten ditampilkan dalam Bahasa Indonesia.',
    badgeText:    '🇮🇩 Bahasa Indonesia aktif',
    noticeTitle:  'Selamat datang, pengguna Indonesia!',
    noticeBody:   'Karena kamu mengakses dari Indonesia, kami akan menyajikan konten dalam Bahasa Indonesia. Kamu tetap bisa ganti ke Inggris kapanpun.',
    toggleLabel:  'Switch to English 🇬🇧',
    langLabel:    'Bahasa Indonesia',
  },
  en: {
    greetingSpan: 'You\'re outside Indonesia!',
    desc:         'We detected your location outside Indonesia. Content is displayed in English.',
    badgeText:    '🌐 English active',
    noticeTitle:  'Welcome, international visitor!',
    noticeBody:   'Since you\'re visiting from outside Indonesia, we\'re showing content in English. You can still switch to Bahasa Indonesia anytime.',
    toggleLabel:  'Ganti ke Bahasa Indonesia 🇮🇩',
    langLabel:    'English',
  }
}

const currentLang = ref('en')
const isLoading = ref(true)
const hasError = ref(false)

const country = ref('')
const city = ref('')
const region = ref('')
const ipAddress = ref('x.x.x.x')

// Computed strings based on currentLang
const greetingSpan = computed(() => {
  if (isLoading.value) return 'Detecting…'
  return STRINGS[currentLang.value].greetingSpan
})
const statusDesc = computed(() => {
  if (isLoading.value) return 'Fetching your location, please wait…'
  return STRINGS[currentLang.value].desc
})
const badgeText = computed(() => {
  if (isLoading.value) return 'Detecting language…'
  return STRINGS[currentLang.value].badgeText
})
const langLabel = computed(() => {
  if (isLoading.value) return '—'
  return STRINGS[currentLang.value].langLabel
})
const noticeTitle = computed(() => {
  if (isLoading.value) return 'Detecting your location…'
  return STRINGS[currentLang.value].noticeTitle
})
const noticeBody = computed(() => {
  if (isLoading.value) return 'We use IP-based geolocation to serve the most relevant language for you.'
  return STRINGS[currentLang.value].noticeBody
})
const toggleLabel = computed(() => {
  return STRINGS[currentLang.value].toggleLabel
})

// Toggle Language
const toggleLanguage = () => {
  currentLang.value = currentLang.value === 'en' ? 'id' : 'en'
  try {
    const cached = sessionStorage.getItem('geolang_v2')
    if (cached) {
      const d = JSON.parse(cached)
      d.lang = currentLang.value
      sessionStorage.setItem('geolang_v2', JSON.stringify(d))
    }
  } catch (_) {}
}

const fetchFromIpApi = async () => {
  const url = window.location.protocol === 'https:'
    ? null
    : 'http://ip-api.com/json/?fields=status,country,countryCode,city,regionName,query'
  if (!url) throw new Error('HTTPS context, skip ip-api.com')
  const res = await fetch(url, { signal: AbortSignal.timeout(5000) })
  if (!res.ok) throw new Error('ip-api HTTP ' + res.status)
  const data = await res.json()
  if (data.status !== 'success') throw new Error('ip-api fail')
  return {
    country:     data.country     || 'Unknown',
    countryCode: data.countryCode || '',
    city:        data.city        || '',
    region:      data.regionName  || '',
    ip:          data.query       || '',
  }
}

const fetchFromIpapiCo = async () => {
  const res = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(5000) })
  if (!res.ok) throw new Error('ipapi.co HTTP ' + res.status)
  const data = await res.json()
  if (data.error) throw new Error('ipapi.co: ' + data.reason)
  return {
    country:     data.country_name || 'Unknown',
    countryCode: data.country_code || '',
    city:        data.city         || '',
    region:      data.region       || '',
    ip:          data.ip           || '',
  }
}

onMounted(async () => {
  if (!import.meta.client) return

  // Check cache first
  try {
    const cached = sessionStorage.getItem('geolang_v2')
    if (cached) {
      const d = JSON.parse(cached)
      if (Date.now() - d.ts < 24 * 60 * 60 * 1000) {
        country.value = d.country
        city.value = d.city
        region.value = d.region
        ipAddress.value = d.ip
        currentLang.value = d.lang
        isLoading.value = false
        return
      }
    }
  } catch (_) {}

  let raw = null
  try {
    raw = await fetchFromIpApi()
  } catch (e1) {
    console.warn('[geo] ip-api.com failed, trying fallback:', e1.message)
    try {
      raw = await fetchFromIpapiCo()
    } catch (e2) {
      console.warn('[geo] ipapi.co also failed:', e2.message)
    }
  }

  if (raw) {
    const geoData = {
      ts:          Date.now(),
      country:     raw.country,
      countryCode: raw.countryCode,
      city:        raw.city,
      region:      raw.region,
      ip:          raw.ip,
      lang:        (raw.countryCode?.toUpperCase() === 'ID' || raw.country?.toLowerCase() === 'indonesia') ? 'id' : 'en'
    }
    try {
      sessionStorage.setItem('geolang_v2', JSON.stringify(geoData))
    } catch (_) {}
    
    country.value = geoData.country
    city.value = geoData.city
    region.value = geoData.region
    ipAddress.value = geoData.ip
    currentLang.value = geoData.lang
  } else {
    hasError.value = true
    country.value = '—'
    city.value = '—'
    region.value = '—'
    ipAddress.value = '—'
    currentLang.value = 'en'
  }
  
  isLoading.value = false
})
</script>

<style scoped>
.geo-page-body {
  font-family: var(--font-sans);
  background: var(--bg);
  color: var(--text);
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  overflow-x: hidden;
  position: relative;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* ── Animated background ── */
.bg-orbs {
  position: fixed; inset: 0; z-index: 0; overflow: hidden; pointer-events: none;
}
.orb {
  position: absolute; border-radius: 50%; filter: blur(90px); opacity: 0.12;
  animation: float 14s ease-in-out infinite;
}
.orb-1 { width: 600px; height: 600px; background: var(--accent-primary); top: -200px; left: -200px; animation-duration: 16s; }
.orb-2 { width: 450px; height: 450px; background: var(--accent-secondary); bottom: -150px; right: -100px; animation-duration: 12s; animation-delay: -5s; }
.orb-3 { width: 350px; height: 350px; background: var(--accent-deep); top: 40%; left: 50%; transform: translate(-50%, -50%); animation-duration: 18s; animation-delay: -3s; }

@keyframes float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33%       { transform: translate(30px, -20px) scale(1.05); }
  66%       { transform: translate(-20px, 15px) scale(0.95); }
}

/* ── Grid lines bg ── */
.bg-grid {
  position: fixed; inset: 0; z-index: 0; opacity: 0.03;
  background-image:
    linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px);
  background-size: 60px 60px;
}

/* ── Main container ── */
.geo-container {
  position: relative; z-index: 1;
  width: 100%; max-width: 760px;
  padding: 120px 24px 60px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.back-link {
  display: inline-flex; align-items: center; gap: 8px;
  color: var(--text-subtle); font-family: var(--font-mono); font-size: 0.8rem;
  letter-spacing: 0.05em; text-transform: uppercase; text-decoration: none;
  margin-bottom: 24px; transition: color 0.3s ease, transform 0.3s ease;
  width: fit-content;
}
.back-link:hover { color: var(--accent-primary); transform: translateX(-4px); }
.back-arrow { font-size: 1rem; transition: transform 0.3s ease; }
.back-link:hover .back-arrow { transform: translateX(-2px); }

/* ── Detector Card ── */
.detector-card {
  background: var(--surface);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-xl);
  padding: 48px;
  backdrop-filter: blur(20px);
  position: relative;
  overflow: hidden;
  transition: border-color 0.6s, box-shadow 0.6s;
  box-shadow: 0 20px 50px rgba(0,0,0,0.4);
}
.detector-card::before {
  content: '';
  position: absolute; inset: 0;
  border-radius: var(--radius-xl);
  background: linear-gradient(135deg, rgba(212,165,116,0.06) 0%, transparent 60%);
  pointer-events: none;
}

.detector-card.lang-id { border-color: rgba(255,154,90,0.35); }
.detector-card.lang-id::before { background: linear-gradient(135deg, rgba(255,154,90,0.08) 0%, transparent 60%); }
.detector-card.lang-en { border-color: rgba(212,165,116,0.35); }

/* ── Header ── */
.card-eyebrow {
  font-family: var(--font-mono);
  font-size: 0.72rem; font-weight: 500;
  color: var(--accent-primary); letter-spacing: 0.12em; text-transform: uppercase;
  margin-bottom: 24px;
  display: flex; align-items: center; gap: 10px;
}
.card-eyebrow::before {
  content: ''; display: block;
  width: 24px; height: 1px;
  background: var(--accent-primary);
}

/* ── Radar pulse animation ── */
.radar-wrap {
  display: flex; justify-content: center; margin-bottom: 36px;
}
.radar {
  position: relative; width: 120px; height: 120px;
  display: flex; align-items: center; justify-content: center;
}
.radar-ring {
  position: absolute; border-radius: 50%;
  border: 1px solid currentColor;
  animation: radar-pulse 2.2s cubic-bezier(0, 0.2, 0.8, 1) infinite;
  opacity: 0;
}
.radar-ring:nth-child(1) { width: 100%; height: 100%; animation-delay: 0s; }
.radar-ring:nth-child(2) { width: 70%;  height: 70%;  animation-delay: 0.55s; }
.radar-ring:nth-child(3) { width: 40%;  height: 40%;  animation-delay: 1.1s; }

@keyframes radar-pulse {
  0%   { transform: scale(0.4); opacity: 0.8; }
  100% { transform: scale(1.35); opacity: 0; }
}

.radar.detecting .radar-ring { color: var(--accent-primary); }
.radar.lang-id    .radar-ring { color: var(--accent-secondary); }
.radar.lang-en    .radar-ring { color: var(--accent-primary); }

.radar-core {
  width: 52px; height: 52px; border-radius: 50%; z-index: 1;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.6rem;
  background: var(--bg-alt);
  border: 1px solid var(--border-light);
  box-shadow: 0 4px 20px rgba(0,0,0,0.5);
  transition: border-color 0.5s, background 0.5s;
}

/* ── Status text ── */
.status-line {
  text-align: center; margin-bottom: 36px;
}
.status-line h1 {
  font-family: var(--font-serif);
  font-size: clamp(1.8rem, 4.5vw, 2.6rem);
  font-weight: 400; line-height: 1.2;
  margin-bottom: 12px;
}
.status-line h1 .highlight {
  background: var(--grad-primary);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  background-clip: text;
}
.status-line h1 .highlight-id {
  background: var(--grad-warm);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  background-clip: text;
}
.status-desc {
  font-size: 1.05rem; color: var(--text-muted); line-height: 1.7;
}

/* ── Info Grid ── */
.info-grid {
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 16px; margin-bottom: 32px;
}
@media (max-width: 540px) { .info-grid { grid-template-columns: 1fr; } }

.info-tile {
  background: rgba(255,255,255,0.02);
  border: 1px solid var(--border);
  border-radius: var(--radius-md); padding: 20px;
  display: flex; flex-direction: column; gap: 6px;
  transition: border-color 0.3s, background 0.3s, transform 0.3s;
}
.info-tile:hover {
  background: rgba(255,255,255,0.04);
  border-color: var(--border-light);
  transform: translateY(-2px);
}
.tile-label {
  font-family: var(--font-mono); font-size: 0.68rem;
  color: var(--text-subtle); text-transform: uppercase; letter-spacing: 0.1em;
}
.tile-value {
  font-size: 1.05rem; font-weight: 600; color: var(--text);
}
.tile-value.skeleton {
  width: 70%; height: 1.2em; border-radius: 4px;
  background: linear-gradient(90deg, rgba(255,255,255,0.06) 25%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.06) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* ── Language badge ── */
.lang-badge {
  display: inline-flex; align-items: center; gap: 10px;
  padding: 10px 22px; border-radius: 100px;
  font-size: 0.85rem; font-weight: 600;
  border: 1px solid;
  margin-bottom: 32px;
  transition: all 0.4s;
  opacity: 0;
}
.lang-badge.visible { opacity: 1; }
.lang-badge.lang-id {
  background: rgba(255,154,90,0.1);
  border-color: rgba(255,154,90,0.35);
  color: var(--accent-secondary);
}
.lang-badge.lang-en {
  background: rgba(212,165,116,0.1);
  border-color: rgba(212,165,116,0.35);
  color: var(--accent-primary);
}
.lang-dot { width: 7px; height: 7px; border-radius: 50%; animation: blink 1.5s infinite; }
.lang-badge.lang-id .lang-dot { background: var(--accent-secondary); }
.lang-badge.lang-en .lang-dot { background: var(--accent-primary); }
@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }

/* ── Notice box ── */
.notice-box {
  background: rgba(255,255,255,0.02);
  border: 1px solid var(--border);
  border-radius: var(--radius-md); padding: 20px 24px;
  font-size: 0.95rem; color: var(--text-muted); line-height: 1.7;
  margin-bottom: 32px;
  text-align: left;
}
.notice-box strong { color: var(--accent-primary); font-family: var(--font-serif); font-weight: 600; }

/* ── Toggle button & IP Pill ── */
.btn-toggle {
  display: inline-flex; align-items: center; gap: 10px;
  padding: 12px 24px; border-radius: var(--radius-md);
  font-family: var(--font-mono); font-size: 0.825rem; font-weight: 600;
  letter-spacing: 0.04em;
  cursor: pointer; border: 1px solid var(--border-light);
  background: rgba(255,255,255,0.04); color: var(--text);
  transition: all 0.25s ease; text-decoration: none;
}
.btn-toggle:hover {
  background: var(--grad-primary);
  color: var(--bg);
  border-color: transparent;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(212,165,116,0.3);
}
.btn-toggle .btn-icon { font-size: 1rem; transition: transform 0.3s; }
.btn-toggle:hover .btn-icon { transform: rotate(180deg); }

.footer-row {
  display: flex; align-items: center; justify-content: space-between;
  flex-wrap: wrap; gap: 16px;
  width: 100%;
}

.ip-pill {
  font-family: var(--font-mono); font-size: 0.75rem;
  color: var(--text-subtle); background: var(--bg-alt);
  border: 1px solid var(--border); border-radius: 100px;
  padding: 6px 14px; display: inline-flex; align-items: center; gap: 8px;
}
.ip-dot { width: 6px; height: 6px; border-radius: 50%; background: #34d399; animation: blink 2s infinite; }

/* ── Error state ── */
.error-notice {
  display: none; padding: 16px 20px; border-radius: var(--radius-md);
  background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.25);
  color: #fca5a5; font-size: 0.88rem; text-align: center; margin-bottom: 20px;
}
.error-notice.visible { display: block; }

/* ── Fade-in animation ── */
.fade-up { opacity: 0; transform: translateY(20px); transition: opacity 0.5s ease, transform 0.5s ease; }
.fade-up.in { opacity: 1; transform: none; }

@media (max-width: 600px) {
  .detector-card { padding: 32px 20px; }
  .geo-container { padding-top: 100px; }
  .footer-row { flex-direction: column; align-items: stretch; text-align: center; }
  .ip-pill { justify-content: center; }
  .btn-toggle { justify-content: center; }
}
</style>

