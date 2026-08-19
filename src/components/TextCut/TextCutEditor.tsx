import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Scissors, 
  Trash2, 
  Sparkles, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  VolumeX, 
  Volume2,
  Play, 
  Pause, 
  Layers, 
  ArrowRight, 
  Filter,
  Clock
} from 'lucide-react';
import { ProjectData, TranscriptSegment, TranscriptWord } from '../../types';
import { INITIAL_TRANSCRIPT } from '../../data/mockData';
import { generateTranscriptForDuration } from '../../utils/transcriptGenerator';

interface TextCutEditorProps {
  onApplyCutsToTimeline: (removedSeconds: number) => void;
  onNavigateToEditor?: () => void;
  project?: ProjectData;
}

export const TextCutEditor: React.FC<TextCutEditorProps> = ({
  onApplyCutsToTimeline,
  onNavigateToEditor,
  project,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const totalDuration = project?.durationSec || 30;

  const initialTranscriptSegments = useMemo(() => {
    if (project?.transcript && project.transcript.length > 0) {
      return project.transcript;
    }
    return generateTranscriptForDuration(totalDuration, project?.name);
  }, [project?.transcript, totalDuration, project?.name]);

  const [segments, setSegments] = useState<TranscriptSegment[]>(initialTranscriptSegments);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [selectedFillerCount, setSelectedFillerCount] = useState<number>(3);
  const [silenceCount, setSilenceCount] = useState<number>(4);
  const [successToast, setSuccessToast] = useState<boolean>(false);
  const [editingWordId, setEditingWordId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState<string>('');

  const isRealVideo = Boolean(project?.videoFileUrl);

  // REAL-TIME LISTENER VINCULADO AO videoRef
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      video.currentTime = 0;
      setCurrentTime(0);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [project?.videoFileUrl]);

  // RequestAnimationFrame simulation / smooth tracking loop
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    if (isPlaying) {
      const step = (now: number) => {
        if (videoRef.current && isRealVideo) {
          setCurrentTime(videoRef.current.currentTime);
        } else {
          const dt = (now - lastTime) / 1000;
          lastTime = now;
          setCurrentTime((prev) => {
            const next = prev + dt;
            if (next >= totalDuration) {
              setIsPlaying(false);
              return 0;
            }
            return next;
          });
        }
        animId = requestAnimationFrame(step);
      };

      lastTime = performance.now();
      animId = requestAnimationFrame(step);
    }

    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [isPlaying, isRealVideo, totalDuration]);

  // Active TranscriptSegment and Word calculation
  const activeSegment = useMemo(() => {
    if (!segments || segments.length === 0) return null;
    return segments.find((seg) => currentTime >= seg.start && currentTime <= seg.end) || null;
  }, [segments, currentTime]);

  const activeWord = useMemo(() => {
    if (!activeSegment || !activeSegment.words) return null;
    return activeSegment.words.find(
      (w) => currentTime >= w.start && currentTime <= w.end && !w.isDeleted
    ) || null;
  }, [activeSegment, currentTime]);

  // Seek handler
  const handleSeek = (time: number) => {
    const clamped = Math.max(0, Math.min(time, totalDuration));
    setCurrentTime(clamped);
    if (videoRef.current) {
      videoRef.current.currentTime = clamped;
    }
  };

  // Toggle Play
  const handleTogglePlay = () => {
    if (videoRef.current && isRealVideo) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  // Double click to edit word text
  const handleStartEditWord = (e: React.MouseEvent, word: { id: string; word: string }) => {
    e.stopPropagation();
    setEditingWordId(word.id);
    setEditingText(word.word);
  };

  const handleSaveWordEdit = (segmentId: string, wordId: string) => {
    if (!editingText.trim()) {
      setEditingWordId(null);
      return;
    }
    setSegments((prev) =>
      prev.map((seg) => {
        if (seg.id !== segmentId) return seg;
        return {
          ...seg,
          words: seg.words.map((w) => {
            if (w.id !== wordId) return w;
            return { ...w, word: editingText.trim() };
          }),
        };
      })
    );
    setEditingWordId(null);
  };

  // Toggle word deletion
  const toggleWordDeletion = (segmentId: string, wordId: string) => {
    setSegments((prev) =>
      prev.map((seg) => {
        if (seg.id !== segmentId) return seg;
        return {
          ...seg,
          words: seg.words.map((w) => {
            if (w.id !== wordId) return w;
            return { ...w, isDeleted: !w.isDeleted };
          }),
        };
      })
    );
  };

  // Remove all silences
  const handleRemoveAllSilences = () => {
    setSegments((prev) =>
      prev.map((seg) => ({
        ...seg,
        words: seg.words.map((w) => (w.isSilence ? { ...w, isDeleted: true } : w)),
      }))
    );
    setSilenceCount(0);
    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 3000);
  };

  // Remove all filler words
  const handleRemoveAllFillers = () => {
    setSegments((prev) =>
      prev.map((seg) => ({
        ...seg,
        words: seg.words.map((w) => (w.isFiller ? { ...w, isDeleted: true } : w)),
      }))
    );
    setSelectedFillerCount(0);
    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 3000);
  };

  // Reset all
  const handleResetAll = () => {
    setSegments(initialTranscriptSegments);
    setSelectedFillerCount(3);
    setSilenceCount(4);
  };

  // Calculate total cut seconds
  const totalCutSeconds = segments.reduce((acc, seg) => {
    return (
      acc +
      seg.words
        .filter((w) => w.isDeleted)
        .reduce((wAcc, w) => wAcc + (w.end - w.start), 0)
    );
  }, 0);

  const handleApply = () => {
    onApplyCutsToTimeline(totalCutSeconds);
    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 3000);
  };

  const formatTimecode = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 10);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms}`;
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
              Clique em qualquer palavra ou pausa para deletar o trecho em vídeo diretamente na timeline com sincronização em tempo real.
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
              <span className="text-[11px] text-slate-400">Total de Segmentos</span>
              <div className="text-lg font-bold text-slate-100 font-mono">{segments.length} Frases Sincronizadas</div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-indigo-950/60 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-[#131724] border border-[#22293d] p-4 rounded-xl flex items-center justify-between shadow-md">
            <div>
              <span className="text-[11px] text-slate-400">Silêncios Detectados</span>
              <div className="text-lg font-bold text-amber-400 font-mono">{silenceCount} Pausas ({totalCutSeconds > 0 ? totalCutSeconds.toFixed(1) : '3.4'}s)</div>
            </div>
            <button
              onClick={handleRemoveAllSilences}
              className="px-2.5 py-1.5 rounded-lg bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 text-[11px] font-semibold flex items-center gap-1 transition-colors"
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
              className="px-2.5 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 text-[11px] font-semibold flex items-center gap-1 transition-colors"
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
                Clique nas palavras para riscar/excluir • Duplo clique para editar texto
              </span>
            </div>

            <div className="space-y-4 max-h-[480px] overflow-y-auto pr-2 custom-scrollbar">
              {segments.map((segment) => {
                const isActiveSegment = activeSegment?.id === segment.id;
                return (
                  <div 
                    key={segment.id} 
                    id={`cut-segment-${segment.id}`}
                    onClick={() => handleSeek(segment.start)}
                    className={`transcript-segment p-3.5 rounded-xl border transition-all duration-150 cursor-pointer space-y-2 group ${
                      isActiveSegment 
                        ? 'active bg-indigo-600/30 border-indigo-500 shadow-md ring-2 ring-indigo-500/40 text-white font-medium'
                        : 'bg-[#161a29] border-[#222838] hover:bg-[#1a2033] hover:border-slate-600 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 border-b border-slate-800/80 pb-1.5">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isActiveSegment ? 'bg-indigo-500 text-white' : 'bg-[#10131d] text-slate-400'
                        }`}>
                          {segment.speaker}
                        </span>
                        <span className={isActiveSegment ? 'text-indigo-300 font-bold' : 'text-slate-400'}>
                          {formatTimecode(segment.start)} - {formatTimecode(segment.end)}
                        </span>
                      </div>
                      
                      {isActiveSegment && (
                        <span className="text-[10px] text-amber-300 font-bold bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/40 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                          EM EXECUÇÃO
                        </span>
                      )}
                    </div>

                    {/* Words rendering with interactive states & active class */}
                    <div className="flex flex-wrap gap-x-1.5 gap-y-2.5 leading-relaxed text-sm">
                      {segment.words.map((word) => {
                        const isActiveWord = isActiveSegment && activeWord?.id === word.id;

                        if (word.isSilence) {
                          return (
                            <button
                              key={word.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleWordDeletion(segment.id, word.id);
                              }}
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
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleWordDeletion(segment.id, word.id);
                              }}
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

                        if (editingWordId === word.id) {
                          return (
                            <input
                              key={word.id}
                              autoFocus
                              type="text"
                              value={editingText}
                              onChange={(e) => setEditingText(e.target.value)}
                              onBlur={() => handleSaveWordEdit(segment.id, word.id)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveWordEdit(segment.id, word.id);
                                if (e.key === 'Escape') setEditingWordId(null);
                              }}
                              className="px-1.5 py-0.5 rounded bg-indigo-900 text-white font-semibold text-xs border border-indigo-400 outline-none shadow-md w-24"
                            />
                          );
                        }

                        return (
                          <span
                            key={word.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSeek(word.start);
                            }}
                            onDoubleClick={(e) => handleStartEditWord(e, word)}
                            title="1 clique: Pular no vídeo | 2 cliques: Editar texto"
                            className={`transcript-word px-1.5 py-0.5 rounded cursor-pointer transition-all duration-100 ${
                              word.isDeleted
                                ? 'bg-red-950/60 text-red-400 line-through decoration-red-500 opacity-40 hover:opacity-80'
                                : isActiveWord
                                ? 'active bg-[#FFE600] text-black font-black scale-110 shadow-xl ring-2 ring-black -rotate-1 transform'
                                : 'text-slate-200 hover:bg-indigo-600/30 hover:text-indigo-200'
                            }`}
                          >
                            {word.word}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Instruction Footer */}
            <div className="p-3 bg-[#0d1017] rounded-xl border border-[#202738] text-[11px] text-slate-400 flex items-center justify-between">
              <span>Legenda de Cores:</span>
              <div className="flex items-center gap-4">
                <span className="text-amber-400 font-semibold">• Pausas/Silêncio</span>
                <span className="text-rose-400 font-semibold">• Vício de Fala</span>
                <span className="text-red-400 line-through font-semibold">• Trecho Cortado</span>
                <span className="text-yellow-400 font-semibold">• Palavra Ativa</span>
              </div>
            </div>
          </div>

          {/* Right Column: Synchronized Preview Player */}
          <div className="lg:col-span-4 bg-[#131724] border border-[#23293c] rounded-2xl p-5 shadow-xl space-y-4 flex flex-col items-center">
            <div className="w-full flex items-center justify-between text-xs font-bold text-slate-300">
              <span>Preview dos Cortes</span>
              <span className="text-cyan-400 font-mono">{formatTimecode(currentTime)}</span>
            </div>

            {/* 9:16 Frame with videoRef listener */}
            <div className="relative w-full max-w-[240px] aspect-[9/16] rounded-2xl overflow-hidden shadow-2xl bg-black border border-slate-700 flex items-center justify-center group">
              {isRealVideo ? (
                <video
                  ref={videoRef}
                  src={project?.videoFileUrl}
                  playsInline
                  muted={isMuted}
                  loop
                  className="w-full h-full object-cover"
                  onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                />
              ) : (
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80"
                  alt="Presenter"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              )}

              {/* Seamless Cut indicator overlay */}
              <div className="absolute top-3 inset-x-3 bg-black/75 backdrop-blur-sm p-2 rounded-xl border border-cyan-500/30 text-center">
                <span className="text-[10px] text-cyan-300 font-bold block">
                  Corte Rápido Inteligente
                </span>
                <span className="text-[9px] text-slate-400">
                  {totalCutSeconds.toFixed(1)}s removidos da timeline
                </span>
              </div>

              {/* Live active word caption badge on video */}
              {activeWord && (
                <div className="absolute inset-x-3 bottom-14 flex items-center justify-center pointer-events-none">
                  <div className="bg-[#FFE600] text-black font-['Montserrat',sans-serif] font-black px-3.5 py-1.5 rounded-xl shadow-2xl border-2 border-black rotate-[-2deg] text-base uppercase animate-pulse">
                    {activeWord.word}
                  </div>
                </div>
              )}

              {/* Play Button */}
              {!isPlaying && (
                <button
                  onClick={handleTogglePlay}
                  className="absolute z-20 w-12 h-12 rounded-full bg-cyan-500/90 text-black flex items-center justify-center shadow-xl hover:scale-110 transition-transform"
                >
                  <Play className="w-5 h-5 ml-0.5" />
                </button>
              )}

              {/* Scrubber controls */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 to-transparent p-2 z-10 flex items-center justify-between text-[10px] text-white font-mono">
                <button onClick={handleTogglePlay} className="hover:text-cyan-400">
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>
                <span>{formatTimecode(currentTime)} / {formatTimecode(totalDuration)}</span>
              </div>
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
