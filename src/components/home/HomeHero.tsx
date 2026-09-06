'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import type { Artwork } from '@/lib/types'
import Link from 'next/link'

interface HomeHeroProps {
  artworks: Artwork[]
}

export default function HomeHero({ artworks }: HomeHeroProps) {
  const [current, setCurrent] = useState(0)
  const featured = artworks.length > 0 ? artworks : null

  if (!featured || featured.length === 0) {
    return (
      <div className="relative h-64 md:h-80 bg-gradient-to-br from-teal-pale to-peach-pale flex items-center justify-center overflow-hidden">
        <div className="text-center">
          <h1 className="font-display font-bold text-4xl md:text-5xl text-teal mb-3">
            Art for Everyone
          </h1>
          <p className="text-canvas-muted text-lg">Discover one-of-a-kind originals</p>
          <Link href="/artworks" className="btn-teal mt-5 inline-block">Explore Artworks</Link>
        </div>
      </div>
    )
  }

  const art = featured[current]
  const discountedPrice = art.offer && new Date(art.offer.valid_until) > new Date()
    ? (art.listing_price ?? 0) * (1 - art.offer.discount_percentage / 100)
    : null

  return (
    <div className="relative h-72 md:h-[400px] overflow-hidden">
      {/* Background image */}
      <Image
        src={art.image_url}
        alt={art.title}
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-end px-6 md:px-12 pb-8 md:pb-12">
        {art.offer && (
          <div className="offer-badge inline-flex mb-3 w-fit">
            FEATURED: {art.offer.discount_percentage}% OFF {art.category?.toUpperCase()}S
          </div>
        )}
        <h1 className="font-display font-bold text-2xl md:text-4xl text-white mb-1 drop-shadow-lg">
          {art.title}
        </h1>
        <p className="text-white/80 text-sm md:text-base mb-3">{art.seller?.name}</p>
        <div className="flex items-center gap-4">
          {discountedPrice ? (
            <div className="flex items-center gap-2">
              <span className="text-white/60 line-through text-sm">₹{(art.listing_price ?? 0).toLocaleString('en-IN')}</span>
              <span className="text-white font-bold text-xl">₹{discountedPrice.toLocaleString('en-IN')}</span>
            </div>
          ) : (
            <span className="text-white font-bold text-xl">₹{(art.listing_price ?? 0).toLocaleString('en-IN')}</span>
          )}
          <Link href={`/artworks/${art.id}`} className="btn-teal text-sm">View Artwork</Link>
        </div>
      </div>

      {/* Carousel controls */}
      {featured.length > 1 && (
        <>
          <button
            onClick={() => setCurrent((current - 1 + featured.length) % featured.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrent((current + 1) % featured.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          {/* Dots */}
          <div className="absolute bottom-3 right-6 flex gap-1.5">
            {featured.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-white w-5' : 'bg-white/40'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
