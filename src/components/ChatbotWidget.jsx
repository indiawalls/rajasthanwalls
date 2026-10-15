'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic'
const MessageScroller = dynamic(() => import('@/components/MessageScroller'))

export default function ChatbotWidget() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);

    if (pathname?.startsWith('/admin') || pathname?.startsWith('/mfa')) {
        return null;
    }

    return (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-150 flex flex-col items-end cursor-pointer">
            {/* 1. Message Scroller Popup Container */}
            {isOpen && (
                <div className="mb-4 w-[92vw] sm:w-150 h-130 sm:h-150 max-h-[80vh] bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col transition-all duration-200 ease-in-out animate-in fade-in slide-in-from-bottom-4">
                    {/* Header */}
                    <div className="bg-slate-900 text-white px-4 py-3 flex justify-between items-center border-b border-slate-800">
                        <div className="flex items-center gap-2.5">
                            <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg border border-emerald-500/30 shrink-0">
                                🤖
                            </div>
                            <div>
                                <h3 className="font-bold text-sm text-white leading-none">Rajasthanwall Assistant</h3>
                                <span className="text-[10px] text-yellow-400 font-medium">Online | Instant Help</span>
                            </div>
                        </div>
                        {/* Close Button */}
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg p-1 transition"
                            aria-label="Close Chat"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Body: Your Shadcn Message Scroller Component */}
                    <div className="flex-1 overflow-hidden p-3 bg-slate-50">
                        <MessageScroller messages={messages} setMessages={setMessages} />
                    </div>
                </div>
            )}

            {/* 2. Floating Action Button (FAB) */}
            <button
                onClick={() => setIsOpen((prev) => !prev)}
                className="relative group bg-yellow-600 hover:bg-yellow-700 text-white p-3 sm:p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-yellow-500/30 flex flex-col items-center justify-center cursor-pointer"
                aria-label="Toggle Chatbot"
            >
                {/* Unread Indicator Pulse */}
                {!isOpen && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-white"></span>
                    </span>
                )}

                {isOpen ? (
                    // Close Icon
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <>
                        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                            />
                        </svg>
                        <span className="hidden sm:inline-block mt-0.5 text-[11px] font-bold leading-none">Ask Me</span>
                    </>
                )}
            </button>
        </div>
    );
}