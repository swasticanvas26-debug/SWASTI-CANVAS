import { NextResponse } from 'next/server'
import { createSupabaseServerClient, createSupabaseServiceClient } from '@/lib/supabase/server'

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const supabaseAdmin = await createSupabaseServiceClient()

  const { id } = await params
  const body = await request.json()
  const { listing_enabled, listing_quota, permission_requested } = body

  const updateData: any = {}
  if (listing_enabled !== undefined) updateData.listing_enabled = listing_enabled
  if (listing_quota !== undefined) updateData.listing_quota = listing_quota
  if (permission_requested !== undefined) updateData.permission_requested = permission_requested

  const { data, error } = await supabaseAdmin
    .from('users')
    .update(updateData)
    .eq('id', id)
    .select()

  require('fs').writeFileSync('api-debug.json', JSON.stringify({ id, updateData, data, error }))

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!data || data.length === 0) return NextResponse.json({ error: 'User not found or ID mismatch' }, { status: 404 })

  return NextResponse.json({ success: true, data })
}
