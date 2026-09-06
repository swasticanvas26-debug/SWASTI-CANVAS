'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Palette, Loader2, UserCircle, Brush } from 'lucide-react'
import toast from 'react-hot-toast'

export default function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'customer' | 'seller'>('customer')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Registration failed')
      toast.success('Account created! Welcome to Swasti Canvas.')
      router.push('/')
      router.refresh()
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-canvas-bg flex items-center justify-center relative overflow-hidden py-10">
      <div className="splash-teal  w-[400px] h-[400px] -top-20 -left-20 opacity-50" />
      <div className="splash-peach  w-[350px] h-[350px] -bottom-20 -right-20 opacity-40" />

      <div className="relative z-10 w-full max-w-md px-4">
        <div className="glass-card p-8 animate-slide-up">
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-teal to-teal-light flex items-center justify-center shadow-teal mb-3">
              <Palette className="w-7 h-7 text-white" />
            </div>
            <h1 className="font-display font-bold text-2xl text-teal">SWASTI CANVAS</h1>
            <p className="text-canvas-muted text-xs tracking-widest">ART FOR EVERYONE</p>
          </div>

          <h2 className="font-display font-bold text-xl text-canvas-dark mb-1 text-center">Create Account</h2>
          <p className="text-canvas-muted text-sm text-center mb-6">Join thousands of art lovers</p>

          {/* Role selector */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => setRole('customer')}
              className={`flex flex-col items-center gap-1.5 p-4 rounded-xl border-2 transition-all ${role === 'customer' ? 'border-teal bg-teal-pale text-teal' : 'border-canvas-border text-canvas-muted hover:border-teal'}`}
            >
              <UserCircle className="w-6 h-6" />
              <span className="text-sm font-semibold">Buyer</span>
              <span className="text-xs opacity-70">Browse & Collect</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('seller')}
              className={`flex flex-col items-center gap-1.5 p-4 rounded-xl border-2 transition-all ${role === 'seller' ? 'border-teal bg-teal-pale text-teal' : 'border-canvas-border text-canvas-muted hover:border-teal'}`}
            >
              <Brush className="w-6 h-6" />
              <span className="text-sm font-semibold">Seller / Artist</span>
              <span className="text-xs opacity-70">Sell Your Art</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-canvas-dark mb-1.5">Full Name</label>
              <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="Anjali Sharma" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-canvas-dark mb-1.5">Email</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-canvas-dark mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="input-field pr-10"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-canvas-muted hover:text-teal">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-teal w-full py-3 mt-1 flex items-center justify-center gap-2 disabled:opacity-60">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {loading ? 'Creating Account…' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-canvas-muted mt-5">
            Already have an account?{' '}
            <Link href="/login" className="text-teal font-semibold hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
