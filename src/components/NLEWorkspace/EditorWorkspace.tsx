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
  CaptionStyleConfig,
  VideoAspectRatio
} from '../../types';
import { INITIAL_CLIPS } from '../../data/mockData';

interface EditorWorkspaceProps {
  project: ProjectData;
  captionConfig: CaptionStyleConfig;
  safeZone: PlatformSafeZone;
  onSafeZoneChange: (zone: PlatformSafeZone) => void;
  onAspectRatioChange?: (ratio: VideoAspectRatio) => void;
  onOpenExport: () => void;
  onCutSilenceSuccess?: () => void;
  onUploadVideo?: (file: File) => void;
  onOpenTranscriptionWizard?: () => void;
}

export const EditorWorkspace: React.FC<EditorWorkspaceProps> = ({
  project,
  captionConfig,
  safeZone,
  onSafeZoneChange,
  onAspectRatioChange,
  onOpenExport,
  onCutSilenceSuccess,
  onUploadVideo,
  onOpenTranscriptionWizard,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(project.isEmptyProject ? 0 : 15.2);
  const [duration, setDuration] = useState(project.durationSec || 60);
  const [clips, setClips] = useState<TimelineClip[]>(() => {
    if (project.isEmptyProject && !project.videoFileUrl) {
      return [];
    }
    if (project.videoFileUrl) {
      return [
        {
          id: `clip-video-${project.id}`,
          trackId: 'video',
          name: project.videoFileName || project.name,
          startOffset: 0,
          duration: project.durationSec || 30,
          sourceStart: 0,
          sourceDuration: project.durationSec || 30,
          type: 'video',
          color: '#3b82f6',
          isProxy: true,
          isCached: true,
        },
        {
          id: `clip-cap-${project.id}`,
          trackId: 'captions',
          name: 'Legendas Automáticas por IA',
          startOffset: 0,
          duration: project.durationSec || 30,
          sourceStart: 0,
          sourceDuration: project.durationSec || 30,
          type: 'caption',
          color: '#f59e0b',
        }
      ];
    }
    return INITIAL_CLIPS;
  });

  // Sync clips when project changes
  useEffect(() => {
    if (project.isEmptyProject && !project.videoFileUrl) {
      setClips([]);
      setCurrentTime(0);
      setDuration(60);
    } else if (project.videoFileUrl) {
      setClips([
        {
          id: `clip-video-${project.id}`,
          trackId: 'video',
          name: project.videoFileName || project.name,
          startOffset: 0,
          duration: project.durationSec || 30,
          sourceStart: 0,
          sourceDuration: project.durationSec || 30,
          type: 'video',
          color: '#3b82f6',
          isProxy: true,
          isCached: true,
        },
        {
          id: `clip-cap-${project.id}`,
          trackId: 'captions',
          name: 'Legendas Automáticas por IA',
          startOffset: 0,
          duration: project.durationSec || 30,
          sourceStart: 0,
          sourceDuration: project.durationSec || 30,
          type: 'caption',
          color: '#f59e0b',
        }
      ]);
      setDuration(project.durationSec || 30);
    }
  }, [project.id, project.isEmptyProject, project.videoFileUrl, project.durationSec, project.videoFileName, project.name]);
  
  const [selectedClipId, setSelectedClipId] = useState<string | null>(() => {
    return clips[0]?.id || null;
  });

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

  // Split clip at timecode
  const handleSplitClip = (clipId?: string, splitTime?: number) => {
    const timeToSplit = splitTime !== undefined ? splitTime : currentTime;
    
    // Find target clip: either specified by ID, or intersecting playhead on video track, or selected
    let target = clips.find(c => c.id === clipId);
    if (!target) {
      target = clips.find(c => c.id === selectedClipId && timeToSplit >= c.startOffset && timeToSplit <= c.startOffset + c.duration);
    }
    if (!target) {
      target = clips.find(c => c.trackId === 'video' && timeToSplit >= c.startOffset && timeToSplit <= c.startOffset + c.duration);
    }
    if (!target) {
      target = clips[0];
    }
    if (!target) return;
    
    const splitPoint = timeToSplit - target.startOffset;
    
    if (splitPoint > 0.2 && splitPoint < target.duration - 0.2) {
      const originalDuration = target.duration;
      const originalSourceStart = target.sourceStart || 0;
      
      const leftClip: TimelineClip = {
        ...target,
        duration: splitPoint,
        sourceDuration: splitPoint
      };
      
      const rightClipId = `clip-split-${Date.now()}`;
      const rightClip: TimelineClip = {
        ...target,
        id: rightClipId,
        name: `${target.name} (Parte 2)`,
        startOffset: target.startOffset + splitPoint,
        duration: originalDuration - splitPoint,
        sourceStart: originalSourceStart + splitPoint,
        sourceDuration: originalDuration - splitPoint
      };

      // Also split corresponding caption clip if it spans across this point
      const captionClip = clips.find(c => c.trackId === 'captions' && timeToSplit >= c.startOffset && timeToSplit <= c.startOffset + c.duration);
      let updatedCaptions: TimelineClip[] = [];
      if (captionClip) {
        const capSplitPoint = timeToSplit - captionClip.startOffset;
        if (capSplitPoint > 0.2 && capSplitPoint < captionClip.duration - 0.2) {
          const capLeft: TimelineClip = {
            ...captionClip,
            duration: capSplitPoint,
            sourceDuration: capSplitPoint
          };
          const capRight: TimelineClip = {
            ...captionClip,
            id: `clip-cap-split-${Date.now()}`,
            name: `${captionClip.name} (2)`,
            startOffset: captionClip.startOffset + capSplitPoint,
            duration: captionClip.duration - capSplitPoint,
            sourceStart: (captionClip.sourceStart || 0) + capSplitPoint,
            sourceDuration: captionClip.duration - capSplitPoint
          };
          updatedCaptions = [capLeft, capRight];
        }
      }

      setClips(prev => {
        let filtered = prev.filter(c => c.id !== target!.id);
        if (captionClip && updatedCaptions.length > 0) {
          filtered = filtered.filter(c => c.id !== captionClip.id);
          return [...filtered, leftClip, rightClip, ...updatedCaptions];
        }
        return [...filtered, leftClip, rightClip];
      });

      setSelectedClipId(rightClipId);
    }
  };

  // Delete clip
  const handleDeleteClip = (clipId: string) => {
    setClips(prev => {
      const target = prev.find(c => c.id === clipId);
      if (!target) return prev;
      return prev.filter(c => c.id !== clipId);
    });
    if (selectedClipId === clipId) {
      setSelectedClipId(null);
    }
  };

  // Duplicate clip
  const handleDuplicateClip = (clipId: string) => {
    const target = clips.find(c => c.id === clipId);
    if (!target) return;
    const newId = `clip-dup-${Date.now()}`;
    const newClip: TimelineClip = {
      ...target,
      id: newId,
      name: `${target.name} (Cópia)`,
      startOffset: target.startOffset + target.duration + 0.5,
    };
    setClips(prev => [...prev, newClip]);
    setSelectedClipId(newId);
  };

  // Trim clip
  const handleTrimClip = (clipId: string, newStartOffset: number, newDuration: number, newSourceStart?: number) => {
    setClips(prev => prev.map(c => {
      if (c.id === clipId) {
        return {
          ...c,
          startOffset: newStartOffset,
          duration: newDuration,
          sourceStart: newSourceStart !== undefined ? newSourceStart : c.sourceStart
        };
      }
      return c;
    }));
  };

  // Cut silence
  const handleCutSilence = () => {
    // Automatically perform realistic silence cuts
    setClips(prev => {
      const videoClips = prev.filter(c => c.trackId === 'video');
      if (videoClips.length === 0) return prev;
      
      // Trim slightly from middle to simulate 1.5s silence removal
      const updated = prev.map(c => {
        if (c.trackId === 'video' || c.trackId === 'captions') {
          return {
            ...c,
            duration: Math.max(2, c.duration - 1.4)
          };
        }
        return c;
      });
      return updated;
    });

    if (onCutSilenceSuccess) onCutSilenceSuccess();
  };

  // Keyboard shortcuts (Space, J, L, B, C, Delete, Escape)
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
      } else if (e.key === 'c' || e.key === 'C' || e.key === 'b' || e.key === 'B') {
        e.preventDefault();
        handleSplitClip(selectedClipId || undefined, currentTime);
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedClipId) {
          e.preventDefault();
          handleDeleteClip(selectedClipId);
        }
      } else if (e.key === 'Escape') {
        setContextMenuState(prev => ({ ...prev, visible: false }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [duration, selectedClipId, currentTime, clips]);

  // Playback timer simulation for projects without native HTML5 video file
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    if (isPlaying && !project.videoFileUrl) {
      const step = (now: number) => {
        const dt = (now - lastTime) / 1000;
        lastTime = now;

        setCurrentTime((prev) => {
          const next = prev + dt;
          if (next >= duration) {
            setIsPlaying(false);
            return 0;
          }
          return next;
        });

        animId = requestAnimationFrame(step);
      };

      animId = requestAnimationFrame(step);
    }

    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [isPlaying, duration, project.videoFileUrl]);

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

  const handleOpenContextMenu = (x: number, y: number, clip?: TimelineClip) => {
    setContextMenuState({
      visible: true,
      x,
      y,
      targetClip: clip
    });
  };

  const handleContextMenuAction = (action: string) => {
    if (action === 'Dividir no Playhead' || action === 'Recortar') {
      handleSplitClip(selectedClipId || undefined, currentTime);
    } else if (action === 'Apagar') {
      if (selectedClipId) handleDeleteClip(selectedClipId);
    } else if (action === 'Duplicar') {
      if (selectedClipId) handleDuplicateClip(selectedClipId);
    } else if (action === 'Cortar Silêncios') {
      handleCutSilence();
    } else {
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
                setSelectedClipId(newClip.id);
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
            onAspectRatioChange={onAspectRatioChange}
            inspectorState={inspectorState}
            videoFileUrl={project.videoFileUrl}
            isEmptyProject={project.isEmptyProject}
            onUploadVideo={onUploadVideo}
            customTranscript={project.transcript}
            onDurationDetected={(detectedDuration) => {
              if (detectedDuration && detectedDuration > 0 && Math.abs(detectedDuration - duration) > 1) {
                setDuration(detectedDuration);
                setClips(prev => prev.map(c => {
                  if (c.trackId === 'video' || c.trackId === 'captions') {
                    return {
                      ...c,
                      duration: detectedDuration,
                      sourceDuration: detectedDuration
                    };
                  }
                  return c;
                }));
              }
            }}
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
          onDeleteClip={handleDeleteClip}
          onDuplicateClip={handleDuplicateClip}
          onTrimClip={handleTrimClip}
          selectedClipId={selectedClipId}
          onSelectClip={setSelectedClipId}
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
