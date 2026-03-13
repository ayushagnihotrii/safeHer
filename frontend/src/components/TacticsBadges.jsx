const TACTIC_STYLES = {
    'Love Bombing': { emoji: '💕', color: '#f472b6', bg: 'rgba(244, 114, 182, 0.1)' },
    'Urgency/Pressure': { emoji: '⏰', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
    'Isolation Attempt': { emoji: '🔒', color: '#a78bfa', bg: 'rgba(167, 139, 250, 0.1)' },
    'Financial Request': { emoji: '💸', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' },
    'Gift Card Request': { emoji: '🎁', color: '#fb923c', bg: 'rgba(251, 146, 60, 0.1)' },
    'Fake Emergency': { emoji: '🚨', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' },
    'Guilt Tripping': { emoji: '😢', color: '#c084fc', bg: 'rgba(192, 132, 252, 0.1)' },
    'Identity Concealment': { emoji: '🎭', color: '#64748b', bg: 'rgba(100, 116, 139, 0.1)' },
    'Personal Info Harvesting': { emoji: '🕵️', color: '#f97316', bg: 'rgba(249, 115, 22, 0.1)' },
};

const DEFAULT_STYLE = { emoji: '⚠️', color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.1)' };

export default function TacticsBadges({ tactics }) {
    if (!tactics || tactics.length === 0) return null;

    return (
        <div className="glass-card p-6 md:p-8 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center gap-2 mb-5">
                <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Detected Tactics</h3>
            </div>

            <div className="flex flex-wrap gap-2">
                {tactics.map((tactic, index) => {
                    const style = TACTIC_STYLES[tactic] || DEFAULT_STYLE;
                    return (
                        <span
                            key={index}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium
                         transition-all duration-300 hover:scale-105 cursor-default animate-slide-in"
                            style={{
                                backgroundColor: style.bg,
                                color: style.color,
                                border: `1px solid ${style.color}25`,
                                animationDelay: `${index * 80}ms`,
                            }}
                        >
                            <span>{style.emoji}</span>
                            {tactic}
                        </span>
                    );
                })}
            </div>
        </div>
    );
}
