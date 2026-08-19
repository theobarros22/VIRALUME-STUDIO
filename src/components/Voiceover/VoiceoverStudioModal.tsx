import React, { useState, useEffect } from 'react';
import { 
  X, 
  Mic, 
  Sparkles, 
  Play, 
  Pause, 
  Plus, 
  Sliders, 
  Volume2, 
  CheckCircle2, 
  Flame,
  Radio
} from 'lucide-react';
import { TimelineClip } from '../../types';

interface VoiceoverStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddVoiceClip: (clip: TimelineClip) => void;
  currentTime: number;
}

interface VoicePersona {
  id: string;
  name: string;
  category: string;
  gender: 'M' | 'F';
  pitch: number;
  rate: number;
  description: string;
}

const VOICE_PERSONAS: VoicePersona[] = [
  {
    id: 'voice-1',
    name: 'Lucas (Criador Dinâmico)',
    category: 'Viral & Reels',
    gender: 'M',
    pitch: 1.05,
    rate: 1.15,
    description: 'Tom enérgico e acelerado ideal para ganchos virais e tutoriais rápidos.'
  },
  {
    id: 'voice-2',
    name: 'Beatriz (Podcast Profissional)',
    category: 'Storytelling & Pods',
    gender: 'F',
    pitch: 1.0,
    rate: 0.95,
    description: 'Dicção clara, calma e confiante, perfeita para relatos e vídeos explicativos.'
  },
  {
    id: 'voice-3',
    name: 'Arthur (Narrador Épico)',
    category: 'Cinema & Teaser',
    gender: 'M',
    pitch: 0.8,
    rate: 0.9,
    description: 'Grave profundo e imersivo com presença de graves marcante.'
  },
  {
    id: 'voice-4',
    name: 'Mariana (Comercial / Vendas)',
    category: 'Anúncios & E-commerce',
    gender: 'F',
    pitch: 1.1,
    rate: 1.05,
    description: 'Voz persuasiva, calorosa e engajadora com alta taxa de conversão.'
  }
];

export const VoiceoverStudioModal: React.FC<VoiceoverStudioModalProps> = ({
  isOpen,
  onClose,
  onAddVoiceClip,
  currentTime,
}) => {
  const [scriptText, setScriptText] = useState(
    'Descubra como dobrar a retenção dos seus vídeos curtos em menos de 7 dias com estes 3 passos simples!'
  );
  const [selectedVoice, setSelectedVoice] = useState<VoicePersona>(VOICE_PERSONAS[0]);
  const [speed, setSpeed] = useState<number>(1.1);
  const [pitch, setPitch] = useState<number>(1.0);
  const [volume, setVolume] = useState<number>(100);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  if (!isOpen) return null;

  // Speak using Web Speech API
  const handlePreviewSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert('Síntese de voz não suportada neste navegador.');
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(scriptText);
    utterance.lang = 'pt-BR';
    utterance.pitch = pitch * selectedVoice.pitch;
    utterance.rate = speed * selectedVoice.rate;
    utterance.volume = volume / 100;

    // Select Portuguese voice if available
    const voices = window.speechSynthesis.getVoices();
    const ptVoice = voices.find(v => v.lang.startsWith('pt')) || voices[0];
    if (ptVoice) {
      utterance.voice = ptVoice;
    }

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleAddToTimeline = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      const estDuration = Math.max(4, Math.ceil(scriptText.split(' ').length * 0.35 / speed));
      const newClip: TimelineClip = {
        id: `voice-clip-${Date.now()}`,
        trackId: 'audio1',
        name: `🎙️ Voz IA: ${selectedVoice.name.split(' ')[0]}`,
        thumbnailUrl: '',
        startOffset: currentTime,
        duration: estDuration,
        sourceStart: 0,
        sourceDuration: estDuration,
        type: 'audio',
        color: '#10b981',
        isCached: true
      };
      onAddVoiceClip(newClip);
      setSuccessToast('Trilha de voz IA gerada e adicionada na timeline!');
      setTimeout(() => {
        setSuccessToast(null);
        onClose();
      }, 1200);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in select-none">
      <div className="relative w-full max-w-2xl bg-[#131724] border border-[#262e44] rounded-2xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#20273c] bg-[#161a29]">
          <div className="flex items-center gap-2 font-bold text-white text-base">
            <Mic className="w-5 h-5 text-emerald-400" />
            <span>Estúdio de Vozes & Dublagem por IA (Whisper/ElevenLabs)</span>
          </div>
          <button
            onClick={() => {
              if (isPlaying && 'speechSynthesis' in window) window.speechSynthesis.cancel();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#22283d] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar">
          
          {/* Script Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                Roteiro da Locução (Texto para Fala)
              </label>
              <span className="text-[10px] text-slate-500 font-mono">
                {scriptText.length} caracteres • ~{Math.ceil(scriptText.split(' ').length * 0.35 / speed)}s
              </span>
            </div>
            <textarea
              value={scriptText}
              onChange={(e) => setScriptText(e.target.value)}
              rows={3}
              className="w-full bg-[#0e111a] border border-[#262e44] rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors leading-relaxed"
              placeholder="Digite o texto que deseja transformar em voz neural de alta fidelidade..."
            />
          </div>

          {/* Persona Selection */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Selecione a Persona da Voz
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {VOICE_PERSONAS.map(persona => {
                const isSelected = selectedVoice.id === persona.id;
                return (
                  <div
                    key={persona.id}
                    onClick={() => setSelectedVoice(persona)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/40 shadow-lg'
                        : 'bg-[#181d2c] border-[#252c3f] hover:border-slate-500'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-white">{persona.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-black/40 text-emerald-300 border border-emerald-500/30">
                        {persona.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                      {persona.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Voice Tuning Controls */}
          <div className="bg-[#171c2b] p-4 rounded-xl border border-[#252d42] space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-200">
              <span className="flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                Ajuste Fino de Entonação & Velocidade
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Velocidade:</span>
                  <span className="font-mono text-emerald-400">{speed.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.7"
                  max="1.5"
                  step="0.1"
                  value={speed}
                  onChange={(e) => setSpeed(parseFloat(e.target.value))}
                  className="w-full accent-emerald-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Tom (Pitch):</span>
                  <span className="font-mono text-emerald-400">{pitch.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.6"
                  max="1.4"
                  step="0.1"
                  value={pitch}
                  onChange={(e) => setPitch(parseFloat(e.target.value))}
                  className="w-full accent-emerald-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Volume:</span>
                  <span className="font-mono text-emerald-400">{volume}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => setVolume(parseInt(e.target.value))}
                  className="w-full accent-emerald-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>

          {successToast && (
            <div className="p-3 bg-emerald-950/80 border border-emerald-500 rounded-xl text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{successToast}</span>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#20273c] bg-[#161a29]">
          <button
            onClick={handlePreviewSpeech}
            className="px-4 py-2 rounded-xl bg-[#1f2639] hover:bg-[#28324a] text-slate-200 text-xs font-semibold flex items-center gap-2 transition-colors border border-[#2b354e]"
          >
            {isPlaying ? <Pause className="w-4 h-4 text-emerald-400" /> : <Play className="w-4 h-4 text-emerald-400" />}
            <span>{isPlaying ? 'Parar Áudio' : 'Ouvir Prévia da Voz'}</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (isPlaying && 'speechSynthesis' in window) window.speechSynthesis.cancel();
                onClose();
              }}
              className="px-4 py-2 rounded-xl bg-[#1c2233] hover:bg-[#252c42] text-slate-300 text-xs font-semibold transition-colors"
            >
              Cancelar
            </button>

            <button
              onClick={handleAddToTimeline}
              disabled={isGenerating}
              className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold shadow-lg shadow-emerald-500/25 flex items-center gap-2 transition-all hover:scale-105 disabled:opacity-50"
            >
              <Plus className="w-4 h-4 text-black" />
              <span>{isGenerating ? 'Renderizando Voz...' : 'Adicionar à Timeline'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
