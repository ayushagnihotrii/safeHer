import { useMemo } from 'react';

/**
 * Parse a conversation string into an array of message objects.
 * Supports formats like:
 *   Person A: "message"
 *   Person A: message
 */
function parseConversation(text) {
    const lines = text.split('\n').filter((l) => l.trim());
    return lines.map((line) => {
        const match = line.match(/^([^:]+):\s*"?(.+?)"?\s*$/);
        if (match) {
            return { sender: match[1].trim(), message: match[2].trim() };
        }
        return { sender: 'Unknown', message: line.trim() };
    });
}

/**
 * Check if a message contains any suspicious phrase.
 */
function getMessageSeverity(messageText, suspiciousLookup) {
    for (const [phrase, severity] of suspiciousLookup) {
        if (messageText.toLowerCase().includes(phrase.toLowerCase())) {
            return severity;
        }
    }
    return null;
}

export default function ChatDisplay({ conversation, suspiciousPhrases = [] }) {
    const messages = useMemo(() => parseConversation(conversation), [conversation]);

    // Build a lookup for suspicious phrases  
    const suspiciousLookup = useMemo(() => {
        return (suspiciousPhrases || []).map((sp) => [sp.phrase, sp.severity]);
    }, [suspiciousPhrases]);

    // Determine unique sender names — first sender gets "left" alignment
    const senders = useMemo(() => {
        const uniqueSenders = [];
        messages.forEach((m) => {
            if (!uniqueSenders.includes(m.sender)) uniqueSenders.push(m.sender);
        });
        return uniqueSenders;
    }, [messages]);

    const SEVERITY_BORDERS = {
        high: { border: 'border-red-500/60', bg: 'bg-red-500/10', glow: 'shadow-red-500/20' },
        medium: { border: 'border-yellow-500/60', bg: 'bg-yellow-500/10', glow: 'shadow-yellow-500/20' },
        low: { border: 'border-green-500/40', bg: 'bg-green-500/5', glow: '' },
    };

    return (
        <div className="glass-card p-6 md:p-8 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center gap-2 mb-5">
                <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
                <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Conversation</h3>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {messages.map((msg, index) => {
                    const isLeft = senders.indexOf(msg.sender) === 0;
                    const severity = getMessageSeverity(msg.message, suspiciousLookup);
                    const sevStyle = severity ? SEVERITY_BORDERS[severity] : null;

                    return (
                        <div
                            key={index}
                            className={`flex ${isLeft ? 'justify-start' : 'justify-end'} animate-slide-in`}
                            style={{ animationDelay: `${100 + index * 60}ms` }}
                        >
                            <div
                                className={`
                  max-w-[80%] px-4 py-3 rounded-2xl border transition-all duration-300
                  ${isLeft
                                        ? 'rounded-bl-md bg-dark-700 border-white/5'
                                        : 'rounded-br-md bg-indigo-600/20 border-indigo-500/20'
                                    }
                  ${sevStyle ? `${sevStyle.border} ${sevStyle.bg} shadow-lg ${sevStyle.glow}` : ''}
                `}
                            >
                                <p className={`text-[10px] font-semibold uppercase tracking-wider mb-1 ${isLeft ? 'text-purple-400' : 'text-indigo-400'
                                    }`}>
                                    {msg.sender}
                                </p>
                                <p className="text-sm text-gray-200 leading-relaxed">{msg.message}</p>
                                {severity && (
                                    <div className="mt-2 flex items-center gap-1">
                                        <svg className="w-3 h-3 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-[10px] uppercase tracking-wider font-semibold text-red-400/80">
                                            Suspicious
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
