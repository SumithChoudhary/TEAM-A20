
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

interface SelectionSortGameProps {
  difficulty: number;
  onComplete: (score: number, time: number, wrongMoves: number) => void;
  onExplain: (msg: string) => void;
}

const SelectionSortGame: React.FC<SelectionSortGameProps> = ({ difficulty, onComplete, onExplain }) => {
  const arraySize = 5 + (difficulty * 1);
  const [state, setState] = useState<GameState>(() => ({
    array: generateRandomArray(arraySize, 5, 35 + difficulty * 5),
    currentIndex: 0, // In Selection Sort, this represents the start of the unsorted portion
    compareCount: 0,
    swapCount: 0,
    wrongMoves: 0,
    isComplete: false,
    timer: 0
  }));

  useEffect(() => {
    const interval = setInterval(() => {
      if (!state.isComplete) {
        setState(prev => ({ ...prev, timer: prev.timer + 1 }));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [state.isComplete]);

  const handleElementClick = async (clickedIdx: number) => {
    if (state.isComplete) return;

    // Rule: User must click on the minimum element in the range [currentIndex...end]
    if (clickedIdx < state.currentIndex) {
      onExplain("That element is already sorted! Look at the unsorted portion on the right.");
      return;
    }

    const unsortedPart = state.array.slice(state.currentIndex);
    const minValue = Math.min(...unsortedPart);
    const clickedValue = state.array[clickedIdx];

    if (clickedValue === minValue) {
      // Correct! Swap clickedIdx with state.currentIndex
      const newArray = [...state.array];
      const temp = newArray[state.currentIndex];
      newArray[state.currentIndex] = newArray[clickedIdx];
      newArray[clickedIdx] = temp;

      const isLastStep = state.currentIndex === state.array.length - 2;

      setState(prev => ({
        ...prev,
        array: newArray,
        swapCount: prev.swapCount + 1,
        currentIndex: prev.currentIndex + 1,
        isComplete: isLastStep
      }));

      const explanation = await getStepExplanation(
        AlgorithmType.SELECTION,
        newArray,
        clickedIdx,
        state.currentIndex,
        'swap'
      );
      onExplain(explanation);

      if (isLastStep) {
        onComplete(100, state.timer, state.wrongMoves);
      }
    } else {
      // Wrong move
      setState(prev => ({ ...prev, wrongMoves: prev.wrongMoves + 1 }));
      const hint = await getPersonalizedHint(
        AlgorithmType.SELECTION,
        `Student clicked element ${clickedValue} at index ${clickedIdx}, but it's not the minimum element in the unsorted range starting at ${state.currentIndex}.`,
        state.array
      );
      onExplain(hint);
    }
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

      <div className="flex justify-center items-end h-64 gap-4 px-4 bg-slate-900/50 rounded-2xl border border-slate-700/50 relative overflow-hidden">
        {state.array.map((val, idx) => {
          const isSorted = idx < state.currentIndex;
          const isTarget = idx === state.currentIndex;
          const isUnsorted = idx >= state.currentIndex;

          return (
            <button
              key={idx}
              onClick={() => handleElementClick(idx)}
              className={`group relative transition-all duration-300 flex flex-col items-center justify-end
                ${isUnsorted ? 'hover:-translate-y-2' : 'cursor-default'}`}
              style={{ width: `${Math.min(40, 350 / arraySize)}px` }}
            >
              <div className={`absolute -top-10 font-bold ${isTarget ? 'text-indigo-400' : 'text-slate-400'} group-hover:text-white transition-colors`}>
                {val}
              </div>
              
              <div 
                className={`w-full rounded-t-lg transition-all duration-500 shadow-xl
                  ${isSorted ? 'bg-emerald-500/80 shadow-emerald-500/20' : 
                    isTarget ? 'bg-indigo-600 shadow-indigo-500/30 border-2 border-indigo-400/50' : 
                    'bg-slate-600 shadow-slate-900'}`}
                style={{ height: `${val * (180 / (35 + difficulty * 5))}px` }}
              >
                <div className="w-full h-full bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>

              {isTarget && !state.isComplete && (
                <div className="absolute -bottom-8 flex flex-col items-center">
                   <svg className="w-4 h-4 text-indigo-500 animate-bounce" fill="currentColor" viewBox="0 0 20 20">
                     <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                   </svg>
                   <span className="text-[8px] font-bold text-indigo-500 uppercase">Target</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="text-center text-slate-400 text-sm min-h-[40px]">
        {state.isComplete ? (
          <div className="text-emerald-400 font-bold animate-bounce text-lg">
            Selection Sort Mastered (Lvl {difficulty})! +500 XP
          </div>
        ) : (
          <p>Find the <span className="text-white font-bold">minimum element</span> in the gray area and click it to swap into the <span className="text-indigo-400 font-bold">Target position</span>.</p>
        )}
      </div>
    </div>
  );
};

export default SelectionSortGame;
