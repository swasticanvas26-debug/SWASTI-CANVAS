'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  ShoppingCart, Search, Menu, X, ChevronDown,
  User, LogOut, ShoppingBag, LifeBuoy, Star,
  Bell, Palette
} from 'lucide-react'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import type { AppUser } from '@/lib/auth'
import { clsx } from 'clsx'

interface NavbarProps {
  user?: AppUser | null
  cartCount?: number
}

const CATEGORIES = ['Landscape', 'Abstract', 'Animal & Birds', 'Religious', 'Figurative', 'Indian', 'Other painting', 'Reprints or printed']

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Artworks', href: '/artworks' },
  { label: 'Reviews', href: '/reviews' },
  // TODO (Post-Competition Cleanup): Remove this object when the competition is over
  { label: 'Competition', href: '/competition' },
]

export default function Navbar({ user, cartCount = 0 }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [categoryOpen, setCategoryOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)
  const [searchVal, setSearchVal] = useState('')
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createSupabaseBrowserClient()
  const categoryRef = useRef<HTMLDivElement>(null)
  const userRef = useRef<HTMLDivElement>(null)

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) setCategoryOpen(false)
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchVal.trim()) router.push(`/artworks?search=${encodeURIComponent(searchVal)}`)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-white/40 shadow-sm transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <img src="/logo.jpg" alt="Logo" className="w-14 h-14 object-cover rounded-full shadow-teal" />
            <div className="flex flex-col justify-center">
              <div className="font-display font-bold text-teal text-lg tracking-tight leading-none">SWASTI</div>
              <div className="font-display font-bold text-teal-light text-[10px] tracking-widest leading-none">CANVAS</div>
              <div className="font-display font-bold text-teal-light text-[9px] tracking-widest leading-none mt-0.5">Art Work For Everyone</div>
            </div>
          </Link>

          {/* Search bar — desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-canvas-muted" />
            <input
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              placeholder="Search artworks, artists…"
              className="w-full pl-9 pr-4 py-2 rounded-full border border-canvas-border bg-canvas-bg text-sm focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/10 transition-all"
            />
          </form>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                  pathname === link.href
                    ? 'text-teal bg-teal-pale'
                    : 'text-canvas-muted hover:text-teal hover:bg-teal-pale'
                )}
              >
                {link.label}
              </Link>
            ))}

            {/* Categories dropdown */}
            <div ref={categoryRef} className="relative">
              <button
                onClick={() => setCategoryOpen(!categoryOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-canvas-muted hover:text-teal hover:bg-teal-pale transition-colors"
              >
                <span className="i-grid">⊞</span>
                Categories
                <ChevronDown className={clsx('w-3.5 h-3.5 transition-transform', categoryOpen && 'rotate-180')} />
              </button>
              {categoryOpen && (
                <div className="absolute top-full mt-1 right-0 bg-white rounded-xl shadow-lg border border-canvas-border py-1 min-w-[160px] animate-fade-in z-50">
                  {CATEGORIES.map(cat => (
                    <Link
                      key={cat}
                      href={`/artworks?category=${encodeURIComponent(cat)}`}
                      onClick={() => setCategoryOpen(false)}
                      className="block px-4 py-2 text-sm text-canvas-dark hover:bg-teal-pale hover:text-teal transition-colors"
                    >
                      {cat}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Cart */}
            {user && (
              <Link
                href="/cart"
                className="relative p-2 rounded-full hover:bg-teal-pale transition-colors"
                aria-label="Cart"
              >
                <ShoppingCart className="w-5 h-5 text-canvas-muted" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-mustard text-white text-[10px] font-bold rounded-full flex items-center justify-center min-w-[18px] min-h-[18px] px-1">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}

            {user ? (
              <div ref={userRef} className="relative">
                <button
                  onClick={() => setUserOpen(!userOpen)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-teal-pale transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-teal to-peach flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {user.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div className="hidden sm:block text-left leading-tight">
                    <div className="text-xs font-semibold text-canvas-dark">{user.name?.split(' ')[0]}</div>
                    <div className="text-[10px] text-canvas-muted capitalize">{user.role}</div>
                  </div>
                  <ChevronDown className={clsx('w-3.5 h-3.5 text-canvas-muted transition-transform', userOpen && 'rotate-180')} />
                </button>
                {userOpen && (
                  <div className="absolute top-full mt-1 right-0 bg-white rounded-xl shadow-lg border border-canvas-border py-1 min-w-[200px] animate-fade-in z-50">
                    <div className="px-4 py-2.5 border-b border-canvas-border">
                      <div className="text-sm font-semibold">{user.name}</div>
                      <div className="text-xs text-canvas-muted">{user.email}</div>
                    </div>
                    {user.role === 'admin' && (
                      <Link href="/admin" onClick={() => setUserOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-canvas-dark hover:bg-teal-pale hover:text-teal transition-colors">
                        <Bell className="w-4 h-4" /> Admin Dashboard
                      </Link>
                    )}
                    {(user.role === 'seller' || user.role === 'admin') && (
                      <Link href="/seller" onClick={() => setUserOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-canvas-dark hover:bg-teal-pale hover:text-teal transition-colors">
                        <Palette className="w-4 h-4" /> Seller Dashboard
                      </Link>
                    )}
                    <Link href="/dashboard" onClick={() => setUserOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-canvas-dark hover:bg-teal-pale hover:text-teal transition-colors">
                      <ShoppingBag className="w-4 h-4" /> My Orders
                    </Link>
                    <Link href="/dashboard?tab=support" onClick={() => setUserOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-canvas-dark hover:bg-teal-pale hover:text-teal transition-colors">
                      <LifeBuoy className="w-4 h-4" /> Help Center
                    </Link>
                    {user.role === 'customer' && (
                      <Link href="/dashboard?tab=upgrade" onClick={() => setUserOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-mustard hover:bg-peach-pale transition-colors">
                        <Star className="w-4 h-4" /> REQUEST SELLER ACCOUNT
                      </Link>
                    )}
                    <div className="border-t border-canvas-border mt-1 pt-1">
                      <button onClick={handleSignOut} className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors">
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="hidden sm:block text-sm font-medium text-canvas-muted hover:text-teal transition-colors px-3 py-1.5">Sign In</Link>
                <Link href="/signup" className="btn-teal text-sm px-4 py-2">Get Started</Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-teal-pale transition-colors"
              aria-label="Menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-white/40 bg-white/80 backdrop-blur-md py-3 space-y-1 animate-slide-up">
            <form onSubmit={handleSearch} className="flex gap-2 px-2 mb-3">
              <input
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
                placeholder="Search artworks…"
                className="input-field text-sm py-2"
              />
              <button type="submit" className="btn-teal px-3">
                <Search className="w-4 h-4" />
              </button>
            </form>
            {NAV_LINKS.map(link => (
              <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                className={clsx('block px-4 py-2.5 rounded-lg text-sm font-medium', pathname === link.href ? 'text-teal bg-teal-pale' : 'text-canvas-muted')}
              >
                {link.label}
              </Link>
            ))}
            <div className="px-2 pt-1 pb-1">
              <div className="text-xs font-semibold text-canvas-muted uppercase tracking-wide px-2 mb-1">Categories</div>
              {CATEGORIES.map(cat => (
                <Link key={cat} href={`/artworks?category=${encodeURIComponent(cat)}`} onClick={() => setMobileOpen(false)}
                  className="block px-4 py-2 text-sm text-canvas-muted hover:text-teal">
                  {cat}
                </Link>
              ))}
            </div>
            {!user && (
              <div className="flex gap-2 px-2 pt-2">
                <Link href="/login" onClick={() => setMobileOpen(false)} className="btn-outline flex-1 text-center text-sm py-2">Sign In</Link>
                <Link href="/signup" onClick={() => setMobileOpen(false)} className="btn-teal flex-1 text-center text-sm py-2">Sign Up</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
