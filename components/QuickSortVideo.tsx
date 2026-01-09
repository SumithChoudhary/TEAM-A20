
import React, { useState, useEffect } from 'react';

const SCENES = [
  {
    title: "Pivot Power",
    narration: "Quick Sort is a Divide and Conquer algorithm. It starts by picking a 'Pivot' element.",
    duration: 6000
  },
  {
    title: "Step 1: Partitioning",
    narration: "We rearrange the array so that everything smaller than the pivot goes to its left, and everything larger goes to its right.",
    duration: 10000
  },
  {
    title: "Step 2: Pivot is Home",
    narration: "After partitioning, the pivot is in its final sorted position. It never needs to move again!",
    duration: 10000
  },
  {
    title: "Step 3: Recursion",
    narration: "We then repeat the process for the left and right sub-arrays until the whole list is sorted.",
    duration: 10000
  },
  {
    title: "Fast: O(n log n)",
    narration: "Because it halves the problem space each time, Quick Sort is incredibly efficient on average.",
    duration: 10000
  },
  {
    title: "Summary",
    narration: "It's the preferred choice for many systems due to its speed and low memory usage. Ready to partition?",
    duration: 9000
  }
];

const QuickSortVideo: React.FC = () => {
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
        setProgress(Math.min((elapsed / sceneDuration) * 100, 100));
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
      case 0:
        return (
          <div className="flex gap-4 items-end">
            <div className="w-10 h-16 bg-slate-700 rounded-t-lg"></div>
            <div className="w-12 h-20 bg-indigo-500 rounded-t-lg ring-4 ring-white animate-pulse"></div>
            <div className="w-10 h-24 bg-slate-700 rounded-t-lg"></div>
          </div>
        );
      case 1:
        return (
          <div className="flex gap-4 items-center">
            <div className="flex flex-col items-center gap-1 animate-in slide-in-from-right-10 duration-1000">
               <div className="w-8 h-12 bg-blue-500 rounded"></div>
               <span className="text-[8px] text-blue-400 font-bold">SMALLER</span>
            </div>
            <div className="w-12 h-20 bg-indigo-500 rounded-t-lg"></div>
            <div className="flex flex-col items-center gap-1 animate-in slide-in-from-left-10 duration-1000">
               <div className="w-8 h-24 bg-rose-500 rounded"></div>
               <span className="text-[8px] text-rose-400 font-bold">LARGER</span>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="flex gap-4 items-end">
            <div className="w-10 h-12 bg-slate-700 rounded-t-lg opacity-40"></div>
            <div className="w-12 h-20 bg-emerald-500 rounded-t-lg shadow-xl shadow-emerald-500/20"></div>
            <div className="w-10 h-24 bg-slate-700 rounded-t-lg opacity-40"></div>
          </div>
        );
      case 4:
        return (
          <div className="relative flex flex-col items-center gap-2">
             <div className="text-3xl font-black text-indigo-400">n log n</div>
             <div className="flex gap-1 h-20 items-end">
                {Array.from({length: 8}).map((_, i) => <div key={i} className="w-2 bg-indigo-500/40 rounded-t-sm" style={{height: `${(i+1)*10}%`}}></div>)}
             </div>
          </div>
        );
      default:
        return <div className="text-indigo-500 font-black">Quick Sort</div>;
    }
  };

  return (
    <div className="w-full h-full bg-slate-950 rounded-2xl flex flex-col relative overflow-hidden group border border-slate-800 shadow-2xl">
      {!isPlaying && currentScene === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm z-30 transition-all">
          <button onClick={() => setIsPlaying(true)} className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all shadow-2xl">
            <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          </button>
        </div>
      )}
      <div className="flex-1 flex flex-col items-center justify-center p-8 gap-8 min-h-[200px]">
        <div className="h-40 flex items-center justify-center w-full">{renderVisuals()}</div>
        <div className="text-center max-w-sm">
          <h4 className="text-indigo-400 text-[9px] font-black uppercase tracking-[0.2em] mb-2">{SCENES[currentScene].title}</h4>
          <p className="text-slate-300 text-xs font-medium leading-relaxed h-12 transition-all duration-500">{SCENES[currentScene].narration}</p>
        </div>
      </div>
      <div className="bg-slate-900/80 backdrop-blur-md p-4 flex flex-col gap-3 border-t border-slate-800">
        <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
          <div className="h-full bg-indigo-500 transition-all duration-100 ease-linear" style={{ width: isPlaying ? `${progress}%` : '0%' }}></div>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsPlaying(!isPlaying)} className="text-slate-400 hover:text-white transition-colors">
              {isPlaying ? <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg> : <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>}
            </button>
            <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Scene {currentScene + 1} / {SCENES.length}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickSortVideo;
