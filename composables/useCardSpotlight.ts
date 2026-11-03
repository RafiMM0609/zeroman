import { onMounted, onBeforeUnmount } from 'vue'

/**
 * Cursor spotlight for cards.
 *
 * Writes --mx/--my (cursor position relative to the card) so CSS can paint a
 * radial highlight that tracks the pointer. Delegated from the document, so
 * there are no per-card listeners and no template changes beyond
 * `data-spotlight`.
 *
 * Important: the card is resolved with document.elementFromPoint() from the
 * pointer coordinates, evaluated synchronously inside the handler. Two reasons:
 * Chrome resets `target` on trusted UI events after dispatch completes, and
 * `event.target` can lag the true hit-test. Using the coordinates is reliable
 * in both cases.
 *
 * Work is throttled to one style write per frame. The whole thing is skipped on
 * touch devices and under prefers-reduced-motion, where the static card
 * treatment is the intended fallback.
 */
export const useCardSpotlight = () => {
  let frame = 0
  let pendingCard: HTMLElement | null = null
  let pendingX = 0
  let pendingY = 0

  const flush = () => {
    frame = 0
    const card = pendingCard
    if (!card) return
    card.style.setProperty('--mx', `${pendingX}px`)
    card.style.setProperty('--my', `${pendingY}px`)
    pendingCard = null
  }

  const onPointerMove = (event: PointerEvent) => {
    // Resolve everything synchronously; nothing here is read after dispatch.
    const hit = document.elementFromPoint(event.clientX, event.clientY)
    const card = hit?.closest?.('[data-spotlight]') as HTMLElement | null
    if (!card) {
      pendingCard = null
      return
    }

    const rect = card.getBoundingClientRect()
    pendingCard = card
    pendingX = Math.round(event.clientX - rect.left)
    pendingY = Math.round(event.clientY - rect.top)

    if (frame) return
    frame = requestAnimationFrame(flush)
  }

  onMounted(() => {
    if (!import.meta.client) return
    if (window.matchMedia('(hover: none)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    document.addEventListener('pointermove', onPointerMove, { passive: true })
  })

  onBeforeUnmount(() => {
    document.removeEventListener('pointermove', onPointerMove)
    if (frame) cancelAnimationFrame(frame)
    frame = 0
    pendingCard = null
  })
}
