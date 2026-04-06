'use client'

import { useEffect, useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, ImageIcon, Sparkles, Calendar } from 'lucide-react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/types/database'

export const dynamic = 'force-dynamic'

type Generation = Database['public']['Tables']['generations']['Row']

export default function GalleryPage() {
  const [generations, setGenerations] = useState<Generation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadGenerations()
  }, [])

  const loadGenerations = async () => {
    const supabase = createClient()
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('generations')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) throw error

      setGenerations(data || [])
    } catch (error) {
      console.error('Failed to load generations:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* 背景裝飾 */}
      <div className="fixed inset-0 -z-10 pattern-grid opacity-30" />
      <div className="fixed top-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -z-10 float-animation" />
      <div className="fixed bottom-20 left-20 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl -z-10 float-animation" style={{ animationDelay: '3s' }} />
      
      <Navbar />
      
      <main className="flex-1 container py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">我的作品集</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            探索你的創意歷程 ✨
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="text-center">
              <Loader2 className="h-16 w-16 animate-spin text-purple-500 mx-auto mb-4" />
              <p className="text-muted-foreground">載入作品中...</p>
            </div>
          </div>
        ) : generations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="glass-effect rounded-3xl p-12 max-w-md colorful-shadow">
              <ImageIcon className="h-20 w-20 text-purple-500 mx-auto mb-6" />
              <h2 className="text-2xl font-bold mb-3">還沒有作品</h2>
              <p className="text-muted-foreground mb-6">
                開始你的第一次創作，建立專屬的藝術畫廊
              </p>
              <a href="/generate">
                <button className="gradient-button px-6 py-3 rounded-2xl font-semibold">
                  <Sparkles className="inline-block mr-2 h-5 w-5" />
                  開始創作
                </button>
              </a>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {generations.map((gen) => (
              <Card key={gen.id} className="glass-effect border-2 rounded-3xl overflow-hidden card-hover group">
                <CardContent className="p-0">
                  <div className="aspect-square relative bg-gradient-to-br from-purple-500/10 to-pink-500/10">
                    {gen.image_url && (
                      <Image
                        src={gen.image_url}
                        alt={gen.prompt}
                        fill
                        className="object-cover transition-transform group-hover:scale-110 duration-500"
                      />
                    )}
                    {/* 懸停時顯示的漸變遮罩 */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-4 space-y-2">
                    <p className="text-sm line-clamp-2 font-medium group-hover:text-purple-500 transition-colors">
                      {gen.prompt}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {new Date(gen.created_at).toLocaleDateString('zh-TW', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
