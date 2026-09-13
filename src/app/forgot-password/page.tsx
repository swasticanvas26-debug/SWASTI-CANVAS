'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleRequestLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const supabase = createSupabaseBrowserClient()
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/api/auth/callback?next=/reset-password`,
      })
      if (error) throw new Error(error.message)
      setSuccess(true)
      toast.success('Reset link sent to your email!')
    } catch (err: any) {
      toast.error(err.message ?? 'Failed to send reset link')
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
          </div>

          <h2 className="font-display font-bold text-xl text-canvas-dark mb-1 text-center">
            Reset Password
          </h2>
          <p className="text-canvas-muted text-sm text-center mb-6">
            {success ? 'Check your email for the reset link.' : 'Enter your email to receive a password reset link.'}
          </p>

          {!success ? (
            <form onSubmit={handleRequestLink} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-canvas-dark mb-1.5">Email</label>
                <input
                  type="email" required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input-field"
                />
              </div>
              <button type="submit" disabled={loading} className="btn-teal w-full py-3 mt-2 flex items-center justify-center gap-2 disabled:opacity-60">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {loading ? 'Sending Link…' : 'Send Reset Link'}
              </button>
            </form>
          ) : (
            <div className="flex justify-center">
              <button onClick={() => setSuccess(false)} className="btn-outline-teal w-full py-3 mt-2">
                Try another email
              </button>
            </div>
          )}

          <p className="text-center text-sm text-canvas-muted mt-5">
            Remembered your password?{' '}
            <Link href="/login" className="text-teal font-semibold hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
