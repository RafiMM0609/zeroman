import { onMounted, onBeforeUnmount, nextTick } from 'vue'

type RevealPreset = 'rise' | 'drift' | 'settle' | 'focus'

interface RevealOptions {
  /**
   * Root margin controlling how early a section starts revealing.
   * A negative bottom margin means the element must travel further up the
   * viewport before it plays, which reads as more deliberate.
   */
  rootMargin?: string
  /** Global multiplier so pacing can be tuned without editing CSS. */
  stagger?: number
}

const SELECTOR = [
  '[data-reveal]',
  '.reveal-group',
  '.fade-up',
  '.fade-left',
  '.fade-right',
  '.stat-card',
  '.service-card',
  '.project-item',
  '.testimonial-card',
  '.timeline-item',
  '.skill-bar-item',
  '.cta-banner',
].join(',')

/**
 * Scroll-storytelling reveal.
 *
 * Replaces the previous "everything fades up 28px on an index-based delay"
 * behaviour with a section-aware system:
 *
 *  - Each section reveals as a unit; children stagger in reading order
 *    instead of by their position in one giant NodeList.
 *  - Animation direction is authored per element via data-reveal, so a
 *    heading can drift while the card beneath it settles.
 *  - Anything already above the fold on load reveals immediately, which
 *    removes the blank-section flash the old version produced.
 *  - Without IntersectionObserver, everything is shown at once.
 */
export const useScrollReveal = (options: RevealOptions = {}) => {
  const { rootMargin = '0px 0px -10% 0px', stagger = 1 } = options

  let observer: IntersectionObserver | null = null
  let onLoad: (() => void) | null = null
  let started = false

  const showNow = (el: HTMLElement) => {
    el.classList.add('is-visible', 'reveal-done')
  }

  const start = () => {
    if (started) return
    const found = Array.from(document.querySelectorAll<HTMLElement>(SELECTOR))
    const elements = Array.from(new Set(found))
    if (!elements.length) return
    started = true

    if (!('IntersectionObserver' in window)) {
      elements.forEach(showNow)
      return
    }

    observer = new IntersectionObserver(
      (entries) => {
        // Group per section so the stagger restarts in each section rather
        // than accumulating across the whole document.
        const bySection = new Map<Element, HTMLElement[]>()

        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const el = entry.target as HTMLElement
          const section = el.closest('section, footer, [data-reveal-root]') ?? document.body
          const bucket = bySection.get(section)
          if (bucket) bucket.push(el)
          else bySection.set(section, [el])
          observer?.unobserve(el)
        })

        bySection.forEach((group) => {
          group.forEach((el, index) => {
            const step = Number(el.dataset.revealStep ?? index)
            const delay = Math.round(step * 70 * stagger)
            el.style.setProperty('--reveal-delay', `${delay}ms`)
            showNow(el)
          })
        })
      },
      { threshold: 0.08, rootMargin }
    )

    elements.forEach((el) => {
      const rect = el.getBoundingClientRect()
      // Already on screen at first paint → show immediately, never flash.
      if (rect.top < window.innerHeight * 0.75 && rect.bottom > 0) {
        showNow(el)
        return
      }
      observer!.observe(el)
    })
  }

  onMounted(() => {
    nextTick(() => {
      if (!import.meta.client) return
      // Defer past first paint so viewport measurements are accurate.
      requestAnimationFrame(() => {
        start()
        onLoad = () => start()
        window.addEventListener('load', onLoad, { once: true })
      })
    })
  })

  onBeforeUnmount(() => {
    observer?.disconnect()
    observer = null
    if (onLoad) window.removeEventListener('load', onLoad)
  })
}

/**
 * Explicit preset helper for templates that prefer to opt in per element:
 *   <div :data-reveal="revealPreset('settle')">
 */
export const revealPreset = (preset: RevealPreset): RevealPreset => preset
