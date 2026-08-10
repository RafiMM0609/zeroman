<template>
  <div>
    <section class="section" style="padding-top: 80px;">
      <div class="container">
        
        <!-- FORM STATE -->
        <div class="contact-wrapper">
          <!-- LEFT: Info -->
          <div class="fade-left">
            <div class="section-eyebrow" style="margin-bottom: 24px;">// start here</div>

            <h1 class="contact-info-title">
              <template v-if="lang === 'id'">
                Punya proyek<br>
                <span style="color: var(--fg-dim); font-weight: 200;">yang perlu</span><br>
                <span class="accent-gradient">diselesaikan?</span>
              </template>
              <template v-else>
                Got a project<br>
                <span style="color: var(--fg-dim); font-weight: 200;">that needs</span><br>
                <span class="accent-gradient">to get done?</span>
              </template>
            </h1>

            <p class="contact-info-desc">
              {{ lang === 'id' 
                ? 'Saya terbuka untuk proyek freelance, konsultasi teknis, atau peran full-time. Beritahu saya apa yang Anda butuhkan — saya akan membalas dalam 24 jam.'
                : 'I\'m open to freelance projects, technical consulting, or full-time roles. Tell me what you need — I\'ll get back to you within 24 hours.' 
              }}
            </p>

            <!-- Contact Links -->
            <div class="contact-links">
              <a :href="'mailto:' + (portfolio.profile.email || 'hello@zeroman.dev')" class="contact-link-item" id="contact-email-link">
                <span class="contact-link-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mail"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                </span>
                <div>
                  <div class="contact-link-title">Email</div>
                  <div class="contact-link-sub">{{ portfolio.profile.email }}</div>
                </div>
              </a>
              <a v-if="portfolio.profile.github" :href="portfolio.profile.github" class="contact-link-item" id="contact-github-link" target="_blank" rel="noopener">
                <span class="contact-link-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-github"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
                </span>
                <div>
                  <div class="contact-link-title">GitHub</div>
                  <div class="contact-link-sub">{{ formatUrlDisplay(portfolio.profile.github) }}</div>
                </div>
              </a>
              <a v-if="portfolio.profile.linkedin" :href="portfolio.profile.linkedin" class="contact-link-item" id="contact-linkedin-link" target="_blank" rel="noopener">
                <span class="contact-link-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-linkedin"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                </span>
                <div>
                  <div class="contact-link-title">LinkedIn</div>
                  <div class="contact-link-sub">{{ formatUrlDisplay(portfolio.profile.linkedin) }}</div>
                </div>
              </a>
            </div>

            <!-- Slogan / Mission Indicator -->
            <div style="
              margin-top: 40px;
              padding-top: 32px;
              border-top: 1px solid var(--border);
            ">
              <h3 style="
                font-size: 1.25rem;
                font-weight: 500;
                line-height: 1.4;
                color: var(--fg);
                margin: 0 0 8px 0;
              ">
                {{ lang === 'id' ? portfolio.slogan.title_id : portfolio.slogan.title }}
              </h3>
              <p style="
                font-size: 0.9rem;
                color: var(--fg-muted);
                line-height: 1.5;
                margin: 0;
              ">
                {{ lang === 'id' ? portfolio.slogan.desc_id : portfolio.slogan.desc }}
              </p>
            </div>
          </div>

          <!-- RIGHT: Form -->
          <div class="fade-right">
            <form @submit.prevent="handleSubmit" class="contact-form" id="contact-form">
              <div class="form-group">
                <label for="name">{{ lang === 'id' ? 'Nama / Perusahaan' : 'Name / Company' }}</label>
                <input 
                  type="text" 
                  id="name" 
                  v-model="name" 
                  placeholder="John Doe / Acme Corp" 
                  required 
                  autocomplete="name"
                >
              </div>

              <div class="form-group">
                <label for="email">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  v-model="email" 
                  placeholder="john@company.com" 
                  autocomplete="email"
                >
              </div>


              <div class="form-group">
                <label for="message">{{ lang === 'id' ? 'Ceritakan Tentang Proyek Anda' : 'Tell Me About Your Project' }}</label>
                <textarea 
                  id="message" 
                  v-model="message" 
                  rows="5" 
                  :placeholder="lang === 'id' 
                    ? 'Apa yang ingin Anda bangun? Masalah apa yang perlu diselesaikan? Lebih detail = estimasi lebih baik.'
                    : 'What are you trying to build? What problem needs solving? More detail = better estimate.'
                  " 
                  required
                ></textarea>
              </div>

              <button type="submit" class="btn-submit" id="form-submit" :disabled="isSubmitting">
                <span>{{ isSubmitting ? (lang === 'id' ? 'Mengirim...' : 'Sending...') : (lang === 'id' ? 'Kirim Pesan →' : 'Send Message →') }}</span>
              </button>
            </form>
          </div>
        </div>

      </div>
    </section>

    <!-- Success Popup Modal Overlay -->
    <Transition name="modal-fade">
      <div v-if="showSuccessPopup" class="success-modal-overlay">
        <div class="success-modal-card">
          <div class="success-modal-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          
          <h2 class="success-modal-title">
            {{ lang === 'id' ? 'Pesan Terkirim!' : 'Message Sent!' }}
          </h2>
          
          <p class="success-modal-message">
            {{ lang === 'id' 
              ? `Terima kasih, ${name}! Pesan Anda telah berhasil kami terima. Saya akan merespons dalam waktu 24 jam.`
              : `Thank you, ${name}! Your message has been successfully received. I will respond within 24 hours.`
            }}
          </p>
          
          <div class="success-modal-countdown">
            {{ lang === 'id' 
              ? `Mengalihkan ke Beranda dalam ${countdown} detik...`
              : `Redirecting to Home in ${countdown} seconds...`
            }}
          </div>
          
          <button @click="goToHome" class="success-modal-btn">
            <span>{{ lang === 'id' ? 'Kembali ke Home Sekarang' : 'Back to Home Now' }}</span>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeUnmount } from 'vue'
import { useLanguage } from '~/composables/useLanguage'
import { useScrollReveal } from '~/composables/useScrollReveal'
import portfolioData from '~/public/data/portfolio.json'

const { lang } = useLanguage()

// Dynamic SEO Head tags
const title = computed(() => {
  return lang.value === 'id'
    ? 'Hubungi Mahrus — Mari Bangun Bersama | zeroman'
    : 'Contact Mahrus — Let\'s Build Together | zeroman'
})

const description = computed(() => {
  return lang.value === 'id'
    ? 'Hubungi Mahrus untuk proyek freelance, konsultasi teknis, atau peluang kerja sama full-time. Respon dalam waktu 24 jam.'
    : 'Get in touch with Mahrus for freelance projects, technical consulting, or full-time roles. I respond within 24 hours.'
})

const route = useRoute()

const canonicalUrl = computed(() => {
  const langQuery = route.query?.lang
  if (langQuery === 'en' || langQuery === 'id') {
    return `https://zeroman.my.id/contact?lang=${langQuery}`
  }
  return 'https://zeroman.my.id/contact'
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
    { rel: 'alternate', hreflang: 'en', href: 'https://zeroman.my.id/contact?lang=en' },
    { rel: 'alternate', hreflang: 'id', href: 'https://zeroman.my.id/contact?lang=id' },
    { rel: 'alternate', hreflang: 'x-default', href: 'https://zeroman.my.id/contact' }
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'ContactPage',
        'name': 'Contact Mahrus',
        'description': 'Get in touch with Mahrus for software engineering projects, consulting, or job offers.',
        'url': 'https://zeroman.my.id/contact'
      })
    }
  ]
})

// Setup scroll reveal animation hook
useScrollReveal()

const portfolio = portfolioData

const formatUrlDisplay = (url) => {
  if (!url) return ''
  return url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')
}

const name = ref('')
const email = ref('')
const message = ref('')
const isSubmitting = ref(false)
const showSuccessPopup = ref(false)
const countdown = ref(5)
let countdownTimer = null

const goToHome = () => {
  if (countdownTimer) clearInterval(countdownTimer)
  navigateTo('/')
}

onBeforeUnmount(() => {
  if (countdownTimer) clearInterval(countdownTimer)
})

const handleSubmit = async () => {
  isSubmitting.value = true
  try {
    await $fetch('/api/send-message', {
      method: 'POST',
      body: {
        name: name.value,
        email: email.value,
        message: message.value
      }
    })
    
    // Show success popup
    showSuccessPopup.value = true
    
    // Start countdown timer
    countdown.value = 5
    countdownTimer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        goToHome()
      }
    }, 1000)
    
  } catch (e) {
    console.error('Submit error:', e)
    alert(lang.value === 'id' 
      ? 'Gagal mengirim pesan. Silakan hubungi langsung via email.' 
      : 'Failed to send message. Please contact directly via email.'
    )
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
/* Success Modal Styles */
.success-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(13, 10, 7, 0.85);
  backdrop-filter: blur(12px);
  padding: 24px;
}

.success-modal-card {
  background: rgba(26, 19, 14, 0.95);
  border: 1px solid rgba(212, 165, 116, 0.3);
  border-radius: 20px;
  padding: 40px 32px;
  max-width: 440px;
  width: 100%;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6), 
              0 0 80px rgba(212, 165, 116, 0.15);
  transform: translateY(0);
  transition: all 0.3s ease;
}

.success-modal-icon {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: rgba(0, 255, 157, 0.08);
  border: 2px solid var(--bio-aurora, #00ff9d);
  color: var(--bio-aurora, #00ff9d);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  box-shadow: 0 0 25px rgba(0, 255, 157, 0.2);
  animation: pulse-glow 2s infinite alternate;
}

.success-modal-icon svg {
  width: 32px;
  height: 32px;
}

.success-modal-title {
  font-family: var(--font-serif);
  font-size: 1.8rem;
  font-weight: 600;
  color: var(--text, #fff);
  margin-bottom: 12px;
  letter-spacing: -0.01em;
}

.success-modal-message {
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--text-muted, #a09890);
  margin-bottom: 24px;
}

.success-modal-countdown {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: var(--text-subtle, rgba(255, 255, 255, 0.45));
  margin-bottom: 32px;
  letter-spacing: 0.05em;
}

.success-modal-btn {
  width: 100%;
  padding: 14px 28px;
  border-radius: var(--radius-md, 8px);
  border: none;
  background: var(--grad-primary);
  color: var(--bg);
  font-family: var(--font-mono);
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  display: inline-block;
}

.success-modal-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(212, 165, 116, 0.35);
}

.success-modal-btn::after {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--grad-warm);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 1;
}

.success-modal-btn:hover::after {
  opacity: 1;
}

.success-modal-btn span {
  position: relative;
  z-index: 2;
}

/* Modal Animations */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.35s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .success-modal-card {
  animation: scale-up 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-fade-leave-active .success-modal-card {
  animation: scale-down 0.3s ease-in;
}

@keyframes scale-up {
  from {
    transform: scale(0.9) translateY(20px);
    opacity: 0;
  }
  to {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}

@keyframes scale-down {
  from {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
  to {
    transform: scale(0.95) translateY(10px);
    opacity: 0;
  }
}

@keyframes pulse-glow {
  0% {
    box-shadow: 0 0 15px rgba(0, 255, 157, 0.15);
    border-color: rgba(0, 255, 157, 0.8);
  }
  100% {
    box-shadow: 0 0 30px rgba(0, 255, 157, 0.45);
    border-color: rgba(0, 255, 157, 1);
  }
}
</style>
