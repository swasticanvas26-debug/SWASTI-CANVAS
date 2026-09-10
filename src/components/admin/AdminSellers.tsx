'use client'

import { useState } from 'react'
import { Check, X, Loader2, Save } from 'lucide-react'
import toast from 'react-hot-toast'
import { clsx } from 'clsx'
import type { User } from '@/lib/types'

interface SellerWithStats extends User {
  used_quota: number
}

interface AdminSellersProps {
  sellers: SellerWithStats[]
}

export default function AdminSellers({ sellers: initialSellers }: AdminSellersProps) {
  const [sellers, setSellers] = useState<SellerWithStats[]>(initialSellers)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  
  // Store pending quota edits locally before saving
  const [quotaEdits, setQuotaEdits] = useState<Record<string, number>>({})

  const handleToggleStatus = async (sellerId: string, currentEnabled: boolean) => {
    setUpdatingId(sellerId)
    try {
      const res = await fetch(`/api/admin/sellers/${sellerId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listing_enabled: !currentEnabled }),
      })
      if (!res.ok) throw new Error((await res.json()).error)
      
      setSellers(sellers.map(s => s.id === sellerId ? { ...s, listing_enabled: !currentEnabled } : s))
      toast.success(currentEnabled ? 'Seller disabled.' : 'Seller enabled.')
    } catch (e: any) {
      toast.error(e.message || 'Failed to update seller status')
    } finally {
      setUpdatingId(null)
    }
  }

  const handleSaveQuota = async (sellerId: string) => {
    const newQuota = quotaEdits[sellerId]
    if (newQuota === undefined) return
    if (newQuota < 0) {
      toast.error('Quota cannot be negative')
      return
    }

    setUpdatingId(sellerId)
    try {
      const res = await fetch(`/api/admin/sellers/${sellerId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listing_quota: newQuota }),
      })
      if (!res.ok) throw new Error((await res.json()).error)
      
      setSellers(sellers.map(s => s.id === sellerId ? { ...s, listing_quota: newQuota } : s))
      setQuotaEdits(prev => {
        const next = { ...prev }
        delete next[sellerId]
        return next
      })
      toast.success('Quota updated successfully!')
    } catch (e: any) {
      toast.error(e.message || 'Failed to update quota')
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-canvas-dark">Seller Management</h1>
          <p className="text-canvas-muted text-sm">Control seller permissions and listing quotas</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-canvas-border shadow-card overflow-hidden">
        <div className="hidden md:block overflow-x-auto">
          <table className="data-table w-full text-left border-collapse">
            <thead>
              <tr className="bg-canvas-bg border-b border-canvas-border">
                <th className="p-4 font-semibold text-canvas-dark">Seller</th>
                <th className="p-4 font-semibold text-canvas-dark">Listing Permission</th>
                <th className="p-4 font-semibold text-canvas-dark">Used / Quota</th>
                <th className="p-4 font-semibold text-canvas-dark">Joined On</th>
                <th className="p-4 font-semibold text-canvas-dark">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sellers.map(seller => {
                const currentQuota = seller.listing_quota ?? 0
                const editQuota = quotaEdits[seller.id] ?? currentQuota
                const isEdited = quotaEdits[seller.id] !== undefined && quotaEdits[seller.id] !== currentQuota
                
                return (
                  <tr key={seller.id} className="border-b border-canvas-border last:border-0 hover:bg-canvas-bg/50">
                    <td className="p-4">
                      <div className="text-sm font-medium">{seller.name}</div>
                      <div className="text-xs text-canvas-muted">{seller.email}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1 items-start">
                        <span className={clsx(
                          "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border",
                          seller.listing_enabled 
                            ? "bg-green-50 text-green-700 border-green-200" 
                            : "bg-red-50 text-red-700 border-red-200"
                        )}>
                          {seller.listing_enabled ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                          {seller.listing_enabled ? 'Active' : 'Disabled'}
                        </span>
                        {seller.permission_requested && !seller.listing_enabled && (
                          <span className="bg-mustard text-white text-[10px] px-2 py-0.5 rounded-full animate-pulse">
                            Requesting Access
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className={clsx(
                          "font-semibold text-sm",
                          seller.used_quota >= editQuota ? "text-red-600" : "text-canvas-dark"
                        )}>
                          {seller.used_quota}
                        </span>
                        <span className="text-canvas-muted text-sm">/</span>
                        <input 
                          type="number" 
                          min="0"
                          value={editQuota}
                          onChange={(e) => setQuotaEdits({ ...quotaEdits, [seller.id]: parseInt(e.target.value) || 0 })}
                          className="w-20 px-2 py-1 text-sm border border-canvas-border rounded-lg bg-canvas-bg focus:ring-2 focus:ring-teal focus:border-transparent outline-none transition-all"
                        />
                      </div>
                    </td>
                    <td className="p-4 text-sm text-canvas-muted">
                      {new Date(seller.created_at).toLocaleDateString('en-IN')}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleStatus(seller.id, !!seller.listing_enabled)}
                          disabled={updatingId === seller.id}
                          className={clsx(
                            "text-xs px-3 py-1.5 rounded-lg font-medium transition-colors border",
                            seller.listing_enabled 
                              ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-100" 
                              : "bg-green-50 text-green-600 border-green-200 hover:bg-green-100"
                          )}
                        >
                          {updatingId === seller.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : (seller.listing_enabled ? 'Revoke Access' : 'Grant Access')}
                        </button>
                        
                        {isEdited && (
                          <button
                            onClick={() => handleSaveQuota(seller.id)}
                            disabled={updatingId === seller.id}
                            className="btn-teal text-xs px-3 py-1.5 flex items-center gap-1"
                          >
                            {updatingId === seller.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                            Save
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
              {sellers.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-canvas-muted">
                    No sellers found on the platform.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden p-4 space-y-4">
          {sellers.map(seller => {
            const currentQuota = seller.listing_quota ?? 0
            const editQuota = quotaEdits[seller.id] ?? currentQuota
            const isEdited = quotaEdits[seller.id] !== undefined && quotaEdits[seller.id] !== currentQuota
            
            return (
              <div key={seller.id} className="border border-canvas-border rounded-xl p-4 bg-white space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold text-sm">{seller.name}</div>
                    <div className="text-xs text-canvas-muted">{seller.email}</div>
                  </div>
                  <div className="flex flex-col gap-1 items-end">
                    <span className={clsx(
                      "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border",
                      seller.listing_enabled 
                        ? "bg-green-50 text-green-700 border-green-200" 
                        : "bg-red-50 text-red-700 border-red-200"
                    )}>
                      {seller.listing_enabled ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                      {seller.listing_enabled ? 'Active' : 'Disabled'}
                    </span>
                    {seller.permission_requested && !seller.listing_enabled && (
                      <span className="bg-mustard text-white text-[10px] px-2 py-0.5 rounded-full animate-pulse">
                        Requesting Access
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between border-t border-canvas-border pt-3">
                  <div className="text-sm font-medium">Quota Usage</div>
                  <div className="flex items-center gap-2">
                    <span className={clsx("font-semibold text-sm", seller.used_quota >= editQuota ? "text-red-600" : "text-canvas-dark")}>
                      {seller.used_quota}
                    </span>
                    <span className="text-canvas-muted text-sm">/</span>
                    <input 
                      type="number" 
                      min="0"
                      value={editQuota}
                      onChange={(e) => setQuotaEdits({ ...quotaEdits, [seller.id]: parseInt(e.target.value) || 0 })}
                      className="w-20 px-2 py-1 text-sm border border-canvas-border rounded-lg bg-canvas-bg focus:ring-2 focus:ring-teal outline-none"
                    />
                  </div>
                </div>

                <div className="flex gap-2 border-t border-canvas-border pt-3">
                  <button
                    onClick={() => handleToggleStatus(seller.id, !!seller.listing_enabled)}
                    disabled={updatingId === seller.id}
                    className={clsx(
                      "flex-1 text-xs px-3 py-2 rounded-lg font-medium transition-colors border text-center flex items-center justify-center gap-1",
                      seller.listing_enabled 
                        ? "bg-red-50 text-red-600 border-red-200" 
                        : "bg-green-50 text-green-600 border-green-200"
                    )}
                  >
                    {updatingId === seller.id ? <Loader2 className="w-4 h-4 animate-spin" /> : (seller.listing_enabled ? 'Revoke Access' : 'Grant Access')}
                  </button>
                  
                  {isEdited && (
                    <button
                      onClick={() => handleSaveQuota(seller.id)}
                      disabled={updatingId === seller.id}
                      className="btn-teal flex-1 text-xs px-3 py-2 flex items-center justify-center gap-1"
                    >
                      {updatingId === seller.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      Save Quota
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
