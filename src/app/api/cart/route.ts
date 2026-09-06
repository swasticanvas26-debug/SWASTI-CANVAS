import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

// POST /api/cart — add item (with 15-min inventory lock)
export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { artwork_id } = await request.json()
  if (!artwork_id) return NextResponse.json({ error: 'artwork_id required' }, { status: 400 })

  // Verify artwork is listed and get quantity
  const { data: artwork } = await supabase
    .from('artworks')
    .select('id, status, quantity')
    .eq('id', artwork_id)
    .eq('status', 'listed')
    .single()

  if (!artwork) return NextResponse.json({ error: 'Artwork not available' }, { status: 404 })

  // Get all locks for this artwork
  const { data: locks } = await supabase
    .from('cart')
    .select('id, user_id, added_at')
    .eq('artwork_id', artwork_id)

  let activeLocks = 0
  const expiredLockIds: string[] = []

  if (locks) {
    const now = Date.now()
    for (const lock of locks) {
      const lockAge = now - new Date(lock.added_at).getTime()
      if (lockAge < 15 * 60 * 1000) {
        if (lock.user_id === user.id) {
           return NextResponse.json({ success: true, message: 'Already in cart' })
        }
        activeLocks++
      } else {
        expiredLockIds.push(lock.id)
      }
    }
  }

  // Clean up any expired locks
  if (expiredLockIds.length > 0) {
    await supabase.from('cart').delete().in('id', expiredLockIds)
  }

  // Check if there's enough stock left for another lock
  if (activeLocks >= artwork.quantity) {
    return NextResponse.json({ error: 'This artwork is out of stock or reserved by other buyers. Try again in a few minutes.' }, { status: 409 })
  }

  // Insert cart item
  const { error } = await supabase.from('cart').insert({
    user_id: user.id,
    artwork_id,
    added_at: new Date().toISOString(),
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}

// DELETE /api/cart?artwork_id=xxx — remove item
export async function DELETE(request: Request) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const url = new URL(request.url)
  const artwork_id = url.searchParams.get('artwork_id')
  if (!artwork_id) return NextResponse.json({ error: 'artwork_id required' }, { status: 400 })

  await supabase.from('cart').delete().eq('user_id', user.id).eq('artwork_id', artwork_id)
  return NextResponse.json({ success: true })
}

// GET /api/cart — get current user's cart
export async function GET() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data } = await supabase
    .from('cart')
    .select(`
      *,
      artwork:artworks(
        *,
        seller:users!artworks_seller_id_fkey(id, name),
        offer:offers(*)
      )
    `)
    .eq('user_id', user.id)
    .order('added_at', { ascending: false })

  return NextResponse.json({ items: data ?? [] })
}
