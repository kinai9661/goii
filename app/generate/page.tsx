'use client'

import { useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export const dynamic = 'force-dynamic'
import { Slider } from '@/components/ui/slider'
import { Loader2, Sparkles, Download, Wand2, Image as ImageIcon, Palette, Zap } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import Image from 'next/image'

const MODELS = [
  { value: 'stabilityai/stable-diffusion-xl-base-1.0', label: 'SDXL (推薦)' },
  { value: 'stabilityai/stable-diffusion-2-1', label: 'Stable Diffusion 2.1' },
  { value: 'SG161222/Realistic_Vision_V6.0_B1_noVAE', label: 'Photoreal' },
  { value: 'prompthero/openjourney', label: 'Openjourney' },
]

const STYLES = [
  { value: 'natural', label: '自然' },
  { value: 'vivid', label: '生動' },
  { value: 'anime', label: '動漫' },
]

export default function GeneratePage() {
  const [prompt, setPrompt] = useState('')
  const [negativePrompt, setNegativePrompt] = useState('')
  const [model, setModel] = useState('stabilityai/stable-diffusion-xl-base-1.0')
  const [style, setStyle] = useState('natural')
  const [width, setWidth] = useState(1024)
  const [height, setHeight] = useState(1024)
  const [steps, setSteps] = useState(30)
  const [loading, setLoading] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [generationId, setGenerationId] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: '請輸入提示詞',
        description: '提示詞不能為空',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)
    setGeneratedImage(null)

    try {
      const res = await fetch('/api/generate_image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          negative_prompt: negativePrompt,
          model,
          style,
          width,
          height,
          num_inference_steps: steps,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || '生成失敗')
      }

      setGeneratedImage(data.image_url)
      setGenerationId(data.id)
      
      toast({
        title: '生成成功！',
        description: '您的圖片已生成',
      })
    } catch (error) {
      toast({
        title: '生成失敗',
        description: error instanceof Error ? error.message : '請稍後再試',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async () => {
    if (!generatedImage) return

    try {
      const res = await fetch(generatedImage)
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `ai-generated-${Date.now()}.png`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      toast({
        title: '下載失敗',
        description: '請稍後再試',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* 背景裝飾 */}
      <div className="fixed inset-0 -z-10 pattern-dots opacity-30" />
      <div className="fixed top-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -z-10 float-animation" />
      <div className="fixed bottom-20 left-20 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl -z-10 float-animation" style={{ animationDelay: '3s' }} />
      
      <Navbar />
      
      <main className="flex-1 container py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">創作你的藝術</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            用文字描述你的想像，讓 AI 為你實現 ✨
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* 左側：控制面板 */}
          <div className="space-y-6">
            <Card className="glass-effect border-2 rounded-3xl colorful-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Wand2 className="h-6 w-6 text-purple-500" />
                  創作設定
                </CardTitle>
                <CardDescription>
                  調整參數，打造完美作品
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 提示詞 */}
                <div className="space-y-2">
                  <Label htmlFor="prompt" className="text-base font-semibold flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-purple-500" />
                    提示詞
                  </Label>
                  <Textarea
                    id="prompt"
                    placeholder="描述你想要的圖片，例如：一隻可愛的貓咪在星空下..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={4}
                    className="rounded-2xl resize-none"
                  />
                </div>

                {/* 負面提示詞 */}
                <div className="space-y-2">
                  <Label htmlFor="negative" className="text-base font-semibold">
                    負面提示詞（選填）
                  </Label>
                  <Textarea
                    id="negative"
                    placeholder="描述你不想要的元素..."
                    value={negativePrompt}
                    onChange={(e) => setNegativePrompt(e.target.value)}
                    rows={2}
                    className="rounded-2xl resize-none"
                  />
                </div>

                {/* 模型選擇 */}
                <div className="space-y-2">
                  <Label className="text-base font-semibold flex items-center gap-2">
                    <Zap className="h-4 w-4 text-purple-500" />
                    AI 模型
                  </Label>
                  <Select value={model} onValueChange={setModel}>
                    <SelectTrigger className="rounded-2xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {MODELS.map((m) => (
                        <SelectItem key={m.value} value={m.value}>
                          {m.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 風格選擇 */}
                <div className="space-y-2">
                  <Label className="text-base font-semibold flex items-center gap-2">
                    <Palette className="h-4 w-4 text-purple-500" />
                    藝術風格
                  </Label>
                  <Select value={style} onValueChange={setStyle}>
                    <SelectTrigger className="rounded-2xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STYLES.map((s) => (
                        <SelectItem key={s.value} value={s.value}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 尺寸 */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">
                      寬度: {width}px
                    </Label>
                    <Slider
                      value={[width]}
                      onValueChange={([v]) => setWidth(v)}
                      min={512}
                      max={1024}
                      step={64}
                      className="py-4"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">
                      高度: {height}px
                    </Label>
                    <Slider
                      value={[height]}
                      onValueChange={([v]) => setHeight(v)}
                      min={512}
                      max={1024}
                      step={64}
                      className="py-4"
                    />
                  </div>
                </div>

                {/* 步數 */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">
                    生成步數: {steps}
                  </Label>
                  <Slider
                    value={[steps]}
                    onValueChange={([v]) => setSteps(v)}
                    min={20}
                    max={50}
                    step={5}
                    className="py-4"
                  />
                </div>

                {/* 生成按鈕 */}
                <Button
                  onClick={handleGenerate}
                  disabled={loading || !prompt.trim()}
                  className="w-full gradient-button text-lg py-6 rounded-2xl group"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      魔法生成中...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                      開始創作
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* 右側：預覽區域 */}
          <div className="space-y-6">
            <Card className="glass-effect border-2 rounded-3xl colorful-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <ImageIcon className="h-6 w-6 text-purple-500" />
                  作品預覽
                </CardTitle>
                <CardDescription>
                  你的創作將在這裡呈現
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-square rounded-2xl bg-muted/50 flex items-center justify-center overflow-hidden relative">
                  {loading ? (
                    <div className="flex flex-col items-center gap-4">
                      <Loader2 className="h-16 w-16 animate-spin text-purple-500" />
                      <p className="text-sm text-muted-foreground">AI 正在創作中...</p>
                    </div>
                  ) : generatedImage ? (
                    <Image
                      src={generatedImage}
                      alt="Generated"
                      fill
                      className="object-contain"
                    />
                  ) : (
                    <div className="text-center p-8">
                      <Sparkles className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        輸入提示詞，開始你的創作之旅
                      </p>
                    </div>
                  )}
                </div>

                {generatedImage && (
                  <div className="mt-4 flex gap-2">
                    <Button
                      onClick={handleDownload}
                      className="flex-1 rounded-2xl"
                      variant="outline"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      下載圖片
                    </Button>
                    <Button
                      onClick={handleGenerate}
                      disabled={loading}
                      className="flex-1 gradient-button rounded-2xl"
                    >
                      <Sparkles className="mr-2 h-4 w-4" />
                      重新生成
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
