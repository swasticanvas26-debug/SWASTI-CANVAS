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
      seller:users!artworks_seller_id_fkey(id, name, email, role)
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
      <main className="pb-24 md:pb-0">
        <HomeHero artworks={artworks.slice(0, 3)} />

        {/* 
          TODO (Post-Competition Cleanup):
          When the National Art Competition is over, you need to:
          1. Remove this entire "Competition Banner" section.
          2. Go to src/components/layout/Navbar.tsx and remove the 'Competition' link from NAV_LINKS.
          3. Go to src/proxy.ts and remove '/competition' from publicRoutes.
          4. Delete the src/app/competition/ folder, or update the page to say the competition has ended.
        */}
        {/* Competition Banner */}
        <section className="max-w-7xl mx-auto px-3 sm:px-6 py-6 mt-4">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-900 to-teal-800 shadow-xl border border-teal-700/50">
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-mustard/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-peach/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
            
            <div className="relative z-10 px-6 py-10 md:py-12 md:px-12 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-white mb-4">
                  <span className="w-2 h-2 rounded-full bg-mustard animate-pulse"></span>
                  New Event
                </div>
                <h2 className="font-display font-bold text-3xl md:text-4xl text-white mb-2">
                  National Art Competition (Dec 2026)
                </h2>
                <p className="text-teal-100 text-lg">
                  Theme: Open Theme • Target: 7 to 16 years • <span className="font-semibold text-mustard">Exciting Cash Prizes!</span>
                </p>
              </div>
              <div className="shrink-0">
                <a href="/competition" className="btn-teal whitespace-nowrap px-8 py-4 text-lg shadow-lg hover:scale-105 transition-transform flex items-center justify-center gap-2">
                  View Details & Participate
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Featured section — floating glass panel */}
        <section className="max-w-7xl mx-auto px-3 sm:px-6 py-6 md:py-6">
          <div className="section-glass px-4 sm:px-6 py-6 md:py-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display font-bold text-2xl text-canvas-dark">Featured This Week</h2>
                <p className="text-canvas-muted text-sm mt-0.5">Handpicked originals from talented artists</p>
              </div>
              <a href="/artworks" className="btn-outline text-sm hidden sm:block">Browse All →</a>
            </div>
            <FeaturedGrid artworks={artworks} userId={user?.id} />
            <div className="mt-4 sm:hidden">
              <a href="/artworks" className="btn-outline text-sm w-full text-center block">Browse All Artworks →</a>
            </div>
          </div>
        </section>

        {/* Category strips — floating glass panel */}
        <section className="max-w-7xl mx-auto px-3 sm:px-6 py-2 pb-10">
          <div className="section-glass px-4 sm:px-6 py-6">
            <h2 className="font-display font-bold text-xl text-canvas-dark mb-4">Browse by Category</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {['Landscape', 'Abstract', 'Animal & Birds', 'Religious', 'Figurative', 'Indian', 'Other painting', 'Reprints or printed'].map((cat, i) => {
                const colors = [
                  'from-emerald-200 to-teal-100 text-teal-950',
                  'from-blue-200 to-cyan-100 text-blue-950',
                  'from-orange-200 to-amber-100 text-orange-950',
                  'from-rose-200 to-pink-100 text-rose-950',
                  'from-yellow-200 to-orange-100 text-yellow-950',
                  'from-purple-200 to-indigo-100 text-purple-950',
                  'from-pink-200 to-rose-100 text-pink-950',
                  'from-slate-200 to-gray-100 text-slate-950',
                ]
                return (
                  <a
                    key={cat}
                    href={`/artworks?category=${encodeURIComponent(cat)}`}
                    className={`bg-gradient-to-br ${colors[i]} rounded-2xl p-4 text-center font-semibold text-sm hover:scale-105 active:scale-95 transition-transform shadow-card`}
                  >
                    {cat}
                  </a>
                )
              })}
            </div>
          </div>
        </section>
      </main>
      <MobileBottomNav />
    </MainLayout>
  )
}
