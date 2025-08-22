import { createClient } from './server';
import { prisma } from '../prisma';
import type { UserRole } from '../../generated/prisma';

export async function getUser() {
  const supabase = await createClient();
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

export async function getUserProfile() {
  try {
    const user = await getUser();
    if (!user) return null;

    const profile = await prisma.userProfile.findUnique({
      where: { id: user.id },
    });

    return profile;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

export async function isAdmin(): Promise<boolean> {
  const profile = await getUserProfile();
  return profile?.role === 'admin';
}

export async function hasRole(role: UserRole): Promise<boolean> {
  const profile = await getUserProfile();
  return profile?.role === role;
}

export async function createUserProfile(userId: string, email: string, role: UserRole = 'user') {
  try {
    const profile = await prisma.userProfile.create({
      data: {
        id: userId,
        email,
        role: email === 'djkevindaman@gmail.com' ? 'admin' : role, // Auto-assign admin role to DJ email [[memory:6937431]]
      },
    });
    return profile;
  } catch (error) {
    console.error('Error creating user profile:', error);
    return null;
  }
}

export async function ensureUserProfile() {
  try {
    const user = await getUser();
    if (!user) return null;

    let profile = await getUserProfile();

    // If no profile exists, create one
    if (!profile) {
      profile = await createUserProfile(user.id, user.email || '', 'user');
    }

    return profile;
  } catch (error) {
    console.error('Error ensuring user profile:', error);
    return null;
  }
}
