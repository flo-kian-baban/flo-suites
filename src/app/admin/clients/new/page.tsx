'use client';

import ClientForm from '@/components/admin/clients/ClientForm';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function NewClientPage() {
    const router = useRouter();

    return (
        <div className="max-w-3xl mx-auto pb-20">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => router.push('/admin/clients')}
                    className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-white/40 hover:text-white hover:border-white/15 transition-all"
                >
                    <ArrowLeft className="w-4 h-4" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-white">Create Client</h1>
                    <p className="text-sm text-white/40 mt-0.5">Set up a new client profile and operations workspace.</p>
                </div>
            </div>

            <ClientForm mode="create" />
        </div>
    );
}
