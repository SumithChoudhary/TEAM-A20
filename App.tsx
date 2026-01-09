
import React, { useState, useEffect } from 'react';
import { AlgorithmType, UserStats, MistakeLog, ErrorCategory } from './types';
import Dashboard from './components/Dashboard';
import BubbleSortGame from './components/BubbleSortGame';
import InsertionSortGame from './components/InsertionSortGame';
import SelectionSortGame from './components/SelectionSortGame';
import MergeSortGame from './components/MergeSortGame';
import QuickSortGame from './components/QuickSortGame';
import HeapSortGame from './components/HeapSortGame';
import AITutorPanel from './components/AITutorPanel';
import CodeLab from './components/CodeLab';
import Introduction from './components/Introduction';
import FeedbackPanel from './components/FeedbackPanel';
import QuizTerminal from './components/QuizTerminal';
import AIChatBot from './components/AIChatBot';
import AICounsel from './components/AICounsel';
import FieldOpView from './components/FieldOpView';
import TacticalAdvisor from './components/TacticalAdvisor';
import DailyRevision from './components/DailyRevision';
import InsertionSortVideo from './components/InsertionSortVideo';
import MergeSortVideo from './components/MergeSortVideo';
import BubbleSortVideo from './components/BubbleSortVideo';
import SelectionSortVideo from './components/SelectionSortVideo';
import QuickSortVideo from './components/QuickSortVideo';
import HeapSortVideo from './components/HeapSortVideo';
import { LESSONS } from './constants';
import { getAdaptiveRecommendation } from './services/geminiService';

const App: React.FC = () => {
  const [view, setView] = useState<'dashboard' | 'lesson' | 'intro' | 'quiz'>('dashboard');
  const [currentAlgo, setCurrentAlgo] = useState<AlgorithmType>(AlgorithmType.BUBBLE);
  const [currentQuizId, setCurrentQuizId] = useState<string | null>(null);
  const [lessonTab, setLessonTab] = useState<'arena' | 'vision' | 'counsel' | 'field_op'>('arena');
  const [tutorMessage, setTutorMessage] = useState("System online. Ready to optimize your sorting intuition, Engineer.");
  const [isTyping, setIsTyping] = useState(false);
  const [recommendedNext, setRecommendedNext] = useState<{decision: string, justification: string} | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showRevision, setShowRevision] = useState(false);
  
  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('sortmaster_stats');
    const defaultStats: UserStats = {
      xp: 0,
      level: 1,
      streak: 1,
      badges: [],
      completedAlgos: [],
      quizScores: {},
      initialScores: {},
      algoDifficulty: {},
      unlockedRewards: [],
      hasCompletedOnboarding: false,
      mistakes: [],
      lastRevisionDate: null
    };
    if (!saved) return defaultStats;
    const parsed = JSON.parse(saved);
    return { ...defaultStats, ...parsed };
  });

  useEffect(() => {
    localStorage.setItem('sortmaster_stats', JSON.stringify(stats));
    if (!stats.hasCompletedOnboarding && view === 'dashboard') {
      setShowOnboarding(true);
    }
  }, [stats]);

  const handleLessonSelect = (algo: AlgorithmType) => {
    setCurrentAlgo(algo);
    setView('lesson');
    setLessonTab('arena');
    const difficulty = stats.algoDifficulty[algo] || 1;
    updateTutorMessage(`Initiating ${algo} simulation (Level ${difficulty}). Analysis ready.`);
  };

  const handleFieldOpSelect = (algo: AlgorithmType) => {
    setCurrentAlgo(algo);
    setView('lesson');
    setLessonTab('field_op');
    updateTutorMessage(`Strategic deployment confirmed. Initializing ${algo} Field Operation.`);
  };

  const handleQuizSelect = (quizId: string) => {
    setCurrentQuizId(quizId);
    setView('quiz');
    setRecommendedNext(null);
    updateTutorMessage(`Assessment mode active. Loading ${quizId} validation suite.`);
  };

  const handleIntroStart = () => {
    setView('intro');
    updateTutorMessage("Foundations are the architecture of mastery. Let's rebuild your understanding of Order.");
  };

  const updateTutorMessage = (msg: string) => {
    setIsTyping(true);
    setTimeout(() => {
      setTutorMessage(msg);
      setIsTyping(false);
    }, 150);
  };

  const logMistake = (algo: AlgorithmType, category: ErrorCategory, context: string) => {
    setStats(prev => ({
      ...prev,
      mistakes: [...prev.mistakes, {
        id: Math.random().toString(36).substr(2, 9),
        algo,
        category,
        context,
        timestamp: Date.now()
      }]
    }));
  };

  const handleGameComplete = (score: number, time: number, wrongMoves: number) => {
    setStats(prev => {
      const currentDifficulty = prev.algoDifficulty[currentAlgo] || 1;
      let newDifficulty = currentDifficulty;
      
      if (wrongMoves === 0 && time < 60 && currentDifficulty < 5) {
        newDifficulty = currentDifficulty + 1;
      } else if (wrongMoves > 3 && currentDifficulty > 1) {
        newDifficulty = currentDifficulty - 1;
      }

      const newXP = prev.xp + 500 + (currentDifficulty * 100);
      const newCompletedAlgos = prev.completedAlgos.includes(currentAlgo) 
        ? prev.completedAlgos 
        : [...prev.completedAlgos, currentAlgo];

      const newUnlocked = [...prev.unlockedRewards];
      return {
        ...prev,
        xp: newXP,
        level: Math.floor(newXP / 1000) + 1,
        completedAlgos: newCompletedAlgos,
        algoDifficulty: { ...prev.algoDifficulty, [currentAlgo]: newDifficulty },
        unlockedRewards: newUnlocked
      };
    });

    const currentDiff = stats.algoDifficulty[currentAlgo] || 1;
    const nextDiff = (wrongMoves === 0 && time < 45) ? Math.min(5, currentDiff + 1) : currentDiff;
    
    updateTutorMessage(nextDiff > currentDiff 
      ? `Exceptional performance. Diagnostic parameters adjusted. Complexity level ${nextDiff} authorized.`
      : `Analysis Complete. Efficiency within target bounds. +500 XP granted.`);
  };

  const handleQuizComplete = async (quizId: string, score: number) => {
    const xpReward = score * 100;
    setStats(prev => {
      const newInitialScores = { ...prev.initialScores };
      if (newInitialScores[quizId] === undefined) {
        newInitialScores[quizId] = score;
      }
      return {
        ...prev,
        xp: prev.xp + xpReward,
        level: Math.floor((prev.xp + xpReward) / 1000) + 1,
        quizScores: { ...prev.quizScores, [quizId]: score },
        initialScores: newInitialScores
      };
    });

    setIsTyping(true);
    const rec = await getAdaptiveRecommendation(score, 60, currentAlgo);
    setRecommendedNext(rec);
    updateTutorMessage(score >= 2 
      ? `Superior performance. Recommendation: Advance. ${rec.justification}`
      : `Conceptual gap detected. Recommendation: Review Foundations. ${rec.justification}`);
    
    setTimeout(() => setView('dashboard'), 5000);
  };

  const handleOnboardingComplete = () => {
    setStats(prev => ({ ...prev, hasCompletedOnboarding: true }));
    setShowOnboarding(false);
  };

  const handleRevisionComplete = (score: number) => {
    setStats(prev => ({ 
      ...prev, 
      xp: prev.xp + (score * 200),
      lastRevisionDate: new Date().toISOString().split('T')[0]
    }));
    setShowRevision(false);
    updateTutorMessage(`Neural Recovery protocol complete. Accuracy: ${score}/3. Neural sync restored.`);
  };

  const renderGame = () => {
    const difficulty = stats.algoDifficulty[currentAlgo] || 1;
    const explainAndLog = (msg: string) => {
      updateTutorMessage(msg);
      if (msg.toLowerCase().includes('already sorted') || msg.toLowerCase().includes('left portion')) {
        logMistake(currentAlgo, 'BOUNDARY', msg);
      } else if (msg.toLowerCase().includes('wrong direction') || msg.toLowerCase().includes('wrong order')) {
        logMistake(currentAlgo, 'LOGIC', msg);
      }
    };

    switch (currentAlgo) {
      case AlgorithmType.BUBBLE: return <BubbleSortGame difficulty={difficulty} onComplete={handleGameComplete} onExplain={explainAndLog} />;
      case AlgorithmType.INSERTION: return <InsertionSortGame difficulty={difficulty} onComplete={handleGameComplete} onExplain={explainAndLog} />;
      case AlgorithmType.SELECTION: return <SelectionSortGame difficulty={difficulty} onComplete={handleGameComplete} onExplain={explainAndLog} />;
      case AlgorithmType.MERGE: return <MergeSortGame difficulty={difficulty} onComplete={handleGameComplete} onExplain={explainAndLog} />;
      case AlgorithmType.QUICK: return <QuickSortGame difficulty={difficulty} onComplete={handleGameComplete} onExplain={explainAndLog} />;
      case AlgorithmType.HEAP: return <HeapSortGame difficulty={difficulty} onComplete={handleGameComplete} onExplain={explainAndLog} />;
      default: return null;
    }
  };

  const renderVideo = () => {
    switch (currentAlgo) {
      case AlgorithmType.BUBBLE: return <BubbleSortVideo />;
      case AlgorithmType.SELECTION: return <SelectionSortVideo />;
      case AlgorithmType.INSERTION: return <InsertionSortVideo />;
      case AlgorithmType.MERGE: return <MergeSortVideo />;
      case AlgorithmType.QUICK: return <QuickSortVideo />;
      case AlgorithmType.HEAP: return <HeapSortVideo />;
      default: return null;
    }
  };

  const renderTabContent = () => {
    switch (lessonTab) {
      case 'arena':
        return renderGame();
      case 'vision':
        return renderVideo();
      case 'field_op':
        return (
          <FieldOpView 
            algorithm={currentAlgo} 
            onComplete={(score, time) => handleGameComplete(score, time, 0)} 
            onExplain={updateTutorMessage} 
          />
        );
      case 'counsel':
        return <AICounsel algorithm={currentAlgo} />;
      default:
        return renderGame();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-200">
      <header className="h-16 border-b border-white/5 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-[100] px-6 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setView('dashboard')}>
            <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center font-black text-white shadow-lg shadow-indigo-500/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">S</div>
            <div>
              <h1 className="text-sm font-black tracking-tighter text-white uppercase leading-none group-hover:text-indigo-400 transition-colors">SortMaster</h1>
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest opacity-60">Core Interface</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-2">
            <button 
              onClick={() => setView('dashboard')} 
              className={`glass-button px-5 py-2 text-[10px] font-black uppercase tracking-widest transition-all rounded-xl ${view === 'dashboard' ? 'bg-indigo-600/20 text-indigo-400 border-indigo-500/30' : 'text-slate-500'}`}
            >
              Curriculum
            </button>
            <button 
              onClick={handleIntroStart} 
              className={`glass-button px-5 py-2 text-[10px] font-black uppercase tracking-widest transition-all rounded-xl ${view === 'intro' ? 'bg-indigo-600/20 text-indigo-400 border-indigo-500/30' : 'text-slate-500'}`}
            >
              Foundations
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-full group cursor-default hover:bg-indigo-500/20 transition-all">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse group-hover:shadow-[0_0_8px_indigo]"></span>
            <span className="font-mono text-xs font-black text-indigo-300 group-hover:text-white transition-colors">{stats.xp} <span className="text-[9px] opacity-50">XP</span></span>
          </div>
          <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-black hover:bg-indigo-600 hover:border-indigo-400 transition-all hover:scale-110 active:scale-95 cursor-default">L{stats.level}</div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden relative">
        {view === 'dashboard' ? (
          <Dashboard 
            stats={stats} 
            onSelectLesson={handleLessonSelect} 
            onSelectQuiz={handleQuizSelect} 
            onStartIntro={handleIntroStart} 
            onSelectFieldOp={handleFieldOpSelect}
            onTriggerRevision={() => setShowRevision(true)}
          />
        ) : view === 'quiz' ? (
          <div className="flex-1 flex flex-col md:flex-row p-4 gap-4 overflow-hidden h-full">
            <div className="flex-[1.5] overflow-y-auto">
              {currentQuizId && <QuizTerminal quizId={currentQuizId} onComplete={handleQuizComplete} onFeedback={updateTutorMessage} />}
            </div>
            <aside className="flex-1 flex flex-col gap-4 overflow-hidden">
               <AITutorPanel message={tutorMessage} isTyping={isTyping} />
               {recommendedNext && (
                 <div className="glass-card rounded-3xl p-6 border border-emerald-500/20 bg-emerald-500/5 animate-in slide-in-from-right-4 duration-700 hover:bg-emerald-500/10 transition-all">
                    <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2">Adaptive Path Identified</h4>
                    <p className="text-xs font-bold text-white mb-1">{recommendedNext.decision}</p>
                    <p className="text-[10px] text-slate-400 leading-relaxed italic">"{recommendedNext.justification}"</p>
                 </div>
               )}
            </aside>
          </div>
        ) : view === 'intro' ? (
          <div className="flex-1 flex flex-col lg:flex-row gap-4 p-4 overflow-hidden h-full">
            <div className="flex-1 overflow-y-auto px-4 lg:px-12 py-8 scroll-smooth glass-card rounded-[2.5rem] border border-white/5">
              <Introduction onBack={() => setView('dashboard')} onSelectAlgo={handleLessonSelect} />
            </div>
            <aside className="w-full lg:w-96 shrink-0 flex flex-col gap-4 overflow-y-auto">
              <FeedbackPanel />
              <AITutorPanel message={tutorMessage} isTyping={isTyping} />
            </aside>
          </div>
        ) : (
          <div className="flex-1 flex flex-col md:flex-row p-4 gap-4 overflow-hidden h-full">
            <div className="flex-[1.2] flex flex-col gap-4 overflow-hidden">
              <div className="glass-card rounded-3xl overflow-hidden flex flex-col h-full border border-white/5 shadow-2xl">
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-slate-900/40">
                  <div className="flex items-center gap-4">
                    <button onClick={() => setLessonTab('arena')} className={`text-[10px] font-black uppercase tracking-widest pb-1 border-b-2 transition-all duration-300 ${lessonTab === 'arena' ? 'border-indigo-500 text-white translate-y-[-2px]' : 'border-transparent text-slate-500 hover:text-indigo-300'}`}>Arena</button>
                    <button onClick={() => setLessonTab('vision')} className={`text-[10px] font-black uppercase tracking-widest pb-1 border-b-2 transition-all duration-300 ${lessonTab === 'vision' ? 'border-indigo-500 text-white translate-y-[-2px]' : 'border-transparent text-slate-500 hover:text-indigo-300'}`}>Vision</button>
                    <button onClick={() => setLessonTab('field_op')} className={`text-[10px] font-black uppercase tracking-widest pb-1 border-b-2 transition-all duration-300 ${lessonTab === 'field_op' ? 'border-indigo-500 text-white translate-y-[-2px]' : 'border-transparent text-slate-500 hover:text-rose-400'} flex items-center gap-2`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                      Field Op
                    </button>
                    <button onClick={() => setLessonTab('counsel')} className={`text-[10px] font-black uppercase tracking-widest pb-1 border-b-2 transition-all duration-300 ${lessonTab === 'counsel' ? 'border-indigo-500 text-white translate-y-[-2px]' : 'border-transparent text-slate-500 hover:text-indigo-300'} flex items-center gap-2`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
                      Ask Master Logic
                    </button>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-6">{renderTabContent()}</div>
              </div>
            </div>
            
            {/* Contextual Tactical Advisor on the side */}
            <aside className="flex-1 flex flex-col gap-4 overflow-hidden max-w-[400px]">
               <TacticalAdvisor 
                 algorithm={currentAlgo} 
                 stats={stats} 
                 mode="persistent" 
                 isTyping={isTyping}
                 tutorMessage={tutorMessage}
               />
               <AITutorPanel message={tutorMessage} isTyping={isTyping} />
               <div className="flex-1 glass-card rounded-3xl border border-white/5 overflow-hidden flex flex-col shadow-2xl">
                  <CodeLab algorithm={currentAlgo} onFeedback={updateTutorMessage} />
               </div>
            </aside>
          </div>
        )}
        <AIChatBot />
        {showOnboarding && <TacticalAdvisor mode="onboarding" algorithm={AlgorithmType.BUBBLE} stats={stats} onComplete={handleOnboardingComplete} />}
        {showRevision && <DailyRevision stats={stats} onComplete={handleRevisionComplete} onCancel={() => setShowRevision(false)} />}
      </main>
    </div>
  );
};

export default App;
