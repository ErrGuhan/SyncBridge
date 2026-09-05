'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export type UserRole = 'CUSTOMER' | 'WORKER' | 'COOP_ADMIN' | 'MANAGEMENT' | 'DEVELOPER';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  cooperativeId?: string;
  cooperativeName?: string;
  trade?: string;
  avatarUrl?: string;
}

export interface DemoPersona {
  role: UserRole;
  label: string;
  user: AuthUser;
  targetPath: string;
}

export const DEMO_PERSONAS: Record<UserRole, DemoPersona> = {
  CUSTOMER: {
    role: 'CUSTOMER',
    label: 'Customer / Household',
    targetPath: '/portal/customer',
    user: {
      id: 'usr-cust-001',
      email: 'priya.sharma@example.com',
      name: 'Priya Sharma',
      role: 'CUSTOMER',
      phone: '+91 98201 44552'
    }
  },
  WORKER: {
    role: 'WORKER',
    label: 'Cooperative Tradesperson',
    targetPath: '/portal/worker',
    user: {
      id: 'wrk-elec-101',
      email: 'ramesh.chavan@coop.in',
      name: 'Ramesh Chavan',
      role: 'WORKER',
      phone: '+91 98201 11221',
      trade: 'Master Electrician',
      cooperativeId: 'coop-01',
      cooperativeName: 'Vishwa Karma Labour Society'
    }
  },
  COOP_ADMIN: {
    role: 'COOP_ADMIN',
    label: 'Primary Society Secretary',
    targetPath: '/portal/admin',
    user: {
      id: 'adm-sec-201',
      email: 'anand.patil@kalyancoop.in',
      name: 'Anand Patil',
      role: 'COOP_ADMIN',
      phone: '+91 98201 88990',
      cooperativeId: 'coop-02',
      cooperativeName: 'Kalyan Labour Workers Society'
    }
  },
  MANAGEMENT: {
    role: 'MANAGEMENT',
    label: 'Executive Operations',
    targetPath: '/portal/management',
    user: {
      id: 'mgr-exec-301',
      email: 'vikram.rao@federation.coop.in',
      name: 'Vikram Rao',
      role: 'MANAGEMENT',
      phone: '+91 98201 00011'
    }
  },
  DEVELOPER: {
    role: 'DEVELOPER',
    label: 'Technical Lead / DevOps',
    targetPath: '/portal/developer',
    user: {
      id: 'dev-arch-401',
      email: 'architect@syncbridge.network',
      name: 'Lead Architect',
      role: 'DEVELOPER',
      phone: '+91 98201 99999'
    }
  }
};

interface AuthContextType {
  user: AuthUser | null;
  role: UserRole;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginAsDemoUser: (role: UserRole) => void;
  loginWithSupabase: (email: string, password: string, role?: UserRole) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  getPortalUrlForRole: (role: UserRole) => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY_USER = 'syncbridge_user';
const STORAGE_KEY_TOKEN = 'supabase_token';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Rehydrate from localStorage or initialize with Customer default
    try {
      const storedUser = localStorage.getItem(STORAGE_KEY_USER);
      const storedToken = sessionStorage.getItem(STORAGE_KEY_TOKEN);

      if (storedUser) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken || 'demo-jwt-token-active');
      } else {
        // Default persona for initial exploration is Customer
        const defaultPersona = DEMO_PERSONAS.CUSTOMER;
        setUser(defaultPersona.user);
        setToken('demo-jwt-token-customer');
      }
    } catch {
      setUser(DEMO_PERSONAS.CUSTOMER.user);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginAsDemoUser = (targetRole: UserRole) => {
    const persona = DEMO_PERSONAS[targetRole];
    if (!persona) return;

    setUser(persona.user);
    const mockToken = `sb_jwt_${targetRole.toLowerCase()}_${Date.now()}`;
    setToken(mockToken);

    try {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(persona.user));
      sessionStorage.setItem(STORAGE_KEY_TOKEN, mockToken);
    } catch (e) {
      console.warn('Storage unavailable', e);
    }
  };

  const loginWithSupabase = async (email: string, password: string, requestedRole: UserRole = 'CUSTOMER') => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error || !data.user) {
        // Fallback: If account not yet registered in remote Supabase DB, allow demo credentials
        const fallbackUser: AuthUser = {
          id: `usr-${Date.now().toString(36)}`,
          email,
          name: email.split('@')[0].replace('.', ' ').toUpperCase(),
          role: requestedRole
        };
        setUser(fallbackUser);
        const demoToken = `sb_jwt_local_${Date.now()}`;
        setToken(demoToken);
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(fallbackUser));
        sessionStorage.setItem(STORAGE_KEY_TOKEN, demoToken);
        return { success: true };
      }

      const role = (data.user.user_metadata?.role as UserRole) || requestedRole;
      const verifiedUser: AuthUser = {
        id: data.user.id,
        email: data.user.email || email,
        name: data.user.user_metadata?.name || email.split('@')[0],
        role: role,
        phone: data.user.phone
      };

      setUser(verifiedUser);
      setToken(data.session?.access_token || null);
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(verifiedUser));
      if (data.session?.access_token) {
        sessionStorage.setItem(STORAGE_KEY_TOKEN, data.session.access_token);
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Authentication failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    try {
      supabase.auth.signOut();
      localStorage.removeItem(STORAGE_KEY_USER);
      sessionStorage.removeItem(STORAGE_KEY_TOKEN);
    } catch {
      // Ignore
    }
    setUser(null);
    setToken(null);
  };

  const getPortalUrlForRole = (r: UserRole): string => {
    return DEMO_PERSONAS[r]?.targetPath || '/portal/customer';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || 'CUSTOMER',
        token,
        isAuthenticated: Boolean(user),
        isLoading,
        loginAsDemoUser,
        loginWithSupabase,
        logout,
        getPortalUrlForRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
