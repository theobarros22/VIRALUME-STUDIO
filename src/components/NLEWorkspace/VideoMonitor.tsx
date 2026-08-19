import React, { useState, useEffect, useRef } from 'react';
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
import { PlatformSafeZone, CaptionStyleConfig, VideoAspectRatio } from '../../types';

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
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(80);
  const [showSafeZoneInfo, setShowSafeZoneInfo] = useState(true);

  // Format seconds to HH:MM:SS:FF
  const formatTimecode = (secs: number) => {
    const hours = Math.floor(secs / 3600).toString().padStart(2, '0');
    const mins = Math.floor((secs % 3600) / 60).toString().padStart(2, '0');
    const s = Math.floor(secs % 60).toString().padStart(2, '0');
    const frames = Math.floor((secs % 1) * 30).toString().padStart(2, '0');
    return `${hours}:${mins}:${s}:${frames}`;
  };

  // Determine current active subtitle word based on time
  const getActiveCaptionText = () => {
    if (currentTime < 2) return 'Bem-vindos ao';
    if (currentTime < 5) return 'tutorial mais';
    if (currentTime < 9) return 'incrível de todos!';
    if (currentTime < 13) return 'Vamos aprender como criar';
    if (currentTime < 18) return 'legendas virais no Reels!';
    return 'Viralume Studio: O futuro da edição.';
  };

  const activeText = getActiveCaptionText();

  return (
    <div className="h-full flex flex-col bg-[#11141f] border-l border-[#222838] text-slate-200 text-xs select-none">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-3.5 py-2 border-b border-[#202636] bg-[#141824]">
        <div className="flex items-center gap-2 font-semibold text-slate-100 text-xs">
          <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
          <span>Monitor de Vídeo</span>
          <span className="text-[10px] text-slate-500 font-mono">1080 x 1920 (9:16)</span>
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

      {/* Video Viewport / Canvas Container */}
      <div className="flex-1 relative flex items-center justify-center p-3 overflow-hidden bg-gradient-to-b from-[#0a0d14] via-[#0d1017] to-[#0a0d14]">
        
        {/* 9:16 Video Frame with rounded corners and subtle shadow */}
        <div className="relative h-full max-h-[540px] aspect-[9/16] rounded-2xl overflow-hidden shadow-2xl bg-black border border-[#2b334a] flex items-center justify-center group">
          
          {/* Simulated Video Creator Background (matching Image 1, 3, 5, 6) */}
          <div className="absolute inset-0 w-full h-full">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=85"
              alt="Creator Video"
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
            {/* Subtle cinematic gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />
          </div>

          {/* REAL-TIME DYNAMIC SUBTITLE OVERLAY */}
          <div 
            className="absolute inset-x-4 z-20 flex items-center justify-center pointer-events-none transition-all duration-200"
            style={{ bottom: `${100 - captionConfig.positionY}%` }}
          >
            {captionConfig.preset === 'viral_energetic' && (
              <div className="relative animate-bounce">
                {/* Yellow Comic Burst Backdrop matching Image 3 & 15 */}
                <div className="relative px-6 py-3 bg-[#FFE600] text-black font-['Montserrat',sans-serif] font-black text-xl tracking-tight rounded-2xl shadow-2xl border-4 border-black transform -rotate-2">
                  <div className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                    {activeText}
                  </div>
                  {/* Comic tail */}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#FFE600] border-r-4 border-b-4 border-black rotate-45" />
                </div>
              </div>
            )}

            {captionConfig.preset === 'podcast_clean' && (
              <div className="px-4 py-2 bg-black/80 backdrop-blur-md text-white font-['Plus_Jakarta_Sans',sans-serif] font-bold text-base tracking-wide rounded-xl border border-white/20 shadow-lg text-center">
                {activeText}
              </div>
            )}

            {captionConfig.preset === 'tiktok_bounce' && (
              <div className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white font-['Montserrat',sans-serif] font-extrabold text-lg tracking-wider rounded-full shadow-2xl border-2 border-white transform scale-105 animate-pulse">
                {activeText}
              </div>
            )}

            {captionConfig.preset === 'karaoke_glow' && (
              <div className="px-4 py-2 bg-black/70 rounded-xl text-lg font-bold font-['Plus_Jakarta_Sans',sans-serif] text-center border border-indigo-500/50">
                <span className="text-cyan-400 drop-shadow-[0_0_10px_#00e5ff]">{activeText.split(' ')[0]} </span>
                <span className="text-slate-300">{activeText.split(' ').slice(1).join(' ')}</span>
              </div>
            )}

            {captionConfig.preset === 'minimal_elegant' && (
              <div className="px-4 py-2 bg-slate-900/60 backdrop-blur text-amber-100 font-['Playfair_Display',serif] italic font-semibold text-lg text-center tracking-normal">
                "{activeText}"
              </div>
            )}

            {captionConfig.preset === 'storytelling_flow' && (
              <div className="px-4 py-1.5 bg-indigo-950/80 text-indigo-100 font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-sm rounded-lg border border-indigo-400/30">
                {activeText}
              </div>
            )}

            {captionConfig.preset === 'meme_style' && (
              <div className="text-white font-['Montserrat',sans-serif] font-black text-2xl uppercase tracking-wider text-center drop-shadow-[0_4px_4px_#000] stroke-black">
                😂 {activeText} 🔥
              </div>
            )}
          </div>

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
