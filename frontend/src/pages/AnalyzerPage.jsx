import { useState } from 'react';
import ConversationInput from '../components/ConversationInput';
import RiskScoreCircle from '../components/RiskScoreCircle';
import TacticsBadges from '../components/TacticsBadges';
import SuspiciousPhrasesCard from '../components/SuspiciousPhrasesCard';
import SafetyAdviceCard from '../components/SafetyAdviceCard';
import ChatDisplay from '../components/ChatDisplay';

const API_BASE = 'http://localhost:8000';

export default function AnalyzerPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [conversationText, setConversationText] = useState('');

    const handleAnalyze = async (conversation) => {
        setIsLoading(true);
        setError(null);
        setResult(null);
        setConversationText(conversation);

        try {
            const res = await fetch(`${API_BASE}/api/analyze`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ conversation }),
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.detail || `Server error (${res.status})`);
            }

            const data = await res.json();
            if (data.success && data.analysis) {
                setResult(data.analysis);
            } else {
                throw new Error('Invalid response from server.');
            }
        } catch (err) {
            setError(err.message || 'Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-dark-900">
            {/* Header */}
            <header className="border-b border-white/5">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold">
                                <span className="gradient-text">ConvoGuard</span>
                            </h1>
                            <p className="text-sm text-gray-500 mt-0.5">AI-Powered Suspicious Conversation Analyzer</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
                {/* Input Section */}
                <div className="mb-8">
                    <ConversationInput onAnalyze={handleAnalyze} isLoading={isLoading} />
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="flex flex-col items-center justify-center py-20 animate-fade-in-up">
                        <div className="relative w-20 h-20 mb-6">
                            <div className="absolute inset-0 rounded-full border-4 border-dark-600" />
                            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-500 animate-spin" />
                        </div>
                        <p className="text-gray-400 text-lg font-medium">Analyzing conversation...</p>
                        <p className="text-gray-600 text-sm mt-2">Claude AI is scanning for suspicious patterns</p>
                    </div>
                )}

                {/* Error State */}
                {error && !isLoading && (
                    <div className="glass-card p-6 border-red-500/20 animate-fade-in-up">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center flex-shrink-0">
                                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-red-400 font-medium">Analysis Failed</p>
                                <p className="text-sm text-gray-400 mt-0.5">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Results */}
                {result && !isLoading && (
                    <div className="space-y-6">
                        {/* Top Row: Score + Chat */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Score Circle */}
                            <div className="lg:col-span-1">
                                <RiskScoreCircle
                                    score={result.risk_score}
                                    riskLevel={result.overall_risk_level}
                                />
                            </div>

                            {/* Chat Display */}
                            <div className="lg:col-span-2">
                                <ChatDisplay
                                    conversation={conversationText}
                                    suspiciousPhrases={result.suspicious_phrases}
                                />
                            </div>
                        </div>

                        {/* Summary */}
                        {result.summary && (
                            <div className="glass-card p-6 md:p-8 animate-fade-in-up" style={{ animationDelay: '150ms' }}>
                                <div className="flex items-center gap-2 mb-4">
                                    <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                    <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">AI Summary</h3>
                                </div>
                                <p className="text-gray-300 leading-relaxed text-sm">{result.summary}</p>
                            </div>
                        )}

                        {/* Tactics + Phrases + Advice */}
                        <TacticsBadges tactics={result.detected_tactics} />
                        <SuspiciousPhrasesCard phrases={result.suspicious_phrases} />
                        <SafetyAdviceCard advice={result.safety_advice} />
                    </div>
                )}
            </main>

            {/* Footer Disclaimer */}
            <footer className="border-t border-white/5 mt-16">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-dark-800 border border-white/5">
                        <svg className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-xs text-gray-500 leading-relaxed">
                            <span className="text-gray-400 font-medium">Disclaimer:</span> This tool is for educational purposes only.
                            AI analysis may not be 100% accurate. Always trust your instincts and report suspicious activity to relevant authorities.
                            If you believe you are a victim of a scam, contact local law enforcement immediately.
                        </p>
                    </div>
                    <p className="text-center text-xs text-gray-700 mt-4">
                        Built with Claude AI  •  ConvoGuard © {new Date().getFullYear()}
                    </p>
                </div>
            </footer>
        </div>
    );
}
