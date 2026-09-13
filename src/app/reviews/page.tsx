import Link from 'next/link'
import { createSupabaseServiceClient } from '@/lib/supabase/server'
import { getAppUser } from '@/lib/auth'
import MainLayout from '@/components/layout/MainLayout'
import Navbar from '@/components/layout/Navbar'
import MobileBottomNav from '@/components/layout/MobileBottomNav'
import SafeImage from '@/components/shared/SafeImage'
import { MessageSquare, ArrowRight } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function ReviewsPage() {
  const user = await getAppUser()
  const serviceClient = await createSupabaseServiceClient()

  // Fetch all reviews, ignoring RLS so we can see reviewer names and artwork details publicly
  const { data: reviews } = await serviceClient
    .from('order_reviews')
    .select(`
      id,
      artwork_comment,
      website_comment,
      created_at,
      user:users(name),
      artwork:artworks(id, title, image_url)
    `)
    .order('created_at', { ascending: false })

  const cartCount = user
    ? await (async () => {
        const { count } = await serviceClient.from('cart').select('id', { count: 'exact', head: true }).eq('user_id', user.id)
        return count ?? 0
      })()
    : 0

  return (
    <MainLayout>
      <Navbar user={user} cartCount={cartCount} />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12 pb-24 md:pb-12 animate-fade-in">
        <div className="text-center mb-10">
          <h1 className="font-display font-bold text-3xl md:text-4xl text-canvas-dark mb-3">Customer Reviews</h1>
          <p className="text-canvas-muted">See what our community is saying about the artworks on Swasti Canvas.</p>
        </div>

        {!reviews || reviews.length === 0 ? (
          <div className="bg-white rounded-2xl border border-canvas-border shadow-card p-12 text-center max-w-lg mx-auto">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 text-canvas-muted opacity-30" />
            <p className="text-canvas-muted font-medium mb-4">No reviews have been posted yet.</p>
            <Link href="/artworks" className="btn-teal inline-flex items-center gap-2">
              Browse Artworks <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {reviews.map((review: any) => (
              <div key={review.id} className="break-inside-avoid bg-white rounded-2xl border border-canvas-border shadow-card p-6 transition-all hover:shadow-card-hover group">
                
                {/* Artwork Reference */}
                {review.artwork && (
                  <div className="flex items-center gap-3 mb-4 p-2 -mt-2 -mx-2 rounded-xl transition-colors">
                    {review.artwork.image_url ? (
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 relative shrink-0">
                        <SafeImage src={review.artwork.image_url} alt={review.artwork.title} fill className="object-cover" sizes="48px" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-gray-100 shrink-0" />
                    )}
                    <div>
                      <div className="text-xs text-canvas-muted mb-0.5">Reviewed artwork:</div>
                      <div className="font-semibold text-sm text-teal line-clamp-1">{review.artwork.title}</div>
                    </div>
                  </div>
                )}
                
                {review.artwork_comment && (
                  <div className="mb-4">
                    <div className="text-xs font-semibold text-canvas-muted mb-1 uppercase tracking-wider">Artwork Review</div>
                    <p className="text-sm text-canvas-dark leading-relaxed italic">"{review.artwork_comment}"</p>
                  </div>
                )}

                {review.website_comment && (
                  <div className="mb-4">
                    <div className="text-xs font-semibold text-canvas-muted mb-1 uppercase tracking-wider">Site Review</div>
                    <p className="text-sm text-canvas-dark leading-relaxed italic">"{review.website_comment}"</p>
                  </div>
                )}
                
                <div className="flex items-center justify-between border-t border-canvas-border pt-4">
                  <div className="font-semibold text-sm">{review.user?.name || 'Verified Buyer'}</div>
                  <div className="text-xs text-canvas-muted">
                    {new Date(review.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </main>
      <MobileBottomNav />
    </MainLayout>
  )
}
