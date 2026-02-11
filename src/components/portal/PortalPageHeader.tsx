'use client';

import { motion } from 'framer-motion';

interface PortalPageHeaderProps {
    title: string;
    description?: string;
}

export default function PortalPageHeader({ title, description }: PortalPageHeaderProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mb-8"
        >
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/60 mb-2 tracking-tight">
                {title}
            </h2>
            {description && (
                <p className="text-lg text-white/50 font-medium max-w-2xl leading-relaxed">
                    {description}
                </p>
            )}
        </motion.div>
    );
}
