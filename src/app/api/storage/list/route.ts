import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Check if admin
  const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Fetch all files in the 'artwork-images' bucket
  const { data: files, error } = await supabase
    .storage
    .from('artwork-images')
    .list('', {
      limit: 100,
      offset: 0,
      sortBy: { column: 'created_at', order: 'desc' },
    })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Filter out any hidden/empty folders like '.emptyFolderPlaceholder'
  const validFiles = files?.filter(f => f.name && !f.name.startsWith('.')) || []

  // Map to get public URLs
  const fileUrls = validFiles.map(file => {
    const { data: { publicUrl } } = supabase.storage.from('artwork-images').getPublicUrl(file.name)
    return {
      name: file.name,
      url: publicUrl,
      created_at: file.created_at
    }
  })

  return NextResponse.json({ files: fileUrls })
}
