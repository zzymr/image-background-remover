# 🚀 使用指南 - Image Background Remover

## 快速启动（3 步）

### 1️⃣ 获取 API Key
- 访问：https://www.remove.bg/api
- 注册账号（免费）
- 获取 API Key

### 2️⃣ 配置应用
```bash
cd image-background-remover

# 编辑 .env.local 文件
nano .env.local

# 替换这行：
# REMOVEBG_API_KEY=your_api_key_here
# 为你的实际 API Key
```

### 3️⃣ 运行应用
```bash
npm run dev
```

然后打开：http://localhost:3000

---

## 使用流程

### 上传图片
1. **拖拽上传** - 直接拖拽图片到上传区域
2. **点击上传** - 点击上传按钮选择文件

### 处理图片
1. 预览上传的图片
2. 检查文件信息（大小、类型）
3. 点击 "Remove Background" 按钮
4. 等待 2-5 秒处理

### 查看结果
1. 使用滑块对比原图和处理后
2. 检查去除效果
3. 满意后点击 "Download Image"

### 下载图片
- 下载格式：PNG（透明背景）
- 文件名：background-removed.png

---

## 支持的格式

| 格式 | 扩展名 | 说明 |
|------|--------|------|
| JPEG | .jpg, .jpeg | 最常见 |
| PNG | .png | 保持透明度 |
| WEBP | .webp | 现代格式 |
| GIF | .gif | 动图（仅首帧） |

**文件大小限制：** 10MB

---

## 错误处理

### "No image provided"
- 没有上传图片，请先上传

### "File too large"
- 图片超过 10MB，请压缩后重试

### "InvalidFile type"
- 不支持的格式，请使用 PNG/JPG/WEBP

### "Remove.bg API error"
- API 调用失败，可能原因：
  - API Key 错误
  - 额度用完
  - 网络问题

### "Free API quota exhausted"
- 免费额度用完（50次/月）
- 解决方案：
  - 等待下月重置
  - 购买付费套餐
  - 使用其他 API

---

## 技巧与提示

### 1. 选择合适的图片
- 主体清晰、背景简单的图片效果最好
- 避免复杂背景（如森林、人群）
- 避免主体和背景颜色相近

### 2. 优化图片质量
- 上传前压缩图片（减少处理时间）
- 确保主体清晰可见
- 避免模糊、低分辨率图片

### 3. 批量处理
- 目前需要一张一张处理
- 后续版本会支持批量上传

### 4. 保存图片
- 下载后立即重命名，避免覆盖
- 建议使用描述性文件名

---

## 快捷键

| 操作 | 快捷键 |
|------|--------|
| 重新上传 | 点击 "Process Another" |
| 下载 | 点击 "Download Image" |
| 刷新页面 | Ctrl+R / Cmd+R |

---

## 浏览器兼容性

| 浏览器 | 版本 | 状态 |
|--------|------|------|
| Chrome | 90+ | ✅ 完全支持 |
| Firefox | 88+ | ✅ 完全支持 |
| Safari | 14+ | ✅ 完全支持 |
| Edge | 90+ | ✅ 完全支持 |
| Opera | 76+ | ✅ 完全支持 |

**推荐浏览器：** Chrome / Firefox / Edge

---

## 性能优化

### 提升处理速度
1. 压缩图片（减少文件大小）
2. 使用简单的背景图片
3. 关闭其他占用网络的标签页

### 提升下载速度
1. 使用稳定的网络
2. 避免同时下载多个文件

---

## 常见问题

### Q: 处理需要多长时间？
A: 通常 2-5 秒，取决于：
- 图片大小
- 网络速度
- Remove.bg 服务器负载

### Q: 能处理多张图片吗？
A: 目前一次只能处理一张，后续会支持批量。

### Q: 免费额度多少？
A: 50 次/月，重置时间是每月第一天。

### Q: 处理后的图片有水印吗？
A: 没有！Remove.bg 返回纯净的透明 PNG。

### Q: 支持移动端吗？
A: 完全支持！在手机浏览器上体验一样好。

### Q: 数据隐私？
A: 
- 图片通过 HTTPS 加密传输
- Remove.bg 不存储图片
- 处理后立即删除

### Q: 可以离线使用吗？
A: 不行，需要网络连接调用 API。

---

## 高级用法

### 自定义 API 端点
如果使用自己的 API 代理，修改：
```typescript
// app/page.tsx
const response = await fetch('/api/remove/remove', { ... })
```

### 修改文件大小限制
编辑 `app/api/remove-bg/route.ts`：
```typescript
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 改为 20MB
```

### 添加更多文件类型
编辑 `app/api/remove-bg/route.ts`：
```typescript
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/bmp'  // 新增
];
```

---

## 故障排除

### 问题：页面无法加载
**解决方案：**
1. 检查 Node.js 版本（需要 18+）
2. 清除缓存：`rm -rf .next`
3. 重新安装依赖：`npm install`

### 问题：API 调用失败
**解决方案：**
1. 检查 API Key 是否正确
2. 检查网络连接
3. 查看 Remove.bg 服务状态

### 问题：下载失败
**解决方案：**
1. 检查浏览器下载权限
2. 尝试右键另存为
3. 检查磁盘空间

### 问题：样式错乱
**解决方案：**
1. 清除浏览器缓存
2. 使用无痕模式测试
3. 检查 Tailwind CSS 配置

---

## 获取帮助

如果遇到问题：

1. **查看文档**
   - README.md
   - DEPLOYMENT.md
   - PROJECT_SUMMARY.md

2. **检查 API 状态**
   - https://status.remove.bg/

3. **搜索问题**
   - GitHub Issues
   - Stack Overflow

4. **联系支持**
   - Remove.bg 支持
   - 提交 Issue

---

## 最佳实践

### 开发环境
```bash
# 使用开发服务器
npm run dev

# 使用 TypeScript 检查
npm run lint

# 构建前检查
npm run build
```

### 生产环境
```bash
# 构建项目
npm run build

# 启动生产服务器
npm start

# 或使用 PM2
pm2 start npm --name "bg-remover" -- start
```

### 部署前检查
- [ ] 测试所有功能
- [ ] 检查环境变量
- [ ] 验证 API 可用性
- [ ] 测试移动端
- [ ] 检查性能

---

## 更新日志

### v0.1.0 (2026-03-19)
- ✅ MVP 完成
- ✅ 基础功能实现
- ✅ UI/UX 优化
- ✅ 完整文档

---

**享受使用！** 🎉
