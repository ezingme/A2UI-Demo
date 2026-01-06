import React, { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, isLoading }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSend(input);
      setInput('');
    }
  };

  const suggestions = [
    "Dashboard for sales",
    "User profile card",
    "System alert success",
    "Marketing metrics"
  ];

  return (
    <div className="bg-white border-t border-gray-200 p-4">
      <div className="max-w-4xl mx-auto flex flex-col gap-3">
        {!isLoading && !input && (
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
             {suggestions.map(s => (
               <button 
                key={s}
                onClick={() => setInput(s)}
                className="whitespace-nowrap px-3 py-1.5 bg-indigo-50 text-indigo-700 text-xs rounded-full hover:bg-indigo-100 transition-colors border border-indigo-100"
               >
                 {s}
               </button>
             ))}
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex gap-2 items-center">
          <div className="relative flex-1">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe the UI you want..."
              className="w-full pl-10 pr-4 py-3 bg-gray-100 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-xl transition-all outline-none"
              disabled={isLoading}
            />
            <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          </div>
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={`p-3 rounded-xl transition-all ${
              input.trim() && !isLoading
                ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};
