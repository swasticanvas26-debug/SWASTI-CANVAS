import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

// POST /api/artworks/upload — seller uploads artwork
export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single()
  if (!['seller', 'admin'].includes(profile?.role)) {
    return NextResponse.json({ error: 'Only sellers can upload artworks' }, { status: 403 })
  }

  const body = await request.json()
  const { title, description, category, image_url, seller_requested_price, listing_price, quantity } = body

  if (!title || !image_url || !seller_requested_price || !category) {
    return NextResponse.json({ error: 'title, image_url, category, seller_requested_price required' }, { status: 400 })
  }

  const isAdmin = profile?.role === 'admin'

  const { data, error } = await supabase.from('artworks').insert({
    title,
    description,
    category,
    image_url,
    seller_id: user.id,
    seller_requested_price,
    listing_price: isAdmin ? (listing_price ?? seller_requested_price) : null,
    quantity: quantity ? parseInt(quantity) : 1,
    status: isAdmin ? 'listed' : 'pending_approval',
  }).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, artwork: data })
}
