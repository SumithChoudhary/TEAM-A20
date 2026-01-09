
import React, { useState, useEffect } from 'react';
import { AlgorithmType } from '../types';
import { getStepExplanation, getPersonalizedHint } from '../services/geminiService';

const generateRandomArray = (size: number, min: number, max: number) => {
  const arr: number[] = [];
  while (arr.length < size) {
    const r = Math.floor(Math.random() * (max - min + 1)) + min;
    if (arr.indexOf(r) === -1) arr.push(r);
  }
  return arr;
};

interface QuickSortGameProps {
  difficulty: number;
  onComplete: (score: number, time: number, wrongMoves: number) => void;
  onExplain: (msg: string) => void;
}

const QuickSortGame: React.FC<QuickSortGameProps> = ({ difficulty, onComplete, onExplain }) => {
  const arraySize = 6 + (difficulty * 1);
  const [timer, setTimer] = useState(0);
  const [wrongMoves, setWrongMoves] = useState(0);
  const [activeArray, setActiveArray] = useState<number[]>(() => generateRandomArray(arraySize, 5, 99));
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);
  const [phase, setPhase] = useState<'PICK_PIVOT' | 'PARTITION'>('PICK_PIVOT');
  const [pivotIdx, setPivotIdx] = useState<number | null>(null);
  const [leftPartition, setLeftPartition] = useState<number[]>([]);
  const [rightPartition, setRightPartition] = useState<number[]>([]);
  const [toPartition, setToPartition] = useState<number[]>([]);
  const [stack, setStack] = useState<{low: number, high: number}[]>([{low: 0, high: arraySize - 1}]);
  const [currentRange, setCurrentRange] = useState({low: 0, high: arraySize - 1});

  useEffect(() => {
    const interval = setInterval(() => setTimer(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const handlePivotSelect = (idx: number) => {
    if (phase !== 'PICK_PIVOT') return;
    if (idx < currentRange.low || idx > currentRange.high) return;

    setPivotIdx(idx);
    setPhase('PARTITION');
    const pivotVal = activeArray[idx];
    const remaining = [];
    for (let i = currentRange.low; i <= currentRange.high; i++) {
      if (i !== idx) remaining.push(activeArray[i]);
    }
    setToPartition(remaining);
    onExplain(`Pivot ${pivotVal} selected. Now move elements smaller than ${pivotVal} to the Left, and larger to the Right.`);
  };

  const handlePartitionMove = async (target: 'LEFT' | 'RIGHT') => {
    if (toPartition.length === 0 || pivotIdx === null) return;

    const currentVal = toPartition[0];
    const pivotVal = activeArray[pivotIdx];
    const isSmaller = currentVal < pivotVal;
    const isCorrect = (target === 'LEFT' && isSmaller) || (target === 'RIGHT' && !isSmaller);

    if (isCorrect) {
      if (target === 'LEFT') setLeftPartition(prev => [...prev, currentVal]);
      else setRightPartition(prev => [...prev, currentVal]);
      setToPartition(prev => prev.slice(1));
      
      if (toPartition.length === 1) {
        completePartitionStep(target === 'LEFT' ? [...leftPartition, currentVal] : leftPartition, 
                               target === 'RIGHT' ? [...rightPartition, currentVal] : rightPartition);
      }
    } else {
      setWrongMoves(w => w + 1);
      // Ritch state context for AI
      const context = `User tried to put ${currentVal} in the ${target} partition, but the pivot is ${pivotVal}. Is ${currentVal} ${target === 'LEFT' ? 'smaller' : 'larger'} than ${pivotVal}? Explain why this move violates the Quick Sort partition property.`;
      const hint = await getPersonalizedHint(AlgorithmType.QUICK, context, activeArray);
      onExplain(hint);
    }
  };

  const completePartitionStep = (finalLeft: number[], finalRight: number[]) => {
    const pivotVal = activeArray[pivotIdx!];
    const newArray = [...activeArray];
    const startIdx = currentRange.low;
    
    let currentPos = startIdx;
    finalLeft.forEach(v => newArray[currentPos++] = v);
    const pivotFinalPos = currentPos;
    newArray[currentPos++] = pivotVal;
    finalRight.forEach(v => newArray[currentPos++] = v);

    setActiveArray(newArray);
    setSortedIndices(prev => [...prev, pivotFinalPos]);
    setPhase('PICK_PIVOT');
    setPivotIdx(null);
    setLeftPartition([]);
    setRightPartition([]);
    
    const newStack = [...stack.slice(1)];
    if (pivotFinalPos + 1 < currentRange.high) newStack.push({low: pivotFinalPos + 1, high: currentRange.high});
    else if (pivotFinalPos + 1 === currentRange.high) setSortedIndices(prev => [...prev, currentRange.high]);
    
    if (startIdx < pivotFinalPos - 1) newStack.push({low: startIdx, high: pivotFinalPos - 1});
    else if (startIdx === pivotFinalPos - 1) setSortedIndices(prev => [...prev, startIdx]);

    if (newStack.length === 0) {
      onComplete(100, timer, wrongMoves);
    } else {
      setStack(newStack);
      setCurrentRange(newStack[newStack.length - 1]);
    }
  };

  return (
    <div className="space-y-8 flex flex-col items-center">
      <div className="w-full flex justify-between text-[10px] font-black tracking-widest uppercase text-slate-500">
        <div className="flex gap-4">
          <span className="text-emerald-400">LVL: {difficulty}</span>
          <span className="text-amber-500">Errors: {wrongMoves}</span>
          <span className="text-indigo-400">Timer: {timer}s</span>
        </div>
        <div className="bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full border border-indigo-500/20">Stack Depth: {stack.length}</div>
      </div>

      <div className="w-full bg-slate-900/40 rounded-[3rem] border border-white/5 p-12 flex flex-col items-center gap-10 min-h-[450px] shadow-2xl hover:border-indigo-500/30 transition-all duration-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none"></div>
        
        <div className="flex items-end gap-2 h-48 relative z-10">
          {activeArray.map((val, idx) => {
            const isInRange = idx >= currentRange.low && idx <= currentRange.high;
            const isSorted = sortedIndices.includes(idx);
            const isPivot = idx === pivotIdx;

            return (
              <div
                key={idx}
                onClick={() => isInRange && phase === 'PICK_PIVOT' && handlePivotSelect(idx)}
                className={`flex flex-col items-center justify-end relative transition-all duration-500
                  ${isInRange && phase === 'PICK_PIVOT' ? 'cursor-pointer hover:-translate-y-4 scale-105' : ''}
                  ${!isInRange && !isSorted ? 'opacity-20 grayscale' : ''}`}
                style={{ width: `${Math.min(45, 450 / arraySize)}px` }}
              >
                <div className={`absolute -top-7 font-mono font-black text-[10px] transition-colors ${isPivot ? 'text-indigo-400' : 'text-slate-500'}`}>
                  {val}
                </div>
                <div 
                  className={`w-full rounded-t-xl transition-all duration-700 shadow-2xl relative overflow-hidden
                    ${isSorted ? 'bg-emerald-500 shadow-emerald-500/20' : 
                      isPivot ? 'bg-indigo-600 ring-4 ring-indigo-500/20 shadow-indigo-500/30' : 
                      isInRange ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-800'}`}
                  style={{ height: `${val * 1.8}px` }}
                >
                   {isInRange && <div className="absolute inset-0 bg-white/5 animate-pulse"></div>}
                </div>
              </div>
            );
          })}
        </div>

        <div className="w-full max-w-xl relative z-10">
          {phase === 'PICK_PIVOT' ? (
             <div className="text-center p-6 bg-indigo-500/5 rounded-3xl border border-dashed border-indigo-500/30 animate-pulse">
                <span className="text-indigo-400 font-black uppercase text-xs tracking-[0.3em]">Strategy: Choose a pivot from the active segment</span>
             </div>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-slate-950/50 p-6 rounded-[2.5rem] border border-white/5 gap-6 shadow-2xl">
                <div className="flex flex-col items-center gap-3 flex-1">
                   <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">Smaller Partition</span>
                   <button onClick={() => handlePartitionMove('LEFT')} className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-xl shadow-blue-600/20 active:scale-95 transition-all">Move Left</button>
                </div>

                <div className="flex flex-col items-center px-6 relative">
                   <div className="absolute -top-8 text-[9px] font-black text-slate-500 uppercase tracking-widest">Active Head</div>
                   <div className="w-16 h-16 bg-slate-800 rounded-3xl flex items-center justify-center text-xl font-black text-white border-2 border-indigo-500 shadow-2xl shadow-indigo-500/20 animate-in zoom-in-75">
                      {toPartition[0]}
                   </div>
                </div>

                <div className="flex flex-col items-center gap-3 flex-1">
                   <span className="text-[10px] font-black text-rose-400 uppercase tracking-[0.3em]">Larger Partition</span>
                   <button onClick={() => handlePartitionMove('RIGHT')} className="w-full py-4 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-xl shadow-rose-600/20 active:scale-95 transition-all">Move Right</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuickSortGame;
