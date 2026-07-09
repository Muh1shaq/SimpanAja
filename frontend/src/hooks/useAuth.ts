import { useState, useCallback } from 'react';

export type UserRole = 'floor_supervisor' | 'zone_manager' | 'admin';

export interface AuthUser {
  id: string;
  name: string;
  role: UserRole;
  zone?: string;
  avatar?: string;
  shift: string;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const MOCK_USER: AuthUser = {
  id: 'usr-001',
  name: 'Zone A-1 Manager',
  role: 'zone_manager',
  zone: 'A',
  avatar: '/assets/images/avatar-default.png',
  shift: 'Morning',
};

export function useAuth() {
  const [auth, setAuth] = useState<AuthState>({
    user: MOCK_USER,
    isAuthenticated: true,
    isLoading: false,
  });

  const login = useCallback(async (_email: string, _password: string) => {
    setAuth(prev => ({ ...prev, isLoading: true }));
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    setAuth({ user: MOCK_USER, isAuthenticated: true, isLoading: false });
  }, []);

  const logout = useCallback(() => {
    setAuth({ user: null, isAuthenticated: false, isLoading: false });
  }, []);

  const hasPermission = useCallback(
    (requiredRole: UserRole) => {
      if (!auth.user) return false;
      const hierarchy: UserRole[] = ['floor_supervisor', 'zone_manager', 'admin'];
      return hierarchy.indexOf(auth.user.role) >= hierarchy.indexOf(requiredRole);
    },
    [auth.user]
  );

  return { ...auth, login, logout, hasPermission };
}
