import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Calculator, 
  Lightbulb, 
  Settings, 
  Menu, 
  X, 
  Moon, 
  Sun,
  Zap,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'framer-motion';
import Chat from './Chat';
import EnergyCalculator from './EnergyCalculator';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('chat');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const navItems = [
    { id: 'chat', label: 'AI Assistant', icon: MessageSquare, description: 'Smart energy chat' },
    { id: 'calculator', label: 'Bill Estimator', icon: Calculator, description: 'Slab-based math' },
  ];

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-950 transition-colors duration-500 overflow-hidden">
      <div className="bg-mesh" />
      
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 glass border-r transition-all duration-500 ease-in-out transform lg:relative lg:translate-x-0 m-4 rounded-3xl shadow-2xl",
          !isSidebarOpen && "-translate-x-full lg:hidden"
        )}
      >
        <div className="flex flex-col h-full py-8">
          <div className="px-8 flex items-center gap-4 mb-12">
            <div className="p-3 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl shadow-lg shadow-primary-500/40 animate-float">
              <Zap className="w-6 h-6 text-white fill-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">EnergyAI</h1>
              <p className="text-[10px] font-bold text-primary-500 uppercase tracking-widest">Next-Gen Agentic AI</p>
            </div>
          </div>

          <nav className="flex-1 px-4 space-y-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "group relative flex items-center w-full gap-4 px-5 py-4 rounded-2xl transition-all duration-300",
                  activeTab === item.id 
                    ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-xl shadow-primary-500/30 translate-x-2" 
                    : "text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white"
                )}
              >
                <item.icon className={cn("w-5 h-5 transition-transform duration-300 group-hover:scale-110", activeTab === item.id ? "text-white" : "text-slate-400")} />
                <div className="text-left">
                  <p className="font-bold text-sm">{item.label}</p>
                  <p className={cn("text-[10px] transition-colors", activeTab === item.id ? "text-primary-100" : "text-slate-400")}>
                    {item.description}
                  </p>
                </div>
                {activeTab === item.id && (
                  <ChevronRight className="w-4 h-4 ml-auto text-white/50" />
                )}
              </button>
            ))}
          </nav>

          <div className="px-6 mt-auto">
            <div className="p-5 bg-gradient-to-br from-slate-800 to-slate-900 dark:from-slate-800/50 dark:to-slate-900/50 rounded-3xl border border-white/5">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <ShieldCheck className="w-4 h-4 text-green-500" />
                </div>
                <span className="text-xs font-bold text-slate-300">Agent Status</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                <span className="text-xs text-slate-400 font-medium tracking-wide">LLaMA 3.3 Core Active</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden p-4">
        <div className="flex-1 flex flex-col glass rounded-[2.5rem] shadow-2xl border border-white/10 overflow-hidden backdrop-blur-3xl">
          {/* Header */}
          <header className="h-20 flex items-center justify-between px-8 border-b border-slate-200/50 dark:border-white/5">
            <div className="flex items-center gap-6">
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2.5 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-all lg:hidden"
              >
                {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {navItems.find(i => i.id === activeTab)?.label}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Monitoring your energy workspace</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="w-12 h-12 flex items-center justify-center bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-white/10 hover:scale-105 transition-all shadow-sm"
              >
                {isDarkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-primary-600" />}
              </button>
              <div className="flex items-center gap-3 p-1.5 pr-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-black text-sm shadow-inner">
                  AD
                </div>
                <div className="hidden sm:block">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter leading-none mb-1">Premium User</p>
                  <p className="text-xs font-bold text-slate-900 dark:text-white leading-none">Admin Demo</p>
                </div>
              </div>
            </div>
          </header>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            <div className="max-w-6xl mx-auto h-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -10, filter: 'blur(10px)' }}
                  transition={{ duration: 0.4, ease: "circOut" }}
                  className="h-full"
                >
                  {activeTab === 'chat' && <Chat />}
                  {activeTab === 'calculator' && <EnergyCalculator />}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
