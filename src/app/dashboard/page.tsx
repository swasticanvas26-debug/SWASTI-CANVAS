import { requireRole } from '@/lib/auth'
import { createSupabaseServerClient, createSupabaseServiceClient } from '@/lib/supabase/server'
import MainLayout from '@/components/layout/MainLayout'
import Navbar from '@/components/layout/Navbar'
import MobileBottomNav from '@/components/layout/MobileBottomNav'
import CustomerDashboardClient from '@/components/customer/CustomerDashboardClient'

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>
}) {
  const params = await searchParams
  const user = await requireRole(['customer', 'seller', 'admin'])
  const supabase = await createSupabaseServerClient()

  // Use service client for orders so that the artwork→seller join is not blocked
  // by RLS (users policy only exposes own profile; buyers can't read seller rows).
  // The query is still safely scoped to this user's orders via .eq('user_id', user.id).
  const serviceClient = await createSupabaseServiceClient()

  const [
    { data: orders },
    { data: tickets },
    cartData,
  ] = await Promise.all([
    serviceClient
      .from('orders')
      .select(`*, artwork:artworks(id, title, image_url, listing_price, seller:users!artworks_seller_id_fkey(name))`)
      .eq('user_id', user.id)
      .order('purchased_at', { ascending: false }),
    supabase
      .from('support_tickets')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }),
    supabase.from('cart').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
  ])

  return (
    <MainLayout>
      <Navbar user={user} cartCount={cartData.count ?? 0} />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 pb-24 md:pb-8">
        <CustomerDashboardClient
          user={user}
          orders={orders ?? []}
          tickets={tickets ?? []}
          activeTab={params.tab ?? 'orders'}
        />
      </main>
      <MobileBottomNav />
    </MainLayout>
  )
}
