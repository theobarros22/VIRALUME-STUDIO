import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { HomeLauncher } from './components/HomeLauncher';
import { EditorWorkspace } from './components/NLEWorkspace/EditorWorkspace';
import { PresetsPanel } from './components/SocialPresets/PresetsPanel';
import { SubtitleGalleryPanel } from './components/Subtitles/SubtitleGalleryPanel';
import { TextCutEditor } from './components/TextCut/TextCutEditor';
import { RetentionAnalyticsPanel } from './components/Analytics/RetentionAnalyticsPanel';
import { SFXLibraryPanel } from './components/SFX/SFXLibraryPanel';
import { ScreensReferenceGallery } from './components/Reference/ScreensReferenceGallery';
import { ExportModal } from './components/Export/ExportModal';
import { VoiceoverStudioModal } from './components/Voiceover/VoiceoverStudioModal';
import { ShortcutsModal } from './components/Settings/ShortcutsModal';
import { ViralHooksModal } from './components/AI/ViralHooksModal';
import { OverlayLibraryModal } from './components/Overlays/OverlayLibraryModal';
import { ThumbnailStudioModal } from './components/Thumbnails/ThumbnailStudioModal';
import { AudioMixerModal } from './components/Audio/AudioMixerModal';
import { AutoFramingModal } from './components/AI/AutoFramingModal';
import { AIMagicMaskModal } from './components/AI/AIMagicMaskModal';
import { RepurposeAIModal } from './components/AI/RepurposeAIModal';
import { InstagramCopyStudioModal } from './components/Instagram/InstagramCopyStudioModal';
import { VideoTranscriptionWizardModal } from './components/Transcription/VideoTranscriptionWizardModal';
import { 
  ScreenMode, 
  ProjectData, 
  PlatformSafeZone, 
  CaptionStyleConfig,
  TimelineClip,
  VideoAspectRatio,
  HistoryItem,
  TranscriptSegment
} from './types';
import { 
  RECENT_PROJECTS, 
  DEFAULT_CAPTION_CONFIG 
} from './data/mockData';

const DEFAULT_CLEAN_PROJECT: ProjectData = {
  id: 'proj-clean-1',
  name: 'Novo Projeto Limpo',
  aspectRatio: '9:16',
  duration: '00:30',
  durationSec: 30,
  timecode: '00:00:00:00',
  lastEdited: 'Agora',
  thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
  status: 'Aguardando Vídeo',
  fps: 60,
  resolution: '1080x1920 (Vertical)',
  estimatedSize: '0 MB',
  isEmptyProject: true,
};

export function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenMode>('home');
  const [activeProject, setActiveProject] = useState<ProjectData>(DEFAULT_CLEAN_PROJECT);
  const [safeZone, setSafeZone] = useState<PlatformSafeZone>('instagram_reels');
  const [captionConfig, setCaptionConfig] = useState<CaptionStyleConfig>(DEFAULT_CAPTION_CONFIG);
  
  // Modals state
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [isVoiceoverOpen, setIsVoiceoverOpen] = useState<boolean>(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState<boolean>(false);
  const [isHooksOpen, setIsHooksOpen] = useState<boolean>(false);
  const [isOverlaysOpen, setIsOverlaysOpen] = useState<boolean>(false);
  const [isThumbnailStudioOpen, setIsThumbnailStudioOpen] = useState<boolean>(false);
  const [isAudioMixerOpen, setIsAudioMixerOpen] = useState<boolean>(false);
  const [isAutoFramingOpen, setIsAutoFramingOpen] = useState<boolean>(false);
  const [isMagicMaskOpen, setIsMagicMaskOpen] = useState<boolean>(false);
  const [isInstagramCopyOpen, setIsInstagramCopyOpen] = useState<boolean>(false);
  const [isRepurposeAIOpen, setIsRepurposeAIOpen] = useState<boolean>(false);
  const [isTranscriptionWizardOpen, setIsTranscriptionWizardOpen] = useState<boolean>(false);

  const [projectsList, setProjectsList] = useState<ProjectData[]>([
    DEFAULT_CLEAN_PROJECT,
    ...RECENT_PROJECTS
  ]);

  // Undo / Redo History Stack
  const [history, setHistory] = useState<HistoryItem[]>([
    {
      id: 'init-1',
      description: 'Projeto Limpo Aberto',
      timestamp: Date.now(),
      projectSnapshot: { ...DEFAULT_CLEAN_PROJECT },
      captionSnapshot: { ...DEFAULT_CAPTION_CONFIG }
    }
  ]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  // Record a history state
  const pushHistory = useCallback((description: string, newProj?: ProjectData, newCap?: CaptionStyleConfig) => {
    const pSnap = newProj ? { ...newProj } : { ...activeProject };
    const cSnap = newCap ? { ...newCap } : { ...captionConfig };
    
    setHistory(prev => {
      const sliced = prev.slice(0, historyIndex + 1);
      return [
        ...sliced,
        {
          id: `hist-${Date.now()}`,
          description,
          timestamp: Date.now(),
          projectSnapshot: pSnap,
          captionSnapshot: cSnap
        }
      ];
    });
    setHistoryIndex(prev => prev + 1);
  }, [activeProject, captionConfig, historyIndex]);

  // Undo Handler
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const prevItem = history[historyIndex - 1];
      setActiveProject(prevItem.projectSnapshot);
      setCaptionConfig(prevItem.captionSnapshot);
      setHistoryIndex(prev => prev - 1);
    }
  }, [history, historyIndex]);

  // Redo Handler
  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextItem = history[historyIndex + 1];
      setActiveProject(nextItem.projectSnapshot);
      setCaptionConfig(nextItem.captionSnapshot);
      setHistoryIndex(prev => prev + 1);
    }
  }, [history, historyIndex]);

  // Keyboard shortcut listener for Ctrl+Z and Ctrl+Shift+Z / Ctrl+Y
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo]);

  // Handle opening a project
  const handleOpenProject = (project: ProjectData) => {
    setActiveProject(project);
    setCurrentScreen('editor');
    pushHistory(`Abrir ${project.name}`, project);
  };

  // Handle creating a new clean project or importing video
  const handleNewProject = (file?: File) => {
    const videoUrl = file ? URL.createObjectURL(file) : undefined;
    const cleanProj: ProjectData = {
      id: `proj-${Date.now()}`,
      name: file ? file.name.replace(/\.[^/.]+$/, '') : `Novo Projeto Limpo #${projectsList.length + 1}`,
      aspectRatio: '9:16',
      duration: '00:30',
      durationSec: 30,
      timecode: '00:00:00:00',
      lastEdited: 'Agora',
      thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
      status: file ? 'Vídeo Carregado' : 'Aguardando Vídeo',
      fps: 60,
      resolution: '1080x1920 (Vertical)',
      estimatedSize: file ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : '0 MB',
      videoFileUrl: videoUrl,
      videoFileName: file?.name,
      isEmptyProject: !file,
    };
    setProjectsList(prev => [cleanProj, ...prev]);
    setActiveProject(cleanProj);
    setCurrentScreen('editor');
    pushHistory(file ? `Importar Vídeo: ${file.name}` : 'Criar Novo Projeto Limpo', cleanProj);

    if (file) {
      setIsTranscriptionWizardOpen(true);
    }
  };

  // Handle uploading video inside Editor
  const handleUploadVideoInEditor = (file: File) => {
    const videoUrl = URL.createObjectURL(file);
    const updatedProj: ProjectData = {
      ...activeProject,
      name: file.name.replace(/\.[^/.]+$/, ''),
      videoFileUrl: videoUrl,
      videoFileName: file.name,
      isEmptyProject: false,
      status: 'Vídeo Carregado',
      estimatedSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`
    };
    setActiveProject(updatedProj);
    pushHistory(`Carregar Vídeo: ${file.name}`, updatedProj);
    setIsTranscriptionWizardOpen(true);
  };

  // Handle applying transcription and subtitles
  const handleApplyTranscription = (transcript: TranscriptSegment[], newCaptionConfig: Partial<CaptionStyleConfig>) => {
    const updatedProj = {
      ...activeProject,
      transcript,
      status: 'Legendas Geradas'
    };
    const updatedCap = {
      ...captionConfig,
      ...newCaptionConfig
    };
    setActiveProject(updatedProj);
    setCaptionConfig(updatedCap);
    pushHistory('Legendas Automáticas por IA Aplicadas', updatedProj, updatedCap);
  };

  // Handle switching video aspect ratio dynamically (9:16 default, 16:9, 1:1, 4:5)
  const handleAspectRatioChange = (ratio: VideoAspectRatio) => {
    const resolutions: Record<VideoAspectRatio, string> = {
      '9:16': '1080x1920 (Vertical)',
      '16:9': '1920x1080 (Horizontal)',
      '1:1': '1080x1080 (Quadrado)',
      '4:5': '1080x1350 (Retrato)',
      '4:3': '1440x1080 (Clássico)'
    };
    const updatedProj = {
      ...activeProject,
      aspectRatio: ratio,
      resolution: resolutions[ratio] || activeProject.resolution
    };
    setActiveProject(updatedProj);
    pushHistory(`Alterar Formato para ${ratio}`, updatedProj);
  };

  const handleUpdateCaptionConfig = (newConfig: Partial<CaptionStyleConfig>) => {
    const updated = { ...captionConfig, ...newConfig };
    setCaptionConfig(updated);
    pushHistory('Atualizar Estilo de Legenda', activeProject, updated);
  };

  return (
    <div className="min-h-screen bg-[#0b0d14] text-slate-100 font-['Plus_Jakarta_Sans',sans-serif] flex flex-col antialiased selection:bg-indigo-500 selection:text-white">
      
      {/* Top Application Navbar */}
      <Navbar
        currentScreen={currentScreen}
        onNavigate={setCurrentScreen}
        project={activeProject}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenVoiceover={() => setIsVoiceoverOpen(true)}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        onOpenHooks={() => setIsHooksOpen(true)}
        onOpenOverlays={() => setIsOverlaysOpen(true)}
        onOpenThumbnailStudio={() => setIsThumbnailStudioOpen(true)}
        onOpenAudioMixer={() => setIsAudioMixerOpen(true)}
        onOpenAutoFraming={() => setIsAutoFramingOpen(true)}
        onOpenMagicMask={() => setIsMagicMaskOpen(true)}
        onOpenInstagramCopy={() => setIsInstagramCopyOpen(true)}
        onOpenRepurposeAI={() => setIsRepurposeAIOpen(true)}
        onOpenTranscriptionWizard={() => setIsTranscriptionWizardOpen(true)}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
      />

      {/* Main View Area Routing */}
      <main className="flex-1 flex flex-col min-h-0 overflow-auto">
        {currentScreen === 'home' && (
          <HomeLauncher
            projects={projectsList}
            onOpenProject={handleOpenProject}
            onNewProject={handleNewProject}
            onNavigate={setCurrentScreen}
          />
        )}

        {currentScreen === 'editor' && (
          <EditorWorkspace
            project={activeProject}
            captionConfig={captionConfig}
            safeZone={safeZone}
            onSafeZoneChange={setSafeZone}
            onAspectRatioChange={handleAspectRatioChange}
            onOpenExport={() => setIsExportOpen(true)}
            onUploadVideo={handleUploadVideoInEditor}
            onOpenTranscriptionWizard={() => setIsTranscriptionWizardOpen(true)}
          />
        )}

        {currentScreen === 'social_presets' && (
          <PresetsPanel
            captionConfig={captionConfig}
            onChangeConfig={handleUpdateCaptionConfig}
            safeZone={safeZone}
            onSafeZoneChange={setSafeZone}
            onApplyPreset={() => setCurrentScreen('editor')}
          />
        )}

        {currentScreen === 'subtitles_gallery' && (
          <SubtitleGalleryPanel
            project={activeProject}
            captionConfig={captionConfig}
            onChangeConfig={handleUpdateCaptionConfig}
            onApplyPreset={() => setCurrentScreen('editor')}
            onNavigateToTextCut={() => setCurrentScreen('transcription_text')}
          />
        )}

        {currentScreen === 'transcription_text' && (
          <TextCutEditor
            project={activeProject}
            onApplyCutsToTimeline={(removedSecs) => {
              pushHistory(`Cortes de Texto (${removedSecs.toFixed(1)}s removidos)`);
            }}
            onNavigateToEditor={() => setCurrentScreen('editor')}
          />
        )}

        {currentScreen === 'ai_analytics' && (
          <RetentionAnalyticsPanel
            onApplySuggestion={(id) => {
              pushHistory(`Aplicar Sugestão de Retenção IA #${id}`);
            }}
          />
        )}

        {currentScreen === 'sfx_library' && (
          <SFXLibraryPanel
            onAddToTimeline={(sound) => {
              pushHistory(`Adicionar Efeito Sonoro ${sound.name}`);
            }}
          />
        )}

        {currentScreen === 'screens_reference' && (
          <ScreensReferenceGallery
            onNavigate={setCurrentScreen}
            onOpenExportModal={() => setIsExportOpen(true)}
          />
        )}
      </main>

      {/* Estúdio de Capas 9:16 Modal */}
      <ThumbnailStudioModal
        isOpen={isThumbnailStudioOpen}
        onClose={() => setIsThumbnailStudioOpen(false)}
        project={activeProject}
        onSaveAsProjectThumbnail={(thumbUrl) => {
          setActiveProject(prev => ({ ...prev, thumbnail: thumbUrl }));
          pushHistory('Atualizar Capa do Projeto');
        }}
      />

      {/* Mixer de Áudio & Auto-Ducking (-14 LUFS) Modal */}
      <AudioMixerModal
        isOpen={isAudioMixerOpen}
        onClose={() => setIsAudioMixerOpen(false)}
        onApplyDucking={() => {
          pushHistory('Auto-Ducking de Áudio Aplicado');
        }}
      />

      {/* Auto-Framing IA & Rastreamento Facial Modal */}
      <AutoFramingModal
        isOpen={isAutoFramingOpen}
        onClose={() => setIsAutoFramingOpen(false)}
        project={activeProject}
        onApplyAutoFraming={(config) => {
          pushHistory('Auto-Framing 9:16 Aplicado');
        }}
      />

      {/* Máscara Mágica IA & Texto Atrás do Sujeito Modal */}
      <AIMagicMaskModal
        isOpen={isMagicMaskOpen}
        onClose={() => setIsMagicMaskOpen(false)}
        project={activeProject}
        onApplyMagicMask={() => {
          pushHistory('Máscara Mágica & Texto Atrás Aplicado');
        }}
      />

      {/* Gerador de Copy & Legendas IA para Instagram Reels Modal */}
      <InstagramCopyStudioModal
        isOpen={isInstagramCopyOpen}
        onClose={() => setIsInstagramCopyOpen(false)}
        project={activeProject}
      />

      {/* Repurpose IA: Conversor Automático de Vídeos Longos para Reels Modal */}
      <RepurposeAIModal
        isOpen={isRepurposeAIOpen}
        onClose={() => setIsRepurposeAIOpen(false)}
        project={activeProject}
        onSelectClipToEdit={(clipTitle) => {
          pushHistory(`Carregar Corte IA: ${clipTitle}`);
          setCurrentScreen('editor');
        }}
      />

      {/* Export & Render Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />

      {/* AI Voiceover & Dubbing Studio Modal */}
      <VoiceoverStudioModal
        isOpen={isVoiceoverOpen}
        onClose={() => setIsVoiceoverOpen(false)}
        currentTime={15.2}
        onAddVoiceClip={(clip) => {
          pushHistory('Inserir Narração de Voz IA');
          setCurrentScreen('editor');
        }}
      />

      {/* AI Viral Hooks Generator Modal */}
      <ViralHooksModal
        isOpen={isHooksOpen}
        onClose={() => setIsHooksOpen(false)}
        currentTime={0}
        onInsertHookClip={(clip) => {
          pushHistory('Inserir Gancho Viral IA');
          setCurrentScreen('editor');
        }}
      />

      {/* B-Rolls, Memes & Overlays Library Modal */}
      <OverlayLibraryModal
        isOpen={isOverlaysOpen}
        onClose={() => setIsOverlaysOpen(false)}
        currentTime={12.0}
        onAddOverlayClip={(clip) => {
          pushHistory('Inserir Overlay / B-Roll');
          setCurrentScreen('editor');
        }}
      />

      {/* Keyboard Shortcuts Guide Modal */}
      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      {/* Assistente de Transcrição & Legendas IA */}
      <VideoTranscriptionWizardModal
        isOpen={isTranscriptionWizardOpen}
        onClose={() => setIsTranscriptionWizardOpen(false)}
        videoFileName={activeProject.videoFileName || activeProject.name}
        videoDurationSec={activeProject.durationSec || 30}
        onApplyTranscription={handleApplyTranscription}
      />
    </div>
  );
}

export default App;
