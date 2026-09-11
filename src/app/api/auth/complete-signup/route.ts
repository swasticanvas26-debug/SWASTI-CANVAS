import { NextResponse } from 'next/server'
import { createSupabaseServiceClient } from '@/lib/supabase/server'

export async function POST() {
  try {
    const supabase = await createSupabaseServiceClient()

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, role } = user.user_metadata
    const email = user.email

    if (!name || !role || !email) {
      return NextResponse.json({ error: 'Missing user metadata' }, { status: 400 })
    }

    // Insert profile row
    const { error: profileError } = await supabase
      .from('users')
      .upsert({ id: user.id, name, email, role }, { onConflict: 'id' })

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, role })
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Internal error' }, { status: 500 })
  }
}
