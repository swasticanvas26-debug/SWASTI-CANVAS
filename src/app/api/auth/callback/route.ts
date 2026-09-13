import { NextResponse } from 'next/server'
import { createSupabaseServerClient, createSupabaseServiceClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  
  // Also support old-style token redirects if any (e.g. #access_token=)
  // but with SSR PKCE is standard.
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createSupabaseServerClient()
    const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && session?.user) {
      // Profile creation logic (previously in complete-signup)
      const serviceClient = await createSupabaseServiceClient()
      const user = session.user
      const { name, role } = user.user_metadata
      const email = user.email

      if (name && role && email) {
        // Use service client to bypass RLS for inserting into `users` table if needed,
        // though the user is now authenticated so RLS might allow it. Better to be safe.
        await serviceClient
          .from('users')
          .upsert({ id: user.id, name, email, role }, { onConflict: 'id' })
      }
      
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=Invalid+or+expired+confirmation+link`)
}
