<template>
  <div>
    <canvas id="bio-canvas" aria-hidden="true"></canvas>
    
    <a href="#main-content" class="skip-link">Skip to main content</a>
    
    <Navbar />
    
    <div class="page-wrapper">
      <main id="main-content">
        <slot />
      </main>
      <Footer />
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useLanguage } from '~/composables/useLanguage'
import { useCosmicHarmony } from '~/composables/useCosmicHarmony'

const { initLanguage, lang } = useLanguage()
const { initCanvas } = useCosmicHarmony()

useHead({
  htmlAttrs: {
    lang: computed(() => lang.value === 'id' ? 'id' : 'en')
  }
})

onMounted(async () => {
  // Initialize language preference / geolocation detection
  await initLanguage()
  
  // Delay canvas initialization to keep the main thread free during initial page load
  if (typeof window !== 'undefined') {
    const startCanvas = () => {
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(() => initCanvas('bio-canvas'), { timeout: 2000 })
      } else {
        setTimeout(() => initCanvas('bio-canvas'), 1000)
      }
    }

    if (document.readyState === 'complete') {
      startCanvas()
    } else {
      window.addEventListener('load', startCanvas, { once: true })
    }
  }
})
</script>
