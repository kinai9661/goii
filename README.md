# AI Image Generator

專業的 AI 圖片生成平台，使用 Next.js、Supabase 和 Hugging Face API 構建。

## 功能特點

- 🎨 使用多種 AI 模型生成高質量圖片
- 🎭 支持多種風格（自然、生動、動漫）
- 👤 完整的用戶認證系統
- 📊 使用統計和歷史記錄
- 🌓 深色/淺色主題切換
- 📱 響應式設計
- 🆓 每天 10 次免費生成

## 技術棧

- **前端**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **後端**: Next.js API Routes, Supabase (PostgreSQL, Auth, Storage)
- **AI**: Hugging Face Inference API
- **部署**: Cloudflare Pages
- **UI 組件**: Radix UI, shadcn/ui

## 快速開始

### 前置要求

- Node.js 18+
- npm 或 yarn
- Supabase 帳號
- Hugging Face 帳號

### 安裝步驟

1. **克隆項目**

```bash
git clone <your-repo-url>
cd ai-image-generator
```

2. **安裝依賴**

```bash
npm install
```

3. **設置環境變量**

複製 `.env.example` 到 `.env.local`:

```bash
cp .env.example .env.local
```

填寫以下環境變量:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Hugging Face
HUGGINGFACE_API_KEY=your_huggingface_api_key
```

4. **設置 Supabase**

在 Supabase 項目中執行數據庫遷移:

```bash
# 安裝 Supabase CLI
npm install -g supabase

# 登入 Supabase
supabase login

# 連接到您的項目
supabase link --project-ref your-project-ref

# 執行遷移
supabase db push
```

或者手動在 Supabase SQL Editor 中執行:
- `supabase/migrations/20240101000000_initial_schema.sql`
- `supabase/migrations/20240101000001_rls_policies.sql`

5. **啟動開發服務器**

```bash
npm run dev
```

訪問 [http://localhost:3000](http://localhost:3000)

## 獲取 API 密鑰

### Supabase

1. 訪問 [supabase.com](https://supabase.com)
2. 創建新項目
3. 在 Settings > API 中找到:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Hugging Face

1. 訪問 [huggingface.co](https://huggingface.co)
2. 註冊/登入帳號
3. 前往 Settings > Access Tokens
4. 創建新的 Access Token (Read 權限即可)
5. 複製 token 作為 `HUGGINGFACE_API_KEY`

## 部署到 Cloudflare Pages

### 方法 1: 通過 Git 連接

1. 將代碼推送到 GitHub/GitLab
2. 登入 [Cloudflare Dashboard](https://dash.cloudflare.com)
3. 前往 Pages > Create a project
4. 連接您的 Git 倉庫
5. 配置構建設置:
   - **Framework preset**: Next.js
   - **Build command**: `npm run build`
   - **Build output directory**: `.next`
6. 添加環境變量（與 `.env.local` 相同）
7. 點擊 Deploy

### 方法 2: 使用 Wrangler CLI

```bash
# 安裝 Wrangler
npm install -g wrangler

# 登入 Cloudflare
wrangler login

# 構建項目
npm run build

# 部署
npx @cloudflare/next-on-pages
wrangler pages deploy .vercel/output/static
```

### 環境變量設置

在 Cloudflare Pages 設置中添加:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
HUGGINGFACE_API_KEY=your_huggingface_api_key
```

## 項目結構

```
├── app/                      # Next.js App Router
│   ├── api/                 # API 路由
│   │   ├── auth/           # 認證端點
│   │   ├── generate_image/ # 圖片生成端點
│   │   └── me/             # 用戶資料端點
│   ├── generate/           # 圖片生成頁面
│   ├── gallery/            # 作品畫廊頁面
│   ├── profile/            # 個人資料頁面
│   ├── login/              # 登入頁面
│   ├── signup/             # 註冊頁面
│   ├── layout.tsx          # 根佈局
│   ├── page.tsx            # 首頁
│   └── globals.css         # 全局樣式
├── components/              # React 組件
│   ├── ui/                 # UI 組件庫
│   ├── navbar.tsx          # 導航欄
│   └── providers.tsx       # Context Providers
├── lib/                     # 工具函數
│   ├── ai/                 # AI 相關
│   │   └── huggingface.ts # Hugging Face API
│   ├── supabase/           # Supabase 客戶端
│   └── utils.ts            # 通用工具
├── supabase/               # Supabase 配置
│   └── migrations/         # 數據庫遷移
├── types/                  # TypeScript 類型
│   └── database.ts         # 數據庫類型
├── hooks/                  # React Hooks
│   └── use-toast.ts        # Toast 通知
├── middleware.ts           # Next.js 中間件
├── next.config.js          # Next.js 配置
├── tailwind.config.ts      # Tailwind 配置
└── tsconfig.json           # TypeScript 配置
```

## 可用的 AI 模型

- **SDXL** (推薦): Stable Diffusion XL - 高質量通用模型
- **SD 2.1**: Stable Diffusion 2.1 - 快速生成
- **Photoreal**: 真實照片風格
- **Openjourney**: 藝術風格

## 風格選項

- **自然**: 自然真實的風格
- **生動**: 色彩鮮豔、對比強烈
- **動漫**: 日式動漫風格

## API 端點

### 認證

- `POST /api/auth/signup` - 用戶註冊
- `POST /api/auth/login` - 用戶登入
- `POST /api/auth/logout` - 用戶登出

### 圖片生成

- `POST /api/generate_image` - 生成圖片
- `GET /api/generate_image?id={id}` - 查詢生成狀態

### 用戶

- `GET /api/me` - 獲取當前用戶資料
- `PATCH /api/me` - 更新用戶資料

## 使用限制

- 免費用戶: 每天 10 次生成
- Hugging Face API: 每月 30,000 次請求（免費層級）
- 圖片尺寸: 512x512 到 1024x1024
- 推理步數: 20-50 步

## 開發

```bash
# 開發模式
npm run dev

# 構建
npm run build

# 啟動生產服務器
npm start

# 類型檢查
npm run type-check

# Lint
npm run lint
```

## 故障排除

### Supabase 連接錯誤

確保環境變量正確設置，並且 Supabase 項目已啟用。

### Hugging Face API 錯誤

- 檢查 API 密鑰是否有效
- 確認未超過速率限制
- 某些模型可能需要時間加載（冷啟動）

### 圖片生成失敗

- 檢查提示詞是否合適
- 降低圖片尺寸或推理步數
- 查看瀏覽器控制台和服務器日誌

## 授權

MIT License

## 貢獻

歡迎提交 Issue 和 Pull Request！

## 支持

如有問題，請創建 Issue 或聯繫開發團隊。
