'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Mail, Lock, User, Sparkles, ArrowLeft } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast({
        title: '密碼不匹配',
        description: '請確認兩次輸入的密碼相同',
        variant: 'destructive',
      })
      return
    }

    if (password.length < 6) {
      toast({
        title: '密碼太短',
        description: '密碼至少需要 6 個字符',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || '註冊失敗')
      }

      toast({
        title: '註冊成功 ✨',
        description: '歡迎加入我們！',
      })

      router.push('/generate')
      router.refresh()
    } catch (error) {
      toast({
        title: '註冊失敗',
        description: error instanceof Error ? error.message : '請稍後再試',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* 背景裝飾 */}
      <div className="fixed inset-0 -z-10 pattern-dots opacity-30" />
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
                <span className="gradient-text">開始創作</span>
              </CardTitle>
              <CardDescription className="text-base mt-2">
                註冊帳號，釋放你的創意潛能
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
                  placeholder="至少 6 個字符"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="rounded-2xl h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-base font-semibold flex items-center gap-2">
                  <Lock className="h-4 w-4 text-purple-500" />
                  確認密碼
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="再次輸入密碼"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                    註冊中...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    立即註冊
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                已有帳號？{' '}
                <Link href="/login" className="text-purple-500 hover:text-purple-600 font-semibold">
                  立即登入
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
