import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

// POST /api/artworks/upload — seller uploads artwork
export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase.from('users').select('name, role, listing_enabled, listing_quota').eq('id', user.id).single()
  if (!['seller', 'admin'].includes(profile?.role)) {
    return NextResponse.json({ error: 'Only sellers can upload artworks' }, { status: 403 })
  }

  if (profile?.role === 'seller') {
    if (!profile.listing_enabled) {
      return NextResponse.json({ error: 'Your listing permission is currently disabled. Please contact the Admin.' }, { status: 403 })
    }

    // Check quota
    const { count } = await supabase.from('artworks').select('id', { count: 'exact', head: true }).eq('seller_id', user.id)
    if (count !== null && profile.listing_quota !== null && count >= profile.listing_quota) {
      return NextResponse.json({ error: `You have reached your listing quota of ${profile.listing_quota} artworks. Please request more quota from the Admin.` }, { status: 403 })
    }
  }

  const body = await request.json()
  const { title, description, category, image_url, seller_requested_price, listing_price, quantity, artwork_type, artist_name } = body

  if (!title || !image_url || !seller_requested_price || !category) {
    return NextResponse.json({ error: 'title, image_url, category, seller_requested_price required' }, { status: 400 })
  }

  const isValidUrl = image_url.startsWith('https://drive.google.com/') 
                     // || image_url.startsWith('https://photos.app.goo.gl/') 
                     // || image_url.startsWith('https://photos.google.com/')

  // Admin can use Supabase Storage URLs too
  const isAdminStorageUrl = profile?.role === 'admin' && !image_url.startsWith('https://drive.google.com/')

  if (!isValidUrl && !isAdminStorageUrl) {
    return NextResponse.json({ error: 'Only Google Drive links are allowed for images right now.' }, { status: 400 })
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
    artwork_type: artwork_type ?? 'original',
    artist_name: isAdmin ? (artist_name || null) : (profile?.name || null),
  }).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, artwork: data })
}
