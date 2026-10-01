import { Suspense } from 'react'
import type { Metadata } from 'next'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { getAppUser } from '@/lib/auth'
import MainLayout from '@/components/layout/MainLayout'
import Navbar from '@/components/layout/Navbar'
import MobileBottomNav from '@/components/layout/MobileBottomNav'
import FeaturedGrid from '@/components/home/FeaturedGrid'
import type { Artwork } from '@/lib/types'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://swasticanvas.com'

interface SearchParams {
  search?: string
  category?: string
  page?: string
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}): Promise<Metadata> {
  const params = await searchParams
  const category = params.category
  const search = params.search

  let title: string
  let description: string
  let canonical: string

  if (search) {
    title = `Search: "${search}" – Indian Artworks | Swasti Canvas`
    description = `Browse original Indian artworks matching "${search}". Buy paintings and support talented artists on Swasti Canvas.`
    canonical = `${BASE_URL}/artworks?search=${encodeURIComponent(search)}`
  } else if (category) {
    title = `Buy ${category} Paintings Online India – Original Art | Swasti Canvas`
    description = `Explore a curated collection of original ${category.toLowerCase()} paintings by talented Indian artists. Buy authentic artworks at Swasti Canvas – India's premier art marketplace.`
    canonical = `${BASE_URL}/artworks?category=${encodeURIComponent(category)}`
  } else {
    title = 'Buy Original Indian Paintings Online – Art Gallery | Swasti Canvas'
    description = 'Browse and buy original Indian paintings – Landscape, Abstract, Religious, Figurative, Animal & Birds and more. Support talented artists directly. Free shipping available.'
    canonical = `${BASE_URL}/artworks`
  }

  return {
    title,
    description,
    keywords: category
      ? [`${category} painting India`, `buy ${category} art online`, `${category} artwork`, 'Indian paintings', 'Swasti Canvas', 'original art']
      : ['buy Indian paintings online', 'original paintings India', 'art gallery online India', 'Indian artwork', 'Swasti Canvas', 'Indian artists'],
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'Swasti Canvas',
      type: 'website',
      locale: 'en_IN',
      images: [{ url: `${BASE_URL}/logo.jpg`, alt: 'Swasti Canvas – Indian Art Marketplace' }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${BASE_URL}/logo.jpg`],
    },
  }
}

async function getArtworks(params: SearchParams): Promise<Artwork[]> {
  const supabase = await createSupabaseServerClient()
  const now = new Date().toISOString()
  const page = parseInt(params.page ?? '1')
  const limit = 12
  const from = (page - 1) * limit

  let query = supabase
    .from('artworks')
    .select(`
      *,
      seller:users!artworks_seller_id_fkey(id, name, email, role)
    `)
    .eq('status', 'listed')
    .order('created_at', { ascending: false })
    .range(from, from + limit - 1)

  if (params.search) {
    query = query.or(`title.ilike.%${params.search}%,description.ilike.%${params.search}%`)
  }
  if (params.category) {
    query = query.eq('category', params.category)
  }

  const { data } = await query
  return (data ?? []).map((a: any) => ({
    ...a,
    offer: Array.isArray(a.offer) && a.offer.length > 0
      ? a.offer.find((o: any) => new Date(o.valid_until) > new Date()) ?? null
      : null,
  }))
}

const CATEGORIES = ['Landscape', 'Abstract', 'Animal & Birds', 'Religious', 'Figurative', 'Indian', 'Other painting', 'Reprints or printed']

export default async function ArtworksPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const user = await getAppUser()
  const artworks = await getArtworks(params)

  const cartCount = user
    ? await (async () => {
        const supabase = await createSupabaseServerClient()
        const { count } = await supabase.from('cart').select('id', { count: 'exact', head: true }).eq('user_id', user.id)
        return count ?? 0
      })()
    : 0

  return (
    <MainLayout>
      <Navbar user={user} cartCount={cartCount} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-24 md:pb-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filter sidebar */}
          <aside className="md:w-52 shrink-0">
            <div className="bg-white rounded-2xl border border-canvas-border p-4 shadow-card sticky top-20">
              <h3 className="font-semibold text-sm text-canvas-dark mb-3">Categories</h3>
              <div className="space-y-0.5">
                <a
                  href="/artworks"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${!params.category ? 'bg-teal-pale text-teal font-semibold' : 'text-canvas-muted hover:bg-teal-pale hover:text-teal'}`}
                >
                  All Artworks
                </a>
                {CATEGORIES.map(cat => (
                  <a
                    key={cat}
                    href={`/artworks?category=${encodeURIComponent(cat)}`}
                    className={`block px-3 py-2 rounded-lg text-sm transition-colors ${params.category === cat ? 'bg-teal-pale text-teal font-semibold' : 'text-canvas-muted hover:bg-teal-pale hover:text-teal'}`}
                  >
                    {cat}
                  </a>
                ))}
              </div>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="font-display font-bold text-2xl text-canvas-dark">
                  {params.category ? params.category : 'Explore Artworks'}
                </h1>
                {params.search && (
                  <p className="text-canvas-muted text-sm mt-0.5">
                    Search results for &quot;<strong>{params.search}</strong>&quot; — {artworks.length} found
                  </p>
                )}
              </div>
            </div>
            <Suspense fallback={<div className="text-canvas-muted py-8 text-center">Loading…</div>}>
              <FeaturedGrid artworks={artworks} userId={user?.id} />
            </Suspense>
          </div>
        </div>
      </main>
      <MobileBottomNav />
    </MainLayout>
  )
}
