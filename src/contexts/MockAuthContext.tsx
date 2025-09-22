import React, { createContext, useContext, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { UserProfile, UserRole } from '../config/supabase';

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
  const [loading, setLoading] = useState(true); // Start with loading true

  // Initialize auth state from localStorage on component mount
  React.useEffect(() => {
    console.log('MockAuth: Initializing from localStorage...');
    
    try {
      const savedUser = localStorage.getItem('mockAuth_user');
      const savedProfile = localStorage.getItem('mockAuth_profile');
      const savedSession = localStorage.getItem('mockAuth_session');

      if (savedUser && savedProfile && savedSession) {
        console.log('MockAuth: Restoring saved session');
        setUser(JSON.parse(savedUser));
        setProfile(JSON.parse(savedProfile));
        setSession(JSON.parse(savedSession));
      } else {
        console.log('MockAuth: No saved session found');
      }
    } catch (error) {
      console.error('MockAuth: Error restoring session:', error);
    }
    
    // Always set loading to false after initialization
    setLoading(false);
  }, []);

  // Mock functions for development
  const signIn = async (email: string, password: string) => {
    console.log('Mock signIn:', email);
    
    // Create mock user and profile
    const mockUser = {
      id: 'mock-user-id',
      email: email,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    } as User;

    const mockProfile: UserProfile = {
      id: 'mock-user-id',
      email: email,
      role: email.includes('admin') ? 'admin' : 'user',
      full_name: email.includes('admin') ? 'Admin User' : 'Test User',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    setUser(mockUser);
    setProfile(mockProfile);
    setSession({ user: mockUser } as Session);
    
    // Save to localStorage
    localStorage.setItem('mockAuth_user', JSON.stringify(mockUser));
    localStorage.setItem('mockAuth_profile', JSON.stringify(mockProfile));
    localStorage.setItem('mockAuth_session', JSON.stringify({ user: mockUser }));
    
    return { error: null };
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    console.log('Mock signUp:', email, fullName);
    
    // Create mock user and profile
    const mockUser = {
      id: 'mock-user-id-' + Date.now(),
      email: email,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    } as User;

    const mockProfile: UserProfile = {
      id: mockUser.id,
      email: email,
      role: 'user',
      full_name: fullName,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    setUser(mockUser);
    setProfile(mockProfile);
    setSession({ user: mockUser } as Session);
    
    // Save to localStorage
    localStorage.setItem('mockAuth_user', JSON.stringify(mockUser));
    localStorage.setItem('mockAuth_profile', JSON.stringify(mockProfile));
    localStorage.setItem('mockAuth_session', JSON.stringify({ user: mockUser }));
    
    return { error: null };
  };

  const signOut = async () => {
    console.log('Mock signOut');
    setUser(null);
    setProfile(null);
    setSession(null);
    
    // Clear localStorage
    localStorage.removeItem('mockAuth_user');
    localStorage.removeItem('mockAuth_profile');
    localStorage.removeItem('mockAuth_session');
  };

  const joinAsGuest = () => {
    console.log('Mock joinAsGuest');
    const guestProfile: UserProfile = {
      id: 'guest',
      role: 'guest',
      full_name: 'Guest User',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setProfile(guestProfile);
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
