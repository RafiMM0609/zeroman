/* ============================================================
   ZEROMAN PORTFOLIO — main.js
   Bioluminescent Deep Ocean Experience
   
   Features:
   1. Bioluminescent particle canvas (plankton-like organisms)
   2. Custom luminescent cursor with trailing light
   3. Scroll-triggered animations (IntersectionObserver)
   4. Counter animations
   5. Typing effect — keyword rotator
   6. Nav scroll state
   7. Skill bars animation
   8. Bottom sheet modal
   9. Portfolio data loader from JSON
   ============================================================ */

(function () {
  'use strict';

  /* ──────────────────────────────────────────────────────────
     PORTFOLIO DATA — loaded from JSON
     ────────────────────────────────────────────────────────── */
  let portfolioData = null;

  async function loadPortfolioData() {
    try {
      const res = await fetch('/public/data/portfolio.json');
      if (!res.ok) throw new Error('Failed to load data');
      portfolioData = await res.json();
      return portfolioData;
    } catch (e) {
      console.warn('Portfolio data not loaded:', e.message);
      return null;
    }
  }

  /* ──────────────────────────────────────────────────────────
     1. BIOLUMINESCENT PARTICLE CANVAS
        — Mimics deep-sea plankton and bioluminescent organisms
     ────────────────────────────────────────────────────────── */
  function initBioCanvas() {
    const canvas = document.getElementById('bio-canvas');
    if (!canvas) return;
    // Respect reduced-motion: skip the animated particle loop entirely.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = canvas.getContext('2d');
    let W, H;
    let particles = [];
    let mouseX = -1000, mouseY = -1000;

    const COLORS = [
      [0, 229, 255],   // cyan
      [0, 255, 198],   // teal
      [68, 136, 255],  // cobalt
      [155, 89, 255],  // violet
      [0, 255, 157],   // aurora
      [255, 209, 102], // gold (rare)
    ];

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener('resize', resize, { passive: true });

    // Bio-organism class — each is a tiny glowing creature
    class BioOrganism {
      constructor() {
        this.reset(true);
      }

      reset(init = false) {
        this.x = Math.random() * W;
        this.y = init ? Math.random() * H : H + 20;
        this.size = Math.random() * 2.5 + 0.5;
        this.speedY = -(Math.random() * 0.4 + 0.1); // drift upward slowly
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.life = 0;
        this.maxLife = Math.random() * 400 + 200;
        this.colorIdx = Math.floor(Math.random() * COLORS.length);
        this.pulseSpeed = Math.random() * 0.02 + 0.01;
        this.pulseOffset = Math.random() * Math.PI * 2;
        this.type = Math.random(); // 0-0.7: dot, 0.7-0.9: ring, 0.9-1: jellyfish
        this.trail = [];
        this.maxTrail = Math.floor(Math.random() * 8 + 3);
        this.wander = Math.random() * Math.PI * 2;
        this.wanderSpeed = (Math.random() - 0.5) * 0.02;
        this.opacity = 0;
      }

      update() {
        // Wander drift — organic movement
        this.wander += this.wanderSpeed;
        this.speedX += Math.cos(this.wander) * 0.005;
        this.speedX = Math.max(-0.5, Math.min(0.5, this.speedX));

        // Mouse repulsion — shy away from cursor
        const dx = this.x - mouseX;
        const dy = this.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const force = (120 - dist) / 120;
          this.speedX += (dx / dist) * force * 0.8;
          this.speedY += (dy / dist) * force * 0.8;
        }

        // Save trail
        this.trail.unshift({ x: this.x, y: this.y });
        if (this.trail.length > this.maxTrail) this.trail.pop();

        this.x += this.speedX;
        this.y += this.speedY;
        this.life++;

        // Fade in / fade out
        if (this.life < 60) {
          this.opacity = this.life / 60;
        } else if (this.life > this.maxLife - 60) {
          this.opacity = (this.maxLife - this.life) / 60;
        } else {
          this.opacity = 1;
        }

        // Pulse
        const pulse = Math.sin(this.life * this.pulseSpeed + this.pulseOffset) * 0.5 + 0.5;
        this.currentAlpha = this.opacity * (0.3 + pulse * 0.4);

        // Reset when out of life or off screen
        if (this.life >= this.maxLife || this.x < -50 || this.x > W + 50 || this.y < -100) {
          this.reset();
        }
      }

      draw() {
        const [r, g, b] = COLORS[this.colorIdx];
        const alpha = this.currentAlpha;

        ctx.save();

        // Draw luminescent trail
        for (let i = 0; i < this.trail.length; i++) {
          const t = this.trail[i];
          const trailAlpha = alpha * (1 - i / this.trail.length) * 0.4;
          ctx.beginPath();
          ctx.arc(t.x, t.y, this.size * (1 - i / this.trail.length), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r},${g},${b},${trailAlpha})`;
          ctx.fill();
        }

        if (this.type < 0.7) {
          // Glowing dot — plankton
          const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 4);
          gradient.addColorStop(0, `rgba(${r},${g},${b},${alpha})`);
          gradient.addColorStop(0.5, `rgba(${r},${g},${b},${alpha * 0.3})`);
          gradient.addColorStop(1, `rgba(${r},${g},${b},0)`);

          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size * 4, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
          ctx.fill();

        } else if (this.type < 0.9) {
          // Ring — micro-organism
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${r},${g},${b},${alpha * 0.5})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();

        } else {
          // Star/cross — rare crystalline form
          ctx.strokeStyle = `rgba(${r},${g},${b},${alpha * 0.7})`;
          ctx.lineWidth = 0.5;
          for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 3) {
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(
              this.x + Math.cos(angle + this.life * 0.01) * this.size * 4,
              this.y + Math.sin(angle + this.life * 0.01) * this.size * 4
            );
            ctx.stroke();
          }

          // Center glow
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size * 1.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
          ctx.fill();
        }

        ctx.restore();
      }
    }

    // Create initial population
    const PARTICLE_COUNT = Math.min(80, Math.floor(W * H / 12000));
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new BioOrganism());
    }

    // Track mouse for repulsion
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, { passive: true });

    function animate() {
      ctx.clearRect(0, 0, W, H);

      // Add new organisms occasionally
      if (particles.length < PARTICLE_COUNT && Math.random() < 0.1) {
        particles.push(new BioOrganism());
      }

      particles.forEach(p => {
        p.update();
        p.draw();
      });

      requestAnimationFrame(animate);
    }

    animate();
  }

  /* ──────────────────────────────────────────────────────────
     2. LUMINESCENT CURSOR — trailing glow effect
     ────────────────────────────────────────────────────────── */
  function initCursor() {
    const dot  = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');

    if (!dot || !ring) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;
    // Respect reduced-motion: keep the native cursor, no custom trailing glow.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let mx = -200, my = -200;
    let rx = -200, ry = -200;

    window.addEventListener('mousemove', (e) => {
      mx = e.clientX;
      my = e.clientY;
    }, { passive: true });

    // Expand ring on interactive elements
    const interactives = 'a, button, .project-item, .service-card, .stat-card, .skill-cloud-tag, .testimonial-card, .contact-link-item';

    document.querySelectorAll(interactives).forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('hovering'));
      el.addEventListener('mouseleave', () => ring.classList.remove('hovering'));
    });

    // Use MutationObserver to catch dynamically added elements (modal content)
    const observer = new MutationObserver(() => {
      document.querySelectorAll(interactives).forEach(el => {
        if (!el._cursorBound) {
          el._cursorBound = true;
          el.addEventListener('mouseenter', () => ring.classList.add('hovering'));
          el.addEventListener('mouseleave', () => ring.classList.remove('hovering'));
        }
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    function moveCursor() {
      dot.style.transform = `translate(${mx}px, ${my}px)`;
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.transform = `translate(${rx}px, ${ry}px)`;
      requestAnimationFrame(moveCursor);
    }
    requestAnimationFrame(moveCursor);
  }

  /* ──────────────────────────────────────────────────────────
     3. SCROLL ANIMATIONS — IntersectionObserver
     ────────────────────────────────────────────────────────── */
  function initScrollAnimations() {
    const animEls = document.querySelectorAll('.fade-up, .fade-left, .fade-right');
    if (!animEls.length) return;

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    animEls.forEach(el => io.observe(el));
  }

  /* ──────────────────────────────────────────────────────────
     4. COUNTER ANIMATION — animated stat numbers
     ────────────────────────────────────────────────────────── */
  function initCounters() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    if (!counters.length) return;

    const cIo = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const el     = entry.target;
        const target = parseInt(el.dataset.target, 10);
        const suffix = el.dataset.suffix || '+';
        let current  = 0;
        const step   = Math.max(1, Math.ceil(target / 50));

        const tick = () => {
          current = Math.min(current + step, target);
          el.textContent = current + suffix;
          if (current < target) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        cIo.unobserve(el);
      });
    }, { threshold: 0.5 });

    counters.forEach(el => cIo.observe(el));
  }

  /* ──────────────────────────────────────────────────────────
     5. TYPING EFFECT — hero rotating words
     ────────────────────────────────────────────────────────── */
  function initTyping() {
    const el = document.getElementById('typed-text');
    if (!el) return;

    const words   = ['Software', 'AI Agents', 'Backend', 'Web Apps', 'Systems'];
    let wordIdx   = 0;
    let charIdx   = 0;
    let deleting  = false;
    let pauseTimer = null;

    function typeLoop() {
      const word    = words[wordIdx];
      const current = deleting
        ? word.substring(0, charIdx - 1)
        : word.substring(0, charIdx + 1);

      el.textContent = current;

      if (!deleting && current === word) {
        setTimeout(() => {
          deleting = true;
          typeLoop();
        }, 2000);
        return;
      } else if (deleting && current === '') {
        deleting = false;
        wordIdx  = (wordIdx + 1) % words.length;
        charIdx  = 0;
        setTimeout(typeLoop, 350);
        return;
      }

      charIdx = deleting ? charIdx - 1 : charIdx + 1;
      setTimeout(typeLoop, deleting ? 55 : 90);
    }

    typeLoop();
  }

  /* ──────────────────────────────────────────────────────────
     6. NAV SCROLL STATE
     ────────────────────────────────────────────────────────── */
  function initNav() {
    const nav = document.getElementById('main-nav');
    if (!nav) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  /* ──────────────────────────────────────────────────────────
     7. SKILL BARS ANIMATION — sonar ping effect
     ────────────────────────────────────────────────────────── */
  function initSkillBars() {
    const bars = document.querySelectorAll('.skill-bar-fill[data-level]');
    if (!bars.length) return;

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar   = entry.target;
          const level = bar.dataset.level;
          setTimeout(() => {
            bar.style.width = level + '%';
          }, 100);
          io.unobserve(bar);
        }
      });
    }, { threshold: 0.3 });

    bars.forEach(bar => io.observe(bar));
  }

  /* ──────────────────────────────────────────────────────────
     8. BOTTOM SHEET MODAL — project details
     ────────────────────────────────────────────────────────── */
  function initModal() {
    const modal      = document.getElementById('project-modal');
    const modalBody  = document.getElementById('modal-content-body');
    const closeBtn   = document.getElementById('modal-close-btn');
    const projectLinks = document.querySelectorAll('.project-item');

    if (!modal || !projectLinks.length) return;

    projectLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('data-href');
        if (href) {
          e.preventDefault();
          openModal(href);
          history.pushState({ modalOpen: true, href }, '', href);
        }
      });
    });

    function openModal(url) {
      modal.classList.add('active');
      document.body.classList.add('modal-open');
      modal.setAttribute('aria-hidden', 'false');

      if (modalBody) {
        modalBody.innerHTML = `
          <div class="modal-spinner-container">
            <div class="modal-spinner"></div>
            <p style="font-family:var(--font-mono);font-size:0.78rem;letter-spacing:0.1em;color:var(--fg-muted);">LOADING DATA...</p>
          </div>`;

        fetch(url)
          .then(r => { if (!r.ok) throw new Error('Gagal memuat'); return r.text(); })
          .then(html => {
            const doc    = new DOMParser().parseFromString(html, 'text/html');
            const detail = doc.querySelector('.project-detail');
            if (detail) {
              modalBody.innerHTML = '';
              modalBody.appendChild(detail);
            } else {
              modalBody.innerHTML = `<p style="color:var(--bio-coral);text-align:center;margin-top:40px;font-family:var(--font-mono)">Detail tidak ditemukan.</p>`;
            }
          })
          .catch(err => {
            modalBody.innerHTML = `<p style="color:var(--bio-coral);text-align:center;margin-top:40px;font-family:var(--font-mono)">${err.message}</p>`;
          });
      }
    }

    function closeModal(pushHistory = true) {
      modal.classList.remove('active');
      document.body.classList.remove('modal-open');
      modal.setAttribute('aria-hidden', 'true');
      if (pushHistory && window.location.pathname === '/project') {
        history.pushState({ modalOpen: false }, '', '/');
      }
    }

    if (closeBtn) closeBtn.addEventListener('click', () => closeModal());
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
    });

    window.addEventListener('popstate', () => {
      const p = new URL(window.location.href);
      if (p.pathname === '/project') openModal(p.pathname + p.search);
      else closeModal(false);
    });
  }

  /* ──────────────────────────────────────────────────────────
     9. SKILLS PAGE — dynamic skill bars from JSON data
     ────────────────────────────────────────────────────────── */
  function renderSkillsFromData() {
    const skillBarsContainer = document.getElementById('skill-bars-container');
    const skillCloudContainer = document.getElementById('skill-cloud-container');

    if (!portfolioData || !portfolioData.skills) return;

    // Render skill bars (top 8 skills)
    if (skillBarsContainer) {
      const topSkills = portfolioData.skills.slice(0, 8);
      skillBarsContainer.innerHTML = topSkills.map(skill => `
        <div class="skill-bar-item fade-up">
          <div class="skill-bar-header">
            <span class="skill-bar-name">${skill.name}</span>
            <span class="skill-bar-level">${skill.level}%</span>
          </div>
          <div class="skill-bar-track">
            <div class="skill-bar-fill" data-level="${skill.level}" style="--glow-color:${skill.glow}"></div>
          </div>
        </div>
      `).join('');
    }

    // Render skill cloud (all skills)
    if (skillCloudContainer) {
      skillCloudContainer.innerHTML = portfolioData.skills.map(skill => `
        <span class="skill-cloud-tag fade-up" data-cat="${skill.category}">${skill.name}</span>
      `).join('');
    }

    // Re-init skill bars & scroll animations after DOM update
    initSkillBars();
    initScrollAnimations();
  }

  /* ──────────────────────────────────────────────────────────
     10. PROJECTS PAGE — dynamic projects from JSON data
     ────────────────────────────────────────────────────────── */
  function renderProjectsFromData() {
    const projectList = document.getElementById('project-list');
    if (!projectList || !portfolioData || !portfolioData.projects) return;

    const statusLabel = {
      live: 'Live',
      complete: 'Complete',
      client: 'Client Work'
    };

    projectList.innerHTML = portfolioData.projects.map(p => `
      <div class="project-item fade-up" data-href="/project?id=${p.id}" role="link" tabindex="0">
        <div class="project-num">${p.num}</div>
        <div class="project-info">
          <h3 class="project-name">${p.title}</h3>
          <p class="project-desc">${p.short_desc}</p>
          <div class="project-meta">
            <div class="project-tags">
              ${p.tags.slice(0, 4).map(t => `<span class="tag">${t}</span>`).join('')}
            </div>
            <span class="project-status ${p.status}">${statusLabel[p.status] || p.status}</span>
          </div>
        </div>
        <div class="project-arrow">↗</div>
      </div>
    `).join('');

    // Keyboard accessibility
    document.querySelectorAll('.project-item[data-href]').forEach(el => {
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          el.click();
        }
      });
    });

    initScrollAnimations();
    initModal();
  }

  /* ──────────────────────────────────────────────────────────
     11. TESTIMONIALS — dynamic render
     ────────────────────────────────────────────────────────── */
  function renderTestimonialsFromData() {
    const container = document.getElementById('testimonials-container');
    if (!container || !portfolioData || !portfolioData.testimonials) return;

    container.innerHTML = portfolioData.testimonials.map((t, i) => `
      <div class="testimonial-card fade-up delay-${i + 1}">
        <div class="testimonial-stars">
          ${'<span>★</span>'.repeat(t.rating)}
        </div>
        <p class="testimonial-text">${t.text}</p>
        <div class="testimonial-author">
          <div class="testimonial-avatar">${t.avatar}</div>
          <div>
            <div class="testimonial-name">${t.name}</div>
            <div class="testimonial-role">${t.role} @ ${t.company}</div>
          </div>
        </div>
      </div>
    `).join('');

    initScrollAnimations();
  }

  /* ──────────────────────────────────────────────────────────
     12. TICKER — dynamic from JSON
     ────────────────────────────────────────────────────────── */
  function renderTickerFromData() {
    const track = document.getElementById('ticker-track');
    if (!track || !portfolioData || !portfolioData.ticker_items) return;

    const items = [...portfolioData.ticker_items, ...portfolioData.ticker_items]; // duplicate for seamless loop
    track.innerHTML = items.map(item => `<span class="ticker-item">${item}</span>`).join('');
  }

  /* ──────────────────────────────────────────────────────────
     13. HOLOGRAPHIC ID CARD TILT EFFECT — 3D perspective
     ────────────────────────────────────────────────────────── */
  function initCardTilt() {
    const card = document.querySelector('.id-card');
    if (!card) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top  + rect.height / 2;
      const rotateX = ((e.clientY - centerY) / (rect.height / 2)) * -8;
      const rotateY = ((e.clientX - centerX) / (rect.width  / 2)) * 8;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
      setTimeout(() => { card.style.transition = ''; }, 600);
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s linear';
    });
  }

  /* ──────────────────────────────────────────────────────────
     14. SERVICE CARDS — mouse tracking spotlight
     ────────────────────────────────────────────────────────── */
  function initServiceSpotlight() {
    const cards = document.querySelectorAll('.service-card');
    if (!cards.length) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width)  * 100;
        const y = ((e.clientY - rect.top)  / rect.height) * 100;
        card.style.setProperty('--mouse-x', x + '%');
        card.style.setProperty('--mouse-y', y + '%');
      });
    });
  }

  /* ──────────────────────────────────────────────────────────
     15. BACK LINK HOVER
     ────────────────────────────────────────────────────────── */
  function initBackLink() {
    const backLink = document.getElementById('back-link');
    if (!backLink) return;
    backLink.addEventListener('mouseenter', () => { backLink.style.color = 'var(--bio-cyan)'; });
    backLink.addEventListener('mouseleave', () => { backLink.style.color = ''; });
  }

  /* ──────────────────────────────────────────────────────────
     16. STATS — render from JSON
     ────────────────────────────────────────────────────────── */
  function renderStatsFromData() {
    const container = document.getElementById('hero-stats');
    if (!container || !portfolioData || !portfolioData.stats) return;

    container.innerHTML = portfolioData.stats.map((s, i) => `
      <div class="stat-card fade-up delay-${i + 1}">
        <span class="stat-number" data-target="${s.number}" data-suffix="${s.suffix}">0${s.suffix}</span>
        <span class="stat-label">${s.label}</span>
      </div>
    `).join('');

    initCounters();
    initScrollAnimations();
  }

  /* ──────────────────────────────────────────────────────────
     INIT — Boot sequence
     ────────────────────────────────────────────────────────── */
  async function init() {
    // Always init these immediately (they don't need data)
    initBioCanvas();
    initCursor();
    initNav();
    initTyping();
    initScrollAnimations();
    initCounters();
    initSkillBars();
    initCardTilt();
    initServiceSpotlight();
    initBackLink();

    // Load JSON data, then render dynamic parts — BUT only if the server
    // hasn't already rendered them (SSR via fillPage). This avoids a
    // visible re-render flash and double work.
    await loadPortfolioData();

    if (portfolioData) {
      const needsRender = (id) => {
        const el = document.getElementById(id);
        // Empty or still showing a RENDER marker => not SSR-filled.
        return el && (el.children.length === 0 || /RENDER:/.test(el.innerHTML));
      };

      if (needsRender('ticker-track')) renderTickerFromData();
      if (needsRender('project-list')) renderProjectsFromData();
      if (needsRender('hero-stats')) renderStatsFromData();
      if (needsRender('skill-bars-container') || needsRender('skill-cloud-container')) renderSkillsFromData();
      if (needsRender('testimonials-container')) renderTestimonialsFromData();
    }

    // Modal is wired to project-items; re-bind even if SSR rendered them.
    initModal();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
