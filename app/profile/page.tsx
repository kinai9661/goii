'use client'

import { useEffect, useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, User as UserIcon, Mail, Sparkles, TrendingUp, Zap } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

export const dynamic = 'force-dynamic'
import { createClient } from '@/lib/supabase/client'

interface Profile {
  id: string
  email: string
  username: string | null
  full_name: string | null
  avatar_url: string | null
  daily_generations: number
  total_generations: number
  credits: number
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [username, setUsername] = useState('')
  const [fullName, setFullName] = useState('')

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    const supabase = createClient()
    try {
      const res = await fetch('/api/me')
      const data = await res.json()

      if (res.ok) {
        setProfile(data)
        setUsername(data.username || '')
        setFullName(data.full_name || '')
      }
    } catch (error) {
      console.error('Failed to load profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    const supabase = createClient()
    setSaving(true)

    try {
      const res = await fetch('/api/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username || null,
          full_name: fullName || null,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || '更新失敗')
      }

      setProfile(data)
      toast({
        title: '更新成功 ✨',
        description: '您的個人資料已更新',
      })
    } catch (error) {
      toast({
        title: '更新失敗',
        description: error instanceof Error ? error.message : '請稍後再試',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-16 w-16 animate-spin text-purple-500 mx-auto mb-4" />
            <p className="text-muted-foreground">載入中...</p>
          </div>
        </main>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="glass-effect rounded-3xl p-12 text-center">
            <p className="text-muted-foreground">無法載入個人資料</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* 背景裝飾 */}
      <div className="fixed inset-0 -z-10 pattern-dots opacity-30" />
      <div className="fixed top-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -z-10 float-animation" />
      <div className="fixed bottom-20 left-20 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl -z-10 float-animation" style={{ animationDelay: '3s' }} />
      
      <Navbar />
      
      <main className="flex-1 container py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">個人中心</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              管理你的帳號和創作數據
            </p>
          </div>

          {/* 統計卡片 */}
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="glass-effect border-2 rounded-3xl card-hover colorful-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">今日生成</p>
                    <p className="text-3xl font-bold gradient-text">
                      {profile.daily_generations} / 10
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect border-2 rounded-3xl card-hover colorful-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">總生成數</p>
                    <p className="text-3xl font-bold gradient-text">
                      {profile.total_generations}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect border-2 rounded-3xl card-hover colorful-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">剩餘點數</p>
                    <p className="text-3xl font-bold gradient-text">
                      {profile.credits}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 個人資料卡片 */}
          <Card className="glass-effect border-2 rounded-3xl colorful-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <UserIcon className="h-6 w-6 text-purple-500" />
                帳號資訊
              </CardTitle>
              <CardDescription>
                更新你的個人資料
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-base font-semibold flex items-center gap-2">
                  <Mail className="h-4 w-4 text-purple-500" />
                  電子郵件
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  disabled
                  className="rounded-2xl bg-muted/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username" className="text-base font-semibold">
                  用戶名
                </Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="輸入用戶名"
                  className="rounded-2xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-base font-semibold">
                  全名
                </Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="輸入全名"
                  className="rounded-2xl"
                />
              </div>

              <Button 
                onClick={handleSave} 
                disabled={saving}
                className="w-full gradient-button text-lg py-6 rounded-2xl"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    保存中...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    保存更改
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
