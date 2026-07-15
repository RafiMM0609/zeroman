/* ============================================================
   ZEROMAN PORTFOLIO — COSMIC HARMONY SYSTEM
   Warm cinematic particles with star twinkling and Z-effects
   ============================================================ */

(function () {
  'use strict';

  /* ──────────────────────────────────────────────────────────
     COSMIC HARMONY — Star twinkling + Warm cinematic particles
     ────────────────────────────────────────────────────────── */
  function initCosmicHarmony() {
    const canvas = document.getElementById('bio-canvas');
    if (!canvas) return;
    
    // Respect motion preferences
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      canvas.style.display = 'none';
      return;
    }

    const ctx = canvas.getContext('2d');
    let W, H;
    let stars = [];
    let shootingStars = [];
    let particles = [];
    let zParticles = [];
    let gravitySparks = [];
    let mouseX = -1000, mouseY = -1000;
    let lastSpawnX = 0, lastSpawnY = 0;
    let lastTime = 0;
    
    // Warm cinematic particle colors
    const PARTICLE_COLORS_RGB = [
      { r: 212, g: 165, b: 116, a: 0.35 },  // warm ivory
      { r: 255, g: 154, b: 90, a: 0.25 },   // warm orange
      { r: 255, g: 179, b: 71, a: 0.2 },    // golden orange
      { r: 184, g: 92, b: 54, a: 0.25 }     // deep terracotta
    ];
    
    // Star colors for variety
    const STAR_COLORS_RGB = [
      { r: 255, g: 255, b: 255, a: 0.8 },
      { r: 212, g: 165, b: 116, a: 0.6 },
      { r: 255, g: 179, b: 71, a: 0.5 },
      { r: 0, g: 229, b: 255, a: 0.4 }
    ];

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      
      // Redistribute stars on resize
      stars = [];
      const starCount = Math.min(150, Math.floor((W * H) / 6000));
      for (let i = 0; i < starCount; i++) {
        stars.push(new Star());
      }
    }

    class Star {
      constructor() {
        this.x = Math.random() * W;
        this.y = Math.random() * H;
        this.size = Math.random() * 2;
        this.twinkleSpeed = Math.random() * 0.015 + 0.005;
        this.twinklePhase = Math.random() * Math.PI * 2;
        const baseColor = STAR_COLORS_RGB[Math.floor(Math.random() * STAR_COLORS_RGB.length)];
        this.r = baseColor.r;
        this.g = baseColor.g;
        this.b = baseColor.b;
        this.baseAlpha = baseColor.a;
      }
      
      update() {
        this.twinklePhase += this.twinkleSpeed;
        return Math.sin(this.twinklePhase) * 0.4 + 0.6;
      }
      
      draw(twinkle) {
        const alpha = this.baseAlpha * twinkle * (this.size / 2);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.r}, ${this.g}, ${this.b}, ${alpha})`;
        if (this.size > 1.4) {
          ctx.shadowBlur = 6 * twinkle;
          ctx.shadowColor = `rgba(${this.r}, ${this.g}, ${this.b}, ${alpha * 0.8})`;
        } else {
          ctx.shadowBlur = 0;
        }
        ctx.fill();
      }
    }

    class ShootingStar {
      constructor() {
        this.reset();
      }
      
      reset() {
        this.x = Math.random() * W;
        this.y = Math.random() * H * 0.3;
        this.length = Math.random() * 80 + 40;
        this.speed = Math.random() * 5 + 3;
        this.angle = Math.PI / 6 + (Math.random() - 0.5) * 0.25;
        this.life = 1;
        this.decay = Math.random() * 0.015 + 0.01;
        const baseColor = STAR_COLORS_RGB[Math.floor(Math.random() * STAR_COLORS_RGB.length)];
        this.r = baseColor.r;
        this.g = baseColor.g;
        this.b = baseColor.b;
      }
      
      update() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        this.life -= this.decay;
      }
      
      draw() {
        if (this.life <= 0) return;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        
        const grad = ctx.createLinearGradient(0, 0, -this.length, 0);
        grad.addColorStop(0, `rgba(${this.r}, ${this.g}, ${this.b}, ${this.life})`);
        grad.addColorStop(1, `rgba(${this.r}, ${this.g}, ${this.b}, 0)`);
        
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-this.length, 0);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.2;
        ctx.shadowBlur = 8 * this.life;
        ctx.shadowColor = `rgba(${this.r}, ${this.g}, ${this.b}, ${this.life * 0.5})`;
        ctx.stroke();
        ctx.restore();
      }
    }

    class Particle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.size = Math.random() * 3 + 1;
        this.glowPhase = Math.random() * Math.PI * 2;
        this.glowSpeed = Math.random() * 0.02 + 0.005;
        const baseColor = PARTICLE_COLORS_RGB[Math.floor(Math.random() * PARTICLE_COLORS_RGB.length)];
        this.r = baseColor.r;
        this.g = baseColor.g;
        this.b = baseColor.b;
        this.baseAlpha = baseColor.a;
      }

      update(mouseX, mouseY, deltaTime) {
        const isSpecialPage = window.location.pathname.includes('/contact') || 
                           window.location.pathname.includes('/about');
        
        if (!isSpecialPage) {
          const dx = mouseX - this.x;
          const dy = mouseY - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 180) {
            const force = (180 - dist) / 180;
            this.vx += (dx / dist) * force * 0.04;
            this.vy += (dy / dist) * force * 0.04;
          }
        }

        this.vx *= 0.97;
        this.vy *= 0.97;
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0) this.x = W;
        if (this.x > W) this.x = 0;
        if (this.y < 0) this.y = H;
        if (this.y > H) this.y = 0;

        this.glowPhase += this.glowSpeed;
      }

      draw() {
        const glow = Math.sin(this.glowPhase) * 0.3 + 0.7;
        const alpha = this.baseAlpha * glow;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.r}, ${this.g}, ${this.b}, ${alpha})`;
        if (this.size > 2.2) {
          ctx.shadowBlur = 8 * glow;
          ctx.shadowColor = `rgba(${this.r}, ${this.g}, ${this.b}, ${alpha * 0.8})`;
        } else {
          ctx.shadowBlur = 0;
        }
        ctx.fill();
      }
    }

    class ZParticle {
      constructor() {
        this.x = W / 2;
        this.y = H / 2;
        this.vx = (Math.random() - 0.5) * 4;
        this.vy = (Math.random() - 0.5) * 4;
        this.size = Math.random() * 5 + 2;
        this.opacity = 1;
        this.color = Math.random() > 0.5 ? { r: 0, g: 229, b: 255 } : { r: 212, g: 165, b: 116 };
        this.trail = [];
      }
      
      update() {
        this.vx *= 0.96;
        this.vy *= 0.96;
        this.vx += (Math.random() - 0.5) * 0.15;
        this.vy += (Math.random() - 0.5) * 0.15;
        this.x += this.vx;
        this.y += this.vy;
        this.opacity -= 0.015;
        
        this.trail.push({x: this.x, y: this.y, opacity: this.opacity});
        if (this.trail.length > 15) this.trail.shift();
      }
      
      draw() {
        if (this.opacity <= 0) return;
        ctx.save();
        ctx.shadowBlur = 10 * this.opacity;
        ctx.shadowColor = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.opacity})`;
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.opacity})`;
        ctx.fill();
        ctx.restore();
        
        this.drawTrail();
      }
      
      drawTrail() {
        for (let i = 0; i < this.trail.length; i++) {
          const point = this.trail[i];
          if (point.opacity <= 0) continue;
          const trailOpacity = point.opacity * (i / this.trail.length) * 0.5;
          ctx.beginPath();
          ctx.arc(point.x, point.y, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${trailOpacity})`;
          ctx.fill();
        }
      }
    }

    class GravitySpark {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 2 + 1;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.size = Math.random() * 2.5 + 1.2;
        this.opacity = 1.0;
        this.decay = Math.random() * 0.02 + 0.015;
        
        const colors = [
          'rgba(0, 229, 255, ',   // cyan
          'rgba(212, 165, 116, ',  // warm ivory
          'rgba(255, 154, 90, ',   // warm orange
          'rgba(0, 255, 157, '    // aurora
        ];
        this.colorStr = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist > 10) {
          const force = Math.min(dist, 250) / 250;
          this.vx += (dx / dist) * force * 0.15;
          this.vy += (dy / dist) * force * 0.15;
          
          const orbitForce = (1 - force) * 0.1;
          this.vx += (-dy / dist) * orbitForce;
          this.vy += (dx / dist) * orbitForce;
        }

        this.vx *= 0.94;
        this.vy *= 0.94;
        this.vy -= 0.02;

        this.x += this.vx;
        this.y += this.vy;
        
        this.opacity -= this.decay;
        this.size *= 0.97;
      }

      draw() {
        if (this.opacity <= 0) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `${this.colorStr}${this.opacity})`;
        ctx.fill();
      }
    }

    function initElements() {
      // Initial population of stars
      const starCount = Math.min(150, Math.floor((W * H) / 6000));
      for (let i = 0; i < starCount; i++) {
        stars.push(new Star());
      }
      
      const shootingStarInterval = setInterval(() => {
        if (Math.random() < 0.3) {
          shootingStars.push(new ShootingStar());
        }
      }, 3000);
      
      const zParticleInterval = setInterval(() => {
        if (Math.random() < 0.2) {
          zParticles.push(new ZParticle());
        }
      }, 2000);
      
      return () => {
        clearInterval(shootingStarInterval);
        clearInterval(zParticleInterval);
      };
    }

    function drawHarmony() {
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      
      stars.forEach(star => {
        const twinkle = star.update();
        star.draw(twinkle);
      });
      
      shootingStars.forEach((shootingStar, index) => {
        shootingStar.update();
        shootingStar.draw();
        if (shootingStar.life <= 0) {
          shootingStars.splice(index, 1);
        }
      });
      
      zParticles.forEach((zParticle, index) => {
        zParticle.update();
        zParticle.draw();
        if (zParticle.opacity <= 0) {
          zParticles.splice(index, 1);
        }
      });
      
      // Update and draw gravity sparks (max 50)
      if (gravitySparks.length > 50) {
        gravitySparks.shift();
      }
      
      gravitySparks.forEach((spark, index) => {
        spark.update();
        spark.draw();
        if (spark.opacity <= 0) {
          gravitySparks.splice(index, 1);
        }
      });

      // Draw constellation connections between sparks and mouse
      for (let i = 0; i < gravitySparks.length; i++) {
        const s1 = gravitySparks[i];
        
        // Line to mouse
        const dxMouse = mouseX - s1.x;
        const dyMouse = mouseY - s1.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
        if (distMouse < 100) {
          ctx.beginPath();
          ctx.moveTo(mouseX, mouseY);
          ctx.lineTo(s1.x, s1.y);
          ctx.strokeStyle = `rgba(212, 165, 116, ${0.15 * (1 - distMouse / 100) * s1.opacity})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }

        // Lines to other sparks
        for (let j = i + 1; j < gravitySparks.length; j++) {
          const s2 = gravitySparks[j];
          const dx = s1.x - s2.x;
          const dy = s1.y - s2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 60) {
            ctx.beginPath();
            ctx.moveTo(s1.x, s1.y);
            ctx.lineTo(s2.x, s2.y);
            const alpha = 0.12 * (1 - dist / 60) * ((s1.opacity + s2.opacity) / 2);
            ctx.strokeStyle = `rgba(0, 229, 255, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      
      ctx.restore();
    }

    function initParticles() {
      const particleCount = Math.min(60, Math.floor((W * H) / 10000));
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(
          Math.random() * W,
          Math.random() * H
        ));
      }
    }

    function animate(time) {
      const deltaTime = (time - lastTime) / 16.67;
      lastTime = time;

      ctx.clearRect(0, 0, W, H);

      const gradient = ctx.createRadialGradient(W * 0.5, H * 0.5, 0, W * 0.5, H * 0.5, Math.max(W, H) * 0.8);
      gradient.addColorStop(0, 'rgba(13, 10, 7, 0)');
      gradient.addColorStop(1, 'rgba(13, 10, 7, 0.45)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, W, H);

      particles.forEach(particle => {
        particle.update(mouseX, mouseY, deltaTime);
        particle.draw();
      });
      
      drawHarmony();

      requestAnimationFrame(animate);
    }

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // Throttle spark spawning based on move distance
      const dx = mouseX - lastSpawnX;
      const dy = mouseY - lastSpawnY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist > 8) {
        gravitySparks.push(new GravitySpark(mouseX, mouseY));
        lastSpawnX = mouseX;
        lastSpawnY = mouseY;
      }
      
      // Trigger Z particle burst on mouse move for interactive effect
      if (Math.random() < 0.03) {
        zParticles.push(new ZParticle());
      }
    }, { passive: true });

    resize();
    initParticles();
    const cleanup = initElements();
    animate();

    window.addEventListener('resize', () => {
      resize();
      initParticles();
    });

    return () => {
      cleanup();
    };
  }

  /* ──────────────────────────────────────────────────────────
      2. SMOOTH SCROLL WITH COSMIC HARMONY
     ────────────────────────────────────────────────────────── */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          if (target.id.includes('form') || target.id.includes('contact')) {
            target.scrollIntoView({ behavior: 'smooth', block: 'center' });
            target.style.boxShadow = '0 0 20px rgba(212, 165, 116, 0.3)';
            setTimeout(() => {
              target.style.boxShadow = 'none';
            }, 2000);
          } else {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      });
    });
  }

  /* ──────────────────────────────────────────────────────────
      3. ENHANCED FOCUS STATES
     ────────────────────────────────────────────────────────── */
  function initFocusStates() {
    document.querySelectorAll('input, select, textarea').forEach(input => {
      input.addEventListener('focus', function() {
        if (this.parentElement) this.parentElement.style.transform = 'translateY(-2px)'
        this.style.borderColor = 'var(--accent-primary)'
        this.style.boxShadow = '0 0 12px rgba(212, 165, 116, 0.2)'
      })

      input.addEventListener('blur', function() {
        if (this.parentElement) this.parentElement.style.transform = 'none'
        this.style.borderColor = 'var(--border)'
        this.style.boxShadow = 'none'
      })
    })
  }

  /* ──────────────────────────────────────────────────────────
      4. CONTACT PAGE HARMONIZATION
     ────────────────────────────────────────────────────────── */
  function initContactHarmony() {
    if (!window.location.pathname.includes('/contact')) return;

    const form = document.getElementById('contact-form');
    if (!form) return;

    const submitBtn = document.getElementById('form-submit');
    if (submitBtn) {
      submitBtn.addEventListener('click', function(e) {
        const span = this.querySelector('span');
        if (span) span.textContent = 'Sending...';
        this.style.background = 'linear-gradient(135deg, var(--accent-tertiary), var(--accent-deep))'
        
        setTimeout(() => {
          if (span) span.textContent = 'Kirim Pesan →';
          this.style.background = 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))'
        }, 2000)
      })
    }

    const canvas = document.getElementById('bio-canvas');
    if (canvas) {
      canvas.style.opacity = '0.25'
      canvas.style.filter = 'blur(0.5px)'
    }
  }

  /* ──────────────────────────────────────────────────────────
      5. CUSTOM CURSOR SYSTEM
     ────────────────────────────────────────────────────────── */
  function initCustomCursor() {
    const dot = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    if (!dot || !ring) return;

    let mouseX = 0, mouseY = 0;
    let dotX = 0, dotY = 0;
    let ringX = 0, ringY = 0;
    let isMoving = false;

    function tick() {
      dotX += (mouseX - dotX) * 0.3;
      dotY += (mouseY - dotY) * 0.3;
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;

      dot.style.left = `${dotX}px`;
      dot.style.top = `${dotY}px`;
      ring.style.left = `${ringX}px`;
      ring.style.top = `${ringY}px`;

      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isMoving) {
        dot.style.opacity = '1';
        ring.style.opacity = '1';
        isMoving = true;
      }
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
      dot.style.opacity = '0';
      ring.style.opacity = '0';
      isMoving = false;
    });

    const updateClickableHovers = () => {
      const clickables = document.querySelectorAll('a, button, input, select, textarea, [role="link"], .project-item, .project-card');
      clickables.forEach(el => {
        if (el.dataset.cursorBound) return;
        el.dataset.cursorBound = 'true';

        el.addEventListener('mouseenter', () => {
          document.body.classList.add('cursor-hover');
        });
        el.addEventListener('mouseleave', () => {
          document.body.classList.remove('cursor-hover');
        });
      });
    };

    updateClickableHovers();

    const observer = new MutationObserver(() => {
      updateClickableHovers();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  /* ──────────────────────────────────────────────────────────
     INITIALIZATION
     ────────────────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    initCosmicHarmony();
    initSmoothScroll();
    initFocusStates();
    initContactHarmony();
    initCustomCursor();
  });
})();
