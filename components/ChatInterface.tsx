
import React, { useState, useRef, useEffect } from 'react';
import { Button } from './Button';
import { ChatMessage } from '../types';

interface ChatInterfaceProps {
    messages: ChatMessage[];
    onSendMessage: (message: string) => void;
    isLoading: boolean;
    onClear: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSendMessage, isLoading, onClear }) => {
    const [input, setInput] = useState('');
    const endRef = useRef<HTMLDivElement>(null);

    const handleSend = () => {
        if (!input.trim()) return;
        onSendMessage(input);
        setInput('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    return (
        <div className="flex flex-col h-full overflow-hidden bg-orange-50">
             {/* Header */}
             <div className="bg-white shadow-sm z-10 flex-none p-2 border-b border-orange-100 flex justify-between items-center">
                  <span className="font-bold text-orange-600 text-sm ml-2">AI相談チャット</span>
                  <Button variant="secondary" onClick={onClear} className="!text-red-500 !border-red-100 hover:!bg-red-50">
                     <span className="mr-1">🗑️</span> リセット
                  </Button>
             </div>

             {/* Messages */}
             <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar pb-20">
                {messages.length === 0 && (
                    <div className="text-center text-gray-400 mt-10 text-sm bg-orange-100/50 p-6 rounded-xl mx-4">
                        <p className="font-bold text-orange-400 mb-2">作詞・作曲・プロンプト相談</p>
                        <p>「この歌詞の続きを考えて」</p>
                        <p>「Cメロのアイデアを頂戴」</p>
                        <p>「愛、恋、夢で韻を踏んで」</p>
                        <p className="mt-2 text-xs opacity-70">など、Geminiがアシストします。</p>
                    </div>
                )}
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap shadow-sm ${
                            msg.role === 'user' 
                            ? 'bg-orange-500 text-white rounded-br-none' 
                            : 'bg-white text-gray-800 border border-orange-100 rounded-bl-none'
                        }`}>
                            {msg.image && (
                                <img src={msg.image} alt="attached" className="max-w-full rounded-lg mb-2" />
                            )}
                            {msg.text}
                        </div>
                    </div>
                ))}
                {isLoading && (
                     <div className="flex justify-start">
                        <div className="bg-white text-gray-400 border border-orange-100 px-4 py-2 rounded-2xl rounded-bl-none text-xs animate-pulse flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                        </div>
                    </div>
                )}
                <div ref={endRef} />
             </div>

             {/* Input */}
             <div className="p-3 bg-white border-t border-orange-100 flex gap-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="相談内容を入力..."
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-orange-200 resize-none h-12 max-h-32 shadow-inner"
                />
                <Button onClick={handleSend} disabled={isLoading || !input.trim()} className="h-12 w-12 !p-0 rounded-xl flex-none">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                </Button>
             </div>
        </div>
    );
}
