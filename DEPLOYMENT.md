# Deployment Guide

## Quick Deploy to Vercel (Recommended)

### Option 1: Vercel CLI
```bash
npm install -g vercel
vercel
```

### Option 2: Vercel Dashboard
1. Push your code to GitHub
2. Go to https://vercel.com
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will auto-detect Next.js and deploy

## Deploy to Netlify

### Option 1: Netlify CLI
```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod
```

### Option 2: Netlify Dashboard
1. Push your code to GitHub
2. Go to https://netlify.com
3. Click "Add new site"
4. Import from GitHub
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`

## Deploy to Other Hosting

### Requirements
- Node.js 18+ support
- npm or yarn

### Build Steps
```bash
# Install dependencies
npm install

# Build for production
npm run build

# Start production server
npm start
```

The production server will run on port 3000 by default.

## Environment Variables

Currently, the application doesn't require any environment variables. If you add API keys or secrets in the future, create a `.env.local` file:

```
# Example
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

## Custom Domain

After deployment, you can add a custom domain in your hosting provider's dashboard:

1. Add your domain in the dashboard
2. Update DNS records at your domain registrar
3. Wait for DNS propagation (up to 48 hours)

## Post-Deployment Checklist

- [ ] Test the deployed website
- [ ] Verify all pages load correctly
- [ ] Check responsive design on mobile
- [ ] Test all links and navigation
- [ ] Verify SEO tags (use tools like https://metatags.io)
- [ ] Check performance with Lighthouse
- [ ] Test social media sharing (Open Graph)
- [ ] Submit sitemap to Google Search Console

## Performance Optimization

The website is already optimized with:
- Static page generation
- Optimized images (if added)
- Code splitting
- CSS optimization with Tailwind
- Font optimization

## Monitoring

Consider adding:
- Google Analytics
- Google Search Console
- Vercel Analytics (if using Vercel)

## Support

For issues or questions:
- Check Next.js documentation: https://nextjs.org/docs
- Check the README.md file
- Review progres.md for implementation details
