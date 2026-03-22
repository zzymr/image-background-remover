# Image Background Remover

基于 Next.js 14 + Cloudflare Pages 的 AI 抠图应用，现已集成：

- Google OAuth 登录
- Cloudflare D1 用户与会话存储
- 登录后才能调用抠图接口
- Cloudflare Pages Edge Runtime 部署

## 功能

- ✨ AI 抠图（Remove.bg）
- 🔐 Google 登录
- 🗄️ D1 存储用户信息与登录会话
- 📊 处理前后对比
- 📱 响应式界面
- ☁️ Cloudflare Pages 边缘部署

## 技术栈

- **前端 / 全栈：** Next.js 14, React, TypeScript, Tailwind CSS
- **认证：** Google OAuth 2.0 / OpenID Connect（自定义后端流程）
- **数据库：** Cloudflare D1
- **运行环境：** Cloudflare Pages Edge Runtime
- **图像处理：** Remove.bg API

## 本地开发

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制模板：

```bash
cp .env.example .env.local
```

填写以下变量：

```env
REMOVEBG_API_KEY=your_removebg_api_key
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
SESSION_SECRET=replace_with_a_long_random_secret
```

> `SESSION_SECRET` 建议使用 `openssl rand -base64 32` 生成。

### 3. 创建 D1 数据库

```bash
npx wrangler d1 create image-background-remover-db
```

执行后，把返回的 `database_id` 填入 `wrangler.toml`：

```toml
[[d1_databases]]
binding = "DB"
database_name = "image-background-remover-db"
database_id = "你的 database_id"
migrations_dir = "migrations"
```

### 4. 执行数据库迁移

本地：

```bash
npx wrangler d1 migrations apply image-background-remover-db --local
```

远程：

```bash
npx wrangler d1 migrations apply image-background-remover-db --remote
```

### 5. 配置 Google OAuth

在 Google Cloud Console 创建 **Web application** 类型 OAuth Client，并添加回调地址：

- 本地开发：`http://localhost:3000/api/auth/google/callback`
- 线上部署：`https://你的域名/api/auth/google/callback`

### 6. 启动开发环境

```bash
npm run dev
```

项目已在 `next.config.js` 中接入 `@cloudflare/next-on-pages/next-dev`，开发时会读取 `wrangler.toml` 里的 D1 绑定信息，便于本地模拟 Cloudflare 平台环境。

## 部署到 Cloudflare Pages

### Pages 构建配置

Cloudflare Pages 中请使用：

- **Build command:** `npm run pages:build`
- **Build output directory:** `.vercel/output/static`
- **Node.js version:** `20`

### 必要环境变量

在 Cloudflare Pages 项目里配置：

- `REMOVEBG_API_KEY`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `SESSION_SECRET`

### D1 绑定

将 Pages 项目绑定到 `DB`：

- Binding name: `DB`
- Database: 你的 D1 数据库

### 迁移

首次部署前执行：

```bash
npx wrangler d1 migrations apply image-background-remover-db --remote
```

## 自动部署脚本

项目自带：

```bash
./deploy-cloudflare.sh
```

该脚本会：

1. 安装依赖
2. 执行 `npm run pages:build`
3. 更新 Pages secrets
4. 上传 `.vercel/output/static`

## 数据库结构

迁移文件：`migrations/0001_google_auth.sql`

### users

存储 Google 登录用户：

- `id`
- `google_sub`
- `email`
- `email_verified`
- `name`
- `given_name`
- `family_name`
- `picture`
- `locale`
- `created_at`
- `updated_at`
- `last_login_at`

### sessions

存储登录会话：

- `id`
- `user_id`
- `session_token_hash`
- `created_at`
- `last_seen_at`
- `expires_at`
- `ip_address`
- `user_agent`

> 会话 Cookie 不直接把敏感数据暴露给前端；服务端仅在 D1 中保存 token hash。

## 认证流程

1. 前端点击“使用 Google 登录”
2. 后端生成 OAuth state，并跳转 Google
3. Google 回调 `/api/auth/google/callback`
4. 后端用 `client_secret` 交换 access token
5. 拉取 Google 用户信息
6. 用户信息 upsert 到 D1 `users`
7. 创建 D1 `sessions`
8. 浏览器写入 httpOnly session cookie
9. `/api/remove-bg` 校验登录状态，未登录返回 401

## 主要接口

### 认证

- `GET /api/auth/google/start` - 发起 Google 登录
- `GET /api/auth/google/callback` - Google OAuth 回调
- `GET /api/auth/session` - 获取当前登录状态
- `POST /api/auth/logout` - 退出登录

### 抠图

- `POST /api/remove-bg` - 需要登录后才能调用

## 常见问题

### 1. Google 登录点击后报错

检查：

- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` 是否正确
- Google Console 中回调地址是否与实际域名完全一致
- Cloudflare Pages 是否已绑定 D1 `DB`

### 2. 本地开发提示拿不到 D1

检查：

- `wrangler.toml` 是否已配置 `[[d1_databases]]`
- 本地是否已执行 `wrangler d1 migrations apply ... --local`
- 是否使用了正确的本地环境变量

### 3. 登录成功但抠图返回 401

通常说明：

- 会话 Cookie 没有成功写入
- `SESSION_SECRET` 线上与本地不一致
- D1 `sessions` 表没有迁移成功

## 脚本

```bash
npm run dev         # 本地开发
npm run build       # Next.js 构建
npm run pages:build # Cloudflare Pages 构建
npm run lint        # ESLint
```

## 安全说明

- Google Client Secret 仅在服务端使用
- Session Cookie 为 `httpOnly`
- D1 中保存的是 session token hash，不保存明文 token
- 抠图接口已增加登录校验

---

如果你要把这套流程接到正式域名，记得把 **Google Console 回调地址** 和 **Cloudflare Pages 域名 / 自定义域名** 配齐，否则登录一定会失败。
