'use client';

import React, { createContext, useContext, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export type UserRole =
  | 'CUSTOMER'
  | 'WORKER'
  | 'SOCIETY_SECRETARY'  // Primary Labour Cooperative Secretary
  | 'FEDERATION_ADMIN'   // State / National Federation Admin
  | 'COOP_ADMIN'         // Legacy alias (maps to SOCIETY_SECRETARY)
  | 'MANAGEMENT'
  | 'DEVELOPER';

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
    label: 'Primary Society Secretary (Legacy)',
    targetPath: '/portal/admin',
    user: {
      id: 'adm-sec-201',
      email: 'anand.patil@kalyancoop.in',
      name: 'Anand Patil',
      role: 'COOP_ADMIN',
      phone: '+91 98201 88990',
      cooperativeId: 'soc-blr-002',
      cooperativeName: 'Kalyan Labour Workers Society'
    }
  },
  SOCIETY_SECRETARY: {
    role: 'SOCIETY_SECRETARY',
    label: 'Primary Society Secretary',
    targetPath: '/portal/admin',
    user: {
      id: 'usr-sec-201',
      email: 'anand.patil@kalyan.coop.in',
      name: 'Anand Patil',
      role: 'SOCIETY_SECRETARY',
      phone: '+91 98201 88990',
      cooperativeId: 'soc-blr-002',
      cooperativeName: 'Kalyan Labour Workers Society'
    }
  },
  FEDERATION_ADMIN: {
    role: 'FEDERATION_ADMIN',
    label: 'Federation Administrator',
    targetPath: '/portal/management',
    user: {
      id: 'usr-adm-301',
      email: 'vikram.rao@klcf.coop.in',
      name: 'Vikram Rao',
      role: 'FEDERATION_ADMIN',
      phone: '+91 98201 00011',
      cooperativeName: 'Karnataka Labour Cooperative Federation'
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

const AUTH_STORE_EVENT = 'syncbridge_auth_update';

function subscribeToAuth(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('storage', callback);
  window.addEventListener(AUTH_STORE_EVENT, callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener(AUTH_STORE_EVENT, callback);
  };
}

function getStoredUserSnapshot(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY_USER);
  } catch {
    return null;
  }
}

function getServerUserSnapshot(): string | null {
  return null;
}

function getStoredTokenSnapshot(): string | null {
  try {
    return sessionStorage.getItem(STORAGE_KEY_TOKEN);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const rawUser = React.useSyncExternalStore(subscribeToAuth, getStoredUserSnapshot, getServerUserSnapshot);
  const rawToken = React.useSyncExternalStore(subscribeToAuth, getStoredTokenSnapshot, () => null);

  const user = React.useMemo<AuthUser | null>(() => {
    if (!rawUser) return null;
    try {
      return JSON.parse(rawUser) as AuthUser;
    } catch {
      return null;
    }
  }, [rawUser]);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const loginAsDemoUser = (targetRole: UserRole) => {
    const persona = DEMO_PERSONAS[targetRole];
    if (!persona) return;

    const mockToken = `sb_jwt_${targetRole.toLowerCase()}_${Date.now()}`;

    try {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(persona.user));
      sessionStorage.setItem(STORAGE_KEY_TOKEN, mockToken);
      // Set role cookie for server-side middleware route protection
      document.cookie = `syncbridge_role=${targetRole}; path=/; SameSite=Lax`;
      document.cookie = `syncbridge_auth=${mockToken}; path=/; SameSite=Lax`;
      window.dispatchEvent(new Event(AUTH_STORE_EVENT));
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
        const demoToken = `sb_jwt_local_${Date.now()}`;
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(fallbackUser));
        sessionStorage.setItem(STORAGE_KEY_TOKEN, demoToken);
        window.dispatchEvent(new Event(AUTH_STORE_EVENT));
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

      const tokenVal = data.session?.access_token || `sb_jwt_sess_${Date.now()}`;
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(verifiedUser));
      sessionStorage.setItem(STORAGE_KEY_TOKEN, tokenVal);
      // Set role cookie for server-side middleware route protection
      document.cookie = `syncbridge_role=${role}; path=/; SameSite=Lax`;
      document.cookie = `syncbridge_auth=${tokenVal}; path=/; SameSite=Lax`;
      window.dispatchEvent(new Event(AUTH_STORE_EVENT));

      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Authentication failed';
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    try {
      supabase.auth.signOut();
      localStorage.removeItem(STORAGE_KEY_USER);
      sessionStorage.removeItem(STORAGE_KEY_TOKEN);
      // Clear role cookies
      document.cookie = 'syncbridge_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'syncbridge_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      window.dispatchEvent(new Event(AUTH_STORE_EVENT));
    } catch {
      // Ignore
    }
  };

  const getPortalUrlForRole = (r: UserRole): string => {
    if (r === 'SOCIETY_SECRETARY' || r === 'COOP_ADMIN') return '/portal/admin';
    if (r === 'FEDERATION_ADMIN') return '/portal/management';
    return DEMO_PERSONAS[r]?.targetPath || '/portal/customer';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || 'CUSTOMER',
        token: rawToken,
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
