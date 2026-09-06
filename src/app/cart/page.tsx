import { requireRole } from '@/lib/auth'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import MainLayout from '@/components/layout/MainLayout'
import Navbar from '@/components/layout/Navbar'
import MobileBottomNav from '@/components/layout/MobileBottomNav'
import CartClient from '@/components/cart/CartClient'

export default async function CartPage() {
  const user = await requireRole(['customer', 'seller', 'admin'])
  const supabase = await createSupabaseServerClient()

  const { data: cartItems } = await supabase
    .from('cart')
    .select(`
      *,
      artwork:artworks(
        *,
        seller:users!artworks_seller_id_fkey(id, name),
        offer:offers(*)
      )
    `)
    .eq('user_id', user.id)
    .order('added_at', { ascending: false })

  const mapped = (cartItems ?? []).map((item: any) => ({
    ...item,
    artwork: item.artwork ? {
      ...item.artwork,
      offer: Array.isArray(item.artwork.offer)
        ? (item.artwork.offer.find((o: any) => new Date(o.valid_until) > new Date()) ?? null)
        : null,
    } : null,
  }))

  return (
    <MainLayout>
      <Navbar user={user} cartCount={mapped.length} />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-24 md:pb-8">
        <CartClient items={mapped} />
      </main>
      <MobileBottomNav />
    </MainLayout>
  )
}
