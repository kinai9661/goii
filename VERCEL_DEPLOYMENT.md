# AI Image Generator - Vercel 部署指南

## 快速部署到 Vercel

### 方法 1: 使用 Vercel CLI（推薦）

1. **安裝 Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **登入 Vercel**
   ```bash
   vercel login
   ```

3. **部署專案**
   ```bash
   vercel
   ```
   
   首次部署時會詢問：
   - Set up and deploy? → Yes
   - Which scope? → 選擇你的帳號
   - Link to existing project? → No
   - What's your project's name? → ai-image-generator（或自訂名稱）
   - In which directory is your code located? → ./
   - Want to override the settings? → No

4. **設定環境變數**
   ```bash
   vercel env add NEXT_PUBLIC_SUPABASE_URL
   vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
   vercel env add HUGGINGFACE_API_KEY
   ```
   
   每個指令執行後會詢問：
   - What's the value? → 輸入對應的值
   - Add to which environment? → Production, Preview, Development（全選）

5. **重新部署**
   ```bash
   vercel --prod
   ```

### 方法 2: 使用 Vercel Dashboard

1. **前往 Vercel**
   - 訪問 https://vercel.com
   - 登入你的帳號

2. **匯入專案**
   - 點擊 "Add New..." → "Project"
   - 選擇 "Import Git Repository"
   - 授權並選擇你的 GitHub 倉庫

3. **配置專案**
   - Framework Preset: Next.js（自動偵測）
   - Root Directory: ./
   - Build Command: `npm run build`（自動設定）
   - Output Directory: .next（自動設定）

4. **設定環境變數**
   
   在 "Environment Variables" 部分加入：
   
   | Name | Value |
   |------|-------|
   | `NEXT_PUBLIC_SUPABASE_URL` | 你的 Supabase 專案 URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 你的 Supabase anon key |
   | `HUGGINGFACE_API_KEY` | 你的 Hugging Face API key |

5. **開始部署**
   - 點擊 "Deploy"
   - 等待建置完成（約 1-3 分鐘）

### 方法 3: 一鍵部署

點擊下方按鈕直接部署到 Vercel：

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/你的用戶名/你的倉庫名)

部署後記得在 Vercel Dashboard 設定環境變數。

## 環境變數說明

### 必要環境變數

1. **NEXT_PUBLIC_SUPABASE_URL**
   - 說明：Supabase 專案的 API URL
   - 取得方式：Supabase Dashboard → Settings → API → Project URL
   - 範例：`https://xxxxx.supabase.co`

2. **NEXT_PUBLIC_SUPABASE_ANON_KEY**
   - 說明：Supabase 的匿名金鑰（公開金鑰）
   - 取得方式：Supabase Dashboard → Settings → API → Project API keys → anon public
   - 範例：`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

3. **HUGGINGFACE_API_KEY**
   - 說明：Hugging Face 的 API 金鑰
   - 取得方式：https://huggingface.co/settings/tokens
   - 範例：`hf_xxxxxxxxxxxxxxxxxxxxx`

## 部署後設定

### 1. 設定自訂網域（可選）

1. 前往 Vercel Dashboard → 你的專案 → Settings → Domains
2. 輸入你的網域名稱
3. 按照指示設定 DNS 記錄

### 2. 設定 Supabase 重定向 URL

1. 前往 Supabase Dashboard → Authentication → URL Configuration
2. 在 "Site URL" 加入你的 Vercel 網域：
   ```
   https://your-project.vercel.app
   ```
3. 在 "Redirect URLs" 加入：
   ```
   https://your-project.vercel.app/**
   ```

### 3. 測試部署

訪問你的 Vercel 網址，測試以下功能：
- ✅ 註冊/登入功能
- ✅ 圖片生成功能
- ✅ 圖片庫顯示
- ✅ 個人資料頁面

## 常見問題

### Q: 部署後出現 500 錯誤
A: 檢查環境變數是否正確設定，特別是 Supabase URL 和 API key。

### Q: 圖片生成失敗
A: 確認 HUGGINGFACE_API_KEY 是否正確，並且有足夠的配額。

### Q: 登入後重定向失敗
A: 檢查 Supabase 的 Redirect URLs 設定是否包含你的 Vercel 網域。

### Q: 如何查看部署日誌
A: Vercel Dashboard → 你的專案 → Deployments → 點擊特定部署 → 查看 Build Logs

### Q: 如何回滾到之前的版本
A: Vercel Dashboard → 你的專案 → Deployments → 找到要回滾的版本 → 點擊 "..." → "Promote to Production"

## 自動部署

Vercel 會自動監聽你的 Git 倉庫：
- **Push 到 main 分支** → 自動部署到 Production
- **Push 到其他分支** → 自動建立 Preview 部署
- **Pull Request** → 自動建立 Preview 並在 PR 中顯示連結

## 效能優化

Vercel 自動提供：
- ✅ 全球 CDN 加速
- ✅ 自動 HTTPS
- ✅ 圖片優化
- ✅ 邊緣函數支援
- ✅ 自動快取

## 監控與分析

在 Vercel Dashboard 可以查看：
- 部署狀態和歷史
- 即時日誌
- 效能指標
- 錯誤追蹤

## 成本說明

Vercel 免費方案包含：
- 100 GB 頻寬/月
- 無限部署
- 自動 HTTPS
- 全球 CDN

超過免費額度後會自動升級到 Pro 方案。

## 支援

如有問題，請參考：
- Vercel 文件：https://vercel.com/docs
- Next.js 文件：https://nextjs.org/docs
- Supabase 文件：https://supabase.com/docs
