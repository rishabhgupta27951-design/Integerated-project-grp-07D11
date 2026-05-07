import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, Sparkles, Trash2, Cpu, Wrench } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const Chat = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "👋 Welcome back! I'm your AI Energy Assistant. I can help you calculate bills, estimate appliance costs, or give you tips to save energy. What's on your mind today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentSteps, setCurrentSteps] = useState([]);
  const scrollRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:8000' : '');

  const examplePrompts = [
    { text: "Calculate bill for 250 units", icon: "📊" },
    { text: "How to save electricity?", icon: "💡" },
    { text: "Estimate AC usage for 8 hours", icon: "❄️" },
    { text: "Explain solar energy benefits", icon: "☀️" }
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isLoading, currentSteps]);

  const handleSend = async (text = input) => {
    if (!text.trim() || isLoading) return;

    const userMessage = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setCurrentSteps(["Initializing Agent..."]);

    try {
      // Simulate step updates for better UX
      setTimeout(() => setCurrentSteps(prev => [...prev, "Analyzing query intent..."]), 800);

      const response = await axios.post(`${API_URL ? API_URL : ''}/chat`, {
        message: text,
        session_id: 'user-1'
      });
      
      setCurrentSteps(response.data.steps || []);
      
      const botMessage = { 
        role: 'assistant', 
        content: response.data.response,
        steps: response.data.steps 
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "🚨 Connection error: I couldn't reach the AI core. Please verify that the backend server is running and the GROQ API key is correct." 
      }]);
    } finally {
      setIsLoading(false);
      setTimeout(() => setCurrentSteps([]), 2000);
    }
  };

  const clearChat = () => {
    setMessages([{ role: 'assistant', content: "Chat cleared. How can I help you now?" }]);
  };

  return (
    <div className="flex flex-col h-full bg-white/30 dark:bg-slate-900/30 rounded-3xl overflow-hidden border border-white/10 shadow-2xl backdrop-blur-xl">
      {/* Chat Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center shadow-lg transition-transform hover:scale-110 ${
                  msg.role === 'user' 
                    ? 'bg-gradient-to-br from-primary-500 to-primary-600 shadow-primary-500/20' 
                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/5'
                }`}>
                  {msg.role === 'user' 
                    ? <User className="w-6 h-6 text-white" /> 
                    : <div className="relative">
                        <Bot className="w-7 h-7 text-primary-500" />
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-800"></div>
                      </div>
                  }
                </div>
                <div className="flex flex-col gap-2">
                  <div className={`relative group p-5 rounded-[2rem] shadow-sm transition-all ${
                    msg.role === 'user' 
                      ? 'bg-primary-500 text-white rounded-tr-none' 
                      : 'bg-white/80 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200/50 dark:border-white/5 backdrop-blur-md'
                  }`}>
                    <p className="text-sm md:text-base whitespace-pre-wrap leading-relaxed font-medium tracking-wide">
                      {msg.content}
                    </p>
                  </div>
                  
                  {/* Step Indicators for Bot Messages */}
                  {msg.role === 'assistant' && msg.steps && (
                    <div className="flex flex-wrap gap-2 ml-4">
                      {msg.steps.map((step, i) => (
                        <div key={i} className="flex items-center gap-1.5 px-3 py-1 bg-slate-100/50 dark:bg-white/5 rounded-full border border-white/5 text-[9px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                          {step.includes('tool') ? <Wrench className="w-3 h-3 text-primary-500" /> : <Cpu className="w-3 h-3 text-indigo-500" />}
                          {step}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col gap-4 items-start"
          >
            <div className="flex gap-4 items-center bg-white/50 dark:bg-slate-800/50 backdrop-blur-md p-5 rounded-[2rem] rounded-tl-none border border-white/10">
              <div className="flex gap-1.5">
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -6, 0] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.15 }}
                    className="w-2.5 h-2.5 bg-primary-500 rounded-full"
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-2">Agent Processing</span>
            </div>

            {/* Real-time steps */}
            <div className="ml-16 space-y-2">
              <AnimatePresence>
                {currentSteps.map((step, i) => (
                  <motion.div 
                    key={step + i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2 text-[10px] font-black text-primary-500/60 uppercase tracking-widest"
                  >
                    <div className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-pulse" />
                    {step}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-8 bg-white/10 dark:bg-slate-900/50 border-t border-white/5 backdrop-blur-3xl">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Example Prompts */}
          {messages.length < 3 && (
            <div className="flex flex-wrap gap-3">
              {examplePrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(prompt.text)}
                  className="group text-xs font-bold px-5 py-3 rounded-2xl glass hover:bg-primary-500 hover:text-white hover:shadow-xl hover:shadow-primary-500/30 transition-all duration-300 flex items-center gap-2.5 border-white/10 text-slate-600 dark:text-slate-300"
                >
                  <span className="group-hover:scale-125 transition-transform">{prompt.icon}</span>
                  {prompt.text}
                </button>
              ))}
            </div>
          )}

          <div className="relative group">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask anything about your energy usage..."
              className="w-full bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 rounded-[2rem] pl-7 pr-16 py-5 focus:outline-none focus:ring-4 focus:ring-primary-500/20 transition-all shadow-xl text-lg placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {messages.length > 1 && (
                <button
                  onClick={clearChat}
                  className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all"
                  title="Clear conversation"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={() => handleSend()}
                disabled={isLoading || !input.trim()}
                className="p-3.5 bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-2xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:grayscale disabled:hover:scale-100 transition-all shadow-lg shadow-primary-500/20"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <div className="flex items-center justify-center gap-4">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-slate-500/20 to-transparent"></div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
              Energy AI Agent • v2.0 Enhanced
            </p>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-slate-500/20 to-transparent"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
