
import React, { useState, useEffect } from 'react';

const SCENES = [
  {
    title: "Introduction",
    narration: "Welcome to Insertion Sort! This algorithm builds your sorted array one element at a time.",
    duration: 5000
  },
  {
    title: "The Hand Analogy",
    narration: "Think of it like sorting a hand of playing cards. You pick one card and find its perfect spot.",
    duration: 8000
  },
  {
    title: "Step 1: Pick & Compare",
    narration: "We take the first unsorted element. This is our 'Key'. We compare it to elements on its left.",
    duration: 10000
  },
  {
    title: "Step 2: The Shift",
    narration: "If the element on the left is larger, we shift it to the right to make space for our key.",
    duration: 10000
  },
  {
    title: "Step 3: Insert",
    narration: "Once we find an element smaller than our key (or reach the start), we drop the key into its spot.",
    duration: 8000
  },
  {
    title: "Time Complexity",
    narration: "Because we might have to compare every element with every other element, it's O(n²) in the worst case.",
    duration: 10000
  },
  {
    title: "Summary",
    narration: "Simple, stable, and great for small or nearly sorted datasets. Happy coding!",
    duration: 9000
  }
];

const InsertionSortVideo: React.FC = () => {
  const [currentScene, setCurrentScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let timer: number;
    if (isPlaying) {
      const sceneDuration = SCENES[currentScene].duration;
      const startTime = Date.now();
      
      timer = window.setInterval(() => {
        const elapsed = Date.now() - startTime;
        const newProgress = Math.min((elapsed / sceneDuration) * 100, 100);
        setProgress(newProgress);

        if (elapsed >= sceneDuration) {
          if (currentScene < SCENES.length - 1) {
            setCurrentScene(s => s + 1);
            setProgress(0);
          } else {
            setIsPlaying(false);
            setCurrentScene(0);
            setProgress(0);
          }
        }
      }, 50);
    }
    return () => clearInterval(timer);
  }, [isPlaying, currentScene]);

  const renderVisuals = () => {
    switch (currentScene) {
      case 0: // Intro
        return (
          <div className="flex gap-2 items-end h-32 animate-in zoom-in duration-500">
            {[30, 70, 45, 90, 20].map((h, i) => (
              <div key={i} className="w-8 bg-indigo-500 rounded-t-lg" style={{ height: `${h}%` }}></div>
            ))}
          </div>
        );
      case 1: // Analogy
        return (
          <div className="relative flex gap-1 h-32 items-center">
            {[1, 2, 3, 4].map((v) => (
              <div key={v} className="w-12 h-20 bg-white rounded-lg border-2 border-slate-300 shadow-xl flex items-center justify-center text-slate-800 font-bold rotate-[-10deg]">
                {v === 3 ? <span className="text-red-500 animate-bounce">♥</span> : '♠'}
              </div>
            ))}
            <div className="absolute top-[-20px] left-1/2 -translate-x-1/2 bg-amber-500 text-white text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-widest">Sorting Deck</div>
          </div>
        );
      case 2: // Pick
        return (
          <div className="flex gap-4 items-end h-32">
            <div className="w-10 h-24 bg-emerald-500 rounded-t-lg opacity-40"></div>
            <div className="w-10 h-16 bg-indigo-500 rounded-t-lg ring-4 ring-white animate-pulse"></div>
            <div className="w-10 h-32 bg-slate-700 rounded-t-lg"></div>
            <div className="w-10 h-20 bg-slate-700 rounded-t-lg"></div>
          </div>
        );
      case 3: // Shift
        return (
          <div className="flex gap-4 items-end h-32">
             <div className="w-10 h-32 bg-emerald-500 rounded-t-lg translate-x-14 transition-all duration-1000"></div>
             <div className="w-10 h-16 bg-white rounded-t-lg -translate-y-12 shadow-2xl z-20"></div>
             <div className="w-10 h-24 bg-slate-700 rounded-t-lg opacity-20"></div>
          </div>
        );
      case 4: // Insert
        return (
          <div className="flex gap-4 items-end h-32">
             <div className="w-10 h-32 bg-emerald-500 rounded-t-lg"></div>
             <div className="w-10 h-16 bg-emerald-400 rounded-t-lg animate-in slide-in-from-top-12 duration-1000"></div>
             <div className="w-10 h-24 bg-emerald-500 rounded-t-lg"></div>
          </div>
        );
      case 5: // Complexity
        return (
          <div className="flex flex-col items-center gap-4">
            <div className="text-4xl font-black text-rose-500 animate-pulse">O(n²)</div>
            <div className="grid grid-cols-4 gap-1">
              {Array.from({length: 16}).map((_, i) => (
                <div key={i} className="w-4 h-4 bg-rose-500/20 rounded-sm"></div>
              ))}
            </div>
          </div>
        );
      default:
        return (
          <div className="flex gap-2 items-end h-32">
            {[20, 30, 40, 50, 60, 70, 80].map((h, i) => (
              <div key={i} className="w-6 bg-emerald-500 rounded-t-lg h-full" style={{ height: `${h}%` }}></div>
            ))}
          </div>
        );
    }
  };

  return (
    <div className="w-full h-full bg-slate-950 rounded-2xl flex flex-col relative overflow-hidden group border border-slate-800 shadow-2xl">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #4f46e5 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
      
      {!isPlaying && currentScene === 0 ? (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm z-30 transition-all group-hover:bg-slate-950/40">
           <button 
             onClick={() => setIsPlaying(true)}
             className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all shadow-2xl shadow-indigo-600/40 ring-4 ring-white/10"
           >
             <svg className="w-10 h-10 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
           </button>
        </div>
      ) : null}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 gap-8">
        <div className="h-40 flex items-center justify-center w-full">
           {renderVisuals()}
        </div>
        
        <div className="text-center max-w-md">
           <h4 className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">{SCENES[currentScene].title}</h4>
           <p className="text-slate-300 text-sm font-medium leading-relaxed h-16 transition-all duration-500">
             {SCENES[currentScene].narration}
           </p>
        </div>
      </div>

      {/* Controls & Progress */}
      <div className="bg-slate-900/80 backdrop-blur-md p-4 flex flex-col gap-3 border-t border-slate-800">
        <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-500 transition-all duration-100 ease-linear shadow-[0_0_8px_indigo]" 
            style={{ width: isPlaying ? `${progress}%` : '0%' }}
          ></div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
             <button onClick={() => setIsPlaying(!isPlaying)} className="text-slate-400 hover:text-white transition-colors">
               {isPlaying ? (
                 <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
               ) : (
                 <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
               )}
             </button>
             <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                Scene {currentScene + 1} / {SCENES.length}
             </div>
          </div>
          <div className="px-3 py-1 bg-indigo-500/10 rounded-full border border-indigo-500/20">
             <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">AI Narrator: Kore</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsertionSortVideo;
