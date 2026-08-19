import React, { useState } from 'react';
import { 
  Scissors, 
  Trash2, 
  Sparkles, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  VolumeX, 
  Play, 
  Pause,
  Layers,
  ArrowRight,
  Filter
} from 'lucide-react';
import { TranscriptSegment } from '../../types';
import { INITIAL_TRANSCRIPT } from '../../data/mockData';

interface TextCutEditorProps {
  onApplyCutsToTimeline: (removedSeconds: number) => void;
  onNavigateToEditor?: () => void;
}

export const TextCutEditor: React.FC<TextCutEditorProps> = ({
  onApplyCutsToTimeline,
  onNavigateToEditor,
}) => {
  const [segments, setSegments] = useState<TranscriptSegment[]>(INITIAL_TRANSCRIPT);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedFillerCount, setSelectedFillerCount] = useState(3);
  const [silenceCount, setSilenceCount] = useState(4);
  const [successToast, setSuccessToast] = useState(false);

  // Toggle word deletion
  const toggleWordDeletion = (segmentId: string, wordId: string) => {
    setSegments(prev => prev.map(seg => {
      if (seg.id !== segmentId) return seg;
      return {
        ...seg,
        words: seg.words.map(w => {
          if (w.id !== wordId) return w;
          return { ...w, isDeleted: !w.isDeleted };
        })
      };
    }));
  };

  // Remove all silences
  const handleRemoveAllSilences = () => {
    setSegments(prev => prev.map(seg => ({
      ...seg,
      words: seg.words.map(w => w.isSilence ? { ...w, isDeleted: true } : w)
    })));
    setSilenceCount(0);
    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 3000);
  };

  // Remove all filler words
  const handleRemoveAllFillers = () => {
    setSegments(prev => prev.map(seg => ({
      ...seg,
      words: seg.words.map(w => w.isFiller ? { ...w, isDeleted: true } : w)
    })));
    setSelectedFillerCount(0);
    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 3000);
  };

  // Reset all
  const handleResetAll = () => {
    setSegments(INITIAL_TRANSCRIPT);
    setSelectedFillerCount(3);
    setSilenceCount(4);
  };

  // Calculate total cut seconds
  const totalCutSeconds = segments.reduce((acc, seg) => {
    return acc + seg.words.filter(w => w.isDeleted).reduce((wAcc, w) => wAcc + (w.end - w.start), 0);
  }, 0);

  const handleApply = () => {
    onApplyCutsToTimeline(totalCutSeconds);
    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 3000);
  };

  return (
    <div className="min-h-[calc(100vh-85px)] bg-[#0d1017] text-slate-100 p-4 lg:p-8 space-y-6">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold uppercase tracking-wider">
                IA Text-Based Editing (Whisper V3)
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1 font-['Montserrat',sans-serif]">
              Editor de Corte por Texto (Transcrição Interativa)
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Clique em qualquer palavra ou pausa para deletar o trecho em vídeo diretamente na timeline.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetAll}
              className="px-3 py-2 rounded-xl bg-[#171c2b] hover:bg-[#20273c] text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-[#273044]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restaurar Texto</span>
            </button>
            <button
              onClick={handleApply}
              className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-black font-bold text-xs shadow-lg shadow-cyan-600/25 flex items-center gap-2 transition-all hover:scale-105"
            >
              <Scissors className="w-3.5 h-3.5" />
              <span>Aplicar Cortes na Timeline ({totalCutSeconds.toFixed(1)}s)</span>
            </button>
          </div>
        </div>

        {/* Stats & Quick Actions Toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-[#131724] border border-[#22293d] p-4 rounded-xl flex items-center justify-between shadow-md">
            <div>
              <span className="text-[11px] text-slate-400">Total Transcrito</span>
              <div className="text-lg font-bold text-slate-100 font-mono">142 Palavras</div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-indigo-950/60 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-[#131724] border border-[#22293d] p-4 rounded-xl flex items-center justify-between shadow-md">
            <div>
              <span className="text-[11px] text-slate-400">Silêncios Detectados</span>
              <div className="text-lg font-bold text-amber-400 font-mono">{silenceCount} Pausas (3.4s)</div>
            </div>
            <button
              onClick={handleRemoveAllSilences}
              className="px-2.5 py-1.5 rounded-lg bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 text-[11px] font-semibold flex items-center gap-1"
            >
              <Scissors className="w-3 h-3" />
              <span>Limpar Todos</span>
            </button>
          </div>

          <div className="bg-[#131724] border border-[#22293d] p-4 rounded-xl flex items-center justify-between shadow-md">
            <div>
              <span className="text-[11px] text-slate-400">Vícios de Linguagem</span>
              <div className="text-lg font-bold text-rose-400 font-mono">{selectedFillerCount} Detectados</div>
            </div>
            <button
              onClick={handleRemoveAllFillers}
              className="px-2.5 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 text-[11px] font-semibold flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              <span>Remover Vícios</span>
            </button>
          </div>
        </div>

        {/* 2-Column Main Transcript + Video Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Interactive Document Transcript Area */}
          <div className="lg:col-span-8 bg-[#131724] border border-[#23293c] rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-[#202739] pb-3">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                Documento de Transcrição Whisper AI
              </span>
              <span className="text-[11px] text-slate-400">
                Clique nas palavras para riscar/excluir do vídeo
              </span>
            </div>

            <div className="space-y-6">
              {segments.map((segment) => (
                <div key={segment.id} className="space-y-2 group">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 border-b border-slate-800/60 pb-1">
                    <span className="text-indigo-400 font-semibold">{segment.speaker}</span>
                    <span>{segment.startTime} - {segment.endTime}</span>
                  </div>

                  {/* Words rendering with interactive states */}
                  <div className="flex flex-wrap gap-x-1.5 gap-y-2.5 leading-relaxed text-sm">
                    {segment.words.map((word) => {
                      if (word.isSilence) {
                        return (
                          <button
                            key={word.id}
                            onClick={() => toggleWordDeletion(segment.id, word.id)}
                            className={`px-2 py-0.5 rounded-md text-xs font-mono transition-all flex items-center gap-1 ${
                              word.isDeleted
                                ? 'bg-red-950/60 text-red-400 line-through border border-red-500/40 opacity-50'
                                : 'bg-amber-950/60 text-amber-300 border border-amber-500/40 hover:bg-amber-900/60'
                            }`}
                            title="Clique para cortar ou restaurar esta pausa"
                          >
                            <VolumeX className="w-3 h-3" />
                            <span>[ Pausa {(word.end - word.start).toFixed(1)}s ]</span>
                          </button>
                        );
                      }

                      if (word.isFiller) {
                        return (
                          <button
                            key={word.id}
                            onClick={() => toggleWordDeletion(segment.id, word.id)}
                            className={`px-1.5 py-0.5 rounded-md font-semibold transition-all ${
                              word.isDeleted
                                ? 'bg-red-950/60 text-red-400 line-through border border-red-500/40 opacity-50'
                                : 'bg-rose-950/60 text-rose-300 border border-rose-500/40 hover:bg-rose-900/60'
                            }`}
                            title="Palavra de preenchimento detectada pela IA"
                          >
                            "{word.word}"
                          </button>
                        );
                      }

                      return (
                        <span
                          key={word.id}
                          onClick={() => toggleWordDeletion(segment.id, word.id)}
                          className={`px-1 py-0.5 rounded cursor-pointer transition-colors ${
                            word.isDeleted
                              ? 'bg-red-950/60 text-red-400 line-through decoration-red-500 opacity-40 hover:opacity-80'
                              : 'text-slate-200 hover:bg-indigo-600/30 hover:text-indigo-200'
                          }`}
                        >
                          {word.word}
                        </span>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Instruction Footer */}
            <div className="p-3 bg-[#0d1017] rounded-xl border border-[#202738] text-[11px] text-slate-400 flex items-center justify-between">
              <span>Legenda de Cores:</span>
              <div className="flex items-center gap-4">
                <span className="text-amber-400 font-semibold">• Pausas/Silêncio</span>
                <span className="text-rose-400 font-semibold">• Vício de Fala</span>
                <span className="text-red-400 line-through font-semibold">• Trecho Cortado</span>
              </div>
            </div>
          </div>

          {/* Right Column: Synchronized Preview Player */}
          <div className="lg:col-span-4 bg-[#131724] border border-[#23293c] rounded-2xl p-5 shadow-xl space-y-4 flex flex-col items-center">
            <div className="w-full flex items-center justify-between text-xs font-bold text-slate-300">
              <span>Preview dos Cortes</span>
              <span className="text-cyan-400 font-mono">Sem Gaps</span>
            </div>

            {/* 9:16 Frame */}
            <div className="relative w-full max-w-[240px] aspect-[9/16] rounded-2xl overflow-hidden shadow-2xl bg-black border border-slate-700 flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80"
                alt="Presenter"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />

              {/* Seamless Cut indicator overlay */}
              <div className="absolute top-3 inset-x-3 bg-black/70 backdrop-blur-sm p-2 rounded-xl border border-cyan-500/30 text-center">
                <span className="text-[10px] text-cyan-300 font-bold block">
                  Corte Rápido Inteligente
                </span>
                <span className="text-[9px] text-slate-400">
                  {totalCutSeconds.toFixed(1)}s serão removidos sem saltos bruscos
                </span>
              </div>

              {/* Play Button */}
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-12 h-12 rounded-full bg-cyan-500/90 text-black flex items-center justify-center shadow-xl hover:scale-110 transition-transform"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>
            </div>

            {/* Return to Timeline Button */}
            {onNavigateToEditor && (
              <button
                onClick={onNavigateToEditor}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-indigo-600/25"
              >
                <span>Voltar ao Editor Principal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {successToast && (
              <div className="text-xs text-cyan-400 font-bold flex items-center gap-1.5 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4" />
                <span>Cortes computados e sincronizados!</span>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
