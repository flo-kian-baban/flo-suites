import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function EmptyState() {
    return (
        <div className="flex items-center justify-center p-8 bg-white/5 border border-white/10 rounded-2xl border-dashed">
            <div className="text-center">
                <div className="flex justify-center mb-3">
                    <div className="p-3 bg-emerald-500/10 rounded-full">
                        <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    </div>
                </div>
                <h3 className="text-sm font-medium text-white">All caught up</h3>
                <p className="text-xs text-white/50 mt-1">No pending actions requiring your attention.</p>
            </div>
        </div>
    );
}
