
import React from 'react';

interface AITutorPanelProps {
  message: string;
  isTyping?: boolean;
}

const AITutorPanel: React.FC<AITutorPanelProps> = ({ message, isTyping }) => {
  return (
    <div className="glass-card rounded-[2.5rem] p-8 border border-white/5 relative overflow-hidden group shadow-[0_32px_64px_-12px_rgba(0,0,0,0.6)] scanline h-fit min-h-[180px] hover:border-indigo-500/50 hover:bg-slate-900/60 transition-all duration-500">
      {/* Glitch Overlay on Hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-[0.05] pointer-events-none bg-indigo-500 z-0 transition-opacity"></div>
      
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600/10 border border-indigo-500/30 flex items-center justify-center shadow-xl transition-all duration-700 group-hover:scale-110 group-hover:rotate-[-10deg] group-hover:bg-indigo-600/20 group-hover:border-indigo-500">
              <svg className="w-8 h-8 text-indigo-400 group-hover:text-white group-hover:animate-pulse transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            {isTyping && <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-4 border-slate-900 animate-ping"></div>}
          </div>
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400 group-hover:text-white group-hover:translate-x-1 transition-all">Master Neural Core</h3>
            <div className="flex items-center gap-2 mt-1.5">
              <span className={`w-2 h-2 rounded-full transition-all duration-500 ${isTyping ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,1)]' : 'bg-slate-700'}`}></span>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-indigo-300 transition-colors">{isTyping ? 'Neural Stream Processing' : 'Operational Readiness: 100%'}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
           <div className="w-2 h-2 rounded-full bg-white/5 group-hover:bg-indigo-500/40 group-hover:scale-125 transition-all"></div>
           <div className="w-2 h-2 rounded-full bg-white/5 group-hover:bg-indigo-500/40 group-hover:scale-125 transition-all"></div>
        </div>
      </div>
      
      <div className="text-slate-200 text-sm font-bold leading-relaxed font-mono relative z-10 px-2 min-h-[40px]">
        {isTyping ? (
          <div className="flex space-x-3 items-center h-10">
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-2 animate-pulse">Calculating...</span>
          </div>
        ) : (
          <p className="animate-in fade-in slide-in-from-left-4 duration-700 italic border-l-2 border-indigo-500/20 pl-4 py-1 group-hover:text-white group-hover:border-indigo-500 transition-all">
             <span className="text-indigo-400/50 mr-2 opacity-50">{"//"}</span>
             {message}
          </p>
        )}
      </div>

      <div className="absolute -bottom-12 -right-12 p-8 opacity-5 group-hover:opacity-20 transition-all duration-700 group-hover:scale-125 group-hover:rotate-12 group-hover:translate-x-[-10px] group-hover:translate-y-[-10px]">
        <svg className="w-32 h-32 text-indigo-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>
      </div>
    </div>
  );
};

export default AITutorPanel;
