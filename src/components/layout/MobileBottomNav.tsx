'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, LayoutGrid, ShoppingBag, User } from 'lucide-react'
import { clsx } from 'clsx'

const TABS = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Categories', href: '/artworks', icon: LayoutGrid },
  { label: 'Orders', href: '/dashboard', icon: ShoppingBag },
  { label: 'Profile', href: '/dashboard?tab=profile', icon: User },
]

export default function MobileBottomNav() {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-canvas-border shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
      <div className="grid grid-cols-4 h-16">
        {TABS.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href || (href !== '/' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                'flex flex-col items-center justify-center gap-0.5 transition-colors',
                isActive ? 'text-teal' : 'text-canvas-muted hover:text-teal'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{label}</span>
              {isActive && <div className="absolute top-0 w-8 h-0.5 bg-teal rounded-b-full" />}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
