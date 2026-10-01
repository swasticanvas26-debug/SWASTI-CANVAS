import type { MetadataRoute } from 'next'
import { createSupabaseServiceClient } from '@/lib/supabase/server'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://swasticanvas.com'

export const revalidate = 3600 // Regenerate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static public pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/artworks`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/competition`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/reviews`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    // Category pages (canonical URL format)
    {
      url: `${BASE_URL}/artworks?category=Landscape`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/artworks?category=Abstract`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/artworks?category=Animal+%26+Birds`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/artworks?category=Religious`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/artworks?category=Figurative`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/artworks?category=Indian`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
  ]

  // Dynamic artwork pages
  let artworkPages: MetadataRoute.Sitemap = []
  try {
    const supabase = await createSupabaseServiceClient()
    const { data: artworks } = await supabase
      .from('artworks')
      .select('id, updated_at, image_url')
      .eq('status', 'listed')
      .order('created_at', { ascending: false })

    if (artworks) {
      artworkPages = artworks.map((artwork) => ({
        url: `${BASE_URL}/artworks/${artwork.id}`,
        lastModified: artwork.updated_at ? new Date(artwork.updated_at) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
        ...(artwork.image_url ? { images: [artwork.image_url] } : {}),
      }))
    }
  } catch (error) {
    // If DB fetch fails, return static pages only
    console.error('Sitemap: failed to fetch artworks', error)
  }

  return [...staticPages, ...artworkPages]
}
