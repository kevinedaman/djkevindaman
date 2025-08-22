'use server';

import { ensureUserProfile } from '../../../lib/supabase/utils';

export async function checkAdminRole(): Promise<{ isAdmin: boolean; error?: string }> {
  try {
    const profile = await ensureUserProfile();

    if (!profile) {
      return { isAdmin: false, error: 'Failed to get or create user profile' };
    }

    return { isAdmin: profile.role === 'admin' };
  } catch (error) {
    console.error('Error checking admin role:', error);
    return { isAdmin: false, error: 'Failed to check admin role' };
  }
}
