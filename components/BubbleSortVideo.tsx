
import React, { useState, useEffect } from 'react';

const SCENES = [
  {
    title: "The Bubble Concept",
    narration: "Bubble Sort is the simplest sorting algorithm. It works by repeatedly swapping adjacent elements.",
    duration: 6000
  },
  {
    title: "Step 1: Compare Pairs",
    narration: "We start at the beginning of the array and compare the first two numbers. If the left is bigger than the right, they swap.",
    duration: 10000
  },
  {
    title: "Step 2: Bubbling Up",
    narration: "This continues down the line. Notice how the largest number 'bubbles' up to its final position at the end of each pass.",
    duration: 10000
  },
  {
    title: "Step 3: Repetition",
    narration: "We repeat this process for the remaining unsorted elements. Every pass, one more element finds its home.",
    duration: 10000
  },
  {
    title: "Efficiency: O(n²)",
    narration: "Because we have to check pairs over and over, it takes O(n²) time. It's best for small or nearly sorted lists.",
    duration: 10000
  },
  {
    title: "Summary",
    narration: "Easy to understand, easy to code, but slow for large data. The classic starting point for every student!",
    duration: 9000
  }
];

const BubbleSortVideo: React.FC = () => {
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
          <div className="flex items-center justify-center gap-4">
            <div className="w-16 h-16 rounded-full bg-blue-500/20 border-2 border-blue-400 animate-bounce flex items-center justify-center text-blue-300">○</div>
            <div className="w-20 h-20 rounded-full bg-blue-500/40 border-2 border-blue-400 animate-pulse flex items-center justify-center text-blue-200">○</div>
          </div>
        );
      case 1:
        return (
          <div className="flex gap-4 items-end">
            <div className="w-12 h-24 bg-indigo-500 rounded-t-lg ring-4 ring-white animate-pulse"></div>
            <div className="w-12 h-16 bg-slate-700 rounded-t-lg"></div>
            <div className="w-12 h-20 bg-slate-700 rounded-t-lg"></div>
          </div>
        );
      case 2:
        return (
          <div className="flex gap-4 items-end">
            <div className="w-10 h-12 bg-slate-700 rounded-t-lg"></div>
            <div className="w-10 h-16 bg-slate-700 rounded-t-lg"></div>
            <div className="w-10 h-24 bg-indigo-500 rounded-t-lg translate-x-28 transition-all duration-1000 shadow-xl shadow-indigo-500/40"></div>
          </div>
        );
      case 3:
        return (
          <div className="flex gap-2 items-end">
            {[10, 20, 30, 40, 50].map((h, i) => (
              <div key={i} className={`w-8 bg-emerald-500 rounded-t-lg ${i > 2 ? 'opacity-100' : 'opacity-30'}`} style={{ height: `${h * 2}px` }}></div>
            ))}
          </div>
        );
      case 4:
        return (
          <div className="text-4xl font-black text-rose-500 animate-pulse flex flex-col items-center">
            <span>O(n²)</span>
            <div className="grid grid-cols-4 gap-1 mt-4">
              {Array.from({ length: 16 }).map((_, i) => <div key={i} className="w-3 h-3 bg-rose-500/20 rounded-full"></div>)}
            </div>
          </div>
        );
      default:
        return <div className="text-indigo-400 font-bold text-2xl">Bubble Sort</div>;
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

export default BubbleSortVideo;
