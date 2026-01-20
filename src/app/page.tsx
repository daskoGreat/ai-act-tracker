import RiskAssessment from "@/components/RiskAssessment";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-slate-900 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(14,165,233,0.15),rgba(255,255,255,0))] text-white overflow-hidden p-6">

            <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10">
                <div className="flex items-center gap-3">
                    <div className="text-lg font-medium tracking-tight text-white/90">EU AI Act Tracker</div>
                </div>
                <div className="text-sm text-[#FFD700] font-medium tracking-wider">v1.0</div>
            </div>

            <div className="z-20 w-full pt-20">
                <RiskAssessment />
            </div>

            <footer className="absolute bottom-6 flex flex-col items-center gap-2 text-center text-white/30 text-xs font-light">
                <p>Detta är ett snabbt riskfilter, inte juridisk rådgivning.</p>
                <div className="flex items-center gap-1.5 mt-1">
                    <span>Powered by</span>
                    <span className="font-semibold text-white/50 tracking-wide uppercase">Great IT</span>
                </div>
            </footer>
        </main>
    );
}
