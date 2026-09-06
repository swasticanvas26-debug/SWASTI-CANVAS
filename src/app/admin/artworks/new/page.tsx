import { requireRole } from '@/lib/auth'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import MainLayout from '@/components/layout/MainLayout'
import Navbar from '@/components/layout/Navbar'
import AdminSidebar from '@/components/layout/AdminSidebar'
import AdminNewArtworkForm from '@/components/admin/AdminNewArtworkForm'

export default async function AdminNewArtworkPage() {
  const user = await requireRole(['admin'])
  const supabase = await createSupabaseServerClient()
  const { count: pendingCount } = await supabase.from('artworks').select('id', { count: 'exact', head: true }).eq('status', 'pending_approval')
  const { count: sellerCount } = await supabase.from('users').select('id', { count: 'exact', head: true }).eq('role', 'seller')

  return (
    <MainLayout>
      <Navbar user={user} />
      <div className="flex min-h-screen">
        <AdminSidebar pendingCount={pendingCount ?? 0} sellerRequestCount={sellerCount ?? 0} />
        <main className="flex-1 p-6 overflow-auto">
          <AdminNewArtworkForm />
        </main>
      </div>
    </MainLayout>
  )
}
