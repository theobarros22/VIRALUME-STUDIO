import React, { useState } from 'react';
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
import { 
  ScreenMode, 
  ProjectData, 
  PlatformSafeZone, 
  CaptionStyleConfig 
} from './types';
import { 
  RECENT_PROJECTS, 
  DEFAULT_CAPTION_CONFIG 
} from './data/mockData';

export function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenMode>('home');
  const [activeProject, setActiveProject] = useState<ProjectData>(RECENT_PROJECTS[0]);
  const [safeZone, setSafeZone] = useState<PlatformSafeZone>('instagram_reels');
  const [captionConfig, setCaptionConfig] = useState<CaptionStyleConfig>(DEFAULT_CAPTION_CONFIG);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [projectsList, setProjectsList] = useState<ProjectData[]>(RECENT_PROJECTS);

  // Handle opening a project
  const handleOpenProject = (project: ProjectData) => {
    setActiveProject(project);
    setCurrentScreen('editor');
  };

  // Handle creating a new project
  const handleNewProject = () => {
    const newProj: ProjectData = {
      id: `proj-${Date.now()}`,
      name: `Novo Projeto #${projectsList.length + 1}`,
      aspectRatio: '9:16',
      duration: '01:00',
      durationSec: 60,
      timecode: '00:00:00:00',
      lastEdited: 'Agora',
      thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
      status: 'Pronto para Edição',
      fps: 60,
      resolution: '1080x1920 (Vertical)',
      estimatedSize: '450 MB'
    };
    setProjectsList(prev => [newProj, ...prev]);
    setActiveProject(newProj);
    setCurrentScreen('editor');
  };

  const handleUpdateCaptionConfig = (newConfig: Partial<CaptionStyleConfig>) => {
    setCaptionConfig(prev => ({ ...prev, ...newConfig }));
  };

  return (
    <div className="min-h-screen bg-[#0b0d14] text-slate-100 font-['Plus_Jakarta_Sans',sans-serif] flex flex-col antialiased selection:bg-indigo-500 selection:text-white">
      
      {/* Top Application Navbar */}
      <Navbar
        currentScreen={currentScreen}
        onNavigate={setCurrentScreen}
        project={activeProject}
        onOpenExport={() => setIsExportOpen(true)}
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
            onOpenExport={() => setIsExportOpen(true)}
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
            captionConfig={captionConfig}
            onChangeConfig={handleUpdateCaptionConfig}
            onApplyPreset={() => setCurrentScreen('editor')}
            onNavigateToTextCut={() => setCurrentScreen('transcription_text')}
          />
        )}

        {currentScreen === 'transcription_text' && (
          <TextCutEditor
            onApplyCutsToTimeline={(removedSecs) => {
              // Silence cuts applied
            }}
            onNavigateToEditor={() => setCurrentScreen('editor')}
          />
        )}

        {currentScreen === 'ai_analytics' && (
          <RetentionAnalyticsPanel
            onApplySuggestion={(id) => {
              // AI suggestions applied
            }}
          />
        )}

        {currentScreen === 'sfx_library' && (
          <SFXLibraryPanel
            onAddToTimeline={(sound) => {
              // Added sound to timeline
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

      {/* Export & Render Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />
    </div>
  );
}

export default App;
