export default function SafetyAdviceCard({ advice }) {
    if (!advice || advice.length === 0) return null;

    return (
        <div className="glass-card p-6 md:p-8 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
            <div className="flex items-center gap-2 mb-5">
                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Safety Advice</h3>
            </div>

            <div className="space-y-3">
                {advice.map((tip, index) => (
                    <div
                        key={index}
                        className="flex items-start gap-3 p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/10
                       hover:border-emerald-500/20 transition-all duration-300 animate-slide-in"
                        style={{ animationDelay: `${400 + index * 80}ms` }}
                    >
                        <div className="mt-0.5 flex-shrink-0">
                            <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <p className="text-sm text-gray-300 leading-relaxed">{tip}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
