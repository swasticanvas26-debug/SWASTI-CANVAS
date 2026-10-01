import type { Metadata } from 'next'
import { Inter, Outfit } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: false,
})

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
  preload: false,
})

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://swasticanvas.com'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Swasti Canvas – Buy Original Indian Art Online | Art for Everyone',
    template: '%s | Swasti Canvas',
  },
  description:
    'Swasti Canvas is India\'s premier online art marketplace. Buy original paintings, landscape art, abstract art, religious art and more from talented Indian artists. Support art. Collect originals.',
  keywords: [
    'buy original paintings online India',
    'Indian art marketplace',
    'original artwork for sale',
    'buy art online India',
    'Indian paintings online',
    'landscape paintings India',
    'abstract art India',
    'religious paintings India',
    'art for everyone',
    'Swasti Canvas',
    'original art Haryana',
    'art competition India',
    'emerging Indian artists',
    'collect Indian art',
    'online art gallery India',
  ],
  authors: [{ name: 'Swasti Canvas', url: BASE_URL }],
  creator: 'Swasti Canvas',
  publisher: 'Swasti Canvas',
  category: 'Art & Culture',
  applicationName: 'Swasti Canvas',
  referrer: 'origin-when-cross-origin',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    title: 'Swasti Canvas – Buy Original Indian Art Online',
    description:
      'Discover and buy original paintings from talented Indian artists. Landscape, Abstract, Religious, Figurative art and more. Art for Everyone.',
    url: BASE_URL,
    siteName: 'Swasti Canvas',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: `${BASE_URL}/logo.jpg`,
        width: 1200,
        height: 630,
        alt: 'Swasti Canvas – Indian Art Marketplace',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Swasti Canvas – Buy Original Indian Art Online',
    description:
      'India\'s premier online art marketplace. Buy original paintings, support talented artists.',
    images: [`${BASE_URL}/logo.jpg`],
    creator: '@swasticanvas',
    site: '@swasticanvas',
  },
  verification: {
    // Add your Google Search Console verification token here once available
    // google: 'your-google-verification-token',
  },
}

// Website + Organization Schema (JSON-LD)
const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Swasti Canvas',
  description: "India's premier online art marketplace – Buy original Indian paintings and support talented artists.",
  url: BASE_URL,
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${BASE_URL}/artworks?search={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
}

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Swasti Canvas',
  url: BASE_URL,
  logo: `${BASE_URL}/logo.jpg`,
  description: 'Art for Everyone – Celebrating, promoting, and making Indian art accessible to all.',
  address: {
    '@type': 'PostalAddress',
    addressRegion: 'Haryana',
    addressCountry: 'IN',
  },
  sameAs: [
    // Add social profile URLs here when available
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`} data-scroll-behavior="smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className="font-sans text-canvas-dark antialiased">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#1A1A1A',
              border: '1px solid #E5E7EB',
              borderRadius: '10px',
              fontSize: '0.875rem',
            },
            success: { iconTheme: { primary: '#2A7D6F', secondary: '#fff' } },
            error: { iconTheme: { primary: '#EF4444', secondary: '#fff' } },
          }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
