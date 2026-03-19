#!/bin/bash

# Cloudflare Pages API 部署脚本
# 直接使用 Cloudflare API 进行部署

set -e

# 配置变量
CLOUDFLARE_API_TOKEN="cfat_72QqRNLQVi3DwyB8IE8ffwChfi17I6Mjw48IbdnP99dd2d75"
CLOUDFLARE_ACCOUNT_ID="1fb8a978707359a5a4e3aba59e57ba01"
PROJECT_NAME="image-background-remover"
REPO_OWNER="zzymr"
REPO_NAME="image-background-remover"
REMOVEBG_API_KEY="KSCdv2AtnnaoSdUYEaN6wudp"

API_BASE="https://api.cloudflare.com/client/v4"

echo "🚀 Cloudflare Pages API 部署"
echo "================================"
echo ""

# API 辅助函数
cloudflare_api() {
    local method=$1
    local endpoint=$2
    local data=$3
    
    if [ -n "$data" ]; then
        curl -s -X "$method" \
            -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
            -H "Content-Type: application/json" \
            -d "$data" \
            "$API_BASE$endpoint"
    else
        curl -s -X "$method" \
            -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
            -H "Content-Type: application/json" \
            "$API_BASE$endpoint"
    fi
}

echo "📝 配置信息:"
echo "  - Account: $CLOUDFLARE_ACCOUNT_ID"
echo "  - Project: $PROJECT_NAME"
echo "  - Repo: $REPO_OWNER/$REPO_NAME"
echo ""

# 步骤 1: 获取现有项目
echo "🔍 检查现有项目..."
GET_PROJECTS_RESPONSE=$(cloudflare_api "GET" "/accounts/$CLOUDFLARE_ACCOUNT_ID/pages/projects")

PROJECT_EXISTS=$(echo "$GET_PROJECTS_RESPONSE" | grep -o "\"name\":\"$PROJECT_NAME\"" | wc -l)

if [ "$PROJECT_EXISTS" -eq 0 ]; then
    echo "ℹ️  项目不存在，需要手动创建"
    echo ""
    echo "📋 请在 Cloudflare Dashboard 创建项目："
    echo "  1. 访问: https://dash.cloudflare.com"
    echo "  2. 进入 Workers & Pages"
    echo "  3. Create a project → Connect to Git"
    echo "  4. 选择仓库: $REPO_OWNER/$REPO_NAME"
    echo "  5. Project name: $PROJECT_NAME"
    echo "  6. Build command: npm run build"
    echo "  7. Build output directory: .next"
    echo "  8. Save and Deploy"
    echo ""
    echo "创建完成后，运行此脚本设置环境变量"
    exit 0
else
    echo "✅ 项目已存在"
fi

echo ""

# 步骤 2: 获取项目 ID
echo "🔍 获取项目 ID..."
PROJECT_ID=$(echo "$GET_PROJECTS_RESPONSE" | grep -o "\"name\":\"$PROJECT_NAME\",\"id\":\"[^\"]*\"" | grep -o "\"id\":\"[^\"]*\"" | cut -d'"' -f4)

if [ -z "$PROJECT_ID" ]; then
    echo "❌ 无法获取项目 ID"
    exit 1
fi

echo "✅ 项目 ID: $PROJECT_ID"
echo ""

# 步骤 3: 设置环境变量
echo "🔐 设置环境变量..."

# 检查环境变量是否已存在
GET_ENV_VARS_RESPONSE=$(cloudflare_api "GET" "/accounts/$CLOUDFLARE_ACCOUNT_ID/pages/projects/$PROJECT_ID/env_vars/production")

ENV_EXISTS=$(echo "$GET_ENV_VARS_RESPONSE" | grep -o "\"name\":\"REMOVEBG_API_KEY\"" | wc -l)

if [ "$ENV_EXISTS" -eq 1 ]; then
    echo "ℹ️  环境变量已存在，更新中..."
    # 先删除旧的
    cloudflare_api "DELETE" "/accounts/$CLOUDFLARE_ACCOUNT_ID/pages/projects/$PROJECT_ID/env_vars/production/REMOVEBG_API_KEY" > /dev/null
fi

# 创建新的环境变量
SET_ENV_RESPONSE=$(cloudflare_api "POST" "/accounts\
/$CLOUDFLARE_ACCOUNT_ID/pages/projects/$PROJECT_ID/env_vars/production" \
    "{\"name\":\"REMOVEBG_API_KEY\",\"value\":\"$REMOVEBG_API_KEY\"}")

if echo "$SET" | grep -q "success"; then
    echo "✅ 环境变量设置成功"
else
    echo "⚠️  环境变量设置可能失败，请检查 Dashboard"
fi

echo ""

# 步骤 4: 触发部署
echo "🚀 触发部署..."
DEPLOY_RESPONSE=$(cloudflare_api "POST" "/accounts/$CLOUDFLARE_ACCOUNT_ID/pages/projects/$PROJECT_ID/deployments")

if echo "$DEPLOY_RESPONSE" | grep -q "success"; then
    echo "✅ 部署触发成功"
    
    # 获取部署 URL
    DEPLOY_URL=$(echo "$DEPLOY_RESPONSE" | grep -o "\"url\":\"[^\"]*\"" | head -1 | cut -d'"' -f4)
    if [ -n "$DEPLOY_URL" ]; then
        echo "📱 部署 URL: $DEPLOY_URL"
    fi
else
    echo "⚠️  部署触发可能失败"
fi

echo ""
echo "✅ 配置完成！"
echo ""
echo "📋 下一步:"
echo "  1. 访问 Cloudflare Dashboard"
echo "  2. 验证环境变量: REMOVEBG_API_KEY = $REMOVEBG_API_KEY"
echo "  3. 检查部署状态"
echo "  4. 访问应用: https://$PROJECT_NAME.pages.dev"
echo ""
echo "🔧 管理控制台:"
echo "  - Dashboard: https://dash.cloudflare.com\
"
echo "  - 项目: https://dash.cloudflare.com/$CLOUDFLARE_ACCOUNT_ID/pages/view/$PROJECT_NAME"
echo ""
