import { requireRole } from '@/lib/auth'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import MainLayout from '@/components/layout/MainLayout'
import Navbar from '@/components/layout/Navbar'
import AdminSidebar from '@/components/layout/AdminSidebar'
import AdminOrderHistory from '@/components/admin/AdminOrderHistory'

export default async function AdminOrdersPage() {
  const user = await requireRole(['admin'])
  const supabase = await createSupabaseServerClient()

  const [
    { count: pendingCount },
    { data: allOrders },
  ] = await Promise.all([
    supabase.from('artworks').select('id', { count: 'exact', head: true }).eq('status', 'pending_approval'),
    supabase
      .from('orders')
      .select(`
        *,
        artwork:artworks(id, title, image_url),
        user:users(id, name, email)
      `)
      .order('purchased_at', { ascending: false }),
  ])

  return (
    <MainLayout>
      <Navbar user={user} />
      <div className="flex flex-col md:flex-row min-h-screen">
        <AdminSidebar pendingCount={pendingCount ?? 0} />
        <main className="flex-1 p-6 overflow-auto bg-[#F9FAFB]">
          <AdminOrderHistory orders={allOrders ?? []} />
        </main>
      </div>
    </MainLayout>
  )
}
