# 🚀 Cloudflare Pages 完整部署指南

## 📋 配置信息

### Cloudflare 凭证
- **API Token:** `<your_cloudflare_api_token>`
- **Account ID:** `<your_cloudflare_account_id>`

### 项目信息
- **Project Name:** `image-background-remover`
- **GitHub 仓库:** `zzymr/image-background-remover`
- **默认分支:** `master`

### 环境变量
- **REMOVEBG_API_KEY:** `<your_removebg_api_key>`

---

## 🎯 方案一：Cloudflare Dashboard 手动配置（最简单）

### 步骤 1: 访问 Cloudflare Dashboard

打开浏览器访问：https://dash.cloudflare.com

### 步骤 2: 创建 Pages 项目

1. 在左侧菜单点击 **Workers & Pages**
2. 点击 **Create a project** 按钮
3. 选择 **Connect to Git**

### 步骤 3: 连接 GitHub

1. 点击 **Connect GitHub**
2. 如果是第一次，需要授权 Cloudflare 访问你的 GitHub
3. 选择仓库：`zzymr/image-background-remover`
4. 点击 **Begin setup**

### 步骤 4: 配置构建设置

在 **Build settings** 中填写：

| 字段 | 值 |
|------|-----|
| **Project name** | `image-background-remover` |
| **Production branch** | `master` |
| **Build command** | `npm run build` |
| **Build output directory** | `.next` |
| **Root directory** | `/` |

### 步骤 5: 设置环境变量

在 **Environment variables** 部分点击 **Add variable**，添加：

| Variable | Value | Environments |
|----------|-------|-------------|
| `REMOVEBG_API_KEY` | `<your_removebg_api_key>` | Production, Preview |

### 步骤 6: 部署

1. 点击 **Save and Deploy** 按钮
2. 等待构建完成（约 1-2 分钟）
3. 看到 **Successfully deployed** 消息

### 步骤 7: 访问应用

部署成功后，访问：
```
https://image-background-remover.pages.dev
```

---

## 🎯 方案二：使用 Wrangler CLI（自动化）

### 步骤 1: 安装 Wrangler

```bash
npm install -g wrangler
```

### 步骤 2: 登录 Cloudflare

```bash
export CLOUDFLARE_API_TOKEN="<your_cloudflare_api_token>"
wrangler login
```

### 步骤 3: 创建 Pages 项目

```bash
cd /root/.openclaw/workspace-coder/image-background-remover

wrangler pages project create image-background-remover \
  --production-branch=master
```

### 步骤 4: 部署项目

```bash
# 先构建
npm run build

# 部署
wrangler pages deploy .next \
  --project-name=image-background-remover \
  --branch=master
```

### 步骤 5: 设置环境变量

```bash
# 输入 API Key
echo "<your_removebg_api_key>" | wrangler pages secret put REMOVEBG_API_KEY \
  --project-name=image-background-remover \
  --environment=production
```

---

## 🎯 方案三：使用项目提供的部署脚本

### 自动部署脚本（推荐）

项目已包含两个部署脚本：

#### 1. Wrangler 脚本
```bash
cd /root/.openclaw/workspace-coder/image-background-remover
./deploy-cloudflare.sh
```

#### 2. API 脚本
```bash
cd /root/.openclaw/workspace-coder/image-background-remover
./deploy-api.sh
```

---

## ✅ 部署验证

### 检查部署状态

1. 访问 Cloudflare Dashboard
2. 进入 **Workers & Pages** → **image-background-remover**
3. 查看 **Deployments** 标签
4. 确认状态为 **Success**

### 测试应用

访问：https://image-background-remover.pages.dev

测试步骤：
1. ✅ 页面正常加载
2. ✅ 上传图片功能正常
3. ✅ 背景去除功能正常
4. ✅ 下载功能正常

---

## 🌐 配置自定义域名（可选）

### 添加域名

1. 打开 Cloudflare Dashboard
2. 进入 **Workers & Pages** → **image-background-remover**
3. 点击 **Custom domains** 标签
4. 点击 **Set up a custom domain**
5. 输入域名（如：`bg-remover.yourdomain.com`）
6. 点击 **Activate domain**

### 更新 DNS

Cloudflare 会自动添加 CNAME 记录：
```
类型: CNAME
名称: bg-remover
目标: image-background-remover.pages.dev
```

等待 DNS 传播（5-10 分钟）后访问你的自定义域名。

---

## 🔄 自动部署配置

### Git 推送自动触发

配置完成后，每次推送到 `master` 分支会自动部署：

```bash
cd /root/.openclaw/workspace-coder/image-background-remover

# 提交更改
git add .
git commit -m "Update application"
git push origin master

# Cloudflare 会自动检测并部署
```

### 查看部署日志

在 Cloudflare Dashboard：
1. 打开项目
2. 进入 **Deployments**
3. 点击最新的部署
4. 查看 **Logs**

---

## 📊 监控和告警

### 查看分析

1. 打开 Cloudflare Dashboard
2. 进入 **Workers & Pages** → **image-background-remover**
3. 点击 **Analytics** 标签
4. 查看：
   - 请求次数
   - 响应时间
   - 错误率
   - 地理分布

### 配置告警（可选）

1. 进入 **Workers & Pages** → **image-background-remover**
2. 点击 **Alerts** 标签
3. 点击 **Create alert**
4. 配置告警规则（如：错误率超过 5%）

---

## 🚨 故障排除

### 问题 1: 构建失败

**症状：** 构建状态显示为 Failed

**解决：**
1. 查看构建日志
2. 检查 `package.json` 中的 `build` 命令
3. 确认 Node.js 版本兼容
4. 本地测试构建：`npm run build`

### 问题 2: 环境变量未生效

**症状：** API 调用失败，提示 API Key 错误

**解决：**
1. 进入项目设置
2. 删除旧的 `REMOVEBG_API_KEY`
3. 重新添加，确保值正确
4. 重新部署项目

### 问题 3: 404 错误

**症状：** 访问应用显示 404 Not Found

**解决：**
1. 检查部署 URL 是否正确
2. 确认部署成功
3. 清除浏览器缓存
4. 等待 DNS 传播

### 问题 4: API 调用超时

**症状：** 处理图片时超时

**解决：**
1. 检查 Remove.bg 服务状态
2. 确认网络连接正常
3. 尝试使用较小的图片
4. 检查 API 额度是否用完

---

## 📝 部署检查清单

- [ ] Cloudflare 账号登录
- [ ] GitHub 仓库连接
- [ ] 构建设置配置
- [ ] 环境变量设置
- [ ] 首次部署成功
- [ ] 功能测试通过
- [ ] 自定义域名配置（可选）
- [ ] 监控和告警设置（可选）

---

## 🎯 快速部署（3 分钟）

### 最快部署流程

```bash
# 1. 访问 Cloudflare Dashboard
# https://dash.cloudflare.com

# 2. 创建项目（如方案一所述）

# 3. 配置构建设置
# Build command: npm run build
# Build output: .next

# 4. 添加环境变量
# REMOVEBG_API_KEY = <your_removebg_api_key>

# 5. 部署
# 点击 Save and Deploy

# 6. 访问应用
# https://image-background-remover.pages.dev
```

---

## 📞 获取帮助

### 文档
- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [Wrangler CLI 文档](https://developers.cloudflare.com/workers/wrangler/)
- [项目文档](./README.md)

### 支持
- [Cloudflare Community](https://community.cloudflare.com/)
- [GitHub Issues](https://github.com/zzymr/image-background-remover/issues)

---

## 🎉 部署完成后

### 立即可做
1. ✅ 访问应用测试功能
2. ✅ 分享 URL 给用户
3. ✅ 收集用户反馈

### 后续优化
1. 配置自定义域名
2. 设置监控和告警
3. 优化性能
4. 添加新功能

---

**预计部署时间：** 3-5 分钟
**应用 URL：** https://image-background-remover.pages.dev

---

**现在就按照方案一开始部署吧！** 🚀
