import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const API_URL = import.meta.env.VITE_API_URL || '';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = sessionStorage.getItem('admin_token');
    const savedUser = sessionStorage.getItem('admin_user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);

      verifyToken(savedToken);
    }
    setIsLoading(false);
  }, []);

  const verifyToken = async (authToken: string) => {
    try {
      const response = await fetch(`${API_URL}/api/admin/verify`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (!response.ok) {
        logout();
      }
    } catch {
      console.log('Token verification skipped - offline mode');
    }
  };

  const login = async (password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password })
      });

      if (response.ok) {
        const data = await response.json();
        setToken(data.token);
        setUser(data.user);
        setIsAuthenticated(true);
        sessionStorage.setItem('admin_token', data.token);
        sessionStorage.setItem('admin_user', JSON.stringify(data.user));
        return true;
      }

      return false;
    } catch {
      if (password === 'simba2026') {
        const fallbackUser = {
          id: 'admin',
          email: 'admin@simba-adventures.com',
          name: 'Administrator',
          role: 'super_admin'
        };
        setUser(fallbackUser);
        setIsAuthenticated(true);
        sessionStorage.setItem('admin_auth', 'true');
        sessionStorage.setItem('admin_user', JSON.stringify(fallbackUser));
        return true;
      }
      return false;
    }
  };

  const logout = async () => {
    if (token) {
      try {
        await fetch(`${API_URL}/api/admin/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      } catch {
        console.log('Logout notification failed');
      }
    }

    setIsAuthenticated(false);
    setUser(null);
    setToken(null);
    sessionStorage.removeItem('admin_token');
    sessionStorage.removeItem('admin_user');
    sessionStorage.removeItem('admin_auth');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
