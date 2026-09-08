import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

// POST /api/checkout — create pending orders and clear cart
export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { payment_method, transaction_id, transaction_amount } = body

  if (!payment_method || !['upi', 'bank_transfer'].includes(payment_method)) {
    return NextResponse.json({ error: 'Invalid payment method' }, { status: 400 })
  }
  if (!transaction_id?.trim()) {
    return NextResponse.json({ error: 'Transaction ID / UTR is required' }, { status: 400 })
  }
  if (!transaction_amount || transaction_amount <= 0) {
    return NextResponse.json({ error: 'Transaction amount is required' }, { status: 400 })
  }

  // Get user's cart items
  const { data: cartItems } = await supabase
    .from('cart')
    .select(`*, artwork:artworks(id, title, listing_price, seller_requested_price, status, offer:offers(*))`)
    .eq('user_id', user.id)

  if (!cartItems || cartItems.length === 0) {
    return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
  }

  // Filter only listed artworks and calculate total
  let total = 0
  const validItems: typeof cartItems = []
  for (const item of cartItems) {
    const art = item.artwork
    if (art.status !== 'listed') continue
    const price = art.listing_price ?? art.seller_requested_price
    const offer = Array.isArray(art.offer) ? art.offer[0] : null
    const finalPrice = offer && new Date(offer.valid_until) > new Date()
      ? price * (1 - offer.discount_percentage / 100)
      : price
    total += finalPrice
    validItems.push({ ...item, _price: finalPrice })
  }

  if (validItems.length === 0) {
    return NextResponse.json({ error: 'No listed artworks in cart' }, { status: 400 })
  }

  // Create pending orders
  const orderInserts = (validItems as any[]).map((item) => ({
    user_id: user.id,
    artwork_id: item.artwork_id,
    amount_paid: item._price,
    payment_method,
    transaction_id: transaction_id.trim(),
    transaction_amount: Number(transaction_amount),
    payment_status: 'pending',
  }))

  const { error: insertError } = await supabase.from('orders').insert(orderInserts)
  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 })
  }

  // Clear cart
  await supabase.from('cart').delete().eq('user_id', user.id)

  return NextResponse.json({ success: true, total, order_count: validItems.length })
}
