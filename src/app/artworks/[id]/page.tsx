import { notFound } from 'next/navigation'
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

interface Props {
  params: Promise<{ id: string }>
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

  return (
    <MainLayout>
      <Navbar user={user} cartCount={cartCount} />
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
