# AI论文助手

基于 DeepSeek 的论文辅助工具：降重、学术润色、参考文献格式生成。

## 本地运行

1. 复制环境变量并填入 Key：

```bash
copy .env.example .env.local
```

2. 安装依赖并启动：

```bash
npm install
npm run dev
```

打开 http://localhost:3000

## 部署到 Vercel

1. 将本仓库推送到 GitHub（**不要**提交 `.env.local`）
2. 打开 [vercel.com](https://vercel.com)，连接 GitHub 并导入本仓库
3. 在 Environment Variables 中添加：
   - Key: `DEEPSEEK_API_KEY`
   - Value: 你的 DeepSeek API Key
4. 点击 Deploy，约 1–2 分钟后获得免费域名（如 `ai-paper-tool.vercel.app`）
