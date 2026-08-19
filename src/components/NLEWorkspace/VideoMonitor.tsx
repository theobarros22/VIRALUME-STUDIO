import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  RotateCcw, 
  SlidersHorizontal,
  Smartphone,
  Tv,
  Square,
  Sparkles,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Music2,
  Plus
} from 'lucide-react';
import { PlatformSafeZone, CaptionStyleConfig, VideoAspectRatio, InspectorState, TranscriptSegment } from '../../types';
import { generateTranscriptForDuration } from '../../utils/transcriptGenerator';

interface VideoMonitorProps {
  isPlaying: boolean;
  currentTime: number; // in seconds
  duration: number; // in seconds
  onTogglePlay: () => void;
  onSeek: (time: number) => void;
  safeZone: PlatformSafeZone;
  onSafeZoneChange: (zone: PlatformSafeZone) => void;
  captionConfig: CaptionStyleConfig;
  aspectRatio?: VideoAspectRatio;
  onAspectRatioChange?: (ratio: VideoAspectRatio) => void;
  inspectorState?: InspectorState;
  videoFileUrl?: string;
  isEmptyProject?: boolean;
  onUploadVideo?: (file: File) => void;
  customTranscript?: TranscriptSegment[];
  onDurationDetected?: (durationSec: number) => void;
}

export const VideoMonitor: React.FC<VideoMonitorProps> = ({
  isPlaying,
  currentTime,
  duration,
  onTogglePlay,
  onSeek,
  safeZone,
  onSafeZoneChange,
  captionConfig,
  aspectRatio = '9:16',
  onAspectRatioChange,
  inspectorState,
  videoFileUrl,
  isEmptyProject,
  onUploadVideo,
  customTranscript,
  onDurationDetected,
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(80);
  const [showSafeZoneInfo, setShowSafeZoneInfo] = useState(true);
  const [showFormatMenu, setShowFormatMenu] = useState(false);
  const [instagramSimMode, setInstagramSimMode] = useState<'full_9_16' | 'feed_4_5' | 'grid_1_1'>('full_9_16');
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync HTML5 video playback with state
  useEffect(() => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (!videoRef.current) return;
    // Only seek video if difference is significant to prevent seeking jitter during normal playback
    if (Math.abs(videoRef.current.currentTime - currentTime) > 0.35) {
      videoRef.current.currentTime = currentTime;
    }
  }, [currentTime]);

  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.volume = volume / 100;
    videoRef.current.muted = isMuted;
  }, [volume, isMuted]);

  // Format seconds to HH:MM:SS:FF
  const formatTimecode = (secs: number) => {
    const hours = Math.floor(secs / 3600).toString().padStart(2, '0');
    const mins = Math.floor((secs % 3600) / 60).toString().padStart(2, '0');
    const s = Math.floor(secs % 60).toString().padStart(2, '0');
    const frames = Math.floor((secs % 1) * 30).toString().padStart(2, '0');
    return `${hours}:${mins}:${s}:${frames}`;
  };

  // Resolve active transcript from props or dynamic duration generator
  const activeTranscript = useMemo(() => {
    if (customTranscript && customTranscript.length > 0) {
      return customTranscript;
    }
    return generateTranscriptForDuration(duration || 30);
  }, [customTranscript, duration]);

  // Highly accurate word-by-word active caption state resolver
  const activeCaptionState = useMemo(() => {
    if (!activeTranscript || activeTranscript.length === 0) {
      return { activeWordText: '', phraseWords: [], activeWordId: null };
    }

    // Find segment covering current time
    let seg = activeTranscript.find(s => currentTime >= s.start && currentTime <= s.end);
    
    // If between segments, look ahead slightly (0.5s tolerance)
    if (!seg) {
      seg = activeTranscript.find(s => currentTime >= (s.start - 0.2) && currentTime <= (s.end + 0.4));
    }

    // If still not found, pick nearest active segment
    if (!seg) {
      const sorted = [...activeTranscript].sort((a, b) => Math.abs(a.start - currentTime) - Math.abs(b.start - currentTime));
      if (sorted[0] && Math.abs(sorted[0].start - currentTime) < 2.0) {
        seg = sorted[0];
      }
    }

    if (!seg || !seg.words || seg.words.length === 0) {
      return { activeWordText: '', phraseWords: [], activeWordId: null };
    }

    const validWords = seg.words.filter(w => !w.isSilence && !w.isDeleted);
    if (validWords.length === 0) {
      return { activeWordText: '', phraseWords: [], activeWordId: null };
    }

    // Find word matching current time
    let wordIdx = validWords.findIndex(w => currentTime >= w.start && currentTime <= w.end);
    if (wordIdx === -1) {
      // Find closest word in active segment
      let minDiff = 999;
      wordIdx = 0;
      validWords.forEach((w, idx) => {
        const diff = Math.min(Math.abs(currentTime - w.start), Math.abs(currentTime - w.end));
        if (diff < minDiff) {
          minDiff = diff;
          wordIdx = idx;
        }
      });
    }

    const activeWord = validWords[wordIdx] || validWords[0];
    
    // Group into dynamic 3-4 word phrase chunks (Instagram Reels / Hormozi style)
    const chunkSize = 3;
    const chunkStart = Math.floor(wordIdx / chunkSize) * chunkSize;
    const chunkWords = validWords.slice(chunkStart, chunkStart + chunkSize);

    return {
      activeWordText: activeWord?.word || '',
      activeWordId: activeWord?.id || null,
      phraseWords: chunkWords.length > 0 ? chunkWords : [activeWord],
      fullSegmentText: seg.text
    };
  }, [activeTranscript, currentTime]);

  const activeText = activeCaptionState.activeWordText || activeCaptionState.phraseWords.map(w => w.word).join(' ');

  // Aspect ratio display configuration
  const getFrameAspectClass = () => {
    switch (aspectRatio) {
      case '16:9':
        return 'w-full max-w-[560px] aspect-[16/9]';
      case '1:1':
        return 'h-full max-h-[460px] aspect-square';
      case '4:5':
        return 'h-full max-h-[500px] aspect-[4/5]';
      case '4:3':
        return 'h-full max-h-[460px] aspect-[4/3]';
      case '9:16':
      default:
        return 'h-full max-h-[540px] aspect-[9/16]';
    }
  };

  const getResolutionLabel = () => {
    switch (aspectRatio) {
      case '16:9': return '1920 x 1080 (16:9 Paisagem / YouTube)';
      case '1:1': return '1080 x 1080 (1:1 Quadrado / Feed)';
      case '4:5': return '1080 x 1350 (4:5 Retrato / Feed)';
      case '4:3': return '1440 x 1080 (4:3 Clássico / TV)';
      case '9:16':
      default: return '1080 x 1920 (9:16 Vertical Padrão / Reels)';
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#11141f] border-l border-[#222838] text-slate-200 text-xs select-none">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-3.5 py-2 border-b border-[#202636] bg-[#141824] flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
          <span className="font-semibold text-slate-100 text-xs">Monitor</span>
          
          {/* Aspect Ratio Selector (Starts with 9:16 as default) */}
          <div className="flex items-center bg-[#0d1019] p-0.5 rounded-lg border border-[#252d42]">
            <button
              onClick={() => onAspectRatioChange && onAspectRatioChange('9:16')}
              className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                aspectRatio === '9:16'
                  ? 'bg-amber-500 text-black shadow-sm font-black'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Formato Padrão: 9:16 (Reels, TikTok, Shorts)"
            >
              9:16 <span className="text-[9px] opacity-75 font-normal">(Padrão)</span>
            </button>
            <button
              onClick={() => onAspectRatioChange && onAspectRatioChange('16:9')}
              className={`px-1.5 py-0.5 rounded text-[10px] font-medium transition-all ${
                aspectRatio === '16:9'
                  ? 'bg-indigo-600 text-white shadow-sm font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="YouTube / Horizontal 16:9"
            >
              16:9
            </button>
            <button
              onClick={() => onAspectRatioChange && onAspectRatioChange('1:1')}
              className={`px-1.5 py-0.5 rounded text-[10px] font-medium transition-all ${
                aspectRatio === '1:1'
                  ? 'bg-indigo-600 text-white shadow-sm font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Instagram / Feed Quadrado 1:1"
            >
              1:1
            </button>
            <button
              onClick={() => onAspectRatioChange && onAspectRatioChange('4:5')}
              className={`px-1.5 py-0.5 rounded text-[10px] font-medium transition-all ${
                aspectRatio === '4:5'
                  ? 'bg-indigo-600 text-white shadow-sm font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Instagram Feed Retrato 4:5"
            >
              4:5
            </button>
          </div>
        </div>

        {/* Safe Zones Platform Selector exactly as Image 1, 5, 6 */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1 bg-[#0f121c] p-0.5 rounded-lg border border-[#252d42]">
            <button
              onClick={() => onSafeZoneChange('instagram_reels')}
              className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                safeZone === 'instagram_reels'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Instagram Reels
            </button>
            <button
              onClick={() => onSafeZoneChange('tiktok')}
              className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                safeZone === 'tiktok'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              TikTok
            </button>
            <button
              onClick={() => onSafeZoneChange('youtube_shorts')}
              className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                safeZone === 'youtube_shorts'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Shorts
            </button>
            <button
              onClick={() => onSafeZoneChange('none')}
              className={`px-1.5 py-1 rounded text-[10px] transition-colors ${
                safeZone === 'none'
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Desativar Guias"
            >
              Desativado
            </button>
          </div>
        </div>
      </div>

      {/* Resolution Indicator Sub-bar + Instagram Simulator */}
      <div className="px-3 py-1 bg-[#0d1017] border-b border-[#1c2233] flex items-center justify-between text-[10px] text-slate-400 font-mono flex-wrap gap-2">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          {getResolutionLabel()}
        </span>

        {/* Instagram Grid / Feed Crop Simulator Controls */}
        <div className="flex items-center gap-1 bg-[#141926] px-2 py-0.5 rounded-md border border-[#232a3d]">
          <span className="text-[9px] text-rose-400 font-bold uppercase tracking-wider">Simulador Instagram:</span>
          <button
            onClick={() => setInstagramSimMode('full_9_16')}
            className={`px-1.5 py-0.5 rounded text-[9px] font-semibold transition-colors ${
              instagramSimMode === 'full_9_16'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Reels 9:16 (Tela Cheia)"
          >
            Reels (9:16)
          </button>
          <button
            onClick={() => setInstagramSimMode('feed_4_5')}
            className={`px-1.5 py-0.5 rounded text-[9px] font-semibold transition-colors ${
              instagramSimMode === 'feed_4_5'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Corte do Feed Principal do Instagram (4:5)"
          >
            Feed (4:5)
          </button>
          <button
            onClick={() => setInstagramSimMode('grid_1_1')}
            className={`px-1.5 py-0.5 rounded text-[9px] font-semibold transition-colors ${
              instagramSimMode === 'grid_1_1'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Corte da Grade do Perfil (1:1 Quadrado)"
          >
            Grade Bio (1:1)
          </button>
        </div>
      </div>

      {/* Video Viewport / Canvas Container */}
      <div className="flex-1 relative flex items-center justify-center p-3 overflow-hidden bg-gradient-to-b from-[#0a0d14] via-[#0d1017] to-[#0a0d14]">
        
        {/* Hidden File Input for video upload */}
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*,audio/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file && onUploadVideo) {
              onUploadVideo(file);
            }
          }}
        />

        {/* Dynamic Video Frame with responsive aspect ratio */}
        <div 
          onDragOver={(e) => {
            e.preventDefault();
            setIsDraggingOver(true);
          }}
          onDragLeave={() => setIsDraggingOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDraggingOver(false);
            const file = e.dataTransfer.files?.[0];
            if (file && onUploadVideo) {
              onUploadVideo(file);
            }
          }}
          className={`relative ${getFrameAspectClass()} rounded-2xl overflow-hidden shadow-2xl bg-black border ${
            isDraggingOver ? 'border-indigo-500 ring-4 ring-indigo-500/50' : 'border-[#2b334a]'
          } flex items-center justify-center group transition-all duration-300`}
        >
          
          {/* Empty Project Placeholder / Upload Dropzone */}
          {isEmptyProject && !videoFileUrl ? (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center bg-[#0d101a] border-2 border-dashed border-[#29324a] rounded-2xl m-2">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600/30 to-purple-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400 mb-4 shadow-xl">
                <Sparkles className="w-8 h-8 animate-pulse" />
              </div>
              <h3 className="text-base font-bold text-white mb-1 font-['Montserrat',sans-serif]">
                Projeto Limpo Pronto
              </h3>
              <p className="text-xs text-slate-400 mb-4 max-w-[200px]">
                Arraste e solte o seu vídeo aqui para transcrever e gerar legendas automáticas.
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all hover:scale-105"
              >
                <Plus className="w-4 h-4" />
                <span>Selecionar Vídeo (MP4, MOV)</span>
              </button>
            </div>
          ) : videoFileUrl ? (
            /* REAL USER VIDEO PLAYER */
            <div 
              className="absolute inset-0 w-full h-full overflow-hidden transition-transform duration-75"
              style={{
                transform: inspectorState ? `translate(${inspectorState.posX * 0.2}px, ${inspectorState.posY * 0.2}px) scale(${inspectorState.scale}) rotate(${inspectorState.rotation}deg)` : undefined,
                opacity: inspectorState ? (inspectorState.opacity / 100) : 1,
              }}
            >
              <video
                ref={videoRef}
                src={videoFileUrl}
                playsInline
                onTimeUpdate={(e) => {
                  if (isPlaying) {
                    onSeek(e.currentTarget.currentTime);
                  }
                }}
                onLoadedMetadata={(e) => {
                  if (e.currentTarget.duration && onDurationDetected) {
                    onDurationDetected(e.currentTarget.duration);
                  }
                }}
                onEnded={() => {
                  if (isPlaying) {
                    onTogglePlay();
                  }
                }}
                className="w-full h-full object-cover object-center"
                style={{
                  filter: inspectorState ? `
                    brightness(${1 + (inspectorState.exposure || 0) * 0.5})
                    contrast(${1 + (inspectorState.contrast || 0) * 0.5})
                    saturate(${Math.max(0, 1 + (inspectorState.saturation || 0) * 0.5)})
                    hue-rotate(${(inspectorState.temperature || 0) * 15}deg)
                    sepia(${Math.max(0, (inspectorState.temperature || 0) * 0.2)})
                  ` : undefined
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />
            </div>
          ) : (
            /* Simulated Video Creator Background (fallback) */
            <div 
              className="absolute inset-0 w-full h-full overflow-hidden transition-transform duration-75"
              style={{
                transform: inspectorState ? `translate(${inspectorState.posX * 0.2}px, ${inspectorState.posY * 0.2}px) scale(${inspectorState.scale}) rotate(${inspectorState.rotation}deg)` : undefined,
                opacity: inspectorState ? (inspectorState.opacity / 100) : 1,
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=85"
                alt="Creator Video"
                className="w-full h-full object-cover object-center"
                style={{
                  filter: inspectorState ? `
                    brightness(${1 + (inspectorState.exposure || 0) * 0.5})
                    contrast(${1 + (inspectorState.contrast || 0) * 0.5})
                    saturate(${Math.max(0, 1 + (inspectorState.saturation || 0) * 0.5)})
                    hue-rotate(${(inspectorState.temperature || 0) * 15}deg)
                    sepia(${Math.max(0, (inspectorState.temperature || 0) * 0.2)})
                  ` : undefined
                }}
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />
            </div>
          )}

          {/* REAL-TIME DYNAMIC SUBTITLE OVERLAY */}
          <div 
            className="absolute inset-x-4 z-20 flex items-center justify-center pointer-events-none transition-all duration-150"
            style={{ bottom: `${100 - captionConfig.positionY}%` }}
          >
            {captionConfig.preset === 'viral_energetic' && (
              <div className="flex flex-wrap items-center justify-center gap-1.5 px-4 py-2.5 bg-black/80 backdrop-blur-md rounded-2xl border-2 border-yellow-400/70 shadow-2xl">
                {activeCaptionState.phraseWords.map((w) => {
                  const isCurrent = w.id === activeCaptionState.activeWordId;
                  return (
                    <span
                      key={w.id}
                      className={`font-['Montserrat',sans-serif] font-black uppercase text-xl transition-all duration-100 ${
                        isCurrent
                          ? 'bg-[#FFE600] text-black px-2.5 py-0.5 rounded-xl shadow-lg transform scale-110 -rotate-2 ring-2 ring-black'
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
              <div className="px-5 py-2.5 bg-black/80 backdrop-blur-md text-white font-['Plus_Jakarta_Sans',sans-serif] font-bold text-base tracking-wide rounded-xl border border-white/20 shadow-lg text-center flex flex-wrap items-center justify-center gap-1.5">
                {activeCaptionState.phraseWords.map((w) => {
                  const isCurrent = w.id === activeCaptionState.activeWordId;
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
              <div className="px-5 py-2.5 bg-gradient-to-r from-cyan-600/90 to-fuchsia-600/90 backdrop-blur-sm text-white font-['Montserrat',sans-serif] font-extrabold text-lg tracking-wider rounded-full shadow-2xl border-2 border-white flex flex-wrap items-center justify-center gap-1.5">
                {activeCaptionState.phraseWords.map((w) => {
                  const isCurrent = w.id === activeCaptionState.activeWordId;
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
              <div className="px-5 py-2 bg-black/80 backdrop-blur rounded-xl text-lg font-bold font-['Plus_Jakarta_Sans',sans-serif] text-center border border-indigo-500/50 flex flex-wrap items-center justify-center gap-1.5">
                {activeCaptionState.phraseWords.map((w) => {
                  const isCurrent = w.id === activeCaptionState.activeWordId;
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
              <div className="px-5 py-2 bg-slate-900/80 backdrop-blur text-amber-100 font-['Playfair_Display',serif] italic font-semibold text-lg text-center tracking-normal rounded-xl border border-amber-500/30 flex flex-wrap items-center justify-center gap-1.5">
                {activeCaptionState.phraseWords.map((w) => {
                  const isCurrent = w.id === activeCaptionState.activeWordId;
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

            {captionConfig.preset === 'storytelling_flow' && (
              <div className="px-4 py-1.5 bg-indigo-950/85 backdrop-blur text-indigo-100 font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-sm rounded-lg border border-indigo-400/30 flex flex-wrap items-center justify-center gap-1">
                {activeCaptionState.phraseWords.map((w) => {
                  const isCurrent = w.id === activeCaptionState.activeWordId;
                  return (
                    <span 
                      key={w.id} 
                      className={`transition-all duration-100 ${isCurrent ? 'text-white font-bold bg-indigo-600/70 px-1.5 py-0.5 rounded shadow' : 'text-indigo-200'}`}
                    >
                      {w.word}
                    </span>
                  );
                })}
              </div>
            )}

            {captionConfig.preset === 'meme_style' && (
              <div className="text-white font-['Montserrat',sans-serif] font-black text-2xl uppercase tracking-wider text-center drop-shadow-[0_4px_6px_#000] flex items-center justify-center gap-2">
                <span>🔥</span>
                <span>{activeText}</span>
                <span>⚡</span>
              </div>
            )}
          </div>

          {/* INSTAGRAM GRID & FEED CROP PREVIEW MASKS */}
          {instagramSimMode === 'feed_4_5' && (
            <div className="absolute inset-0 pointer-events-none z-15 flex flex-col justify-between">
              {/* Top Shaded Strip (1080x1350 vs 1080x1920 leaves 285px top/bottom) */}
              <div className="w-full h-[14.8%] bg-black/80 backdrop-blur-[2px] border-b-2 border-dashed border-rose-500 flex items-center justify-center">
                <span className="text-[10px] text-rose-400 font-bold bg-black/90 px-2 py-0.5 rounded border border-rose-500/40">
                  Área Cortada no Feed do Instagram (4:5)
                </span>
              </div>
              
              {/* Active visible frame */}
              <div className="flex-1 border-2 border-rose-400/80 shadow-[0_0_20px_rgba(244,63,94,0.3)] pointer-events-none" />

              {/* Bottom Shaded Strip */}
              <div className="w-full h-[14.8%] bg-black/80 backdrop-blur-[2px] border-t-2 border-dashed border-rose-500 flex items-center justify-center">
                <span className="text-[10px] text-rose-400 font-bold bg-black/90 px-2 py-0.5 rounded border border-rose-500/40">
                  Área Cortada no Feed do Instagram (4:5)
                </span>
              </div>
            </div>
          )}

          {instagramSimMode === 'grid_1_1' && (
            <div className="absolute inset-0 pointer-events-none z-15 flex flex-col justify-between">
              {/* Top Shaded Strip (1080x1080 leaves 420px top/bottom) */}
              <div className="w-full h-[21.8%] bg-black/85 backdrop-blur-[2px] border-b-2 border-dashed border-amber-400 flex items-center justify-center">
                <span className="text-[10px] text-amber-300 font-bold bg-black/90 px-2 py-0.5 rounded border border-amber-500/40">
                  Área Oculta na Grade do Perfil (1:1)
                </span>
              </div>

              {/* Active visible frame */}
              <div className="flex-1 border-2 border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.3)] pointer-events-none" />

              {/* Bottom Shaded Strip */}
              <div className="w-full h-[21.8%] bg-black/85 backdrop-blur-[2px] border-t-2 border-dashed border-amber-400 flex items-center justify-center">
                <span className="text-[10px] text-amber-300 font-bold bg-black/90 px-2 py-0.5 rounded border border-amber-500/40">
                  Área Oculta na Grade do Perfil (1:1)
                </span>
              </div>
            </div>
          )}

          {/* SOCIAL MEDIA SAFE ZONE OVERLAYS */}
          {safeZone === 'instagram_reels' && (
            <div className="absolute inset-0 pointer-events-none z-10 border-2 border-emerald-400/60 m-2 rounded-xl flex flex-col justify-between p-3">
              {/* Top Safe Area indicator */}
              <div className="flex items-center justify-between text-[10px] text-emerald-400 bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm">
                <span>Instagram Reels Safe Zone</span>
                <span>Zonas Seguras Ativas</span>
              </div>

              {/* Right interaction column */}
              <div className="self-end flex flex-col items-center gap-3 text-white drop-shadow-md mb-12">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur flex items-center justify-center">
                    <Heart className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-[9px] font-bold">124k</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur flex items-center justify-center">
                    <MessageCircle className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-[9px] font-bold">1.8k</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur flex items-center justify-center">
                    <Share2 className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur flex items-center justify-center">
                    <Bookmark className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>

              {/* Bottom Creator & Audio Info */}
              <div className="text-white space-y-1 bg-gradient-to-t from-black/80 to-transparent p-2 rounded-b-xl">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-indigo-500 border border-white" />
                  <span className="text-[11px] font-bold">@viralume.creator</span>
                </div>
                <p className="text-[10px] text-slate-200 line-clamp-1">
                  Como editar vídeos de alta retenção no Reels #viral #reels #tutorial
                </p>
                <div className="flex items-center gap-1 text-[9px] text-slate-300">
                  <Music2 className="w-3 h-3" />
                  <span>Áudio Original • Viralume Sound</span>
                </div>
              </div>
            </div>
          )}

          {safeZone === 'tiktok' && (
            <div className="absolute inset-0 pointer-events-none z-10 border-2 border-cyan-400/60 m-2 rounded-xl flex flex-col justify-between p-3">
              {/* Header TikTok */}
              <div className="flex items-center justify-center gap-4 text-xs font-bold text-white drop-shadow">
                <span className="text-slate-400">Seguindo</span>
                <span className="border-b-2 border-white pb-0.5">Para Você</span>
              </div>

              {/* Right Interaction Column */}
              <div className="self-end flex flex-col items-center gap-3 text-white drop-shadow-md mb-10">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-cyan-500 border-2 border-white" />
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px] font-bold">
                    +
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <Heart className="w-5 h-5 text-white fill-white" />
                  <span className="text-[9px] font-bold">89.4k</span>
                </div>
                <div className="flex flex-col items-center">
                  <MessageCircle className="w-5 h-5 text-white fill-white" />
                  <span className="text-[9px] font-bold">940</span>
                </div>
                <div className="flex flex-col items-center">
                  <Bookmark className="w-5 h-5 text-white fill-white" />
                  <span className="text-[9px] font-bold">12.1k</span>
                </div>
                <div className="flex flex-col items-center">
                  <Share2 className="w-5 h-5 text-white fill-white" />
                  <span className="text-[9px] font-bold">4.2k</span>
                </div>
              </div>

              {/* Bottom TikTok description */}
              <div className="text-white space-y-1">
                <span className="text-xs font-bold">@viralumestudio</span>
                <p className="text-[10px] text-slate-200">
                  Tutorial de legendagem automática com inteligência artificial ⚡ #fyp #viral
                </p>
              </div>
            </div>
          )}

          {safeZone === 'youtube_shorts' && (
            <div className="absolute inset-0 pointer-events-none z-10 border-2 border-rose-500/60 m-2 rounded-xl flex flex-col justify-between p-3">
              <div className="text-[10px] text-rose-400 bg-black/40 px-2 py-0.5 rounded self-start">
                YouTube Shorts Safe Box
              </div>
              <div className="self-end flex flex-col items-center gap-3 text-white mb-10">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-black/50 flex items-center justify-center">👍</div>
                  <span className="text-[9px] font-bold">34k</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-black/50 flex items-center justify-center">💬</div>
                  <span className="text-[9px] font-bold">520</span>
                </div>
              </div>
            </div>
          )}

          {/* Quick Play Trigger Overlay on Hover */}
          <button
            onClick={onTogglePlay}
            className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity z-30"
          >
            <div className="w-14 h-14 rounded-full bg-indigo-600/90 text-white flex items-center justify-center shadow-xl hover:scale-110 transition-transform">
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
            </div>
          </button>
        </div>
      </div>

      {/* Transport Controls Bar matching Image 5 & 6 */}
      <div className="p-3 bg-[#131722] border-t border-[#202636] space-y-2">
        {/* Scrubber Bar */}
        <div className="flex items-center gap-2">
          <input
            type="range"
            min="0"
            max={duration}
            step="0.1"
            value={currentTime}
            onChange={(e) => onSeek(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-[#252c3e] accent-indigo-500 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div className="flex items-center justify-between">
          {/* Timecode Display */}
          <div className="flex items-center gap-1.5 font-mono text-xs text-slate-300">
            <span className="text-indigo-400 font-semibold">{formatTimecode(currentTime)}</span>
            <span className="text-slate-600">/</span>
            <span className="text-slate-400">{formatTimecode(duration)}</span>
          </div>

          {/* Playback Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onSeek(Math.max(0, currentTime - 5))}
              className="p-1.5 rounded-lg hover:bg-[#202738] text-slate-400 hover:text-white transition-colors"
              title="Voltar 5s (J)"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={onTogglePlay}
              className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95"
              title="Reproduzir / Pausar (Space)"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>

            <button
              onClick={() => onSeek(Math.min(duration, currentTime + 5))}
              className="p-1.5 rounded-lg hover:bg-[#202738] text-slate-400 hover:text-white transition-colors"
              title="Avançar 5s (L)"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          {/* Volume and Fullscreen */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="text-slate-400 hover:text-slate-200"
            >
              {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min="0"
              max="100"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                setVolume(Number(e.target.value));
                if (isMuted) setIsMuted(false);
              }}
              className="w-16 h-1 bg-[#252c3e] accent-indigo-500 rounded appearance-none cursor-pointer"
            />
            <button 
              onClick={() => {
                if (!document.fullscreenElement) {
                  document.documentElement.requestFullscreen().catch(() => {});
                } else {
                  document.exitFullscreen().catch(() => {});
                }
              }}
              className="p-1 text-slate-400 hover:text-slate-200 ml-1" 
              title="Tela Cheia"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
