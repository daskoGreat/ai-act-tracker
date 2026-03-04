import RiskAssessment from "@/components/RiskAssessment";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-[#050810] text-white overflow-hidden p-6 relative">
            {/* Smooth background gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(14,165,233,0.1),transparent_70%)] pointer-events-none" />

            {/* Subtle vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(5,8,16,0.4)_100%)] pointer-events-none" />

            <div className="absolute top-0 left-0 w-full p-8 flex justify-between items-center z-10">
                <div className="flex items-center gap-3">
                    <div className="text-sm font-bold uppercase tracking-[0.3em] text-white/50">EU AI Act Tracker</div>
                </div>
                <div className="text-[10px] text-[#BAAA5D] font-bold tracking-[0.2em] uppercase">v1.0</div>
            </div>

            <div className="z-20 w-full pt-20">
                <RiskAssessment />
            </div>
        </main>
    );
}
