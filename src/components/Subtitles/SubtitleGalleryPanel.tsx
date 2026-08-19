import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Sparkles, 
  Type, 
  Palette, 
  Layers, 
  CheckCircle2, 
  Play, 
  Pause, 
  Scissors, 
  Check,
  Eye,
  Sliders,
  FileText,
  Volume2,
  VolumeX,
  Clock,
  RotateCcw,
  Sparkle
} from 'lucide-react';
import { CaptionPresetType, CaptionStyleConfig, ProjectData, TranscriptSegment, TranscriptWord } from '../../types';
import { INITIAL_TRANSCRIPT } from '../../data/mockData';
import { ExportSubtitlesModal } from './ExportSubtitlesModal';
import { generateTranscriptForDuration } from '../../utils/transcriptGenerator';

interface SubtitleGalleryPanelProps {
  captionConfig: CaptionStyleConfig;
  onChangeConfig: (newConfig: Partial<CaptionStyleConfig>) => void;
  onApplyPreset: () => void;
  onNavigateToTextCut?: () => void;
  project?: ProjectData;
  initialTranscript?: TranscriptSegment[];
}

export const SubtitleGalleryPanel: React.FC<SubtitleGalleryPanelProps> = ({
  captionConfig,
  onChangeConfig,
  onApplyPreset,
  onNavigateToTextCut,
  project,
  initialTranscript,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const transcriptContainerRef = useRef<HTMLDivElement>(null);

  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isExportSubtitlesOpen, setIsExportSubtitlesOpen] = useState<boolean>(false);
  const [silencesRemoved, setSilencesRemoved] = useState<boolean>(false);

  // Derive duration
  const totalDuration = project?.durationSec || 30;

  // Resolve transcript segments: from project, initialTranscript, or dynamic generator
  const rawTranscript = useMemo(() => {
    if (project?.transcript && project.transcript.length > 0) {
      return project.transcript;
    }
    if (initialTranscript && initialTranscript.length > 0) {
      return initialTranscript;
    }
    return generateTranscriptForDuration(totalDuration, project?.name);
  }, [project?.transcript, project?.durationSec, project?.name, initialTranscript, totalDuration]);

  const [segments, setSegments] = useState<TranscriptSegment[]>(rawTranscript);

  // Update segments if rawTranscript changes
  useEffect(() => {
    setSegments(rawTranscript);
  }, [rawTranscript]);

  // Video source: custom uploaded video or fallback video
  const videoSourceUrl = project?.videoFileUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80';
  const isRealVideoFile = Boolean(project?.videoFileUrl);

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
  }, [videoSourceUrl]);

  // High-precision requestAnimationFrame loop during playback for 60fps subtitle & word tracking
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    if (isPlaying) {
      const step = (now: number) => {
        if (videoRef.current && isRealVideoFile) {
          setCurrentTime(videoRef.current.currentTime);
        } else {
          // Simulation loop if no video file
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
  }, [isPlaying, isRealVideoFile, totalDuration]);

  // Active TranscriptSegment and active word mapping based on videoRef's currentTime
  const activeSegment = useMemo(() => {
    if (!segments || segments.length === 0) return null;
    return segments.find((seg) => currentTime >= seg.start && currentTime <= seg.end) ||
      segments.find((seg) => currentTime >= (seg.start - 0.25) && currentTime <= (seg.end + 0.35)) ||
      null;
  }, [segments, currentTime]);

  const activeWord = useMemo(() => {
    if (!activeSegment || !activeSegment.words || activeSegment.words.length === 0) return null;
    const validWords = activeSegment.words.filter((w) => !w.isSilence && !w.isDeleted);
    if (validWords.length === 0) return null;

    return validWords.find((w) => currentTime >= w.start && currentTime <= w.end) ||
      validWords.reduce((closest, w) => {
        if (!closest) return w;
        const diffW = Math.abs(currentTime - w.start);
        const diffClosest = Math.abs(currentTime - closest.start);
        return diffW < diffClosest ? w : closest;
      }, validWords[0]);
  }, [activeSegment, currentTime]);

  // Group active words for subtitle display
  const activePhraseWords = useMemo(() => {
    if (!activeSegment || !activeSegment.words) return [];
    const validWords = activeSegment.words.filter((w) => !w.isSilence && !w.isDeleted);
    if (validWords.length === 0) return [];

    if (!activeWord) return validWords.slice(0, 3);
    const wordIdx = validWords.findIndex((w) => w.id === activeWord.id);
    const chunkSize = 3;
    const chunkStart = Math.floor(Math.max(0, wordIdx) / chunkSize) * chunkSize;
    return validWords.slice(chunkStart, chunkStart + chunkSize);
  }, [activeSegment, activeWord]);

  // Auto-scroll active segment into view
  useEffect(() => {
    if (activeSegment) {
      const el = document.getElementById(`segment-${activeSegment.id}`);
      if (el && transcriptContainerRef.current) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [activeSegment?.id]);

  // Handle Seek
  const handleSeek = (time: number) => {
    const clamped = Math.max(0, Math.min(time, totalDuration));
    setCurrentTime(clamped);
    if (videoRef.current) {
      videoRef.current.currentTime = clamped;
    }
  };

  // Toggle Play / Pause
  const handleTogglePlay = () => {
    if (videoRef.current && isRealVideoFile) {
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

  // Format Timecode
  const formatTimecode = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 10);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms}`;
  };

  // Silence cut action
  const handleCutSilences = () => {
    setSegments((prev) =>
      prev.map((seg) => ({
        ...seg,
        words: seg.words.filter((w) => !w.isSilence),
      }))
    );
    setSilencesRemoved(true);
    setToastMessage('Silêncios cortados com sucesso! Sincronização ajustada.');
    setTimeout(() => setToastMessage(null), 3500);
  };

  const styleCards: {
    id: CaptionPresetType;
    name: string;
    description: string;
    previewBadge: React.ReactNode;
  }[] = [
    {
      id: 'viral_energetic',
      name: "'Viral Energetic'",
      description: 'Animação Pop, Texto Grande',
      previewBadge: (
        <div className="bg-[#FFE600] text-black font-['Montserrat',sans-serif] font-black px-4 py-2 rounded-xl text-center shadow-lg border-2 border-black rotate-[-2deg]">
          <span className="block text-sm tracking-tight leading-none">FIQUE VIRAL! 💥</span>
        </div>
      )
    },
    {
      id: 'podcast_clean',
      name: 'Podcast Clean',
      description: 'Branco, Minimalista',
      previewBadge: (
        <div className="bg-black/80 text-white font-['Plus_Jakarta_Sans',sans-serif] font-bold px-3 py-1.5 rounded-lg border border-white/20 text-center text-xs">
          Áudio Limpo & Profissional
        </div>
      )
    },
    {
      id: 'tiktok_bounce',
      name: 'TikTok Bounce',
      description: 'Colorido com Sombra, Salto',
      previewBadge: (
        <div className="bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white font-['Montserrat',sans-serif] font-extrabold px-3 py-1.5 rounded-full text-center text-xs shadow-md">
          🎵 Em Alta Agora! #FYP
        </div>
      )
    },
    {
      id: 'karaoke_glow',
      name: 'Karaokê',
      description: 'Destaque Progressivo',
      previewBadge: (
        <div className="bg-blue-950/80 text-blue-200 font-bold px-3 py-1.5 rounded-lg border border-blue-400/40 text-center text-xs">
          <span className="text-cyan-400 font-extrabold">Cante junto</span> comigo!
        </div>
      )
    },
    {
      id: 'minimal_elegant',
      name: 'Minimal Elegant',
      description: 'Serifado, Discreto',
      previewBadge: (
        <div className="bg-slate-900/80 text-amber-100 font-['Playfair_Display',serif] italic font-medium px-3 py-1.5 rounded-md text-center text-xs">
          Uma escolha elegante.
        </div>
      )
    },
  ];

  const handleApply = () => {
    onApplyPreset();
    setToastMessage('Preset de legenda aplicado à timeline com sucesso!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="min-h-[calc(100vh-85px)] bg-[#0d1017] text-slate-100 p-4 lg:p-8 space-y-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Title Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['Montserrat',sans-serif]">
              Galeria de Estilos de Legenda Automática
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Escolha e personalize presets visuais sincronizados palavra por palavra em tempo real com o vídeo.
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsExportSubtitlesOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#142621] hover:bg-[#1b332c] text-emerald-300 border border-emerald-500/40 text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm"
            >
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>Exportar .SRT / .VTT</span>
            </button>

            {onNavigateToTextCut && (
              <button
                onClick={onNavigateToTextCut}
                className="px-4 py-2 rounded-xl bg-[#181d2c] hover:bg-[#22283d] text-indigo-300 border border-indigo-500/40 text-xs font-semibold flex items-center gap-2 transition-colors"
              >
                <Layers className="w-4 h-4" />
                <span>Abrir Editor de Corte por Texto</span>
              </button>
            )}
          </div>
        </div>

        {/* 1. PRESET CARDS GALLERY */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {styleCards.map((card) => {
            const isSelected = captionConfig.preset === card.id;
            return (
              <div
                key={card.id}
                onClick={() => onChangeConfig({ preset: card.id })}
                className={`flex flex-col justify-between p-4 rounded-2xl border transition-all cursor-pointer select-none min-h-[160px] ${
                  isSelected
                    ? 'bg-[#181d2f] border-indigo-500 shadow-xl shadow-indigo-500/10 ring-2 ring-indigo-500/40 scale-[1.02]'
                    : 'bg-[#131724] border-[#222838] hover:border-slate-500 hover:bg-[#181d2d]'
                }`}
              >
                {/* Visual Subtitle Preview Badge */}
                <div className="flex items-center justify-center h-16 w-full">
                  {card.previewBadge}
                </div>

                <div className="mt-3">
                  <div className="text-xs font-bold text-slate-100 flex items-center justify-between">
                    <span>{card.name}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{card.description}</p>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onChangeConfig({ preset: card.id });
                  }}
                  className={`w-full py-1.5 rounded-lg text-xs font-semibold mt-3 transition-colors ${
                    isSelected
                      ? 'bg-indigo-600 text-white'
                      : 'bg-[#1f2537] text-slate-300 hover:bg-[#283147]'
                  }`}
                >
                  {isSelected ? 'Selecionado' : 'Selecionar'}
                </button>
              </div>
            );
          })}
        </div>

        {/* 2. CONTROLES DE PERSONALIZAÇÃO */}
        <div className="bg-[#131724] border border-[#23293c] rounded-2xl p-5 space-y-4 shadow-xl">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-400" />
            <span>Controles de Personalização</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Control 1: Fonte & Tamanho */}
            <div className="space-y-3 bg-[#171c2b] p-3.5 rounded-xl border border-[#252d42]">
              <label className="block text-xs font-semibold text-slate-300">Fonte</label>
              <select
                value={captionConfig.fontFamily}
                onChange={(e) => onChangeConfig({ fontFamily: e.target.value })}
                className="w-full bg-[#0f121c] border border-[#2c354d] rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              >
                <option value="Montserrat">Montserrat Bold (Atual)</option>
                <option value="Plus Jakarta Sans">Plus Jakarta Sans</option>
                <option value="Playfair Display">Playfair Display</option>
                <option value="Inter">Inter UI</option>
                <option value="JetBrains Mono">JetBrains Mono</option>
              </select>

              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Tamanho</span>
                  <span className="text-indigo-400 font-mono">{captionConfig.fontSize}px</span>
                </div>
                <input
                  type="range"
                  min="18"
                  max="44"
                  value={captionConfig.fontSize}
                  onChange={(e) => onChangeConfig({ fontSize: Number(e.target.value) })}
                  className="w-full accent-indigo-500 h-1.5 bg-[#20273a] rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>Pequeno</span>
                  <span>Médio</span>
                  <span>Grande</span>
                </div>
              </div>
            </div>

            {/* Control 2: Cor & Paleta */}
            <div className="space-y-3 bg-[#171c2b] p-3.5 rounded-xl border border-[#252d42]">
              <label className="block text-xs font-semibold text-slate-300">Cor do Destaque</label>
              <div className="flex items-center gap-2">
                {[
                  { color: '#FFE600', name: 'Amarelo Pop' },
                  { color: '#FFFFFF', name: 'Branco' },
                  { color: '#00E5FF', name: 'Ciano Neon' },
                  { color: '#775CFF', name: 'Roxo Viralume' },
                  { color: '#F43F5E', name: 'Rosa' },
                ].map((c) => (
                  <button
                    key={c.color}
                    onClick={() => onChangeConfig({ textColor: c.color })}
                    style={{ backgroundColor: c.color }}
                    className={`w-7 h-7 rounded-lg border transition-transform ${
                      captionConfig.textColor === c.color ? 'scale-110 ring-2 ring-white border-black' : 'border-slate-700 hover:scale-105'
                    }`}
                    title={c.name}
                  />
                ))}
              </div>

              {/* Gradient Preview */}
              <div className="h-10 rounded-lg bg-gradient-to-r from-yellow-400 via-rose-500 via-purple-500 to-cyan-400 p-0.5 cursor-pointer shadow-inner">
                <div className="w-full h-full bg-[#111420]/30 rounded flex items-center justify-center text-[10px] text-white font-bold backdrop-blur-sm">
                  Gradiente Ativo: {captionConfig.textColor}
                </div>
              </div>
            </div>

            {/* Control 3: Outline (Contorno) */}
            <div className="space-y-3 bg-[#171c2b] p-3.5 rounded-xl border border-[#252d42]">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">Outline (Contorno)</label>
                <input
                  type="checkbox"
                  checked={captionConfig.hasOutline}
                  onChange={(e) => onChangeConfig({ hasOutline: e.target.checked })}
                  className="w-4 h-4 accent-indigo-500 rounded cursor-pointer"
                />
              </div>

              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Espessura</span>
                  <span className="text-indigo-400 font-mono">{captionConfig.outlineWidth}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  disabled={!captionConfig.hasOutline}
                  value={captionConfig.outlineWidth}
                  onChange={(e) => onChangeConfig({ outlineWidth: Number(e.target.value) })}
                  className="w-full accent-indigo-500 h-1.5 bg-[#20273a] rounded-lg appearance-none cursor-pointer disabled:opacity-40"
                />
              </div>
            </div>

            {/* Control 4: Animação de Entrada */}
            <div className="space-y-3 bg-[#171c2b] p-3.5 rounded-xl border border-[#252d42] flex flex-col justify-between">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Animação de Entrada</label>
                <select
                  value={captionConfig.animation}
                  onChange={(e) => onChangeConfig({ animation: e.target.value as any })}
                  className="w-full bg-[#0f121c] border border-[#2c354d] rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                >
                  <option value="pop">Pop (Atual)</option>
                  <option value="bounce">Bounce</option>
                  <option value="slide">Slide</option>
                  <option value="fade">Fade In</option>
                  <option value="karaoke">Karaokê</option>
                </select>
              </div>

              <button
                onClick={handleTogglePlay}
                className="w-full py-2 rounded-lg bg-[#20273a] hover:bg-[#2c354f] text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5 text-indigo-400" /> : <Play className="w-3.5 h-3.5 text-indigo-400" />}
                <span>{isPlaying ? 'Pausar Teste' : 'Testar Animação no Vídeo'}</span>
              </button>
            </div>

          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between pt-3 border-t border-[#1e2436]">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <span>Tempo Atual do Vídeo: <strong className="text-white font-mono">{formatTimecode(currentTime)}</strong></span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => onChangeConfig({ preset: 'viral_energetic', textColor: '#FFE600' })}
                className="px-4 py-2 rounded-xl bg-[#1c2233] hover:bg-[#252c42] text-slate-300 text-xs font-semibold transition-colors"
              >
                Padrão Viral
              </button>
              <button
                onClick={handleApply}
                className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all hover:scale-105"
              >
                Aplicar Preset
              </button>
            </div>
          </div>

          {toastMessage && (
            <div className="text-xs text-emerald-400 font-semibold flex items-center justify-end gap-1.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4" />
              <span>{toastMessage}</span>
            </div>
          )}
        </div>

        {/* 3. SYNCHRONIZED TIMESTAMPS WORD LIST & LIVE PLAYER */}
        <div className="bg-[#131724] border border-[#23293c] rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1e2436] pb-3">
            <div className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>Transcrição e Estilos em Tempo Real (Sincronia Whisper)</span>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={handleCutSilences}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#181d2c] hover:bg-[#22293e] text-indigo-300 border border-indigo-500/30 text-xs font-medium transition-colors"
              >
                <Scissors className="w-3.5 h-3.5" />
                <span>Cortar Silêncios</span>
              </button>
              <span className={`text-[11px] font-semibold px-2.5 py-1 rounded border transition-colors ${
                silencesRemoved 
                  ? 'text-emerald-300 bg-emerald-950/60 border-emerald-500/40' 
                  : 'text-slate-400 bg-[#171c2b] border-[#252d42]'
              }`}>
                {silencesRemoved ? '✓ Silêncios Removidos' : '3.4s de Silêncios Detectados'}
              </span>
            </div>
          </div>

          {/* 2-Column Subtitle Sync Viewer */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Column: Word by word / Segment list */}
            <div 
              ref={transcriptContainerRef}
              className="lg:col-span-7 space-y-2 max-h-[460px] overflow-y-auto pr-2 custom-scrollbar"
            >
              {segments.map((segment) => {
                const isActiveSegment = activeSegment?.id === segment.id;
                return (
                  <div
                    key={segment.id}
                    id={`segment-${segment.id}`}
                    onClick={() => handleSeek(segment.start)}
                    className={`transcript-segment transition-all duration-150 cursor-pointer rounded-xl p-3 border text-xs ${
                      isActiveSegment
                        ? 'active bg-indigo-600/30 border-indigo-500 shadow-lg ring-2 ring-indigo-500/50 font-semibold text-white'
                        : 'bg-[#181d2c] border-[#222838] text-slate-300 hover:bg-[#1f2638] hover:border-slate-600'
                    }`}
                  >
                    {/* Header with speaker & time range */}
                    <div className="flex items-center justify-between text-[11px] mb-2 font-mono">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                          isActiveSegment ? 'bg-indigo-500 text-white shadow-sm' : 'bg-[#131724] text-slate-400 border border-slate-700/50'
                        }`}>
                          {segment.speaker || 'Locutor Principal'}
                        </span>
                        <span className={isActiveSegment ? 'text-indigo-200 font-bold' : 'text-slate-400'}>
                          {formatTimecode(segment.start)} - {formatTimecode(segment.end)}
                        </span>
                      </div>
                      
                      {isActiveSegment && (
                        <span className="flex items-center gap-1.5 text-[10px] text-amber-300 font-black bg-amber-950/70 px-2 py-0.5 rounded border border-amber-500/40">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
                          AO VIVO
                        </span>
                      )}
                    </div>

                    {/* Word-by-word interactive mapping */}
                    <div className="flex flex-wrap gap-1.5 text-sm leading-relaxed">
                      {segment.words.map((word) => {
                        const isActiveWord = isActiveSegment && activeWord?.id === word.id;
                        
                        if (word.isSilence) {
                          return (
                            <span
                              key={word.id}
                              className="text-[11px] px-2 py-0.5 rounded bg-amber-950/70 text-amber-400 font-mono border border-amber-500/30 inline-flex items-center gap-1"
                            >
                              [ Pausa {(word.end - word.start).toFixed(1)}s ]
                            </span>
                          );
                        }

                        if (word.isFiller) {
                          return (
                            <span
                              key={word.id}
                              className="text-[11px] px-1.5 py-0.5 rounded bg-rose-950/70 text-rose-300 font-mono border border-rose-500/30"
                            >
                              "{word.word}"
                            </span>
                          );
                        }

                        return (
                          <span
                            key={word.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSeek(word.start);
                            }}
                            className={`transcript-word px-1.5 py-0.5 rounded transition-all duration-100 cursor-pointer ${
                              isActiveWord
                                ? 'active bg-[#FFE600] text-black font-black scale-110 shadow-xl ring-2 ring-black -rotate-1 transform'
                                : 'hover:bg-indigo-500/20 hover:text-white'
                            }`}
                            style={word.highlightColor && !isActiveWord ? { color: word.highlightColor, fontWeight: 700 } : undefined}
                            title={`Clique para pular para ${formatTimecode(word.start)}`}
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

            {/* Right Column: Live Video Canvas Player */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="relative w-full max-w-[270px] aspect-[9/16] rounded-2xl overflow-hidden shadow-2xl bg-black border-2 border-slate-700 flex items-center justify-center group">
                
                {isRealVideoFile ? (
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
                  <div className="relative w-full h-full">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80"
                      alt="Video presenter"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    {/* Subtle scanline effect when playing */}
                    {isPlaying && (
                      <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 via-transparent to-black/30 pointer-events-none" />
                    )}
                  </div>
                )}

                {/* REAL-TIME DYNAMIC SUBTITLE OVERLAY VINCULADO AO currentTime */}
                <div 
                  className="absolute inset-x-3 z-20 flex items-center justify-center pointer-events-none transition-all duration-100"
                  style={{ bottom: `${100 - (captionConfig.positionY || 78)}%` }}
                >
                  {captionConfig.preset === 'viral_energetic' && (
                    <div className="flex flex-wrap items-center justify-center gap-1.5 px-3.5 py-2 bg-black/85 backdrop-blur-md rounded-2xl border-2 border-yellow-400/80 shadow-2xl">
                      {activePhraseWords.map((w) => {
                        const isCurrent = activeWord?.id === w.id;
                        return (
                          <span
                            key={w.id}
                            className={`font-['Montserrat',sans-serif] font-black uppercase text-lg transition-all duration-100 ${
                              isCurrent
                                ? 'bg-[#FFE600] text-black px-2.5 py-0.5 rounded-xl shadow-xl transform scale-110 -rotate-2 ring-2 ring-black'
                                : 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]'
                            }`}
                          >
                            {w.word}
                          </span>
                        );
                      })}
                    </div>
                  )}

                  {captionConfig.preset === 'podcast_clean' && (
                    <div className="px-4 py-2 bg-black/85 backdrop-blur-md text-white font-['Plus_Jakarta_Sans',sans-serif] font-bold text-sm tracking-wide rounded-xl border border-white/20 shadow-lg text-center flex flex-wrap items-center justify-center gap-1.5">
                      {activePhraseWords.map((w) => {
                        const isCurrent = activeWord?.id === w.id;
                        return (
                          <span 
                            key={w.id} 
                            className={`transition-all duration-100 ${isCurrent ? 'text-amber-300 font-extrabold scale-105 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]' : 'text-slate-200'}`}
                          >
                            {w.word}
                          </span>
                        );
                      })}
                    </div>
                  )}

                  {captionConfig.preset === 'tiktok_bounce' && (
                    <div className="px-4 py-2 bg-gradient-to-r from-cyan-600/90 to-fuchsia-600/90 backdrop-blur-sm text-white font-['Montserrat',sans-serif] font-extrabold text-base tracking-wider rounded-full shadow-2xl border-2 border-white flex flex-wrap items-center justify-center gap-1.5">
                      {activePhraseWords.map((w) => {
                        const isCurrent = activeWord?.id === w.id;
                        return (
                          <span 
                            key={w.id} 
                            className={`transition-all duration-100 ${isCurrent ? 'text-yellow-300 underline decoration-yellow-400 font-black scale-110 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]' : 'text-white'}`}
                          >
                            {w.word}
                          </span>
                        );
                      })}
                    </div>
                  )}

                  {captionConfig.preset === 'karaoke_glow' && (
                    <div className="px-4 py-1.5 bg-black/85 backdrop-blur rounded-xl text-base font-bold font-['Plus_Jakarta_Sans',sans-serif] text-center border border-indigo-500/50 flex flex-wrap items-center justify-center gap-1.5">
                      {activePhraseWords.map((w) => {
                        const isCurrent = activeWord?.id === w.id;
                        return (
                          <span 
                            key={w.id} 
                            className={`transition-all duration-100 ${isCurrent ? 'text-cyan-400 drop-shadow-[0_0_12px_#00e5ff] scale-105 font-black' : 'text-slate-400'}`}
                          >
                            {w.word}
                          </span>
                        );
                      })}
                    </div>
                  )}

                  {captionConfig.preset === 'minimal_elegant' && (
                    <div className="px-4 py-1.5 bg-slate-900/85 backdrop-blur text-amber-100 font-['Playfair_Display',serif] italic font-semibold text-base text-center tracking-normal rounded-xl border border-amber-500/30 flex flex-wrap items-center justify-center gap-1.5">
                      {activePhraseWords.map((w) => {
                        const isCurrent = activeWord?.id === w.id;
                        return (
                          <span 
                            key={w.id} 
                            className={`transition-all duration-100 ${isCurrent ? 'text-amber-300 font-bold not-italic scale-105' : 'text-amber-100/80'}`}
                          >
                            {w.word}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Big Center Play/Pause button when paused */}
                {!isPlaying && (
                  <button
                    onClick={handleTogglePlay}
                    className="absolute z-30 w-14 h-14 rounded-full bg-black/70 backdrop-blur-md text-white border border-white/20 flex items-center justify-center shadow-2xl hover:scale-110 transition-transform"
                  >
                    <Play className="w-6 h-6 ml-0.5 text-indigo-400" />
                  </button>
                )}

                {/* Bottom video playback bar */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-3 pt-6 z-20 flex flex-col gap-1.5">
                  {/* Scrubber slider */}
                  <input
                    type="range"
                    min="0"
                    max={totalDuration}
                    step="0.05"
                    value={currentTime}
                    onChange={(e) => handleSeek(Number(e.target.value))}
                    className="w-full h-1.5 accent-indigo-500 bg-white/20 rounded-lg appearance-none cursor-pointer"
                  />
                  
                  <div className="flex items-center justify-between text-white text-[11px] font-mono">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={handleTogglePlay} 
                        className="hover:text-indigo-400 transition-colors"
                        title={isPlaying ? 'Pausar' : 'Reproduzir'}
                      >
                        {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      </button>
                      
                      {isRealVideoFile && (
                        <button 
                          onClick={() => setIsMuted(!isMuted)} 
                          className="hover:text-indigo-400 transition-colors"
                          title={isMuted ? 'Ativar Áudio' : 'Mutar'}
                        >
                          {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
                        </button>
                      )}

                      <button
                        onClick={() => handleSeek(0)}
                        className="hover:text-indigo-400 transition-colors"
                        title="Reiniciar Vídeo"
                      >
                        <RotateCcw className="w-3 h-3" />
                      </button>

                      <span className="text-amber-300 font-bold">{formatTimecode(currentTime)}</span>
                    </div>
                    
                    <span className="text-slate-400">/ {formatTimecode(totalDuration)}</span>
                  </div>
                </div>

              </div>

              {/* Subtitle Sync Status Badge */}
              <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
                <Sparkle className="w-3.5 h-3.5 text-indigo-400" />
                <span>Palavra Ativa: <strong className="text-yellow-400 font-bold">{activeWord?.word || '(pausa)'}</strong></span>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Export Subtitles Modal */}
      <ExportSubtitlesModal
        isOpen={isExportSubtitlesOpen}
        onClose={() => setIsExportSubtitlesOpen(false)}
      />
    </div>
  );
};
