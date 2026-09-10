'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import ArtworkCard from '@/components/artwork/ArtworkCard'
import type { Artwork } from '@/lib/types'

interface FeaturedGridProps {
  artworks: Artwork[]
  userId?: string
}

export default function FeaturedGrid({ artworks, userId }: FeaturedGridProps) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  const handleAddToCart = async (artworkId: string) => {
    if (!userId) {
      toast.error('Please sign in to add items to cart')
      router.push('/login')
      return
    }
    setLoading(artworkId)
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ artwork_id: artworkId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Could not add to cart')
      toast.success('Added to cart! Reserved for 15 minutes.')
      router.refresh()
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(null)
    }
  }

  if (artworks.length === 0) {
    return (
      <div className="text-center py-16 text-canvas-muted">
        <p className="text-lg">No artworks available yet.</p>
        <p className="text-sm mt-1">Check back soon!</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
      {artworks.map((artwork, index) => (
        <ArtworkCard
          key={artwork.id}
          artwork={artwork}
          showAddToCart={artwork.status === 'listed'}
          onAddToCart={() => handleAddToCart(artwork.id)}
          priority={index < 4}
        />
      ))}
    </div>
  )
}
