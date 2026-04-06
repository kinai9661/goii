'use client'

import { useEffect, useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, ImageIcon } from 'lucide-react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/types/database'

export const dynamic = 'force-dynamic'

type Generation = Database['public']['Tables']['generations']['Row']

export default function GalleryPage() {
  const [generations, setGenerations] = useState<Generation[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadGenerations()
  }, [])

  const loadGenerations = async () => {
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
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">我的作品</h1>
          <p className="text-muted-foreground">
            查看您生成的所有圖片
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : generations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <ImageIcon className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">還沒有作品</h2>
            <p className="text-muted-foreground mb-6">
              開始生成您的第一張 AI 圖片吧
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {generations.map((gen) => (
              <Card key={gen.id} className="overflow-hidden group">
                <CardContent className="p-0">
                  <div className="aspect-square relative bg-muted">
                    {gen.image_url && (
                      <Image
                        src={gen.image_url}
                        alt={gen.prompt}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-sm line-clamp-2 mb-2">
                      {gen.prompt}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(gen.created_at).toLocaleDateString('zh-TW', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
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
