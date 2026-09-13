import { Star, MessageSquare } from 'lucide-react'
import { clsx } from 'clsx'
import type { OrderReview } from '@/lib/types'

interface Props {
  reviews: OrderReview[]
}

export default function ArtworkReviews({ reviews }: Props) {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-canvas-border shadow-card p-10 text-center mt-12 mb-12">
        <MessageSquare className="w-10 h-10 mx-auto mb-3 text-canvas-muted opacity-40" />
        <p className="text-canvas-muted font-medium">No reviews yet for this artwork.</p>
        <p className="text-xs text-canvas-muted mt-1">Leave a review after purchasing!</p>
      </div>
    )
  }
  return (
    <div className="mt-12 mb-12">
      <h2 className="font-display font-bold text-2xl text-canvas-dark mb-6 flex items-center gap-3">
        Reviews ({reviews.length})
      </h2>

      <div className="grid md:grid-cols-2 gap-4">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white rounded-2xl border border-canvas-border shadow-card p-6 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <div className="font-semibold text-sm">{review.user?.name || 'Verified Buyer'}</div>
            </div>
            <p className="text-sm text-canvas-muted leading-relaxed flex-1">
              {review.artwork_comment}
            </p>
            <div className="text-xs text-canvas-muted mt-4 opacity-70">
              {new Date(review.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
