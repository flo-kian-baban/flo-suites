'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface AdminAuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (password: string) => Promise<boolean>;
    logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

const AUTH_STORAGE_KEY = 'flo-admin-auth';

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    // Check auth state on mount
    useEffect(() => {
        const checkAuth = () => {
            const authToken = localStorage.getItem(AUTH_STORAGE_KEY);
            setIsAuthenticated(authToken === 'authenticated');
            setIsLoading(false);
        };
        checkAuth();
    }, []);

    // Redirect logic
    useEffect(() => {
        if (isLoading) return;

        const isLoginPage = pathname === '/admin/login';

        if (!isAuthenticated && !isLoginPage && pathname?.startsWith('/admin')) {
            router.push('/admin/login');
        } else if (isAuthenticated && isLoginPage) {
            router.push('/admin');
        }
    }, [isAuthenticated, isLoading, pathname, router]);

    const login = useCallback(async (password: string): Promise<boolean> => {
        try {
            const response = await fetch('/api/admin/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });

            if (response.ok) {
                localStorage.setItem(AUTH_STORAGE_KEY, 'authenticated');
                // Set cookie for middleware
                document.cookie = `flo-admin-token=authenticated; path=/; max-age=86400; SameSite=Strict`;
                setIsAuthenticated(true);
                return true;
            }
            return false;
        } catch {
            return false;
        }
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        // Remove cookie
        document.cookie = `flo-admin-token=; path=/; max-age=0; SameSite=Strict`;
        setIsAuthenticated(false);
        router.push('/admin/login');
    }, [router]);

    return (
        <AdminAuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
            {children}
        </AdminAuthContext.Provider>
    );
}

export function useAdminAuth() {
    const context = useContext(AdminAuthContext);
    if (!context) {
        throw new Error('useAdminAuth must be used within AdminAuthProvider');
    }
    return context;
}
