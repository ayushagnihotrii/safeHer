const SEVERITY_STYLES = {
    high: { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.2)', label: 'HIGH' },
    medium: { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.2)', label: 'MED' },
    low: { color: '#22c55e', bg: 'rgba(34, 197, 94, 0.1)', border: 'rgba(34, 197, 94, 0.2)', label: 'LOW' },
};

export default function SuspiciousPhrasesCard({ phrases }) {
    if (!phrases || phrases.length === 0) return null;

    return (
        <div className="glass-card p-6 md:p-8 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <div className="flex items-center gap-2 mb-5">
                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Suspicious Phrases</h3>
                <span className="ml-auto text-xs text-gray-600 bg-dark-800 px-2 py-1 rounded-full">
                    {phrases.length} found
                </span>
            </div>

            <div className="space-y-3">
                {phrases.map((item, index) => {
                    const severity = SEVERITY_STYLES[item.severity] || SEVERITY_STYLES.medium;
                    return (
                        <div
                            key={index}
                            className="p-4 rounded-xl bg-dark-800 border border-white/5 hover:border-white/10 transition-all duration-300 animate-slide-in"
                            style={{ animationDelay: `${300 + index * 100}ms` }}
                        >
                            <div className="flex items-start gap-3">
                                {/* Severity dot */}
                                <div className="mt-1.5 flex-shrink-0">
                                    <div
                                        className="w-2 h-2 rounded-full"
                                        style={{ backgroundColor: severity.color, boxShadow: `0 0 8px ${severity.color}` }}
                                    />
                                </div>

                                <div className="flex-1 min-w-0">
                                    {/* Phrase */}
                                    <p className="text-sm text-white font-medium leading-relaxed">
                                        "{item.phrase}"
                                    </p>
                                    {/* Reason */}
                                    <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">{item.reason}</p>
                                </div>

                                {/* Severity badge */}
                                <span
                                    className="flex-shrink-0 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider"
                                    style={{
                                        backgroundColor: severity.bg,
                                        color: severity.color,
                                        border: `1px solid ${severity.border}`,
                                    }}
                                >
                                    {severity.label}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
