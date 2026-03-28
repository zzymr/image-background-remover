# Ethereal Cutout

Premium AI background removal built with **Next.js 14**, **remove.bg**, and a **Cloudflare D1-backed processing history** layer.

This project started as a simple upload-and-process demo and has been refactored into a more complete product experience with:

- a redesigned editorial-style homepage
- a dedicated `/pricing` page
- pay-as-you-go and monthly credits pricing
- a D1-backed history panel for processed jobs

## Features

- AI background removal using remove.bg
- Premium landing page and product shell
- Dedicated pricing page with approved USD pricing
- Anonymous session-based processing history stored in Cloudflare D1
- Transparent PNG download after processing
- Responsive layout for desktop and mobile

## Pricing implemented

### Monthly subscription
- Lite — 40 credits / month — **$9.99**
- Pro — 200 credits / month — **$42.99**
- Volume+ — 500 credits / month — **$94.99**

### Pay as you go
- 3 credits — **$3.49**
- 10 credits — **$9.99**
- 75 credits — **$54.99**
- 200 credits — **$109.99**

## Quick start

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env.local
```

Then fill in:

```bash
REMOVE_BG_API_KEY=your_remove_bg_api_key_here
REMOVE_BG_API_URL=https://api.remove.bg/v1.0/removebg

CLOUDFLARE_ACCOUNT_ID=your_cloudflare_account_id
CLOUDFLARE_D1_DATABASE_ID=your_d1_database_id
CLOUDFLARE_API_TOKEN=your_cloudflare_api_token
```

### 3. Run the app

```bash
npm run dev
```

Open `http://localhost:3000`.

## D1 migration

Apply the processing history schema before expecting persistent history:

```bash
npx wrangler d1 execute <your-database-name> --file migrations/0002_processing_history.sql
```

If D1 is not configured yet, the app still works for background removal — only the persistent history layer is disabled.

## Project structure

```bash
app/
  api/
    history/route.ts
    remove-background/route.ts
  pricing/page.tsx
  globals.css
  layout.tsx
  page.tsx
components/
  pricing/PricingGrid.tsx
  site/SiteHeader.tsx
  site/SiteFooter.tsx
  BeforeAfterCompare.tsx
  BrandMark.tsx
  ImageUploader.tsx
  ProcessingHistory.tsx
  ProcessingResult.tsx
lib/
  d1.ts
  pricing.ts
  processing-history.ts
migrations/
  0002_processing_history.sql
docs/
  D1_DATA_LAYER.md
```

## API routes

### `POST /api/remove-background`
Processes an uploaded image with remove.bg and returns a transparent PNG as a base64 data URL.

### `GET /api/history?sessionId=...`
Returns recent processing history and usage summary for the current anonymous session.

## Notes on D1 integration

This project uses the **Cloudflare D1 REST API** from Next.js route handlers instead of a Worker binding. That keeps the app easier to run in a standard Node-based deployment while still connecting to a real D1 database.

More detail: `docs/D1_DATA_LAYER.md`
