'use client'

import { useState } from 'react'
import { CheckCircle2, Clock, XCircle } from 'lucide-react'
import type { Order } from '@/lib/types'

interface AdminOrderHistoryProps {
  orders: Order[]
}

export default function AdminOrderHistory({ orders }: AdminOrderHistoryProps) {
  const [activeTab, setActiveTab] = useState<'successful' | 'unsuccessful' | 'pending'>('successful')

  const successfulOrders = orders.filter(o => o.payment_status === 'confirmed')
  const unsuccessfulOrders = orders.filter(o => o.payment_status === 'declined')
  const pendingOrders = orders.filter(o => o.payment_status === 'pending')

  const getDisplayId = (id: string) => `ORD-${id.split('-')[0].toUpperCase()}`

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-canvas-dark">Order History</h1>
          <p className="text-canvas-muted text-sm">Track complete sales and order timelines</p>
        </div>
      </div>

      <div className="flex space-x-2 border-b border-canvas-border">
        {(['successful', 'unsuccessful', 'pending'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 text-sm font-semibold capitalize border-b-2 transition-colors ${
              activeTab === tab
                ? 'border-teal text-teal'
                : 'border-transparent text-canvas-muted hover:text-canvas-dark hover:border-canvas-border'
            }`}
          >
            {tab} Orders
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-canvas-border shadow-card overflow-hidden">
        <div className="hidden md:block overflow-x-auto">
          <table className="data-table w-full text-left border-collapse">
            <thead>
              <tr className="bg-canvas-bg border-b border-canvas-border">
                <th className="p-4 font-semibold text-canvas-dark">Order ID</th>
                <th className="p-4 font-semibold text-canvas-dark">Buyer</th>
                <th className="p-4 font-semibold text-canvas-dark">Placed On</th>
                {activeTab === 'successful' && <th className="p-4 font-semibold text-canvas-dark">Completed On</th>}
                {activeTab === 'unsuccessful' && <th className="p-4 font-semibold text-canvas-dark">Declined On</th>}
                {activeTab === 'unsuccessful' && <th className="p-4 font-semibold text-canvas-dark">Status/Reason</th>}
                {activeTab === 'pending' && <th className="p-4 font-semibold text-canvas-dark">Status</th>}
              </tr>
            </thead>
            <tbody>
              {(activeTab === 'successful' ? successfulOrders : activeTab === 'unsuccessful' ? unsuccessfulOrders : pendingOrders).map(order => (
                <tr key={order.id} className="border-b border-canvas-border last:border-0 hover:bg-canvas-bg/50">
                  <td className="p-4 font-mono font-medium text-sm">{getDisplayId(order.id)}</td>
                  <td className="p-4">
                    <div className="text-sm font-medium">{order.user?.name}</div>
                    <div className="text-xs text-canvas-muted">{order.user?.email}</div>
                  </td>
                  <td className="p-4 text-sm text-canvas-muted">
                    {new Date(order.purchased_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                  </td>
                  
                  {activeTab === 'successful' && (
                    <td className="p-4 text-sm text-canvas-muted">
                      {new Date(order.updated_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                    </td>
                  )}

                  {activeTab === 'unsuccessful' && (
                    <>
                      <td className="p-4 text-sm text-canvas-muted">
                        {new Date(order.updated_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded-full border border-red-100">
                          <XCircle className="w-3.5 h-3.5" />
                          Rejected by Admin
                        </span>
                      </td>
                    </>
                  )}

                  {activeTab === 'pending' && (
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-mustard bg-yellow-50 px-2 py-1 rounded-full border border-yellow-100">
                        <Clock className="w-3.5 h-3.5" />
                        Awaiting Verification
                      </span>
                    </td>
                  )}
                </tr>
              ))}
              
              {(activeTab === 'successful' && successfulOrders.length === 0) ||
               (activeTab === 'unsuccessful' && unsuccessfulOrders.length === 0) ||
               (activeTab === 'pending' && pendingOrders.length === 0) ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-canvas-muted">
                    No {activeTab} orders found.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden p-4 space-y-4">
          {(activeTab === 'successful' ? successfulOrders : activeTab === 'unsuccessful' ? unsuccessfulOrders : pendingOrders).map(order => (
            <div key={order.id} className="border border-canvas-border rounded-xl p-4 space-y-3 bg-white">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-mono font-medium text-sm text-teal mb-1">{getDisplayId(order.id)}</div>
                  <div className="font-medium text-sm">{order.user?.name}</div>
                  <div className="text-xs text-canvas-muted">{order.user?.email}</div>
                </div>
                {activeTab === 'successful' && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                {activeTab === 'unsuccessful' && <XCircle className="w-5 h-5 text-red-500" />}
                {activeTab === 'pending' && <Clock className="w-5 h-5 text-mustard" />}
              </div>
              
              <div className="text-xs text-canvas-muted space-y-1">
                <div>Placed: {new Date(order.purchased_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</div>
                {activeTab !== 'pending' && (
                  <div>
                    {activeTab === 'successful' ? 'Completed' : 'Declined'}: {new Date(order.updated_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                  </div>
                )}
              </div>

              {activeTab === 'unsuccessful' && (
                <div className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-1.5 rounded-lg inline-block border border-red-100">
                  Rejected by Admin
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
