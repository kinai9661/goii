'use client'

import { useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Loader2, Sparkles, Download } from 'lucide-react'
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
        title: '生成成功',
        description: '您的圖片已生成完成',
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
      a.download = `ai-generated-${generationId || Date.now()}.png`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: '下載成功',
        description: '圖片已保存到您的設備',
      })
    } catch (error) {
      toast({
        title: '下載失敗',
        description: '請稍後再試',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left Panel - Controls */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  生成設置
                </CardTitle>
                <CardDescription>
                  調整參數以生成您想要的圖片
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="prompt">提示詞 *</Label>
                  <Textarea
                    id="prompt"
                    placeholder="描述您想要生成的圖片，例如：a beautiful sunset over mountains"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="negativePrompt">負面提示詞</Label>
                  <Textarea
                    id="negativePrompt"
                    placeholder="描述您不想要的元素，例如：blurry, low quality"
                    value={negativePrompt}
                    onChange={(e) => setNegativePrompt(e.target.value)}
                    rows={2}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="model">模型</Label>
                    <Select value={model} onValueChange={setModel}>
                      <SelectTrigger id="model">
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

                  <div className="space-y-2">
                    <Label htmlFor="style">風格</Label>
                    <Select value={style} onValueChange={setStyle}>
                      <SelectTrigger id="style">
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
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="width">寬度: {width}px</Label>
                    <Slider
                      id="width"
                      min={512}
                      max={1024}
                      step={64}
                      value={[width]}
                      onValueChange={(v) => setWidth(v[0])}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="height">高度: {height}px</Label>
                    <Slider
                      id="height"
                      min={512}
                      max={1024}
                      step={64}
                      value={[height]}
                      onValueChange={(v) => setHeight(v[0])}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="steps">推理步數: {steps}</Label>
                  <Slider
                    id="steps"
                    min={20}
                    max={50}
                    step={5}
                    value={[steps]}
                    onValueChange={(v) => setSteps(v[0])}
                  />
                  <p className="text-xs text-muted-foreground">
                    步數越多，質量越高，但生成時間越長
                  </p>
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="w-full"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      生成中...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      生成圖片
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Preview */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>預覽</CardTitle>
                <CardDescription>
                  生成的圖片將顯示在這裡
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-square relative bg-muted rounded-lg overflow-hidden">
                  {loading ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center space-y-4">
                        <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
                        <p className="text-sm text-muted-foreground">
                          正在生成您的圖片...
                        </p>
                      </div>
                    </div>
                  ) : generatedImage ? (
                    <Image
                      src={generatedImage}
                      alt="Generated image"
                      fill
                      className="object-contain"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center space-y-2">
                        <Sparkles className="h-12 w-12 mx-auto text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          輸入提示詞並點擊生成
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {generatedImage && (
                  <div className="mt-4 flex gap-2">
                    <Button
                      onClick={handleDownload}
                      variant="outline"
                      className="flex-1"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      下載圖片
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
