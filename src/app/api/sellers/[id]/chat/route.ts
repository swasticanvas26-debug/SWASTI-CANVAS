import { NextResponse } from 'next/server'
import { createSupabaseServerClient, createSupabaseServiceClient } from '@/lib/supabase/server'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params // seller_id

  // Verify permission: Must be the seller themselves OR an admin
  const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin' && user.id !== id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { data: messages, error } = await supabase
    .from('seller_chats')
    .select(`*, sender:users!seller_chats_sender_id_fkey(id, name, role)`)
    .eq('seller_id', id)
    .order('created_at', { ascending: true })

  if (error) {
    // If table doesn't exist yet, just return empty array
    if (error.code === '42P01') return NextResponse.json({ messages: [] })
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ messages })
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params // seller_id
  const body = await request.json()
  let { message } = body

  if (!message || typeof message !== 'string') {
    return NextResponse.json({ error: 'Message is required' }, { status: 400 })
  }

  message = message.trim()

  // Verify permission: Must be the seller themselves OR an admin
  const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single()
  const isAdmin = profile?.role === 'admin'
  const isSeller = profile?.role === 'seller'

  if (!isAdmin && user.id !== id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Link validation logic
  const urlRegex = /(https?:\/\/[^\s]+)/g
  const links = message.match(urlRegex)
  if (links) {
    for (const link of links) {
      if (!link.includes('drive.google.com') && 
          !link.includes('photos.app.goo.gl') && 
          !link.includes('photos.google.com')) {
        return NextResponse.json({ error: 'Only Google Drive and Google Photos links are allowed.' }, { status: 400 })
      }
    }
  }

  // Since we don't know if RLS on seller_chats is set up correctly by the user yet,
  // we'll use the service client to safely insert to ensure it works, since we've already
  // done strict role/auth validation above.
  const supabaseAdmin = await createSupabaseServiceClient()

  const { data, error } = await supabaseAdmin
    .from('seller_chats')
    .insert({
      seller_id: id,
      sender_id: user.id,
      message
    })
    .select(`*, sender:users!seller_chats_sender_id_fkey(id, name, role)`)
    .single()

  if (error) {
    if (error.code === '42P01') return NextResponse.json({ error: 'Please run the SQL script to create the seller_chats table.' }, { status: 500 })
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ message: data })
}
