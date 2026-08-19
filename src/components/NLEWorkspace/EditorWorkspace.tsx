import React, { useState, useEffect } from 'react';
import { MediaLibraryPanel } from './MediaLibraryPanel';
import { ContextualInspector } from './ContextualInspector';
import { VideoMonitor } from './VideoMonitor';
import { TimelinePanel } from './TimelinePanel';
import { ContextMenu } from './ContextMenu';
import { 
  ProjectData, 
  TimelineClip, 
  InspectorState, 
  PlatformSafeZone, 
  CaptionStyleConfig 
} from '../../types';
import { INITIAL_CLIPS } from '../../data/mockData';

interface EditorWorkspaceProps {
  project: ProjectData;
  captionConfig: CaptionStyleConfig;
  safeZone: PlatformSafeZone;
  onSafeZoneChange: (zone: PlatformSafeZone) => void;
  onOpenExport: () => void;
  onCutSilenceSuccess?: () => void;
}

export const EditorWorkspace: React.FC<EditorWorkspaceProps> = ({
  project,
  captionConfig,
  safeZone,
  onSafeZoneChange,
  onOpenExport,
  onCutSilenceSuccess,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(15.2);
  const [duration, setDuration] = useState(project.durationSec || 120);
  const [clips, setClips] = useState<TimelineClip[]>(INITIAL_CLIPS);
  
  const [inspectorState, setInspectorState] = useState<InspectorState>({
    posX: 148,
    posY: 35,
    scale: 1.0,
    rotation: 0,
    anchorPoint: 1.0,
    opacity: 100,
    exposure: 0.2,
    contrast: 0.5,
    saturation: 1.2,
    temperature: -0.5,
    liftColor: '#00e5ff',
    gammaColor: '#fbbf24',
    gainColor: '#f43f5e'
  });

  const [contextMenuState, setContextMenuState] = useState<{
    visible: boolean;
    x: number;
    y: number;
    targetClip?: TimelineClip;
  }>({
    visible: false,
    x: 0,
    y: 0
  });

  // Keyboard shortcuts (Space, J, L, B, Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying(prev => !prev);
      } else if (e.key === 'j' || e.key === 'J') {
        e.preventDefault();
        setCurrentTime(prev => Math.max(0, prev - 5));
      } else if (e.key === 'l' || e.key === 'L') {
        e.preventDefault();
        setCurrentTime(prev => Math.min(duration, prev + 5));
      } else if (e.key === 'b' || e.key === 'B') {
        e.preventDefault();
        handleSplitClip('clip-vid-1');
      } else if (e.key === 'Escape') {
        setContextMenuState(prev => ({ ...prev, visible: false }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [duration]);

  // Playback timer simulation
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 0.1;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  // Handle Inspector change
  const handleInspectorChange = (newState: Partial<InspectorState>) => {
    setInspectorState((prev) => ({ ...prev, ...newState }));
  };

  const handleResetInspector = () => {
    setInspectorState({
      posX: 0,
      posY: 0,
      scale: 1.0,
      rotation: 0,
      anchorPoint: 1.0,
      opacity: 100,
      exposure: 0,
      contrast: 0,
      saturation: 0,
      temperature: 0,
      liftColor: '#00e5ff',
      gammaColor: '#fbbf24',
      gainColor: '#f43f5e'
    });
  };

  // Split clip at playhead (Blade action Ctrl+B)
  const handleSplitClip = (clipId: string) => {
    const target = clips.find(c => c.id === clipId) || clips[2];
    if (!target) return;
    
    const newId = `clip-split-${Date.now()}`;
    const splitPoint = currentTime - target.startOffset;
    
    if (splitPoint > 1 && splitPoint < target.duration - 1) {
      const originalDuration = target.duration;
      const updatedOriginal: TimelineClip = {
        ...target,
        duration: splitPoint
      };
      const newClip: TimelineClip = {
        ...target,
        id: newId,
        name: `${target.name} (Parte 2)`,
        startOffset: target.startOffset + splitPoint,
        duration: originalDuration - splitPoint
      };
      setClips(prev => [...prev.filter(c => c.id !== target.id), updatedOriginal, newClip]);
    }
  };

  const handleCutSilence = () => {
    if (onCutSilenceSuccess) onCutSilenceSuccess();
  };

  const handleOpenContextMenu = (x: number, y: number, clip?: TimelineClip) => {
    setContextMenuState({
      visible: true,
      x,
      y,
      targetClip: clip
    });
  };

  const handleContextMenuAction = (action: string) => {
    if (action === 'Dividir no Playhead') {
      handleSplitClip('clip-vid-1');
    } else if (action === 'Cortar Silêncios') {
      handleCutSilence();
    } else {
      // Notification feedback
      console.log(`Action executed: ${action}`);
    }
  };

  return (
    <div 
      className="flex-1 flex flex-col h-[calc(100vh-85px)] bg-[#0d1017] text-slate-100 select-none overflow-hidden"
      onContextMenu={(e) => {
        // Prevent default browser context menu inside workspace
        e.preventDefault();
        handleOpenContextMenu(e.clientX, e.clientY);
      }}
    >
      {/* Upper Area: Left Column (Media + Inspector) & Right Column (Video Monitor) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0 overflow-hidden">
        
        {/* Left Side: 2 sub-panels (Media Library + Inspector) matching Image 5 & 6 */}
        <div className="lg:col-span-7 xl:col-span-7 grid grid-cols-1 md:grid-cols-2 border-r border-[#222838] min-h-0 overflow-hidden">
          {/* Sub-panel 1: Media Library */}
          <div className="h-full min-h-0 overflow-hidden border-r border-[#1f2537]">
            <MediaLibraryPanel 
              onAddToTimeline={(item) => {
                const newClip: TimelineClip = {
                  id: `clip-${Date.now()}`,
                  trackId: item.type === 'overlay' ? 'overlay' : item.type === 'audio' ? 'audio2' : 'video',
                  name: item.name,
                  thumbnailUrl: item.thumbnailUrl,
                  startOffset: currentTime,
                  duration: 20,
                  sourceStart: 0,
                  sourceDuration: 20,
                  type: item.type as any,
                  color: item.type === 'overlay' ? '#8b5cf6' : item.type === 'audio' ? '#06b6d4' : '#3b82f6',
                  isProxy: item.isProxy,
                  isCached: item.isCached
                };
                setClips(prev => [...prev, newClip]);
              }}
            />
          </div>

          {/* Sub-panel 2: Contextual Inspector */}
          <div className="h-full min-h-0 overflow-hidden">
            <ContextualInspector
              inspectorState={inspectorState}
              onChange={handleInspectorChange}
              onReset={handleResetInspector}
            />
          </div>
        </div>

        {/* Right Side: Video Monitor (9:16 Canvas with Safe Zones) */}
        <div className="lg:col-span-5 xl:col-span-5 h-full min-h-0 overflow-hidden">
          <VideoMonitor
            isPlaying={isPlaying}
            currentTime={currentTime}
            duration={duration}
            onTogglePlay={() => setIsPlaying(!isPlaying)}
            onSeek={(t) => setCurrentTime(t)}
            safeZone={safeZone}
            onSafeZoneChange={onSafeZoneChange}
            captionConfig={captionConfig}
            aspectRatio={project.aspectRatio}
            inspectorState={inspectorState}
          />
        </div>
      </div>

      {/* Lower Area: Multi-Track Timeline with Cache Indicators */}
      <div className="h-64 flex-shrink-0">
        <TimelinePanel
          clips={clips}
          currentTime={currentTime}
          duration={duration}
          onSeek={(t) => setCurrentTime(t)}
          onOpenContextMenu={handleOpenContextMenu}
          onCutSilence={handleCutSilence}
          onSplitClip={handleSplitClip}
        />
      </div>

      {/* Context Menu Dropdown */}
      {contextMenuState.visible && (
        <ContextMenu
          x={contextMenuState.x}
          y={contextMenuState.y}
          onClose={() => setContextMenuState(prev => ({ ...prev, visible: false }))}
          onAction={handleContextMenuAction}
        />
      )}
    </div>
  );
};
