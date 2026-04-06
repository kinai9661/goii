'use client'

import { Navbar } from '@/components/navbar'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Sparkles, Zap, Shield, Palette, Wand2, Rocket, Star } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* 背景裝飾 */}
      <div className="fixed inset-0 -z-10 pattern-grid opacity-50" />
      <div className="fixed top-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -z-10 float-animation" />
      <div className="fixed bottom-20 left-20 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl -z-10 float-animation" style={{ animationDelay: '3s' }} />
      <div className="fixed top-1/2 left-1/2 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -z-10 float-animation" style={{ animationDelay: '6s' }} />
      
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="container py-24 md:py-32 relative">
          <div className="mx-auto max-w-5xl">
            <div className="text-center space-y-8">
              {/* 標籤 */}
              <div className="inline-flex items-center gap-2 glass-effect rounded-full px-6 py-3 text-sm font-medium colorful-shadow">
                <Sparkles className="h-5 w-5 text-purple-500" />
                <span className="gradient-text font-bold">AI 驅動的創意革命</span>
                <Star className="h-5 w-5 text-pink-500" />
              </div>
              
              {/* 主標題 */}
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight">
                <span className="block mb-4">釋放你的</span>
                <span className="gradient-text block">無限創意</span>
              </h1>
              
              {/* 副標題 */}
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                用 AI 的魔法，將腦海中的畫面變成現實。
                <span className="text-purple-500 font-semibold"> 無需繪畫技巧</span>，
                只需要你的想像力 ✨
              </p>
              
              {/* CTA 按鈕 */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
                <Link href="/signup">
                  <Button size="lg" className="gradient-button text-lg px-8 py-6 rounded-2xl group">
                    <Rocket className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                    開始創作
                  </Button>
                </Link>
                <Link href="/generate">
                  <Button size="lg" variant="outline" className="text-lg px-8 py-6 rounded-2xl neon-border group">
                    <Wand2 className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                    探索魔法
                  </Button>
                </Link>
              </div>

              {/* 統計數據 */}
              <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-16">
                <div className="glass-effect rounded-2xl p-6 card-hover">
                  <div className="text-4xl font-bold gradient-text">10+</div>
                  <div className="text-sm text-muted-foreground mt-2">AI 模型</div>
                </div>
                <div className="glass-effect rounded-2xl p-6 card-hover">
                  <div className="text-4xl font-bold gradient-text">1000+</div>
                  <div className="text-sm text-muted-foreground mt-2">創作作品</div>
                </div>
                <div className="glass-effect rounded-2xl p-6 card-hover">
                  <div className="text-4xl font-bold gradient-text">∞</div>
                  <div className="text-sm text-muted-foreground mt-2">創意可能</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 relative">
          <div className="container">
            <div className="mx-auto max-w-6xl">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  <span className="gradient-text">創意工具箱</span>
                </h2>
                <p className="text-xl text-muted-foreground">
                  強大的功能，簡單的操作
                </p>
              </div>
              
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {/* Feature 1 */}
                <div className="glass-effect rounded-3xl p-8 card-hover group">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-6 glow-effect">
                    <Zap className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-purple-500 transition-colors">
                    閃電生成
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    使用 Hugging Face 最先進的 AI 模型，幾秒鐘內將文字轉換為驚艷的視覺作品
                  </p>
                </div>

                {/* Feature 2 */}
                <div className="glass-effect rounded-3xl p-8 card-hover group">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-6 glow-effect" style={{ animationDelay: '1s' }}>
                    <Palette className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-blue-500 transition-colors">
                    風格萬千
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    從寫實到動漫，從抽象到具象，多種藝術風格任你選擇，打造獨一無二的視覺體驗
                  </p>
                </div>

                {/* Feature 3 */}
                <div className="glass-effect rounded-3xl p-8 card-hover group">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center mb-6 glow-effect" style={{ animationDelay: '2s' }}>
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-pink-500 transition-colors">
                    安全私密
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    採用 Supabase 企業級安全架構，你的創作和數據受到最高級別的保護
                  </p>
                </div>

                {/* Feature 4 */}
                <div className="glass-effect rounded-3xl p-8 card-hover group">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center mb-6 glow-effect" style={{ animationDelay: '0.5s' }}>
                    <Sparkles className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-orange-500 transition-colors">
                    智能優化
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    AI 自動優化提示詞，即使是新手也能創作出專業級別的藝術作品
                  </p>
                </div>

                {/* Feature 5 */}
                <div className="glass-effect rounded-3xl p-8 card-hover group">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-6 glow-effect" style={{ animationDelay: '1.5s' }}>
                    <Wand2 className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-green-500 transition-colors">
                    精細控制
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    調整尺寸、步數、風格等參數，完全掌控每一個創作細節
                  </p>
                </div>

                {/* Feature 6 */}
                <div className="glass-effect rounded-3xl p-8 card-hover group">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mb-6 glow-effect" style={{ animationDelay: '2.5s' }}>
                    <Star className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-indigo-500 transition-colors">
                    作品收藏
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    自動保存所有創作，建立你的專屬藝術畫廊，隨時回顧靈感時刻
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 relative">
          <div className="container">
            <div className="mx-auto max-w-4xl">
              <div className="glass-effect rounded-3xl p-12 md:p-16 text-center colorful-shadow relative overflow-hidden">
                {/* 背景裝飾 */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl" />
                
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 mb-8 glow-effect">
                    <Rocket className="h-10 w-10 text-white" />
                  </div>
                  
                  <h2 className="text-4xl md:text-5xl font-bold mb-6">
                    準備好<span className="gradient-text">開始創作</span>了嗎？
                  </h2>
                  
                  <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                    加入我們的創作者社群，每天免費生成 10 張高質量圖片
                  </p>
                  
                  <Link href="/signup">
                    <Button size="lg" className="gradient-button text-lg px-10 py-7 rounded-2xl group">
                      <Sparkles className="mr-2 h-6 w-6 group-hover:rotate-12 transition-transform" />
                      立即免費註冊
                    </Button>
                  </Link>
                  
                  <p className="text-sm text-muted-foreground mt-6">
                    無需信用卡 • 立即開始 • 隨時取消
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-12 relative">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              <span className="font-semibold gradient-text">AI Image Generator</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 AI Image Generator. 用創意改變世界 ✨
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
