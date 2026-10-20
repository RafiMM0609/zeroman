import { onMounted, nextTick } from 'vue'

export const useScrollReveal = () => {
  const reveal = () => {
    if (!import.meta.client || !('IntersectionObserver' in window)) {
      // Fallback: make everything visible immediately if observer is not supported
      const elements = document.querySelectorAll(
        '.fade-up, .fade-left, .fade-right, .stat-card, .service-card, .project-item, .testimonial-card, .timeline-item, .skill-bar-item, .cta-banner'
      )
      elements.forEach(el => el.classList.add('is-visible'))
      return
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const htmlEl = entry.target as HTMLElement
          // Ensure it reveals immediately when scrolled into view
          htmlEl.classList.add('is-visible')
          observer.unobserve(htmlEl)
        }
      })
    }, {
      threshold: 0.02,
      rootMargin: '0px 0px -100px 0px' // Trigger 80px before entering viewport for a smoother feel
    })

    const selectors = [
      '.fade-up',
      '.fade-left',
      '.fade-right',
      '.stat-card',
      '.service-card',
      '.project-item',
      '.testimonial-card',
      '.timeline-item',
      '.skill-bar-item',
      '.cta-banner'
    ]

    selectors.forEach(sel => {
      document.querySelectorAll(sel).forEach((el, i) => {
        const htmlEl = el as HTMLElement
        // Write transition delay dynamically without layout reading (no forced reflow)
        if (!htmlEl.dataset.delaySet) {
          // Stagger animation for natural loading appearance
          htmlEl.style.transitionDelay = `${(i % 6) * 50}ms`
          htmlEl.dataset.delaySet = '1'
        }
        observer.observe(htmlEl)
      })
    })
  }

  onMounted(() => {
    // Wait for Nuxt to fully render the DOM
    nextTick(() => {
      // Small timeout to ensure any dynamic rendering is completed
      setTimeout(reveal, 100)
    })
  })
}
