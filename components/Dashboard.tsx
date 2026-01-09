
import React, { useState } from 'react';
import { UserStats, AlgorithmType } from '../types';
import { LESSONS, REWARDS } from '../constants';
import MistakeDiary from './MistakeDiary';
import LearningCurve from './LearningCurve';

interface DashboardProps {
  stats: UserStats;
  onSelectLesson: (algo: AlgorithmType) => void;
  onSelectQuiz: (quizId: string) => void;
  onStartIntro: () => void;
  onSelectFieldOp: (algo: AlgorithmType) => void;
  onTriggerRevision: () => void;
}

const PROJECT_DOSSIERS = [
  {
    id: "01",
    title: "Visual Sorting Algorithm Simulator",
    tagline: "Build a high-fidelity visual logic stream",
    description: "Architect a comprehensive simulation suite that visualizes sorting mechanics in real-time. This project requires implementing the core sorting logic while providing visual telemetry for students to debug their understanding.",
    features: [
      "Dynamic array generation & manual initialization",
      "Step-through logic vs Auto-execution modes",
      "Telemetry suite: Track Comparisons and Swaps",
      "Frame-rate control for algorithmic speed analysis"
    ],
    objective: "Dramatically lower the cognitive barrier to understanding O(n²) and O(n log n) structures.",
    icon: "📊",
    accent: "indigo"
  },
  {
    id: "02",
    title: "AI-Based Sort Recommendation System",
    tagline: "Prescriptive decision engine for datasets",
    description: "Develop a prescriptive tool that evaluates input dataset profiles (entropy, size, order) to recommend the most efficient sorting protocol for maximum data throughput.",
    features: [
      "Input profile entropy analysis",
      "Prescriptive AI logic engine with justifications",
      "Benchmarking suite for time/space complexity",
      "Efficiency report generation"
    ],
    objective: "Enable automated decision-making for high-concurrency data pipelines using heuristic models.",
    icon: "🤖",
    accent: "purple"
  }
];

const Dashboard: React.FC<DashboardProps> = ({ stats, onSelectLesson, onSelectQuiz, onStartIntro, onSelectFieldOp, onTriggerRevision }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'missions' | 'mastery' | 'coach' | 'labs'>('missions');

  const complexityStyles = (complexity: string) => {
    if (complexity.includes('log n')) return 'from-emerald-500/20 to-teal-500/5 text-emerald-400 border-emerald-500/30';
    return 'from-rose-500/20 to-orange-500/5 text-rose-400 border-rose-500/30';
  };

  const filteredAlgos = Object.values(AlgorithmType).filter(algo => 
    algo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderAlgoCard = (algo: AlgorithmType, index: number) => {
    const isCompleted = stats.completedAlgos.includes(algo);
    const lesson = LESSONS[algo];
    
    return (
      <div 
        key={algo} 
        className="staggered-entry" 
        style={{ animationDelay: `${index * 60}ms` }}
      >
        <button
          onClick={() => onSelectLesson(algo)}
          className={`group w-full relative p-10 rounded-[3rem] border transition-all duration-700 text-left overflow-hidden flex flex-col h-full hover-lift
            ${isCompleted 
              ? 'bg-emerald-500/5 border-emerald-500/40 shadow-xl' 
              : 'glass-card border-white/5 hover:border-indigo-500/60'}`}
        >
          <div className="absolute inset-0 bg-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          
          <div className="flex justify-between items-start mb-10 relative z-10">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 border
              ${isCompleted 
                ? 'bg-emerald-500 border-emerald-400 text-white' 
                : 'bg-slate-800/80 border-white/5 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white'}`}>
              <span className="text-2xl font-black">{isCompleted ? '✓' : algo.charAt(0)}</span>
            </div>
            <div className={`px-4 py-1.5 rounded-full border text-[10px] font-mono font-black tracking-widest bg-gradient-to-r transition-transform group-hover:scale-110 ${complexityStyles(lesson.complexity)}`}>
              {lesson.complexity}
            </div>
          </div>

          <div className="relative z-10 flex-1">
            <h4 className="text-2xl font-black text-white mb-4 group-hover:text-indigo-300 transition-colors uppercase italic">
              {algo}
            </h4>
            <p className="text-[13px] text-slate-400 leading-relaxed mb-10 line-clamp-3 font-medium group-hover:text-slate-100">
              {lesson.description}
            </p>
          </div>

          <div className="mt-auto relative z-10">
            <div className="flex items-center justify-between pt-6 border-t border-white/10">
              <span className={`text-[11px] font-black uppercase tracking-[0.3em] 
                ${isCompleted ? 'text-emerald-500' : 'text-slate-500 group-hover:text-indigo-300'}`}>
                {isCompleted ? 'SYNC VERIFIED' : 'SYNC INITIALIZE'}
              </span>
            </div>
          </div>
        </button>
      </div>
    );
  };

  const renderLabsView = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 animate-in fade-in slide-in-from-bottom-12 duration-1000">
      {PROJECT_DOSSIERS.map((project) => (
        <div 
          key={project.id} 
          className="group relative p-16 rounded-[4rem] glass-card border border-white/10 overflow-hidden hover-lift flex flex-col h-full hover:bg-slate-900/60"
        >
          <div className={`absolute inset-0 bg-gradient-to-br from-${project.accent}-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700`}></div>
          
          <div className="flex items-center gap-8 mb-12 relative z-10">
            <div className="w-24 h-24 rounded-[2.5rem] bg-slate-900 border border-white/10 flex items-center justify-center text-5xl shadow-2xl group-hover:rotate-6 transition-all duration-500">
              {project.icon}
            </div>
            <div>
              <span className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.5em] mb-2 block">Project Protocol {project.id}</span>
              <h3 className="text-3xl font-black text-white group-hover:text-indigo-300 transition-colors tracking-tight uppercase leading-none">{project.title}</h3>
            </div>
          </div>

          <div className="relative z-10 space-y-12 flex-1">
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Research Synopsis</h4>
              <p className="text-xl font-bold text-slate-200 leading-snug group-hover:text-white italic">"{project.tagline}"</p>
              <p className="text-[15px] text-slate-500 leading-relaxed font-medium">{project.description}</p>
            </div>

            <div className="space-y-6">
              <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest border-l-4 border-indigo-600 pl-4">System Deliverables</h4>
              <ul className="grid grid-cols-1 gap-4">
                {project.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-4 text-[13px] font-bold text-slate-400">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 shrink-0 shadow-[0_0_10px_indigo]"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-16 pt-10 border-t border-white/5 flex justify-between items-center relative z-10">
             <div className="flex flex-col">
               <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Classification</span>
               <span className="text-[12px] font-black text-white uppercase tracking-widest mt-1">Advanced B.Tech Lab</span>
             </div>
             <button className="px-10 py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black uppercase text-[11px] tracking-[0.3em] shadow-3xl hover:bg-white hover:text-indigo-600 transition-all active:scale-95 border-t border-white/20">
               Initialize Lab
             </button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-transparent">
      <section className="flex-1 overflow-y-auto p-12 md:p-24 space-y-24 custom-scrollbar">
        <div className="flex items-center justify-between mb-16 px-4">
           <div className="flex gap-12 items-center">
             {(['missions', 'mastery', 'coach', 'labs'] as const).map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-[12px] font-black uppercase tracking-[0.4em] transition-all relative py-2
                    ${activeTab === tab ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  {tab}
                  {activeTab === tab && (
                    <span className="absolute bottom-0 left-0 w-full h-1 bg-indigo-500 rounded-full shadow-[0_0_10px_indigo]"></span>
                  )}
                </button>
             ))}
           </div>
           
           {activeTab === 'missions' && (
             <div className="relative w-72 group">
               <input 
                 type="text" 
                 placeholder="Search protocols..." 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-12 text-[11px] font-black text-white focus:outline-none focus:border-indigo-500/50 transition-all placeholder-slate-700"
               />
               <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeWidth={3}/></svg>
             </div>
           )}
        </div>

        {activeTab === 'missions' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {filteredAlgos.map((algo, i) => renderAlgoCard(algo, i))}
          </div>
        )}

        {activeTab === 'mastery' && <LearningCurve stats={stats} />}

        {activeTab === 'coach' && <MistakeDiary stats={stats} />}

        {activeTab === 'labs' && renderLabsView()}
      </section>
    </div>
  );
};

export default Dashboard;
