'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, Loader2, X } from 'lucide-react'
import toast from 'react-hot-toast'
import SafeImage from '@/components/shared/SafeImage'

const CATEGORIES = ['Landscape', 'Abstract', 'Animal & Birds', 'Religious', 'Figurative', 'Indian', 'Other painting', 'Reprints or printed']

export default function AdminNewArtworkForm() {
  const router = useRouter()
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Landscape',
    image_url: '',
    seller_requested_price: '',
    listing_price: '',
    quantity: '1',
    artwork_type: 'original',
  })
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/artworks/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          seller_requested_price: parseFloat(form.seller_requested_price),
          listing_price: parseFloat(form.listing_price),
          quantity: parseInt(form.quantity),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success('Artwork listed successfully!')
      router.push('/admin')
    } catch (e: any) { toast.error(e.message) }
    finally { setLoading(false) }
  }

  return (
    <div className="max-w-2xl animate-fade-in">
      <div className="mb-6">
        <h1 className="font-display font-bold text-2xl text-canvas-dark">List New Artwork</h1>
        <p className="text-canvas-muted text-sm mt-0.5">Admin-uploaded artworks go live immediately.</p>
      </div>

      <div className="bg-white rounded-2xl border border-canvas-border shadow-card p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image preview */}
          {preview && (
            <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100 mb-2">
              <SafeImage src={preview} alt="Preview" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1.5">Image URL</label>
            <input
              type="url"
              required
              value={form.image_url}
              onChange={e => {
                const val = e.target.value
                setForm(f => ({ ...f, image_url: val }))
                if (val === '' || val.startsWith('https://drive.google.com/')) {
                  setPreview(val)
                } else {
                  setPreview('')
                }
              }}
              placeholder="https://drive.google.com/..."
              className="input-field"
            />
            {form.image_url && !form.image_url.startsWith('https://drive.google.com/') && (
              <p className="text-xs text-red-500 mt-1">Please provide a valid Google Drive link.</p>
            )}
            <p className="text-xs text-canvas-muted mt-1">Paste a Google Drive shared link.</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Title</label>
            <input type="text" required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Sunset Bloom" className="input-field" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Category</label>
            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="input-field">
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Artwork Type</label>
            <select value={form.artwork_type} onChange={e => setForm(f => ({ ...f, artwork_type: e.target.value }))} className="input-field">
              <option value="original">🎨 Original</option>
              <option value="repainted">🖌️ Repainted</option>
            </select>
            <p className="text-xs text-canvas-muted mt-1">Is this an original creation or a repainted/reproduction artwork?</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Description</label>
            <textarea rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Describe the artwork…" className="input-field resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Seller Payout (₹)</label>
              <input type="number" required min="1" value={form.seller_requested_price} onChange={e => setForm(f => ({ ...f, seller_requested_price: e.target.value }))} placeholder="10000" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Listing Price (₹)</label>
              <input type="number" required min="1" value={form.listing_price} onChange={e => setForm(f => ({ ...f, listing_price: e.target.value }))} placeholder="15000" className="input-field" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1.5">Quantity (Stock)</label>
              <input type="number" required min="1" value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))} placeholder="1" className="input-field" />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-teal w-full py-3 flex items-center justify-center gap-2 mt-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {loading ? 'Listing…' : 'List Artwork Now'}
          </button>
        </form>
      </div>

    </div>
  )
}
