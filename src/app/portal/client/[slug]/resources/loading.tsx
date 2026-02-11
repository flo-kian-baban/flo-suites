'use client';

export default function ResourcesLoading() {
    return (
        <div className="relative min-h-screen pb-20 animate-pulse">
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-flo-orange/5 rounded-full blur-[120px]" />
                <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-purple-500/5 rounded-full blur-[100px]" />
            </div>
            <div className="mb-8 space-y-3">
                <div className="h-8 w-36 bg-white/[0.06] rounded-lg" />
                <div className="h-4 w-72 bg-white/[0.04] rounded-md" />
            </div>
            <div className="h-96 bg-white/[0.03] border border-white/[0.06] rounded-xl" />
        </div>
    );
}
