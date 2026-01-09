
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';

// Utility functions for Audio encoding/decoding
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

interface Message {
  role: 'user' | 'model';
  text: string;
}

const AIChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Voice systems online. Tap the mic to start a real-time conversation about sorting logic." }
  ]);

  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const transcriptionRef = useRef({ input: '', output: '' });

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isVoiceActive]);

  const stopVoiceSession = () => {
    setIsVoiceActive(false);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    sourcesRef.current.forEach(source => { try { source.stop(); } catch (e) {} });
    sourcesRef.current.clear();
    nextStartTimeRef.current = 0;
    inputAudioContextRef.current?.close();
    outputAudioContextRef.current?.close();
    inputAudioContextRef.current = null;
    outputAudioContextRef.current = null;
    sessionPromiseRef.current?.then(session => session.close());
    sessionPromiseRef.current = null;
  };

  const startVoiceSession = async () => {
    setConnectionError(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      setIsVoiceActive(true);

      const inputCtx = new AudioContext({ sampleRate: 16000 });
      const outputCtx = new AudioContext({ sampleRate: 24000 });
      inputAudioContextRef.current = inputCtx;
      outputAudioContextRef.current = outputCtx;

      // Ensure contexts are resumed
      await inputCtx.resume();
      await outputCtx.resume();

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            const source = inputCtx.createMediaStreamSource(stream);
            const processor = inputCtx.createScriptProcessor(4096, 1, 1);
            processor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) int16[i] = Math.max(-1, Math.min(1, inputData[i])) * 32767;
              const b64 = encode(new Uint8Array(int16.buffer));
              sessionPromise.then(session => session.sendRealtimeInput({ media: { data: b64, mimeType: 'audio/pcm;rate=16000' } }));
            };
            source.connect(processor);
            processor.connect(inputCtx.destination);
          },
          onmessage: async (msg: LiveServerMessage) => {
            if (msg.serverContent?.inputTranscription) transcriptionRef.current.input += msg.serverContent.inputTranscription.text;
            if (msg.serverContent?.outputTranscription) transcriptionRef.current.output += msg.serverContent.outputTranscription.text;
            if (msg.serverContent?.turnComplete) {
              const inp = transcriptionRef.current.input;
              const out = transcriptionRef.current.output;
              if (inp || out) setMessages(prev => [...prev, ...(inp ? [{ role: 'user', text: inp }] as any : []), ...(out ? [{ role: 'model', text: out }] as any : [])]);
              transcriptionRef.current = { input: '', output: '' };
            }
            const audioB64 = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (audioB64 && outputAudioContextRef.current) {
              const outCtx = outputAudioContextRef.current;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outCtx.currentTime);
              const buffer = await decodeAudioData(decode(audioB64), outCtx, 24000, 1);
              const source = outCtx.createBufferSource();
              source.buffer = buffer;
              source.connect(outCtx.destination);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(source);
              source.onended = () => sourcesRef.current.delete(source);
            }
            if (msg.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => { try { s.stop(); } catch (e) {} });
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onclose: () => stopVoiceSession(),
          onerror: (e) => {
            console.error("Live Error:", e);
            setConnectionError("Link Severed. Network interference or quota limit.");
            stopVoiceSession();
          },
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          systemInstruction: "You are Master Logic, a helpful AI tutor for B.Tech students. Spoken responses must be clear, concise, and technical."
        }
      });
      sessionPromiseRef.current = sessionPromise;
    } catch (err) {
      console.error("Connection Failed:", err);
      setConnectionError("Audio Protocol Inaccessible. Check Microphone and Network.");
      setIsVoiceActive(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[200]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl relative
          ${isOpen ? 'bg-rose-600 rotate-90 scale-90' : 'bg-indigo-600 hover:scale-110 shadow-indigo-600/40'}`}
      >
        {isOpen ? (
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
        ) : (
          <><div className="absolute inset-0 bg-indigo-500 rounded-full animate-ping opacity-20"></div><svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" strokeWidth={2} /></svg></>
        )}
      </button>

      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[380px] h-[600px] glass-card rounded-[3rem] border border-white/10 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-12 duration-300">
          <div className="p-6 border-b border-white/5 flex items-center justify-between bg-slate-900/50 backdrop-blur-2xl">
            <div className="flex items-center gap-4">
              <div className={`w-3 h-3 rounded-full transition-colors ${isVoiceActive ? 'bg-rose-500 animate-pulse' : connectionError ? 'bg-rose-500 shadow-[0_0_10px_rose]' : 'bg-indigo-500'}`}></div>
              <div><h4 className="text-xs font-black text-white uppercase tracking-widest leading-none mb-1">Master Logic</h4><p className="text-[10px] text-indigo-400 font-bold uppercase tracking-tighter">AI Voice Protocol</p></div>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-950/20 custom-scrollbar">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                <div className={`max-w-[85%] p-4 rounded-3xl text-[13px] leading-relaxed shadow-lg ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white/5 text-slate-300 border border-white/10 rounded-tl-none'}`}>{msg.text}</div>
              </div>
            ))}
            {connectionError && <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-[11px] text-rose-300 font-bold text-center animate-in zoom-in-95">{connectionError}</div>}
            {isVoiceActive && (
              <div className="flex flex-col items-center gap-6 py-8"><div className="flex gap-2 items-end h-10">{[...Array(8)].map((_, i) => <div key={i} className="w-1.5 bg-indigo-500 rounded-full animate-voice-wave" style={{ height: `${20 + Math.random() * 80}%`, animationDelay: `${i * 0.1}s` }}></div>)}</div></div>
            )}
          </div>

          <div className="p-8 border-t border-white/5 bg-slate-900/80 backdrop-blur-3xl">
             <button onClick={isVoiceActive ? stopVoiceSession : startVoiceSession} className={`w-full py-5 rounded-2xl flex items-center justify-center gap-4 transition-all duration-500 font-black uppercase text-[11px] tracking-[0.2em] border shadow-2xl ${isVoiceActive ? 'bg-rose-600 border-rose-400 text-white' : 'bg-indigo-600 border-indigo-400 text-white hover:bg-indigo-500'}`}>
                {isVoiceActive ? 'Terminate Link' : 'Sync Voice Protocol'}
             </button>
          </div>
        </div>
      )}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes voice-wave { 0%, 100% { transform: scaleY(0.5); opacity: 0.3; } 50% { transform: scaleY(1.5); opacity: 1; } }
        .animate-voice-wave { animation: voice-wave 0.8s infinite ease-in-out; transform-origin: bottom; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.2); border-radius: 10px; }
      `}} />
    </div>
  );
};

export default AIChatBot;
