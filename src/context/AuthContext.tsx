import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';
import type { User, Company } from '../types';

interface AuthContextType {
  user: User | null;
  company: Company | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  unreadNotifications: number;
  requestOtp: (email: string, type?: 'LOGIN' | 'REGISTER') => Promise<{
    exists: boolean;
    message: string;
    emailSent?: boolean;
    attempt?: number;
    maxAttempts?: number;
    validitySeconds?: number;
  }>;
  verifyOtp: (email: string, otp: string) => Promise<{ registered: boolean; user?: User; company?: Company }>;
  register: (data: any) => Promise<any>;
  updateCompany: (data: Partial<Company>) => Promise<void>;
  refreshSession: () => Promise<void>;
  setUnreadNotifications: React.Dispatch<React.SetStateAction<number>>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('amanah_public_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [company, setCompany] = useState<Company | null>(() => {
    const saved = localStorage.getItem('amanah_public_company');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('amanah_public_token');
  });

  const [unreadNotifications, setUnreadNotifications] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshSession = async () => {
    const currentToken = localStorage.getItem('amanah_public_token');
    if (!currentToken) {
      setIsLoading(false);
      return;
    }

    try {
      const res = await api.get('/auth/session');
      if (res.data.status === 'success') {
        const { user: userData, company: companyData, unreadNotifications: count } = res.data.data;
        setUser(userData);
        setCompany(companyData);
        setUnreadNotifications(count || 0);
        localStorage.setItem('amanah_public_user', JSON.stringify(userData));
        localStorage.setItem('amanah_public_company', JSON.stringify(companyData));
      }
    } catch {
      localStorage.removeItem('amanah_public_token');
      localStorage.removeItem('amanah_public_user');
      localStorage.removeItem('amanah_public_company');
      setUser(null);
      setCompany(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshSession();
  }, []);

  const requestOtp = async (email: string, type: 'LOGIN' | 'REGISTER' = 'LOGIN') => {
    const res = await api.post('/auth/request-otp', { email, type });
    return {
      exists: !!res.data.exists,
      message: res.data.message,
      emailSent: res.data.emailSent,
      attempt: res.data.attempt,
      maxAttempts: res.data.maxAttempts,
      validitySeconds: res.data.validitySeconds,
    };
  };

  const verifyOtp = async (email: string, otp: string) => {
    const res = await api.post('/auth/verify-otp', { email, otp });
    if (res.data.registered && res.data.data) {
      const { token: authToken, user: userData, company: companyData } = res.data.data;
      setToken(authToken);
      setUser(userData);
      setCompany(companyData);
      localStorage.setItem('amanah_public_token', authToken);
      localStorage.setItem('amanah_public_user', JSON.stringify(userData));
      localStorage.setItem('amanah_public_company', JSON.stringify(companyData));
      return { registered: true, user: userData, company: companyData };
    }
    return { registered: false };
  };

  const register = async (data: any) => {
    const res = await api.post('/auth/register', data);
    if (res.data.status === 'success' && res.data.data) {
      const { token: authToken, user: userData, company: companyData } = res.data.data;
      setToken(authToken);
      setUser(userData);
      setCompany(companyData);
      localStorage.setItem('amanah_public_token', authToken);
      localStorage.setItem('amanah_public_user', JSON.stringify(userData));
      localStorage.setItem('amanah_public_company', JSON.stringify(companyData));
    }
    return res.data;
  };

  const updateCompany = async (data: Partial<Company>) => {
    const res = await api.put('/company/profile', data);
    if (res.data.status === 'success') {
      setCompany(res.data.data);
      localStorage.setItem('amanah_public_company', JSON.stringify(res.data.data));
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {}
    localStorage.removeItem('amanah_public_token');
    localStorage.removeItem('amanah_public_user');
    localStorage.removeItem('amanah_public_company');
    setUser(null);
    setCompany(null);
    setToken(null);
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        company,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        unreadNotifications,
        requestOtp,
        verifyOtp,
        register,
        updateCompany,
        refreshSession,
        setUnreadNotifications,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
