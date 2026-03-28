#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_NAME="${PROJECT_NAME:-image-background-remover}"
REPO_OWNER="${REPO_OWNER:-zzymr}"
REPO_NAME="${REPO_NAME:-image-background-remover}"
PRODUCTION_BRANCH="${PRODUCTION_BRANCH:-master}"
CF_COMPATIBILITY_DATE="${CF_COMPATIBILITY_DATE:-2026-03-21}"
NODE_VERSION="${NODE_VERSION:-20}"
API_BASE="https://api.cloudflare.com/client/v4"

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

REMOVE_BG_API_KEY="${REMOVE_BG_API_KEY:-${REMOVEBG_API_KEY:-}}"

: "${CLOUDFLARE_API_TOKEN:?Missing CLOUDFLARE_API_TOKEN. Put it in .env.cloudflare.local or export it first.}"
: "${CLOUDFLARE_ACCOUNT_ID:?Missing CLOUDFLARE_ACCOUNT_ID. Put it in .env.cloudflare.local or export it first.}"
: "${CLOUDFLARE_D1_DATABASE_ID:?Missing CLOUDFLARE_D1_DATABASE_ID. Put it in .env.local or export it first.}"
: "${REMOVE_BG_API_KEY:?Missing REMOVE_BG_API_KEY. Put it in .env.local or export it first.}"

cloudflare_api() {
  local method="$1"
  local endpoint="$2"
  local data="${3:-}"

  if [[ -n "$data" ]]; then
    curl -fsS -X "$method" \
      -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
      -H "Content-Type: application/json" \
      -d "$data" \
      "$API_BASE$endpoint"
  else
    curl -fsS -X "$method" \
      -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
      -H "Content-Type: application/json" \
      "$API_BASE$endpoint"
  fi
}

echo "🚀 Configuring Cloudflare Pages native GitHub integration"
echo "   Project: $PROJECT_NAME"
echo "   Repo: $REPO_OWNER/$REPO_NAME"
echo "   Branch: $PRODUCTION_BRANCH"
echo

GITHUB_REPO_JSON="$(curl -fsS "https://api.github.com/repos/$REPO_OWNER/$REPO_NAME")"
REPO_ID="$(node -p "JSON.parse(process.argv[1]).id" "$GITHUB_REPO_JSON")"
OWNER_ID="$(node -p "JSON.parse(process.argv[1]).owner.id" "$GITHUB_REPO_JSON")"

if cloudflare_api "GET" "/accounts/$CLOUDFLARE_ACCOUNT_ID/pages/projects/$PROJECT_NAME" >/dev/null 2>&1; then
  echo "ℹ️  Pages project already exists"
else
  CREATE_PAYLOAD="$(cat <<JSON
{
  \"name\": \"$PROJECT_NAME\",
  \"production_branch\": \"$PRODUCTION_BRANCH\",
  \"source\": {
    \"type\": \"github\",
    \"config\": {
      \"owner\": \"$REPO_OWNER\",
      \"owner_id\": \"$OWNER_ID\",
      \"repo_name\": \"$REPO_NAME\",
      \"repo_id\": \"$REPO_ID\",
      \"production_branch\": \"$PRODUCTION_BRANCH\",
      \"deployments_enabled\": true,
      \"production_deployments_enabled\": true,
      \"preview_deployment_setting\": \"all\",
      \"pr_comments_enabled\": true
    }
  }
}
JSON
)"
  cloudflare_api "POST" "/accounts/$CLOUDFLARE_ACCOUNT_ID/pages/projects" "$CREATE_PAYLOAD" >/dev/null
  echo "✅ Pages project created"
fi

echo "⚙️  Applying build settings and environment variables"
PATCH_PAYLOAD="$(cat <<JSON
{
  \"build_config\": {
    \"build_command\": \"npm run pages:build\",
    \"destination_dir\": \".vercel/output/static\",
    \"root_dir\": \"/\",
    \"build_caching\": true
  },
  \"deployment_configs\": {
    \"preview\": {
      \"compatibility_date\": \"$CF_COMPATIBILITY_DATE\",
      \"compatibility_flags\": [\"nodejs_compat\"],
      \"env_vars\": {
        \"NODE_VERSION\": { \"type\": \"plain_text\", \"value\": \"$NODE_VERSION\" },
        \"REMOVE_BG_API_KEY\": { \"type\": \"secret_text\", \"value\": \"$REMOVE_BG_API_KEY\" },
        \"REMOVEBG_API_KEY\": { \"type\": \"secret_text\", \"value\": \"$REMOVE_BG_API_KEY\" },
        \"CLOUDFLARE_ACCOUNT_ID\": { \"type\": \"secret_text\", \"value\": \"$CLOUDFLARE_ACCOUNT_ID\" },
        \"CLOUDFLARE_D1_DATABASE_ID\": { \"type\": \"secret_text\", \"value\": \"$CLOUDFLARE_D1_DATABASE_ID\" },
        \"CLOUDFLARE_API_TOKEN\": { \"type\": \"secret_text\", \"value\": \"$CLOUDFLARE_API_TOKEN\" }
      }
    },
    \"production\": {
      \"compatibility_date\": \"$CF_COMPATIBILITY_DATE\",
      \"compatibility_flags\": [\"nodejs_compat\"],
      \"env_vars\": {
        \"NODE_VERSION\": { \"type\": \"plain_text\", \"value\": \"$NODE_VERSION\" },
        \"REMOVE_BG_API_KEY\": { \"type\": \"secret_text\", \"value\": \"$REMOVE_BG_API_KEY\" },
        \"REMOVEBG_API_KEY\": { \"type\": \"secret_text\", \"value\": \"$REMOVE_BG_API_KEY\" },
        \"CLOUDFLARE_ACCOUNT_ID\": { \"type\": \"secret_text\", \"value\": \"$CLOUDFLARE_ACCOUNT_ID\" },
        \"CLOUDFLARE_D1_DATABASE_ID\": { \"type\": \"secret_text\", \"value\": \"$CLOUDFLARE_D1_DATABASE_ID\" },
        \"CLOUDFLARE_API_TOKEN\": { \"type\": \"secret_text\", \"value\": \"$CLOUDFLARE_API_TOKEN\" }
      }
    }
  }
}
JSON
)"
cloudflare_api "PATCH" "/accounts/$CLOUDFLARE_ACCOUNT_ID/pages/projects/$PROJECT_NAME" "$PATCH_PAYLOAD" >/dev/null

echo "✅ Project settings updated"

echo "🚀 Triggering deployment"
DEPLOY_JSON="$(cloudflare_api "POST" "/accounts/$CLOUDFLARE_ACCOUNT_ID/pages/projects/$PROJECT_NAME/deployments")"
DEPLOY_ID="$(node -p "JSON.parse(process.argv[1]).result.id" "$DEPLOY_JSON")"
DEPLOY_URL="$(node -p "JSON.parse(process.argv[1]).result.url || ''" "$DEPLOY_JSON")"

echo "✅ Deployment triggered"
echo "   deployment_id: $DEPLOY_ID"
if [[ -n "$DEPLOY_URL" ]]; then
  echo "   deployment_url: $DEPLOY_URL"
fi
