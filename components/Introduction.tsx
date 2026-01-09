
import React, { useState } from 'react';
import { AlgorithmType } from '../types';

interface IntroductionProps {
  onBack: () => void;
  onSelectAlgo: (algo: AlgorithmType) => void;
}

const Introduction: React.FC<IntroductionProps> = ({ onBack, onSelectAlgo }) => {
  const [activeTab, setActiveTab] = useState<'basics' | 'taxonomy' | 'complexity'>('basics');

  return (
    <div className="max-w-6xl mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-20">
      
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-12">
        <div className="space-y-4">
          <button 
            onClick={onBack} 
            className="group flex items-center gap-2 text-indigo-400 text-[10px] font-black uppercase tracking-[0.4em] hover:text-indigo-300 transition-all mb-4"
          >
            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 19l-7-7 7-7" strokeWidth={4} /></svg>
            Exit Theory Briefing
          </button>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none">
            Research Protocol <span className="text-indigo-500">01</span>
          </h1>
          <p className="text-slate-500 text-[11px] font-black uppercase tracking-[0.5em]">System Analysis: Sorting Paradigms & Asymptotics</p>
        </div>
        
        <div className="flex gap-2 p-1.5 bg-white/5 rounded-2xl border border-white/10 h-fit">
          {(['basics', 'taxonomy', 'complexity'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                ${activeTab === tab ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'basics' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-in fade-in slide-in-from-right-4 duration-700">
          <div className="lg:col-span-7 space-y-10">
            <section className="space-y-6">
              <h2 className="text-3xl font-black text-white tracking-tight">The Primacy of Order</h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                In computer science, <span className="text-white font-bold">Sorting</span> is the process of arranging a collection of items into a specific order (numerical or lexicographical). While it seems simple, sorting is the prerequisite for the world's most efficient operations.
              </p>
              <div className="p-8 bg-indigo-500/5 border border-indigo-500/10 rounded-[2.5rem] relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform duration-700">
                  <svg className="w-20 h-20 text-indigo-400" fill="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                </div>
                <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4">Strategic Advantage: Binary Search</h4>
                <p className="text-sm text-slate-300 leading-relaxed font-medium">
                  An unsorted array requires <span className="text-rose-400 font-bold">Linear Search O(n)</span>. Once sorted, we unlock <span className="text-emerald-400 font-bold">Binary Search O(log n)</span>. This transforms searching through 1 million items from 1,000,000 steps to just 20 steps.
                </p>
              </div>
            </section>

            <section className="space-y-8">
              <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em]">Core Concepts</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-white/5 rounded-3xl border border-white/5 hover:border-indigo-500/30 transition-all">
                  <div className="text-2xl mb-4">⚖️</div>
                  <h4 className="text-white font-black mb-2">Stability</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">Stable algorithms preserve the relative order of records with equal keys. Essential when sorting by multiple criteria.</p>
                </div>
                <div className="p-6 bg-white/5 rounded-3xl border border-white/5 hover:border-indigo-500/30 transition-all">
                  <div className="text-2xl mb-4">🧬</div>
                  <h4 className="text-white font-black mb-2">In-Place</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">Algorithms that sort the input without requiring O(n) extra memory. High efficiency for memory-constrained hardware.</p>
                </div>
              </div>
            </section>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="glass-card rounded-[3rem] p-10 border border-white/5 relative overflow-hidden h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent"></div>
              <h3 className="text-xl font-black text-white mb-6 relative z-10">Research Objective</h3>
              <ul className="space-y-6 relative z-10">
                {[
                  "Minimize comparison operations",
                  "Optimize data movement (swaps)",
                  "Understand hardware-specific cache hits",
                  "Identify the best-case adaptive scenarios"
                ].map((item, i) => (
                  <li key={i} className="flex gap-4 items-start">
                    <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-[10px] font-black shrink-0">{i+1}</span>
                    <span className="text-sm text-slate-300 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'taxonomy' && (
        <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-700">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-black text-white mb-6 tracking-tight">The Algorithm Taxonomy</h2>
            <p className="text-slate-400 leading-relaxed">
              Not all sorts are created equal. We classify algorithms based on their structural approach to the data. Mastering these categories allows you to select the right tool for the specific data profile.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Incremental / Iterative",
                desc: "Builds the solution step-by-step. Easy to implement, but typically constrained to O(n²) time.",
                examples: ["Bubble Sort", "Insertion Sort", "Selection Sort"],
                color: "rose"
              },
              {
                title: "Divide & Conquer",
                desc: "Recursively breaks the problem into sub-problems until base cases are reached. Reaches the O(n log n) limit.",
                examples: ["Merge Sort", "Quick Sort"],
                color: "indigo"
              },
              {
                title: "Structure Based",
                desc: "Utilizes advanced data structures like Heaps or Binary Trees to maintain an ordered state efficiently.",
                examples: ["Heap Sort", "Tree Sort"],
                color: "emerald"
              }
            ].map((cat, i) => (
              <div key={i} className="group glass-card p-10 rounded-[3rem] border border-white/5 hover:border-indigo-500/50 transition-all flex flex-col h-full">
                <h3 className={`text-xl font-black text-white mb-4 group-hover:text-${cat.color}-400 transition-colors`}>{cat.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-10 flex-1">{cat.desc}</p>
                <div className="space-y-3">
                  <h5 className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Target Modules</h5>
                  {cat.examples.map(ex => (
                    <button 
                      key={ex} 
                      onClick={() => onSelectAlgo(ex as AlgorithmType)}
                      className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black text-slate-300 uppercase tracking-widest border border-white/5 transition-all text-center"
                    >
                      {ex}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'complexity' && (
        <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-700">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="space-y-8">
              <h2 className="text-3xl font-black text-white tracking-tight">Asymptotic Analysis</h2>
              <p className="text-slate-400 leading-relaxed">
                As software engineers, we don't measure time in seconds (which varies by CPU). We measure <span className="text-white font-bold">growth rate</span> as the input size <span className="text-indigo-400 font-mono italic">n</span> increases.
              </p>
              
              <div className="space-y-6">
                <div className="flex gap-6 items-center p-6 bg-rose-500/5 rounded-3xl border border-rose-500/10">
                  <div className="text-2xl font-mono font-black text-rose-500">O(n²)</div>
                  <div>
                    <h4 className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-1">Quadratic Growth</h4>
                    <p className="text-xs text-slate-400">Time grows exponentially relative to input. 10x more data = 100x more time. (Iterative Sorts)</p>
                  </div>
                </div>
                <div className="flex gap-6 items-center p-6 bg-indigo-500/5 rounded-3xl border border-indigo-500/10">
                  <div className="text-2xl font-mono font-black text-indigo-500">O(n log n)</div>
                  <div>
                    <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Linearithmic Growth</h4>
                    <p className="text-xs text-slate-400">The gold standard for comparison sorts. Highly efficient for large datasets. (Merge & Quick Sorts)</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-[3.5rem] p-10 border border-white/5 relative flex items-center justify-center min-h-[300px] overflow-hidden">
               <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]"></div>
               {/* Complexity Curve Visualization Mockup */}
               <div className="relative w-full h-full flex items-end justify-center gap-2 px-10">
                  {[2, 4, 8, 16, 32, 64, 128].map((h, i) => (
                    <div 
                      key={i} 
                      className="w-full bg-indigo-500/40 rounded-t-lg transition-all duration-1000" 
                      style={{ height: `${h}px` }}
                    ></div>
                  ))}
                  <div className="absolute bottom-0 left-0 w-full h-px bg-slate-700"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[9px] font-black text-slate-700 uppercase tracking-[0.4em] rotate-[-12deg] pointer-events-none">Growth Curve Analysis</div>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div className="pt-16 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center text-white text-2xl shadow-xl shadow-indigo-500/20 animate-pulse">💡</div>
          <div>
            <h4 className="text-sm font-black text-white">Theory Verified</h4>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Ready for practical deployment</p>
          </div>
        </div>
        
        <div className="flex gap-4">
          <button 
            onClick={onBack}
            className="px-8 py-4 bg-slate-900 border border-white/10 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all"
          >
            Return to Dashboard
          </button>
          <button 
            onClick={() => onSelectAlgo(AlgorithmType.BUBBLE)}
            className="px-12 py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-indigo-600/30 hover:bg-indigo-500 transition-all active:scale-95 border-t border-white/20"
          >
            Start First Mission
          </button>
        </div>
      </div>

    </div>
  );
};

export default Introduction;
