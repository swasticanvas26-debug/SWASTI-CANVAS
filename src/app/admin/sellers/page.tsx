import { requireRole } from '@/lib/auth'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import MainLayout from '@/components/layout/MainLayout'
import Navbar from '@/components/layout/Navbar'
import AdminSidebar from '@/components/layout/AdminSidebar'
import AdminSellers from '@/components/admin/AdminSellers'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AdminSellersPage() {
  const user = await requireRole(['admin'])
  const supabase = await createSupabaseServerClient()

  const [
    { count: pendingCount },
    { data: sellersData },
  ] = await Promise.all([
    supabase.from('artworks').select('id', { count: 'exact', head: true }).eq('status', 'pending_approval'),
    supabase
      .from('users')
      .select('*, artworks(id)')
      .eq('role', 'seller')
      .order('created_at', { ascending: false }),
  ])

  // Process sellers to count their uploaded artworks (used quota)
  const sellers = (sellersData ?? []).map(seller => ({
    ...seller,
    used_quota: seller.artworks ? seller.artworks.length : 0
  }))

  return (
    <MainLayout>
      <Navbar user={user} />
      <div className="flex min-h-screen">
        <AdminSidebar pendingCount={pendingCount ?? 0} />
        <main className="flex-1 p-6 overflow-auto bg-[#F9FAFB]">
          <AdminSellers sellers={sellers} />
        </main>
      </div>
    </MainLayout>
  )
}
