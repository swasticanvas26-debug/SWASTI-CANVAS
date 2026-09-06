import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

// GET /api/tickets — get tickets (user: own, admin: all)
export async function GET() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single()
  const isAdmin = profile?.role === 'admin'

  let query = supabase
    .from('support_tickets')
    .select(`*, user:users(id, name, email)`)
    .order('created_at', { ascending: false })

  if (!isAdmin) query = query.eq('user_id', user.id)

  const { data } = await query
  return NextResponse.json({ tickets: data ?? [] })
}

// POST /api/tickets — submit ticket
export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { subject, message } = await request.json()
  if (!subject || !message) return NextResponse.json({ error: 'subject and message required' }, { status: 400 })

  const { error } = await supabase.from('support_tickets').insert({
    user_id: user.id, subject, message
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
