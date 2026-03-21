#!/usr/bin/env bash

# Direct upload fallback for Cloudflare Pages.
# For native GitHub integration, use ./deploy-api.sh.

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_NAME="${PROJECT_NAME:-image-background-remover}"
BRANCH="${BRANCH:-master}"

load_env_file() {
  local file="$1"
  if [[ -f "$file" ]]; then
    set -a
    # shellcheck disable=SC1090
    source "$file"
    set +a
  fi
}

load_env_file "$ROOT_DIR/.env.cloudflare.local"
load_env_file "$ROOT_DIR/.env.local"

: "${CLOUDFLARE_API_TOKEN:?Missing CLOUDFLARE_API_TOKEN. Put it in .env.cloudflare.local or export it first.}"
: "${CLOUDFLARE_ACCOUNT_ID:?Missing CLOUDFLARE_ACCOUNT_ID. Put it in .env.cloudflare.local or export it first.}"
: "${REMOVEBG_API_KEY:?Missing REMOVEBG_API_KEY. Put it in .env.local or export it first.}"

export CLOUDFLARE_API_TOKEN
export CLOUDFLARE_ACCOUNT_ID

echo "🚀 Cloudflare Pages direct upload"
echo "   Project: $PROJECT_NAME"
echo "   Branch:  $BRANCH"
echo

cd "$ROOT_DIR"

echo "📦 Installing dependencies"
npm install

echo

echo "🔨 Building with next-on-pages"
npm run pages:build

echo

echo "🔐 Updating Pages secret"
printf '%s' "$REMOVEBG_API_KEY" | wrangler pages secret put REMOVEBG_API_KEY --project-name="$PROJECT_NAME"

echo

echo "🚀 Uploading build output"
wrangler pages deploy .vercel/output/static --project-name="$PROJECT_NAME" --branch="$BRANCH" --commit-dirty=true

echo

echo "✅ Done"
echo "   Project URL: https://$PROJECT_NAME.pages.dev"
