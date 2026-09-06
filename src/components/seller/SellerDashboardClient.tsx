'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import {
  Upload, Loader2, PackageSearch, Package, CheckCircle2, ShoppingBag, Plus, X
} from 'lucide-react'
import type { Artwork } from '@/lib/types'
import type { AppUser } from '@/lib/auth'
import { clsx } from 'clsx'

const CATEGORIES = ['Abstract', 'Landscape', 'Portrait', 'Floral', 'Geometric', 'Mixed Media']

interface Props {
  user: AppUser
  artworks: Artwork[]
  stats: { total: number; pending: number; listed: number; sold: number }
}

const STATUS_COLORS: Record<string, string> = {
  pending_approval: 'badge-pending',
  listed: 'badge-listed',
  rejected: 'badge-rejected',
  sold: 'badge-sold',
}

export default function SellerDashboardClient({ user, artworks, stats }: Props) {
  const router = useRouter()
  const [showUpload, setShowUpload] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', category: 'Abstract', image_url: '', seller_requested_price: '', quantity: '1' })
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState('')

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/artworks/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, seller_requested_price: parseFloat(form.seller_requested_price), quantity: parseInt(form.quantity) }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success('Artwork submitted for review!')
      setShowUpload(false)
      setForm({ title: '', description: '', category: 'Abstract', image_url: '', seller_requested_price: '', quantity: '1' })
      setPreview('')
      router.refresh()
    } catch (e: any) { toast.error(e.message) }
    finally { setLoading(false) }
  }

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-canvas-dark">Seller Dashboard</h1>
          <p className="text-canvas-muted text-sm">Welcome back, {user.name}</p>
        </div>
        <button onClick={() => setShowUpload(true)} className="btn-teal flex items-center gap-2">
          <Plus className="w-4 h-4" /> Upload Artwork
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Uploads', value: stats.total, icon: PackageSearch, color: 'from-teal to-teal-light' },
          { label: 'Pending Review', value: stats.pending, icon: Package, color: 'from-peach to-mustard' },
          { label: 'Listed', value: stats.listed, icon: CheckCircle2, color: 'from-teal-light to-blue-accent' },
          { label: 'Sold', value: stats.sold, icon: ShoppingBag, color: 'from-mustard to-yellow-400' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-canvas-border p-4 shadow-card flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center`}>
              <s.icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-canvas-muted text-xs">{s.label}</div>
              <div className="font-bold text-xl text-canvas-dark">{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Artworks table */}
      <div className="bg-white rounded-2xl border border-canvas-border shadow-card overflow-hidden">
        <div className="px-6 py-4 border-b border-canvas-border">
          <h2 className="font-semibold text-canvas-dark">My Artworks</h2>
        </div>
        {artworks.length === 0 ? (
          <div className="p-10 text-center text-canvas-muted">
            <Upload className="w-8 h-8 mx-auto mb-3 opacity-30" />
            <p>No artworks uploaded yet.</p>
            <button onClick={() => setShowUpload(true)} className="btn-teal mt-4 text-sm">Upload Your First Artwork</button>
          </div>
        ) : (
          <>
            {/* Desktop */}
            <div className="hidden md:block overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Thumbnail</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Qty</th>
                    <th>Your Price</th>
                    <th>Listing Price</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {artworks.map(a => (
                    <tr key={a.id}>
                      <td>
                        <div className="relative w-14 h-10 rounded-lg overflow-hidden bg-gray-100">
                          <Image src={a.image_url} alt={a.title} fill className="object-cover" />
                        </div>
                      </td>
                      <td className="font-medium">{a.title}</td>
                      <td className="text-canvas-muted">{a.category}</td>
                      <td>{a.quantity}</td>
                      <td>₹{a.seller_requested_price.toLocaleString('en-IN')}</td>
                      <td>{a.listing_price ? `₹${a.listing_price.toLocaleString('en-IN')}` : <span className="text-canvas-muted text-xs">Awaiting admin</span>}</td>
                      <td>
                        <span className={clsx('status-badge', STATUS_COLORS[a.status] ?? 'badge-pending')}>
                          {a.status.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Mobile */}
            <div className="md:hidden p-4 space-y-3">
              {artworks.map(a => (
                <div key={a.id} className="border border-canvas-border rounded-xl p-4 flex gap-3">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                    <Image src={a.image_url} alt={a.title} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm truncate">{a.title}</div>
                    <div className="text-canvas-muted text-xs">{a.category} • Qty: {a.quantity}</div>
                    <div className="text-xs mt-0.5">Your price: ₹{a.seller_requested_price.toLocaleString('en-IN')}</div>
                    <span className={clsx('status-badge mt-1.5', STATUS_COLORS[a.status] ?? 'badge-pending')}>
                      {a.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl p-6 w-full max-w-lg animate-slide-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-lg">Upload New Artwork</h3>
              <button onClick={() => setShowUpload(false)} className="p-1 rounded-lg hover:bg-canvas-bg"><X className="w-5 h-5" /></button>
            </div>
            <p className="text-xs text-canvas-muted mb-4 bg-yellow-50 border border-yellow-200 rounded-xl p-3">
              Your artwork will be submitted for admin review before going live. Once approved, the admin will set the listing price.
            </p>
            <form onSubmit={handleUpload} className="space-y-3">
              {preview && (
                <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100">
                  <Image src={preview} alt="Preview" fill className="object-cover" />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium mb-1">Image URL</label>
                <input type="url" required value={form.image_url} onChange={e => { setForm(f => ({ ...f, image_url: e.target.value })); setPreview(e.target.value) }} placeholder="https://…" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input type="text" required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Artwork title" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="input-field">
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description (optional)</label>
                <textarea rows={2} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Describe your artwork…" className="input-field resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Your Requested Price (₹)</label>
                <input type="number" required min="1" value={form.seller_requested_price} onChange={e => setForm(f => ({ ...f, seller_requested_price: e.target.value }))} placeholder="8000" className="input-field" />
                <p className="text-xs text-canvas-muted mt-1">This is your payout reference. Admin sets the public listing price.</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Quantity (Stock)</label>
                <input type="number" required min="1" value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))} placeholder="1" className="input-field" />
              </div>
              <button type="submit" disabled={loading} className="btn-teal w-full py-3 flex items-center justify-center gap-2">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                {loading ? 'Submitting…' : 'Submit for Review'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
