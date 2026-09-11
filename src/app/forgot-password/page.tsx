'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<1 | 2>(1)
  const router = useRouter()

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const supabase = createSupabaseBrowserClient()
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email)
      if (error) throw new Error(error.message)
      toast.success('OTP sent to your email!')
      setStep(2)
    } catch (err: any) {
      toast.error(err.message ?? 'Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtpAndReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const supabase = createSupabaseBrowserClient()
    try {
      // First verify the OTP
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'recovery',
      })
      if (verifyError) throw new Error(verifyError.message)

      // Then update the password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      })
      if (updateError) throw new Error(updateError.message)

      toast.success('Password reset successfully! You are now logged in.')
      router.push('/')
      router.refresh()
    } catch (err: any) {
      toast.error(err.message ?? 'Failed to reset password')
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
            {step === 1 ? 'Reset Password' : 'Enter OTP'}
          </h2>
          <p className="text-canvas-muted text-sm text-center mb-6">
            {step === 1 ? 'Enter your email to receive an OTP' : 'Enter the OTP sent to your email and your new password'}
          </p>

          {step === 1 ? (
            <form onSubmit={handleRequestOtp} className="space-y-4">
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
                {loading ? 'Sending OTP…' : 'Send OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtpAndReset} className="space-y-4">
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
              <div>
                <label className="block text-sm font-medium text-canvas-dark mb-1.5">New Password</label>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'} required
                    minLength={6}
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    className="input-field pr-10"
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-canvas-muted hover:text-teal">
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-teal w-full py-3 mt-2 flex items-center justify-center gap-2 disabled:opacity-60">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {loading ? 'Resetting…' : 'Reset Password'}
              </button>
              <button type="button" onClick={() => setStep(1)} className="w-full text-center text-sm text-canvas-muted mt-3 hover:text-teal">
                Back to Email
              </button>
            </form>
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
