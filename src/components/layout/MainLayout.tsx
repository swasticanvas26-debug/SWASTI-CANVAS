'use client'
import { ReactNode } from 'react'

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Watercolor splash corners (removed since we are using a fixed background image) */}
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}
