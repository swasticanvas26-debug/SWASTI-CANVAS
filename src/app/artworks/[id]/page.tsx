import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import SafeImage from '@/components/shared/SafeImage'
import { ArrowLeft, Tag, ShoppingCart, User2 } from 'lucide-react'
import { createSupabaseServerClient, createSupabaseServiceClient } from '@/lib/supabase/server'
import { getAppUser } from '@/lib/auth'
import MainLayout from '@/components/layout/MainLayout'
import Navbar from '@/components/layout/Navbar'
import MobileBottomNav from '@/components/layout/MobileBottomNav'
import AddToCartButton from '@/components/artwork/AddToCartButton'
import ArtworkReviews from '@/components/artwork/ArtworkReviews'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://swasticanvas.com'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const supabase = await createSupabaseServiceClient()
  const { data: artwork } = await supabase
    .from('artworks')
    .select('id, title, description, category, artist_name, image_url, listing_price, seller_requested_price, artwork_type, seller:users!artworks_seller_id_fkey(name)')
    .eq('id', id)
    .eq('status', 'listed')
    .single()

  if (!artwork) {
    return { title: 'Artwork Not Found' }
  }

  const artistName = artwork.artist_name || (artwork.seller as any)?.name || 'Swasti Canvas'
  const price = artwork.listing_price ?? artwork.seller_requested_price
  const title = `${artwork.title} by ${artistName} – Buy ${artwork.category} Art Online`
  const description = artwork.description
    ? `${artwork.description.slice(0, 150)}… Buy this ${artwork.category?.toLowerCase()} painting by ${artistName} on Swasti Canvas. Starting at ₹${price?.toLocaleString('en-IN')}.`
    : `Buy "${artwork.title}" – an original ${artwork.category?.toLowerCase()} painting by ${artistName}. Available on Swasti Canvas, India's premier art marketplace. Starting at ₹${price?.toLocaleString('en-IN')}.`

  return {
    title,
    description,
    keywords: [
      `${artwork.title}`,
      `${artwork.category} painting`,
      `${artwork.category} art India`,
      `${artistName} artwork`,
      'buy original painting India',
      'Indian art online',
      'Swasti Canvas',
    ],
    alternates: {
      canonical: `${BASE_URL}/artworks/${id}`,
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/artworks/${id}`,
      siteName: 'Swasti Canvas',
      type: 'website',
      locale: 'en_IN',
      images: artwork.image_url
        ? [{ url: artwork.image_url, alt: artwork.title }]
        : [{ url: `${BASE_URL}/logo.jpg`, alt: 'Swasti Canvas' }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: artwork.image_url ? [artwork.image_url] : [`${BASE_URL}/logo.jpg`],
    },
  }
}

export default async function ArtworkDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = await createSupabaseServerClient()
  const serviceClient = await createSupabaseServiceClient()
  const user = await getAppUser()

  const { data: artwork } = await serviceClient
    .from('artworks')
    .select(`
      *,
      seller:users!artworks_seller_id_fkey(id, name, email, role),
      reviews:order_reviews(id, artwork_rating, artwork_comment, created_at, user:users(name))
    `)
    .eq('id', id)
    .eq('status', 'listed')
    .single()

  if (!artwork) notFound()

  const now = new Date()
  const offer = Array.isArray(artwork.offer) && artwork.offer.length > 0
    ? artwork.offer.find((o: any) => new Date(o.valid_until) > now) ?? null
    : null

  const displayPrice = artwork.listing_price ?? artwork.seller_requested_price
  const discountedPrice = offer
    ? displayPrice * (1 - offer.discount_percentage / 100)
    : null

  const cartCount = user
    ? await (async () => {
        const { count } = await supabase.from('cart').select('id', { count: 'exact', head: true }).eq('user_id', user.id)
        return count ?? 0
      })()
    : 0

  // Product schema markup
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: artwork.title,
    description: artwork.description || `Original ${artwork.category} painting by ${artwork.artist_name || artwork.seller?.name || 'Swasti Canvas'}`,
    image: artwork.image_url || `${BASE_URL}/logo.jpg`,
    category: artwork.category,
    brand: {
      '@type': 'Brand',
      name: artwork.artist_name || artwork.seller?.name || 'Swasti Canvas',
    },
    offers: {
      '@type': 'Offer',
      url: `${BASE_URL}/artworks/${artwork.id}`,
      priceCurrency: 'INR',
      price: discountedPrice ?? displayPrice,
      priceValidUntil: offer ? offer.valid_until : new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      availability: artwork.quantity > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'Swasti Canvas',
        url: BASE_URL,
      },
    },
    ...(artwork.reviews && artwork.reviews.length > 0 ? {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: (
          artwork.reviews.reduce((sum: number, r: any) => sum + (r.artwork_rating || 0), 0) /
          artwork.reviews.filter((r: any) => r.artwork_rating).length
        ).toFixed(1),
        reviewCount: artwork.reviews.filter((r: any) => r.artwork_rating).length,
        bestRating: 5,
        worstRating: 1,
      },
    } : {}),
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Artworks', item: `${BASE_URL}/artworks` },
      { '@type': 'ListItem', position: 3, name: artwork.title, item: `${BASE_URL}/artworks/${artwork.id}` },
    ],
  }

  return (
    <MainLayout>
      <Navbar user={user} cartCount={cartCount} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 pb-24 md:pb-8">
        <Link href="/artworks" className="inline-flex items-center gap-1.5 text-sm text-canvas-muted hover:text-teal mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Gallery
        </Link>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Image */}
          <div className="relative aspect-square rounded-2xl overflow-hidden shadow-card-hover bg-gray-100">
            <SafeImage src={artwork.image_url} alt={artwork.title} fill className="object-cover" priority={true} sizes="(max-width: 768px) 100vw, 50vw" />
            {offer && (
              <div className="absolute top-4 left-4 offer-badge flex items-center gap-1">
                <Tag className="w-3 h-3" />
                {offer.discount_percentage}% OFF
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <div className="flex gap-2 mb-3 flex-wrap">
              <span className="inline-block bg-teal-pale text-teal text-xs font-bold px-3 py-1 rounded-full w-fit">
                {artwork.category}
              </span>
              {artwork.quantity > 1 && (
                <span className="inline-block bg-gray-100 text-canvas-dark text-xs font-bold px-3 py-1 rounded-full w-fit">
                  {artwork.quantity} in stock
                </span>
              )}
              {artwork.artwork_type && (
                <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full w-fit ${
                  artwork.artwork_type === 'original'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-purple-50 text-purple-700 border border-purple-200'
                }`}>
                  {artwork.artwork_type === 'original' ? '🎨 Original' : '🖌️ Repainted'}
                </span>
              )}
            </div>
            <h1 className="font-display font-bold text-3xl text-canvas-dark mb-1">{artwork.title}</h1>
            <div className="flex items-center gap-2 mb-4">
              <User2 className="w-4 h-4 text-canvas-muted" />
              <span className="text-canvas-muted text-sm">{artwork.artist_name || artwork.seller?.name || 'Swasti Canvas'}</span>
            </div>

            {artwork.description && (
              <p className="text-canvas-muted text-sm leading-relaxed mb-6">{artwork.description}</p>
            )}

            {/* Price section */}
            <div className="bg-teal-pale rounded-2xl p-5 mb-6">
              {discountedPrice ? (
                <>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-canvas-muted line-through text-sm">₹{displayPrice.toLocaleString('en-IN')}</span>
                    <span className="offer-badge">{offer!.discount_percentage}% OFF</span>
                  </div>
                  <div className="font-display font-bold text-3xl text-teal">
                    ₹{discountedPrice.toLocaleString('en-IN')}
                  </div>
                  <div className="text-xs text-mustard font-semibold mt-1">
                    Offer valid till {new Date(offer!.valid_until).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </>
              ) : (
                <div className="font-display font-bold text-3xl text-teal">
                  ₹{displayPrice.toLocaleString('en-IN')}
                </div>
              )}
            </div>

            {/* Notice */}
            <div className="text-xs text-canvas-muted bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-5">
              🎨 {artwork.quantity > 1 ? `${artwork.quantity} available in stock. ` : `This is a unique, 1-of-1 original artwork. `}
              When added to your cart, one item will be reserved for 15 minutes.
            </div>

            {user ? (
              <AddToCartButton artworkId={artwork.id} />
            ) : (
              <Link href="/login" className="btn-teal text-center w-full py-3 flex items-center justify-center gap-2">
                <ShoppingCart className="w-4 h-4" /> Sign in to Purchase
              </Link>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <ArtworkReviews reviews={artwork.reviews || []} />
      </main>
      <MobileBottomNav />
    </MainLayout>
  )
}
