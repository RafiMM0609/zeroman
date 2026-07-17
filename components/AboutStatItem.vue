<template>
  <div class="about-stat-item" ref="itemRef">
    <div style="display: flex; align-items: baseline; justify-content: center;">
      <span class="about-stat-number" :class="{ 'is-counted': isCounted }">{{ currentValue }}</span>
      <span class="about-stat-unit">{{ unit }}</span>
    </div>
    <span class="about-stat-label">{{ label }}</span>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  target: { type: Number, required: true },
  unit: { type: String, default: '' },
  label: { type: String, default: '' }
})

const currentValue = ref(0)
const isCounted = ref(false)
const itemRef = ref(null)
let observer = null

onMounted(() => {
  if (!import.meta.client) return
  
  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !isCounted.value) {
          isCounted.value = true
          animateCount()
          if (observer) observer.disconnect()
        }
      })
    }, { threshold: 0.2 })
    
    if (itemRef.value) {
      observer.observe(itemRef.value)
    }
  } else {
    // Fallback if no observer support
    currentValue.value = props.target
    isCounted.value = true
  }
})

onBeforeUnmount(() => {
  if (observer) observer.disconnect()
})

const animateCount = () => {
  const duration = 1200
  const start = performance.now()
  const targetVal = props.target

  const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4)

  const step = (now) => {
    const elapsed = now - start
    const progress = Math.min(elapsed / duration, 1)
    const eased = easeOutQuart(progress)
    currentValue.value = Math.round(eased * targetVal)
    if (progress < 1) {
      requestAnimationFrame(step)
    } else {
      currentValue.value = targetVal
    }
  }
  requestAnimationFrame(step)
}
</script>
