
import React, { useState, useEffect, useRef } from 'react';
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

interface MergeSortGameProps {
  difficulty: number;
  onComplete: (score: number, time: number, wrongMoves: number) => void;
  onExplain: (msg: string) => void;
}

interface MergeNode {
  id: string;
  values: number[];
  leftId?: string;
  rightId?: string;
  isSplit: boolean;
  isMerged: boolean;
  isTarget: boolean;
}

const MergeSortGame: React.FC<MergeSortGameProps> = ({ difficulty, onComplete, onExplain }) => {
  const arraySize = 5 + (difficulty * 1);
  const [nodes, setNodes] = useState<Record<string, MergeNode>>(() => ({
    'root': { 
      id: 'root', 
      values: generateRandomArray(arraySize, 1, 99), 
      isSplit: false, 
      isMerged: false, 
      isTarget: true 
    }
  }));
  const [timer, setTimer] = useState(0);
  const [wrongMoves, setWrongMoves] = useState(0);
  const [currentMerge, setCurrentMerge] = useState<{
    leftNode: string;
    rightNode: string;
    targetNode: string;
    result: number[];
    expected: number[];
  } | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);

  // Sound generator helper
  const playTone = (freq: number, type: OscillatorType = 'sine', duration: number = 0.1, volume: number = 0.1) => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
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
      console.warn("Audio playback failed", e);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => setTimer(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSplit = (id: string) => {
    const node = nodes[id];
    if (!node || node.isSplit || node.values.length <= 1) return;

    playTone(660, 'sine', 0.1, 0.05);
    const mid = Math.floor(node.values.length / 2);
    const leftId = `${id}L`;
    const rightId = `${id}R`;

    const newNodes = { ...nodes };
    newNodes[id] = { ...node, isSplit: true, leftId, rightId, isTarget: false };
    newNodes[leftId] = { id: leftId, values: node.values.slice(0, mid), isSplit: false, isMerged: false, isTarget: true };
    newNodes[rightId] = { id: rightId, values: node.values.slice(mid), isSplit: false, isMerged: false, isTarget: true };

    setNodes(newNodes);
    getStepExplanation(AlgorithmType.MERGE, node.values, 0, mid, 'compare').then(onExplain);
    checkIfSplittingDone(newNodes);
  };

  const checkIfSplittingDone = (currentNodes: Record<string, MergeNode>) => {
    const canSplitMore = Object.values(currentNodes).some(n => !n.isSplit && n.values.length > 1);
    if (!canSplitMore) {
      findNextMerge(currentNodes);
    }
  };

  const findNextMerge = (currentNodes: Record<string, MergeNode>) => {
    const allNodes = Object.values(currentNodes);
    for (const node of allNodes) {
      if (node.isSplit && node.leftId && node.rightId) {
        const left = currentNodes[node.leftId];
        const right = currentNodes[node.rightId];
        if (!left.isTarget && !right.isTarget && !node.isMerged) {
           const expected = [...left.values, ...right.values].sort((a,b) => a-b);
           setCurrentMerge({
             leftNode: left.id,
             rightNode: right.id,
             targetNode: node.id,
             result: [],
             expected
           });
           setNodes(prev => ({
             ...prev,
             [left.id]: { ...left, isTarget: true },
             [right.id]: { ...right, isTarget: true }
           }));
           return;
        }
      }
    }

    if (currentNodes['root'].values.length === arraySize && currentNodes['root'].isMerged) {
       onComplete(Math.max(0, 1000 - wrongMoves * 50 - timer), timer, wrongMoves);
    }
  };

  const handleMergeAction = async (val: number, side: 'L' | 'R') => {
    if (!currentMerge) return;
    const correctVal = currentMerge.expected[currentMerge.result.length];

    if (val === correctVal) {
      playTone(880, 'sine', 0.05, 0.05);
      const nextResult = [...currentMerge.result, val];
      if (nextResult.length === currentMerge.expected.length) {
        const updatedNodes = { ...nodes };
        updatedNodes[currentMerge.targetNode] = { ...updatedNodes[currentMerge.targetNode], values: nextResult, isMerged: true, isSplit: false, isTarget: false };
        updatedNodes[currentMerge.leftNode].isTarget = false;
        updatedNodes[currentMerge.rightNode].isTarget = false;
        
        setNodes(updatedNodes);
        setCurrentMerge(null);
        
        playTone(1320, 'sine', 0.3, 0.05);

        if (currentMerge.targetNode === 'root') {
          onComplete(Math.max(0, 1000 - wrongMoves * 50 - timer), timer, wrongMoves);
        } else {
          setTimeout(() => findNextMerge(updatedNodes), 400);
        }
      } else {
        setCurrentMerge({ ...currentMerge, result: nextResult });
      }
    } else {
      playTone(110, 'sawtooth', 0.3, 0.1);
      setWrongMoves(w => w + 1);
      
      const leftHead = nodes[currentMerge.leftNode].values.find(v => !currentMerge.result.includes(v));
      const rightHead = nodes[currentMerge.rightNode].values.find(v => !currentMerge.result.includes(v));
      const otherVal = side === 'L' ? rightHead : leftHead;

      const errorContext = `Student picked ${val} from the ${side === 'L' ? 'Left' : 'Right'} side, but ${otherVal} on the other side was smaller. EXPLAIN why ${otherVal} must be picked first. Mention that we only compare the two 'Heads' (${leftHead} and ${rightHead}) of the sorted subarrays.`;
      
      const hint = await getPersonalizedHint(
        AlgorithmType.MERGE, 
        errorContext, 
        currentMerge.expected
      );
      onExplain(hint);
    }
  };

  const renderRecursiveTree = (nodeId: string) => {
    const node = nodes[nodeId];
    if (!node) return null;

    return (
      <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in-95 duration-300">
        <div 
          onClick={() => !node.isSplit && node.values.length > 1 && handleSplit(nodeId)}
          className={`px-3 py-1.5 rounded-xl border-2 transition-all flex gap-1
            ${node.isTarget ? 'border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/20 scale-110' : 
              node.isMerged ? 'border-emerald-500/50 bg-emerald-500/5' : 
              node.values.length > 1 && !node.isSplit ? 'border-amber-500/40 bg-amber-500/5 hover:border-amber-400 cursor-pointer' : 'border-slate-700 bg-slate-800/50'}`}
        >
          {node.values.map((v, i) => (
            <span key={i} className={`font-mono font-bold text-[10px] ${node.isMerged ? 'text-emerald-400' : 'text-slate-300'}`}>
              {v}{i < node.values.length - 1 ? ',' : ''}
            </span>
          ))}
        </div>
        
        {node.isSplit && node.leftId && node.rightId && (
          <div className="flex gap-4 relative">
            <div className="absolute top-[-16px] left-1/2 -translate-x-1/2 w-[80%] h-4 border-x-2 border-t-2 border-slate-700 rounded-t-xl"></div>
            {renderRecursiveTree(node.leftId)}
            {renderRecursiveTree(node.rightId)}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 flex flex-col items-center">
      <div className="flex justify-between w-full px-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
        <div className="flex gap-4">
          <span className="text-emerald-400">LVL: {difficulty}</span>
          <span className="text-amber-500">ERRORS: {wrongMoves}</span>
          <span className="text-indigo-400">TIME: {timer}s</span>
        </div>
        <span className="bg-slate-800 px-2 py-0.5 rounded border border-slate-700 text-slate-300">
           PHASE: {currentMerge ? 'MERGING' : 'SPLITTING'}
        </span>
      </div>

      <div className="w-full bg-slate-900/50 rounded-3xl border border-slate-700/30 p-4 flex flex-col items-center min-h-[420px] justify-center overflow-x-auto relative">
        {!currentMerge ? (
          <div className="space-y-8 text-center w-full">
            <div className="inline-block px-4 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-[10px] font-black text-amber-500 uppercase tracking-widest">
              Action: Split Large Blocks
            </div>
            <div className="py-4">{renderRecursiveTree('root')}</div>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center gap-12">
            {/* The Duel Arena */}
            <div className="flex gap-8 items-center relative">
               {/* Left Subarray Container */}
               <div className="flex flex-col items-center gap-3">
                 <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Left Head</span>
                 <div className="flex gap-1 p-2 bg-slate-800/50 rounded-2xl border border-slate-700 shadow-inner">
                   {nodes[currentMerge.leftNode].values.map((v, i) => {
                     const isMerged = currentMerge.result.includes(v);
                     const headVal = nodes[currentMerge.leftNode].values.find(val => !currentMerge.result.includes(val));
                     const isHead = !isMerged && v === headVal;

                     return (
                       <div key={i} className="relative group">
                         <button 
                           onClick={() => isHead && handleMergeAction(v, 'L')} 
                           disabled={isMerged || !isHead}
                           className={`w-10 h-10 rounded-xl text-xs font-black font-mono transition-all relative overflow-hidden
                             ${isMerged ? 'bg-slate-800/50 text-slate-600 border border-slate-700/50 opacity-30 cursor-default' : 
                               isHead ? 'bg-indigo-600 text-white border-2 border-indigo-400 shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:scale-110 active:scale-95 z-10' : 
                               'bg-slate-700 text-slate-400 opacity-60 cursor-not-allowed'}`}
                         >
                           {v}
                         </button>
                       </div>
                     );
                   })}
                 </div>
               </div>

               <div className="text-2xl font-black text-slate-700 italic select-none">VS</div>

               {/* Right Subarray Container */}
               <div className="flex flex-col items-center gap-3">
                 <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-1">Right Head</span>
                 <div className="flex gap-1 p-2 bg-slate-800/50 rounded-2xl border border-slate-700 shadow-inner">
                   {nodes[currentMerge.rightNode].values.map((v, i) => {
                     const isMerged = currentMerge.result.includes(v);
                     const headVal = nodes[currentMerge.rightNode].values.find(val => !currentMerge.result.includes(val));
                     const isHead = !isMerged && v === headVal;

                     return (
                       <div key={i} className="relative group">
                         <button 
                           onClick={() => isHead && handleMergeAction(v, 'R')} 
                           disabled={isMerged || !isHead}
                           className={`w-10 h-10 rounded-xl text-xs font-black font-mono transition-all relative overflow-hidden
                             ${isMerged ? 'bg-slate-800/50 text-slate-600 border border-slate-700/50 opacity-30 cursor-default' : 
                               isHead ? 'bg-rose-600 text-white border-2 border-rose-400 shadow-[0_0_15px_rgba(225,29,72,0.3)] hover:scale-110 active:scale-95 z-10' : 
                               'bg-slate-700 text-slate-400 opacity-60 cursor-not-allowed'}`}
                         >
                           {v}
                         </button>
                       </div>
                     );
                   })}
                 </div>
               </div>
            </div>

            {/* Target Merged Results Container */}
            <div className="w-full max-w-xl flex flex-col items-center gap-6">
              <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
              
              <div className="flex flex-col items-center gap-4 w-full">
                <span className="text-[11px] font-black text-emerald-400 uppercase tracking-[0.3em]">Merged Result</span>
                <div className="flex flex-wrap justify-center gap-2 min-h-[50px] p-3 bg-slate-900/80 rounded-2xl border border-slate-800 shadow-2xl">
                  {currentMerge.result.map((v, i) => (
                    <div key={i} className="w-10 h-10 bg-emerald-500/90 text-white rounded-xl flex items-center justify-center font-black font-mono text-xs animate-in zoom-in-50 duration-300 shadow-lg shadow-emerald-500/20">
                      {v}
                    </div>
                  ))}
                  {Array.from({ length: currentMerge.expected.length - currentMerge.result.length }).map((_, i) => (
                    <div key={i} className="w-10 h-10 border-2 border-dashed border-slate-800 rounded-xl bg-slate-800/20 flex items-center justify-center">
                       <div className="w-1.5 h-1.5 bg-slate-700 rounded-full opacity-30"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MergeSortGame;
