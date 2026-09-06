'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { MessageSquare, CheckCircle, Clock, Send } from 'lucide-react'
import type { SupportTicket } from '@/lib/types'

interface AdminSupportPanelProps {
  tickets: SupportTicket[]
}

export default function AdminSupportPanel({ tickets }: AdminSupportPanelProps) {
  const router = useRouter()
  const [selected, setSelected] = useState<SupportTicket | null>(null)
  const [reply, setReply] = useState('')
  const [sending, setSending] = useState(false)

  const handleReply = async () => {
    if (!selected || !reply.trim()) return
    setSending(true)
    try {
      const res = await fetch(`/api/tickets/${selected.id}/reply`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ admin_reply: reply, status: 'resolved' }),
      })
      if (!res.ok) throw new Error((await res.json()).error)
      toast.success('Reply sent!')
      setSelected(null)
      setReply('')
      router.refresh()
    } catch (e: any) { toast.error(e.message) }
    finally { setSending(false) }
  }

  return (
    <div className="animate-fade-in">
      <h1 className="font-display font-bold text-2xl text-canvas-dark mb-6">User Support Tickets</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Ticket list */}
        <div className="space-y-3">
          {tickets.length === 0 && (
            <div className="text-center py-12 text-canvas-muted">No tickets yet 🎉</div>
          )}
          {tickets.map(ticket => (
            <button
              key={ticket.id}
              onClick={() => { setSelected(ticket); setReply(ticket.admin_reply ?? '') }}
              className={`w-full text-left bg-white rounded-xl border p-4 transition-all hover:shadow-card ${selected?.id === ticket.id ? 'border-teal shadow-teal' : 'border-canvas-border'}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2.5">
                  <MessageSquare className="w-4 h-4 text-teal mt-0.5 shrink-0" />
                  <div>
                    <div className="font-semibold text-sm">{ticket.subject}</div>
                    <div className="text-xs text-canvas-muted">{ticket.user?.name} · {new Date(ticket.created_at).toLocaleDateString('en-IN')}</div>
                    <p className="text-xs text-canvas-muted mt-1 line-clamp-2">{ticket.message}</p>
                  </div>
                </div>
                <span className={`status-badge shrink-0 ${ticket.status === 'resolved' ? 'badge-listed' : 'badge-pending'}`}>
                  {ticket.status === 'resolved' ? <CheckCircle className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
                  {ticket.status}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Reply panel */}
        {selected && (
          <div className="bg-white rounded-2xl border border-canvas-border shadow-card p-6 h-fit">
            <h3 className="font-semibold mb-1">{selected.subject}</h3>
            <div className="text-xs text-canvas-muted mb-4">From: {selected.user?.name} ({selected.user?.email})</div>
            <div className="bg-teal-pale rounded-xl p-4 text-sm mb-4 leading-relaxed">{selected.message}</div>
            {selected.admin_reply && (
              <div className="bg-peach-pale rounded-xl p-4 text-sm mb-4 leading-relaxed border-l-4 border-peach">
                <div className="text-xs font-semibold text-mustard mb-1">Your previous reply:</div>
                {selected.admin_reply}
              </div>
            )}
            <label className="block text-sm font-medium mb-1.5">Reply to user</label>
            <textarea
              value={reply}
              onChange={e => setReply(e.target.value)}
              rows={4}
              placeholder="Type your response…"
              className="input-field resize-none mb-3"
            />
            <button onClick={handleReply} disabled={sending || !reply.trim()} className="btn-teal w-full flex items-center justify-center gap-2 disabled:opacity-60">
              <Send className="w-4 h-4" />
              {sending ? 'Sending…' : 'Send Reply & Mark Resolved'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
