import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
}

interface UserAuthContextType {
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<boolean>;
    register: (name: string, email: string, password: string, phone: string) => Promise<boolean>;
    logout: () => void;
    isLoading: boolean;
}

const UserAuthContext = createContext<UserAuthContextType | null>(null);

const API_URL = import.meta.env.VITE_API_URL || '';

export function UserAuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const savedToken = localStorage.getItem('user_token');
        const savedUser = localStorage.getItem('user_data');
        if (savedToken && savedUser) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const res = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            if (res.ok) {
                const data = await res.json();
                setToken(data.token);
                setUser(data.user);
                localStorage.setItem('user_token', data.token);
                localStorage.setItem('user_data', JSON.stringify(data.user));
                return true;
            }
        } catch (e) { console.error(e); }
        return false;
    };

    const register = async (name: string, email: string, password: string, phone: string) => {
        try {
            const res = await fetch(`${API_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, phone })
            });
            if (res.ok) {
                const data = await res.json();
                setToken(data.token);
                setUser(data.user);
                localStorage.setItem('user_token', data.token);
                localStorage.setItem('user_data', JSON.stringify(data.user));
                return true;
            }
        } catch (e) { console.error(e); }
        return false;
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('user_token');
        localStorage.removeItem('user_data');
    };

    return (
        <UserAuthContext.Provider value={{ user, token, login, register, logout, isLoading }}>
            {children}
        </UserAuthContext.Provider>
    );
}

export const useUserAuth = () => {
    const context = useContext(UserAuthContext);
    if (!context) throw new Error('useUserAuth error');
    return context;
};
