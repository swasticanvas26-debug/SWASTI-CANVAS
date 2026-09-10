'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, Loader2, Image as ImageIcon, Search, X } from 'lucide-react'
import toast from 'react-hot-toast'
import Image from 'next/image'
import SafeImage from '@/components/shared/SafeImage'

const CATEGORIES = ['Abstract', 'Landscape', 'Portrait', 'Floral', 'Geometric', 'Mixed Media']

export default function AdminNewArtworkForm() {
  const router = useRouter()
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Abstract',
    image_url: '',
    seller_requested_price: '',
    listing_price: '',
    quantity: '1',
  })
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState('')
  const [showGallery, setShowGallery] = useState(false)
  const [galleryImages, setGalleryImages] = useState<{name: string, url: string}[]>([])
  const [galleryLoading, setGalleryLoading] = useState(false)

  const openGallery = async () => {
    setShowGallery(true)
    if (galleryImages.length > 0) return
    setGalleryLoading(true)
    try {
      const res = await fetch('/api/storage/list')
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setGalleryImages(data.files || [])
    } catch (e: any) {
      toast.error('Failed to load storage gallery')
    } finally {
      setGalleryLoading(false)
    }
  }

  const selectImage = (url: string) => {
    setForm(f => ({ ...f, image_url: url }))
    setPreview(url)
    setShowGallery(false)
  }

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
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1.5">Image URL</label>
            <div className="flex gap-2">
              <input
                type="url"
                required
                value={form.image_url}
                onChange={e => { setForm(f => ({ ...f, image_url: e.target.value })); setPreview(e.target.value) }}
                placeholder="https://… (Supabase Storage URL or public URL)"
                className="input-field flex-1"
              />
              <button
                type="button"
                onClick={openGallery}
                className="btn-outline flex items-center justify-center px-4"
                title="Browse Storage"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-canvas-muted mt-1">Paste a public URL or browse your Supabase storage.</p>
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

      {/* Gallery Modal */}
      {showGallery && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-4xl max-h-[80vh] flex flex-col animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-xl">Select from Storage</h3>
              <button onClick={() => setShowGallery(false)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                <X className="w-5 h-5 text-canvas-muted" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto min-h-0 -mx-6 px-6">
              {galleryLoading ? (
                <div className="flex flex-col items-center justify-center h-48 text-canvas-muted">
                  <Loader2 className="w-8 h-8 animate-spin mb-4" />
                  <p>Loading gallery...</p>
                </div>
              ) : galleryImages.length === 0 ? (
                <div className="text-center py-12 text-canvas-muted">
                  <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p>No images found in the storage bucket.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 pb-4">
                  {galleryImages.map((img) => (
                    <button
                      key={img.name}
                      type="button"
                      onClick={() => selectImage(img.url)}
                      className="group relative aspect-square rounded-xl overflow-hidden bg-gray-100 border-2 border-transparent hover:border-teal transition-all focus:outline-none focus:ring-2 focus:ring-teal focus:ring-offset-2"
                    >
                      <SafeImage src={img.url} alt={img.name} fill className="object-cover" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <span className="opacity-0 group-hover:opacity-100 bg-teal text-white text-xs font-medium px-2 py-1 rounded shadow-sm transition-opacity">Select</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
