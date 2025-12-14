'use client';

import { supabase } from './supabase';
import { User } from '@/types';

export async function signUpWithEmail(
  email: string,
  password: string,
  name: string
): Promise<User> {
  try {
    // Sign up with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
        },
      },
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('Failed to create user');

    // Create user profile in database
    const user: User = {
      id: authData.user.id,
      email: authData.user.email!,
      name: name,
      createdAt: new Date(),
    };

    const { error: dbError } = await supabase
      .from('users')
      .insert({
        id: user.id,
        email: user.email,
        name: user.name,
        created_at: user.createdAt.toISOString(),
      });

    if (dbError) {
      console.error('Error creating user profile:', dbError);
      // Continue anyway since auth was successful
    }

    return user;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to sign up');
  }
}

export async function signInWithEmail(
  email: string,
  password: string
): Promise<User> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    if (!data.user) throw new Error('Failed to sign in');

    // Get user profile from database
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    const user: User = {
      id: data.user.id,
      email: data.user.email!,
      name: profile?.name || data.user.user_metadata?.name || 'User',
      createdAt: new Date(profile?.created_at || data.user.created_at),
    };

    return user;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to sign in');
  }
}

export async function logOut(): Promise<void> {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to log out');
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    return {
      id: user.id,
      email: user.email!,
      name: profile?.name || user.user_metadata?.name || 'User',
      createdAt: new Date(profile?.created_at || user.created_at),
    };
  } catch (error) {
    return null;
  }
}

export function onAuthChange(callback: (user: User | null) => void) {
  return supabase.auth.onAuthStateChange(async (event, session) => {
    if (session?.user) {
      const user = await getCurrentUser();
      callback(user);
    } else {
      callback(null);
    }
  });
}
