import { requireRole } from '@/lib/auth'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import AdminChats from '@/components/admin/AdminChats'
import MainLayout from '@/components/layout/MainLayout'
import Navbar from '@/components/layout/Navbar'
import AdminSidebar from '@/components/layout/AdminSidebar'

export const dynamic = 'force-dynamic'

export default async function AdminChatsPage() {
  const user = await requireRole(['admin'])
  const supabase = await createSupabaseServerClient()

  // Fetch all sellers and pending artworks count
  const [
    { data: sellers },
    { count: pendingCount }
  ] = await Promise.all([
    supabase
      .from('users')
      .select('*')
      .eq('role', 'seller')
      .order('permission_requested', { ascending: false }),
    supabase.from('artworks').select('id', { count: 'exact', head: true }).eq('status', 'pending_approval')
  ])

  return (
    <MainLayout>
      <Navbar user={user} />
      <div className="flex flex-col md:flex-row min-h-screen">
        <AdminSidebar pendingCount={pendingCount ?? 0} />
        <main className="flex-1 p-2 md:p-6 overflow-auto bg-[#F9FAFB]">
          <div className="animate-fade-in space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-display font-bold text-2xl text-canvas-dark">Chats</h1>
                <p className="text-canvas-muted text-sm mt-0.5">Manage permission requests and chat with sellers</p>
              </div>
            </div>

            <AdminChats admin={user} sellers={sellers || []} />
          </div>
        </main>
      </div>
    </MainLayout>
  )
}
