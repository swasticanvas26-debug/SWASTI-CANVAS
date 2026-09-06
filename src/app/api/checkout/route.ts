import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { SignJWT } from 'jose'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET ?? 'swasti-canvas-secret')

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Get user's cart items
  const { data: cartItems } = await supabase
    .from('cart')
    .select(`*, artwork:artworks(id, title, listing_price, seller_requested_price, status, offer:offers(*))`)
    .eq('user_id', user.id)

  if (!cartItems || cartItems.length === 0) {
    return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
  }

  // Calculate total
  let total = 0
  for (const item of cartItems) {
    const art = item.artwork
    if (art.status !== 'listed') continue
    const price = art.listing_price ?? art.seller_requested_price
    const offer = Array.isArray(art.offer) ? art.offer[0] : null
    const finalPrice = offer && new Date(offer.valid_until) > new Date()
      ? price * (1 - offer.discount_percentage / 100)
      : price
    total += finalPrice
  }

  // Generate payment JWT (placeholder)
  const paymentToken = await new SignJWT({
    user_id: user.id,
    artwork_ids: cartItems.map(i => i.artwork_id),
    total,
    currency: 'INR',
    timestamp: Date.now(),
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30m')
    .sign(JWT_SECRET)

  // Simulate payment processing and create order
  const orderInserts = cartItems.map((item: any) => {
    const art = item.artwork
    const price = art.listing_price ?? art.seller_requested_price
    const offer = Array.isArray(art.offer) ? art.offer[0] : null
    const finalPrice = offer && new Date(offer.valid_until) > new Date()
      ? price * (1 - offer.discount_percentage / 100)
      : price
    return {
      user_id: user.id,
      artwork_id: item.artwork_id,
      amount_paid: finalPrice,
      payment_ref: paymentToken.substring(0, 32) + '...',
    }
  })

  // Insert orders
  await supabase.from('orders').insert(orderInserts)

  // Use RPC to decrement quantity, mark as sold if 0, and clear cart
  const { error: rpcError } = await supabase.rpc('process_checkout', {
    p_user_id: user.id,
    p_artwork_ids: cartItems.map((i: any) => i.artwork_id)
  })

  if (rpcError) {
    console.error('Checkout RPC error:', rpcError)
    // Even if it fails, we inserted orders. In a real app we'd use a transaction.
  }

  return NextResponse.json({
    success: true,
    payment_token: paymentToken,
    total,
    order_count: orderInserts.length,
  })
}
