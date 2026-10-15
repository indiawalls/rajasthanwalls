'use client';

import axios from 'axios';
import { useState, useRef, useEffect } from 'react';
import {
    MessageScrollerProvider,
    MessageScroller,
    MessageScrollerViewport,
    MessageScrollerContent,
} from '@/components/ui/message-scroller';


// Icons
const BotIcon = () => (
    <div className="w-9 h-9 flex items-center justify-center shrink-0 text-xl">
        🤖
    </div>
);

const UserIcon = () => (<div className="w-9 h-9 flex items-center justify-center shrink-0 text-xl">
    🧑
</div>);
export default function MessageAttachmentDemo({ messages, setMessages }) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [input, setInput] = useState('');
    const sessionIdRef = useRef(`web_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const now = new Date();
        const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const userMsg = {
            id: Date.now().toString(),
            sender: "user",
            text: input,
            timestamp: now,
            time: formattedTime,
        };

        setMessages((prev) => [...prev, userMsg]);
        setIsLoading(true);
        setError(null);

        try {
            const { data } = await axios.post('/api/chat', {
                query: input.trim(),
                session_id: sessionIdRef.current,
            });
            const botMsg = {
                id: (Date.now() + 1).toString(),
                sender: "bot",
                text: data.answer,
                timestamp: new Date(),
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };

            setMessages((prev) => [...prev, botMsg]);
        } catch (err) {
            setError(err.message || "Could not connect to AI server.");
            const fallbackMsg = {
                id: (Date.now() + 1).toString(),
                sender: "bot",
                text: "Maaf kijiye, server se connect karne mein samasya aayi. Kripya thodi der baad prayas karein.",
                timestamp: new Date(),
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
            setMessages((prev) => [...prev, fallbackMsg]);
        } finally {
            setIsLoading(false);
        }
        setInput('');
    }


    const messageEndRef = useRef(null)
    const scrollToBottom = () => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
    useEffect(() => {
        scrollToBottom()
    }, [messages])



    return (
        <div className="flex w-full h-full flex-col bg-white rounded-xl overflow-hidden">
            {/* 1. Scrollable Message Feed */}
            <div className="flex-1 overflow-hidden">
                <MessageScrollerProvider>
                    <MessageScroller className="h-full">
                        <MessageScrollerViewport className="h-full p-4">
                            <MessageScrollerContent className="space-y-4">
                                {messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                                            }`}
                                    >
                                        {/* Avatar Icon */}
                                        {msg.sender === 'bot' ? <BotIcon /> : <UserIcon />}

                                        {/* Chat Bubble Container */}
                                        <div
                                            className={`flex flex-col max-w-[78%] ${msg.sender === 'user' ? 'items-end' : 'items-start'
                                                }`}
                                        >
                                            <div
                                                className={`p-3 rounded-2xl text-left whitespace-pre-wrap wrap-break-word text-xs sm:text-sm leading-relaxed ${msg.sender === 'user'
                                                    ? 'bg-yellow-600 text-white rounded-tr-none'
                                                    : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200'
                                                    }`}
                                            >
                                                {msg.text}
                                            </div>
                                            <span className="text-[10px] text-slate-400 mt-1 px-1">
                                                {msg.time}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                <div ref={messageEndRef}></div>
                            </MessageScrollerContent>
                        </MessageScrollerViewport>
                    </MessageScroller>
                </MessageScrollerProvider>
            </div>

            {/* 2. Chat Input Bar */}
            <form
                onSubmit={sendMessage}
                className="p-3 border-t border-slate-200 bg-white flex items-center gap-2"
            >
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-slate-100 border border-slate-200 text-slate-800 text-xs sm:text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-yellow-500 transition"
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="bg-yellow-600 hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2.5 rounded-xl transition flex items-center justify-center shrink-0"
                    aria-label="Send Message"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                        />
                    </svg>
                </button>
            </form>
            {isLoading && (
                <div className="px-3 pb-2 text-[10px] text-slate-500 flex items-center gap-1.5" aria-live="polite">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"></span>
                    <span>Rajasthanwall Bot is typing...</span>
                </div>
            )}
            {error && !isLoading && (
                <div className="px-3 pb-2 text-[10px] text-red-500" role="status">
                    Unable to connect right now. Please try again.
                </div>
            )}
        </div>
    );
}