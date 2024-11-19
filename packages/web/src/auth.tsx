import { useQuery } from '@tanstack/react-query'
import React, {useState, useCallback,useContext, createContext} from 'react'
import ky from 'ky';

const getSessionCookie = () => {
const name = "session" + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return null;
}
const fetchSession = async () => {
    const response = await ky('http://localhost:3000/auth/session', {
        credentials: 'include',
    })
    return response.json;
}
export interface AuthContext {
    isLoggedIn: boolean,
    user:{ id: string, name: string } | null,
    login: () => Promise<void>,
    logout: () => Promise<void>,
}

const AuthContext = createContext<AuthContext | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    

    const login = useCallback(async () => {
        window.location.href = 'http://localhost:3000/auth/github' 
    }, []);
    
    const logout = useCallback(async () => {
        
        document.cookie = 'session_token=; Max-Age=0;';
    }, []);
    
    const {data, isError } = useQuery({
        queryKey:['session'],
        queryFn: fetchSession,
        enabled: !!getSessionCookie(),
        retry:false,  
        
    })
   
    const user = !isError && data ? data.user : null;
    const isLoggedIn = !!user;
    return (
      <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
        {children}
      </AuthContext.Provider>
    )
    
}
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}


