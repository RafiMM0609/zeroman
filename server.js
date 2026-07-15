const http = require('http');
const fs = require('fs');
const path = require('path');
const { error } = require('console');

// Where inbound contact messages are persisted (one JSON array, appended).
const DATA_DIR = path.join(__dirname, 'data');
const MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');
// Single source of truth for project content.
const PORTFOLIO_FILE = path.join(__dirname, 'public', 'data', 'portfolio.json');

// Escape user-supplied text before injecting into an HTML response (XSS guard).
function escapeHtml(str) {
  return String(str == null ? '' : str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Load projects from the single JSON source. Returns { byId, data } or null.
// `data` is the full portfolio object (stats/services/projects/...); `byId`
// is a project-id -> project lookup used by the /project route.
function loadPortfolio() {
  try {
    const raw = fs.readFileSync(PORTFOLIO_FILE, 'utf-8');
    const data = JSON.parse(raw);
    const byId = {};
    (data.projects || []).forEach(p => { byId[p.id] = p; });
    return { byId, data };
  } catch (e) {
    console.error('Failed to load portfolio.json:', e.message);
    return null;
  }
}

// Build the placeholder replacement map for project.html from a JSON project.
function projectReplacements(p) {
  const tagHtml = (p.tags || [])
    .map(t => `<span class="tag">${escapeHtml(t)}</span>`)
    .join('');
  return {
    title: escapeHtml(p.title),
    description: escapeHtml(p.short_desc || ''),
    tags: tagHtml,
    details: escapeHtml(p.full_desc || ''),
    year: escapeHtml(p.year || '2026'),
    status: escapeHtml(p.status || 'complete')
    };
    }

    // ─── Page section renderers (single source: portfolio.json) ───────────────
    // These mirror the client-side render in main.js so SSR output and the
    // no-JS fallback look identical. All text is escaped.
    const STATUS_LABEL = { live: 'Live', complete: 'Complete', client: 'Client Work' };

    function renderStats(d) {
    return (d.stats || []).map((s, i) =>
    `<div class="stat-card fade-up delay-${i + 1}">
    <span class="stat-number" data-target="${escapeHtml(s.number)}" data-suffix="${escapeHtml(s.suffix)}">0${escapeHtml(s.suffix)}</span>
    <span class="stat-label">${escapeHtml(s.label)}</span>
    </div>`).join('');
    }

    function renderTicker(d) {
    const items = d.ticker_items || [];
    const all = [...items, ...items]; // duplicate for seamless loop
    return all.map(item => `<span class="ticker-item">${escapeHtml(item)}</span>`).join('');
    }

    function renderServices(d) {
    return (d.services || []).map((s, i) =>
    `<div class="service-card fade-up${i ? ' delay-' + i : ''}" id="service-${escapeHtml(s.id)}">
    <div class="service-icon-wrap">${escapeHtml(s.icon)}</div>
    <h3 class="service-title">${escapeHtml(s.title)}</h3>
    <p class="service-subtitle">${escapeHtml(s.subtitle)}</p>
    <p class="service-desc">${escapeHtml(s.desc)}</p>
    <ul class="service-features">
      ${(s.features || []).map(f => `<li>${escapeHtml(f)}</li>`).join('')}
    </ul>
    </div>`).join('');
    }

    function renderProjects(d) {
    return (d.projects || []).map(p =>
    `<div class="project-item fade-up" data-href="/project?id=${escapeHtml(p.id)}" role="link" tabindex="0">
    <div class="project-num">${escapeHtml(p.num)}</div>
    <div class="project-info">
      <h3 class="project-name">${escapeHtml(p.title)}</h3>
      <p class="project-desc">${escapeHtml(p.short_desc)}</p>
      <div class="project-meta">
        <div class="project-tags">
          ${(p.tags || []).slice(0, 4).map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('')}
        </div>
        <span class="project-status ${escapeHtml(p.status)}">${STATUS_LABEL[p.status] || escapeHtml(p.status)}</span>
      </div>
    </div>
    <div class="project-arrow">↗</div>
    </div>`).join('');
    }

    function renderTestimonials(d) {
    return (d.testimonials || []).map((t, i) =>
    `<div class="testimonial-card fade-up delay-${i + 1}">
    <div class="testimonial-stars">${'<span>★</span>'.repeat(t.rating || 5)}</div>
    <p class="testimonial-text">${escapeHtml(t.text)}</p>
    <div class="testimonial-author">
      <div class="testimonial-avatar">${escapeHtml(t.avatar)}</div>
      <div>
        <div class="testimonial-name">${escapeHtml(t.name)}</div>
        <div class="testimonial-role">${escapeHtml(t.role)} @ ${escapeHtml(t.company)}</div>
      </div>
    </div>
    </div>`).join('');
    }

    function renderSkillBars(d) {
    return (d.skills || []).slice(0, 8).map(s =>
    `<div class="skill-bar-item fade-up">
    <div class="skill-bar-header">
      <span class="skill-bar-name">${escapeHtml(s.name)}</span>
      <span class="skill-bar-level">${escapeHtml(s.level)}%</span>
    </div>
    <div class="skill-bar-track">
      <div class="skill-bar-fill" data-level="${escapeHtml(s.level)}" style="--glow-color:${escapeHtml(s.glow)}"></div>
    </div>
    </div>`).join('');
    }

    function renderSkillCloud(d) {
    return (d.skills || []).map(s =>
    `<span class="skill-cloud-tag fade-up" data-cat="${escapeHtml(s.category)}">${escapeHtml(s.name)}</span>`).join('');
    }

    function renderTimeline(d) {
    return (d.timeline || []).map(t =>
    `<div class="timeline-item">
    <div class="timeline-dot"></div>
    <div class="timeline-period">${escapeHtml(t.period)}</div>
    <div class="timeline-title">${escapeHtml(t.title)}</div>
    <div class="timeline-sub">${escapeHtml(t.sub)}</div>
    <p class="timeline-desc">${escapeHtml(t.desc)}</p>
    </div>`).join('');
    }

    function renderSocial(d) {
      const p = d.profile || {};
      const gh = p.github ? escapeHtml(p.github) : '#';
      const li = p.linkedin ? escapeHtml(p.linkedin) : '#';
      const em = (p.email ? 'mailto:' + escapeHtml(p.email) : '/contact');
      const ghAttr = p.github ? ' target="_blank" rel="noopener noreferrer"' : '';
      const liAttr = p.linkedin ? ' target="_blank" rel="noopener noreferrer"' : '';
      return `<a href="${gh}" class="social-link" title="GitHub" id="footer-github"${ghAttr}>GH</a>
                        <a href="${li}" class="social-link" title="LinkedIn" id="footer-linkedin"${liAttr}>LI</a>
                        <a href="${em}" class="social-link" title="Email" id="footer-email">✉</a>`;
    }

    // Replace <!--RENDER:key--> markers inside a page template with JSON-driven HTML.
    function fillPage(html, d) {
      const map = {
        stats: renderStats(d),
        ticker: renderTicker(d),
        services: renderServices(d),
        projects: renderProjects(d),
        testimonials: renderTestimonials(d),
        skillbars: renderSkillBars(d),
        skillcloud: renderSkillCloud(d),
        timeline: renderTimeline(d),
        social: renderSocial(d)
      };
      return html.replace(/<!--RENDER:(\w+)-->/g, (m, key) => (key in map ? map[key] : m));
    }

    const server = http.createServer((req, res) => {
    if (req.url === '/send-message' && req.method === 'POST') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            const urlParams = new URLSearchParams(body);
            const name    = urlParams.get('name')    || 'Anonim';
            const message = urlParams.get('message') || '';
            const email   = urlParams.get('email')   || '';
            const budget  = urlParams.get('budget')  || 'Tidak disebutkan';

            // Persist the message so it actually reaches the owner (not lost).
            try {
                fs.mkdirSync(DATA_DIR, { recursive: true });
                let existing = [];
                if (fs.existsSync(MESSAGES_FILE)) {
                    try { existing = JSON.parse(fs.readFileSync(MESSAGES_FILE, 'utf-8')); }
                    catch (_) { existing = []; }
                }
                if (!Array.isArray(existing)) existing = [];
                existing.push({
                    receivedAt: new Date().toISOString(),
                    name, email, budget, message
                });
                fs.writeFileSync(MESSAGES_FILE, JSON.stringify(existing, null, 2), 'utf-8');
            } catch (saveErr) {
                console.error('Failed to save message:', saveErr.message);
                // Still show the success page; persistence is best-effort here.
            }

            fs.readFile(path.join(__dirname, 'views', 'template', 'message.html'), (err, content) => {
                if (err) {
                    res.writeHead(500);
                    res.end(`Server Error : ${err.code}`);
                } else {
                    let data = content.toString();
                    data = data.replace(/\[name\]/g,    escapeHtml(name));
                    data = data.replace(/\[message\]/g, escapeHtml(message));
                    data = data.replace(/\[email\]/g,   escapeHtml(email));
                    data = data.replace(/\[budget\]/g, escapeHtml(budget));
                    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
                    res.end(data, 'utf-8')
                }
            })
        });
        return;
    }


    const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const pathname = parsedUrl.pathname;

    if (pathname === '/project') {
        const portfolio = loadPortfolio();
        const requestedId = parsedUrl.searchParams.get('id');

        // Legacy IDs kept for backward compatibility (old links still resolve).
        const legacyAlias = {
            'portofolio': 'zeroman-portfolio',
            'manajemen-data': 'data-management'
        };
        const projectId = legacyAlias[requestedId] || requestedId;
        const project = portfolio && portfolio.byId[projectId];

        if (!project) {
            fs.readFile(path.join(__dirname, 'views', '404.html'), (err, data) => {
                res.writeHead(404, { 'content-type': 'text/html' });
                res.end(data, 'utf-8');
            });
            return;
        }

        const repl = projectReplacements(project);

        fs.readFile(path.join(__dirname, 'views', 'project.html'), (err, content) => {
            if (err) {
                res.writeHead(500);
                res.end(`Server Error : ${err.code}`);
            } else {
                let data = content.toString();
                data = data.replace(/\[title\]/g,        repl.title);
                data = data.replace(/\[description\]/g,  repl.description);
                data = data.replace(/\[tags\]/g,         repl.tags);
                data = data.replace(/\[details\]/g,      repl.details);
                data = data.replace(/\[year\]/g,         repl.year);
                data = data.replace(/\[status\]/g,       repl.status);
                res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
                res.end(data, 'utf-8');
            }
        });
        return;
    }

    // Pages that should be hydrated from portfolio.json (single source).
    const pageMap = {
      '/':         'index.html',
      '/about':    'about.html',
      '/contact':  'contact.html'
    };
    const pageFile = pageMap[req.url];
    let filePath;
    if (pageFile) {
      filePath = path.join(__dirname, 'views', pageFile);
    } else if (req.url === '/' || req.url === '/about' || req.url === '/contact') {
      filePath = path.join(__dirname, 'views', (req.url === '/' ? 'index' : req.url.slice(1)) + '.html');
    } else if (req.url.startsWith('/public/')) {
      filePath = path.join(__dirname, req.url);
    } else {
      filePath = path.join(__dirname, 'views', '404.html');
    }

    let extname = path.extname(filePath);
    let contentType = 'text/html';

    switch (extname) {
        case '.js':   contentType = 'text/javascript'; break;
        case '.css':  contentType = 'text/css'; break;
        case '.json': contentType = 'application/json'; break;
        case '.png':  contentType = 'image/png'; break;
        case '.jpg':  contentType = 'image/jpeg'; break;
        case '.jpeg': contentType = 'image/jpeg'; break;
        case '.gif':  contentType = 'image/gif'; break;
        case '.webp': contentType = 'image/webp'; break;
        case '.svg':  contentType = 'image/svg+xml'; break;
        case '.ico':  contentType = 'image/x-icon'; break;
        case '.woff2': contentType = 'font/woff2'; break;
    }

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code == 'ENOENT') {
                fs.readFile(path.join(__dirname, 'views', '404.html'), (err, data) => {
                    res.writeHead(404, { 'content-type': 'text/html' });
                    res.end(data, 'utf-8');
                })
            } else {
                res.writeHead(500);
                res.end(`Server Error : ${error.code}`);
            }
        } else {
            // For /, /about, /contact: inject JSON-driven sections server-side.
            if (pageFile) {
                const portfolio = loadPortfolio();
                if (portfolio && portfolio.data) {
                    content = Buffer.from(fillPage(content.toString(), portfolio.data), 'utf-8');
                }
            }
            res.writeHead(200, { 'content-type': contentType });
            res.end(content, 'utf-8')
        }
    });
});

const PORT = 3123;
server.listen(PORT, () => {
    console.log(`Server run at http://0.0.0.0:${PORT}`);
})
