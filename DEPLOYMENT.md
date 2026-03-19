# Deployment Guide

## Cloudflare Pages Deployment

This guide walks you through deploying your Image Background Remover to Cloudflare Pages for free hosting with edge performance.

### Prerequisites

1. [Remove.bg API Key](https://www.remove.bg/api)
2. [Cloudflare Account](https://dash.cloudflare.com/sign-up)
3. [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)

### Step 1: Install Wrangler

```bash
npm install -g wrangler
```

### Step 2: Login to Cloudflare

```bash
wrangler login
```

This will open a browser window where you can authorize Wrangler.

### Step 3: Configure Project

Create a `wrangler.toml` file in your project root:

```toml
name = "image-background-remover"
compatibility_date = "2024-01-01"
compatibility_flags = ["nodejs_compat"]

[env.production]
routes = [
  { pattern = "your-domain.com/*", zone_name = "your-domain.com" }
]

[vars]
# Environment variables are set in Cloudflare Dashboard
```

### Step 4: Set Environment Variables

There are two ways to set your API key:

**Option A: Via Cloudflare Dashboard**

1. Go to your Cloudflare Dashboard
2. Navigate to Workers & Pages
3. Click on your project
4. Go to Settings → Variables and Secrets
5. Add:
   - Variable name: `REMOVEBG_API_KEY`
   - Value: Your Remove.bg API key

**Option B: Via Wrangler (less secure, not recommended for production)**

```bash
wrangler secret put REMOVEBG_API_KEY
```

### Step 5: Deploy

Build and deploy your project:

```bash
npm run build
wrangler pages deploy .env
```

Or use the create command (first time):

```bash
wrangler pages project create image-background-remover
wrangler pages deploy .env
```

### Step 6: Access Your Site

After deployment, Wrangler will provide a URL like:
```
https://image-background-remover.pages.dev
```

You can also:
- Add a custom domain in Cloudflare Dashboard
- Configure DNS for your own domain

## Vercel Deployment

### Prerequisites

1. Remove.bg API Key
2. GitHub account (for automatic deployments)

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/your-username/image-background-remover.git
git push -u origin main
```

### Step 2: Import to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure settings:
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
5. Add Environment Variables:
   - Name: `REMOVEBG_API_KEY`
   - Value: Your API key
6. Click "Deploy"

### Step 3: Custom Domain (Optional)

1. Go to project settings
2. Add domain
3. Update DNS records as instructed

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `REMOVEBG_API_KEY` | Your Remove.bg API key | Yes |

## Edge Runtime Notes

This project uses Next.js Edge Runtime for optimal performance:

- ✅ Fast cold starts
- ✅ Global edge deployment
- ✅ Low latency
- ⚠️ Limited Node.js APIs

If you encounter issues with Edge Runtime, switch to Node runtime:

```typescript
// In app/api/remove-bg/route.ts
export const runtime = 'nodejs'; // Changed from 'edge'
```

## Monitoring & Analytics

### Cloudflare

- Real-time logs in Dashboard
- Analytics for requests and errors
- Web Application Firewall (optional)

### Vercel

- Built-in analytics
- Real-time logs
- Performance monitoring
- Error tracking

## Troubleshooting

### "Remove.bg API key not configured"

- Verify environment variable is set
- Check variable name matches exactly
- For Cloudflare: Wait a few minutes for propagation

### "File too large" error

- Default limit: 10MB
- Adjust in `app/api/remove-bg/route.ts`:
  ```typescript
  const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
  ```

### "Free API quota exhausted"

- Remove.bg free tier: 50 credits/month
- Upgrade to paid plan or wait for monthly reset
- Monitor usage in Remove.bg dashboard

### Edge runtime errors

- Check if using Node.js-specific APIs
- Switch to Node runtime if needed
- Review Edge Runtime limitations

## Performance Optimization

### Caching

Next.js automatically caches API responses. To disable:

```typescript
export const dynamic = 'force-dynamic';
```

### Image Optimization

Use Next.js Image component for automatic optimization:

```typescript
import Image from 'next/image';

<Image
  src={processedImage}
  alt="Processed"
  width={800}
  height={600}
  priority
/>
```

## Security Best Practices

1. **Never commit API keys** to Git
2. **Use environment variables** for secrets
3. **Rate limiting** - Remove.bg has built-in limits
4. **Input validation** - File type and size checks
5. **HTTPS only** - Automatic on Cloudflare/Vercel

## Cost Monitoring

### Remove.bg

- Free tier: 50 credits/month
- Monitor usage: https://www.remove.bg/dashboard
- Set up alerts for low credits

### Cloudflare

- Free tier: 100,000 requests/day
- Check usage in Dashboard
- Upgrade if needed

### Vercel

- Free tier: 100GB bandwidth/month
- Hobby plan: $20/month
- Pro plan: $40/month

---

Need help? Check the [README.md](README.md) or open an issue on GitHub.
