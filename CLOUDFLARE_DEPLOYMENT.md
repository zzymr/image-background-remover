# Cloudflare Pages 部署指南

## 📋 准备工作

### 已配置的凭证
- **Cloudflare API Token:** `cfat_72QqRNLQVi3DwyB8IE8ffwChfi17I6Mjw48IbdnP99dd2d75`
- **Cloudflare Account ID:** `1fb8a978707359a5a4e3aba59e57ba01`
- **Remove.bg API Key:** `KSCdv2AtnnaoSdUYEaN6wudp`

`Project Name:** `image-background-remover`

### 仓库信息
- **GitHub 仓库:** `https://github.com/zzymr/image-background-remover.git`
- **本地路径:** `/root/.openclaw/workspace-coder/image-background-remover`

---

## 🚀 部署方式一：Cloudflare Dashboard（推荐）

### 步骤 1: 访问 Cloudflare Pages

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 进入 **Workers & Pages**
3. 点击 **Create a project**
4. 选择 **Connect to Git**

### 步骤 2: 连接 GitHub 仓库

1. 选择 **GitHub** 账号
2. 选择仓库：`zzymr/image-background-remover`
3. 点击 **Begin setup**

### 步骤 3: 配置构建设置

```
Project name: image-background-remover
Production branch: master

Build settings:
├─ Build command: npm run build
├─ Build output directory: .next
└─ Root directory: /
```

### 步骤 4: 设置环境变量

在 **Environment variables** 部分添加：

| Variable | Value | Environment |
|----------|-------|-------------|
| `REMOVEBG_API_KEY` | `KSCdv2AtnnaoSdUYEaN6wudp` | Production, Preview |

### 步骤 5: 部署

1. 点击 **Save and Deploy**
2. 等待构建完成（约 1-2 分钟）
3. 访问部署的 URL

---

## 🚀 部署方式二：使用 Wrangler CLI

### 步骤 1: 安装 Wrangler

```bash
npm install -g wrangler
```

### 步骤 2: 配置 Wrangler

创建或编辑 `~/.wrangler/config/default.toml`：

```toml
api_token = "cfat_72QqRNLQVi3DwyB8IE8ffwChfi17I6Mjw48IbdnP99dd2d75"
```

### 步骤 3: 登录 Cloudflare

```bash
wrangler login
```

或在配置文件中使用 API Token：

```bash
export CLOUDFLARE_API_TOKEN="cfat_72QqRNLQVi3DwyB8IE8ffwChfi17I6Mjw48IbdnP99dd2d75"
```

### 步骤 4: 创建 Pages 项目

```bash
wrangler pages project create image-background-remover \
  --production-branch=master
```

### 步骤 5: 部署项目

```bash
cd /root/.openclaw/workspace-coder/image-background-remover

# 构建项目
npm run build

# 部署到 Cloudflare Pages
wrangler pages deploy .next \
  --project-name=image-background-remover \
  --branch=master
```

### 步骤 6: 设置环境变量

```bash
# 设置生产环境变量
wrangler pages secret put REMOVEBG_API_KEY \
  --project-name=image-background-remover \
  --environment=production

# 输入：KSCdv2AtnnaoSdUYEaN6wudp
```

---

## 🔧 验证部署

### 检查部署状态

1. 访问 Cloudflare Dashboard
2. 进入 **Workers & Pages** → **image-background-remover**
3. 查看 **Deployments** 标签
4. 确认最新部署状态为 **Success**

### 访问应用

**默认 URL：**
```
https://image-background-remover.pages.dev
```

### 测试功能

1. 打开应用 URL
2. 上传一张图片
3. 点击 "Remove Background"
4. 确认 API 调用成功
5. 下载处理后的图片

---

## 🌐 配置自定义域名（可选）

### 步骤 1: 添加域名

1. 在 Cloudflare Dashboard 中打开项目
2. 进入 **Custom domains**
3. 点击 **Set up a custom domain**
4. 输入域名：`bg-remover.yourdomain.com`

### 步骤 2: 配置 DNS

Cloudflare 会自动配置 DNS 记录，通常为：

```
Type: CNAME
Name: bg-remover
Target: image-background-remover.pages.dev
```

### 步骤 3: 验证

等待 DNS 传播（通常 5-10 分钟），然后访问你的自定义域名。

---

## 📊 监控和分析

### 查看日志

**通过 Dashboard：**
1. 打开项目
2. 进入 **Deployments**
3. 点击最新部署
4. 查看 **Logs**

**通过 CLI：**
```bash
wrangler pages deployment tail \
  --project-name=image-background-remover
```

### 查看分析

1. 打开 Cloudflare Dashboard
2. 进入 **Workers & Pages** → **image-background-remover**
3. 查看 **Analytics** 标签
4. 查看请求、错误、性能等指标

---

## 🔄 自动部署

### Git 推送自动触发部署

配置完成后，每次推送到 `master` 分支会自动触发部署：

```bash
cd /root/.openclaw/workspace-coder/image-background-remover

# 提交更改
git add .
git commit -m "Update application"
git push origin master
```

Cloudflare Pages 会自动：
1. 检测到新的提交
2. 开始构建
3. 部署新版本
4. 更新生产环境

### 分支部署

每个分支都会自动创建预览部署：
- 推送到 `feature/test` → 创建预览环境
- 预览 URL: `https://image-background-remover-<branch-name>.pages.dev`

---

## 🛡️ 安全配置

### 防火墙规则（可选）

1. 打开 Cloudflare Dashboard
2. 进入 **Security** → **WAF**
3. 为你的域名创建规则：
   - 限制请求速率
   - 阻止恶意请求
   - 启用 Bot Protection

### 访问控制（可选）

在 `wrangler.toml` 中配置：

```toml
[build.environment]
NODE_VERSION = "18"

# 限制访问
[access_control]
allowed_origins = ["https://yourdomain.com"]
```

---

## 🚨 故障排除

### 问题 1: 构建失败

**检查：**
1. 查看构建日志
2. 确认 `package.json` 中的 scripts 正确
3. 确认 Node.js 版本兼容

**解决：**
```bash
# 本地测试构建
npm run build

# 检查依赖
npm install
```

### 问题 2: 环境变量未生效

**检查：**
1. 确认变量名正确：`REMOVEBG_API_KEY`
2. 确认环境选择：Production
3. 重新部署项目

**解决：**
1. 删除旧的环境变量
2. 重新添加
3. 重新部署

### 问题 3: API 调用失败

**检查：**
1. 确认 API Key 正确
2. 查看 Remove.bg 仪表板
3. 检查额度是否用完

**解决：**
1. 更新 API Key
2. 等待月度重置
3. 购买付费额度

---

## 📝 部署检查清单

- [x] Cloudflare 账号登录
- [x] GitHub 仓库连接
- [x] 构建命令配置
- [x] 环境变量设置
- [x] 首次部署完成
- [x] 功能测试通过
- [ ] 自定义域名配置（可选）
- [ ] 监控和告警设置（可选）

---

## 🎯 下一步

部署完成后：

1. **测试应用**
   - 访问部署的 URL
   - 测试所有功能
   - 验证 API 调用

2. **配置域名**（可选）
   - 添加自定义域名
   - 配置 DNS
   - 启用 HTTPS

3. **设置监控**（可选）
   - 配置告警
   - 启用分析
   - 设置日志保留

4. **分享应用**
   - 分享 URL 给用户
   - 收集反馈
   - 持续优化

---

## 📞 获取帮助

**文档：**
- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [Wrangler CLI 文档](https://developers.cloudflare.com/workers/wrangler/)

**支持：**
- [Cloudflare Community](https://community.cloudflare.com/)
- [GitHub Issues](https://github.com/zzymr/image-background-remover/issues)

---

**部署完成后，你的应用将可以在全球边缘节点访问！** 🚀

**预计 URL:** https://image-background-remover.pages.dev
