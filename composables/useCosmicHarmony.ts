import { onBeforeUnmount } from 'vue'

export const useCosmicHarmony = () => {
  let cleanup: (() => void) | null = null

  const initCanvas = (canvasId: string = 'bio-canvas') => {
    if (!import.meta.client) return

    const canvas = document.getElementById(canvasId) as HTMLCanvasElement | null
    if (!canvas) return

    // Respect motion preferences
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      canvas.style.display = 'none'
      return
    }

    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) return

    let W = 0
    let H = 0
    let stars: Star[] = []
    let shootingStars: ShootingStar[] = []
    let particles: Particle[] = []
    let zParticles: ZParticle[] = []
    let gravitySparks: GravitySpark[] = []
    let mouseX = -1000
    let mouseY = -1000
    let lastSpawnX = 0
    let lastSpawnY = 0
    let lastTime = 0
    let animationId: number | null = null
    let isPaused = false
    let frameCount = 0

    let mousemoveRafPending = false
    let pendingMouseX = -1000
    let pendingMouseY = -1000
    let bgGradient: CanvasGradient | null = null

    // Cache page checks
    const getIsSpecialPage = () => {
      if (typeof window === 'undefined') return false
      return window.location.pathname.includes('/contact') || window.location.pathname.includes('/about')
    }
    let isSpecialPage = getIsSpecialPage()

    // Watch for route changes to update special page status
    const router = useRouter()
    const routeWatch = router ? router.afterEach(() => {
      isSpecialPage = getIsSpecialPage()
    }) : null

    // Mobile detection
    const isMobile = /Mobi|Android/i.test(navigator.userAgent) || window.innerWidth < 768

    // Colors pre-cached
    const PARTICLE_COLORS = [
      { r: 212, g: 165, b: 116, baseA: 0.35, str: '212,165,116' },
      { r: 255, g: 154, b: 90, baseA: 0.25, str: '255,154,90' },
      { r: 255, g: 179, b: 71, baseA: 0.20, str: '255,179,71' },
      { r: 184, g: 92, b: 54, baseA: 0.25, str: '184,92,54' }
    ]

    const STAR_COLORS = [
      { baseA: 0.80, str: '255,255,255' },
      { baseA: 0.60, str: '212,165,116' },
      { baseA: 0.50, str: '255,179,71' },
      { baseA: 0.40, str: '0,229,255' }
    ]

    const SPARK_COLORS = [
      'rgba(0,229,255,',
      'rgba(212,165,116,',
      'rgba(255,154,90,',
      'rgba(0,255,157,'
    ]

    const Z_COLORS = [
      { str: '0,229,255' },
      { str: '212,165,116' }
    ]

    function buildBgGradient() {
      if (!ctx) return null
      const grad = ctx.createRadialGradient(
        W * 0.5, H * 0.5, 0,
        W * 0.5, H * 0.5, Math.max(W, H) * 0.8
      )
      grad.addColorStop(0, '#0D0A07')
      grad.addColorStop(1, 'rgba(13,10,7,0.92)')
      return grad
    }

    function debounce(fn: Function, delay: number) {
      let timer: NodeJS.Timeout
      return function (this: any, ...args: any[]) {
        clearTimeout(timer)
        timer = setTimeout(() => fn.apply(this, args), delay)
      }
    }

    function resize() {
      if (!canvas || !ctx) return
      W = canvas.width = window.innerWidth
      H = canvas.height = window.innerHeight

      bgGradient = buildBgGradient()

      stars = []
      const maxStars = isMobile ? 50 : 120
      const areaFactor = isMobile ? 12000 : 7000
      const starCount = Math.min(maxStars, Math.floor((W * H) / areaFactor))
      for (let i = 0; i < starCount; i++) {
        stars.push(new Star())
      }
    }

    class Star {
      x: number
      y: number
      size: number
      twinkleSpeed: number
      twinklePhase: number
      colorStr: string
      baseAlpha: number
      large: boolean

      constructor() {
        this.x = Math.random() * W
        this.y = Math.random() * H
        this.size = Math.random() * 2
        this.twinkleSpeed = Math.random() * 0.015 + 0.005
        this.twinklePhase = Math.random() * Math.PI * 2
        const c = STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)]
        this.colorStr = c.str
        this.baseAlpha = c.baseA
        this.large = this.size > 1.6
      }

      update() {
        this.twinklePhase += this.twinkleSpeed
        return Math.sin(this.twinklePhase) * 0.4 + 0.6
      }

      draw(twinkle: number) {
        if (!ctx) return
        const alpha = this.baseAlpha * twinkle * (this.size / 2)
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        if (this.large && (frameCount % 3 === 0)) {
          ctx.shadowBlur = 5
          ctx.shadowColor = `rgba(${this.colorStr},${(alpha * 0.8).toFixed(2)})`
        } else {
          ctx.shadowBlur = 0
        }
        ctx.fillStyle = `rgba(${this.colorStr},${alpha.toFixed(2)})`
        ctx.fill()
      }
    }

    class ShootingStar {
      x: number = 0
      y: number = 0
      length: number = 0
      speed: number = 0
      angle: number = 0
      life: number = 0
      decay: number = 0
      colorStr: string = ''

      constructor() {
        this.reset()
      }

      reset() {
        this.x = Math.random() * W
        this.y = Math.random() * H * 0.3
        this.length = Math.random() * 80 + 40
        this.speed = Math.random() * 5 + 3
        this.angle = Math.PI / 6 + (Math.random() - 0.5) * 0.25
        this.life = 1
        this.decay = Math.random() * 0.015 + 0.01
        const c = STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)]
        this.colorStr = c.str
      }

      update() {
        this.x += Math.cos(this.angle) * this.speed
        this.y += Math.sin(this.angle) * this.speed
        this.life -= this.decay
      }

      draw() {
        if (!ctx || this.life <= 0) return
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(this.angle)

        const grad = ctx.createLinearGradient(0, 0, -this.length, 0)
        grad.addColorStop(0, `rgba(${this.colorStr},${this.life.toFixed(2)})`)
        grad.addColorStop(1, `rgba(${this.colorStr},0)`)

        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.lineTo(-this.length, 0)
        ctx.strokeStyle = grad
        ctx.lineWidth = 1.2
        ctx.shadowBlur = 0
        ctx.stroke()
        ctx.restore()
      }
    }

    class Particle {
      x: number
      y: number
      vx: number
      vy: number
      size: number
      glowPhase: number
      glowSpeed: number
      colorStr: string
      baseAlpha: number
      large: boolean

      constructor(x: number, y: number) {
        this.x = x
        this.y = y
        this.vx = (Math.random() - 0.5) * 0.3
        this.vy = (Math.random() - 0.5) * 0.3
        this.size = Math.random() * 3 + 1
        this.glowPhase = Math.random() * Math.PI * 2
        this.glowSpeed = Math.random() * 0.02 + 0.005
        const c = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)]
        this.colorStr = c.str
        this.baseAlpha = c.baseA
        this.large = this.size > 2.5
      }

      update() {
        if (!isSpecialPage) {
          const dx = mouseX - this.x
          const dy = mouseY - this.y
          const distSq = dx * dx + dy * dy
          const threshold = 180 * 180

          if (distSq < threshold) {
            const dist = Math.sqrt(distSq)
            const force = (180 - dist) / 180
            this.vx += (dx / dist) * force * 0.04
            this.vy += (dy / dist) * force * 0.04
          }
        }

        this.vx *= 0.97
        this.vy *= 0.97
        this.x += this.vx
        this.y += this.vy

        if (this.x < 0) this.x = W
        if (this.x > W) this.x = 0
        if (this.y < 0) this.y = H
        if (this.y > H) this.y = 0

        this.glowPhase += this.glowSpeed
      }

      draw() {
        if (!ctx) return
        const glow = Math.sin(this.glowPhase) * 0.3 + 0.7
        const alpha = (this.baseAlpha * glow).toFixed(2)
        ctx.shadowBlur = 0
        ctx.beginPath()
        if (this.large) {
          ctx.arc(this.x, this.y, this.size * 1.6, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${this.colorStr},${(this.baseAlpha * glow * 0.2).toFixed(2)})`
          ctx.fill()
        }
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${this.colorStr},${alpha})`
        ctx.fill()
      }
    }

    class ZParticle {
      x: number
      y: number
      vx: number
      vy: number
      size: number
      opacity: number
      color: { str: string }
      trail: Array<{ x: number, y: number, opacity: number }>
      dead: boolean

      constructor() {
        this.x = W / 2
        this.y = H / 2
        this.vx = (Math.random() - 0.5) * 4
        this.vy = (Math.random() - 0.5) * 4
        this.size = Math.random() * 5 + 2
        this.opacity = 1
        this.color = Z_COLORS[Math.random() > 0.5 ? 0 : 1]
        this.trail = []
        this.dead = false
      }

      update() {
        this.vx *= 0.96
        this.vy *= 0.96
        this.vx += (Math.random() - 0.5) * 0.15
        this.vy += (Math.random() - 0.5) * 0.15
        this.x += this.vx
        this.y += this.vy
        this.opacity -= 0.015
        if (this.opacity <= 0) {
          this.dead = true
          return
        }

        this.trail.push({ x: this.x, y: this.y, opacity: this.opacity })
        if (this.trail.length > 10) this.trail.shift()
      }

      draw() {
        if (!ctx || this.dead) return
        ctx.globalAlpha = this.opacity
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${this.color.str},1)`
        ctx.fill()
        ctx.globalAlpha = 1

        this.drawTrail()
      }

      drawTrail() {
        if (!ctx) return
        const len = this.trail.length
        const colorStr = this.color.str
        for (let i = 1; i < len; i++) {
          const point = this.trail[i]
          const trailOpacity = point.opacity * (i / len) * 0.4
          if (trailOpacity < 0.01) continue
          ctx.beginPath()
          ctx.arc(point.x, point.y, 1.5, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${colorStr},${trailOpacity.toFixed(2)})`
          ctx.fill()
        }
      }
    }

    class GravitySpark {
      x: number
      y: number
      vx: number
      vy: number
      size: number
      opacity: number
      decay: number
      dead: boolean
      colorStr: string

      constructor(x: number, y: number) {
        this.x = x
        this.y = y
        const angle = Math.random() * Math.PI * 2
        const speed = Math.random() * 2 + 1
        this.vx = Math.cos(angle) * speed
        this.vy = Math.sin(angle) * speed
        this.size = Math.random() * 2.5 + 1.2
        this.opacity = 1.0
        this.decay = Math.random() * 0.02 + 0.015
        this.dead = false
        this.colorStr = SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)]
      }

      update() {
        const dx = mouseX - this.x
        const dy = mouseY - this.y
        const distSq = dx * dx + dy * dy

        if (distSq > 100) {
          const dist = Math.sqrt(distSq)
          const force = Math.min(dist, 250) / 250
          this.vx += (dx / dist) * force * 0.15
          this.vy += (dy / dist) * force * 0.15

          const orbitForce = (1 - force) * 0.1
          this.vx += (-dy / dist) * orbitForce
          this.vy += (dx / dist) * orbitForce
        }

        this.vx *= 0.94
        this.vy *= 0.94
        this.vy -= 0.02

        this.x += this.vx
        this.y += this.vy

        this.opacity -= this.decay
        this.size *= 0.97

        if (this.opacity <= 0) this.dead = true
      }

      draw() {
        if (!ctx || this.dead) return
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = `${this.colorStr}${this.opacity.toFixed(2)})`
        ctx.fill()
      }
    }

    function initElements() {
      const starCount = Math.min(isMobile ? 50 : 120, Math.floor((W * H) / (isMobile ? 12000 : 7000)))
      for (let i = 0; i < starCount; i++) {
        stars.push(new Star())
      }

      const shootingStarInterval = setInterval(() => {
        if (!isPaused && Math.random() < 0.3) {
          shootingStars.push(new ShootingStar())
        }
      }, 3000)

      const zParticleInterval = setInterval(() => {
        if (!isPaused && Math.random() < 0.2) {
          zParticles.push(new ZParticle())
        }
      }, 2000)

      return () => {
        clearInterval(shootingStarInterval)
        clearInterval(zParticleInterval)
      }
    }

    function drawHarmony() {
      if (!ctx) return
      ctx.save()
      ctx.globalCompositeOperation = 'screen'

      // Stars
      for (let i = 0; i < stars.length; i++) {
        const twinkle = stars[i].update()
        stars[i].draw(twinkle)
      }

      // Shooting stars
      for (let i = 0; i < shootingStars.length; i++) {
        shootingStars[i].update()
        shootingStars[i].draw()
      }
      if (shootingStars.some(s => s.life <= 0)) {
        shootingStars = shootingStars.filter(s => s.life > 0)
      }

      // Z Particles
      for (let i = 0; i < zParticles.length; i++) {
        zParticles[i].update()
        zParticles[i].draw()
      }
      if (zParticles.some(z => z.dead)) {
        zParticles = zParticles.filter(z => !z.dead)
      }

      // Gravity sparks
      if (gravitySparks.length > 40) gravitySparks.splice(0, gravitySparks.length - 40)
      for (let i = 0; i < gravitySparks.length; i++) {
        gravitySparks[i].update()
        gravitySparks[i].draw()
      }
      if (gravitySparks.some(s => s.dead)) {
        gravitySparks = gravitySparks.filter(s => !s.dead)
      }

      // Constellation connections
      if (frameCount % 2 === 0) {
        const sparksLen = gravitySparks.length
        for (let i = 0; i < sparksLen; i++) {
          const s1 = gravitySparks[i]

          const dxM = mouseX - s1.x
          const dyM = mouseY - s1.y
          const distMouseSq = dxM * dxM + dyM * dyM
          if (distMouseSq < 10000) {
            const distMouse = Math.sqrt(distMouseSq)
            ctx.beginPath()
            ctx.moveTo(mouseX, mouseY)
            ctx.lineTo(s1.x, s1.y)
            ctx.strokeStyle = `rgba(212,165,116,${(0.15 * (1 - distMouse / 100) * s1.opacity).toFixed(2)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }

          for (let j = i + 1; j < sparksLen; j++) {
            const s2 = gravitySparks[j]
            const dx = s1.x - s2.x
            const dy = s1.y - s2.y
            const distSq = dx * dx + dy * dy
            if (distSq < 3600) {
              const dist = Math.sqrt(distSq)
              const alpha = (0.12 * (1 - dist / 60) * ((s1.opacity + s2.opacity) / 2)).toFixed(2)
              ctx.beginPath()
              ctx.moveTo(s1.x, s1.y)
              ctx.lineTo(s2.x, s2.y)
              ctx.strokeStyle = `rgba(0,229,255,${alpha})`
              ctx.lineWidth = 0.5
              ctx.stroke()
            }
          }
        }
      }

      ctx.restore()
    }

    function initParticles() {
      const maxParticles = isMobile ? 15 : 50
      const areaFactor = isMobile ? 25000 : 12000
      const particleCount = Math.min(maxParticles, Math.floor((W * H) / areaFactor))
      particles = []
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(Math.random() * W, Math.random() * H))
      }
    }

    function animate(time: number) {
      if (isPaused || !ctx) return

      frameCount++

      let deltaTime = (time - lastTime) / 16.67
      if (deltaTime > 3 || lastTime === 0) deltaTime = 1
      lastTime = time

      ctx.fillStyle = bgGradient || '#0D0A07'
      ctx.fillRect(0, 0, W, H)

      for (let i = 0; i < particles.length; i++) {
        particles[i].update()
        particles[i].draw()
      }

      drawHarmony()

      animationId = requestAnimationFrame(animate)
    }

    const mousemoveHandler = (e: MouseEvent) => {
      pendingMouseX = e.clientX
      pendingMouseY = e.clientY

      if (!mousemoveRafPending) {
        mousemoveRafPending = true
        requestAnimationFrame(() => {
          mouseX = pendingMouseX
          mouseY = pendingMouseY

          const dx = mouseX - lastSpawnX
          const dy = mouseY - lastSpawnY
          const distSq = dx * dx + dy * dy

          if (distSq > 64) {
            gravitySparks.push(new GravitySpark(mouseX, mouseY))
            lastSpawnX = mouseX
            lastSpawnY = mouseY
          }

          if (Math.random() < 0.02) {
            zParticles.push(new ZParticle())
          }

          mousemoveRafPending = false
        })
      }
    }

    const visibilitychangeHandler = () => {
      if (document.hidden) {
        isPaused = true
        if (animationId) {
          cancelAnimationFrame(animationId)
          animationId = null
        }
      } else {
        isPaused = false
        lastTime = 0
        animationId = requestAnimationFrame(animate)
      }
    }

    const handleResize = debounce(() => {
      resize()
      initParticles()
    }, 300)

    // Run setup
    resize()
    initParticles()
    const cleanupElements = initElements()
    animationId = requestAnimationFrame(animate)

    document.addEventListener('mousemove', mousemoveHandler, { passive: true })
    document.addEventListener('visibilitychange', visibilitychangeHandler)
    window.addEventListener('resize', handleResize)

    // Save cleanup
    cleanup = () => {
      cleanupElements()
      if (animationId) cancelAnimationFrame(animationId)
      if (routeWatch) routeWatch()
      document.removeEventListener('mousemove', mousemoveHandler)
      document.removeEventListener('visibilitychange', visibilitychangeHandler)
      window.removeEventListener('resize', handleResize)
    }
  }

  onBeforeUnmount(() => {
    if (cleanup) cleanup()
  })

  return {
    initCanvas
  }
}
