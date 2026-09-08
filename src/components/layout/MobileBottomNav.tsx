'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, LayoutGrid, ShoppingBag, User } from 'lucide-react'
import { clsx } from 'clsx'

const TABS = [
  { label: 'Home',       href: '/',                    icon: Home },
  { label: 'Artworks',   href: '/artworks',            icon: LayoutGrid },
  { label: 'Orders',     href: '/dashboard',           icon: ShoppingBag },
  { label: 'Profile',    href: '/dashboard?tab=profile', icon: User },
]

export default function MobileBottomNav() {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bottom-nav-glass safe-area-bottom">
      <div className="grid grid-cols-4 h-16">
        {TABS.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href || (href !== '/' && pathname.startsWith(href.split('?')[0]))
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                'relative flex flex-col items-center justify-center gap-0.5 transition-all duration-200 active:scale-90',
                isActive ? 'text-teal' : 'text-canvas-muted hover:text-teal'
              )}
            >
              {/* Active top bar */}
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-b-full bg-gradient-to-r from-teal to-teal-light" />
              )}
              <div className={clsx(
                'flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-200',
                isActive ? 'bg-teal-pale scale-105' : ''
              )}>
                <Icon className={clsx('transition-all duration-200', isActive ? 'w-5 h-5' : 'w-4.5 h-4.5')} />
              </div>
              <span className={clsx('text-[9px] font-semibold tracking-wide', isActive ? 'text-teal' : 'text-canvas-muted')}>{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
