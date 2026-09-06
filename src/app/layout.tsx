import type { Metadata } from 'next'
import { Inter, Outfit } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

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

export const metadata: Metadata = {
  title: 'Swasti Canvas – Art for Everyone',
  description: 'Discover and collect unique, one-of-a-kind artworks from talented artists across India. Buy original paintings, support artists directly.',
  keywords: 'art marketplace, original paintings, buy art online, Indian art, Swasti Canvas',
  openGraph: {
    title: 'Swasti Canvas – Art for Everyone',
    description: 'Original artworks by talented Indian artists. Discover, collect, and support art.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`} data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
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
      </body>
    </html>
  )
}
