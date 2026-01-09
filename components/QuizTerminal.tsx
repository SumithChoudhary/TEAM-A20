
import React, { useState } from 'react';
import { TRACK_QUIZZES } from '../constants';

interface QuizTerminalProps {
  quizId: string;
  onComplete: (quizId: string, score: number) => void;
  onFeedback: (msg: string) => void;
}

const QuizTerminal: React.FC<QuizTerminalProps> = ({ quizId, onComplete, onFeedback }) => {
  const quiz = TRACK_QUIZZES[quizId];
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  if (!quiz) return <div>Quiz Not Found</div>;

  const currentQuestion = quiz.questions[currentQuestionIdx];

  const handleOptionSelect = (idx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);
    setShowExplanation(true);
    
    if (idx === currentQuestion.correctAnswer) {
      setScore(s => s + 1);
      onFeedback("Correct logic identified. Accuracy within expected bounds.");
    } else {
      onFeedback("Logic error detected. Cross-referencing conceptual data...");
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIdx < quiz.questions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setIsFinished(true);
      onComplete(quizId, score + (selectedOption === currentQuestion.correctAnswer ? 1 : 0));
    }
  };

  if (isFinished) {
    return (
      <div className="h-full flex flex-col items-center justify-center glass-card rounded-[3rem] p-12 text-center space-y-8 animate-in zoom-in duration-1000">
        <div className="w-24 h-24 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center text-4xl font-black shadow-lg shadow-emerald-500/20">✓</div>
        <div>
          <h2 className="text-4xl font-black text-white mb-2 tracking-tighter">Assessment Complete</h2>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Diagnostic Suite Synchronization Success</p>
        </div>
        <div className="flex flex-col items-center gap-2">
           <span className="text-6xl font-black font-mono text-indigo-400">{score}/3</span>
           <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Accuracy Rating</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full glass-card rounded-[3.5rem] p-8 md:p-16 flex flex-col gap-12 border border-white/5 relative overflow-hidden shadow-2xl">
      <div className="absolute top-0 left-0 w-full h-1.5 bg-white/5">
        <div className="h-full bg-indigo-500 transition-all duration-700" style={{ width: `${(currentQuestionIdx / quiz.questions.length) * 100}%` }}></div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-xs font-black text-indigo-400 border border-indigo-500/20">Q{currentQuestionIdx + 1}</div>
          <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest">{quiz.title}</h3>
        </div>
        <span className="text-[10px] font-mono text-indigo-400 font-black">SYSTEM STATUS: EVALUATING</span>
      </div>

      <div className="flex-1 space-y-12">
        <h2 className="text-2xl md:text-3xl font-black text-white leading-tight tracking-tight max-w-2xl">{currentQuestion.question}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentQuestion.options.map((option, idx) => {
            let stateClass = 'border-white/5 bg-white/5 text-slate-400 hover:border-indigo-500/50 hover:bg-white/10';
            if (selectedOption !== null) {
              if (idx === currentQuestion.correctAnswer) stateClass = 'border-emerald-500 bg-emerald-500/10 text-emerald-400';
              else if (idx === selectedOption) stateClass = 'border-rose-500 bg-rose-500/10 text-rose-400';
              else stateClass = 'opacity-20 border-white/5 text-slate-600';
            }

            return (
              <button
                key={idx}
                onClick={() => handleOptionSelect(idx)}
                className={`p-6 rounded-2xl border-2 transition-all duration-300 text-left font-bold text-sm flex items-center gap-4 ${stateClass}`}
              >
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black border ${selectedOption === idx ? 'border-current' : 'border-white/10'}`}>
                  {String.fromCharCode(65 + idx)}
                </div>
                {option}
              </button>
            );
          })}
        </div>
      </div>

      {showExplanation && (
        <div className="p-6 bg-indigo-500/5 border border-indigo-500/20 rounded-3xl animate-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-start gap-4">
             <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shrink-0 mt-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth={3}/></svg>
             </div>
             <div>
               <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Conceptual Breakdown</h4>
               <p className="text-xs text-slate-300 leading-relaxed font-medium">{currentQuestion.explanation}</p>
             </div>
          </div>
          <button 
            onClick={nextQuestion}
            className="w-full mt-6 py-4 bg-white text-slate-950 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-indigo-50 transition-colors shadow-lg active:scale-95"
          >
            {currentQuestionIdx === quiz.questions.length - 1 ? 'Archive Assessment' : 'Proceed to Next Logic Gate'}
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizTerminal;
