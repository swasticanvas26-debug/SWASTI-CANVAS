import { requireRole } from '@/lib/auth'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import MainLayout from '@/components/layout/MainLayout'
import Navbar from '@/components/layout/Navbar'
import AdminSidebar from '@/components/layout/AdminSidebar'
import AdminOverview from '@/components/admin/AdminOverview'

export default async function AdminPage() {
  const user = await requireRole(['admin'])
  const supabase = await createSupabaseServerClient()

  const [
    { count: pendingCount },
    { count: activeCount },
    { data: pendingArtworks },
    { data: activeListings },
    { data: totalSalesData },
  ] = await Promise.all([
    supabase.from('artworks').select('id', { count: 'exact', head: true }).eq('status', 'pending_approval'),
    supabase.from('artworks').select('id', { count: 'exact', head: true }).eq('status', 'listed'),
    supabase.from('artworks').select(`*, seller:users!artworks_seller_id_fkey(id, name)`).eq('status', 'pending_approval').order('created_at'),
    supabase.from('artworks').select(`*, seller:users!artworks_seller_id_fkey(id, name), offer:offers(*)`).eq('status', 'listed').order('created_at', { ascending: false }),
    supabase.from('orders').select('amount_paid'),
  ])

  const totalSales = totalSalesData?.reduce((sum, o) => sum + (o.amount_paid ?? 0), 0) ?? 0

  return (
    <MainLayout>
      <Navbar user={user} />
      <div className="flex min-h-screen">
        <AdminSidebar pendingCount={pendingCount ?? 0} />
        <main className="flex-1 p-6 overflow-auto">
          <AdminOverview
            totalSales={totalSales}
            activeArtworks={activeCount ?? 0}
            pendingApprovals={pendingCount ?? 0}
            sellerRequests={0}
            pendingArtworks={(pendingArtworks ?? []).map((a: any) => ({
              ...a,
              offer: Array.isArray(a.offer) ? (a.offer[0] ?? null) : null,
            }))}
            activeListings={(activeListings ?? []).map((a: any) => ({
              ...a,
              offer: Array.isArray(a.offer) ? (a.offer.find((o: any) => new Date(o.valid_until) > new Date()) ?? null) : null,
            }))}
          />
        </main>
      </div>
    </MainLayout>
  )
}
