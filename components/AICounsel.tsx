
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AlgorithmType } from '../types';
import { startChatSession, generateVoiceOutput } from '../services/geminiService';
import { GenerateContentResponse } from '@google/genai';

interface AICounselProps {
  algorithm: AlgorithmType;
}

interface Message {
  role: 'user' | 'model';
  text: string;
  isSpeaking?: boolean;
  isError?: boolean;
}

const AICounsel: React.FC<AICounselProps> = ({ algorithm }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  
  const chatSessionRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const currentAudioSourceRef = useRef<AudioBufferSourceNode | null>(null);

  const initSession = useCallback(() => {
    chatSessionRef.current = startChatSession(algorithm);
    setMessages([
      { 
        role: 'model', 
        text: `**SYNC PROTOCOL ACTIVE**. I am Master Logic. We are currently analyzing **${algorithm}**. \n\nYou can ask me about implementation, complexity, or your **Research Labs**. How shall we proceed?`
      }
    ]);
  }, [algorithm]);

  useEffect(() => {
    initSession();
    return () => stopAudio();
  }, [initSession]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const stopAudio = () => {
    if (currentAudioSourceRef.current) {
      try { currentAudioSourceRef.current.stop(); } catch (e) {}
      currentAudioSourceRef.current = null;
    }
    setMessages(prev => prev.map(m => ({ ...m, isSpeaking: false })));
  };

  const playVoice = async (text: string, msgIdx: number) => {
    stopAudio();
    const cleanText = text.replace(/[*_#`~]/g, '').slice(0, 300);
    try {
      const b64Data = await generateVoiceOutput(cleanText);
      if (b64Data) {
        if (!audioContextRef.current) audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        const ctx = audioContextRef.current;
        const bytes = atob(b64Data);
        const data = new Uint8Array(bytes.length);
        for (let i = 0; i < bytes.length; i++) data[i] = bytes.charCodeAt(i);
        const dataInt16 = new Int16Array(data.buffer);
        const buffer = ctx.createBuffer(1, dataInt16.length, 24000);
        const channelData = buffer.getChannelData(0);
        for (let i = 0; i < dataInt16.length; i++) channelData[i] = dataInt16[i] / 32768.0;

        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        currentAudioSourceRef.current = source;
        setMessages(prev => prev.map((m, i) => i === msgIdx ? { ...m, isSpeaking: true } : m));
        source.onended = () => {
          setMessages(prev => prev.map((m, i) => i === msgIdx ? { ...m, isSpeaking: false } : m));
          currentAudioSourceRef.current = null;
        };
        source.start();
      }
    } catch (e) { console.warn("TTS Synthesis failed"); }
  };

  const handleSendMessage = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isTyping || cooldown > 0 || !chatSessionRef.current) return;

    const userText = input.trim();
    setInput('');
    setIsTyping(true);

    setMessages(prev => [
      ...prev, 
      { role: 'user', text: userText },
      { role: 'model', text: '' }
    ]);

    try {
      const stream = await chatSessionRef.current.sendMessageStream({ message: userText });
      
      for await (const chunk of stream) {
        const c = chunk as GenerateContentResponse;
        if (c.text) {
          setMessages(prev => {
            const updated = [...prev];
            const lastMsg = updated[updated.length - 1];
            if (lastMsg && lastMsg.role === 'model') {
              updated[updated.length - 1] = { ...lastMsg, text: lastMsg.text + c.text };
            }
            return updated;
          });
        }
      }
    } catch (error: any) {
      console.error("Master Logic Stream Error:", error);
      const errorStr = JSON.stringify(error).toLowerCase();
      const isQuota = errorStr.includes('429') || errorStr.includes('quota') || errorStr.includes('resource_exhausted');
      
      if (isQuota) {
        setCooldown(30); // Impose a 30s cooling off period
      }

      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { 
          role: 'model', 
          text: isQuota 
            ? "⚠️ **NEURAL CAPACITY REACHED (429)**. The Logic Core is currently throttled by external rate limits. \n\n**Protocol:** Wait for the cooling period to expire before initiating a new sync attempt."
            : "❌ **LINK SEVERED**. A connection timeout or protocol violation occurred. Attempting to re-sync logic core...", 
          isError: true
        };
        return updated;
      });
    } finally {
      setIsTyping(false);
    }
  }, [input, isTyping, cooldown]);

  return (
    <div className="flex flex-col h-full bg-slate-900/40 rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl relative">
      <div className="p-6 border-b border-white/5 bg-slate-900/60 backdrop-blur-2xl flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`w-3 h-3 rounded-full transition-all duration-500 
            ${isTyping ? 'bg-indigo-500 animate-pulse shadow-[0_0_15px_indigo]' : cooldown > 0 ? 'bg-amber-500 shadow-[0_0_10px_amber]' : 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,1)]'}`}>
          </div>
          <div>
            <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-white">Master Logic Advisor</h3>
            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-0.5">
              {cooldown > 0 ? `Cooling Down (${cooldown}s)` : isTyping ? 'Synthesizing...' : 'Link Healthy'}
            </p>
          </div>
        </div>
        <button 
          onClick={initSession}
          className="p-2 hover:bg-white/5 rounded-lg transition-colors text-slate-500 hover:text-indigo-400"
          title="Reset Session"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeWidth={2.5}/></svg>
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar bg-grid-small">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-4 duration-500`}>
            <div className={`max-w-[90%] p-6 rounded-[2.2rem] text-[14px] leading-relaxed shadow-xl
              ${msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-none border-t border-white/20' 
                : `glass-card text-slate-200 rounded-tl-none border-white/10 ${msg.isError ? 'border-amber-500/30 bg-amber-500/5' : ''}`}`}>
              
              <div className="whitespace-pre-wrap font-medium">
                {msg.text || (isTyping && i === messages.length - 1 ? 'Streaming...' : '')}
              </div>

              {msg.isError && (
                <div className="mt-4 flex flex-col gap-3">
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 transition-all duration-1000" style={{ width: `${(cooldown / 30) * 100}%` }}></div>
                  </div>
                  <button 
                    onClick={initSession}
                    disabled={cooldown > 0}
                    className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/10 disabled:opacity-20"
                  >
                    Force Protocol Re-Sync
                  </button>
                </div>
              )}

              {msg.role === 'model' && msg.text && !msg.isError && (
                <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-4">
                    <button 
                      onClick={() => msg.isSpeaking ? stopAudio() : playVoice(msg.text, i)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-500 text-[10px] font-black uppercase tracking-widest
                        ${msg.isSpeaking 
                          ? 'bg-rose-600 text-white shadow-[0_0_10px_rose]' 
                          : 'bg-white/5 text-slate-500 hover:text-white hover:bg-white/10'}`}
                    >
                      {msg.isSpeaking ? 'Mute' : 'Audio Feed'}
                    </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="p-8 bg-slate-900/80 border-t border-white/5 backdrop-blur-3xl">
        <form onSubmit={handleSendMessage} className="flex gap-4">
          <input
            type="text"
            placeholder={cooldown > 0 ? `System cooling down: ${cooldown}s remaining...` : "Ask a technical question..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isTyping || cooldown > 0}
            className="flex-1 bg-slate-950 border border-white/10 rounded-2xl py-5 px-8 text-sm text-white focus:border-indigo-500 outline-none transition-all placeholder-slate-700 disabled:opacity-50"
          />
          <button 
            type="submit" 
            disabled={!input.trim() || isTyping || cooldown > 0} 
            className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white transition-all shadow-3xl border-t border-white/20
              ${cooldown > 0 ? 'bg-slate-800 text-slate-600 grayscale' : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30 active:scale-90'}`}
          >
            {cooldown > 0 ? (
              <span className="text-[10px] font-black font-mono">{cooldown}</span>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M5 12h14M12 5l7 7-7 7" strokeWidth={3}/></svg>
            )}
          </button>
        </form>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .bg-grid-small { background-size: 20px 20px; background-image: radial-gradient(circle, rgba(255,255,255,0.01) 1px, transparent 1px); }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.2); border-radius: 10px; }
      `}} />
    </div>
  );
};

export default AICounsel;
