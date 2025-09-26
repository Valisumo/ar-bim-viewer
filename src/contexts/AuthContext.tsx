import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, UserProfile, UserRole } from '../config/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  isGuest: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  joinAsGuest: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const isAdmin = profile?.role === 'admin';
  const isGuest = profile?.role === 'guest';

  const fetchUserProfile = async (userId: string) => {
    console.log('AuthContext: Fetching profile for user:', userId);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        const code = (error as any)?.code;
        if (code && code !== 'PGRST116') {
          console.error('AuthContext: Profile fetch error:', error);
        } else {
          console.warn('AuthContext: No profile row, creating default');
        }
        setProfile({
          id: userId,
          role: 'user',
          full_name: 'User',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
        return;
      }

      setProfile(
        data ?? {
          id: userId,
          role: 'user',
          full_name: 'User',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      );
      console.log('AuthContext: Profile ready');
    } catch (e) {
      console.error('AuthContext: Profile fetch crash:', e);
      setProfile({
        id: userId,
        role: 'user',
        full_name: 'User',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    } finally {
      // IMPORTANT: Always end loading
      console.log('AuthContext: Setting loading to false in fetchUserProfile finally');
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    console.log('AuthContext: Initializing auth...');

    async function init() {
      try {
        console.log('AuthContext: Calling getSession...');
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log('AuthContext: getSession result:', { session: !!session, error });

        if (!mounted) return;

        if (error) console.warn('AuthContext: getSession error', error);

        setSession(session ?? null);
        setUser(session?.user ?? null);

        if (session?.user) {
          console.log('AuthContext: Session exists, fetching profile...');
          await fetchUserProfile(session.user.id); // ends loading in finally
        } else {
          console.log('AuthContext: No session, setting loading to false immediately');
          setProfile(null);
          setLoading(false); // end loading immediately if no session
        }
      } catch (e) {
        console.error('AuthContext: Auth init crash', e);
        if (mounted) {
          setProfile(null);
          setLoading(false);
        }
      }
    }

    init();

    const { data: sub } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      console.log('AuthContext: Auth state change:', event, session ? 'session exists' : 'no session');
      setSession(session ?? null);
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchUserProfile(session.user.id); // ends loading in finally
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string): Promise<{ error: any }> => {
    console.log('AuthContext: Attempting sign in for:', email);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    console.log('AuthContext: Sign in result:', { error: !!error });
    return { error };
  };

  const signUp = async (email: string, password: string, fullName: string): Promise<{ error: any }> => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName }
      }
    });
    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const joinAsGuest = () => {
    console.log('AuthContext: Joining as guest');
    setProfile({
      id: 'guest',
      role: 'guest' as UserRole,
      full_name: 'Guest User',
      email: 'guest@example.com',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    setLoading(false);
  };

  const value: AuthContextType = {
    user,
    session,
    profile,
    loading,
    isAdmin,
    isGuest,
    signIn,
    signUp,
    signOut,
    joinAsGuest,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};