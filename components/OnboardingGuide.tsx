
import React, { useState, useEffect } from 'react';

interface OnboardingStep {
  text: string;
  position: 'center' | 'bottom-left' | 'top-left' | 'top-right';
  targetId?: string;
}

const STEPS: OnboardingStep[] = [
  {
    text: "Greetings, Engineer! I am Master Logic. I've been assigned as your tactical advisor through the complex world of Sorting Algorithms.",
    position: 'center'
  },
  {
    text: "This is your Personal Dossier. Your XP and Level represent your synaptic synchronization with sorting theory. Keep them high to advance in rank!",
    position: 'bottom-left',
    targetId: 'user-dossier'
  },
  {
    text: "Mission Control is where you select your research targets. We recommend starting with Iterative Foundations to build your core intuition.",
    position: 'center',
    targetId: 'mission-control-header'
  },
  {
    text: "The Rewards Vault contains classified hardware upgrades. Complete learning tracks and quizzes to unlock these legendary certifications.",
    position: 'bottom-left',
    targetId: 'rewards-vault'
  },
  {
    text: "You're now synchronized with the system. Click 'Foundations' in the header to start your first briefing. Good luck!",
    position: 'center'
  }
];

interface OnboardingGuideProps {
  onComplete: () => void;
}

const OnboardingGuide: React.FC<OnboardingGuideProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  const step = STEPS[currentStep];

  useEffect(() => {
    setIsTyping(true);
    setDisplayedText('');
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(prev => prev + step.text[i]);
      i++;
      if (i >= step.text.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [currentStep]);

  const handleNext = () => {
    if (isTyping) {
      setDisplayedText(step.text);
      setIsTyping(false);
      return;
    }
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(s => s + 1);
    } else {
      onComplete();
    }
  };

  const getPositionStyles = () => {
    switch (step.position) {
      case 'bottom-left': return 'bottom-12 left-12';
      case 'top-left': return 'top-20 left-12';
      case 'top-right': return 'top-20 right-12';
      default: return 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2';
    }
  };

  return (
    <div className="fixed inset-0 z-[300] bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-500">
      {/* Visual Indicator for Target Section */}
      {step.targetId && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="w-full h-full bg-slate-950/40"></div>
          {/* Simple highlight box - ideally we'd calculate target position dynamically, but positioning guide near the area is safer for this structure */}
        </div>
      )}

      <div className={`absolute flex flex-col items-center gap-6 max-w-lg transition-all duration-700 ease-out ${getPositionStyles()}`}>
        {/* Tutor Avatar */}
        <div className="relative group">
          <div className="w-32 h-32 rounded-full bg-indigo-600/20 border-4 border-indigo-500/40 flex items-center justify-center shadow-[0_0_50px_rgba(99,102,241,0.3)] animate-bounce-slow">
            <div className="w-24 h-24 rounded-full bg-indigo-500 flex items-center justify-center text-5xl relative overflow-hidden">
              🤖
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-600/50 to-transparent"></div>
              <div className="absolute top-0 left-0 w-full h-1 bg-white/20 animate-scan"></div>
            </div>
          </div>
          {/* Holographic Ring */}
          <div className="absolute inset-[-20px] border-2 border-dashed border-indigo-500/20 rounded-full animate-spin-slow"></div>
        </div>

        {/* Dialogue Bubble */}
        <div 
          onClick={handleNext}
          className="relative bg-slate-900 border-2 border-indigo-500/50 rounded-[2.5rem] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.5)] cursor-pointer hover:border-indigo-400 transition-all active:scale-95 group"
        >
          {/* Speech tail */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-slate-900 border-l-2 border-t-2 border-indigo-500/50 rotate-45"></div>
          
          <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-4">Master Logic Advisor</h4>
          <p className="text-lg font-bold text-white leading-relaxed tracking-tight min-h-[80px]">
            {displayedText}
            {isTyping && <span className="w-1.5 h-5 bg-indigo-500 inline-block ml-1 animate-pulse"></span>}
          </p>

          <div className="mt-8 flex items-center justify-between">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
              Step {currentStep + 1} of {STEPS.length}
            </span>
            <div className="flex items-center gap-2 text-[10px] font-black text-indigo-400 uppercase tracking-widest group-hover:translate-x-1 transition-transform">
              {currentStep < STEPS.length - 1 ? 'Next Intelligence' : 'Finish Briefing'}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M13 7l5 5m0 0l-5 5m5-5H6" strokeWidth={3}/></svg>
            </div>
          </div>
        </div>

        {/* Quick Skip */}
        <button 
          onClick={onComplete}
          className="mt-4 text-[9px] font-black text-slate-600 hover:text-indigo-400 uppercase tracking-[0.3em] transition-colors"
        >
          Skip Full Onboarding
        </button>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes scan {
          from { top: -10%; }
          to { top: 110%; }
        }
        .animate-bounce-slow { animation: bounce-slow 4s infinite ease-in-out; }
        .animate-spin-slow { animation: spin-slow 12s infinite linear; }
        .animate-scan { animation: scan 3s infinite linear; }
      `}} />
    </div>
  );
};

export default OnboardingGuide;
