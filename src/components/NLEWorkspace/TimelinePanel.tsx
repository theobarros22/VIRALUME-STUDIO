import React, { useState, useRef } from 'react';
import { 
  Scissors, 
  Magnet, 
  MoveHorizontal, 
  Bookmark, 
  ZoomIn, 
  ZoomOut, 
  Lock, 
  Eye, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  MousePointer, 
  Layers, 
  Film, 
  Music, 
  ChevronDown,
  Plus,
  Play,
  Pause,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { TimelineClip } from '../../types';

interface TimelinePanelProps {
  clips: TimelineClip[];
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  onOpenContextMenu: (x: number, y: number, clip?: TimelineClip) => void;
  onCutSilence: () => void;
  onSplitClip: (clipId: string) => void;
}

export const TimelinePanel: React.FC<TimelinePanelProps> = ({
  clips,
  currentTime,
  duration,
  onSeek,
  onOpenContextMenu,
  onCutSilence,
  onSplitClip,
}) => {
  const [selectedTool, setSelectedTool] = useState<'select' | 'blade' | 'magnet' | 'slip'>('select');
  const [zoomLevel, setZoomLevel] = useState(1); // 1x to 3x
  const [editMode, setEditMode] = useState<'Ripple' | 'Roll' | 'Slip'>('Ripple');
  const [silencesCutCount, setSilencesCutCount] = useState<number | null>(3.4);
  const timelineRef = useRef<HTMLDivElement>(null);

  // Handle timeline click / scrub
  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    onSeek(percentage * duration);
  };

  const playheadPercent = (currentTime / duration) * 100;

  return (
    <div className="w-full bg-[#10131d] border-t border-[#232838] flex flex-col text-slate-200 select-none text-xs">
      
      {/* 1. TOP PERFORMANCE & TIMELINE CACHE INDICATOR BAR (Image 9) */}
      <div className="bg-[#0b0d14] px-4 py-1.5 border-b border-[#1c2130] flex flex-col gap-1">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-400 font-medium flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Indicadores de Performance e Cache da Timeline (GPU Acelerada)
          </span>
          <div className="flex items-center gap-4 text-[10px]">
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400" /> Cache (Instantâneo)
            </span>
            <span className="flex items-center gap-1 text-amber-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-amber-400" /> Proxy (Efeito não renderizado)
            </span>
            <span className="flex items-center gap-1 text-rose-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-rose-400" /> Sem Cache (Pode haver lag)
            </span>
          </div>
        </div>

        {/* Visual Cache Bar exactly matching Image 9 */}
        <div className="w-full h-2 rounded-full bg-[#181d2c] overflow-hidden flex shadow-inner">
          <div style={{ width: '45%' }} className="h-full bg-emerald-500 hover:brightness-110 transition-all cursor-help" title="00:00 - 00:45 Cache Instantâneo" />
          <div style={{ width: '25%' }} className="h-full bg-amber-500 hover:brightness-110 transition-all cursor-help" title="00:45 - 01:10 Proxy em Processamento" />
          <div style={{ width: '15%' }} className="h-full bg-rose-500 hover:brightness-110 transition-all cursor-help" title="01:10 - 01:25 Sem Cache" />
          <div style={{ width: '15%' }} className="h-full bg-emerald-500 hover:brightness-110 transition-all cursor-help" title="01:25 - 01:40 Cache Instantâneo" />
        </div>
      </div>

      {/* 2. TIMELINE TOOLBAR matching Image 7 */}
      <div className="flex flex-wrap items-center justify-between px-3 py-1.5 bg-[#141824] border-b border-[#202638] gap-2">
        {/* Left Tools: Pointer, Blade (B), Magnet, Slip, Marker */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setSelectedTool('select')}
            className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 ${
              selectedTool === 'select'
                ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/50 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#1d2334]'
            }`}
            title="Seleção (V)"
          >
            <MousePointer className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => {
              setSelectedTool('blade');
              onSplitClip('clip-vid-1');
            }}
            className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 ${
              selectedTool === 'blade'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#1d2334]'
            }`}
            title="Lâmina de Corte (B / Ctrl+B)"
          >
            <Scissors className="w-3.5 h-3.5" />
            <span className="text-[10px] font-mono">B</span>
          </button>

          <button
            onClick={() => setSelectedTool('magnet')}
            className={`p-1.5 rounded-lg transition-colors ${
              selectedTool === 'magnet'
                ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/50'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#1d2334]'
            }`}
            title="Snapping / Magnet (N)"
          >
            <Magnet className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setSelectedTool('slip')}
            className={`p-1.5 rounded-lg transition-colors ${
              selectedTool === 'slip'
                ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/50'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#1d2334]'
            }`}
            title="Slip Tool (Y)"
          >
            <MoveHorizontal className="w-3.5 h-3.5" />
          </button>

          <button
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-[#1d2334]"
            title="Adicionar Marcador (M)"
          >
            <Bookmark className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Center: Cortar Silêncios Button matching Image 7 */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              onCutSilence();
              setSilencesCutCount((prev) => (prev ? prev + 1.2 : 1.2));
            }}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/25 transition-all hover:scale-105 active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Cortar Silêncios</span>
          </button>

          {silencesCutCount && (
            <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
              <CheckCircle2 className="w-3 h-3" />
              {silencesCutCount.toFixed(1)}s removidos
            </span>
          )}
        </div>

        {/* Right Tools: Edit Mode & Zoom Slider */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <span>Modo:</span>
            <select
              value={editMode}
              onChange={(e) => setEditMode(e.target.value as any)}
              className="bg-[#0f121c] border border-[#262f44] rounded px-2 py-0.5 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
            >
              <option value="Ripple">Ondulação (Ripple)</option>
              <option value="Roll">Rolo (Roll)</option>
              <option value="Slip">Deslizar (Slip)</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-slate-400">
            <button
              onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.25))}
              className="p-1 hover:text-white"
            >
              <ZoomOut className="w-3 h-3" />
            </button>
            <input
              type="range"
              min="0.5"
              max="2.5"
              step="0.1"
              value={zoomLevel}
              onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
              className="w-16 h-1 bg-[#20273a] accent-indigo-500 rounded appearance-none cursor-pointer"
            />
            <button
              onClick={() => setZoomLevel(Math.min(2.5, zoomLevel + 0.25))}
              className="p-1 hover:text-white"
            >
              <ZoomIn className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. MULTI-TRACK TIMELINE CONTAINER */}
      <div className="relative flex flex-1 overflow-hidden min-h-[220px]">
        
        {/* Track Headers Column */}
        <div className="w-36 flex-shrink-0 bg-[#121520] border-r border-[#202636] z-10 text-[11px] font-medium text-slate-400">
          
          {/* Time Ruler Spacer */}
          <div className="h-7 border-b border-[#202636] px-2 flex items-center justify-between text-[10px] text-slate-500">
            <span>Faixas</span>
            <span>FX</span>
          </div>

          {/* Track 1: Overlay */}
          <div className="h-10 border-b border-[#1c2232] px-2.5 flex items-center justify-between bg-[#151927]">
            <span className="text-purple-400 flex items-center gap-1">
              <Layers className="w-3 h-3" /> Overlay
            </span>
            <div className="flex items-center gap-1 text-slate-500">
              <Lock className="w-3 h-3 cursor-pointer hover:text-slate-300" />
              <Eye className="w-3 h-3 cursor-pointer hover:text-slate-300" />
            </div>
          </div>

          {/* Track 2: Video */}
          <div className="h-14 border-b border-[#1c2232] px-2.5 flex items-center justify-between bg-[#131724]">
            <span className="text-blue-400 flex items-center gap-1">
              <Film className="w-3 h-3" /> Vídeo Main
            </span>
            <div className="flex items-center gap-1 text-slate-500">
              <Lock className="w-3 h-3 cursor-pointer hover:text-slate-300" />
              <Eye className="w-3 h-3 cursor-pointer hover:text-slate-300" />
            </div>
          </div>

          {/* Track 3: Subtitles / Captions */}
          <div className="h-9 border-b border-[#1c2232] px-2.5 flex items-center justify-between bg-[#151927]">
            <span className="text-amber-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Legendas
            </span>
            <div className="flex items-center gap-1 text-slate-500">
              <Lock className="w-3 h-3 cursor-pointer hover:text-slate-300" />
              <Eye className="w-3 h-3 cursor-pointer hover:text-slate-300" />
            </div>
          </div>

          {/* Track 4: Audio 1 (Voice) */}
          <div className="h-11 border-b border-[#1c2232] px-2.5 flex items-center justify-between bg-[#131724]">
            <span className="text-emerald-400 flex items-center gap-1">
              <Volume2 className="w-3 h-3" /> Voz / Mic
            </span>
            <div className="flex items-center gap-1 text-slate-500">
              <Volume2 className="w-3 h-3 cursor-pointer hover:text-slate-300" />
              <Lock className="w-3 h-3 cursor-pointer hover:text-slate-300" />
            </div>
          </div>

          {/* Track 5: Audio 2 (Music) */}
          <div className="h-11 border-b border-[#1c2232] px-2.5 flex items-center justify-between bg-[#121520]">
            <span className="text-cyan-400 flex items-center gap-1">
              <Music className="w-3 h-3" /> Fundo SFX
            </span>
            <div className="flex items-center gap-1 text-slate-500">
              <Volume2 className="w-3 h-3 cursor-pointer hover:text-slate-300" />
              <Lock className="w-3 h-3 cursor-pointer hover:text-slate-300" />
            </div>
          </div>
        </div>

        {/* Timeline Tracks Canvas & Playhead Area */}
        <div 
          ref={timelineRef}
          onClick={handleTimelineClick}
          className="flex-1 relative overflow-x-auto overflow-y-hidden bg-[#0d1017] cursor-pointer"
        >
          {/* Time Ruler (00:00, 00:15, 00:30, 00:45, 01:00...) */}
          <div className="h-7 bg-[#131724] border-b border-[#202636] flex items-center justify-between px-2 text-[10px] text-slate-400 font-mono select-none">
            {['00:00:00', '00:00:15', '00:00:30', '00:00:45', '00:01:00', '00:01:15', '00:01:30', '00:01:45', '00:02:00'].map((timeStr, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <span>{timeStr}</span>
                <div className="w-px h-1.5 bg-slate-600 mt-0.5" />
              </div>
            ))}
          </div>

          {/* Vertical Playhead Cursor Line with Purple Head matching Image 5 & 6 */}
          <div
            style={{ left: `${playheadPercent}%` }}
            className="absolute top-0 bottom-0 z-30 pointer-events-none transition-all duration-75"
          >
            {/* Playhead Diamond/Arrow */}
            <div className="relative -left-2.5 top-0 w-5 h-6 bg-indigo-500 clip-playhead flex items-center justify-center shadow-lg shadow-indigo-500/50">
              <div className="w-1.5 h-1.5 bg-white rounded-full" />
            </div>
            {/* Playhead Vertical Line */}
            <div className="w-0.5 h-full bg-indigo-400 shadow-sm shadow-indigo-400/80" />
          </div>

          {/* TRACK 1: OVERLAY CLIPS */}
          <div className="h-10 border-b border-[#1c2232] relative flex items-center px-1 bg-[#10131e]/50">
            {clips.filter(c => c.trackId === 'overlay').map((clip, i) => (
              <div
                key={clip.id}
                onContextMenu={(e) => {
                  e.preventDefault();
                  onOpenContextMenu(e.clientX, e.clientY, clip);
                }}
                style={{ 
                  left: `${(clip.startOffset / duration) * 100}%`,
                  width: `${(clip.duration / duration) * 100}%` 
                }}
                className="absolute h-7 rounded-md bg-purple-600/70 hover:bg-purple-500/80 border border-purple-400/50 text-white flex items-center px-2 shadow-sm truncate cursor-grab"
              >
                <Layers className="w-3 h-3 mr-1 flex-shrink-0" />
                <span className="truncate text-[10px] font-semibold">{clip.name}</span>
              </div>
            ))}
          </div>

          {/* TRACK 2: MAIN VIDEO WITH THUMBNAIL FILMSTRIPS (Image 5 & 6) */}
          <div className="h-14 border-b border-[#1c2232] relative flex items-center px-1 bg-[#0f121c]">
            {clips.filter(c => c.trackId === 'video').map((clip, idx) => (
              <div
                key={clip.id}
                onContextMenu={(e) => {
                  e.preventDefault();
                  onOpenContextMenu(e.clientX, e.clientY, clip);
                }}
                style={{ 
                  left: `${(clip.startOffset / duration) * 100}%`,
                  width: `${(clip.duration / duration) * 100}%` 
                }}
                className={`absolute h-11 rounded-lg overflow-hidden border ${
                  idx === 0 ? 'border-indigo-400 ring-2 ring-indigo-500/30' : 'border-blue-500/40'
                } bg-slate-900 flex items-center shadow-md cursor-grab group`}
              >
                {/* Filmstrip Thumbnail Background */}
                <div className="absolute inset-0 flex overflow-hidden opacity-80 group-hover:opacity-100 transition-opacity">
                  <img
                    src={clip.thumbnailUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'}
                    alt="filmstrip"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-blue-900/30 backdrop-blur-[0.5px]" />
                </div>

                {/* Clip Title & Proxy Badge */}
                <div className="relative z-10 px-2 flex items-center justify-between w-full text-white text-[10px] font-bold drop-shadow">
                  <span className="truncate">{clip.name}</span>
                  {clip.isProxy && (
                    <span className="w-3.5 h-3.5 rounded-full bg-blue-600 text-[8px] font-mono flex items-center justify-center shadow">
                      P
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* TRACK 3: CAPTIONS / SUBTITLES */}
          <div className="h-9 border-b border-[#1c2232] relative flex items-center px-1 bg-[#10131e]/50">
            {clips.filter(c => c.trackId === 'captions').map((clip) => (
              <div
                key={clip.id}
                onContextMenu={(e) => {
                  e.preventDefault();
                  onOpenContextMenu(e.clientX, e.clientY, clip);
                }}
                style={{ 
                  left: `${(clip.startOffset / duration) * 100}%`,
                  width: `${(clip.duration / duration) * 100}%` 
                }}
                className="absolute h-6 rounded-md bg-amber-500/80 hover:bg-amber-400 border border-amber-300 text-black font-bold flex items-center px-2 shadow-sm truncate cursor-grab text-[10px]"
              >
                <Sparkles className="w-2.5 h-2.5 mr-1" />
                <span className="truncate">{clip.name}</span>
              </div>
            ))}
          </div>

          {/* TRACK 4: AUDIO 1 (VOICE WAVEFORM) */}
          <div className="h-11 border-b border-[#1c2232] relative flex items-center px-1 bg-[#0c0f17]">
            <div className="absolute inset-y-1 inset-x-1 rounded-md bg-emerald-950/60 border border-emerald-500/40 flex items-center px-2 overflow-hidden">
              <svg className="w-full h-8 text-emerald-400" viewBox="0 0 400 40" preserveAspectRatio="none">
                <path
                  d="M0 20 Q10 5, 20 20 T40 20 T60 5 T80 35 T100 20 T120 2 T140 38 T160 20 T180 8 T200 32 T220 20 T240 5 T260 35 T280 20 T300 2 T320 38 T340 20 T360 10 T380 30 T400 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
              <div className="absolute left-2 top-1 text-[9px] font-semibold text-emerald-300 bg-black/50 px-1 rounded">
                Voz_Principal_Mic_01.wav
              </div>
            </div>
          </div>

          {/* TRACK 5: AUDIO 2 (SFX / MUSIC WAVEFORM) */}
          <div className="h-11 border-b border-[#1c2232] relative flex items-center px-1 bg-[#0c0f17]">
            <div className="absolute inset-y-1 inset-x-1 rounded-md bg-cyan-950/60 border border-cyan-500/40 flex items-center px-2 overflow-hidden">
              <svg className="w-full h-8 text-cyan-400" viewBox="0 0 400 40" preserveAspectRatio="none">
                <path
                  d="M0 20 Q5 15, 15 20 T30 20 T50 10 T70 30 T90 20 T110 5 T130 35 T150 20 T170 12 T190 28 T210 20 T230 10 T250 30 T270 20 T290 8 T310 32 T330 20 T350 15 T370 25 T400 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
              <div className="absolute left-2 top-1 text-[9px] font-semibold text-cyan-300 bg-black/50 px-1 rounded">
                Fundo_Musical_Lofi_Beat.mp3 (35% Vol)
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
