import React, { createContext, useContext, useEffect, useState } from 'react';
import { initStore, getCurrentUser, login, logout, register, updateUser } from '../store';

interface AuthContextType {
  user: any | null;
  loading: boolean;
  login: (email: string, password: string) => any;
  register: (data: any) => any;
  logout: () => void;
  updateUser: (data: any) => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initStore().then(() => {
      setUser(getCurrentUser());
      setLoading(false);
    });
  }, []);

  const handleLogin = (email: string, password: string) => {
    const u = login(email, password);
    setUser(u);
    return u;
  };

  const handleRegister = (data: any) => {
    const u = register(data);
    setUser(u);
    return u;
  };

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  const handleUpdateUser = (data: any) => {
    const updated = updateUser(data);
    setUser(updated);
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login: handleLogin,
      register: handleRegister,
      logout: handleLogout,
      updateUser: handleUpdateUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
