import { Suspense } from 'react';
import { isAdmin } from '../../lib/supabase/utils';
import { redirect } from 'next/navigation';
import AdminDashboard from './components/admin-dashboard';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const userIsAdmin = await isAdmin();

  if (!userIsAdmin) {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen bg-black">
      <Suspense
        fallback={<div className="flex items-center justify-center min-h-screen bg-black text-white">Loading...</div>}
      >
        <AdminDashboard />
      </Suspense>
    </div>
  );
}
