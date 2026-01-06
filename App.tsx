import React, { useState, useCallback } from 'react';
import { generateUIStream } from './services/geminiService';
import { ChatState, Message, UINode } from './types';
import { ChatInput } from './components/Chat/ChatInput';
import { MessageList } from './components/Chat/MessageList';
import { parsePartialJson } from './utils/partialJsonParser';

const App: React.FC = () => {
  const [state, setState] = useState<ChatState>({
    messages: [],
    isLoading: false,
  });

  const handleSend = useCallback(async (text: string) => {
    // Add user message
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text };
    
    // Placeholder for bot message
    const botMsgId = (Date.now() + 1).toString();
    const botMsg: Message = { 
      id: botMsgId, 
      role: 'model', 
      content: '', 
      isStreaming: true 
    };

    setState(prev => ({
      messages: [...prev.messages, userMsg, botMsg],
      isLoading: true
    }));

    try {
      // Start streaming from Gemini
      const stream = await generateUIStream(text);
      
      let rawAccumulated = '';
      let lastValidUI: UINode | null = null;

      for await (const chunk of stream) {
        // Fix: accessing text as property, not function
        const chunkText = chunk.text;
        if (chunkText) {
          rawAccumulated += chunkText;
        }

        // Try to parse partial JSON
        const partialUI = parsePartialJson(rawAccumulated);

        // Only update state if we have a valid parse. 
        // If parsing fails (returns null), we skip the update to avoid flashing empty UI.
        if (partialUI) {
          lastValidUI = partialUI;
          
          setState(prev => ({
            ...prev,
            messages: prev.messages.map(msg => 
              msg.id === botMsgId 
                ? { ...msg, uiData: partialUI } 
                : msg
            )
          }));
        }
      }

      // Final pass to ensure completion
      const finalUI = parsePartialJson(rawAccumulated);
      const finalToRender = finalUI || lastValidUI;

      setState(prev => ({
        isLoading: false,
        messages: prev.messages.map(msg => 
          msg.id === botMsgId 
            ? { ...msg, uiData: finalToRender, isStreaming: false } 
            : msg
        )
      }));

    } catch (error) {
      console.error("Stream failed", error);
      setState(prev => ({
        isLoading: false,
        messages: prev.messages.map(msg => 
          msg.id === botMsgId 
            ? { ...msg, content: "Sorry, I encountered an error generating the UI.", isStreaming: false } 
            : msg
        )
      }));
    }
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 w-8 h-8 rounded-lg flex items-center justify-center shadow-indigo-200 shadow-lg">
             <span className="text-white font-bold text-lg">A2</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Gemini A2UI</h1>
            <p className="text-xs text-gray-500 font-medium">Generative Streaming Interface</p>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-500 font-medium">
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          Gemini 3 Flash
        </div>
      </header>

      <main className="flex-1 flex flex-col overflow-hidden max-w-5xl mx-auto w-full w-full">
        <MessageList messages={state.messages} />
        <ChatInput onSend={handleSend} isLoading={state.isLoading} />
      </main>
    </div>
  );
};

export default App;