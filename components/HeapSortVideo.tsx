
import React, { useState, useEffect } from 'react';

const SCENES = [
  {
    title: "Binary Heap Structure",
    narration: "Heap Sort uses a binary heap data structure. Think of it like a pyramid where the parent is always the strongest.",
    duration: 6000
  },
  {
    title: "Step 1: Building Max-Heap",
    narration: "We arrange the elements so that every parent node is greater than its children. This is called 'Heapifying'.",
    duration: 10000
  },
  {
    title: "Step 2: Root Extraction",
    narration: "The largest element is now at the root. We swap it with the last leaf and remove it from the heap.",
    duration: 10000
  },
  {
    title: "Step 3: Re-Heapify",
    narration: "The new root might violate the max-heap rule. We push it down until the largest element rises to the top again.",
    duration: 10000
  },
  {
    title: "Consistent O(n log n)",
    narration: "Heap Sort is reliable. It always takes O(n log n) time, regardless of how messy the input data is.",
    duration: 10000
  },
  {
    title: "Summary",
    narration: "An in-place algorithm that doesn't need extra space. Perfect for mission-critical systems where stability matters!",
    duration: 9000
  }
];

const HeapSortVideo: React.FC = () => {
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
          <svg width="200" height="150" viewBox="0 0 200 150">
            <line x1="100" y1="30" x2="60" y2="80" stroke="#475569" strokeWidth="2" />
            <line x1="100" y1="30" x2="140" y2="80" stroke="#475569" strokeWidth="2" />
            <circle cx="100" cy="30" r="15" fill="#4f46e5" />
            <circle cx="60" cy="80" r="12" fill="#1e293b" stroke="#475569" />
            <circle cx="140" cy="80" r="12" fill="#1e293b" stroke="#475569" />
          </svg>
        );
      case 2:
        return (
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-indigo-500 flex items-center justify-center text-white font-black text-xl animate-in slide-out-to-top-10 duration-1000">MAX</div>
            <div className="flex gap-2">
               {[10, 20, 30].map((v, i) => <div key={i} className="w-8 h-8 rounded-lg bg-emerald-500"></div>)}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="flex flex-col items-center gap-2">
            <div className="text-3xl font-black text-indigo-400">n log n</div>
            <div className="w-40 h-2 bg-slate-800 rounded-full overflow-hidden">
               <div className="h-full bg-indigo-500 w-full animate-pulse"></div>
            </div>
          </div>
        );
      default:
        return <div className="text-indigo-400 font-black">Heap Sort</div>;
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

export default HeapSortVideo;
