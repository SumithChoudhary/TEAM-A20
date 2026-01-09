
import React, { useState } from 'react';
import { AlgorithmType } from '../types';
import { analyzeCCode } from '../services/geminiService';

interface CodeLabProps {
  algorithm: AlgorithmType;
  onFeedback: (msg: string) => void;
}

const CodeLab: React.FC<CodeLabProps> = ({ algorithm, onFeedback }) => {
  const [code, setCode] = useState(`#include <stdio.h>\n\nvoid bubbleSort(int arr[], int n) {\n  // Implement your logic here\n  \n}`);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    onFeedback("Checking your code logic...");
    const result = await analyzeCCode(code, algorithm);
    onFeedback(result || "Analysis complete.");
    setIsAnalyzing(false);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-xl border border-slate-700 overflow-hidden">
      <div className="bg-slate-800 px-4 py-2 flex justify-between items-center border-b border-slate-700">
        <div className="flex gap-2 items-center">
          <div className="w-3 h-3 rounded-full bg-rose-500"></div>
          <div className="w-3 h-3 rounded-full bg-amber-500"></div>
          <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
          <span className="ml-2 text-xs font-mono text-slate-400">solution.c</span>
        </div>
        <button 
          onClick={handleAnalyze}
          disabled={isAnalyzing}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs px-4 py-1.5 rounded font-semibold transition-all flex items-center gap-2"
        >
          {isAnalyzing ? "Analyzing..." : "Analyze Logic"}
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </button>
      </div>
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="flex-1 bg-slate-900 text-indigo-100 font-mono p-6 outline-none resize-none text-sm leading-relaxed"
        spellCheck={false}
      />
      <div className="bg-slate-800 p-3 text-[10px] text-slate-500 border-t border-slate-700 uppercase tracking-widest font-bold text-center">
        Hands-On C Practice • {algorithm}
      </div>
    </div>
  );
};

export default CodeLab;
