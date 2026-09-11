'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Clock, PlusSquare, List,
  Users, LifeBuoy, Wallet, ChevronRight, MessageSquare, X, ChevronDown, type LucideIcon
} from 'lucide-react'
import { clsx } from 'clsx'

interface AdminSidebarProps {
  pendingCount?: number
  sellerRequestCount?: number
  mobileOpen?: boolean
  onClose?: () => void
}

interface NavItem {
  label: string
  href: string
  icon: LucideIcon
  badgeKey?: string
}

const NAV: NavItem[] = [
  { label: 'Overview', href: '/admin', icon: LayoutDashboard },
  { label: 'Chats', href: '/admin/chats', icon: MessageSquare, badgeKey: 'sellers' },
  { label: 'Order History', href: '/admin/orders', icon: List },
  { label: 'Seller Management', href: '/admin/sellers', icon: Users },
  // { label: 'Pending Approvals', href: '/admin#pending-approvals', icon: Clock, badgeKey: 'pending' },
  { label: 'List New Artwork', href: '/admin/artworks/new', icon: PlusSquare },
  // { label: 'Manage Listings', href: '/admin#active-listings', icon: List },
  { label: 'User Support', href: '/admin/support', icon: LifeBuoy },
  // { label: 'Payouts', href: '/admin/payouts', icon: Wallet },
]

export default function AdminSidebar({
  pendingCount = 0,
  sellerRequestCount = 0,
}: AdminSidebarProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const badges: Record<string, number> = {
    pending: pendingCount,
    sellers: sellerRequestCount,
  }

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="px-4 py-5 border-b border-canvas-border flex justify-between items-center">
        <h2 className="font-display font-bold text-lg text-canvas-dark">Admin Dashboard</h2>
        <button className="md:hidden p-2 text-canvas-muted hover:text-canvas-dark" onClick={() => setMobileOpen(false)}>
          <X className="w-5 h-5" />
        </button>
      </div>
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {NAV.map(({ label, href, icon: Icon, badgeKey }) => {
          const isActive = pathname === href
          const count = badgeKey ? badges[badgeKey] : 0
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={clsx('sidebar-item', isActive && 'active')}
            >
              <Icon className="w-4.5 h-4.5 shrink-0" />
              <span className="flex-1">{label}</span>
              {count > 0 && (
                <span className="min-w-[22px] h-5 bg-mustard text-white text-xs font-bold rounded-full flex items-center justify-center px-1">
                  {count}
                </span>
              )}
              {isActive && <ChevronRight className="w-3.5 h-3.5 text-teal opacity-60" />}
            </Link>
          )
        })}
      </nav>
    </div>
  )

  return (
    <>
      {/* Mobile slide-down menu */}
      <div className="md:hidden w-full bg-white border-b border-canvas-border shrink-0">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="w-full flex items-center justify-between px-4 py-3 bg-canvas-bg/30 hover:bg-canvas-bg transition-colors"
        >
          <div className="flex items-center gap-2 font-display font-bold text-canvas-dark text-base">
            <LayoutDashboard className="w-5 h-5 text-teal" />
            Admin Menu
          </div>
          <ChevronDown className={clsx("w-5 h-5 text-canvas-muted transition-transform", mobileOpen && "rotate-180")} />
        </button>
        {mobileOpen && (
          <div className="border-t border-canvas-border bg-white animate-slide-down">
            <nav className="p-2 space-y-1">
              {NAV.map(({ label, href, icon: Icon, badgeKey }) => {
                const isActive = pathname === href
                const count = badgeKey ? badges[badgeKey] : 0
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className={clsx(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                      isActive ? 'bg-teal-pale text-teal' : 'text-canvas-muted hover:bg-teal-pale hover:text-teal'
                    )}
                  >
                    <Icon className="w-4.5 h-4.5 shrink-0" />
                    <span className="flex-1">{label}</span>
                    {count > 0 && (
                      <span className="min-w-[22px] h-5 bg-mustard text-white text-xs font-bold rounded-full flex items-center justify-center px-1">
                        {count}
                      </span>
                    )}
                  </Link>
                )
              })}
            </nav>
          </div>
        )}
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-60 bg-transparent min-h-screen shrink-0 border-r border-canvas-border/30">
        {sidebarContent}
      </aside>
    </>
  )
}
