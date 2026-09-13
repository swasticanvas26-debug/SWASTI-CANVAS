'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2, UserCircle, Brush } from 'lucide-react'
import toast from 'react-hot-toast'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

export default function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'customer' | 'seller'>('customer')
  const [otp, setOtp] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<1 | 2>(1)
  const router = useRouter()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const supabase = createSupabaseBrowserClient()
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
          }
        }
      })
      if (error) throw new Error(error.message)
      toast.success('OTP sent to your email!')
      setStep(2)
    } catch (err: any) {
      toast.error(err.message ?? 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const supabase = createSupabaseBrowserClient()
    try {
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'signup',
      })
      if (verifyError) throw new Error(verifyError.message)

      // Insert profile data by calling backend endpoint
      const res = await fetch('/api/auth/complete-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Profile setup failed')

      toast.success('Account created! Welcome to Swasti Canvas.')
      router.push('/')
      router.refresh()
    } catch (err: any) {
      toast.error(err.message ?? 'OTP verification failed')
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
            <img src="/logo.jpg" alt="Logo" className="w-14 h-14 object-cover rounded-full shadow-teal mb-3" />
            <h1 className="font-display font-bold text-2xl text-teal">SWASTI CANVAS</h1>
            <p className="text-canvas-muted text-xs tracking-widest">ART FOR EVERYONE</p>
          </div>

          <h2 className="font-display font-bold text-xl text-canvas-dark mb-1 text-center">
            {step === 1 ? 'Create Account' : 'Verify Email'}
          </h2>
          <p className="text-canvas-muted text-sm text-center mb-6">
            {step === 1 ? 'Join thousands of art lovers' : 'Enter the 6-digit OTP sent to your email'}
          </p>

          {step === 1 ? (
            <>
              {/* Role selector */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                  type="button"
                  onClick={() => setRole('customer')}
                  className={`flex flex-col items-center gap-1.5 p-4 rounded-xl border-2 transition-all ${role === 'customer' ? 'border-[#F4A47A] bg-[#F4A47A] text-white shadow-card' : 'border-canvas-border text-canvas-muted hover:border-[#F4A47A] hover:bg-[#FEF3EC] hover:text-[#F4A47A]'}`}
                >
                  <UserCircle className="w-6 h-6" />
                  <span className="text-sm font-semibold">Buyer</span>
                  <span className="text-xs opacity-90">Browse & Collect</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('seller')}
                  className={`flex flex-col items-center gap-1.5 p-4 rounded-xl border-2 transition-all ${role === 'seller' ? 'border-[#F4A47A] bg-[#F4A47A] text-white shadow-card' : 'border-canvas-border text-canvas-muted hover:border-[#F4A47A] hover:bg-[#FEF3EC] hover:text-[#F4A47A]'}`}
                >
                  <Brush className="w-6 h-6" />
                  <span className="text-sm font-semibold">Seller / Artist</span>
                  <span className="text-xs opacity-90">Sell Your Art</span>
                </button>
              </div>

              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-canvas-dark mb-1.5">Full Name</label>
                  <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="Full Name" className="input-field" />
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
                  {loading ? 'Sending OTP…' : 'Create Account'}
                </button>
              </form>
            </>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-canvas-dark mb-1.5">OTP</label>
                <input
                  type="text" required
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  className="input-field tracking-widest"
                />
              </div>
              <button type="submit" disabled={loading} className="btn-teal w-full py-3 mt-2 flex items-center justify-center gap-2 disabled:opacity-60">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {loading ? 'Verifying…' : 'Verify OTP'}
              </button>
              <button type="button" onClick={() => setStep(1)} className="w-full text-center text-sm text-canvas-muted mt-3 hover:text-teal">
                Back to Signup
              </button>
            </form>
          )}

          <p className="text-center text-sm text-canvas-muted mt-5">
            Already have an account?{' '}
            <Link href="/login" className="text-teal font-semibold hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
