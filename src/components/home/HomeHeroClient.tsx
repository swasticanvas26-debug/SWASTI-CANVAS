'use client'

import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import SafeImage from '@/components/shared/SafeImage'
import type { Artwork } from '@/lib/types'
import Link from 'next/link'

interface HomeHeroClientProps {
  artworks: Artwork[]
}

export default function HomeHeroClient({ artworks }: HomeHeroClientProps) {
  const [current, setCurrent] = useState(0)
  const [animating, setAnimating] = useState(false)

  const goTo = useCallback(
    (index: number) => {
      if (animating) return
      setAnimating(true)
      setCurrent(index)
      setTimeout(() => setAnimating(false), 500)
    },
    [animating],
  )

  const prev = useCallback(
    () => goTo((current - 1 + artworks.length) % artworks.length),
    [current, artworks.length, goTo],
  )

  const next = useCallback(
    () => goTo((current + 1) % artworks.length),
    [current, artworks.length, goTo],
  )

  // Auto-advance every 5 seconds
  useEffect(() => {
    if (artworks.length <= 1) return
    const id = setInterval(next, 5000)
    return () => clearInterval(id)
  }, [next, artworks.length])

  const art = artworks[current]
  const discountedPrice =
    art.offer && new Date(art.offer.valid_until) > new Date()
      ? (art.listing_price ?? 0) * (1 - art.offer.discount_percentage / 100)
      : null

  return (
    <>
      {/* ── Slide overlay: fades in on top of the server-rendered first slide.
           Opacity-0 on slide 0 so the server HTML shines through (zero CLS).
           On slides 1+, it covers with the new image + content smoothly. ── */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
          current === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
        style={{ zIndex: 15 }}
      >
        <SafeImage
          src={art.image_url}
          alt={art.title}
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col justify-end px-6 md:px-12 pb-8 md:pb-12">
          {art.offer && (
            <div className="offer-badge inline-flex mb-3 w-fit">
              FEATURED: {art.offer.discount_percentage}% OFF {art.category?.toUpperCase()}S
            </div>
          )}
          {/* Use <p> here — the server-rendered <h1> is the page's primary heading */}
          <p className="font-display font-bold text-2xl md:text-4xl text-white mb-1 drop-shadow-lg">
            {art.title}
          </p>
          <p className="text-white/80 text-sm md:text-base mb-3">{art.seller?.name}</p>
          <div className="flex items-center gap-4">
            {discountedPrice ? (
              <div className="flex items-center gap-2">
                <span className="text-white/60 line-through text-sm">
                  ₹{(art.listing_price ?? 0).toLocaleString('en-IN')}
                </span>
                <span className="text-white font-bold text-xl">
                  ₹{discountedPrice.toLocaleString('en-IN')}
                </span>
              </div>
            ) : (
              <span className="text-white font-bold text-xl">
                ₹{(art.listing_price ?? 0).toLocaleString('en-IN')}
              </span>
            )}
            <Link href={`/artworks/${art.id}`} className="btn-teal text-sm">
              View Artwork
            </Link>
          </div>
        </div>
      </div>

      {/* ── Carousel controls: always visible, highest z-index ── */}
      {artworks.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous artwork"
            className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-colors"
            style={{ zIndex: 25 }}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            aria-label="Next artwork"
            className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-colors"
            style={{ zIndex: 25 }}
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dot indicators */}
          <div
            className="absolute bottom-3 right-6 flex gap-1.5"
            style={{ zIndex: 25 }}
          >
            {artworks.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === current ? 'bg-white w-5' : 'bg-white/40 w-2'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </>
  )
}
