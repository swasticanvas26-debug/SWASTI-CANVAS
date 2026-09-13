'use client'

import { useState } from 'react'
import ArtworkChatModal from '@/components/shared/ArtworkChatModal'
import SafeImage from '@/components/shared/SafeImage'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import {
  ShoppingBag, LifeBuoy, Star, Plus, Send,
  CheckCircle, Clock, Loader2, MessageSquare, X, MapPin, User as UserIcon
} from 'lucide-react'
import { clsx } from 'clsx'
import type { AppUser } from '@/lib/auth'
import { parseAddress, type AddressDetails, type Order, type SupportTicket } from '@/lib/types'

interface Props {
  user: AppUser
  orders: Order[]
  tickets: SupportTicket[]
  activeTab: string
}

const TABS = [
  { id: 'orders', label: 'My Orders', icon: ShoppingBag },
  { id: 'profile', label: 'My Profile', icon: UserIcon },
  { id: 'support', label: 'Help Center', icon: LifeBuoy },
  { id: 'upgrade', label: 'Upgrade Account', icon: Star },
]

export default function CustomerDashboardClient({ user, orders, tickets, activeTab }: Props) {
  const router = useRouter()
  const [tab, setTab] = useState(activeTab)
  const [ticketForm, setTicketForm] = useState({ subject: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [upgrading, setUpgrading] = useState(false)
  const [showTicketForm, setShowTicketForm] = useState(false)

  const initialAddress = parseAddress(user.address) || {
    fullName: user.name || '',
    phone: '',
    pincode: '',
    houseNo: '',
    area: '',
    landmark: '',
    city: '',
    state: ''
  }
  const [addressObj, setAddressObj] = useState<AddressDetails>(initialAddress)
  const [savingAddress, setSavingAddress] = useState(false)

  const [reviewOrder, setReviewOrder] = useState<Order | null>(null)
  const [reviewForm, setReviewForm] = useState({ website_rating: 5, website_comment: '', artwork_rating: 5, artwork_comment: '' })
  const [submittingReview, setSubmittingReview] = useState(false)

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reviewOrder) return
    setSubmittingReview(true)
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: reviewOrder.id,
          artwork_id: reviewOrder.artwork_id,
          ...reviewForm
        }),
      })
      if (!res.ok) throw new Error((await res.json()).error)
      toast.success('Review submitted successfully!')
      setReviewOrder(null)
      router.refresh()
    } catch (e: any) { toast.error(e.message) }
    finally { setSubmittingReview(false) }
  }

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingAddress(true)
    try {
      const res = await fetch('/api/user/address', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: JSON.stringify(addressObj) }),
      })
      if (!res.ok) throw new Error((await res.json()).error)
      toast.success('Address saved successfully!')
      router.refresh()
    } catch (e: any) { toast.error(e.message) }
    finally { setSavingAddress(false) }
  }

  const handleTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ticketForm),
      })
      if (!res.ok) throw new Error((await res.json()).error)
      toast.success('Ticket submitted!')
      setTicketForm({ subject: '', message: '' })
      setShowTicketForm(false)
      router.refresh()
    } catch (e: any) { toast.error(e.message) }
    finally { setSubmitting(false) }
  }

  const handleUpgrade = async () => {
    setUpgrading(true)
    try {
      const res = await fetch('/api/seller-request', { method: 'POST' })
      if (!res.ok) throw new Error((await res.json()).error)
      toast.success('You are now a Seller! Refresh to see your seller dashboard.')
      router.refresh()
    } catch (e: any) { toast.error(e.message) }
    finally { setUpgrading(false) }
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="font-display font-bold text-2xl text-canvas-dark">My Dashboard</h1>
        <p className="text-canvas-muted text-sm">Welcome, {user.name}</p>
      </div>

      {/* Tab Nav */}
      <div className="flex gap-1 bg-canvas-bg rounded-xl p-1 mb-6 border border-canvas-border w-fit">
        {TABS.map(t => {
          if (t.id === 'upgrade' && user.role !== 'customer') return null
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={clsx(
                'flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                tab === t.id ? 'bg-white text-teal shadow-card' : 'text-canvas-muted hover:text-teal'
              )}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          )
        })}
      </div>

      {/* Orders Tab */}
      {tab === 'orders' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-canvas-border shadow-card p-10 text-center">
              <ShoppingBag className="w-10 h-10 mx-auto mb-3 text-canvas-muted opacity-40" />
              <p className="text-canvas-muted">No orders yet.</p>
              <a href="/artworks" className="btn-teal mt-4 inline-block text-sm">Browse Artworks</a>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-canvas-border shadow-card overflow-hidden">
              {/* Desktop */}
              <div className="hidden md:block overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Artwork</th>
                      <th>Title</th>
                      <th>Artist</th>
                      <th>Amount Paid</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order: any) => (
                      <tr key={order.id}>
                        <td className="font-mono text-xs text-canvas-muted whitespace-nowrap">ORD-{order.id.split('-')[0].toUpperCase()}</td>
                        <td>
                          {order.artwork?.image_url && (
                            <div className="relative w-14 h-10 rounded-lg overflow-hidden bg-gray-100">
                              <SafeImage src={order.artwork.image_url} alt={order.artwork?.title ?? ''} fill sizes="56px" className="object-cover" />
                            </div>
                          )}
                        </td>
                        <td className="font-medium">{order.artwork?.title}</td>
                        <td className="text-canvas-muted">{order.artwork?.seller?.name}</td>
                        <td className="font-semibold text-teal">₹{order.amount_paid.toLocaleString('en-IN')}</td>
                        <td>
                          {order.payment_status === 'confirmed' && (
                            <div className="flex items-center gap-2">
                              <span className="status-badge badge-listed">✅ Confirmed</span>
                              {!order.order_reviews || order.order_reviews.length === 0 ? (
                                <button onClick={() => setReviewOrder(order)} className="text-xs font-semibold text-teal hover:underline ml-2">Leave Review</button>
                              ) : (
                                <span className="text-xs text-canvas-muted ml-2">Reviewed</span>
                              )}
                            </div>
                          )}
                          {order.payment_status === 'pending' && <span className="status-badge badge-pending">⏳ Pending</span>}
                          {order.payment_status === 'declined' && <span className="status-badge badge-rejected">❌ Declined</span>}
                        </td>
                        <td className="text-canvas-muted text-xs">{new Date(order.purchased_at).toLocaleDateString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Mobile */}
              <div className="md:hidden p-4 space-y-3">
                {orders.map((order: any) => (
                  <div key={order.id} className="border border-canvas-border rounded-xl p-4 flex flex-col gap-3">
                    <div className="font-mono text-xs text-teal font-medium">ORD-{order.id.split('-')[0].toUpperCase()}</div>
                    <div className="flex gap-3">
                      {order.artwork?.image_url && (
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                          <SafeImage src={order.artwork.image_url} alt="" fill sizes="64px" className="object-cover" />
                        </div>
                      )}
                      <div>
                        <div className="font-semibold text-sm">{order.artwork?.title}</div>
                        <div className="text-canvas-muted text-xs">{order.artwork?.seller?.name}</div>
                        <div className="font-bold text-teal mt-1">₹{order.amount_paid.toLocaleString('en-IN')}</div>
                        <div className="mt-1 flex items-center gap-2">
                          {order.payment_status === 'confirmed' && (
                            <>
                              <span className="status-badge badge-listed">✅ Confirmed</span>
                              {!order.order_reviews || order.order_reviews.length === 0 ? (
                                <button onClick={() => setReviewOrder(order)} className="text-xs font-semibold text-teal hover:underline">Leave Review</button>
                              ) : (
                                <span className="text-xs text-canvas-muted">Reviewed</span>
                              )}
                            </>
                          )}
                          {order.payment_status === 'pending' && <span className="status-badge badge-pending">⏳ Pending</span>}
                          {order.payment_status === 'declined' && <span className="status-badge badge-rejected">❌ Declined</span>}
                        </div>
                        <div className="text-xs text-canvas-muted mt-1">{new Date(order.purchased_at).toLocaleDateString('en-IN')}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Profile Tab */}
      {tab === 'profile' && (
        <div className="max-w-xl">
          <div className="bg-white rounded-2xl border border-canvas-border shadow-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal to-teal-light flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-display font-bold text-lg">Shipping Address</h2>
                <p className="text-canvas-muted text-sm">Save your address for faster checkout</p>
              </div>
            </div>
            <form onSubmit={handleAddressSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Full Name</label>
                  <input required type="text" value={addressObj.fullName} onChange={e => setAddressObj({...addressObj, fullName: e.target.value})} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Mobile Number</label>
                  <input required type="tel" pattern="[0-9]{10}" title="10 digit mobile number" value={addressObj.phone} onChange={e => setAddressObj({...addressObj, phone: e.target.value})} className="input-field" placeholder="10-digit number" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">PIN Code</label>
                  <input required type="text" pattern="[0-9]{6}" title="6 digit PIN code" value={addressObj.pincode} onChange={e => setAddressObj({...addressObj, pincode: e.target.value})} className="input-field" placeholder="6 digits" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Flat, House no., Building</label>
                  <input required type="text" value={addressObj.houseNo} onChange={e => setAddressObj({...addressObj, houseNo: e.target.value})} className="input-field" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1.5">Area, Street, Sector, Village</label>
                  <input required type="text" value={addressObj.area} onChange={e => setAddressObj({...addressObj, area: e.target.value})} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Landmark (Optional)</label>
                  <input type="text" value={addressObj.landmark || ''} onChange={e => setAddressObj({...addressObj, landmark: e.target.value})} className="input-field" placeholder="E.g. near apollo hospital" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Town/City</label>
                  <input required type="text" value={addressObj.city} onChange={e => setAddressObj({...addressObj, city: e.target.value})} className="input-field" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1.5">State</label>
                  <input required type="text" value={addressObj.state} onChange={e => setAddressObj({...addressObj, state: e.target.value})} className="input-field" />
                </div>
              </div>
              <button
                type="submit"
                disabled={savingAddress}
                className="btn-teal w-full py-3 flex items-center justify-center gap-2 font-bold disabled:opacity-50 mt-2"
              >
                {savingAddress ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                {savingAddress ? 'Saving…' : 'Save Address'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Support Tab */}
      {tab === 'support' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-canvas-dark">Help Center Tickets</h2>
            <button onClick={() => setShowTicketForm(true)} className="btn-teal text-sm flex items-center gap-1.5">
              <Plus className="w-4 h-4" /> New Ticket
            </button>
          </div>
          {tickets.length === 0 ? (
            <div className="bg-white rounded-2xl border border-canvas-border p-8 text-center text-canvas-muted">No tickets yet.</div>
          ) : (
            <div className="space-y-3">
              {tickets.map(ticket => (
                <div key={ticket.id} className="bg-white rounded-2xl border border-canvas-border shadow-card p-5">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-start gap-2">
                      <MessageSquare className="w-4 h-4 text-teal mt-0.5" />
                      <div>
                        <div className="font-semibold text-sm">{ticket.subject}</div>
                        <div className="text-xs text-canvas-muted">{new Date(ticket.created_at).toLocaleDateString('en-IN')}</div>
                      </div>
                    </div>
                    <span className={clsx('status-badge', ticket.status === 'resolved' ? 'badge-listed' : 'badge-pending')}>
                      {ticket.status === 'resolved' ? <CheckCircle className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
                      {ticket.status}
                    </span>
                  </div>
                  <p className="text-sm text-canvas-muted">{ticket.message}</p>
                  {ticket.admin_reply && (
                    <div className="mt-3 bg-teal-pale rounded-xl p-3 border-l-4 border-teal">
                      <div className="text-xs font-semibold text-teal mb-1">Admin Reply:</div>
                      <p className="text-sm">{ticket.admin_reply}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Upgrade Tab */}
      {tab === 'upgrade' && user.role === 'customer' && (
        <div className="max-w-xl">
          <div className="bg-white rounded-2xl border border-canvas-border shadow-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-mustard to-peach flex items-center justify-center">
                <Star className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-display font-bold text-lg">Upgrade to Seller</h2>
                <p className="text-canvas-muted text-sm">Start selling your artwork on Swasti Canvas</p>
              </div>
            </div>
            <div className="bg-teal-pale rounded-xl p-4 mb-4 space-y-2 text-sm">
              <div className="font-semibold text-teal">What you get as a Seller:</div>
              <div>✅ Upload and sell your original artworks</div>
              <div>✅ Set your own payout price</div>
              <div>✅ Track listing status and earnings</div>
              <div>✅ Keep buying art as a customer too</div>
            </div>
            <p className="text-xs text-canvas-muted mb-4">
              Clicking the button below will instantly update your account to Seller status. Your uploaded artworks will go through admin review before going live.
            </p>
            <button
              onClick={handleUpgrade}
              disabled={upgrading}
              className="btn-mustard w-full py-3 flex items-center justify-center gap-2 font-bold"
            >
              {upgrading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Star className="w-4 h-4" />}
              {upgrading ? 'Upgrading…' : 'REQUEST SELLER ACCOUNT'}
            </button>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {reviewOrder && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl p-6 w-full max-w-lg animate-slide-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-lg">Leave a Review</h3>
              <button onClick={() => setReviewOrder(null)}><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleReviewSubmit} className="space-y-6">
              
              <div>
                <h4 className="font-semibold text-sm mb-2 text-canvas-dark">Artwork Feedback</h4>
                <textarea required rows={3} value={reviewForm.artwork_comment} onChange={e => setReviewForm(f => ({ ...f, artwork_comment: e.target.value }))} placeholder="What did you think of the artwork?" className="input-field resize-none text-sm" />
              </div>

              <div>
                <h4 className="font-semibold text-sm mb-2 text-canvas-dark">Website Experience</h4>
                <textarea required rows={2} value={reviewForm.website_comment} onChange={e => setReviewForm(f => ({ ...f, website_comment: e.target.value }))} placeholder="How was your experience using Swasti Canvas?" className="input-field resize-none text-sm" />
              </div>

              <button type="submit" disabled={submittingReview} className="btn-teal w-full py-3 flex items-center justify-center gap-2">
                {submittingReview ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {submittingReview ? 'Submitting…' : 'Submit Review'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* New Ticket Modal */}
      {showTicketForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl p-6 w-full max-w-lg animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-lg">New Support Ticket</h3>
              <button onClick={() => setShowTicketForm(false)}><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleTicketSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Subject</label>
                <input
                  type="text" required
                  value={ticketForm.subject}
                  onChange={e => setTicketForm(f => ({ ...f, subject: e.target.value }))}
                  placeholder="Brief description of your issue"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Message</label>
                <textarea
                  required rows={4}
                  value={ticketForm.message}
                  onChange={e => setTicketForm(f => ({ ...f, message: e.target.value }))}
                  placeholder="Describe your issue in detail…"
                  className="input-field resize-none"
                />
              </div>
              <button type="submit" disabled={submitting} className="btn-teal w-full py-3 flex items-center justify-center gap-2">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {submitting ? 'Submitting…' : 'Submit Ticket'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
