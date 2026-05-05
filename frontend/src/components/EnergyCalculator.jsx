import React, { useState } from 'react';
import { Calculator, Info, Zap, CreditCard, Sparkles, TrendingDown, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const EnergyCalculator = () => {
  const [units, setUnits] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const calculateBill = async () => {
    if (!units || isNaN(units)) return;
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8000/calculate?units=${units}`);
      // Handle both {result: "..."} and direct string responses
      const rawResult = response.data.result || response.data;
      setResult(rawResult);
    } catch (error) {
      console.error("Calculation error:", error);
      setResult("Error: Could not reach the calculator server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
      {/* Left Panel: Form */}
      <motion.div 
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        className="lg:col-span-5 flex flex-col"
      >
        <div className="bg-white/80 dark:bg-slate-900/80 p-10 rounded-[3rem] shadow-2xl border border-white/10 backdrop-blur-3xl flex-1 flex flex-col">
          <div className="flex items-center gap-4 mb-10">
            <div className="p-4 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl shadow-xl shadow-primary-500/20">
              <Calculator className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">Bill Estimator</h3>
              <p className="text-xs font-bold text-primary-500 uppercase tracking-widest mt-0.5">Real-time Slabs</p>
            </div>
          </div>

          <div className="space-y-8 flex-1">
            <div className="space-y-3">
              <label className="block text-sm font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">
                Total Units Consumed (kWh)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={units}
                  onChange={(e) => setUnits(e.target.value)}
                  placeholder="Enter consumption e.g. 250"
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-white/5 rounded-3xl px-6 py-5 text-2xl font-bold text-slate-900 dark:text-white focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600 shadow-inner"
                />
                <div className="absolute right-6 top-1/2 -translate-y-1/2 p-2 bg-slate-200/50 dark:bg-white/5 rounded-xl text-xs font-black text-slate-500">
                  KWH
                </div>
              </div>
            </div>

            <button
              onClick={calculateBill}
              disabled={loading || !units}
              className="group relative w-full bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-black py-6 rounded-3xl shadow-2xl shadow-primary-500/30 transition-all active:scale-[0.98] disabled:opacity-50 disabled:grayscale overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <div className="relative flex items-center justify-center gap-3 text-lg tracking-tight">
                {loading ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                    <Sparkles className="w-6 h-6" />
                  </motion.div>
                ) : (
                  <>
                    <Zap className="w-6 h-6 fill-white" />
                    Calculate My Bill
                  </>
                )}
              </div>
            </button>

            <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/40 dark:to-slate-900/40 rounded-[2rem] border border-white/5 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Info className="w-4 h-4 text-primary-500" />
                <span className="text-xs font-black text-slate-900 dark:text-slate-200 uppercase tracking-widest">Pricing Policy</span>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { range: "0 - 100", price: "₹5.00", color: "bg-green-500" },
                  { range: "101 - 300", price: "₹7.00", color: "bg-yellow-500" },
                  { range: "Above 300", price: "₹10.00", color: "bg-red-500" }
                ].map((slab, i) => (
                  <div key={i} className="flex justify-between items-center bg-white/50 dark:bg-white/5 p-3 px-4 rounded-2xl border border-white/10">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${slab.color}`} />
                      <span className="text-sm font-bold text-slate-600 dark:text-slate-400">{slab.range} Units</span>
                    </div>
                    <span className="text-sm font-black text-slate-900 dark:text-white">{slab.price}/u</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Right Panel: Result */}
      <motion.div 
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        className="lg:col-span-7 flex flex-col gap-8"
      >
        <AnimatePresence mode="wait">
          {result ? (
            <motion.div 
              key="result"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="bg-gradient-to-br from-primary-600 to-primary-800 p-12 rounded-[3.5rem] shadow-[0_30px_60px_-15px_rgba(14,165,233,0.4)] text-white relative overflow-hidden flex-1 flex flex-col justify-center"
            >
              <div className="absolute top-0 right-0 p-12 opacity-10">
                <Zap className="w-64 h-64 rotate-12" />
              </div>
              
              <div className="relative z-10 space-y-12">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Live Calculation</span>
                  </div>
                  <h4 className="text-xl font-bold opacity-80">Your Bill Summary</h4>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-slate-300 text-sm font-bold uppercase tracking-[0.3em]">Total Payable</span>
                  <div className="text-7xl font-black tracking-tighter flex items-baseline gap-1">
                    {result.includes('₹') ? '₹' + result.split('₹')[1]?.split('.')[0] : result.match(/\d+/)?.[0] || '0'}
                    <span className="text-3xl font-bold opacity-60">
                      .{result.includes('.') ? result.split('.')[1]?.split(' ')[0]?.split(/[^0-9]/)[0] : '00'}
                    </span>
                  </div>
                </div>

                <div className="p-8 bg-white/10 rounded-[2.5rem] backdrop-blur-3xl border border-white/20 shadow-inner">
                  <div className="flex gap-5">
                    <div className="p-3 bg-white/20 rounded-2xl h-fit">
                      <CreditCard className="w-6 h-6" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-lg font-bold leading-tight">{result}</p>
                      <p className="text-xs text-white/60 font-medium">Calculation verified by EnergyAI Agent logic based on latest regional slab rates.</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button className="flex-1 bg-white text-primary-600 font-black py-5 rounded-2xl shadow-xl hover:bg-slate-100 transition-all flex items-center justify-center gap-2">
                    Proceed to Pay
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <button className="p-5 bg-white/10 hover:bg-white/20 rounded-2xl border border-white/20 transition-all">
                    <TrendingDown className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white/40 dark:bg-slate-900/40 p-12 rounded-[3.5rem] shadow-xl border border-white/10 flex-1 flex flex-col items-center justify-center text-center backdrop-blur-md"
            >
              <div className="w-32 h-32 bg-white dark:bg-slate-800 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-2xl border border-white/10">
                <CreditCard className="w-12 h-12 text-slate-300 dark:text-slate-600" />
              </div>
              <h4 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Calculation Awaited</h4>
              <p className="text-slate-500 dark:text-slate-400 max-w-sm mt-4 text-lg font-medium leading-relaxed">
                Provide your energy consumption data to generate a detailed financial breakdown and savings report.
              </p>
              
              <div className="mt-12 flex gap-3">
                <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
                <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse delay-75" />
                <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse delay-150" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-800/80 dark:to-slate-900/80 p-8 rounded-[2.5rem] shadow-xl border border-white/10 flex items-center gap-6 backdrop-blur-md">
          <div className="p-4 bg-yellow-500/20 rounded-2xl">
            <Sparkles className="w-8 h-8 text-yellow-500" />
          </div>
          <div className="flex-1">
            <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-[0.2em] mb-1">Efficiency Pro-Tip</h4>
            <p className="text-slate-600 dark:text-slate-400 text-sm font-medium italic">
              "Replace old incandescent bulbs with Smart LEDs to reduce lighting costs by up to 85%."
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EnergyCalculator;
