'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShoppingCart, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AddToCartButton({ artworkId }: { artworkId: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleAdd = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ artwork_id: artworkId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed to add to cart')
      toast.success('Added! Reserved for 15 minutes.')
      router.push('/cart')
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleAdd}
      disabled={loading}
      className="btn-teal w-full py-3 flex items-center justify-center gap-2 text-base disabled:opacity-60"
    >
      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShoppingCart className="w-5 h-5" />}
      {loading ? 'Adding…' : 'Add to Cart'}
    </button>
  )
}
