import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

// PATCH /api/artworks/[id]/approve — admin approves with listing price
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { listing_price, description, artist_name } = await request.json()
  if (!listing_price || listing_price <= 0) {
    return NextResponse.json({ error: 'Valid listing_price required' }, { status: 400 })
  }

  const updateData: any = { status: 'listed', listing_price }
  if (description !== undefined) {
    updateData.description = description
  }
  if (artist_name !== undefined) {
    updateData.artist_name = artist_name || null
  }

  const { error } = await supabase
    .from('artworks')
    .update(updateData)
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
