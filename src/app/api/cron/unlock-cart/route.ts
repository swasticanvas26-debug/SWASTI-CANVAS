import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

// GET /api/cron/unlock-cart — expire cart locks older than 15 min
// Called by Vercel Cron Job every 1 minute
export async function GET(request: Request) {
  // Basic cron auth check
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = await createSupabaseServerClient()
  const cutoff = new Date(Date.now() - 15 * 60 * 1000).toISOString()

  const { error, count } = await supabase
    .from('cart')
    .delete({ count: 'exact' })
    .lt('added_at', cutoff)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, expired_count: count ?? 0 })
}
