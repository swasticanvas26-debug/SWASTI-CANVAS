'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, Loader2, Send, CheckCircle, XCircle, MessageSquare } from 'lucide-react'
import toast from 'react-hot-toast'
import type { AppUser } from '@/lib/auth'
import type { SellerChat } from '@/lib/types'
import { clsx } from 'clsx'

interface Props {
  admin: AppUser
  sellers: AppUser[]
}

export default function AdminChats({ admin, sellers }: Props) {
  const [selectedSellerId, setSelectedSellerId] = useState<string | null>(null)
  const [messages, setMessages] = useState<SellerChat[]>([])
  const [loading, setLoading] = useState(false)
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  const selectedSeller = sellers.find(s => s.id === selectedSellerId)
  const requestedSellers = sellers.filter(s => s.permission_requested)
  const otherSellers = sellers.filter(s => !s.permission_requested)

  useEffect(() => {
    if (selectedSellerId) fetchMessages(selectedSellerId)
  }, [selectedSellerId])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const fetchMessages = async (sellerId: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/sellers/${sellerId}/chat`)
      if (!res.ok) throw new Error('Failed to load chat')
      const data = await res.json()
      setMessages(data.messages)
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || !selectedSellerId) return

    setSending(true)
    try {
      const res = await fetch(`/api/sellers/${selectedSellerId}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input.trim() })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to send message')
      
      setMessages(prev => [...prev, { ...data.message, sender: admin }])
      setInput('')
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setSending(false)
    }
  }

  const handleAction = async (approved: boolean) => {
    if (!selectedSellerId) return
    setActionLoading(true)
    try {
      const res = await fetch(`/api/admin/sellers/${selectedSellerId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listing_enabled: approved,
          listing_quota: approved ? 5 : 0, // Default 5 quota on approval
          permission_requested: false
        })
      })
      if (!res.ok) throw new Error('Failed to update seller')
      toast.success(approved ? 'Permission Granted!' : 'Permission Rejected')
      
      // Add a system message equivalent from admin
      await fetch(`/api/sellers/${selectedSellerId}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: approved ? '✅ Your permission request has been approved. You can now list artworks.' : '❌ Your permission request was declined.' })
      })
      
      setTimeout(() => { window.location.reload() }, 1000)
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setActionLoading(false)
    }
  }

  // Format links in message
  const renderMessageContent = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g
    const parts = text.split(urlRegex)
    return parts.map((part, i) => {
      if (part.match(urlRegex)) {
        return <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-teal-200 break-all">{part}</a>
      }
      return part
    })
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-white rounded-2xl border border-canvas-border shadow-card overflow-hidden">
      {/* Sidebar List */}
      <div className="w-80 border-r border-canvas-border flex flex-col shrink-0">
        <div className="p-4 border-b border-canvas-border">
          <h2 className="font-semibold text-lg">Seller Chats</h2>
          <p className="text-xs text-canvas-muted">Manage permissions</p>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {requestedSellers.length > 0 && (
            <div className="px-2 pt-2 pb-1 text-xs font-semibold text-canvas-muted uppercase tracking-wider">
              Pending Requests ({requestedSellers.length})
            </div>
          )}
          {requestedSellers.map(s => (
            <button
              key={s.id}
              onClick={() => setSelectedSellerId(s.id)}
              className={clsx(
                "w-full text-left px-3 py-3 rounded-xl flex items-center gap-3 transition-colors",
                selectedSellerId === s.id ? "bg-teal/10" : "hover:bg-gray-50"
              )}
            >
              <div className="w-10 h-10 rounded-full bg-mustard flex items-center justify-center text-white font-bold shrink-0">
                {s.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{s.name}</div>
                <div className="text-xs text-mustard flex items-center gap-1 font-medium">
                  <MessageSquare className="w-3 h-3" /> Action Required
                </div>
              </div>
            </button>
          ))}
          
          <div className="px-2 pt-4 pb-1 text-xs font-semibold text-canvas-muted uppercase tracking-wider">
            All Sellers
          </div>
          {otherSellers.map(s => (
            <button
              key={s.id}
              onClick={() => setSelectedSellerId(s.id)}
              className={clsx(
                "w-full text-left px-3 py-3 rounded-xl flex items-center gap-3 transition-colors",
                selectedSellerId === s.id ? "bg-teal/10" : "hover:bg-gray-50"
              )}
            >
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-canvas-dark font-bold shrink-0">
                {s.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{s.name}</div>
                <div className="text-xs text-canvas-muted truncate">
                  {s.listing_enabled ? 'Enabled' : 'Disabled'}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-[#F9FAFB]">
        {selectedSeller ? (
          <>
            {/* Chat Header */}
            <div className="px-6 py-4 border-b border-canvas-border bg-white flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-lg">{selectedSeller.name}</h3>
                <p className="text-xs text-canvas-muted">{selectedSeller.email}</p>
              </div>
              
              {selectedSeller.permission_requested && (
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleAction(true)}
                    disabled={actionLoading}
                    className="btn-teal flex items-center gap-2 px-4 py-2 text-sm"
                  >
                    <CheckCircle className="w-4 h-4" /> Approve
                  </button>
                  <button 
                    onClick={() => handleAction(false)}
                    disabled={actionLoading}
                    className="btn-outline flex items-center gap-2 px-4 py-2 text-sm border-red-200 text-red-600 hover:bg-red-50"
                  >
                    <XCircle className="w-4 h-4" /> Reject
                  </button>
                </div>
              )}
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="w-6 h-6 animate-spin text-teal" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-canvas-muted space-y-2 opacity-60">
                  <MessageSquare className="w-8 h-8" />
                  <p className="text-sm">No messages. Send a message to start.</p>
                </div>
              ) : (
                messages.map((msg, i) => {
                  const isMe = msg.sender_id === admin.id
                  return (
                    <div key={msg.id || i} className={clsx("flex flex-col", isMe ? "items-end" : "items-start")}>
                      <div className={clsx("text-[10px] mb-1 font-medium px-1", isMe ? "text-canvas-muted" : "text-canvas-dark")}>
                        {isMe ? 'You' : msg.sender?.name}
                      </div>
                      <div className={clsx(
                        "px-4 py-2.5 rounded-2xl max-w-[85%] text-sm shadow-sm",
                        isMe 
                          ? "bg-teal text-white rounded-tr-sm" 
                          : "bg-white border border-canvas-border text-canvas-dark rounded-tl-sm"
                      )}>
                        {renderMessageContent(msg.message)}
                      </div>
                      <div className="text-[10px] text-canvas-muted mt-1 px-1">
                        {new Date(msg.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  )
                })
              )}
              <div ref={endRef} />
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-canvas-border bg-white">
              <form onSubmit={handleSend} className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a reply to the seller..."
                  className="flex-1 input-field"
                  disabled={sending}
                />
                <button
                  type="submit"
                  disabled={sending || !input.trim()}
                  className="btn-teal px-6 flex items-center justify-center disabled:opacity-50"
                >
                  {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-canvas-muted">
            <MessageSquare className="w-12 h-12 mb-4 opacity-20" />
            <p>Select a seller to start chatting</p>
          </div>
        )}
      </div>
    </div>
  )
}
