'use client'

import { useEffect, useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, User as UserIcon } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
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
  const supabase = createClient()

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
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
        title: '更新成功',
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
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </main>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">無法載入個人資料</p>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">個人資料</h1>
            <p className="text-muted-foreground">
              管理您的帳號設置和使用情況
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>帳號資訊</CardTitle>
              <CardDescription>
                更新您的個人資料
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">電子郵件</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  disabled
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">用戶名</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="輸入用戶名"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName">全名</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="輸入全名"
                />
              </div>

              <Button onClick={handleSave} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    保存中...
                  </>
                ) : (
                  '保存更改'
                )}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>使用統計</CardTitle>
              <CardDescription>
                查看您的使用情況
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">今日生成</p>
                  <p className="text-2xl font-bold">
                    {profile.daily_generations} / 10
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">總生成數</p>
                  <p className="text-2xl font-bold">
                    {profile.total_generations}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">剩餘點數</p>
                  <p className="text-2xl font-bold">
                    {profile.credits}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
