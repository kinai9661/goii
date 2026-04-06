'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Mail, Lock, Sparkles, ArrowLeft } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || '登入失敗')
      }

      toast({
        title: '登入成功 ✨',
        description: '歡迎回來！',
      })

      router.push('/generate')
      router.refresh()
    } catch (error) {
      toast({
        title: '登入失敗',
        description: error instanceof Error ? error.message : '請檢查您的帳號密碼',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* 背景裝飾 */}
      <div className="fixed inset-0 -z-10 pattern-grid opacity-30" />
      <div className="fixed top-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -z-10 float-animation" />
      <div className="fixed bottom-20 left-20 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl -z-10 float-animation" style={{ animationDelay: '3s' }} />
      
      <div className="w-full max-w-md">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-purple-500 transition-colors mb-8">
          <ArrowLeft className="h-4 w-4" />
          返回首頁
        </Link>

        <Card className="glass-effect border-2 rounded-3xl colorful-shadow">
          <CardHeader className="text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto glow-effect">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold">
                <span className="gradient-text">歡迎回來</span>
              </CardTitle>
              <CardDescription className="text-base mt-2">
                登入繼續你的創作之旅
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-base font-semibold flex items-center gap-2">
                  <Mail className="h-4 w-4 text-purple-500" />
                  電子郵件
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="rounded-2xl h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-base font-semibold flex items-center gap-2">
                  <Lock className="h-4 w-4 text-purple-500" />
                  密碼
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="rounded-2xl h-12"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full gradient-button text-lg py-6 rounded-2xl"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    登入中...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    登入
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                還沒有帳號？{' '}
                <Link href="/signup" className="text-purple-500 hover:text-purple-600 font-semibold">
                  立即註冊
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
