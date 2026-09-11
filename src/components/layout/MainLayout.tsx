'use client'
import { ReactNode } from 'react'

import Footer from './Footer'

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-x-hidden flex flex-col">
      {/* Fixed watercolor blobs that sit between bg image and content */}
      <div className="blob-tl" aria-hidden="true" />
      <div className="blob-tr" aria-hidden="true" />
      <div className="blob-bl" aria-hidden="true" />
      <div className="blob-br" aria-hidden="true" />

      {/* All page content floats above */}
      <div className="relative z-10 flex-1 flex flex-col">
        {children}
      </div>
      <Footer />
    </div>
  )
}
