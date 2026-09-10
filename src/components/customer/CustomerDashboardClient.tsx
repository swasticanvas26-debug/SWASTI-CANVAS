'use client'

import { useState } from 'react'
import ArtworkChatModal from '@/components/shared/ArtworkChatModal'
import SafeImage from '@/components/shared/SafeImage'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import {
  ShoppingBag, LifeBuoy, Star, Plus, Send,
  CheckCircle, Clock, Loader2, MessageSquare, X
} from 'lucide-react'
import { clsx } from 'clsx'
import type { AppUser } from '@/lib/auth'
import type { Order, SupportTicket } from '@/lib/types'

interface Props {
  user: AppUser
  orders: Order[]
  tickets: SupportTicket[]
  activeTab: string
}

const TABS = [
  { id: 'orders', label: 'My Orders', icon: ShoppingBag },
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
                          {order.payment_status === 'confirmed' && <span className="status-badge badge-listed">✅ Confirmed</span>}
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
                        <div className="mt-1">
                          {order.payment_status === 'confirmed' && <span className="status-badge badge-listed">✅ Confirmed</span>}
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
