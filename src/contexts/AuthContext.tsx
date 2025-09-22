import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, UserProfile, UserRole } from '../config/supabase';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  joinAsGuest: () => void;
  isAdmin: boolean;
  isGuest: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    console.log('AuthContext: Initializing...');

    let isMounted = true;
    let loadingTimeout: NodeJS.Timeout;
    let profileTimeout: NodeJS.Timeout;

    // Add timeout to prevent infinite loading
    loadingTimeout = setTimeout(() => {
      if (isMounted) {
        console.log('AuthContext: Loading timeout - forcing loading to false');
        setLoading(false);
        setInitialized(true);
      }
    }, 3000); // 3 second timeout

    // Get initial session
    const initializeAuth = async () => {
      try {
        console.log('AuthContext: Getting initial session...');
        const { data: { session }, error } = await supabase.auth.getSession();

        if (!isMounted) return;

        console.log('AuthContext: Initial session result:', session ? 'exists' : 'null', error ? 'with error' : '');

        clearTimeout(loadingTimeout);
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          console.log('AuthContext: User session found, fetching profile...');
          await fetchUserProfile(session.user.id);
        } else {
          console.log('AuthContext: No session found, stopping loading');
          setLoading(false);
          setInitialized(true);
        }
      } catch (error) {
        console.error('AuthContext: Error getting session:', error);
        if (isMounted) {
          clearTimeout(loadingTimeout);
          setLoading(false);
          setInitialized(true);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('AuthContext: Auth state changed:', event, session ? 'session exists' : 'no session');

      if (!isMounted) return;

      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        // Clear any existing profile timeout
        if (profileTimeout) clearTimeout(profileTimeout);

        profileTimeout = setTimeout(() => {
          console.log('AuthContext: Profile fetch timeout, stopping loading');
          setLoading(false);
          setInitialized(true);
        }, 2000);

        await fetchUserProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
        setInitialized(true);
      }
    });

    return () => {
      isMounted = false;
      if (loadingTimeout) clearTimeout(loadingTimeout);
      if (profileTimeout) clearTimeout(profileTimeout);
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    console.log('AuthContext: Fetching profile for user:', userId);

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('AuthContext: Error fetching profile:', error);
        // Create a default profile if fetch fails
        setProfile({
          id: userId,
          role: 'user',
          full_name: 'User',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
        setLoading(false);
        setInitialized(true);
      } else if (data) {
        console.log('AuthContext: Profile fetched successfully:', data);
        setProfile(data);
        setLoading(false);
        setInitialized(true);
      } else {
        console.log('AuthContext: No profile found, creating default profile');
        // Create a basic user profile if none exists
        setProfile({
          id: userId,
          role: 'user',
          full_name: 'New User',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
        setLoading(false);
        setInitialized(true);
      }
    } catch (error) {
      console.error('AuthContext: Error fetching profile:', error);
      // Always create a fallback profile and stop loading
      setProfile({
        id: userId,
        role: 'user',
        full_name: 'User',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      setLoading(false);
      setInitialized(true);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const joinAsGuest = () => {
    console.log('AuthContext: Joining as guest');
    const guestProfile: UserProfile = {
      id: 'guest',
      role: 'guest',
      full_name: 'Guest User',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setProfile(guestProfile);
    setLoading(false);
    setInitialized(true);
  };

  const isAdmin = profile?.role === 'admin';
  const isGuest = profile?.role === 'guest';

  const value = {
    user,
    profile,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    joinAsGuest,
    isAdmin,
    isGuest,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
