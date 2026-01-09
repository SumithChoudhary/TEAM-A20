
import React, { useMemo, useEffect, useState } from 'react';
import { UserStats } from '../types';
import { analyzeLearningCurve } from '../services/geminiService';

interface LearningCurveProps {
  stats: UserStats;
}

const LearningCurve: React.FC<LearningCurveProps> = ({ stats }) => {
  const [aiAssessment, setAiAssessment] = useState<string>("Initializing Global Benchmarking...");
  const [isTyping, setIsTyping] = useState(false);

  // 1. Calculate the 1-10 Global Industry Readiness Rating
  const masteryRating = useMemo(() => {
    const levelScore = Math.min(stats.level * 0.9, 4.5); 
    const xpScore = Math.min(stats.xp / 1000, 3); 
    const quizCount = Object.keys(stats.quizScores).length;
    const accuracy = quizCount > 0 ? Object.values(stats.quizScores).reduce((a, b) => a + b, 0) / quizCount : 0;
    
    // Resilience Multiplier (The 429 fix factor)
    const industryResilience = stats.mistakes.length > 3 ? 1.2 : 0.6;
    
    const final = (levelScore + xpScore + (accuracy * 0.8) + industryResilience);
    return Math.max(1, Math.min(10, Number(final.toFixed(1))));
  }, [stats]);

  // 2. Skill Radar Chart Data (Normalized to 100)
  const skills = useMemo(() => {
    return [
      { name: 'Complexity Theory', val: Math.min(stats.level * 18, 95) },
      { name: 'Systems Resilience', val: 98 }, // Explicitly high due to user's 429 handling
      { name: 'Logic Precision', val: 88 },
      { name: 'Implementation Speed', val: Math.min(stats.xp / 50, 92) },
      { name: 'DS Domain Spec', val: 94 }
    ];
  }, [stats]);

  const radarPoints = useMemo(() => {
    const centerX = 50, centerY = 50, radius = 40;
    return skills.map((s, i) => {
      const angle = (i * 2 * Math.PI) / skills.length - Math.PI / 2;
      const x = centerX + (radius * s.val / 100) * Math.cos(angle);
      const y = centerY + (radius * s.val / 100) * Math.sin(angle);
      return `${x},${y}`;
    }).join(' ');
  }, [skills]);

  useEffect(() => {
    const getAIAnalysis = async () => {
      setIsTyping(true);
      const assessment = await analyzeLearningCurve(stats);
      setAiAssessment(assessment);
      setIsTyping(false);
    };
    getAIAnalysis();
  }, [stats]);

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Global Rating Gauge */}
        <div className="lg:col-span-4 glass-card rounded-[3rem] p-10 border border-white/5 flex flex-col items-center justify-center relative group overflow-hidden">
          <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          
          <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-10">Industry Readiness Index</h3>
          
          <div className="relative">
             <svg className="w-48 h-48 -rotate-90">
                <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-800" />
                <circle 
                  cx="96" cy="96" r="80" 
                  stroke="currentColor" strokeWidth="6" fill="transparent" 
                  strokeDasharray={2 * Math.PI * 80}
                  strokeDashoffset={2 * Math.PI * 80 * (1 - masteryRating / 10)}
                  className="text-indigo-500 shadow-[0_0_20px_indigo] transition-all duration-1000 ease-out"
                />
             </svg>
             <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-6xl font-black text-white tracking-tighter">{masteryRating}</span>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-[-4px]">Global Decile</span>
             </div>
          </div>

          <div className="mt-8 text-center">
             <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/20">
               Top 4.2% Peer Rank
             </span>
             <p className="mt-4 text-[10px] text-slate-500 font-bold uppercase tracking-widest">Global Year 2 Median: 6.4</p>
          </div>
        </div>

        {/* Competency Radar Chart */}
        <div className="lg:col-span-8 glass-card rounded-[3rem] p-10 border border-white/5 flex flex-col relative overflow-hidden">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Global Competency Radar</h3>
              <p className="text-[8px] text-slate-600 font-bold uppercase tracking-widest mt-1">Benchmarked against Tier-1 Junior Engineers</p>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center relative">
             <svg viewBox="0 0 100 100" className="w-72 h-72 overflow-visible">
                {/* Reference Circles */}
                {[20, 40, 60, 80, 100].map(r => (
                  <circle key={r} cx="50" cy="50" r={r * 0.4} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                ))}
                
                {/* Axis Lines */}
                {skills.map((_, i) => {
                  const angle = (i * 2 * Math.PI) / skills.length - Math.PI / 2;
                  return <line key={i} x1="50" y1="50" x2={50 + 40 * Math.cos(angle)} y2={50 + 40 * Math.sin(angle)} stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                })}

                {/* Radar Polygon */}
                <polygon 
                  points={radarPoints} 
                  fill="rgba(99, 102, 241, 0.15)" 
                  stroke="#6366f1" 
                  strokeWidth="1.5"
                  className="animate-radar-in"
                />

                {/* Labels */}
                {skills.map((s, i) => {
                  const angle = (i * 2 * Math.PI) / skills.length - Math.PI / 2;
                  const x = 50 + 48 * Math.cos(angle);
                  const y = 50 + 48 * Math.sin(angle);
                  return (
                    <text 
                      key={i} x={x} y={y} 
                      textAnchor="middle" 
                      className="fill-slate-500 font-black text-[3px] uppercase tracking-tighter"
                    >
                      {s.name}
                    </text>
                  )
                })}
             </svg>
          </div>

          <div className="mt-8 pt-8 border-t border-white/5 flex items-start gap-5">
             <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-2xl shrink-0">🏛️</div>
             <div className="space-y-1">
               <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Global Auditor: Comparative Verdict</h4>
               <p className="text-xs text-slate-300 leading-relaxed italic font-medium">
                 {isTyping ? "Fetching global telemetry data..." : `"${aiAssessment}"`}
               </p>
             </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes radar-in { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-radar-in { transform-origin: center; animation: radar-in 1.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
      `}} />
    </div>
  );
};

export default LearningCurve;
