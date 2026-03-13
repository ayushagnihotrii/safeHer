import { useEffect, useState } from 'react';

export default function RiskScoreCircle({ score, riskLevel }) {
    const [animatedScore, setAnimatedScore] = useState(0);

    const radius = 54;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (animatedScore / 100) * circumference;

    const colorMap = {
        LOW: { stroke: '#22c55e', glow: 'rgba(34, 197, 94, 0.3)', bg: 'rgba(34, 197, 94, 0.08)' },
        MODERATE: { stroke: '#f59e0b', glow: 'rgba(245, 158, 11, 0.3)', bg: 'rgba(245, 158, 11, 0.08)' },
        HIGH: { stroke: '#ef4444', glow: 'rgba(239, 68, 68, 0.3)', bg: 'rgba(239, 68, 68, 0.08)' },
    };

    const colors = colorMap[riskLevel] || colorMap.LOW;

    useEffect(() => {
        let start = 0;
        const duration = 1500;
        const startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(eased * score);
            setAnimatedScore(current);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [score]);

    return (
        <div className="glass-card p-6 md:p-8 flex flex-col items-center animate-fade-in-up">
            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-6">Risk Assessment</h3>

            {/* Circle */}
            <div
                className="relative w-44 h-44 mb-6"
                style={{ '--glow-color': colors.glow }}
            >
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                    {/* Background track */}
                    <circle
                        cx="60" cy="60" r={radius}
                        stroke="rgba(255,255,255,0.05)"
                        strokeWidth="8"
                        fill="none"
                    />
                    {/* Score arc */}
                    <circle
                        cx="60" cy="60" r={radius}
                        stroke={colors.stroke}
                        strokeWidth="8"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        style={{
                            transition: 'stroke-dashoffset 0.1s ease-out',
                            filter: `drop-shadow(0 0 8px ${colors.glow})`,
                        }}
                    />
                </svg>

                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span
                        className="text-5xl font-bold tabular-nums"
                        style={{ color: colors.stroke }}
                    >
                        {animatedScore}
                    </span>
                    <span className="text-xs text-gray-500 mt-1">/ 100</span>
                </div>
            </div>

            {/* Risk Level Badge */}
            <div
                className="px-5 py-2 rounded-full text-sm font-bold uppercase tracking-widest"
                style={{
                    backgroundColor: colors.bg,
                    color: colors.stroke,
                    border: `1px solid ${colors.stroke}30`,
                }}
            >
                {riskLevel} RISK
            </div>
        </div>
    );
}
