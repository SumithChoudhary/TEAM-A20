
import React from 'react';
import { UserStats, ErrorCategory, AlgorithmType } from '../types';

interface MistakeDiaryProps {
  stats: UserStats;
}

const CATEGORY_MAP: Record<ErrorCategory, { label: string, color: string, icon: string }> = {
  COMPLEXITY: { label: 'Asymptotic Confusion', color: 'text-rose-400', icon: '📈' },
  BOUNDARY: { label: 'Off-by-One/Boundary', color: 'text-amber-400', icon: '🚧' },
  LOGIC: { label: 'Conceptual Inversion', color: 'text-indigo-400', icon: '🔄' },
  STABILITY: { label: 'Stability Conflict', color: 'text-emerald-400', icon: '⚖️' },
  SWAP_ERROR: { label: 'Non-Atomic Swap', color: 'text-purple-400', icon: '🧩' }
};

const MistakeDiary: React.FC<MistakeDiaryProps> = ({ stats }) => {
  const getCategoryCount = (cat: ErrorCategory) => stats.mistakes.filter(m => m.category === cat).length;
  
  // Calculate Before vs After progress
  const initialAvg = Object.values(stats.initialScores).length > 0 
    ? (Object.values(stats.initialScores).reduce((a, b) => a + b, 0) / Object.values(stats.initialScores).length) * 33.3 
    : 0;
  
  const currentAvg = Object.values(stats.quizScores).length > 0
    ? (Object.values(stats.quizScores).reduce((a, b) => a + b, 0) / Object.values(stats.quizScores).length) * 33.3
    : 0;

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      
      {/* Before vs After Visualization */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-card rounded-[3rem] p-10 border border-white/5 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-5">
              <svg className="w-32 h-32 text-indigo-500" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/></svg>
           </div>
           <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-6">Cognitive Growth Metrics</h3>
           <div className="flex items-center gap-12">
             <div className="flex flex-col items-center">
                <span className="text-4xl font-black text-slate-500 mb-2">{Math.round(initialAvg)}%</span>
                <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Baseline</span>
             </div>
             <div className="w-12 h-12 flex items-center justify-center text-2xl text-indigo-500 animate-pulse">➜</div>
             <div className="flex flex-col items-center">
                <span className="text-4xl font-black text-white mb-2">{Math.round(currentAvg)}%</span>
                <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Mastery</span>
             </div>
           </div>
           <p className="mt-8 text-[11px] text-slate-500 leading-relaxed font-medium">
             Analysis shows a <span className="text-indigo-400 font-bold">+{Math.round(currentAvg - initialAvg)}%</span> synchronization improvement across core sorting paradigms since protocol initialization.
           </p>
        </div>

        <div className="glass-card rounded-[3rem] p-10 border border-white/5">
          <h3 className="text-[10px] font-black text-rose-400 uppercase tracking-[0.4em] mb-6">Synergy Gap Analysis</h3>
          <div className="space-y-5">
            {(Object.keys(CATEGORY_MAP) as ErrorCategory[]).map(cat => (
              <div key={cat} className="space-y-2">
                <div className="flex justify-between items-end">
                   <div className="flex items-center gap-2">
                      <span className="text-xs">{CATEGORY_MAP[cat].icon}</span>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{CATEGORY_MAP[cat].label}</span>
                   </div>
                   <span className="text-[10px] font-mono font-bold text-slate-500">{getCategoryCount(cat)} Hits</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                   <div 
                     className={`h-full transition-all duration-1000 ${CATEGORY_MAP[cat].color.replace('text', 'bg')}`} 
                     style={{ width: `${Math.min(100, getCategoryCount(cat) * 10)}%` }}
                   ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mistake Timeline */}
      <div className="space-y-6">
        <div className="flex items-center gap-4">
           <div className="w-2 h-6 bg-rose-500 rounded-full"></div>
           <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.5em]">Mistake Archive (Recent)</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.mistakes.slice(-9).reverse().map(mistake => (
            <div key={mistake.id} className="p-6 rounded-[2rem] bg-slate-900/40 border border-white/5 hover:border-rose-500/20 transition-all group">
              <div className="flex justify-between items-start mb-4">
                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${CATEGORY_MAP[mistake.category].color.replace('text', 'border')} ${CATEGORY_MAP[mistake.category].color}`}>
                  {mistake.category}
                </span>
                <span className="text-[8px] font-mono text-slate-600">{new Date(mistake.timestamp).toLocaleDateString()}</span>
              </div>
              <h4 className="text-sm font-black text-white mb-2 group-hover:text-rose-400 transition-colors">{mistake.algo}</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed italic line-clamp-2">"{mistake.context}"</p>
            </div>
          ))}
          {stats.mistakes.length === 0 && (
            <div className="col-span-full py-20 text-center glass-card rounded-[3rem] border-dashed border-white/5">
               <span className="text-4xl block mb-4">🛡️</span>
               <p className="text-xs font-black text-slate-600 uppercase tracking-[0.2em]">No logical breaches detected in recent sims.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default MistakeDiary;
