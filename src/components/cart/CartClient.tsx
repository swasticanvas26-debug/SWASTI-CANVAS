'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { ShoppingCart, Trash2, Timer, CreditCard, CheckCircle, Loader2, ArrowLeft } from 'lucide-react'
import type { CartItem } from '@/lib/types'

interface Props {
  items: CartItem[]
}

function getTimeLeft(addedAt: string): number {
  const expiry = new Date(addedAt).getTime() + 15 * 60 * 1000
  return Math.max(0, expiry - Date.now())
}

function formatTime(ms: number): string {
  const m = Math.floor(ms / 60000)
  const s = Math.floor((ms % 60000) / 1000)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function CartClient({ items }: Props) {
  const router = useRouter()
  const [timers, setTimers] = useState<Record<string, number>>({})
  const [removing, setRemoving] = useState<string | null>(null)
  const [checkingOut, setCheckingOut] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const initial: Record<string, number> = {}
    items.forEach(item => {
      initial[item.id] = getTimeLeft(item.added_at)
    })
    setTimers(initial)
    const interval = setInterval(() => {
      setTimers(prev => {
        const next: Record<string, number> = {}
        items.forEach(item => { next[item.id] = getTimeLeft(item.added_at) })
        return next
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [items])

  const handleRemove = async (artworkId: string) => {
    setRemoving(artworkId)
    try {
      await fetch(`/api/cart?artwork_id=${artworkId}`, { method: 'DELETE' })
      toast.success('Removed from cart')
      router.refresh()
    } catch { toast.error('Failed to remove') }
    finally { setRemoving(null) }
  }

  const handleCheckout = async () => {
    setCheckingOut(true)
    try {
      const res = await fetch('/api/checkout', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setSuccess(true)
      setTimeout(() => router.push('/dashboard'), 3000)
    } catch (e: any) { toast.error(e.message) }
    finally { setCheckingOut(false) }
  }

  const getPrice = (item: any): number => {
    const art = item.artwork
    const price = art.listing_price ?? art.seller_requested_price
    const offer = art.offer
    if (offer && new Date(offer.valid_until) > new Date()) {
      return price * (1 - offer.discount_percentage / 100)
    }
    return price
  }

  const total = items.reduce((sum, item) => sum + getPrice(item), 0)

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-teal-pale flex items-center justify-center mb-4">
          <CheckCircle className="w-10 h-10 text-teal" />
        </div>
        <h1 className="font-display font-bold text-2xl text-canvas-dark mb-2">Order Placed!</h1>
        <p className="text-canvas-muted">Your artwork is on its way. Redirecting to your orders…</p>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <ShoppingCart className="w-6 h-6 text-teal" />
        <h1 className="font-display font-bold text-2xl text-canvas-dark">Your Cart</h1>
        {items.length > 0 && <span className="bg-mustard text-white text-xs font-bold px-2 py-0.5 rounded-full">{items.length}</span>}
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-2xl border border-canvas-border shadow-card p-12 text-center">
          <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-canvas-muted opacity-30" />
          <p className="text-canvas-muted text-lg mb-2">Your cart is empty</p>
          <a href="/artworks" className="btn-teal inline-flex items-center gap-2 mt-2">
            <ArrowLeft className="w-4 h-4" /> Browse Artworks
          </a>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {/* Items */}
          <div className="md:col-span-2 space-y-4">
            {items.map((item: any) => {
              const art = item.artwork
              const price = getPrice(item)
              const origPrice = art.listing_price ?? art.seller_requested_price
              const hasOffer = art.offer && new Date(art.offer.valid_until) > new Date()
              const timeLeft = timers[item.id] ?? 0
              const isExpired = timeLeft === 0

              return (
                <div key={item.id} className={`bg-white rounded-2xl border ${isExpired ? 'border-red-300 opacity-60' : 'border-canvas-border'} shadow-card p-4 flex gap-4`}>
                  <div className="relative w-24 h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                    {art?.image_url && <Image src={art.image_url} alt={art.title} fill className="object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-canvas-dark">{art.title}</div>
                    <div className="text-canvas-muted text-xs mb-2">{art.seller?.name}</div>
                    {hasOffer ? (
                      <div className="flex items-center gap-2">
                        <span className="text-canvas-muted text-xs line-through">₹{origPrice.toLocaleString('en-IN')}</span>
                        <span className="font-bold text-teal">₹{price.toLocaleString('en-IN')}</span>
                        <span className="offer-badge text-[10px]">{art.offer.discount_percentage}% OFF</span>
                      </div>
                    ) : (
                      <span className="font-bold text-teal">₹{price.toLocaleString('en-IN')}</span>
                    )}
                    {/* Timer */}
                    <div className={`flex items-center gap-1 mt-1.5 text-xs ${isExpired ? 'text-red-500' : timeLeft < 120000 ? 'text-mustard' : 'text-canvas-muted'}`}>
                      <Timer className="w-3 h-3" />
                      {isExpired ? 'Reservation expired' : `Reserved for ${formatTime(timeLeft)}`}
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemove(art.id)}
                    disabled={removing === art.id}
                    className="p-2 rounded-lg hover:bg-red-50 text-canvas-muted hover:text-red-500 transition-colors self-start"
                  >
                    {removing === art.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  </button>
                </div>
              )
            })}
          </div>

          {/* Summary */}
          <div>
            <div className="bg-white rounded-2xl border border-canvas-border shadow-card p-5 sticky top-20">
              <h3 className="font-semibold text-canvas-dark mb-4">Order Summary</h3>
              <div className="space-y-2 mb-4">
                {items.map((item: any) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-canvas-muted truncate flex-1">{item.artwork?.title}</span>
                    <span className="font-medium ml-2">₹{getPrice(item).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-canvas-border pt-4 mb-5">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-teal">₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>
              <button
                onClick={handleCheckout}
                disabled={checkingOut}
                className="btn-teal w-full py-3 flex items-center justify-center gap-2 text-base font-bold"
              >
                {checkingOut ? <Loader2 className="w-5 h-5 animate-spin" /> : <CreditCard className="w-5 h-5" />}
                {checkingOut ? 'Processing…' : 'Proceed to Checkout'}
              </button>
              <p className="text-xs text-canvas-muted text-center mt-3">🔒 Secured by JWT Payment Gateway</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
