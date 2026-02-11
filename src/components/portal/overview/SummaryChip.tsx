import React from 'react';

interface SummaryChipProps {
    label: string;
    value: string | number | React.ReactNode;
    icon?: React.ReactNode;
}

export default function SummaryChip({ label, value, icon }: SummaryChipProps) {
    return (
        <div className="flex items-center gap-5 px-6 py-5 bg-[#111111] border border-white/5 rounded-2xl min-w-[200px] h-[92px] transition-all hover:border-white/10 group">
            {icon && (
                <div className="p-3 rounded-xl bg-flo-orange/10 text-flo-orange group-hover:bg-flo-orange/20 transition-colors">
                    {icon}
                </div>
            )}
            <div className="flex flex-col justify-center">
                <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-1">{label}</span>
                <div className="text-2xl font-medium text-white leading-none tracking-tight">{value}</div>
            </div>
        </div>
    );
}
