import React, { useState, useRef, useEffect } from 'react';
import { 
  Scissors, 
  Magnet, 
  MoveHorizontal, 
  Bookmark, 
  ZoomIn, 
  ZoomOut, 
  Lock, 
  Unlock,
  Eye, 
  EyeOff,
  Volume2, 
  VolumeX, 
  Sparkles, 
  MousePointer, 
  Layers, 
  Film, 
  Music, 
  Trash2,
  Copy,
  Split,
  Plus,
  Play,
  Pause,
  CheckCircle2,
  Maximize2
} from 'lucide-react';
import { TimelineClip } from '../../types';

interface TimelinePanelProps {
  clips: TimelineClip[];
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  onOpenContextMenu: (x: number, y: number, clip?: TimelineClip) => void;
  onCutSilence: () => void;
  onSplitClip: (clipId?: string, splitTime?: number) => void;
  onDeleteClip?: (clipId: string) => void;
  onDuplicateClip?: (clipId: string) => void;
  onTrimClip?: (clipId: string, newStartOffset: number, newDuration: number, newSourceStart?: number) => void;
  selectedClipId?: string | null;
  onSelectClip?: (clipId: string | null) => void;
}

interface TimelineMarker {
  id: string;
  time: number;
  label: string;
  color: string;
}

export const TimelinePanel: React.FC<TimelinePanelProps> = ({
  clips,
  currentTime,
  duration,
  onSeek,
  onOpenContextMenu,
  onCutSilence,
  onSplitClip,
  onDeleteClip,
  onDuplicateClip,
  onTrimClip,
  selectedClipId,
  onSelectClip,
}) => {
  const [selectedTool, setSelectedTool] = useState<'select' | 'blade' | 'magnet' | 'slip'>('select');
  const [zoomLevel, setZoomLevel] = useState(1); // 1x to 3x
  const [editMode, setEditMode] = useState<'Ripple' | 'Roll' | 'Slip'>('Ripple');
  const [isMagnetActive, setIsMagnetActive] = useState(true);
  const [silencesCutCount, setSilencesCutCount] = useState<number | null>(null);
  const [markers, setMarkers] = useState<TimelineMarker[]>([
    { id: 'm1', time: 5.0, label: 'Gancho Viral', color: '#f59e0b' },
    { id: 'm2', time: 18.5, label: 'Pico de Retenção', color: '#3b82f6' }
  ]);

  // Track lock and visibility states
  const [trackStates, setTrackStates] = useState<Record<string, { locked: boolean; visible: boolean; muted: boolean }>>({
    overlay: { locked: false, visible: true, muted: false },
    video: { locked: false, visible: true, muted: false },
    captions: { locked: false, visible: true, muted: false },
    audio1: { locked: false, visible: true, muted: false },
    audio2: { locked: false, visible: true, muted: false },
  });

  const timelineRef = useRef<HTMLDivElement>(null);
  const [isDraggingPlayhead, setIsDraggingPlayhead] = useState(false);
  const [draggingTrim, setDraggingTrim] = useState<{
    clipId: string;
    type: 'left' | 'right' | 'body';
    startX: number;
    initialStartOffset: number;
    initialDuration: number;
    initialSourceStart: number;
  } | null>(null);

  const toggleTrack = (trackId: string, property: 'locked' | 'visible' | 'muted') => {
    setTrackStates(prev => ({
      ...prev,
      [trackId]: {
        ...prev[trackId],
        [property]: !prev[trackId]?.[property]
      }
    }));
  };

  // Handle timeline click / scrub
  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    const targetTime = percentage * duration;

    if (selectedTool === 'blade') {
      // Find clip under click on active track and split
      onSplitClip(selectedClipId || undefined, targetTime);
    } else {
      onSeek(targetTime);
    }
  };

  // Add marker at playhead
  const handleAddMarker = () => {
    const newMarker: TimelineMarker = {
      id: `marker-${Date.now()}`,
      time: currentTime,
      label: `Marcador ${markers.length + 1} (${currentTime.toFixed(1)}s)`,
      color: '#8b5cf6'
    };
    setMarkers(prev => [...prev, newMarker]);
  };

  // Keyboard shortcut listener within timeline scope
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === 'v' || e.key === 'V') {
        setSelectedTool('select');
      } else if (e.key === 'c' || e.key === 'C' || e.key === 'b' || e.key === 'B') {
        setSelectedTool('blade');
      } else if (e.key === 'n' || e.key === 'N') {
        setIsMagnetActive(prev => !prev);
      } else if (e.key === 'm' || e.key === 'M') {
        handleAddMarker();
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedClipId && onDeleteClip) {
          e.preventDefault();
          onDeleteClip(selectedClipId);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedClipId, onDeleteClip, currentTime, markers.length]);

  // Handle Trim Dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!draggingTrim || !timelineRef.current || !onTrimClip) return;
      const rect = timelineRef.current.getBoundingClientRect();
      const deltaX = e.clientX - draggingTrim.startX;
      const deltaTime = (deltaX / rect.width) * duration;

      if (draggingTrim.type === 'right') {
        const newDuration = Math.max(0.5, Math.min(duration - draggingTrim.initialStartOffset, draggingTrim.initialDuration + deltaTime));
        onTrimClip(draggingTrim.clipId, draggingTrim.initialStartOffset, newDuration);
      } else if (draggingTrim.type === 'left') {
        const maxDelta = draggingTrim.initialDuration - 0.5;
        const clampedDelta = Math.max(-draggingTrim.initialStartOffset, Math.min(maxDelta, deltaTime));
        const newStart = draggingTrim.initialStartOffset + clampedDelta;
        const newDuration = draggingTrim.initialDuration - clampedDelta;
        const newSourceStart = Math.max(0, draggingTrim.initialSourceStart + clampedDelta);
        onTrimClip(draggingTrim.clipId, newStart, newDuration, newSourceStart);
      } else if (draggingTrim.type === 'body') {
        let newStart = Math.max(0, Math.min(duration - draggingTrim.initialDuration, draggingTrim.initialStartOffset + deltaTime));
        // Magnet Snapping
        if (isMagnetActive) {
          if (Math.abs(newStart - currentTime) < 0.5) newStart = currentTime;
          if (Math.abs(newStart + draggingTrim.initialDuration - currentTime) < 0.5) newStart = currentTime - draggingTrim.initialDuration;
        }
        onTrimClip(draggingTrim.clipId, newStart, draggingTrim.initialDuration);
      }
    };

    const handleMouseUp = () => {
      if (draggingTrim) {
        setDraggingTrim(null);
      }
      if (isDraggingPlayhead) {
        setIsDraggingPlayhead(false);
      }
    };

    if (draggingTrim || isDraggingPlayhead) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingTrim, isDraggingPlayhead, duration, onTrimClip, isMagnetActive, currentTime]);

  const playheadPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Selected clip object
  const activeClip = clips.find(c => c.id === selectedClipId);

  return (
    <div className="w-full bg-[#10131d] border-t border-[#232838] flex flex-col text-slate-200 select-none text-xs">
      
      {/* 1. TOP PERFORMANCE & TIMELINE CACHE INDICATOR BAR */}
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
              <span className="w-2 h-2 rounded-full bg-amber-400" /> Proxy (Efeito em tempo real)
            </span>
            <span className="flex items-center gap-1 text-cyan-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-cyan-400" /> 60 FPS Suave
            </span>
          </div>
        </div>

        {/* Visual Cache Bar */}
        <div className="w-full h-1.5 rounded-full bg-[#181d2c] overflow-hidden flex shadow-inner">
          <div style={{ width: '60%' }} className="h-full bg-emerald-500 hover:brightness-110 transition-all cursor-help" title="00:00 - 00:36 Cache Renderizado" />
          <div style={{ width: '25%' }} className="h-full bg-amber-500 hover:brightness-110 transition-all cursor-help" title="00:36 - 00:51 Proxy Sincronizado" />
          <div style={{ width: '15%' }} className="h-full bg-emerald-500 hover:brightness-110 transition-all cursor-help" title="00:51 - 01:00 Cache Renderizado" />
        </div>
      </div>

      {/* 2. TIMELINE TOOLBAR */}
      <div className="flex flex-wrap items-center justify-between px-3 py-1.5 bg-[#141824] border-b border-[#202638] gap-2">
        {/* Left Tools: Pointer, Blade (C), Magnet (N), Slip (Y), Marker (M), Split Button, Trash */}
        <div className="flex items-center gap-1">
          {/* Pointer Tool */}
          <button
            onClick={() => setSelectedTool('select')}
            className={`px-2 py-1 rounded-lg transition-colors flex items-center gap-1.5 font-medium ${
              selectedTool === 'select'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#1d2334]'
            }`}
            title="Seleção Normal (V)"
          >
            <MousePointer className="w-3.5 h-3.5" />
            <span className="text-[10px]">V</span>
          </button>

          {/* Blade / Cut Tool */}
          <button
            onClick={() => setSelectedTool('blade')}
            className={`px-2 py-1 rounded-lg transition-colors flex items-center gap-1.5 font-medium ${
              selectedTool === 'blade'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30 animate-pulse'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#1d2334]'
            }`}
            title="Lâmina de Corte / Razor (C / B)"
          >
            <Scissors className="w-3.5 h-3.5" />
            <span className="text-[10px]">C</span>
          </button>

          {/* Direct Split at Playhead */}
          <button
            onClick={() => onSplitClip(selectedClipId || undefined, currentTime)}
            className="px-2 py-1 rounded-lg bg-[#1f2537] hover:bg-indigo-600 text-slate-300 hover:text-white transition-all flex items-center gap-1 border border-[#2e374f]"
            title="Dividir Clipe no Cursor Playhead (Ctrl+K / C)"
          >
            <Split className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-[10px] font-bold">Fatiar / Cortar</span>
          </button>

          <div className="h-4 w-px bg-[#262f44] mx-1" />

          {/* Magnet / Snapping */}
          <button
            onClick={() => setIsMagnetActive(!isMagnetActive)}
            className={`p-1.5 rounded-lg transition-colors ${
              isMagnetActive
                ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/50'
                : 'text-slate-500 hover:text-slate-300 hover:bg-[#1d2334]'
            }`}
            title={`Magnet / Snapping (${isMagnetActive ? 'Ativado' : 'Desativado'}) (N)`}
          >
            <Magnet className="w-3.5 h-3.5" />
          </button>

          {/* Slip Tool */}
          <button
            onClick={() => setSelectedTool(selectedTool === 'slip' ? 'select' : 'slip')}
            className={`p-1.5 rounded-lg transition-colors ${
              selectedTool === 'slip'
                ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/50'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#1d2334]'
            }`}
            title="Ferramenta Deslizar / Slip (Y)"
          >
            <MoveHorizontal className="w-3.5 h-3.5" />
          </button>

          {/* Marker Button */}
          <button
            onClick={handleAddMarker}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-[#1d2334]"
            title="Adicionar Marcador no Playhead (M)"
          >
            <Bookmark className="w-3.5 h-3.5" />
          </button>

          {/* Duplicate selected */}
          {selectedClipId && onDuplicateClip && (
            <button
              onClick={() => onDuplicateClip(selectedClipId)}
              className="p-1.5 rounded-lg text-indigo-300 bg-indigo-950/60 border border-indigo-500/30 hover:bg-indigo-900/60"
              title="Duplicar Clipe Selecionado (Ctrl+D)"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Delete selected */}
          {selectedClipId && onDeleteClip && (
            <button
              onClick={() => onDeleteClip(selectedClipId)}
              className="p-1.5 rounded-lg text-rose-300 bg-rose-950/60 border border-rose-500/30 hover:bg-rose-900/60"
              title="Apagar Clipe Selecionado (Delete / Backspace)"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Center: Cortar Silêncios Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              onCutSilence();
              setSilencesCutCount((prev) => (prev ? prev + 1.4 : 1.4));
            }}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/25 transition-all hover:scale-105 active:scale-95"
            title="Detectar e remover automaticamente pausas e silêncios do áudio"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span>Cortar Silêncios</span>
          </button>

          {silencesCutCount !== null && (
            <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
              <CheckCircle2 className="w-3 h-3" />
              {silencesCutCount.toFixed(1)}s de pausas removidas
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
              <option value="Ripple">Ondulação (Ripple Edit)</option>
              <option value="Roll">Rolo (Roll Edit)</option>
              <option value="Slip">Deslizar (Slip Edit)</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-slate-400">
            <button
              onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.25))}
              className="p-1 hover:text-white"
              title="Diminuir Zoom (-)"
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
              title="Aumentar Zoom (+)"
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
            <span>FX / Lock</span>
          </div>

          {/* Track 1: Overlay */}
          <div className="h-10 border-b border-[#1c2232] px-2.5 flex items-center justify-between bg-[#151927]">
            <span className="text-purple-400 flex items-center gap-1">
              <Layers className="w-3 h-3" /> Overlay
            </span>
            <div className="flex items-center gap-1.5 text-slate-500">
              <button onClick={() => toggleTrack('overlay', 'locked')} className="hover:text-slate-300">
                {trackStates.overlay.locked ? <Lock className="w-3 h-3 text-amber-400" /> : <Unlock className="w-3 h-3" />}
              </button>
              <button onClick={() => toggleTrack('overlay', 'visible')} className="hover:text-slate-300">
                {trackStates.overlay.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3 text-rose-400" />}
              </button>
            </div>
          </div>

          {/* Track 2: Video */}
          <div className="h-14 border-b border-[#1c2232] px-2.5 flex items-center justify-between bg-[#131724]">
            <span className="text-blue-400 flex items-center gap-1 font-bold">
              <Film className="w-3.5 h-3.5" /> Vídeo Main
            </span>
            <div className="flex items-center gap-1.5 text-slate-500">
              <button onClick={() => toggleTrack('video', 'locked')} className="hover:text-slate-300">
                {trackStates.video.locked ? <Lock className="w-3 h-3 text-amber-400" /> : <Unlock className="w-3 h-3" />}
              </button>
              <button onClick={() => toggleTrack('video', 'visible')} className="hover:text-slate-300">
                {trackStates.video.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3 text-rose-400" />}
              </button>
            </div>
          </div>

          {/* Track 3: Subtitles / Captions */}
          <div className="h-9 border-b border-[#1c2232] px-2.5 flex items-center justify-between bg-[#151927]">
            <span className="text-amber-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Legendas
            </span>
            <div className="flex items-center gap-1.5 text-slate-500">
              <button onClick={() => toggleTrack('captions', 'locked')} className="hover:text-slate-300">
                {trackStates.captions.locked ? <Lock className="w-3 h-3 text-amber-400" /> : <Unlock className="w-3 h-3" />}
              </button>
              <button onClick={() => toggleTrack('captions', 'visible')} className="hover:text-slate-300">
                {trackStates.captions.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3 text-rose-400" />}
              </button>
            </div>
          </div>

          {/* Track 4: Audio 1 (Voice) */}
          <div className="h-11 border-b border-[#1c2232] px-2.5 flex items-center justify-between bg-[#131724]">
            <span className="text-emerald-400 flex items-center gap-1">
              <Volume2 className="w-3 h-3" /> Voz / Mic
            </span>
            <div className="flex items-center gap-1.5 text-slate-500">
              <button onClick={() => toggleTrack('audio1', 'muted')} className="hover:text-slate-300">
                {trackStates.audio1.muted ? <VolumeX className="w-3 h-3 text-rose-400" /> : <Volume2 className="w-3 h-3 text-emerald-400" />}
              </button>
              <button onClick={() => toggleTrack('audio1', 'locked')} className="hover:text-slate-300">
                {trackStates.audio1.locked ? <Lock className="w-3 h-3 text-amber-400" /> : <Unlock className="w-3 h-3" />}
              </button>
            </div>
          </div>

          {/* Track 5: Audio 2 (Music) */}
          <div className="h-11 border-b border-[#1c2232] px-2.5 flex items-center justify-between bg-[#121520]">
            <span className="text-cyan-400 flex items-center gap-1">
              <Music className="w-3 h-3" /> Fundo SFX
            </span>
            <div className="flex items-center gap-1.5 text-slate-500">
              <button onClick={() => toggleTrack('audio2', 'muted')} className="hover:text-slate-300">
                {trackStates.audio2.muted ? <VolumeX className="w-3 h-3 text-rose-400" /> : <Volume2 className="w-3 h-3 text-cyan-400" />}
              </button>
              <button onClick={() => toggleTrack('audio2', 'locked')} className="hover:text-slate-300">
                {trackStates.audio2.locked ? <Lock className="w-3 h-3 text-amber-400" /> : <Unlock className="w-3 h-3" />}
              </button>
            </div>
          </div>
        </div>

        {/* Timeline Tracks Canvas & Playhead Area */}
        <div 
          ref={timelineRef}
          onClick={handleTimelineClick}
          className={`flex-1 relative overflow-x-auto overflow-y-hidden bg-[#0d1017] ${
            selectedTool === 'blade' ? 'cursor-crosshair' : 'cursor-pointer'
          }`}
        >
          {/* Time Ruler (00:00, 00:05, 00:10, 00:15...) */}
          <div className="h-7 bg-[#131724] border-b border-[#202636] flex items-center justify-between px-2 text-[10px] text-slate-400 font-mono select-none relative">
            {Array.from({ length: 9 }).map((_, idx) => {
              const sec = Math.round((duration / 8) * idx);
              const m = Math.floor(sec / 60);
              const s = sec % 60;
              const formatted = `00:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
              return (
                <div key={idx} className="flex flex-col items-center">
                  <span>{formatted}</span>
                  <div className="w-px h-1.5 bg-slate-600 mt-0.5" />
                </div>
              );
            })}

            {/* Render Visual Markers */}
            {markers.map(m => {
              const markerPercent = duration > 0 ? (m.time / duration) * 100 : 0;
              return (
                <div
                  key={m.id}
                  style={{ left: `${markerPercent}%` }}
                  className="absolute top-0 bottom-0 flex flex-col items-center pointer-events-auto cursor-pointer group"
                  title={`${m.label} (${m.time.toFixed(1)}s)`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSeek(m.time);
                  }}
                >
                  <div 
                    style={{ backgroundColor: m.color }}
                    className="w-2.5 h-2.5 rotate-45 -mt-0.5 rounded-sm shadow group-hover:scale-125 transition-transform"
                  />
                  <div style={{ backgroundColor: m.color }} className="w-px h-full opacity-60" />
                </div>
              );
            })}
          </div>

          {/* Vertical Playhead Cursor Line */}
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
            {clips.filter(c => c.trackId === 'overlay').map((clip) => {
              const isSelected = clip.id === selectedClipId;
              return (
                <div
                  key={clip.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (selectedTool === 'blade') {
                      onSplitClip(clip.id, currentTime);
                    } else if (onSelectClip) {
                      onSelectClip(clip.id);
                    }
                  }}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    if (onSelectClip) onSelectClip(clip.id);
                    onOpenContextMenu(e.clientX, e.clientY, clip);
                  }}
                  style={{ 
                    left: `${duration > 0 ? (clip.startOffset / duration) * 100 : 0}%`,
                    width: `${duration > 0 ? (clip.duration / duration) * 100 : 0}%` 
                  }}
                  className={`absolute h-7 rounded-md text-white flex items-center justify-between px-2 shadow-sm truncate cursor-grab group transition-all ${
                    isSelected
                      ? 'bg-purple-600 border-2 border-white ring-2 ring-purple-400 shadow-lg'
                      : 'bg-purple-600/70 hover:bg-purple-500/80 border border-purple-400/50'
                  }`}
                >
                  {/* Left Trim Handle */}
                  <div
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      setDraggingTrim({
                        clipId: clip.id,
                        type: 'left',
                        startX: e.clientX,
                        initialStartOffset: clip.startOffset,
                        initialDuration: clip.duration,
                        initialSourceStart: clip.sourceStart || 0
                      });
                    }}
                    className="absolute left-0 inset-y-0 w-2 hover:bg-white/40 cursor-ew-resize rounded-l"
                    title="Ajustar Início (Trim Left)"
                  />

                  <div className="flex items-center min-w-0">
                    <Layers className="w-3 h-3 mr-1 flex-shrink-0" />
                    <span className="truncate text-[10px] font-semibold">{clip.name}</span>
                  </div>

                  {/* Right Trim Handle */}
                  <div
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      setDraggingTrim({
                        clipId: clip.id,
                        type: 'right',
                        startX: e.clientX,
                        initialStartOffset: clip.startOffset,
                        initialDuration: clip.duration,
                        initialSourceStart: clip.sourceStart || 0
                      });
                    }}
                    className="absolute right-0 inset-y-0 w-2 hover:bg-white/40 cursor-ew-resize rounded-r"
                    title="Ajustar Fim (Trim Right)"
                  />
                </div>
              );
            })}
          </div>

          {/* TRACK 2: MAIN VIDEO WITH THUMBNAIL FILMSTRIPS */}
          <div className="h-14 border-b border-[#1c2232] relative flex items-center px-1 bg-[#0f121c]">
            {clips.filter(c => c.trackId === 'video').map((clip, idx) => {
              const isSelected = clip.id === selectedClipId;
              return (
                <div
                  key={clip.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (selectedTool === 'blade') {
                      onSplitClip(clip.id, currentTime);
                    } else if (onSelectClip) {
                      onSelectClip(clip.id);
                    }
                  }}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    if (onSelectClip) onSelectClip(clip.id);
                    onOpenContextMenu(e.clientX, e.clientY, clip);
                  }}
                  onMouseDown={(e) => {
                    if (selectedTool === 'select') {
                      // Allow moving the clip
                      setDraggingTrim({
                        clipId: clip.id,
                        type: 'body',
                        startX: e.clientX,
                        initialStartOffset: clip.startOffset,
                        initialDuration: clip.duration,
                        initialSourceStart: clip.sourceStart || 0
                      });
                    }
                  }}
                  style={{ 
                    left: `${duration > 0 ? (clip.startOffset / duration) * 100 : 0}%`,
                    width: `${duration > 0 ? (clip.duration / duration) * 100 : 0}%` 
                  }}
                  className={`absolute h-11 rounded-lg overflow-hidden border ${
                    isSelected
                      ? 'border-white ring-2 ring-indigo-400 shadow-xl'
                      : 'border-blue-500/50 hover:border-blue-400'
                  } bg-slate-900 flex items-center shadow-md cursor-grab group transition-all`}
                >
                  {/* Left Trim Handle */}
                  <div
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      setDraggingTrim({
                        clipId: clip.id,
                        type: 'left',
                        startX: e.clientX,
                        initialStartOffset: clip.startOffset,
                        initialDuration: clip.duration,
                        initialSourceStart: clip.sourceStart || 0
                      });
                    }}
                    className="absolute left-0 inset-y-0 w-2.5 z-20 hover:bg-white/50 cursor-ew-resize bg-black/40 rounded-l flex items-center justify-center text-[8px] text-white"
                    title="Ajustar Ponto de Entrada (Trim In)"
                  >
                    |
                  </div>

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
                  <div className="relative z-10 px-3 flex items-center justify-between w-full text-white text-[10px] font-bold drop-shadow">
                    <span className="truncate">{clip.name}</span>
                    {clip.isProxy && (
                      <span className="w-3.5 h-3.5 rounded-full bg-blue-600 text-[8px] font-mono flex items-center justify-center shadow">
                        P
                      </span>
                    )}
                  </div>

                  {/* Right Trim Handle */}
                  <div
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      setDraggingTrim({
                        clipId: clip.id,
                        type: 'right',
                        startX: e.clientX,
                        initialStartOffset: clip.startOffset,
                        initialDuration: clip.duration,
                        initialSourceStart: clip.sourceStart || 0
                      });
                    }}
                    className="absolute right-0 inset-y-0 w-2.5 z-20 hover:bg-white/50 cursor-ew-resize bg-black/40 rounded-r flex items-center justify-center text-[8px] text-white"
                    title="Ajustar Ponto de Saída (Trim Out)"
                  >
                    |
                  </div>
                </div>
              );
            })}
          </div>

          {/* TRACK 3: CAPTIONS / SUBTITLES */}
          <div className="h-9 border-b border-[#1c2232] relative flex items-center px-1 bg-[#10131e]/50">
            {clips.filter(c => c.trackId === 'captions').map((clip) => {
              const isSelected = clip.id === selectedClipId;
              const isActive = currentTime >= clip.startOffset && currentTime <= (clip.startOffset + clip.duration);
              return (
                <div
                  key={clip.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (selectedTool === 'blade') {
                      onSplitClip(clip.id, currentTime);
                    } else if (onSelectClip) {
                      onSelectClip(clip.id);
                    }
                  }}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    if (onSelectClip) onSelectClip(clip.id);
                    onOpenContextMenu(e.clientX, e.clientY, clip);
                  }}
                  style={{ 
                    left: `${duration > 0 ? (clip.startOffset / duration) * 100 : 0}%`,
                    width: `${duration > 0 ? (clip.duration / duration) * 100 : 0}%` 
                  }}
                  className={`caption-track-item absolute h-6 rounded-md font-bold flex items-center justify-between px-2 shadow-sm truncate cursor-grab text-[10px] transition-all ${
                    isActive ? 'active ring-2 ring-yellow-400 border-yellow-300' : ''
                  } ${
                    isSelected
                      ? 'bg-amber-400 border-2 border-white ring-2 ring-amber-300 text-black'
                      : isActive
                      ? 'bg-amber-400 text-black font-extrabold shadow-md scale-[1.02]'
                      : 'bg-amber-500/80 hover:bg-amber-400 border border-amber-300 text-black'
                  }`}
                >
                  {/* Left Trim Handle */}
                  <div
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      setDraggingTrim({
                        clipId: clip.id,
                        type: 'left',
                        startX: e.clientX,
                        initialStartOffset: clip.startOffset,
                        initialDuration: clip.duration,
                        initialSourceStart: clip.sourceStart || 0
                      });
                    }}
                    className="absolute left-0 inset-y-0 w-2 hover:bg-black/30 cursor-ew-resize rounded-l"
                  />

                  <div className="flex items-center min-w-0">
                    <Sparkles className="w-2.5 h-2.5 mr-1 flex-shrink-0" />
                    <span className="truncate">{clip.name}</span>
                  </div>

                  {/* Right Trim Handle */}
                  <div
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      setDraggingTrim({
                        clipId: clip.id,
                        type: 'right',
                        startX: e.clientX,
                        initialStartOffset: clip.startOffset,
                        initialDuration: clip.duration,
                        initialSourceStart: clip.sourceStart || 0
                      });
                    }}
                    className="absolute right-0 inset-y-0 w-2 hover:bg-black/30 cursor-ew-resize rounded-r"
                  />
                </div>
              );
            })}
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
                Áudio_Voz_Original.wav (100% Vol)
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
                Trilha_Sonora_AutoDucking.mp3 (-14 LUFS)
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
