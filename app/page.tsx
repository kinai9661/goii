import { Navbar } from '@/components/navbar'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Sparkles, Zap, Shield, Palette } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="container py-24 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-8 inline-flex items-center rounded-full border px-4 py-1.5 text-sm">
              <Sparkles className="mr-2 h-4 w-4" />
              免費 AI 圖片生成平台
            </div>
            
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl">
              用 AI 創造
              <span className="text-primary"> 驚艷視覺</span>
            </h1>
            
            <p className="mb-8 text-lg text-muted-foreground">
              使用最先進的 AI 技術，將您的想像轉化為精美圖片。
              支持多種風格和模型，每天免費生成 10 張高質量圖片。
            </p>
            
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link href="/signup">
                <Button size="lg" className="w-full sm:w-auto">
                  立即開始
                </Button>
              </Link>
              <Link href="/generate">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  查看示例
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="border-t bg-muted/50 py-24">
          <div className="container">
            <div className="mx-auto max-w-5xl">
              <h2 className="mb-12 text-center text-3xl font-bold">
                為什麼選擇我們
              </h2>
              
              <div className="grid gap-8 md:grid-cols-3">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 rounded-full bg-primary/10 p-3">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">快速生成</h3>
                  <p className="text-muted-foreground">
                    使用 Hugging Face 的強大模型，幾秒鐘內生成高質量圖片
                  </p>
                </div>

                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 rounded-full bg-primary/10 p-3">
                    <Palette className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">多種風格</h3>
                  <p className="text-muted-foreground">
                    支持自然、生動、動漫等多種風格，滿足不同創作需求
                  </p>
                </div>

                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 rounded-full bg-primary/10 p-3">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">安全可靠</h3>
                  <p className="text-muted-foreground">
                    使用 Supabase 提供安全的用戶認證和數據存儲
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold">
              準備好開始創作了嗎？
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              註冊即可免費使用，每天 10 次生成機會
            </p>
            <Link href="/signup">
              <Button size="lg">
                免費註冊
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t py-6">
        <div className="container text-center text-sm text-muted-foreground">
          © 2024 AI Image Generator. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
