
import React, { useState, useEffect } from 'react';
import { AlgorithmType, UserStats } from '../types';
import { LESSONS } from '../constants';

interface TacticalAdvisorProps {
  mode: 'onboarding' | 'persistent';
  algorithm: AlgorithmType;
  stats: UserStats;
  onComplete?: () => void;
  isTyping?: boolean;
  tutorMessage?: string;
}

const ONBOARDING_STEPS = [
  { text: "Greetings, Engineer! I am Master Logic. I've been assigned as your tactical advisor through the complex world of Sorting Algorithms.", position: 'center' },
  { text: "This is your Personal Dossier. Your XP and Level represent your synaptic synchronization with sorting theory.", position: 'bottom-left' },
  { text: "The Tactical Lab is where you select your research targets. We recommend starting with Iterative Foundations.", position: 'center' },
  { text: "I will remain active on your HUD during operations to provide real-time logic verification and heuristic hints.", position: 'center' },
  { text: "Protocol initialization complete. Let's begin.", position: 'center' }
];

const TacticalAdvisor: React.FC<TacticalAdvisorProps> = ({ mode, algorithm, stats, onComplete, isTyping, tutorMessage }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isLocalTyping, setIsLocalTyping] = useState(true);

  const lesson = LESSONS[algorithm];

  useEffect(() => {
    if (mode === 'onboarding') {
      setIsLocalTyping(true);
      setDisplayedText('');
      let i = 0;
      const text = ONBOARDING_STEPS[currentStep].text;
      const interval = setInterval(() => {
        setDisplayedText(prev => prev + text[i]);
        i++;
        if (i >= text.length) {
          clearInterval(interval);
          setIsLocalTyping(false);
        }
      }, 30);
      return () => clearInterval(interval);
    }
  }, [currentStep, mode]);

  const handleNext = () => {
    if (isLocalTyping) {
      setDisplayedText(ONBOARDING_STEPS[currentStep].text);
      setIsLocalTyping(false);
      return;
    }
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(s => s + 1);
    } else if (onComplete) {
      onComplete();
    }
  };

  if (mode === 'onboarding') {
    return (
      <div className="fixed inset-0 z-[300] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-500">
        <div className="flex flex-col items-center gap-8 max-w-lg text-center">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full bg-indigo-600/20 border-4 border-indigo-500/40 flex items-center justify-center shadow-[0_0_50px_rgba(99,102,241,0.3)] animate-bounce-slow">
              <div className="w-24 h-24 rounded-full bg-indigo-500 flex items-center justify-center text-5xl relative overflow-hidden">
                🤖
              </div>
            </div>
            <div className="absolute inset-[-20px] border-2 border-dashed border-indigo-500/20 rounded-full animate-spin-slow"></div>
          </div>

          <div 
            onClick={handleNext}
            className="bg-slate-900 border-2 border-indigo-500/50 rounded-[2.5rem] p-10 shadow-2xl cursor-pointer hover:border-indigo-400 transition-all active:scale-95 group"
          >
            <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-4">Master Logic Advisor</h4>
            <p className="text-xl font-bold text-white leading-relaxed tracking-tight min-h-[100px]">
              {displayedText}
              {isLocalTyping && <span className="w-1.5 h-5 bg-indigo-500 inline-block ml-1 animate-pulse"></span>}
            </p>
            <div className="mt-8 flex items-center justify-between">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Initialization Phase {currentStep + 1}/5</span>
              <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest group-hover:translate-x-1 transition-transform flex items-center gap-2">
                Continue <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M13 7l5 5m0 0l-5 5m5-5H6" strokeWidth={3}/></svg>
              </div>
            </div>
          </div>
        </div>
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes bounce-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
          @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          .animate-bounce-slow { animation: bounce-slow 4s infinite ease-in-out; }
          .animate-spin-slow { animation: spin-slow 12s infinite linear; }
        `}} />
      </div>
    );
  }

  // Persistent Side Mode
  return (
    <div className="glass-card rounded-[2.5rem] p-6 border border-white/5 flex flex-col gap-6 shadow-2xl relative overflow-hidden group scanline">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
         <svg className="w-20 h-20 text-indigo-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 2.18l7 3.12v4.7c0 4.54-3.04 8.79-7 9.91-3.96-1.12-7-5.37-7-9.91V6.3l7-3.12z"/></svg>
      </div>

      <div className="flex items-center gap-4 relative z-10">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-3xl animate-bounce-slow">
           🤖
        </div>
        <div>
           <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-1">Tactical Advisor</h3>
           <div className="flex items-center gap-2">
             <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
             <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Active Monitoring</p>
           </div>
        </div>
      </div>

      <div className="space-y-4 relative z-10">
         <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
            <h4 className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-2">Operation Briefing: {algorithm}</h4>
            <p className="text-xs text-slate-300 font-medium leading-relaxed italic">
               "{tutorMessage || `Targeting ${lesson.complexity} complexity. Focus on the core invariant.`}"
            </p>
         </div>

         <div className="space-y-3">
            <h5 className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Protocol Checkpoints</h5>
            <div className="space-y-2">
               {[
                 { label: 'Logical Integrity', val: stats.mistakes.filter(m => m.algo === algorithm).length === 0 ? 'Verified' : 'Breached', color: stats.mistakes.filter(m => m.algo === algorithm).length === 0 ? 'text-emerald-400' : 'text-rose-400' },
                 { label: 'Asymptotic Target', val: lesson.complexity, color: 'text-indigo-400' },
                 { label: 'Sync Level', val: `${(stats.algoDifficulty[algorithm] || 1) * 20}%`, color: 'text-amber-400' }
               ].map((item, i) => (
                 <div key={i} className="flex justify-between items-center text-[10px] font-bold uppercase tracking-tight">
                    <span className="text-slate-500">{item.label}</span>
                    <span className={item.color}>{item.val}</span>
                 </div>
               ))}
            </div>
         </div>
      </div>

      <div className="mt-auto pt-4 border-t border-white/5">
         <div className="flex items-center gap-2 text-indigo-400/50 text-[9px] font-black uppercase tracking-[0.2em] animate-pulse">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeWidth={3}/></svg>
            System advice: Observe the head elements before every swap decision.
         </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes bounce-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
        .animate-bounce-slow { animation: bounce-slow 3s infinite ease-in-out; }
      `}} />
    </div>
  );
};

export default TacticalAdvisor;
