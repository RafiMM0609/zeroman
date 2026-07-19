## Variant: Technical Proof — Mobile-First

### Design stance
Same utilitarian, evidence-first philosophy as 002, but **architected for mobile first**. Every decision starts at 320px: touch targets, thumb zones, vertical stack, progressive enhancement up to desktop.

### Key choices
- **Layout**: Single-column mobile, 2-col tablet (≥480px/768px), 3-4 col desktop (≥1024px). All grids collapse gracefully.
- **Navigation**: Hamburger drawer on mobile (slide-in from right, backdrop overlay, trap focus, ESC to close), inline desktop nav at ≥768px.
- **Typography**: Fluid scale via clamp-ish media queries — 3xl→6xl hero, base→lg body. Code blocks at 12px mobile, horizontal scroll with momentum.
- **Touch targets**: All buttons/links ≥48×48px. Cards full-width tap zones. Generous padding (16px mobile → 32px desktop).
- **Interaction**: Drawer animation (cubic-bezier), card hover only on `@media (hover: hover)`, terminal cursor blink, scroll reveals.
- **Safe areas**: `env(safe-area-inset-*)` for notched devices.
- **Reduced motion**: `@media (prefers-reduced-motion)` disables all transitions.

### Trade-offs
- **Strong at**: Mobile conversion (most traffic), accessibility, performance (no desktop-only CSS), thumb-friendly CTA placement
- **Weak at**: Dense scanning on desktop (mitigated by 3-col grid), code block horizontal scroll on narrow screens

### Best for
- Engineers who browse on phone first (most do)
- SEO/performance — mobile-first is Google's indexing baseline
- International audiences where mobile is primary device
- Proving you *practice* what you preach: production systems work on mobile