import React, { useEffect, useRef } from 'react';
import { Message } from '../../types';
import { DynamicRenderer } from '../DynamicUI/Renderer';
import { Bot, User, Cpu } from 'lucide-react';

interface MessageListProps {
  messages: Message[];
}

export const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6">
      {messages.length === 0 && (
        <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-60">
           <Cpu size={64} className="mb-4 text-indigo-200" />
           <p>Ready to generate UI.</p>
        </div>
      )}
      
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
        >
          {/* Avatar */}
          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
            msg.role === 'user' ? 'bg-gray-800 text-white' : 'bg-indigo-600 text-white'
          }`}>
            {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
          </div>

          {/* Content */}
          <div className={`max-w-[90%] md:max-w-[75%] ${msg.role === 'user' ? 'flex justify-end' : ''}`}>
             <div className="flex flex-col gap-2">
                {/* Text Content (if any) - mostly for user messages or errors */}
                {msg.content && (
                  <div className={`px-4 py-3 rounded-2xl shadow-sm whitespace-pre-wrap ${
                    msg.role === 'user' 
                      ? 'bg-gray-800 text-white rounded-tr-sm' 
                      : 'bg-white text-gray-800 rounded-tl-sm border border-gray-100'
                  }`}>
                    {msg.content}
                  </div>
                )}

                {/* Dynamic UI Content */}
                {msg.uiData && (
                  <div className="relative group">
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg overflow-hidden transition-all duration-300">
                      {msg.isStreaming && (
                         <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-indigo-50 px-2 py-1 rounded-full border border-indigo-100 z-10">
                            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></span>
                            <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">Streaming</span>
                         </div>
                      )}
                      <DynamicRenderer node={msg.uiData} />
                    </div>
                    {/* Optional: Show raw JSON on hover for debug/demo purposes */}
                    <div className="hidden group-hover:block absolute top-full left-0 w-full mt-2 bg-slate-900 text-slate-300 text-xs p-3 rounded-lg z-20 overflow-auto max-h-40 font-mono shadow-xl opacity-0 group-hover:opacity-100 transition-opacity">
                      {JSON.stringify(msg.uiData, null, 2)}
                    </div>
                  </div>
                )}
             </div>
          </div>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
};