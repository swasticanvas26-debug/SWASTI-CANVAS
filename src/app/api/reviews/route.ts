import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { getAppUser } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const user = await getAppUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { order_id, artwork_id, website_rating, website_comment, artwork_rating, artwork_comment } = body

    if (!order_id || !artwork_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = await createSupabaseServerClient()

    // Verify order belongs to user and is confirmed
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id, payment_status')
      .eq('id', order_id)
      .eq('user_id', user.id)
      .single()

    if (orderError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    if (order.payment_status !== 'confirmed') {
      return NextResponse.json({ error: 'Only confirmed orders can be reviewed' }, { status: 403 })
    }

    // Check if review already exists
    const { data: existingReview } = await supabase
      .from('order_reviews')
      .select('id')
      .eq('order_id', order_id)
      .single()

    if (existingReview) {
      return NextResponse.json({ error: 'This order has already been reviewed' }, { status: 400 })
    }

    const { error: insertError } = await supabase
      .from('order_reviews')
      .insert({
        order_id,
        user_id: user.id,
        artwork_id,
        website_rating,
        website_comment,
        artwork_rating,
        artwork_comment
      })

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 })
  }
}
