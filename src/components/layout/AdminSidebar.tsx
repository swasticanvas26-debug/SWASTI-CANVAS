'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Clock, PlusSquare, List,
  Users, LifeBuoy, Wallet, ChevronRight, type LucideIcon
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
  // { label: 'Pending Approvals', href: '/admin#pending-approvals', icon: Clock, badgeKey: 'pending' },
  { label: 'List New Artwork', href: '/admin/artworks/new', icon: PlusSquare },
  // { label: 'Manage Listings', href: '/admin#active-listings', icon: List },
  { label: 'User Support', href: '/admin/support', icon: LifeBuoy },
  { label: 'Payouts', href: '/admin/payouts', icon: Wallet },
]

export default function AdminSidebar({
  pendingCount = 0,
  sellerRequestCount = 0,
  mobileOpen = false,
  onClose,
}: AdminSidebarProps) {
  const pathname = usePathname()

  const badges: Record<string, number> = {
    pending: pendingCount,
    sellers: sellerRequestCount,
  }

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="px-4 py-5 border-b border-canvas-border">
        <h2 className="font-display font-bold text-lg text-canvas-dark">Admin Dashboard</h2>
      </div>
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {NAV.map(({ label, href, icon: Icon, badgeKey }) => {
          const isActive = pathname === href
          const count = badgeKey ? badges[badgeKey] : 0
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
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
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-60 bg-transparent min-h-screen shrink-0 border-r border-canvas-border/30">
        {sidebarContent}
      </aside>

      {/* Mobile overlay drawer */}
      {mobileOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 bg-black/30 z-40 backdrop-blur-sm"
            onClick={onClose}
          />
          <aside className="md:hidden fixed left-0 top-0 bottom-0 w-72 bg-white z-50 shadow-2xl animate-slide-up">
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  )
}
