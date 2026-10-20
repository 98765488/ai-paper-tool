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

## 部署到 Cloudflare（国内访问更稳）

GitHub 连接 Cloudflare Workers 时，表单这样填：

| 字段 | 填写 |
|------|------|
| Project name | `ai-paper-tool` |
| Build command | `npm run cf:build` |
| Deploy command | `npm run cf:deploy` |
| Preview command | `npm run cf:preview` |
| Enable Preview builds | 开着即可 |
| API token | 选 **Create new token**，名字填 `ai-paper-tool` |
| Environment variable name | `DEEPSEEK_API_KEY` |
| Environment variable value | 你的 DeepSeek Key，建议点 Encrypt |

本地命令：

```bash
npm run cf:build
npm run cf:deploy
```

## 部署到 Vercel（备用）

1. 将本仓库推送到 GitHub（**不要**提交 `.env.local`）
2. 打开 [vercel.com](https://vercel.com)，连接 GitHub 并导入本仓库
3. 在 Environment Variables 中添加 `DEEPSEEK_API_KEY`
4. 点击 Deploy
