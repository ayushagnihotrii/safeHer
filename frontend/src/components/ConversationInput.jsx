import { useState } from 'react';

const SAMPLE_LABELS = [
    { id: 'romance-scam', label: '💔 Romance Scam', icon: '💔' },
    { id: 'financial-fraud', label: '💰 Financial Fraud', icon: '💰' },
    { id: 'normal-chat', label: '💬 Normal Chat', icon: '💬' },
];

export default function ConversationInput({ onAnalyze, isLoading }) {
    const [conversation, setConversation] = useState('');
    const [showSamples, setShowSamples] = useState(false);
    const [samplesData, setSamplesData] = useState(null);
    const [loadingSamples, setLoadingSamples] = useState(false);

    const fetchSamples = async () => {
        if (samplesData) {
            setShowSamples(!showSamples);
            return;
        }
        setLoadingSamples(true);
        try {
            const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8000';
            const res = await fetch(`${apiBase}/api/sample-conversations`);
            const data = await res.json();
            setSamplesData(data.samples);
            setShowSamples(true);
        } catch (err) {
            console.error('Failed to fetch samples:', err);
        } finally {
            setLoadingSamples(false);
        }
    };

    const loadSample = (sample) => {
        setConversation(sample.conversation);
        setShowSamples(false);
    };

    const handleAnalyze = () => {
        if (conversation.trim()) {
            onAnalyze(conversation.trim());
        }
    };

    return (
        <div className="glass-card p-6 md:p-8">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-white">Paste Conversation</h2>
                    <p className="text-sm text-gray-400">Format: Person A: "message" / Person B: "message"</p>
                </div>
            </div>

            {/* Textarea */}
            <div className="relative">
                <textarea
                    value={conversation}
                    onChange={(e) => setConversation(e.target.value)}
                    placeholder={'Stranger: "Hey beautiful, I couldn\'t stop thinking about you"\nUser: "Who are you?"\nStranger: "I\'m a US army doctor overseas..."'}
                    className="w-full h-48 bg-dark-800 border border-white/10 rounded-xl p-4 text-gray-200 placeholder-gray-600 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300"
                    disabled={isLoading}
                />
                <div className="absolute bottom-3 right-3 text-xs text-gray-600">
                    {conversation.length} characters
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <button
                    onClick={handleAnalyze}
                    disabled={isLoading || !conversation.trim()}
                    className="flex-1 relative overflow-hidden px-6 py-3.5 rounded-xl font-semibold text-white
                     bg-gradient-to-r from-indigo-600 to-purple-600
                     hover:from-indigo-500 hover:to-purple-500
                     disabled:from-gray-700 disabled:to-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed
                     transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]
                     shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40"
                >
                    {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Analyzing...
                        </span>
                    ) : (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                            Analyze Conversation
                        </span>
                    )}
                </button>

                <button
                    onClick={fetchSamples}
                    disabled={isLoading || loadingSamples}
                    className="px-6 py-3.5 rounded-xl font-medium text-gray-300 border border-white/10
                     hover:bg-white/5 hover:border-white/20
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-300"
                >
                    {loadingSamples ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Loading...
                        </span>
                    ) : (
                        <span className="flex items-center justify-center gap-2">
                            📋 Load Sample Conversation
                        </span>
                    )}
                </button>
            </div>

            {/* Samples Dropdown */}
            {showSamples && samplesData && (
                <div className="mt-4 space-y-2 animate-fade-in-up">
                    {samplesData.map((sample, index) => (
                        <button
                            key={sample.id}
                            onClick={() => loadSample(sample)}
                            className="w-full text-left p-4 rounded-xl bg-dark-800 border border-white/5
                         hover:border-indigo-500/30 hover:bg-dark-700
                         transition-all duration-300 group"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-xl">{SAMPLE_LABELS[index]?.icon || '📝'}</span>
                                <div>
                                    <p className="font-medium text-white group-hover:text-indigo-300 transition-colors">
                                        {sample.title}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-0.5">{sample.description}</p>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
