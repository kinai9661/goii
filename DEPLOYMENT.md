# AI Image Generator - 部署指南

## Cloudflare Pages 部署

### 準備工作

1. 確保所有代碼已提交到 Git 倉庫
2. 準備好所有環境變量
3. 確認 Supabase 數據庫已設置完成

### 部署步驟

#### 方法 1: 通過 Cloudflare Dashboard

1. **登入 Cloudflare**
   - 訪問 https://dash.cloudflare.com
   - 登入您的帳號

2. **創建新項目**
   - 點擊 "Pages" > "Create a project"
   - 選擇 "Connect to Git"

3. **連接倉庫**
   - 授權 Cloudflare 訪問您的 GitHub/GitLab
   - 選擇項目倉庫

4. **配置構建設置**
   ```
   Framework preset: Next.js
   Build command: npm run build
   Build output directory: .next
   Root directory: /
   ```

5. **設置環境變量**
   
   在 "Environment variables" 部分添加:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   HUGGINGFACE_API_KEY=your_huggingface_api_key
   NODE_VERSION=18
   ```

6. **開始部署**
   - 點擊 "Save and Deploy"
   - 等待構建完成（約 2-5 分鐘）

7. **配置自定義域名（可選）**
   - 部署完成後，前往 "Custom domains"
   - 添加您的域名並配置 DNS

#### 方法 2: 使用 Wrangler CLI

1. **安裝 Wrangler**
   ```bash
   npm install -g wrangler
   ```

2. **登入 Cloudflare**
   ```bash
   wrangler login
   ```

3. **安裝 Next.js Cloudflare 適配器**
   ```bash
   npm install --save-dev @cloudflare/next-on-pages
   ```

4. **構建項目**
   ```bash
   npm run build
   npx @cloudflare/next-on-pages
   ```

5. **部署**
   ```bash
   wrangler pages deploy .vercel/output/static --project-name=ai-image-generator
   ```

6. **設置環境變量**
   ```bash
   wrangler pages secret put NEXT_PUBLIC_SUPABASE_URL
   wrangler pages secret put NEXT_PUBLIC_SUPABASE_ANON_KEY
   wrangler pages secret put HUGGINGFACE_API_KEY
   ```

### 驗證部署

1. 訪問 Cloudflare 提供的 URL（例如：`ai-image-generator.pages.dev`）
2. 測試以下功能:
   - [ ] 首頁加載正常
   - [ ] 用戶註冊
   - [ ] 用戶登入
   - [ ] 圖片生成
   - [ ] 查看作品畫廊
   - [ ] 個人資料更新

### 常見問題

#### 構建失敗

**問題**: `Error: Cannot find module 'next'`

**解決方案**:
```bash
# 清除緩存並重新安裝
rm -rf node_modules package-lock.json
npm install
```

#### 環境變量未生效

**問題**: 應用無法連接到 Supabase

**解決方案**:
1. 確認環境變量名稱正確（區分大小寫）
2. 在 Cloudflare Pages 設置中重新添加環境變量
3. 觸發重新部署

#### 圖片生成失敗

**問題**: Hugging Face API 返回錯誤

**解決方案**:
1. 檢查 `HUGGINGFACE_API_KEY` 是否正確
2. 確認 API 密鑰有足夠的配額
3. 查看 Cloudflare Pages 的函數日誌

#### 路由 404 錯誤

**問題**: 某些頁面返回 404

**解決方案**:
1. 確認 `next.config.js` 配置正確
2. 檢查 `middleware.ts` 是否正確設置
3. 清除 Cloudflare 緩存並重新部署

### 性能優化

1. **啟用 Cloudflare CDN**
   - 自動啟用，無需額外配置

2. **圖片優化**
   - Next.js Image 組件已配置優化
   - Supabase Storage 提供 CDN 加速

3. **緩存策略**
   - 靜態資源自動緩存
   - API 響應根據需要設置緩存頭

### 監控和日誌

1. **查看部署日誌**
   - Cloudflare Dashboard > Pages > 選擇項目 > Deployments

2. **查看函數日誌**
   - Cloudflare Dashboard > Pages > 選擇項目 > Functions

3. **設置告警**
   - 在 Cloudflare 中配置錯誤告警
   - 監控 API 請求失敗率

### 更新部署

#### 自動部署

推送到主分支會自動觸發部署:
```bash
git add .
git commit -m "Update feature"
git push origin main
```

#### 手動部署

使用 Wrangler CLI:
```bash
npm run build
npx @cloudflare/next-on-pages
wrangler pages deploy .vercel/output/static
```

### 回滾

如果新部署出現問題:

1. 前往 Cloudflare Dashboard > Pages > Deployments
2. 找到之前的穩定版本
3. 點擊 "Rollback to this deployment"

### 成本估算

Cloudflare Pages 免費層級包括:
- 無限請求
- 500 次構建/月
- 100 GB 帶寬/月

超出免費額度後:
- $0.15/百萬請求
- $0.50/GB 帶寬

Hugging Face API 免費層級:
- 30,000 次請求/月

Supabase 免費層級:
- 500 MB 數據庫
- 1 GB 文件存儲
- 50,000 月活躍用戶

### 安全建議

1. **環境變量**
   - 永不在代碼中硬編碼密鑰
   - 使用 Cloudflare Pages 的環境變量功能

2. **API 密鑰**
   - 定期輪換 API 密鑰
   - 使用最小權限原則

3. **Supabase RLS**
   - 確保 Row Level Security 策略已啟用
   - 定期審查訪問權限

4. **速率限制**
   - 考慮添加 Cloudflare Rate Limiting
   - 在應用層實現請求限制

### 支持

如遇到問題:
1. 查看 Cloudflare Pages 文檔
2. 檢查項目 Issues
3. 聯繫開發團隊
