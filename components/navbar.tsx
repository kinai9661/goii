'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Sparkles, Moon, Sun, Menu, X, Palette } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export function Navbar() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    const supabase = createClient()
    
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  if (!mounted) return null

  return (
    <nav className="sticky top-0 z-50 w-full border-b glass-effect">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center glow-effect">
            <Sparkles className="h-6 w-6 text-white group-hover:rotate-12 transition-transform" />
          </div>
          <span className="font-bold text-xl gradient-text hidden sm:inline-block">
            AI Image Generator
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {user ? (
            <>
              <Link href="/generate" className="text-sm font-medium hover:text-purple-500 transition-colors">
                創作
              </Link>
              <Link href="/gallery" className="text-sm font-medium hover:text-purple-500 transition-colors">
                作品集
              </Link>
              <Link href="/profile" className="text-sm font-medium hover:text-purple-500 transition-colors">
                個人資料
              </Link>
            </>
          ) : (
            <>
              <Link href="/generate" className="text-sm font-medium hover:text-purple-500 transition-colors">
                探索
              </Link>
            </>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="rounded-xl hover:bg-purple-500/10"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5 text-purple-500" />
            ) : (
              <Moon className="h-5 w-5 text-purple-500" />
            )}
          </Button>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <Button
                onClick={handleLogout}
                variant="outline"
                className="rounded-xl neon-border"
              >
                登出
              </Button>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="rounded-xl hover:bg-purple-500/10">
                    登入
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="gradient-button rounded-xl">
                    註冊
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden rounded-xl"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t glass-effect">
          <div className="container py-4 space-y-3">
            {user ? (
              <>
                <Link
                  href="/generate"
                  className="block px-4 py-2 rounded-xl hover:bg-purple-500/10 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  創作
                </Link>
                <Link
                  href="/gallery"
                  className="block px-4 py-2 rounded-xl hover:bg-purple-500/10 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  作品集
                </Link>
                <Link
                  href="/profile"
                  className="block px-4 py-2 rounded-xl hover:bg-purple-500/10 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  個人資料
                </Link>
                <Button
                  onClick={() => {
                    handleLogout()
                    setMobileMenuOpen(false)
                  }}
                  variant="outline"
                  className="w-full rounded-xl"
                >
                  登出
                </Button>
              </>
            ) : (
              <>
                <Link
                  href="/generate"
                  className="block px-4 py-2 rounded-xl hover:bg-purple-500/10 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  探索
                </Link>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full rounded-xl">
                    登入
                  </Button>
                </Link>
                <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full gradient-button rounded-xl">
                    註冊
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
