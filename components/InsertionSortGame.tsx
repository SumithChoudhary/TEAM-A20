
import React, { useState, useEffect } from 'react';
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

interface InsertionSortGameProps {
  difficulty: number;
  onComplete: (score: number, time: number, wrongMoves: number) => void;
  onExplain: (msg: string) => void;
}

const InsertionSortGame: React.FC<InsertionSortGameProps> = ({ difficulty, onComplete, onExplain }) => {
  const arraySize = 5 + (difficulty * 1);
  const [state, setState] = useState<GameState>(() => ({
    array: generateRandomArray(arraySize, 5, 40 + difficulty * 10),
    currentIndex: 1, // Start with the second element
    compareCount: 0,
    swapCount: 0,
    wrongMoves: 0,
    isComplete: false,
    timer: 0
  }));

  const [pickedValue, setPickedValue] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!state.isComplete) {
        setState(prev => ({ ...prev, timer: prev.timer + 1 }));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [state.isComplete]);

  const handlePick = () => {
    if (pickedValue !== null || state.isComplete) return;
    setPickedValue(state.array[state.currentIndex]);
    onExplain(`You've picked ${state.array[state.currentIndex]}. Now, where does it fit in the sorted portion on the left?`);
  };

  const handleDropAt = async (targetIdx: number) => {
    if (pickedValue === null) return;

    const currentVal = pickedValue;
    const sortedSubArray = state.array.slice(0, state.currentIndex);
    
    // Find where the element SHOULD go
    let correctIdx = 0;
    while (correctIdx < state.currentIndex && sortedSubArray[correctIdx] < currentVal) {
      correctIdx++;
    }

    if (targetIdx === correctIdx) {
      // Correct Move
      const newArray = [...state.array];
      // Remove element from current position
      newArray.splice(state.currentIndex, 1);
      // Insert at target position
      newArray.splice(targetIdx, 0, currentVal);

      const isLastStep = state.currentIndex === state.array.length - 1;
      
      setState(prev => ({
        ...prev,
        array: newArray,
        compareCount: prev.compareCount + (state.currentIndex - targetIdx + 1),
        swapCount: prev.swapCount + 1,
        currentIndex: prev.currentIndex + 1,
        isComplete: isLastStep
      }));

      const explanation = await getStepExplanation(
        AlgorithmType.INSERTION,
        newArray,
        state.currentIndex,
        targetIdx,
        'swap'
      );
      onExplain(explanation);

      if (isLastStep) {
        onComplete(100, state.timer, state.wrongMoves);
      }
    } else {
      // Wrong Move
      setState(prev => ({ ...prev, wrongMoves: prev.wrongMoves + 1 }));
      const hint = await getPersonalizedHint(
        AlgorithmType.INSERTION,
        `Student tried to drop value ${currentVal} into index ${targetIdx} in the sorted portion, but it doesn't maintain ascending order.`,
        state.array
      );
      onExplain(hint);
    }
    
    setPickedValue(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center text-sm font-semibold uppercase tracking-wider text-slate-400">
        <div className="flex gap-6">
          <span>Lvl: <span className="text-emerald-400">{difficulty}</span></span>
          <span>Mistakes: <span className="text-rose-400">{state.wrongMoves}</span></span>
        </div>
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-indigo-300 font-mono">{state.timer}s</span>
        </div>
      </div>

      <div className="flex justify-center items-end h-72 gap-2 px-4 bg-slate-900/50 rounded-2xl border border-slate-700/50 relative overflow-visible pt-12">
        {state.array.map((val, idx) => {
          const isSorted = idx < state.currentIndex;
          const isCurrent = idx === state.currentIndex && pickedValue === null;
          const isBeingInserted = pickedValue !== null && idx === state.currentIndex;

          return (
            <React.Fragment key={idx}>
              {/* Insertion Gaps for Sorted portion */}
              {isSorted && (
                <button
                  onClick={() => handleDropAt(idx)}
                  disabled={pickedValue === null}
                  className={`w-4 h-full flex items-center justify-center transition-all group
                    ${pickedValue !== null ? 'hover:bg-indigo-500/20 cursor-pointer' : 'cursor-default opacity-0'}`}
                >
                  <div className="w-1 h-12 bg-indigo-500/40 rounded-full group-hover:h-24 group-hover:bg-indigo-400 transition-all"></div>
                </button>
              )}

              {/* Special gap at the end of sorted sub-array */}
              {idx === state.currentIndex - 1 && (
                <button
                  onClick={() => handleDropAt(state.currentIndex)}
                  disabled={pickedValue === null}
                  className={`w-4 h-full flex items-center justify-center transition-all group
                    ${pickedValue !== null ? 'hover:bg-indigo-500/20 cursor-pointer' : 'cursor-default opacity-0'}`}
                >
                  <div className="w-1 h-12 bg-indigo-500/40 rounded-full group-hover:h-24 group-hover:bg-indigo-400 transition-all"></div>
                </button>
              )}

              <div
                onClick={() => idx === state.currentIndex && handlePick()}
                className={`flex flex-col items-center justify-end relative transition-all duration-300 
                  ${isCurrent ? 'cursor-pointer hover:-translate-y-2' : ''}
                  ${isBeingInserted ? 'opacity-20 grayscale' : ''}`}
                style={{ width: `${Math.min(40, 300 / arraySize)}px` }}
              >
                <div className={`absolute -top-8 font-bold text-xs ${isCurrent ? 'text-indigo-400' : 'text-slate-500'}`}>
                  {val}
                </div>
                <div 
                  className={`w-full rounded-t-lg transition-all duration-500 shadow-xl
                    ${isSorted ? 'bg-emerald-500/80 shadow-emerald-500/20' : 
                      isCurrent ? 'bg-indigo-500 animate-pulse shadow-indigo-500/30 border-2 border-white/20' : 
                      'bg-slate-700 opacity-60'}`}
                  style={{ height: `${val * (200 / (40 + difficulty * 10))}px` }}
                >
                  <div className="w-full h-full bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      <div className="text-center text-slate-400 text-sm h-12 flex items-center justify-center">
        {state.isComplete ? (
          <div className="text-emerald-400 font-bold animate-bounce text-lg">
            Insertion Mastered (Lvl {difficulty})! +500 XP
          </div>
        ) : pickedValue !== null ? (
          <p className="animate-pulse">Click a <span className="text-indigo-400 font-bold">vertical gap</span> to drop <span className="font-mono text-white bg-slate-700 px-2 rounded">{pickedValue}</span> into its place.</p>
        ) : (
          <p>Click the <span className="text-indigo-400 font-bold underline">pulsing bar</span> to pick it up for insertion.</p>
        )}
      </div>
    </div>
  );
};

export default InsertionSortGame;
