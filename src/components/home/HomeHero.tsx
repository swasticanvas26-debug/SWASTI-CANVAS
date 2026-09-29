import SafeImage from '@/components/shared/SafeImage'
import type { Artwork } from '@/lib/types'
import Link from 'next/link'
import HomeHeroClient from './HomeHeroClient'

interface HomeHeroProps {
  artworks: Artwork[]
}

export default function HomeHero({ artworks }: HomeHeroProps) {
  if (!artworks || artworks.length === 0) {
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

  const art = artworks[0]
  const discountedPrice =
    art.offer && new Date(art.offer.valid_until) > new Date()
      ? (art.listing_price ?? 0) * (1 - art.offer.discount_percentage / 100)
      : null

  return (
    <div className="relative h-72 md:h-[400px] overflow-hidden mx-3 sm:mx-0 rounded-3xl sm:rounded-none shadow-[0_8px_40px_rgba(0,0,0,0.15)] sm:shadow-none mt-3 sm:mt-0">

      {/* ── First image: server-rendered so the browser discovers & fetches it
           immediately from the raw HTML — no JS execution needed for LCP. ── */}
      <SafeImage
        src={art.image_url}
        alt={art.title}
        fill
        className="object-cover"
        priority={true}
        fetchPriority="high"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

      {/* ── First slide content: also server-rendered, visible with zero JS ── */}
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

      {/* ── Client island: carousel controls + smooth slide transitions ── */}
      <HomeHeroClient artworks={artworks} />
    </div>
  )
}
