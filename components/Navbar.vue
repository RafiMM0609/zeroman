<template>
  
  <nav id="main-nav" role="navigation" aria-label="Main navigation">
    <div class="nav-header">
      <NuxtLink to="/" class="nav-logo" id="nav-logo" @mouseenter="handleHover">
        <span class="logo-zero">{{ textZero }}</span><span class="logo-man">{{ textMan }}</span><span class="logo-cursor" aria-hidden="true"></span>
      </NuxtLink>
      
      <button 
        class="hamburger-btn" 
        :class="{ 'is-active': isMobileMenuOpen }"
        @click="toggleMobileMenu" 
        aria-label="Toggle navigation"
      >
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
      </button>
    </div>

    <div class="nav-menu" :class="{ 'is-open': isMobileMenuOpen }">
    <div class="nav-split-left">
      <NuxtLink to="/" class="nav-link" exact-active-class="active" id="nav-home" @click="closeMobileMenu">
        {{ lang === 'id' ? 'Beranda' : 'Home' }}
      </NuxtLink>
      <NuxtLink to="/about" class="nav-link" exact-active-class="active" id="nav-about" @click="closeMobileMenu">
        {{ lang === 'id' ? 'Tentang' : 'About' }}
      </NuxtLink>
    </div>
    
    <div class="nav-split-right">
      <NuxtLink :to="projectsLink" class="nav-link" id="nav-projects" @click="closeMobileMenu">
        {{ lang === 'id' ? 'Proyek' : 'Projects' }}
      </NuxtLink>
      <NuxtLink to="/contact" class="nav-cta" exact-active-class="active" id="nav-contact" @click="closeMobileMenu">
        <span v-html="lang === 'id' ? 'Rekrut Saya &rarr;' : 'Hire Me &rarr;'"></span>
      </NuxtLink>
      <div class="nav-lang-switcher" id="nav-lang-switcher" role="group" aria-label="Language selector">
        <button 
          class="lang-btn" 
          :class="{ active: lang === 'en' }" 
          id="lang-btn-en" 
          @click="setLang('en')" 
          title="English"
        >En</button>
        <button 
          class="lang-btn" 
          :class="{ active: lang === 'id' }" 
          id="lang-btn-id" 
          @click="setLang('id')" 
          title="Bahasa Indonesia"
        >In</button>
      </div>
      <NuxtLink to="/geo" class="nav-link-geo" exact-active-class="active" id="nav-geo" @click="closeMobileMenu">
        <span class="geo-dot"></span>
        <span>Geo</span>
      </NuxtLink>
    </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useLanguage } from '~/composables/useLanguage'

const { lang, setLang } = useLanguage()
const route = useRoute()

const isMobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
  if (isMobileMenuOpen.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
  document.body.style.overflow = ''
}

const projectsLink = computed(() => {
  return route.path === '/' ? '#projects' : '/#projects'
})

// Typewriter Logo Animation
const textZero = ref('zero')
const textMan = ref('man')
const isAnimating = ref(false)
let isMounted = false

const fullZero = 'zero'
const fullMan = 'man'

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const runTypewriter = async () => {
  if (isAnimating.value) return
  isAnimating.value = true

  // Clear texts
  textZero.value = ''
  textMan.value = ''
  
  // Wait a short duration before typing starts
  await sleep(400)
  if (!isMounted) return

  // Type "zero"
  for (let i = 1; i <= fullZero.length; i++) {
    if (!isMounted) return
    textZero.value = fullZero.slice(0, i)
    await sleep(90 + Math.random() * 50)
  }

  // Brief pause between words
  await sleep(150)
  if (!isMounted) return

  // Type "man"
  for (let i = 1; i <= fullMan.length; i++) {
    if (!isMounted) return
    textMan.value = fullMan.slice(0, i)
    await sleep(90 + Math.random() * 50)
  }

  isAnimating.value = false
}

const handleHover = async () => {
  if (isAnimating.value) return
  isAnimating.value = true

  // Backspace "man"
  for (let i = fullMan.length; i >= 0; i--) {
    if (!isMounted) return
    textMan.value = fullMan.slice(0, i)
    await sleep(50)
  }

  // Backspace "zero"
  for (let i = fullZero.length; i >= 0; i--) {
    if (!isMounted) return
    textZero.value = fullZero.slice(0, i)
    await sleep(50)
  }

  // Wait a moment
  await sleep(300)
  if (!isMounted) return

  // Retype "zero"
  for (let i = 1; i <= fullZero.length; i++) {
    if (!isMounted) return
    textZero.value = fullZero.slice(0, i)
    await sleep(80 + Math.random() * 40)
  }

  // Brief pause
  await sleep(150)
  if (!isMounted) return

  // Retype "man"
  for (let i = 1; i <= fullMan.length; i++) {
    if (!isMounted) return
    textMan.value = fullMan.slice(0, i)
    await sleep(80 + Math.random() * 40)
  }

  isAnimating.value = false
}

onMounted(() => {
  isMounted = true
  runTypewriter()
})

onUnmounted(() => {
  isMounted = false
  document.body.style.overflow = ''
})
</script>
