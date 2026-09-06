import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

// POST /api/offers — admin creates an offer
export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { artwork_id, discount_percentage, valid_until } = await request.json()
  if (!artwork_id || !discount_percentage || !valid_until) {
    return NextResponse.json({ error: 'artwork_id, discount_percentage, valid_until required' }, { status: 400 })
  }

  // Upsert offer (one per artwork)
  const { error } = await supabase
    .from('offers')
    .upsert({ artwork_id, discount_percentage, valid_until })
    .eq('artwork_id', artwork_id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}

// DELETE /api/offers?artwork_id=xxx — remove offer
export async function DELETE(request: Request) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const url = new URL(request.url)
  const artwork_id = url.searchParams.get('artwork_id')

  const { error } = await supabase.from('offers').delete().eq('artwork_id', artwork_id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
