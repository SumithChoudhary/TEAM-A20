
import React, { useState } from 'react';

const FeedbackPanel: React.FC = () => {
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating) {
      setIsSubmitted(true);
      // In a real app, this would hit an API
    }
  };

  const communityNotes = [
    { user: "Rahul S.", text: "The Hand Analogy for Insertion sort finally clicked!", date: "2m ago" },
    { user: "Ananya K.", text: "Pivot selection in Quick Sort is so much clearer now.", date: "15m ago" },
    { user: "Kevin M.", text: "O(n log n) visuals are fire. 🔥", date: "1h ago" }
  ];

  return (
    <div className="glass-card rounded-[2rem] p-6 border border-white/5 flex flex-col gap-8 shadow-2xl overflow-hidden relative">
      <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 blur-2xl -mr-12 -mt-12"></div>
      
      {/* Header */}
      <div className="relative">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 mb-2">Research Insights</h3>
        <p className="text-xs text-slate-500 leading-relaxed">Continuous analysis of student comprehension across the foundations module.</p>
      </div>

      {/* Community Stream */}
      <div className="space-y-4">
        <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-600 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Live Feed
        </h4>
        <div className="space-y-3">
          {communityNotes.map((note, i) => (
            <div key={i} className="bg-white/5 border border-white/5 p-3 rounded-xl hover:bg-white/10 transition-all cursor-default group">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-black text-indigo-300">{note.user}</span>
                <span className="text-[8px] font-mono text-slate-600">{note.date}</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-tight group-hover:text-slate-300">{note.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* User Input Section */}
      <div className="pt-6 border-t border-white/5">
        {isSubmitted ? (
          <div className="text-center py-4 animate-in zoom-in duration-500">
            <div className="w-12 h-12 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3 text-xl">✓</div>
            <h4 className="text-sm font-black text-white">Insight Logged</h4>
            <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest">Feedback transmitted to AI core.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-600">Rate Module Clarity</h4>
            <div className="flex justify-between gap-1">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setRating(num)}
                  className={`w-10 h-10 rounded-xl font-black text-xs transition-all border
                    ${rating === num 
                      ? 'bg-indigo-600 text-white border-indigo-400 shadow-lg shadow-indigo-600/30' 
                      : 'bg-white/5 text-slate-500 border-white/5 hover:border-indigo-500/30'}`}
                >
                  {num}
                </button>
              ))}
            </div>
            <textarea
              placeholder="Any specific concepts we should optimize?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full h-20 bg-white/5 border border-white/5 rounded-xl p-3 text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 transition-all resize-none"
            />
            <button
              type="submit"
              disabled={!rating}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-indigo-600/20 active:scale-95 border-t border-white/20"
            >
              Submit Feedback
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default FeedbackPanel;
