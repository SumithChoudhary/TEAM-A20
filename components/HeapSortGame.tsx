
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

interface HeapSortGameProps {
  difficulty: number;
  onComplete: (score: number, time: number, wrongMoves: number) => void;
  onExplain: (msg: string) => void;
}

const HeapSortGame: React.FC<HeapSortGameProps> = ({ difficulty, onComplete, onExplain }) => {
  const arraySize = 5 + (difficulty * 1);
  const [array, setArray] = useState<number[]>(() => generateRandomArray(arraySize, 2, 25 + difficulty * 5));
  const [heapSize, setHeapSize] = useState(arraySize);
  const [timer, setTimer] = useState(0);
  const [wrongMoves, setWrongMoves] = useState(0);
  const [phase, setPhase] = useState<'BUILD_HEAP' | 'SORT'>('BUILD_HEAP');
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setTimer(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const getParent = (i: number) => Math.floor((i - 1) / 2);
  const getLeft = (i: number) => 2 * i + 1;
  const getRight = (i: number) => 2 * i + 2;

  const handleNodeClick = async (idx: number) => {
    if (isAnimating) return;

    if (phase === 'BUILD_HEAP') {
      const parent = getParent(idx);
      if (idx === 0) {
        const isMaxHeap = checkMaxHeap(array, heapSize);
        if (isMaxHeap) {
          setPhase('SORT');
          onExplain("Max-Heap built! Now, swap the root with the last element of the heap to sort.");
        } else {
          setWrongMoves(w => w + 1);
          const hint = await getPersonalizedHint(AlgorithmType.HEAP, "The user clicked the root to proceed to sorting, but the tree is not yet a Max-Heap. Some nodes violate the parent ≥ child property. Explain why proceeding now would break the algorithm.", array);
          onExplain(hint);
        }
        return;
      }

      const pVal = array[parent];
      const iVal = array[idx];

      if (iVal > pVal) {
        setIsAnimating(true);
        const newArr = [...array];
        newArr[parent] = iVal;
        newArr[idx] = pVal;
        setArray(newArr);
        setTimeout(() => setIsAnimating(false), 300);
        onExplain(`Swapped ${iVal} up! Max-heap property: Parent must be >= children.`);
      } else {
        setWrongMoves(w => w + 1);
        const hint = await getPersonalizedHint(AlgorithmType.HEAP, `The user clicked child node ${iVal} at index ${idx} to swap with parent ${pVal} at index ${parent}. However, ${iVal} is not larger than ${pVal}. In a Max-Heap, should we swap elements if the child is already smaller than the parent?`, array);
        onExplain(hint);
      }
    } else {
      if (idx === 0) {
        setIsAnimating(true);
        const newArr = [...array];
        const lastIdx = heapSize - 1;
        [newArr[0], newArr[lastIdx]] = [newArr[lastIdx], newArr[0]];
        setArray(newArr);
        setHeapSize(h => h - 1);
        
        if (heapSize === 2) {
          onComplete(100, timer, wrongMoves);
        } else {
          onExplain("Extracted max! Now re-heapify the remaining elements to find the next largest.");
          setTimeout(() => setIsAnimating(false), 500);
        }
      } else {
        setWrongMoves(w => w + 1);
        const hint = await getPersonalizedHint(AlgorithmType.HEAP, `During the SORT phase, the user clicked element ${array[idx]} at index ${idx} instead of the root (index 0). Explain why we must always extract from the root in Heap Sort.`, array);
        onExplain(hint);
      }
    }
  };

  const checkMaxHeap = (arr: number[], size: number) => {
    for (let i = 0; i < Math.floor(size / 2); i++) {
      const left = getLeft(i);
      const right = getRight(i);
      if (left < size && arr[i] < arr[left]) return false;
      if (right < size && arr[i] < arr[right]) return false;
    }
    return true;
  };

  const renderTree = (idx: number, x: number, y: number, level: number) => {
    if (idx >= arraySize) return null;
    const val = array[idx];
    const isSorted = idx >= heapSize;
    const left = getLeft(idx);
    const right = getRight(idx);

    return (
      <React.Fragment key={idx}>
        {left < arraySize && (
          <line x1={x} y1={y} x2={x - 100 / (level + 0.5)} y2={y + 60} stroke="#475569" strokeWidth="2" />
        )}
        {right < arraySize && (
          <line x1={x} y1={y} x2={x + 100 / (level + 0.5)} y2={y + 60} stroke="#475569" strokeWidth="2" />
        )}
        
        <g onClick={() => handleNodeClick(idx)} className="cursor-pointer group">
          <circle cx={x} cy={y} r="20" className={`transition-all duration-300 ${isSorted ? 'fill-emerald-500 shadow-lg' : idx === 0 ? 'fill-indigo-600 stroke-indigo-400 stroke-2' : 'fill-slate-800 stroke-slate-600'}`} />
          <text x={x} y={y + 5} textAnchor="middle" className="fill-white font-mono font-bold text-[10px] pointer-events-none">{val}</text>
        </g>

        {renderTree(left, x - 100 / (level + 0.5), y + 60, level + 1)}
        {renderTree(right, x + 100 / (level + 0.5), y + 60, level + 1)}
      </React.Fragment>
    );
  };

  return (
    <div className="space-y-6 flex flex-col items-center">
      <div className="w-full flex justify-between text-[10px] font-black tracking-widest uppercase text-slate-500">
        <div className="flex gap-4">
          <span className="text-emerald-400">LVL: {difficulty}</span>
          <span className="text-amber-500">Errors: {wrongMoves}</span>
          <span className="text-indigo-400">Time: {timer}s</span>
        </div>
        <span>{phase}</span>
      </div>

      <div className="w-full bg-slate-900/60 rounded-3xl border border-slate-700/30 p-4 flex flex-col items-center min-h-[350px]">
        <svg width="400" height="280" viewBox="0 0 400 280">
           {renderTree(0, 200, 40, 1)}
        </svg>

        <div className="mt-4 flex flex-wrap justify-center gap-2">
           {array.map((v, i) => (
             <div key={i} className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold font-mono text-[10px] transition-all border-b-2
                ${i >= heapSize ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
                {v}
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default HeapSortGame;
