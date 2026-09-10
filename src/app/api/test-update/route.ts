import { NextResponse } from 'next/server'
import { createSupabaseServiceClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const supabaseAdmin = await createSupabaseServiceClient()
  
  const { data: sellers } = await supabaseAdmin.from('users').select('*').eq('role', 'seller')

  return NextResponse.json({ sellers })
}
