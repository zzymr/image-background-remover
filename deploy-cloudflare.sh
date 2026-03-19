#!/bin/bash

# Cloudflare Pages 自动部署脚本
# 使用 Cloudflare API Token 和 Account ID

set -e

# 配置变量
CLOUDFLARE_API_TOKEN="cfat_72QqRNLQVi3DwyB8IE8ffwChfi17I6Mjw48IbdnP99dd2d75"
CLOUDFLARE_ACCOUNT_ID="1fb8a978707359a5a4e3aba59e57ba01"
PROJECT_NAME="image-background-remover"
REPO_URL="https://github.com/zzymr/image-background-remover.git"
REMOVEBG_API_KEY="KSCdv2AtnnaoSdUYEaN6wudp"

echo "🚀 Cloudflare Pages 自动部署脚本"
echo "=================================="
echo ""

# 检查 wrangler 是否安装
if ! command -v wrangler &> /dev/null; then
    echo "⚠️  Wrangler 未安装，正在安装..."
    npm install -g wrangler
fi

echo "✅ Wrangler 已安装"
echo ""

# 设置 API Token
export CLOUDFLARE_API_TOKEN=$CLOUDFLARE_API_TOKEN
export CLOUDFLARE_ACCOUNT_ID=$CLOUDFLARE_ACCOUNT_ID

echo "📝 项目信息:"
echo "  - 项目名称: $PROJECT_NAME"
echo "  - 仓库: $REPO_URL"
echo "  - Account ID: $CLOUDFLARE_ACCOUNT_ID"
echo ""

# 进入项目目录
cd /root/.openclaw/workspace-coder/image-background-remover

echo "📦 安装依赖..."
npm install
echo ""

echo "🔨 构建项目..."
npm run build
echo ""

echo "🚀 部署到 Cloudflare Pages..."
wrangler pages deploy .next \
    --project-name=$PROJECT_NAME \
    --branch=master \
    --commit-dirty=true
echo ""

echo "🔐 设置环境变量..."
echo "  设置 REMOVEBG_API_KEY..."
wrangler pages secret put REMOVEBG_API_KEY \
    --project-name=$PROJECT_NAME \
    --environment=production << EOF
$REMOVEBG_API_KEY
EOF

echo ""
echo "✅ 部署完成！"
echo ""
echo "📱 访问地址:"
echo "  - 预览: https://$PROJECT_NAME.pages.dev"
echo ""
echo "🔧 下一步:"
echo "  1. 访问 Cloudflare Dashboard"
echo "  2. 验证环境变量已设置"
echo "  3. 测试应用功能"
echo ""
