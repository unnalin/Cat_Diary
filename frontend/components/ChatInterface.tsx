import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { ChatMessage } from '../types';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  onSaveDiary: () => void;
  isTyping: boolean;
  text: {
    header: string;
    save: string;
    placeholder: string;
    empty: string;
  };
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  messages, 
  onSendMessage, 
  onSaveDiary,
  isTyping,
  text
}) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  return (
    <motion.div 
      drag
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      /* Increased size: w-80/w-96 -> w-[400px]/w-[464px] and h-[500px] -> h-[580px] */
      className="absolute top-1/2 right-4 md:right-10 lg:right-20 transform -translate-y-1/2 w-[400px] md:w-[464px] h-[580px] flex flex-col z-30 touch-none"
    >
      {/* Chat Container */}
      <div className="flex-1 bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-white/50 overflow-hidden flex flex-col relative">
        
        {/* Header (Drag Handle) */}
        <div 
          className="bg-neutral-900 text-white p-4 flex justify-between items-center cursor-move"
          onPointerDown={(e) => dragControls.start(e)}
        >
          <div className="flex items-center gap-2 pointer-events-none">
            <span className="text-xl">🐾</span>
            <span className="font-semibold tracking-wide">{text.header}</span>
          </div>
          {messages.length > 0 && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onSaveDiary();
              }}
              className="text-xs bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-3 py-1 rounded-full transition-colors cursor-pointer"
            >
              {text.save}
            </button>
          )}
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
          {messages.length === 0 && (
            <div className="text-center text-gray-400 mt-20 text-sm italic">
              "{text.empty}"
            </div>
          )}
          
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {/* Increased padding to p-4 and text size to text-base */}
                <div 
                  className={`max-w-[80%] p-4 rounded-2xl text-base leading-relaxed ${
                    msg.sender === 'user' 
                      ? 'bg-neutral-800 text-white rounded-tr-sm' 
                      : 'bg-neutral-100 text-neutral-800 border border-neutral-200 rounded-tl-sm shadow-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-neutral-100 p-4 rounded-2xl rounded-tl-sm flex gap-1 items-center border border-neutral-200">
                <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce delay-75" />
                <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce delay-150" />
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-neutral-100">
          <div className="relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={text.placeholder}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-full px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-neutral-900 pr-10 transition-all"
            />
            <button 
              type="submit"
              disabled={!inputValue.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-neutral-900 text-white rounded-full disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 transition-transform"
            >
              ➤
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}