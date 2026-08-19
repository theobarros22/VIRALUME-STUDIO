import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  Languages, 
  Scissors, 
  Zap, 
  ArrowRight, 
  FileText, 
  Type, 
  Play, 
  Pause, 
  Flame, 
  Volume2, 
  Instagram, 
  RefreshCw, 
  Clock 
} from 'lucide-react';
import { CaptionStyleConfig, ProjectData, TranscriptSegment } from '../../types';
import { generateTranscriptForDuration } from '../../utils/transcriptGenerator';

interface VideoTranscriptionWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoFileName?: string;
  videoDurationSec?: number;
  onApplyTranscription: (transcript: TranscriptSegment[], captionConfig: Partial<CaptionStyleConfig>) => void;
}

export const VideoTranscriptionWizardModal: React.FC<VideoTranscriptionWizardModalProps> = ({
  isOpen,
  onClose,
  videoFileName = 'meu_video_reels.mp4',
  videoDurationSec = 30,
  onApplyTranscription,
}) => {
  const [step, setStep] = useState<'transcribing' | 'review' | 'style'>('transcribing');
  const [progress, setProgress] = useState(0);
  const [language, setLanguage] = useState('pt-BR');
  const [removeFillers, setRemoveFillers] = useState(true);
  const [selectedPreset, setSelectedPreset] = useState<'viral_energetic' | 'podcast_clean' | 'tiktok_bounce' | 'karaoke_glow' | 'minimal_elegant'>('viral_energetic');
  const [highlightColor, setHighlightColor] = useState('#FFE600');
  const [wordsPerLine, setWordsPerLine] = useState<'single' | 'short' | 'full'>('single');
  const [generatedTranscript, setGeneratedTranscript] = useState<TranscriptSegment[]>(() => generateTranscriptForDuration(videoDurationSec || 30));

  // Transcribe progress simulation on open
  useEffect(() => {
    if (!isOpen) {
      setStep('transcribing');
      setProgress(0);
      return;
    }

    setGeneratedTranscript(generateTranscriptForDuration(videoDurationSec || 30));
    setStep('transcribing');
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 98) {
          clearInterval(interval);
          setStep('review');
          return 100;
        }
        return prev + 14;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [isOpen, videoDurationSec]);

  if (!isOpen) return null;

  const handleApply = () => {
    onApplyTranscription(generatedTranscript, {
      preset: selectedPreset,
      highlightColor,
      hasOutline: true,
      hasShadow: true,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in select-none">
      <div className="relative w-full max-w-3xl bg-[#121624] border border-[#252c42] rounded-2xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#20273c] bg-[#161a2b]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-extrabold text-white text-base font-['Montserrat',sans-serif]">
                Transcrição & Legendas Automáticas por IA
              </h2>
              <p className="text-xs text-slate-400">
                Arquivo: <span className="text-indigo-300 font-mono">{videoFileName}</span> ({videoDurationSec.toFixed(0)}s)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#22283d] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* STEP 1: Transcribing Progress Screen */}
          {step === 'transcribing' && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-5">
              <div className="relative w-20 h-20 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
                <div className="w-14 h-14 rounded-full bg-indigo-950/80 flex items-center justify-center text-indigo-400">
                  <Volume2 className="w-6 h-6 animate-pulse" />
                </div>
              </div>

              <div className="space-y-1 max-w-sm">
                <h3 className="text-base font-bold text-white">
                  Transcrevendo Áudio com Whisper AI...
                </h3>
                <p className="text-xs text-slate-400">
                  Detectando fala, separando palavras por milissegundo e gerando timestamps sincronizados.
                </p>
              </div>

              {/* Progress Bar */}
              <div className="w-full max-w-md space-y-1.5">
                <div className="h-2 w-full bg-[#1e2538] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-500 transition-all duration-200"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] font-mono text-slate-400">
                  <span>Processando fala...</span>
                  <span className="text-indigo-400 font-bold">{progress}%</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Review and Style Captions */}
          {step !== 'transcribing' && (
            <div className="space-y-6">
              
              {/* Top Navigation Steps */}
              <div className="flex items-center justify-between border-b border-[#20273c] pb-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setStep('review')}
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                      step === 'review'
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-400 hover:text-slate-200 bg-[#161a28]'
                    }`}
                  >
                    1. Texto Transcrito ({generatedTranscript.reduce((acc, seg) => acc + seg.words.length, 0)} palavras)
                  </button>
                  <button
                    onClick={() => setStep('style')}
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                      step === 'style'
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-400 hover:text-slate-200 bg-[#161a28]'
                    }`}
                  >
                    2. Estilo da Legenda
                  </button>
                </div>

                <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Áudio Transcrito com Sucesso</span>
                </div>
              </div>

              {/* View 1: Review Transcript */}
              {step === 'review' && (
                <div className="space-y-4">
                  <div className="text-xs text-slate-400 flex items-center justify-between">
                    <span>Revise as falas identificadas no vídeo. As palavras com cores terão animação de destaque:</span>
                  </div>

                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                    {generatedTranscript.map((seg, idx) => (
                      <div key={seg.id} className="p-3 bg-[#161b29] rounded-xl border border-[#252e44] space-y-2">
                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                          <span className="font-semibold text-indigo-300">Fala #{idx + 1}</span>
                          <span className="font-mono bg-[#0f121d] px-2 py-0.5 rounded border border-[#20273b]">{seg.timestamp}</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {seg.words.map((w) => (
                            <span 
                              key={w.id}
                              className={`text-xs px-1.5 py-0.5 rounded font-medium border ${
                                w.highlightColor
                                  ? 'bg-amber-400/20 text-yellow-300 border-amber-400/40 font-bold'
                                  : 'bg-[#10131e] text-slate-200 border-[#22293d]'
                              }`}
                            >
                              {w.word}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Settings Bar */}
                  <div className="p-3 bg-[#0f121e] rounded-xl border border-[#20273c] flex items-center justify-between flex-wrap gap-3">
                    <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={removeFillers} 
                        onChange={(e) => setRemoveFillers(e.target.checked)}
                        className="rounded accent-indigo-500"
                      />
                      <span>Remover pausas longas e vícios de linguagem automaticamente</span>
                    </label>

                    <button
                      onClick={() => setStep('style')}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all"
                    >
                      <span>Avançar para Estilos</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* View 2: Style Selector */}
              {step === 'style' && (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { id: 'viral_energetic', name: 'Instagram Viral Pop', desc: 'Fundo amarelo estilo quadrinhos com animação rápida.', icon: Flame, color: '#FFE600' },
                      { id: 'podcast_clean', name: 'Podcast Clean', desc: 'Caixa escura translúcida e tipografia moderna.', icon: Volume2, color: '#FFFFFF' },
                      { id: 'tiktok_bounce', name: 'Gradiente Neon', desc: 'Cores vibrantes ciano e fúcsia com efeito de pulso.', icon: Zap, color: '#00e5ff' },
                      { id: 'karaoke_glow', name: 'Karaokê Glow', desc: 'Destaque palavra a palavra com brilho neon.', icon: Sparkles, color: '#a855f7' },
                      { id: 'minimal_elegant', name: 'Minimalista Elegante', desc: 'Estilo clean e sofisticado para conteúdos reflexivos.', icon: Type, color: '#fef08a' },
                    ].map((style) => {
                      const Icon = style.icon;
                      const isSelected = selectedPreset === style.id;
                      return (
                        <div
                          key={style.id}
                          onClick={() => {
                            setSelectedPreset(style.id as any);
                            setHighlightColor(style.color);
                          }}
                          className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                            isSelected
                              ? 'bg-indigo-950/60 border-indigo-500 ring-2 ring-indigo-500/40 shadow-lg'
                              : 'bg-[#151928] border-[#252d42] hover:bg-[#1a2033]'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <Icon className="w-4 h-4 text-indigo-400" />
                              {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
                            </div>
                            <h4 className="text-xs font-bold text-white mb-1">{style.name}</h4>
                            <p className="text-[11px] text-slate-400">{style.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Highlight Color Picker */}
                  <div className="p-4 bg-[#141826] rounded-xl border border-[#232a3d] flex items-center justify-between flex-wrap gap-3">
                    <div className="text-xs font-bold text-slate-200">
                      Cor de Destaque das Palavras-Chave:
                    </div>
                    <div className="flex items-center gap-2">
                      {['#FFE600', '#00e5ff', '#38ef7d', '#f43f5e', '#a855f7', '#ffffff'].map((color) => (
                        <button
                          key={color}
                          onClick={() => setHighlightColor(color)}
                          className={`w-6 h-6 rounded-full border-2 transition-transform ${
                            highlightColor === color ? 'scale-125 border-white ring-2 ring-indigo-500' : 'border-black/50 hover:scale-110'
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

        {/* Modal Footer */}
        {step !== 'transcribing' && (
          <div className="px-6 py-4 border-t border-[#20273c] bg-[#121626] flex items-center justify-between">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#1c2236] text-xs font-medium transition-colors"
            >
              Cancelar
            </button>

            <button
              onClick={handleApply}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-600 hover:from-indigo-500 hover:to-rose-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all hover:scale-105"
            >
              <Sparkles className="w-4 h-4" />
              <span>Gerar Legendas e Inserir na Timeline</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
