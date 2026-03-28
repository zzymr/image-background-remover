# D1 Data Layer

This project uses **Cloudflare D1** to persist processing history for the background-removal workflow.

## What is stored

The `processing_jobs` table captures one row per image processing job:

- `id` — UUID for the job
- `session_id` — anonymous client session identifier stored in the browser
- `source_filename` — uploaded file name
- `mime_type` — uploaded file MIME type
- `file_size` — original file size in bytes
- `output_bytes` — processed image size in bytes
- `status` — `processing`, `completed`, or `failed`
- `error_message` — error text when a job fails
- `credits_charged` — currently `1` for each completed image
- `provider` — currently `remove.bg`
- `created_at` / `updated_at` — timestamps

## Why REST API instead of a Worker binding?

This app is written as a Next.js application. To keep the code portable across environments, D1 is accessed through the **Cloudflare D1 REST API** from the server-side route handlers.

That means the app can still run in a normal Node environment while using a real D1 database.

## Required environment variables

Add these values to your deployment environment:

```bash
REMOVE_BG_API_KEY=your_remove_bg_api_key_here
REMOVE_BG_API_URL=https://api.remove.bg/v1.0/removebg

CLOUDFLARE_ACCOUNT_ID=your_cloudflare_account_id
CLOUDFLARE_D1_DATABASE_ID=your_d1_database_id
CLOUDFLARE_API_TOKEN=your_cloudflare_api_token
```

The API token must be allowed to query the target D1 database.

## Migration

Apply the migration in `migrations/0002_processing_history.sql`.

Example with Wrangler:

```bash
npx wrangler d1 execute <your-database-name> --file migrations/0002_processing_history.sql
```

You can also run the SQL directly in the Cloudflare dashboard.

## Runtime behavior

- `POST /api/remove-background`
  - creates a processing job when a client session id is provided
  - marks the job completed or failed after remove.bg returns
- `GET /api/history`
  - returns recent jobs and aggregate usage for the current session

## Graceful fallback

If D1 is not configured, the app still processes images normally.

In that case:
- image background removal still works
- history UI stays visible
- the UI explains that D1 environment variables are missing
