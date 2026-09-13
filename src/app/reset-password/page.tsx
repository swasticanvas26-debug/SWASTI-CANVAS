'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const supabase = createSupabaseBrowserClient()
    try {
      // The user is already logged in securely via the magic link at this point.
      // We just need to update their password.
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      })
      if (updateError) throw new Error(updateError.message)

      toast.success('Password reset successfully! You are now logged in.')
      router.push('/dashboard') // Or redirect to home '/'
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
            Enter New Password
          </h2>
          <p className="text-canvas-muted text-sm text-center mb-6">
            Please enter your new password below.
          </p>

          <form onSubmit={handleResetPassword} className="space-y-4">
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
          </form>
        </div>
      </div>
    </div>
  )
}
