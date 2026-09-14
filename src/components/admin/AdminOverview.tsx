'use client'

import { useState } from 'react'
import Image from 'next/image'
import SafeImage from '@/components/shared/SafeImage'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import {
  TrendingUp, Image as ImageIcon, Clock, Star,
  Check, X, Edit2, Tag, Loader2, IndianRupee, Wallet, AlertCircle, MessageSquare, MapPin
} from 'lucide-react'
import type { Artwork, Order, User } from '@/lib/types'
import ArtworkChatModal from '@/components/shared/ArtworkChatModal'

interface AdminOverviewProps {
  user: User
  totalSales: number
  activeArtworks: number
  pendingApprovals: number
  sellerRequests: number
  pendingArtworks: Artwork[]
  activeListings: Artwork[]
  pendingOrders: Order[]
  allOrders: Order[]
}

function StatCard({ title, value, icon: Icon, color }: { title: string; value: string | number; icon: any; color: string }) {
  return (
    <div className="bg-white rounded-2xl border border-canvas-border p-5 shadow-card flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <div className="text-canvas-muted text-sm">{title}</div>
        <div className="font-display font-bold text-2xl text-canvas-dark">
          {typeof value === 'number' && title.includes('Sales') ? `₹${value.toLocaleString('en-IN')}` : value}
        </div>
      </div>
    </div>
  )
}

export default function AdminOverview(props: AdminOverviewProps) {
  const { user, totalSales, activeArtworks, pendingApprovals, sellerRequests, pendingArtworks, activeListings, pendingOrders, allOrders } = props
  const router = useRouter()
  const [approvingId, setApprovingId] = useState<string | null>(null)
  const [rejectingId, setRejectingId] = useState<string | null>(null)
  const [chatArtwork, setChatArtwork] = useState<Artwork | null>(null)
  const [priceModal, setPriceModal] = useState<{ artwork: Artwork } | null>(null)
  const [priceInput, setPriceInput] = useState('')
  const [offerModal, setOfferModal] = useState<{ artwork: Artwork } | null>(null)
  const [offerDiscount, setOfferDiscount] = useState('')
  const [offerUntil, setOfferUntil] = useState('')
  const [processingOrderId, setProcessingOrderId] = useState<string | null>(null)
  const [editPriceModal, setEditPriceModal] = useState<{ artwork: Artwork } | null>(null)
  const [editPriceInput, setEditPriceInput] = useState('')
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null)

  const handleOrderAction = async (orderId: string, action: 'confirm' | 'decline') => {
    setProcessingOrderId(orderId)
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })
      if (!res.ok) throw new Error((await res.json()).error)
      toast.success(action === 'confirm' ? 'Payment confirmed! Artwork unlisted.' : 'Payment declined. Artwork relisted.')
      router.refresh()
    } catch (e: any) { toast.error(e.message) }
    finally { setProcessingOrderId(null) }
  }

  const handleApprove = async (artwork: Artwork) => {
    setPriceModal({ artwork })
    setPriceInput(String(artwork.listing_price ?? artwork.seller_requested_price))
  }

  const confirmApprove = async () => {
    if (!priceModal) return
    const price = parseFloat(priceInput)
    if (!price || price <= 0) { toast.error('Enter a valid listing price'); return }
    setApprovingId(priceModal.artwork.id)
    try {
      const res = await fetch(`/api/artworks/${priceModal.artwork.id}/approve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listing_price: price }),
      })
      if (!res.ok) throw new Error((await res.json()).error)
      toast.success('Artwork approved and listed!')
      setPriceModal(null)
      router.refresh()
    } catch (e: any) { toast.error(e.message) }
    finally { setApprovingId(null) }
  }

  const handleReject = async (id: string) => {
    setRejectingId(id)
    try {
      const res = await fetch(`/api/artworks/${id}/reject`, { method: 'PATCH' })
      if (!res.ok) throw new Error((await res.json()).error)
      toast.success('Artwork rejected.')
      router.refresh()
    } catch (e: any) { toast.error(e.message) }
    finally { setRejectingId(null) }
  }

  const confirmEditPrice = async () => {
    if (!editPriceModal) return
    const price = parseFloat(editPriceInput)
    if (!price || price <= 0) { toast.error('Enter a valid listing price'); return }
    setEditingPriceId(editPriceModal.artwork.id)
    try {
      const res = await fetch(`/api/artworks/${editPriceModal.artwork.id}/approve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listing_price: price }),
      })
      if (!res.ok) throw new Error((await res.json()).error)
      toast.success('Listing price updated!')
      setEditPriceModal(null)
      router.refresh()
    } catch (e: any) { toast.error(e.message) }
    finally { setEditingPriceId(null) }
  }

  const handleAddOffer = async () => {
    if (!offerModal) return
    const res = await fetch('/api/offers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ artwork_id: offerModal.artwork.id, discount_percentage: parseFloat(offerDiscount), valid_until: offerUntil }),
    })
    if (!res.ok) { toast.error((await res.json()).error); return }
    toast.success('Offer applied!')
    setOfferModal(null)
    router.refresh()
  }

  const handleRemoveOffer = async (artworkId: string) => {
    await fetch(`/api/offers?artwork_id=${artworkId}`, { method: 'DELETE' })
    toast.success('Offer removed')
    router.refresh()
  }

  const handleRemoveListing = async (id: string) => {
    if (!confirm('Remove this listing?')) return
    const supabase_res = await fetch(`/api/artworks/${id}/reject`, { method: 'PATCH' })
    if (supabase_res.ok) { toast.success('Listing removed'); router.refresh() }
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-canvas-dark">Admin Dashboard – Overview</h1>
          <p className="text-canvas-muted text-sm">Manage artworks, sellers, and platform activity</p>
        </div>
        <a href="/admin/artworks/new" className="btn-teal flex items-center gap-2">
          + Add New Artwork (Admin)
        </a>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Sales" value={totalSales} icon={TrendingUp} color="bg-gradient-to-br from-teal to-teal-light" />
        <StatCard title="Active Artworks" value={activeArtworks} icon={ImageIcon} color="bg-gradient-to-br from-blue-accent to-teal-light" />
        <StatCard title="Pending Art Approvals" value={pendingApprovals} icon={Clock} color="bg-gradient-to-br from-peach to-mustard" />
        <StatCard title="Seller Requests" value={sellerRequests} icon={Star} color="bg-gradient-to-br from-mustard to-yellow-400" />
      </div>

      {/* Pending Payments */}
      <section id="pending-payments" className="bg-white rounded-2xl border border-canvas-border shadow-card overflow-hidden">
        <div className="px-6 py-4 border-b border-canvas-border">
          <h2 className="font-semibold text-canvas-dark flex items-center gap-2">
            <Wallet className="w-4 h-4 text-teal" />
            Pending Payment Verifications
            {pendingOrders.length > 0 && (
              <span className="bg-teal text-white text-xs px-2 py-0.5 rounded-full">{pendingOrders.length}</span>
            )}
          </h2>
        </div>
        {pendingOrders.length === 0 ? (
          <div className="p-8 text-center text-canvas-muted">No pending payments — all clear! ✅</div>
        ) : (
          <>
            {/* Desktop */}
            <div className="hidden md:block overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Artwork</th>
                    <th>Customer</th>
                    <th>Method</th>
                    <th>Transaction ID / UTR</th>
                    <th>Claimed Amount</th>
                    <th>Order Amount</th>
                    <th>Submitted</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingOrders.map((order: any) => (
                    <tr key={order.id}>
                      <td>
                        <div className="flex items-center gap-2">
                          {order.artwork?.image_url && (
                            <div className="relative w-10 h-8 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                        <SafeImage src={order.artwork.image_url} alt="" fill sizes="40px" className="object-cover" />
                            </div>
                          )}
                          <span className="text-sm font-medium truncate max-w-[120px]">{order.artwork?.title}</span>
                        </div>
                      </td>
                      <td>
                        <div className="text-sm font-medium">{order.user?.name}</div>
                        <div className="text-xs text-canvas-muted">{order.user?.email}</div>
                      </td>
                      <td>
                        <span className="text-xs font-semibold uppercase bg-canvas-bg px-2 py-1 rounded-lg">
                          {order.payment_method === 'upi' ? '📱 UPI' : '🏦 Bank'}
                        </span>
                      </td>
                      <td>
                        <span className="font-mono text-xs bg-canvas-bg px-2 py-1 rounded-lg">{order.transaction_id}</span>
                      </td>
                      <td className={order.transaction_amount === order.amount_paid ? 'text-green-600 font-semibold' : 'text-red-500 font-semibold'}>
                        ₹{(order.transaction_amount ?? 0).toLocaleString('en-IN')}
                        {order.transaction_amount !== order.amount_paid && (
                          <span title="Amount mismatch!">
                            <AlertCircle className="w-3 h-3 inline ml-1" />
                          </span>
                        )}
                      </td>
                      <td className="font-semibold">₹{order.amount_paid.toLocaleString('en-IN')}</td>
                      <td className="text-canvas-muted text-xs">{new Date(order.purchased_at).toLocaleDateString('en-IN')}</td>
                      <td>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleOrderAction(order.id, 'confirm')}
                            disabled={processingOrderId === order.id}
                            className="btn-teal text-xs px-3 py-1.5 flex items-center gap-1"
                          >
                            {processingOrderId === order.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                            Confirm
                          </button>
                          <button
                            onClick={() => handleOrderAction(order.id, 'decline')}
                            disabled={processingOrderId === order.id}
                            className="btn-danger text-xs px-3 py-1.5 flex items-center gap-1"
                          >
                            <X className="w-3.5 h-3.5" /> Decline
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Mobile */}
            <div className="md:hidden p-4 space-y-3">
              {pendingOrders.map((order: any) => (
                <div key={order.id} className="border border-canvas-border rounded-xl p-4 space-y-3">
                  <div className="flex gap-3">
                    {order.artwork?.image_url && (
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                        <SafeImage src={order.artwork.image_url} alt="" fill sizes="56px" className="object-cover" />
                      </div>
                    )}
                    <div>
                      <div className="font-semibold text-sm">{order.artwork?.title}</div>
                      <div className="text-xs text-canvas-muted">{order.user?.name} • {order.payment_method?.toUpperCase()}</div>
                      <div className="text-xs mt-1 font-mono bg-canvas-bg px-2 py-0.5 rounded">{order.transaction_id}</div>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-canvas-muted">Order: <strong>₹{order.amount_paid.toLocaleString('en-IN')}</strong></span>
                    <span className={order.transaction_amount === order.amount_paid ? 'text-green-600' : 'text-red-500'}>
                      Claimed: <strong>₹{(order.transaction_amount ?? 0).toLocaleString('en-IN')}</strong>
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleOrderAction(order.id, 'confirm')} disabled={processingOrderId === order.id} className="btn-teal text-xs px-3 py-1.5 flex-1 flex items-center justify-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Confirm
                    </button>
                    <button onClick={() => handleOrderAction(order.id, 'decline')} disabled={processingOrderId === order.id} className="btn-danger text-xs px-3 py-1.5 flex-1 flex items-center justify-center gap-1">
                      <X className="w-3.5 h-3.5" /> Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      {/* Pending Approvals */}
      <section id="pending-approvals" className="bg-white rounded-2xl border border-canvas-border shadow-card overflow-hidden">
        <div className="px-6 py-4 border-b border-canvas-border">
          <h2 className="font-semibold text-canvas-dark flex items-center gap-2">
            <Clock className="w-4 h-4 text-mustard" />
            Pending Artwork Approvals
            {pendingApprovals > 0 && (
              <span className="bg-mustard text-white text-xs px-2 py-0.5 rounded-full">{pendingApprovals}</span>
            )}
          </h2>
        </div>
        {pendingArtworks.length === 0 ? (
          <div className="p-8 text-center text-canvas-muted">No pending artworks — you&apos;re all caught up! 🎉</div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Artwork Thumbnail</th>
                    <th>Title</th>
                    <th>Artist</th>
                    <th>Requested Payout</th>
                    <th>Requested Price</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingArtworks.map(artwork => (
                    <tr key={artwork.id}>
                      <td>
                        <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-gray-100">
                          <SafeImage src={artwork.image_url} alt={artwork.title} fill sizes="64px" className="object-cover" />
                        </div>
                      </td>
                      <td className="font-medium">{artwork.title}</td>
                      <td className="text-canvas-muted">{artwork.seller?.name}</td>
                      <td>₹{artwork.seller_requested_price.toLocaleString('en-IN')}</td>
                      <td>₹{artwork.seller_requested_price.toLocaleString('en-IN')}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <button onClick={() => setChatArtwork(artwork)} className="btn-outline text-xs px-3 py-1.5 flex items-center gap-1">
                            <MessageSquare className="w-3.5 h-3.5" /> Chat
                          </button>
                          <button onClick={() => handleApprove(artwork)} className="btn-teal text-xs px-3 py-1.5 flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Approve
                          </button>
                          <button onClick={() => handleApprove(artwork)} className="btn-outline text-xs px-3 py-1.5 flex items-center gap-1">
                            <Edit2 className="w-3.5 h-3.5" /> Edit & Price
                          </button>
                          <button
                            onClick={() => handleReject(artwork.id)}
                            disabled={rejectingId === artwork.id}
                            className="btn-danger text-xs px-3 py-1.5 flex items-center gap-1"
                          >
                            {rejectingId === artwork.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <X className="w-3.5 h-3.5" />} Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Mobile stacked cards */}
            <div className="md:hidden p-4 space-y-3">
              {pendingArtworks.map(artwork => (
                <div key={artwork.id} className="border border-canvas-border rounded-xl p-4 space-y-3">
                  <div className="flex gap-3">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                      <SafeImage src={artwork.image_url} alt={artwork.title} fill sizes="64px" className="object-cover" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{artwork.title}</div>
                      <div className="text-canvas-muted text-xs">Artist: {artwork.seller?.name}</div>
                      <div className="text-xs mt-1">Payout: <strong>₹{artwork.seller_requested_price.toLocaleString('en-IN')}</strong></div>
                      <div className="text-xs">Price: <strong>₹{artwork.seller_requested_price.toLocaleString('en-IN')}</strong></div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setChatArtwork(artwork)} className="btn-outline text-xs px-3 py-1.5 flex-1 flex items-center justify-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5" /> Chat
                    </button>
                    <button onClick={() => handleApprove(artwork)} className="btn-teal text-xs px-3 py-1.5 flex-1">Approve</button>
                    <button onClick={() => handleReject(artwork.id)} className="btn-danger text-xs px-3 py-1.5 flex-1">Reject</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      {/* Active Listings */}
      <section id="active-listings" className="bg-white rounded-2xl border border-canvas-border shadow-card overflow-hidden">
        <div className="px-6 py-4 border-b border-canvas-border">
          <h2 className="font-semibold text-canvas-dark">Active Listings</h2>
        </div>
        {activeListings.length === 0 ? (
          <div className="p-8 text-center text-canvas-muted">No active listings yet.</div>
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Thumbnail</th>
                    <th>Title</th>
                    <th>Artist</th>
                    <th>Qty</th>
                    <th>Listed Price</th>
                    {/* <th>Offer</th> */}
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {activeListings.map(artwork => (
                    <tr key={artwork.id}>
                      <td>
                        <div className="relative w-14 h-10 rounded-lg overflow-hidden bg-gray-100">
                          <SafeImage src={artwork.image_url} alt={artwork.title} fill sizes="56px" className="object-cover" />
                        </div>
                      </td>
                      <td className="font-medium">{artwork.title}</td>
                      <td className="text-canvas-muted">{artwork.seller?.name}</td>
                      <td>{artwork.quantity}</td>
                      <td className="font-semibold">₹{(artwork.listing_price ?? 0).toLocaleString('en-IN')}</td>
                      {/* <td>
                        {artwork.offer ? (
                          <span className="text-mustard text-xs font-semibold">
                            {artwork.offer.discount_percentage}% Off till {new Date(artwork.offer.valid_until).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                          </span>
                        ) : (
                          <span className="text-canvas-muted text-xs">—</span>
                        )}
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <button onClick={() => { setOfferModal({ artwork }); setOfferDiscount(''); setOfferUntil('') }} className="text-teal text-xs font-semibold hover:underline">
                            {artwork.offer ? 'Edit Offer' : 'Add Offer'}
                          </button>
                          {artwork.offer && (
                            <button onClick={() => handleRemoveOffer(artwork.id)} className="text-canvas-muted text-xs hover:text-red-500">Remove Offer</button>
                          )}
                          <button onClick={() => handleRemoveListing(artwork.id)} className="text-red-500 text-xs font-semibold hover:underline">Remove</button>
                        </div>
                      </td> */}
                      <td>
                        <div className="flex gap-2">
                          <button onClick={() => { setEditPriceModal({ artwork }); setEditPriceInput(String(artwork.listing_price || '')) }} className="text-teal text-xs font-semibold hover:underline">Edit Price</button>
                          <button onClick={() => handleRemoveListing(artwork.id)} className="text-red-500 text-xs font-semibold hover:underline">Remove</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Mobile */}
            <div className="md:hidden p-4 space-y-3">
              {activeListings.map(artwork => (
                <div key={artwork.id} className="border border-canvas-border rounded-xl p-4">
                  <div className="flex gap-3 mb-3">
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                      <SafeImage src={artwork.image_url} alt={artwork.title} fill sizes="56px" className="object-cover" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{artwork.title}</div>
                      <div className="text-canvas-muted text-xs">{artwork.seller?.name} • Qty: {artwork.quantity}</div>
                      <div className="font-bold text-teal text-sm">₹{(artwork.listing_price ?? 0).toLocaleString('en-IN')}</div>
                      {/* {artwork.offer && <div className="text-xs text-mustard">{artwork.offer.discount_percentage}% Off till {new Date(artwork.offer.valid_until).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</div>} */}
                    </div>
                  </div>
                  <div className="flex gap-2 text-xs">
                    {/* <button onClick={() => { setOfferModal({ artwork }); setOfferDiscount(''); setOfferUntil('') }} className="text-teal font-semibold">[{artwork.offer ? 'Edit' : 'Add'} Offer]</button> */}
                    <button onClick={() => { setEditPriceModal({ artwork }); setEditPriceInput(String(artwork.listing_price || '')) }} className="text-teal font-semibold">[Edit Price]</button>
                    <button onClick={() => handleRemoveListing(artwork.id)} className="text-red-500 font-semibold">[Remove]</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      {/* Shipping Addresses */}
      <section id="shipping-addresses" className="bg-white rounded-2xl border border-canvas-border shadow-card overflow-hidden">
        <div className="px-6 py-4 border-b border-canvas-border">
          <h2 className="font-semibold text-canvas-dark flex items-center gap-2">
            <MapPin className="w-4 h-4 text-teal" />
            Shipping Addresses (Order Fulfillment)
          </h2>
        </div>
        {allOrders.filter(o => o.shipping_address).length === 0 ? (
          <div className="p-8 text-center text-canvas-muted">No orders with shipping addresses found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Artwork</th>
                  <th>Customer Name</th>
                  <th>Status</th>
                  <th>Shipping Address</th>
                </tr>
              </thead>
              <tbody>
                {allOrders
                  .filter((order: any) => order.shipping_address)
                  .map((order: any) => (
                  <tr key={order.id}>
                    <td className="font-mono text-xs text-canvas-muted">{order.id.split('-')[0].toUpperCase()}</td>
                    <td className="font-medium text-sm">{order.artwork?.title}</td>
                    <td>
                      <div className="text-sm font-medium">{order.user?.name}</div>
                      <div className="text-xs text-canvas-muted">{order.user?.email}</div>
                    </td>
                    <td>
                      {order.payment_status === 'confirmed' ? (
                        <span className="status-badge badge-listed">✅ Confirmed</span>
                      ) : order.payment_status === 'pending' ? (
                        <span className="status-badge badge-pending">⏳ Pending</span>
                      ) : (
                        <span className="status-badge badge-rejected">❌ Declined</span>
                      )}
                    </td>
                    <td className="text-sm whitespace-pre-wrap max-w-xs">{order.shipping_address}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Approve + Price Modal */}
      {priceModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md animate-slide-up">
            <h3 className="font-display font-bold text-lg mb-1">Approve Artwork</h3>
            <p className="text-canvas-muted text-sm mb-4">Set the public listing price for <strong>{priceModal.artwork.title}</strong>.</p>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1.5">Seller Requested: ₹{priceModal.artwork.seller_requested_price.toLocaleString('en-IN')}</label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-canvas-muted" />
                <input
                  type="number"
                  value={priceInput}
                  onChange={e => setPriceInput(e.target.value)}
                  className="input-field"
                  style={{ paddingLeft: '2.25rem' }}
                  placeholder="Set listing price"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setPriceModal(null)} className="btn-outline flex-1">Cancel</button>
              <button onClick={confirmApprove} disabled={!!approvingId} className="btn-teal flex-1 flex items-center justify-center gap-2">
                {approvingId ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                Approve & List
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Price Modal */}
      {editPriceModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md animate-slide-up">
            <h3 className="font-display font-bold text-lg mb-1">Edit Listing Price</h3>
            <p className="text-canvas-muted text-sm mb-4">Update the public listing price for <strong>{editPriceModal.artwork.title}</strong>.</p>
            <div className="mb-4">
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-canvas-muted" />
                <input
                  type="number"
                  value={editPriceInput}
                  onChange={e => setEditPriceInput(e.target.value)}
                  className="input-field"
                  style={{ paddingLeft: '2.25rem' }}
                  placeholder="Set new listing price"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setEditPriceModal(null)} className="btn-outline flex-1">Cancel</button>
              <button onClick={confirmEditPrice} disabled={!!editingPriceId} className="btn-teal flex-1 flex items-center justify-center gap-2">
                {editingPriceId ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Offer Modal */}
      {/* {offerModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md animate-slide-up">
            <h3 className="font-display font-bold text-lg mb-1">Apply Offer</h3>
            <p className="text-canvas-muted text-sm mb-4">Set a discount on <strong>{offerModal.artwork.title}</strong>.</p>
            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Discount % (1–99)</label>
                <input type="number" min="1" max="99" value={offerDiscount} onChange={e => setOfferDiscount(e.target.value)} className="input-field" placeholder="e.g. 20" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Valid Until</label>
                <input type="datetime-local" value={offerUntil} onChange={e => setOfferUntil(e.target.value)} className="input-field" />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setOfferModal(null)} className="btn-outline flex-1">Cancel</button>
              <button onClick={handleAddOffer} className="btn-teal flex-1 flex items-center justify-center gap-2">
                <Tag className="w-4 h-4" /> Apply Offer
              </button>
            </div>
          </div>
        </div>
      )} */}

      {/* Chat Modal */}
      {chatArtwork && (
        <ArtworkChatModal
          artwork={chatArtwork}
          currentUser={user}
          onClose={() => setChatArtwork(null)}
        />
      )}
    </div>
  )
}
