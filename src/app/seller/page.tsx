import { requireRole } from '@/lib/auth'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import MainLayout from '@/components/layout/MainLayout'
import Navbar from '@/components/layout/Navbar'
import MobileBottomNav from '@/components/layout/MobileBottomNav'
import SellerDashboardClient from '@/components/seller/SellerDashboardClient'
import type { Artwork } from '@/lib/types'

export default async function SellerPage() {
  const user = await requireRole(['seller', 'admin'])
  const supabase = await createSupabaseServerClient()

  const { data: artworks } = await supabase
    .from('artworks')
    .select(`*, offer:offers(*)`)
    .eq('seller_id', user.id)
    .order('created_at', { ascending: false })

  const mapped = (artworks ?? []).map((a: any) => ({
    ...a,
    offer: Array.isArray(a.offer) ? (a.offer[0] ?? null) : null,
  })) as Artwork[]

  const stats = {
    total: mapped.length,
    pending: mapped.filter(a => a.status === 'pending_approval').length,
    listed: mapped.filter(a => a.status === 'listed').length,
    sold: mapped.filter(a => a.status === 'sold').length,
  }

  const cartCount = await (async () => {
    const { count } = await supabase.from('cart').select('id', { count: 'exact', head: true }).eq('user_id', user.id)
    return count ?? 0
  })()

  return (
    <MainLayout>
      <Navbar user={user} cartCount={cartCount} />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 pb-24 md:pb-8">
        <SellerDashboardClient user={user} artworks={mapped} stats={stats} />
      </main>
      <MobileBottomNav />
    </MainLayout>
  )
}
