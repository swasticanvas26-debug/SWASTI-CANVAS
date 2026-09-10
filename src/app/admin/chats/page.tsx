import { redirect } from 'next/navigation'
import { getAppUser } from '@/lib/auth'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import AdminChats from '@/components/admin/AdminChats'

export const dynamic = 'force-dynamic'

export default async function AdminChatsPage() {
  const user = await getAppUser()
  if (!user || user.role !== 'admin') redirect('/login')

  const supabase = await createSupabaseServerClient()

  // Fetch all sellers
  const { data: sellers } = await supabase
    .from('users')
    .select('*')
    .eq('role', 'seller')
    .order('permission_requested', { ascending: false }) // requests first

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-canvas-dark">Chats</h1>
          <p className="text-canvas-muted text-sm mt-0.5">Manage permission requests and chat with sellers</p>
        </div>
      </div>

      <AdminChats admin={user} sellers={sellers || []} />
    </div>
  )
}
