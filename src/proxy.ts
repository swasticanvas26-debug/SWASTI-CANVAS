import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

// In-memory store for rate limiting (local to the Edge function instance)
// Key: IP address, Value: { count: number, resetTime: number }
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

// Configuration
const WINDOW_SIZE_MS = 60 * 1000 // 1 minute
const MAX_REQUESTS = 60 // 60 requests per minute per IP

export async function proxy(request: NextRequest) {
  // Only apply rate limiting to API routes
  if (request.nextUrl.pathname.startsWith('/api')) {
    // Get client IP address
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    
    const now = Date.now()
    const record = rateLimitStore.get(ip)

    if (!record || now > record.resetTime) {
      // First request or window expired, create a new record
      rateLimitStore.set(ip, {
        count: 1,
        resetTime: now + WINDOW_SIZE_MS,
      })
    } else {
      // Window is active, check limit
      if (record.count >= MAX_REQUESTS) {
        return new NextResponse(
          JSON.stringify({
            error: 'Too many requests',
            message: 'You have exceeded the rate limit. Please try again later.'
          }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'Retry-After': Math.ceil((record.resetTime - now) / 1000).toString(),
            },
          }
        )
      }
      
      // Increment count
      record.count++
      rateLimitStore.set(ip, record)
    }
  }

  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // Public routes
  // TODO (Post-Competition Cleanup): Remove '/competition' from this array when the competition is over
  const publicRoutes = ['/', '/login', '/signup', '/artworks', '/faq', '/terms', '/privacy-policy', '/reviews', '/about', '/competition']
  const isPublic = publicRoutes.some(r => pathname === r || (r !== '/' && pathname.startsWith(`${r}/`)))
  const isApi = pathname.startsWith('/api/')

  if (!user && !isPublic && !isApi) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  if (user) {
    // Redirect logged-in users away from auth pages
    if (pathname === '/login' || pathname === '/signup') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
