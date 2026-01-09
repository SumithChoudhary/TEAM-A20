
import React, { useState, useEffect } from 'react';

const SCENES = [
  {
    title: "Divide & Conquer",
    narration: "Merge Sort is a 'Divide and Conquer' algorithm. It breaks a big problem into smaller, easier pieces.",
    duration: 6000
  },
  {
    title: "Step 1: Divide",
    narration: "First, we recursively split the array into two halves until we reach individual elements.",
    duration: 8000
  },
  {
    title: "Step 2: Conquer",
    narration: "An array with only one element is already sorted. This is our base case!",
    duration: 7000
  },
  {
    title: "Step 3: The Merge",
    narration: "Now we stitch them back together. We take two sorted groups and merge them into one larger sorted group.",
    duration: 10000
  },
  {
    title: "How it Merges",
    narration: "We compare the front elements of both groups and pick the smallest one first. Every element gets its turn.",
    duration: 10000
  },
  {
    title: "Efficiency: O(n log n)",
    narration: "Because we divide the work in half at each step, Merge Sort is incredibly fast, even for massive amounts of data.",
    duration: 10000
  },
  {
    title: "Summary",
    narration: "Reliable and predictable. Merge Sort is the backbone of many modern sorting libraries. Ready to try it?",
    duration: 9000
  }
];

const MergeSortVideo: React.FC = () => {
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
          <div className="flex gap-4 items-center">
             <div className="w-24 h-24 bg-indigo-500 rounded-2xl flex items-center justify-center text-4xl shadow-2xl animate-bounce">÷</div>
             <div className="text-2xl font-black text-slate-700">➜</div>
             <div className="w-16 h-16 bg-emerald-500 rounded-xl flex items-center justify-center text-2xl shadow-xl">✓</div>
          </div>
        );
      case 1: // Divide
        return (
          <div className="flex flex-col items-center gap-4">
            <div className="flex gap-1">
              {[1, 2, 3, 4].map(i => <div key={i} className="w-6 h-12 bg-slate-700 rounded" />)}
            </div>
            <div className="text-indigo-500 text-xl font-black">⇣</div>
            <div className="flex gap-8">
              <div className="flex gap-1">
                {[1, 2].map(i => <div key={i} className="w-6 h-12 bg-indigo-500/50 rounded" />)}
              </div>
              <div className="flex gap-1">
                {[3, 4].map(i => <div key={i} className="w-6 h-12 bg-indigo-500/50 rounded" />)}
              </div>
            </div>
          </div>
        );
      case 2: // Conquer
        return (
          <div className="flex gap-4">
            {[20, 50, 10, 80].map((h, i) => (
              <div key={i} className="flex flex-col items-center gap-2 animate-in zoom-in duration-500">
                <div className="w-8 bg-emerald-500 rounded-t-lg" style={{ height: `${h}px` }} />
                <div className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center text-[8px] font-bold text-emerald-500">1</div>
              </div>
            ))}
          </div>
        );
      case 3: // Merge
        return (
          <div className="flex flex-col items-center gap-4">
            <div className="flex gap-12">
               <div className="flex gap-1 translate-y-4 animate-in slide-in-from-bottom-4">
                  <div className="w-6 h-12 bg-indigo-500 rounded" />
                  <div className="w-6 h-20 bg-indigo-500 rounded" />
               </div>
               <div className="flex gap-1 translate-y-4 animate-in slide-in-from-bottom-4">
                  <div className="w-6 h-8 bg-indigo-500 rounded" />
                  <div className="w-6 h-24 bg-indigo-500 rounded" />
               </div>
            </div>
            <div className="text-emerald-500 text-xl font-black">⇡</div>
            <div className="flex gap-1">
               <div className="w-6 h-8 bg-emerald-500 rounded" />
               <div className="w-6 h-12 bg-emerald-500 rounded" />
               <div className="w-6 h-20 bg-emerald-500 rounded" />
               <div className="w-6 h-24 bg-emerald-500 rounded" />
            </div>
          </div>
        );
      case 4: // How it Merges
        return (
          <div className="flex flex-col items-center gap-6">
            <div className="flex gap-8">
               <div className="flex gap-1 border-b-2 border-indigo-500/30 pb-2">
                  <div className="w-8 h-12 bg-indigo-500 rounded ring-2 ring-white animate-pulse" />
                  <div className="w-8 h-20 bg-indigo-500 rounded opacity-40" />
               </div>
               <div className="flex gap-1 border-b-2 border-indigo-500/30 pb-2">
                  <div className="w-8 h-16 bg-indigo-500 rounded ring-2 ring-rose-500 animate-pulse" />
                  <div className="w-8 h-24 bg-indigo-500 rounded opacity-40" />
               </div>
            </div>
            <div className="px-4 py-1 bg-slate-800 rounded text-[10px] text-indigo-300 font-mono">12 {'<'} 16 ? Pick 12</div>
          </div>
        );
      case 5: // Complexity
        return (
          <div className="relative flex flex-col items-center gap-2">
             <div className="text-3xl font-black text-indigo-400">n log n</div>
             <svg width="200" height="80" viewBox="0 0 200 80">
                <path d="M100 10 L40 70 M100 10 L160 70" stroke="#4f46e5" strokeWidth="2" strokeDasharray="4 2" />
                <path d="M40 70 L10 120 M40 70 L70 120" stroke="#4f46e5" strokeWidth="1" opacity="0.3" />
                <circle cx="100" cy="10" r="4" fill="#4f46e5" />
                <circle cx="40" cy="70" r="4" fill="#4f46e5" />
                <circle cx="160" cy="70" r="4" fill="#4f46e5" />
             </svg>
             <div className="absolute top-1/2 left-[-60px] text-[8px] font-bold text-slate-500 rotate-[-90deg] uppercase tracking-widest">Recursive Tree</div>
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
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #4f46e5 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
      
      {!isPlaying && currentScene === 0 ? (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm z-30 transition-all group-hover:bg-slate-950/40">
           <button 
             onClick={() => setIsPlaying(true)}
             className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all shadow-2xl shadow-indigo-600/40"
           >
             <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
           </button>
        </div>
      ) : null}

      <div className="flex-1 flex flex-col items-center justify-center p-8 gap-8 min-h-[200px]">
        <div className="h-40 flex items-center justify-center w-full">
           {renderVisuals()}
        </div>
        
        <div className="text-center max-w-sm">
           <h4 className="text-indigo-400 text-[9px] font-black uppercase tracking-[0.2em] mb-2">{SCENES[currentScene].title}</h4>
           <p className="text-slate-300 text-xs font-medium leading-relaxed h-12 transition-all duration-500">
             {SCENES[currentScene].narration}
           </p>
        </div>
      </div>

      <div className="bg-slate-900/80 backdrop-blur-md p-4 flex flex-col gap-3 border-t border-slate-800">
        <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-500 transition-all duration-100 ease-linear" 
            style={{ width: isPlaying ? `${progress}%` : '0%' }}
          ></div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
             <button onClick={() => setIsPlaying(!isPlaying)} className="text-slate-400 hover:text-white transition-colors">
               {isPlaying ? (
                 <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
               ) : (
                 <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
               )}
             </button>
             <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">
                Scene {currentScene + 1} / {SCENES.length}
             </div>
          </div>
          <div className="px-2 py-0.5 bg-indigo-500/10 rounded-full border border-indigo-500/20">
             <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest">Narrator: Kore</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MergeSortVideo;
