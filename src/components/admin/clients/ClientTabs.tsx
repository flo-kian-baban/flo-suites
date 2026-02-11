'use client';

import { useState } from 'react';
import { Lock, Video, Globe, Megaphone, FolderKanban, User, BookOpen } from 'lucide-react';
import MediaTab from './operations/MediaTab';
import LandingPagesTab from './operations/LandingPagesTab';
import OperationsTab from './operations/OperationsTab';
import CampaignsTab from './campaigns/CampaignsTab';
import ResourcesTab from './resources/ResourcesTab';
import ClientForm from './ClientForm';
import PortalAccessCard from './PortalAccessCard';
import { ClientFull } from '@/lib/clients';

const TABS = [
    { key: 'profile', label: 'Profile', icon: User },
    { key: 'resources', label: 'Resources', icon: BookOpen },
    { key: 'media', label: 'Media', icon: Video },
    { key: 'campaigns', label: 'Marketing Campaigns', icon: Megaphone },
    { key: 'landing-pages', label: 'Landing Pages', icon: Globe },
    { key: 'ai-automation', label: 'Operations', icon: FolderKanban },
] as const;

type TabKey = (typeof TABS)[number]['key'];

interface ClientTabsProps {
    client: ClientFull;
}

function PlaceholderTab({ label }: { label: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-5">
                <Lock className="w-7 h-7 text-white/15" />
            </div>
            <h3 className="text-lg font-semibold text-white/50 mb-2">{label}</h3>
            <p className="text-sm text-white/25 max-w-sm">
                Module not enabled yet. This section will be available in a future update.
            </p>
        </div>
    );
}

export default function ClientTabs({ client }: ClientTabsProps) {
    const [activeTab, setActiveTab] = useState<TabKey>('profile');

    return (
        <div className="mt-8">
            {/* Tab Bar */}
            <div className="flex gap-1 border-b border-white/[0.06] mb-8 overflow-x-auto scrollbar-hide">
                {TABS.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.key;
                    return (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`
                flex items-center gap-2 px-5 py-3 text-sm font-medium transition-all duration-200 border-b-2 -mb-px whitespace-nowrap
                ${isActive
                                    ? 'text-flo-orange border-flo-orange'
                                    : 'text-white/40 border-transparent hover:text-white/70 hover:border-white/10'
                                }
              `}
                        >
                            <Icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Tab Content */}
            <div>
                {activeTab === 'profile' && (
                    <div className="space-y-6">
                        <ClientForm mode="edit" initialData={client} />
                        <PortalAccessCard clientId={client.id} />
                    </div>
                )}
                {activeTab === 'resources' && <ResourcesTab clientId={client.id} />}
                {activeTab === 'media' && <MediaTab clientId={client.id} clientSlug={client.slug} />}
                {activeTab === 'campaigns' && <CampaignsTab clientId={client.id} />}
                {activeTab === 'landing-pages' && <LandingPagesTab clientId={client.id} />}
                {activeTab === 'ai-automation' && <OperationsTab clientId={client.id} />}
            </div>
        </div>
    );
}
