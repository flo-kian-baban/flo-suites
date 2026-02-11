'use client';

import { usePathname } from 'next/navigation';
import { AdminAuthProvider, useAdminAuth } from '@/components/admin/AdminAuthProvider';
import Sidebar from '@/components/admin/Sidebar';
import Topbar from '@/components/admin/Topbar';
import { Loader2 } from 'lucide-react';

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading } = useAdminAuth();
    const pathname = usePathname();
    const isLoginPage = pathname === '/admin/login';

    // Show loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-dark-bg flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-flo-orange animate-spin" />
            </div>
        );
    }

    // Login page doesn't need the dashboard layout
    if (isLoginPage) {
        return <>{children}</>;
    }

    // Redirect will happen in AuthProvider if not authenticated
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-dark-bg flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-flo-orange animate-spin" />
            </div>
        );
    }

    // Dashboard layout
    return (
        <div className="flex h-screen w-full bg-[#0f0f0f] overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                <Topbar />
                <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AdminAuthProvider>
            <AdminLayoutContent>{children}</AdminLayoutContent>
        </AdminAuthProvider>
    );
}
