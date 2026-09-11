'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import {
  ShoppingCart, Trash2, Timer, CheckCircle, Loader2, ArrowLeft,
  Smartphone, Building2, Copy, ChevronRight, AlertCircle, CreditCard,
  ArrowRight, ClipboardCheck
} from 'lucide-react'
import SafeImage from '@/components/shared/SafeImage'
import type { CartItem } from '@/lib/types'

// ─── Payment Config (update these with your real details) ──────────────────
const PAYMENT_DETAILS = {
  upi: {
    id: 'pratibhadagardalal@okhdfcbank',
    name: 'Pratibha Dagar',
    qrPlaceholder: false, // set to false when you have a real QR image URL
  },
  bank: {
    accountName: 'Pratibha Dagar',
    accountNumber: '1512000100660143',
    ifsc: 'PUNB0151200',
    bankName: 'Punjab National Bank',
    accountType: 'Savings',
  },
}
// ────────────────────────────────────────────────────────────────────────────

interface Props { items: CartItem[] }

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
  const [step, setStep] = useState<'cart' | 'method' | 'pay' | 'success'>('cart')
  const [payMethod, setPayMethod] = useState<'upi' | 'bank_transfer' | null>(null)
  const [txId, setTxId] = useState('')
  const [txAmount, setTxAmount] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const initial: Record<string, number> = {}
    items.forEach(item => { initial[item.id] = getTimeLeft(item.added_at) })
    setTimers(initial)
    const interval = setInterval(() => {
      setTimers(_ => {
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

  const handleSubmitPayment = async () => {
    if (!txId.trim()) { toast.error('Please enter your Transaction ID / UTR'); return }
    if (!txAmount || Number(txAmount) <= 0) { toast.error('Please enter the amount you paid'); return }
    setSubmitting(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payment_method: payMethod,
          transaction_id: txId,
          transaction_amount: Number(txAmount),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setStep('success')
    } catch (e: any) { toast.error(e.message) }
    finally { setSubmitting(false) }
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

  // ── Success screen ──────────────────────────────────────────────────────
  if (step === 'success') {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in max-w-md mx-auto">
        <div className="w-20 h-20 rounded-full bg-teal-pale flex items-center justify-center mb-5">
          <ClipboardCheck className="w-10 h-10 text-teal" />
        </div>
        <h1 className="font-display font-bold text-2xl text-canvas-dark mb-2">Payment Submitted!</h1>
        <p className="text-canvas-muted mb-6">
          Your transaction details have been received. Our admin will verify your payment and confirm the order shortly.
        </p>
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-left w-full mb-6">
          <div className="font-semibold text-canvas-dark mb-1">⏳ What happens next?</div>
          <ul className="text-canvas-muted space-y-1 text-xs list-disc list-inside">
            <li>Admin reviews your transaction ID and amount</li>
            <li>Once confirmed, the order will be marked as Paid</li>
            <li>The artwork will be unlisted and reserved for you</li>
            <li>If declined, the artwork will be relisted for others</li>
          </ul>
        </div>
        <button onClick={() => router.push('/dashboard')} className="btn-teal w-full py-3">
          View My Orders
        </button>
      </div>
    )
  }

  // ── Empty cart ──────────────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="animate-fade-in">
        <div className="flex items-center gap-3 mb-6">
          <ShoppingCart className="w-6 h-6 text-teal" />
          <h1 className="font-display font-bold text-2xl text-canvas-dark">Your Cart</h1>
        </div>
        <div className="bg-white rounded-2xl border border-canvas-border shadow-card p-12 text-center">
          <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-canvas-muted opacity-30" />
          <p className="text-canvas-muted text-lg mb-2">Your cart is empty</p>
          <a href="/artworks" className="btn-teal inline-flex items-center gap-2 mt-2">
            <ArrowLeft className="w-4 h-4" /> Browse Artworks
          </a>
        </div>
      </div>
    )
  }

  // ── Step 2: Choose payment method ───────────────────────────────────────
  if (step === 'method') {
    return (
      <div className="animate-fade-in max-w-lg mx-auto">
        <button onClick={() => setStep('cart')} className="flex items-center gap-1.5 text-sm text-canvas-muted hover:text-teal mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Cart
        </button>
        <h1 className="font-display font-bold text-2xl text-canvas-dark mb-1">Choose Payment Method</h1>
        <p className="text-canvas-muted text-sm mb-6">Total: <span className="font-bold text-teal text-base">₹{total.toLocaleString('en-IN')}</span></p>

        <div className="space-y-3 mb-6">
          <button
            onClick={() => { setPayMethod('upi'); setStep('pay') }}
            className="w-full bg-white border-2 border-canvas-border hover:border-teal rounded-2xl p-5 flex items-center gap-4 text-left transition-all hover:shadow-card group"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal to-teal-light flex items-center justify-center shrink-0">
              <Smartphone className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-canvas-dark">UPI / QR Payment</div>
              <div className="text-xs text-canvas-muted mt-0.5">Pay via Google Pay, PhonePe, Paytm, or any UPI app</div>
            </div>
            <ChevronRight className="w-5 h-5 text-canvas-muted group-hover:text-teal transition-colors" />
          </button>

          <button
            onClick={() => { setPayMethod('bank_transfer'); setStep('pay') }}
            className="w-full bg-white border-2 border-canvas-border hover:border-teal rounded-2xl p-5 flex items-center gap-4 text-left transition-all hover:shadow-card group"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-accent to-teal-light flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-canvas-dark">Bank Transfer / NEFT / RTGS</div>
              <div className="text-xs text-canvas-muted mt-0.5">Transfer directly to our bank account</div>
            </div>
            <ChevronRight className="w-5 h-5 text-canvas-muted group-hover:text-teal transition-colors" />
          </button>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-xs text-canvas-muted">
          <AlertCircle className="w-4 h-4 inline mr-1 text-mustard" />
          After paying, you'll enter your Transaction ID/UTR for admin verification. The artwork will be reserved once payment is confirmed.
        </div>
      </div>
    )
  }

  // ── Step 3: Pay & submit UTR ────────────────────────────────────────────
  if (step === 'pay') {
    const isUpi = payMethod === 'upi'
    return (
      <div className="animate-fade-in max-w-lg mx-auto">
        <button onClick={() => setStep('method')} className="flex items-center gap-1.5 text-sm text-canvas-muted hover:text-teal mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <h1 className="font-display font-bold text-2xl text-canvas-dark mb-1">
          {isUpi ? 'UPI Payment' : 'Bank Transfer'}
        </h1>
        <p className="text-canvas-muted text-sm mb-6">
          Pay <span className="font-bold text-teal">₹{total.toLocaleString('en-IN')}</span> and then submit your transaction details below.
        </p>

        {/* Payment Details Card */}
        <div className="bg-white border border-canvas-border rounded-2xl shadow-card p-5 mb-5">
          {isUpi ? (
            <div className="text-center">
              <div className="text-sm font-semibold text-canvas-dark mb-3">Scan QR or pay to UPI ID</div>
              {/* QR Code */}
              <div className="w-44 h-44 rounded-2xl bg-white border border-canvas-border flex items-center justify-center mx-auto mb-4 overflow-hidden relative shadow-sm">
                <SafeImage src="/images/upi-qr.png" alt="UPI QR Code" fill sizes="176px" className="object-contain p-2" />
              </div>
              <div className="bg-teal-pale rounded-xl p-3 flex items-center justify-between gap-2">
                <div>
                  <div className="text-xs text-canvas-muted">UPI ID</div>
                  <div className="font-bold text-teal font-mono">{PAYMENT_DETAILS.upi.id}</div>
                </div>
                <button
                  onClick={() => { navigator.clipboard.writeText(PAYMENT_DETAILS.upi.id); toast.success('UPI ID copied!') }}
                  className="p-2 rounded-lg hover:bg-white transition-colors"
                  title="Copy UPI ID"
                >
                  <Copy className="w-4 h-4 text-teal" />
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-sm font-semibold text-canvas-dark mb-2">Bank Account Details</div>
              {[
                { label: 'Account Name', value: PAYMENT_DETAILS.bank.accountName },
                { label: 'Account Number', value: PAYMENT_DETAILS.bank.accountNumber },
                { label: 'IFSC Code', value: PAYMENT_DETAILS.bank.ifsc },
                { label: 'Bank Name', value: PAYMENT_DETAILS.bank.bankName },
                { label: 'Account Type', value: PAYMENT_DETAILS.bank.accountType },
              ].map(row => (
                <div key={row.label} className="flex justify-between items-center bg-canvas-bg rounded-xl px-4 py-2.5">
                  <div>
                    <div className="text-xs text-canvas-muted">{row.label}</div>
                    <div className="font-semibold text-canvas-dark text-sm font-mono">{row.value}</div>
                  </div>
                  <button
                    onClick={() => { navigator.clipboard.writeText(row.value); toast.success(`${row.label} copied!`) }}
                    className="p-1.5 rounded-lg hover:bg-white transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5 text-canvas-muted" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Payment Proof */}
        <div className="bg-white border border-canvas-border rounded-2xl shadow-card p-5 space-y-4">
          <div className="font-semibold text-canvas-dark flex items-center gap-2">
            <ClipboardCheck className="w-4 h-4 text-teal" />
            Submit Payment Proof
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Transaction ID / UTR Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={txId}
              onChange={e => setTxId(e.target.value)}
              placeholder={isUpi ? 'e.g. UPI12345678901234' : 'e.g. SBIN26091234567890'}
              className="input-field font-mono"
            />
            <p className="text-xs text-canvas-muted mt-1">Find this in your payment app under transaction history</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Amount Paid (₹) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={txAmount}
              onChange={e => setTxAmount(e.target.value)}
              placeholder={total.toString()}
              className="input-field"
              min="1"
            />
          </div>
          <button
            onClick={handleSubmitPayment}
            disabled={submitting}
            className="btn-teal w-full py-3 flex items-center justify-center gap-2 font-bold"
          >
            {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
            {submitting ? 'Submitting…' : 'Submit for Verification'}
          </button>
          <p className="text-xs text-canvas-muted text-center">
            🔒 Your payment will be manually verified by our admin team
          </p>
        </div>
      </div>
    )
  }

  // ── Step 1: Cart view ───────────────────────────────────────────────────
  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <ShoppingCart className="w-6 h-6 text-teal" />
        <h1 className="font-display font-bold text-2xl text-canvas-dark">Your Cart</h1>
        <span className="bg-mustard text-white text-xs font-bold px-2 py-0.5 rounded-full">{items.length}</span>
      </div>

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
                <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden relative shrink-0">
                  {art?.image_url && <SafeImage src={art.image_url} alt={art.title} fill sizes="96px" className="object-cover" />}
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
              onClick={() => setStep('method')}
              className="btn-teal w-full py-3 flex items-center justify-center gap-2 text-base font-bold"
            >
              <CreditCard className="w-5 h-5" />
              Proceed to Payment
            </button>
            <p className="text-xs text-canvas-muted text-center mt-3">🔒 Manual payment with admin verification</p>
          </div>
        </div>
      </div>
    </div>
  )
}
