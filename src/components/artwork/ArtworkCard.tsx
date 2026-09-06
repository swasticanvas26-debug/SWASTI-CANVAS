import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Tag, Eye } from 'lucide-react'
import { clsx } from 'clsx'
import type { Artwork } from '@/lib/types'

interface ArtworkCardProps {
  artwork: Artwork
  showAddToCart?: boolean
  onAddToCart?: (artworkId: string) => void
}

function formatPrice(amount: number) {
  return `₹${amount.toLocaleString('en-IN')}`
}

function getDiscountedPrice(price: number, discount: number) {
  return price - (price * discount) / 100
}

function getOfferLabel(offer: { discount_percentage: number; valid_until: string }) {
  const date = new Date(offer.valid_until)
  const day = date.getDate()
  const month = date.toLocaleString('en', { month: 'short' })
  return `${offer.discount_percentage}% Off till ${day} ${month}`
}

export default function ArtworkCard({ artwork, showAddToCart = true, onAddToCart }: ArtworkCardProps) {
  const offer = artwork.offer
  const isOfferActive = offer && new Date(offer.valid_until) > new Date()
  const displayPrice = artwork.listing_price ?? artwork.seller_requested_price
  const discountedPrice = isOfferActive ? getDiscountedPrice(displayPrice, offer!.discount_percentage) : null

  return (
    <div className="card-hover bg-white rounded-2xl overflow-hidden shadow-card border border-canvas-border group animate-fade-in">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <Image
          src={artwork.image_url}
          alt={artwork.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {/* Category badge */}
        <div className="absolute top-2.5 left-2.5">
          <span className="bg-white/90 backdrop-blur text-teal text-[10px] font-bold px-2 py-0.5 rounded-full">
            {artwork.category}
          </span>
        </div>
        {/* Quick view */}
        <Link
          href={`/artworks/${artwork.id}`}
          className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors"
        >
          <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur text-teal text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" /> View Details
          </span>
        </Link>
        {/* Offer badge */}
        {isOfferActive && (
          <div className="absolute top-2.5 right-2.5 offer-badge">
            <Tag className="w-3 h-3 inline mr-1" />
            {offer!.discount_percentage}% OFF
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3.5">
        <h3 className="font-semibold text-canvas-dark text-sm line-clamp-1 mb-0.5">{artwork.title}</h3>
        <p className="text-canvas-muted text-xs mb-2">{artwork.seller?.name ?? 'Unknown Artist'}</p>

        {/* Price row */}
        <div className="flex items-end justify-between gap-2">
          <div>
            {isOfferActive && discountedPrice !== null ? (
              <>
                <div className="flex items-center gap-1.5">
                  <span className="text-canvas-muted text-xs line-through">{formatPrice(displayPrice)}</span>
                </div>
                <span className="font-bold text-teal text-base">{formatPrice(discountedPrice)}</span>
                <div className="text-[10px] text-mustard font-semibold">{getOfferLabel(offer!)}</div>
              </>
            ) : (
              <span className="font-bold text-canvas-dark text-base">{formatPrice(displayPrice)}</span>
            )}
          </div>

          {showAddToCart && (
            <button
              onClick={() => onAddToCart?.(artwork.id)}
              className={clsx(
                'btn-mustard flex items-center gap-1.5 shrink-0 text-xs py-1.5 px-3',
              )}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">ADD TO CART</span>
              <span className="xs:hidden">ADD</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
