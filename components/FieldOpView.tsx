
import React, { useState, useEffect, useRef } from 'react';
import { AlgorithmType } from '../types';

interface FieldOpViewProps {
  algorithm: AlgorithmType;
  onComplete: (score: number, time: number) => void;
  onExplain: (msg: string) => void;
}

const MISSION_DATA: Record<AlgorithmType, { title: string, context: string, itemEmoji: string, unit: string, successMsg: string }> = {
  [AlgorithmType.BUBBLE]: { title: "The Soda Factory", context: "Sort the carbonated bottles on the conveyor belt to prevent production line jams.", itemEmoji: "🍾", unit: "ml", successMsg: "Production line stabilized. Bottles perfectly ordered." },
  [AlgorithmType.SELECTION]: { title: "The Museum Curator", context: "Select the shortest ancient artifacts to fill the display case in order.", itemEmoji: "🏺", unit: "cm", successMsg: "Exhibit complete. Artifacts displayed by historical height." },
  [AlgorithmType.INSERTION]: { title: "The Librarian", context: "Insert the new book arrivals into the sorted section of the archive shelf.", itemEmoji: "📚", unit: "pg", successMsg: "Archive synchronized. Books organized for retrieval." },
  [AlgorithmType.MERGE]: { title: "Logistics Hub", context: "Combine two streams of sorted packages from different regional warehouses.", itemEmoji: "📦", unit: "kg", successMsg: "Logistics merged. Delivery routes optimized." },
  [AlgorithmType.QUICK]: { title: "Digital Mailroom", context: "Partition packages relative to the pivot file to clear the mail queue.", itemEmoji: "✉️", unit: "id", successMsg: "Queue cleared. All mail packets correctly partitioned." },
  [AlgorithmType.HEAP]: { title: "ER Triage", context: "The patient with the highest priority (value) must be at the root of the triage tree.", itemEmoji: "🏥", unit: "pri", successMsg: "Triage tree balanced. Critical care priority established." }
};

const FieldOpView: React.FC<FieldOpViewProps> = ({ algorithm, onComplete, onExplain }) => {
  const mission = MISSION_DATA[algorithm];
  const [items, setItems] = useState<number[]>([]);
  const [indices, setIndices] = useState<{ i: number, j: number }>({ i: 0, j: 0 });
  const [isFinished, setIsFinished] = useState(false);
  const [timer, setTimer] = useState(0);
  const startTime = useRef(Date.now());

  useEffect(() => {
    // Initialize random items based on the mission
    const randomItems = Array.from({ length: 6 }, () => Math.floor(Math.random() * 50) + 15);
    setItems(randomItems);
    setIndices({ i: 0, j: 0 });
    setIsFinished(false);
    startTime.current = Date.now();
    onExplain(`Mission briefing: ${mission.context} Initializing ${algorithm} protocols.`);
  }, [algorithm]);

  const performStep = () => {
    if (isFinished) return;

    let newItems = [...items];
    let { i, j } = indices;

    switch (algorithm) {
      case AlgorithmType.BUBBLE:
        if (newItems[j] > newItems[j + 1]) {
          [newItems[j], newItems[j + 1]] = [newItems[j + 1], newItems[j]];
          onExplain(`Swapping bottles: ${newItems[j+1]}ml moved right because it's larger than ${newItems[j]}ml.`);
        } else {
          onExplain(`Comparing ${newItems[j]}ml and ${newItems[j+1]}ml. Order is correct.`);
        }
        j++;
        if (j >= newItems.length - 1 - i) {
          j = 0;
          i++;
        }
        if (i >= newItems.length - 1) setIsFinished(true);
        break;

      case AlgorithmType.SELECTION:
        // Find min in unsorted part
        let minIdx = i;
        for (let k = i + 1; k < newItems.length; k++) {
          if (newItems[k] < newItems[minIdx]) minIdx = k;
        }
        if (minIdx !== i) {
          [newItems[i], newItems[minIdx]] = [newItems[minIdx], newItems[i]];
          onExplain(`Selecting smallest artifact: ${newItems[i]}cm artifact moved to exhibit slot ${i}.`);
        } else {
          onExplain(`Artifact at slot ${i} is already the smallest in remaining section.`);
        }
        i++;
        if (i >= newItems.length - 1) setIsFinished(true);
        break;

      case AlgorithmType.INSERTION:
        // We simulate one full insertion per click for the Field Op
        let current = newItems[i + 1];
        let k = i;
        while (k >= 0 && newItems[k] > current) {
          newItems[k + 1] = newItems[k];
          k--;
        }
        newItems[k + 1] = current;
        onExplain(`Librarian task: Inserting ${current}pg book into its sorted position.`);
        i++;
        if (i >= newItems.length - 1) setIsFinished(true);
        break;

      default:
        // Basic sort simulation for others in the themed view
        newItems.sort((a, b) => a - b);
        setIsFinished(true);
        onExplain(`Executing advanced ${algorithm} logic stream. Optimizing order...`);
    }

    setItems(newItems);
    setIndices({ i, j });

    if (isFinished || (algorithm === AlgorithmType.BUBBLE && i >= newItems.length - 1)) {
        handleCompletion();
    }
  };

  const handleCompletion = () => {
    setIsFinished(true);
    onExplain(mission.successMsg);
    const duration = Math.floor((Date.now() - startTime.current) / 1000);
    setTimeout(() => onComplete(100, duration), 2000);
  };

  return (
    <div className="h-full flex flex-col gap-6 animate-in fade-in duration-500">
      {/* Mission Header */}
      <div className="flex items-center justify-between bg-slate-900/50 p-6 rounded-3xl border border-white/5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-3xl border border-indigo-500/20 shadow-inner">
            {mission.itemEmoji}
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-tight uppercase">{mission.title}</h2>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{mission.context}</p>
          </div>
        </div>
        <div className="text-right">
           <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block">Mission Protocol</span>
           <span className="text-sm font-mono font-bold text-white">{algorithm}</span>
        </div>
      </div>

      {/* Blueprint Stage */}
      <div className="flex-1 glass-card rounded-[3rem] border border-dashed border-indigo-500/20 relative flex items-end justify-center gap-6 p-12 overflow-hidden shadow-inner">
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]"></div>
        
        {items.map((val, idx) => {
          const isActive = algorithm === AlgorithmType.BUBBLE ? (idx === indices.j || idx === indices.j + 1) : (idx === indices.i);
          return (
            <div key={idx} className="flex flex-col items-center gap-4 animate-in slide-in-from-bottom-4 duration-500" style={{ transitionDelay: `${idx * 50}ms` }}>
              <div className={`text-[10px] font-mono font-black px-2 py-1 rounded-lg border transition-all ${isActive ? 'bg-indigo-500 text-white border-indigo-400 scale-110' : 'text-indigo-400 bg-indigo-500/5 border-indigo-500/10'}`}>
                {val}{mission.unit}
              </div>
              <div 
                className={`w-16 bg-slate-800 rounded-2xl border transition-all duration-500 flex flex-col items-center justify-center gap-2 py-4 group shadow-2xl relative
                  ${isActive ? 'border-indigo-500 shadow-indigo-500/20 -translate-y-4' : 'border-white/5'}`}
                style={{ height: `${val * 4}px`, minHeight: '80px' }}
              >
                {isActive && <div className="absolute inset-0 bg-indigo-500/10 animate-pulse rounded-2xl"></div>}
                <span className={`text-3xl transition-transform duration-500 ${isActive ? 'scale-125 rotate-6' : ''}`}>{mission.itemEmoji}</span>
                <div className={`w-10 h-1.5 rounded-full ${isActive ? 'bg-indigo-500/40' : 'bg-white/5'}`}></div>
              </div>
            </div>
          );
        })}

        {/* Status Indicators */}
        <div className="absolute top-8 right-8 flex flex-col items-end gap-3">
           <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${isFinished ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-indigo-500/10 border-indigo-500/20'}`}>
              <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isFinished ? 'bg-emerald-500' : 'bg-indigo-500'}`}></span>
              <span className={`text-[8px] font-black uppercase tracking-widest ${isFinished ? 'text-emerald-500' : 'text-indigo-400'}`}>
                {isFinished ? 'Operation Complete' : 'System Nominal'}
              </span>
           </div>
           {algorithm === AlgorithmType.BUBBLE && !isFinished && (
              <div className="text-[10px] font-mono text-slate-500 bg-slate-900/50 px-3 py-1 rounded-lg border border-white/5">
                Current Pass: {indices.i + 1}
              </div>
           )}
        </div>
      </div>

      {/* Themed Control Area */}
      <div className="bg-slate-900/80 p-8 rounded-3xl border border-white/5 flex items-center justify-between backdrop-blur-xl">
         <div className="max-w-md">
            <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Operational Guidance</h4>
            <p className="text-xs text-slate-400 font-medium leading-relaxed italic">
              {isFinished 
                ? "Deployment objective achieved. Analyzing efficiency data..." 
                : `"Utilize the provided control module to advance through the ${algorithm} protocol steps. Watch the assets respond to your logic."`}
            </p>
         </div>
         <button 
           onClick={performStep}
           disabled={isFinished}
           className={`group px-10 py-4 rounded-2xl font-black uppercase text-[11px] tracking-widest transition-all shadow-2xl relative overflow-hidden active:scale-95
             ${isFinished 
               ? 'bg-emerald-600/50 cursor-not-allowed border-emerald-500/20 text-emerald-100' 
               : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20 border-t border-white/20'}`}
         >
           <span className="relative z-10 flex items-center gap-3">
             {isFinished ? 'Mission Finalized' : 'Initialize Field Step'}
             {!isFinished && <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M13 7l5 5m0 0l-5 5m5-5H6" strokeWidth={3}/></svg>}
           </span>
         </button>
      </div>
    </div>
  );
};

export default FieldOpView;
