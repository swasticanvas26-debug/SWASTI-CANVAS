'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Send, Loader2, MessageSquare } from 'lucide-react'
import toast from 'react-hot-toast'
import type { SellerChat, User } from '@/lib/types'
import { clsx } from 'clsx'

interface Props {
  sellerId: string
  sellerName: string
  currentUser: User
  onClose: () => void
}

export default function SellerChatModal({ sellerId, sellerName, currentUser, onClose }: Props) {
  const [messages, setMessages] = useState<SellerChat[]>([])
  const [loading, setLoading] = useState(true)
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchMessages()
  }, [sellerId])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/sellers/${sellerId}/chat`)
      if (!res.ok) throw new Error('Failed to fetch messages')
      const data = await res.json()
      setMessages(data.messages)
    } catch (e) {
      toast.error('Failed to load chat')
    } finally {
      setLoading(false)
    }
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    setSending(true)
    try {
      const res = await fetch(`/api/sellers/${sellerId}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input.trim() })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to send message')
      
      setMessages(prev => [...prev, { ...data.message, sender: currentUser }])
      setInput('')
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setSending(false)
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
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg flex flex-col max-h-[85vh] animate-slide-up">
        <div className="px-6 py-4 border-b border-canvas-border flex items-center justify-between shrink-0">
          <div>
            <h3 className="font-display font-bold text-lg flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-teal" />
              Chat: {currentUser.role === 'admin' ? sellerName : 'Admin'}
            </h3>
            <p className="text-canvas-muted text-xs">Discuss permissions and listing details</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-canvas-bg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#F9FAFB]">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-6 h-6 animate-spin text-teal" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-canvas-muted space-y-2 opacity-60">
              <MessageSquare className="w-8 h-8" />
              <p className="text-sm">No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((msg, i) => {
              const isMe = msg.sender_id === currentUser.id
              const isAdmin = msg.sender?.role === 'admin'
              return (
                <div key={msg.id || i} className={clsx("flex flex-col", isMe ? "items-end" : "items-start")}>
                  <div className={clsx("text-[10px] mb-1 font-medium px-1", isMe ? "text-canvas-muted" : "text-canvas-dark")}>
                    {isMe ? 'You' : (isAdmin ? 'Admin' : msg.sender?.name)}
                  </div>
                  <div className={clsx(
                    "px-4 py-2.5 rounded-2xl max-w-[85%] text-sm shadow-sm",
                    isMe 
                      ? "bg-teal text-black rounded-tr-sm" 
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

        <div className="p-4 border-t border-canvas-border shrink-0 bg-white rounded-b-2xl">
          <form onSubmit={handleSend} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={currentUser.role === 'seller' ? "Type a message... (Google Drive/Photos links only)" : "Type your message..."}
              className="flex-1 input-field"
              disabled={sending}
            />
            <button
              type="submit"
              disabled={sending || !input.trim()}
              className="btn-teal px-4 flex items-center justify-center disabled:opacity-50"
            >
              {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
