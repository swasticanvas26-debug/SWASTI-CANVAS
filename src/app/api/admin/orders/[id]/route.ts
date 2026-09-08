import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

// PATCH /api/admin/orders/[id] — confirm or decline a payment
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createSupabaseServerClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { action } = await request.json()
  if (!['confirm', 'decline'].includes(action)) {
    return NextResponse.json({ error: 'Invalid action. Use confirm or decline.' }, { status: 400 })
  }

  const rpcName = action === 'confirm' ? 'confirm_order_payment' : 'decline_order_payment'
  const { error } = await supabase.rpc(rpcName, { p_order_id: id })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true, action })
}
