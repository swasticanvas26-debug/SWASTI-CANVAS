import { createSupabaseServerClient } from '@/lib/supabase/server'
import { getAppUser } from '@/lib/auth'
import MainLayout from '@/components/layout/MainLayout'
import Navbar from '@/components/layout/Navbar'
import MobileBottomNav from '@/components/layout/MobileBottomNav'
import HomeHero from '@/components/home/HomeHero'
import FeaturedGrid from '@/components/home/FeaturedGrid'
import type { Artwork } from '@/lib/types'

export const revalidate = 60

async function getFeaturedArtworks(): Promise<Artwork[]> {
  const supabase = await createSupabaseServerClient()
  const now = new Date().toISOString()

  const { data } = await supabase
    .from('artworks')
    .select(`
      *,
      seller:users!artworks_seller_id_fkey(id, name, email, role),
      offer:offers(*)
    `)
    .eq('status', 'listed')
    .order('created_at', { ascending: false })
    .limit(12)

  // Flatten nested offers
  return (data ?? []).map((a: any) => ({
    ...a,
    offer: Array.isArray(a.offer) && a.offer.length > 0
      ? a.offer.find((o: any) => new Date(o.valid_until) > new Date()) ?? null
      : null,
  }))
}

async function getCartCount(userId?: string): Promise<number> {
  if (!userId) return 0
  const supabase = await createSupabaseServerClient()
  const { count } = await supabase
    .from('cart')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
  return count ?? 0
}

export default async function HomePage() {
  const user = await getAppUser()
  const [artworks, cartCount] = await Promise.all([
    getFeaturedArtworks(),
    getCartCount(user?.id),
  ])

  return (
    <MainLayout>
      <Navbar user={user} cartCount={cartCount} />
      <main className="pb-20 md:pb-0">
        <HomeHero artworks={artworks.slice(0, 3)} />
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display font-bold text-2xl text-canvas-dark">Featured This Week</h2>
              <p className="text-canvas-muted text-sm mt-0.5">Handpicked originals from talented artists</p>
            </div>
            <a href="/artworks" className="btn-outline text-sm hidden sm:block">Browse All →</a>
          </div>
          <FeaturedGrid artworks={artworks} userId={user?.id} />
        </section>

        {/* Category strips */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-10">
          <h2 className="font-display font-bold text-xl text-canvas-dark mb-4">Browse by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {['Abstract', 'Landscape', 'Portrait', 'Floral', 'Geometric', 'Mixed Media'].map((cat, i) => {
              const colors = [
                'from-teal to-teal-light',
                'from-blue-accent to-teal-light',
                'from-peach to-mustard',
                'from-peach to-pink-300',
                'from-mustard to-yellow-400',
                'from-teal-light to-blue-accent',
              ]
              return (
                <a
                  key={cat}
                  href={`/artworks?category=${encodeURIComponent(cat)}`}
                  className={`bg-gradient-to-br ${colors[i]} text-white rounded-2xl p-4 text-center font-semibold text-sm hover:scale-105 transition-transform shadow-card`}
                >
                  {cat}
                </a>
              )
            })}
          </div>
        </section>
      </main>
      <MobileBottomNav />
    </MainLayout>
  )
}
