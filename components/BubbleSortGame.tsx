
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameState, AlgorithmType } from '../types';
import { getStepExplanation, getPersonalizedHint } from '../services/geminiService';

const generateRandomArray = (size: number, min: number, max: number) => {
  const arr: number[] = [];
  while (arr.length < size) {
    const r = Math.floor(Math.random() * (max - min + 1)) + min;
    if (arr.indexOf(r) === -1) arr.push(r);
  }
  return arr;
};

interface BubbleSortGameProps {
  difficulty: number;
  onComplete: (score: number, time: number, wrongMoves: number) => void;
  onExplain: (msg: string) => void;
}

const BubbleSortGame: React.FC<BubbleSortGameProps> = ({ difficulty, onComplete, onExplain }) => {
  const arraySize = Math.max(2, 5 + (difficulty * 1));
  const [state, setState] = useState<GameState>(() => ({
    array: generateRandomArray(arraySize, 5, 25 + difficulty * 5),
    currentIndex: 0,
    compareCount: 0,
    swapCount: 0,
    wrongMoves: 0,
    isComplete: false,
    timer: 0
  }));

  const [pass, setPass] = useState(0);
  const [swappedInPass, setSwappedInPass] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [systemError, setSystemError] = useState<string | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playTone = (freq: number, type: OscillatorType = 'sine', duration: number = 0.1, volume: number = 0.1) => {
    try {
      if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn("Audio Context failure suppressed.");
    }
  };

  const playSuccessFlourish = () => {
    const tones = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    tones.forEach((freq, i) => {
      setTimeout(() => playTone(freq, 'sine', 0.4, 0.05), i * 150);
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (!state.isComplete && !systemError) setState(prev => ({ ...prev, timer: prev.timer + 1 }));
    }, 1000);
    return () => clearInterval(interval);
  }, [state.isComplete, systemError]);

  const handleDecision = useCallback(async (decision: 'swap' | 'keep') => {
    // 1. Core State Safety Check
    if (state.isComplete || isAnimating || systemError) return;
    
    try {
      const i = state.currentIndex;
      
      // 2. Boundary Integrity Check
      if (i < 0 || i >= state.array.length - 1) {
        console.error("Index corruption detected in Bubble Sort Arena.");
        setSystemError("Pointer out of bounds. Attempting emergency sync...");
        setTimeout(() => {
          setState(prev => ({ ...prev, currentIndex: 0 }));
          setSystemError(null);
        }, 1500);
        return;
      }

      const val1 = state.array[i];
      const val2 = state.array[i + 1];

      // 3. Value Validation
      if (val1 === undefined || val2 === undefined) {
        throw new Error("Missing data segment at target indices.");
      }

      const shouldSwap = val1 > val2;
      const isCorrect = (decision === 'swap' && shouldSwap) || (decision === 'keep' && !shouldSwap);

      if (isCorrect) {
        setIsAnimating(true);
        if (decision === 'swap') {
          // Tactical swap sound: Mid-range triangle for "mechanical" feel
          playTone(523.25, 'triangle', 0.15, 0.04); 
          setSwappedInPass(true);
        } else {
          // Subtle comparison "ok" sound: High-pitch sine, very short
          playTone(987.77, 'sine', 0.08, 0.02);
        }
        
        const newArray = [...state.array];
        if (decision === 'swap') [newArray[i], newArray[i + 1]] = [newArray[i + 1], newArray[i]];

        // Contextual AI Explanation (Non-blocking)
        getStepExplanation(AlgorithmType.BUBBLE, newArray, i, i + 1, decision === 'swap' ? 'swap' : 'compare')
          .then(onExplain)
          .catch(e => console.warn("AI Narrative Stream Interrupted. Continuing Simulation."));

        // Animation Delay + Next Step Logic
        setTimeout(() => {
          const nextIndex = i + 1;
          const maxIndexForPass = state.array.length - 2 - pass;
          
          if (nextIndex > maxIndexForPass) {
            const totalPassesDone = pass + 1;
            const noSwapsThisPass = decision === 'swap' ? false : !swappedInPass;

            if (totalPassesDone >= state.array.length - 1 || noSwapsThisPass) {
              setState(prev => ({ 
                ...prev, 
                array: newArray, 
                isComplete: true,
                currentIndex: -1
              }));
              playSuccessFlourish();
              onComplete(100, state.timer, state.wrongMoves);
              if (noSwapsThisPass && totalPassesDone < state.array.length - 1) {
                onExplain("Early termination protocol activated: No swaps detected. Array verified sorted.");
              }
            } else {
              setPass(p => p + 1);
              setSwappedInPass(false);
              setState(prev => ({ ...prev, array: newArray, currentIndex: 0 }));
            }
          } else {
            setState(prev => ({ ...prev, array: newArray, currentIndex: nextIndex }));
          }
          setIsAnimating(false);
        }, 200);
      } else {
        // Handle Wrong Move with dissonant buzz
        playTone(92.50, 'sawtooth', 0.4, 0.06); 
        setState(prev => ({ ...prev, wrongMoves: prev.wrongMoves + 1 }));
        const errorMsg = decision === 'swap' 
          ? `Improper swap operation at indices ${i} & ${i+1}: ${val1} and ${val2} are already ordered.` 
          : `Failed to execute required swap: ${val1} at index ${i} is greater than ${val2} at index ${i+1}.`;
        
        getPersonalizedHint(AlgorithmType.BUBBLE, errorMsg, state.array)
          .then(onExplain)
          .catch(() => onExplain("Review the adjacent comparison rule. Larger elements must move right."));
      }
    } catch (err) {
      console.error("Critical simulation failure:", err);
      setSystemError("Neural link failure. Recovering sequence...");
      setTimeout(() => setSystemError(null), 2000);
    }
  }, [state, isAnimating, pass, swappedInPass, onComplete, onExplain, systemError]);

  return (
    <div className="space-y-12 relative">
      {/* Simulation HUD */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Pass Cycle', val: `#${pass + 1}`, color: 'text-indigo-400' },
          { label: 'Complexity', val: difficulty, color: 'text-emerald-400' },
          { label: 'System Errors', val: state.wrongMoves, color: 'text-rose-400' },
          { label: 'Uptime', val: `${state.timer}s`, color: 'text-amber-400' }
        ].map((item, i) => (
          <div key={i} className="glass-card rounded-2xl p-4 border border-white/5 shadow-inner">
            <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest block mb-1">{item.label}</span>
            <span className={`text-xl font-black font-mono ${item.color}`}>{item.val}</span>
          </div>
        ))}
      </div>

      {/* Arena Stage */}
      <div className="h-80 glass-card rounded-[3.5rem] border border-white/5 relative flex items-end justify-center gap-4 px-8 py-16 overflow-hidden shadow-2xl transition-all duration-500 hover:border-indigo-500/20">
        
        {systemError && (
          <div className="absolute inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
             <div className="w-16 h-16 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mb-4"></div>
             <h4 className="text-rose-500 font-black uppercase text-sm tracking-widest mb-1">System Exception Detected</h4>
             <p className="text-slate-500 text-[10px] font-bold uppercase tracking-tighter">{systemError}</p>
          </div>
        )}

        <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-slate-950/50 px-4 py-1.5 rounded-full border border-white/5">
           <div className={`w-2 h-2 rounded-full transition-all duration-500 ${swappedInPass ? 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,1)] animate-pulse' : 'bg-slate-800'}`}></div>
           <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">{swappedInPass ? 'Modification Flag: ACTIVE' : 'Status: Scanning'}</span>
        </div>

        {state.array.map((val, idx) => {
          const isSorted = state.isComplete || idx > state.array.length - 1 - pass;
          const isBeingCompared = idx === state.currentIndex || idx === state.currentIndex + 1;
          
          return (
            <div
              key={idx}
              className={`relative transition-all duration-300 flex flex-col items-center justify-end
                ${isBeingCompared ? 'scale-110 z-10' : 'opacity-30 scale-95 blur-[0.5px]'}
                ${isSorted ? 'opacity-100 blur-0 scale-100' : ''}`}
              style={{ width: `${Math.min(44, 400 / arraySize)}px` }}
            >
              <div className={`absolute -top-10 font-mono font-black transition-all duration-300 
                ${isBeingCompared ? 'text-white text-xs translate-y-[-4px]' : 'text-slate-700 text-[10px]'}`}>
                {val}
              </div>
              <div 
                className={`w-full rounded-full transition-all duration-500 relative overflow-hidden group hover-lift
                  ${isSorted ? 'bg-gradient-to-t from-emerald-600/80 to-emerald-400 border border-emerald-400/30 shadow-[0_0_20px_rgba(16,185,129,0.2)]' : 
                    isBeingCompared ? 'bg-gradient-to-t from-indigo-600 to-indigo-400 shadow-[0_0_30px_rgba(99,102,241,0.4)] border-2 border-white/20' : 
                    'bg-slate-800/80 border border-white/5'}`}
                style={{ height: `${val * (180 / (25 + difficulty * 5))}px` }}
              >
                {isBeingCompared && (
                  <div className="absolute inset-0 bg-white/20 animate-pulse transition-opacity duration-300"></div>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-20deg] animate-scanline"></div>
              </div>
            </div>
          );
        })}

        {/* Tactical Overlay */}
        {!state.isComplete && state.currentIndex !== -1 && !systemError && (
          <div 
            className="absolute bottom-12 h-[240px] bg-indigo-500/5 border-2 border-dashed border-indigo-500/20 rounded-[2.5rem] transition-all duration-500 pointer-events-none"
            style={{ 
              width: `${Math.min(128, 800 / arraySize)}px`, 
              left: `calc(50% - ${(arraySize * (Math.min(44, 400 / arraySize) + 16)) / 2}px + ${state.currentIndex * (Math.min(44, 400 / arraySize) + 16)}px + ${Math.min(22, 200 / arraySize)}px)` 
            }}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-8 bg-indigo-500 text-white text-[8px] font-black px-2 py-1 rounded uppercase tracking-widest shadow-lg">Comparison Target</div>
          </div>
        )}
      </div>

      {/* Control Console */}
      <div className="flex flex-col items-center gap-8">
        {state.isComplete ? (
          <div className="flex flex-col items-center gap-4 animate-in zoom-in duration-700">
            <div className="text-emerald-400 font-black text-4xl tracking-tighter shadow-sm">SIMULATION OPTIMIZED</div>
            <div className="px-6 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] flex items-center gap-2">
               <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_emerald]"></span>
               Mastery Level Synchronization: 100%
            </div>
          </div>
        ) : (
          <div className="flex gap-6 w-full max-w-xl">
            <button
              onClick={() => handleDecision('keep')}
              disabled={isAnimating || !!systemError}
              className="flex-1 py-6 glass-card hover:bg-white/5 text-slate-500 hover:text-white font-black rounded-[1.5rem] transition-all uppercase tracking-[0.3em] text-[10px] active:scale-95 disabled:opacity-30 border border-white/5"
            >
              Maintain Sequence
            </button>
            <button
              onClick={() => handleDecision('swap')}
              disabled={isAnimating || !!systemError}
              className="flex-1 py-6 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-[1.5rem] transition-all uppercase tracking-[0.3em] text-[10px] shadow-2xl shadow-indigo-600/40 active:scale-95 border-t border-white/20 disabled:opacity-30"
            >
              Execute Logic Swap
            </button>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scanline {
          0% { transform: translateX(-100%) skewX(-20deg); }
          100% { transform: translateX(200%) skewX(-20deg); }
        }
        .animate-scanline {
          animation: scanline 4s linear infinite;
        }
      `}} />
    </div>
  );
};

export default BubbleSortGame;
