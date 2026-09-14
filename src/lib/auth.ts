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

import { cache } from 'react'

export const getAppUser = cache(async (): Promise<AppUser | null> => {
  const supabase = await createSupabaseServerClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  return data as AppUser | null
})

export async function requireRole(allowedRoles: UserRole[]) {
  const user = await getAppUser()
  if (!user) redirect('/login')
  if (!allowedRoles.includes(user.role)) redirect('/')
  return user
}
