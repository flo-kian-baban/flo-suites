import React from 'react';
import { User, Users, ShieldCheck } from 'lucide-react';

const TeamCard = ({ team }) => {
    if (!team) return null;

    return (
        <div className="bg-[#111] border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center gap-6 hover:border-flo-orange/30 transition-colors group">
            <div className="relative">
                <div className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center border border-white/10 overflow-hidden relative">
                    {team.leadAvatar ? (
                        <img
                            src={team.leadAvatar}
                            alt={team.lead}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <User className="w-8 h-8 text-neutral-500" />
                    )}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-[#111] p-1 rounded-full border border-white/10">
                    <ShieldCheck className="w-4 h-4 text-flo-orange" />
                </div>
            </div>

            <div className="flex-1 space-y-1">
                <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
                    <h3 className="text-lg font-bold text-white leading-none">
                        {team.lead || "Team Lead"}
                    </h3>
                    <span className="hidden md:inline text-neutral-600">•</span>
                    <span className="text-sm text-flo-orange font-medium flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5" />
                        {team.size || "Specialized Team"}
                    </span>
                </div>
                <p className="text-sm text-neutral-400 max-w-md">
                    {team.responsibility}
                </p>
            </div>
        </div>
    );
};

export default TeamCard;
