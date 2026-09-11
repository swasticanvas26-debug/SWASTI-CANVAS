import { requireRole } from '@/lib/auth'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import MainLayout from '@/components/layout/MainLayout'
import Navbar from '@/components/layout/Navbar'
import AdminSidebar from '@/components/layout/AdminSidebar'
import AdminSupportPanel from '@/components/admin/AdminSupportPanel'

export default async function AdminSupportPage() {
  const user = await requireRole(['admin'])
  const supabase = await createSupabaseServerClient()

  const { data: tickets } = await supabase
    .from('support_tickets')
    .select(`*, user:users(id, name, email)`)
    .order('created_at', { ascending: false })

  const { count: pendingCount } = await supabase.from('artworks').select('id', { count: 'exact', head: true }).eq('status', 'pending_approval')
  const { count: sellerCount } = await supabase.from('users').select('id', { count: 'exact', head: true }).eq('role', 'seller')

  return (
    <MainLayout>
      <Navbar user={user} />
      <div className="flex flex-col md:flex-row min-h-screen">
        <AdminSidebar pendingCount={pendingCount ?? 0} sellerRequestCount={sellerCount ?? 0} />
        <main className="flex-1 p-6 overflow-auto">
          <AdminSupportPanel tickets={tickets ?? []} />
        </main>
      </div>
    </MainLayout>
  )
}
