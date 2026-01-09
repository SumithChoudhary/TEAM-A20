
import React, { useState, useEffect } from 'react';
import { UserStats, QuizQuestion } from '../types';
import { generateDailyRevision } from '../services/geminiService';

interface DailyRevisionProps {
  stats: UserStats;
  onComplete: (score: number) => void;
  onCancel: () => void;
}

const DailyRevision: React.FC<DailyRevisionProps> = ({ stats, onComplete, onCancel }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selected, setSelected] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const load = async () => {
      const data = await generateDailyRevision(stats.mistakes);
      setQuestions(data.questions);
      setIsLoading(false);
    };
    load();
  }, [stats.mistakes]);

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    if (idx === questions[currentIdx].correctAnswer) setScore(s => s + 1);
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(i => i + 1);
      setSelected(null);
    } else {
      setIsFinished(true);
      onComplete(score + (selected === questions[currentIdx].correctAnswer ? 1 : 0));
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[400] bg-slate-950 flex flex-col items-center justify-center p-8 gap-8">
        <div className="w-24 h-24 rounded-full border-t-2 border-indigo-500 animate-spin"></div>
        <div className="text-center space-y-2">
          <h2 className="text-xl font-black text-white uppercase tracking-widest">Neural Recovery System</h2>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-tighter animate-pulse">AI Agent: Generating Targeted Revision Logic...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="fixed inset-0 z-[400] bg-slate-950 flex flex-col items-center justify-center p-8 text-center gap-6">
        <span className="text-5xl">✅</span>
        <h2 className="text-2xl font-black text-white tracking-tighter">Perfect Sync Detected</h2>
        <p className="text-sm text-slate-500 max-w-md">No recent logical gaps found to generate revision questions. Keep up the high-fidelity engineering!</p>
        <button onClick={onCancel} className="px-8 py-3 bg-indigo-600 rounded-xl font-black uppercase text-xs text-white">Return to Interface</button>
      </div>
    );
  }

  const q = questions[currentIdx];

  return (
    <div className="fixed inset-0 z-[400] bg-slate-950/90 backdrop-blur-xl flex flex-col items-center justify-center p-6 md:p-12 overflow-y-auto">
      <div className="w-full max-w-3xl glass-card rounded-[3.5rem] p-10 md:p-16 border border-white/10 shadow-2xl relative overflow-hidden">
        
        <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
           <div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: `${(currentIdx / questions.length) * 100}%` }}></div>
        </div>

        <div className="flex justify-between items-center mb-12">
           <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-xs font-black text-white">0{currentIdx + 1}</span>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Micro-Revision Protocol</span>
           </div>
           <button onClick={onCancel} className="text-slate-500 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" strokeWidth={3}/></svg>
           </button>
        </div>

        <div className="space-y-10">
           <h3 className="text-2xl md:text-4xl font-black text-white tracking-tighter leading-tight">{q.question}</h3>
           
           <div className="grid grid-cols-1 gap-4">
              {q.options.map((opt, i) => {
                let styles = "bg-white/5 border-white/5 text-slate-400 hover:bg-white/10";
                if (selected !== null) {
                  if (i === q.correctAnswer) styles = "bg-emerald-500/10 border-emerald-500 text-emerald-400";
                  else if (i === selected) styles = "bg-rose-500/10 border-rose-500 text-rose-400";
                  else styles = "opacity-20 bg-white/5 border-white/5 text-slate-600";
                }
                return (
                  <button
                    key={i}
                    onClick={() => handleSelect(i)}
                    className={`p-6 rounded-2xl border-2 transition-all duration-300 text-left font-bold flex items-center gap-4 ${styles}`}
                  >
                    <div className="w-6 h-6 rounded-lg border border-current flex items-center justify-center text-[10px] font-black">{String.fromCharCode(65 + i)}</div>
                    {opt}
                  </button>
                );
              })}
           </div>

           {selected !== null && (
             <div className="animate-in slide-in-from-bottom-4 duration-500">
                <div className="p-6 bg-indigo-500/5 border border-indigo-500/20 rounded-3xl mb-8">
                   <h5 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Conceptual Recovery</h5>
                   <p className="text-sm text-slate-300 font-medium leading-relaxed">{q.explanation}</p>
                </div>
                <button onClick={handleNext} className="w-full py-5 bg-white text-slate-950 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-50 transition-all shadow-xl active:scale-95">
                   {currentIdx === questions.length - 1 ? 'Finalize Recovery' : 'Next Strategic Question'}
                </button>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default DailyRevision;
