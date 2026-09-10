'use client'

import { useState } from 'react'
import { CheckCircle2, Clock, XCircle } from 'lucide-react'
import type { Order } from '@/lib/types'

interface AdminOrderHistoryProps {
  orders: Order[]
}

export default function AdminOrderHistory({ orders }: AdminOrderHistoryProps) {
  const [activeTab, setActiveTab] = useState<'successful' | 'unsuccessful' | 'pending'>('successful')
  const [zoomImage, setZoomImage] = useState<string | null>(null)

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
                <th className="p-4 font-semibold text-canvas-dark">Artwork</th>
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
                    {order.artwork?.image_url && (
                      <div 
                        className="relative w-16 h-12 rounded-lg overflow-hidden bg-gray-100 cursor-pointer border border-canvas-border shadow-sm hover:ring-2 hover:ring-teal/50 transition-all"
                        onClick={() => {
                          if (order.artwork?.image_url.includes('photos.app.goo.gl') || order.artwork?.image_url.includes('photos.google.com')) {
                            window.open(order.artwork.image_url, '_blank')
                          } else {
                            setZoomImage(order.artwork?.image_url || null)
                          }
                        }}
                        title="Click to view image"
                      >
                        {order.artwork.image_url.includes('drive.google.com') ? (
                          <img src={order.artwork.image_url.includes('/view') ? order.artwork.image_url.replace(/\/file\/d\/(.+?)\/view.*/, '/thumbnail?id=$1&sz=w200') : order.artwork.image_url} alt="Artwork" className="w-full h-full object-cover" />
                        ) : order.artwork.image_url.includes('photos.app.goo.gl') || order.artwork.image_url.includes('photos.google.com') ? (
                          <div className="w-full h-full flex flex-col items-center justify-center text-[10px] text-canvas-muted bg-gray-50">
                            <span className="text-lg">📸</span>
                          </div>
                        ) : (
                          <img src={order.artwork.image_url} alt="Artwork" className="w-full h-full object-cover" />
                        )}
                      </div>
                    )}
                  </td>
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
                  <td colSpan={7} className="p-8 text-center text-canvas-muted">
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
                <div className="flex gap-3">
                  {order.artwork?.image_url && (
                    <div 
                      className="relative w-14 h-14 rounded-lg overflow-hidden bg-gray-100 shrink-0 cursor-pointer border border-canvas-border"
                      onClick={() => {
                        if (order.artwork?.image_url.includes('photos.app.goo.gl') || order.artwork?.image_url.includes('photos.google.com')) {
                          window.open(order.artwork.image_url, '_blank')
                        } else {
                          setZoomImage(order.artwork?.image_url || null)
                        }
                      }}
                    >
                      {order.artwork.image_url.includes('drive.google.com') ? (
                        <img src={order.artwork.image_url.includes('/view') ? order.artwork.image_url.replace(/\/file\/d\/(.+?)\/view.*/, '/thumbnail?id=$1&sz=w200') : order.artwork.image_url} alt="Artwork" className="w-full h-full object-cover" />
                      ) : order.artwork.image_url.includes('photos.app.goo.gl') || order.artwork.image_url.includes('photos.google.com') ? (
                        <div className="w-full h-full flex flex-col items-center justify-center text-[10px] text-canvas-muted bg-gray-50"><span className="text-xl">📸</span></div>
                      ) : (
                        <img src={order.artwork.image_url} alt="Artwork" className="w-full h-full object-cover" />
                      )}
                    </div>
                  )}
                  <div>
                    <div className="font-mono font-medium text-sm text-teal mb-0.5">{getDisplayId(order.id)}</div>
                    <div className="font-medium text-sm">{order.user?.name}</div>
                    <div className="text-xs text-canvas-muted">{order.user?.email}</div>
                  </div>
                </div>
                {activeTab === 'successful' && <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />}
                {activeTab === 'unsuccessful' && <XCircle className="w-5 h-5 text-red-500 shrink-0" />}
                {activeTab === 'pending' && <Clock className="w-5 h-5 text-mustard shrink-0" />}
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

      {/* Image Zoom Modal */}
      {zoomImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setZoomImage(null)}
        >
          <div className="relative max-w-5xl w-full h-full flex items-center justify-center">
            <button 
              onClick={() => setZoomImage(null)} 
              className="absolute top-4 right-4 sm:top-8 sm:right-8 p-2 text-white/70 hover:text-white transition-colors"
            >
              <XCircle className="w-8 h-8" />
            </button>
            <img 
              src={zoomImage.includes('/view') ? zoomImage.replace(/\/file\/d\/(.+?)\/view.*/, '/thumbnail?id=$1&sz=w2000') : zoomImage}
              alt="Zoomed Artwork"
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl" 
            />
          </div>
        </div>
      )}
    </div>
  )
}
