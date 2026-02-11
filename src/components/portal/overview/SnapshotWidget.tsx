'use client';

import { LucideIcon } from 'lucide-react';
import DashboardCard from '../DashboardCard';

interface SnapshotWidgetProps {
    label: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: string;
    color?: string; // e.g. "text-flo-orange"
    delay?: number;
}

export default function SnapshotWidget({ label, value, icon, trend, color = "text-white", delay = 0 }: SnapshotWidgetProps) {
    return (
        <DashboardCard delay={delay} className="flex items-start justify-between">
            <div>
                <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">{label}</p>
                <div className="flex items-baseline gap-2">
                    <h3 className="text-3xl font-bold text-white tracking-tight">{value}</h3>
                    {trend && <span className="text-xs font-medium text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded border border-green-500/20">{trend}</span>}
                </div>
            </div>
            <div className={`p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] ${color} shadow-[0_0_15px_-3px_rgba(255,255,255,0.1)]`}>
                {icon}
            </div>
        </DashboardCard>
    );
}

