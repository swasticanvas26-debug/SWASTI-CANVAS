import { createSupabaseServerClient } from './supabase/server'
import { redirect } from 'next/navigation'

export type UserRole = 'admin' | 'customer' | 'seller'

export interface AppUser {
  id: string
  name: string
  email: string
  role: UserRole
  avatar_url?: string
  address?: string
  created_at: string
  listing_enabled?: boolean
  listing_quota?: number
  permission_requested?: boolean
}

export async function getSession() {
  const supabase = await createSupabaseServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

import { cache } from 'react'

export const getAppUser = cache(async (): Promise<AppUser | null> => {
  const supabase = await createSupabaseServerClient()
  
  // getSession is much faster as it relies on cookies instead of a full network request
  // Since proxy.ts already calls getUser() to refresh the session, the cookie is guaranteed fresh
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user) return null

  const { data } = await supabase
    .from('users')
    .select('*')
    .eq('id', session.user.id)
    .single()

  return data as AppUser | null
})

export async function requireRole(allowedRoles: UserRole[]) {
  const user = await getAppUser()
  if (!user) redirect('/login')
  if (!allowedRoles.includes(user.role)) redirect('/')
  return user
}
