'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface DashboardCardProps {
    children: ReactNode;
    className?: string;
    delay?: number;
}

export default function DashboardCard({ children, className = '', delay = 0 }: DashboardCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className={`glass-effect rounded-2xl p-6 border border-white/[0.08] hover:border-flo-orange/30 hover:shadow-lg hover:shadow-flo-orange/5 transition-colors relative overflow-hidden group ${className}`}
        >
            {/* Subtle gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col">
                {children}
            </div>
        </motion.div>
    );
}
