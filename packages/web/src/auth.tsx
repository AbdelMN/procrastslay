import { useQuery } from '@tanstack/react-query';
import React, { useCallback, useContext, createContext } from 'react';

import ky from 'ky';

const fetchSession = async (): Promise<SessionData> => {
  const response = await ky('http://localhost:3000/auth/session', {
    credentials: 'include',
  });

  return response.json();
};
interface SessionData {
  user: {
    id: string;
    githubId: string;
    githubUsername: string;
  } | null;
}
export interface AuthContext {
  isLoggedIn: boolean;
  user: SessionData['user'];
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContext | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const login = useCallback(async () => {
    window.location.href = 'http://localhost:3000/auth/github';
  }, []);

  const logout = useCallback(async () => {
    window.location.href = 'http://localhost:3000/auth/logout';
  }, []);

  const { data, isError, isLoading, error } = useQuery<SessionData>({
    queryKey: ['session'],
    queryFn: fetchSession,
    enabled: true,
    retry: false,
  });

  if (isLoading) {
    console.log('Chargement en cours...');
    return <div>Chargement...</div>;
  }

  if (isError) {
    console.error('Erreur de chargement des données :', error);
    return <div>Erreur : Impossible de récupérer les données</div>;
  }

  const user = data?.user || null;
  const isLoggedIn = !!user;

  console.log(user);
  console.log(isLoggedIn);
  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
