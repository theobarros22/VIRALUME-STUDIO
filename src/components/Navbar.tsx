import React, { useState } from 'react';
import { 
  Film, 
  Sparkles, 
  Layers, 
  BarChart3, 
  Music, 
  Download, 
  Home, 
  Settings, 
  SlidersHorizontal,
  FileVideo,
  Eye,
  CheckCircle2,
  Tv2,
  Mic,
  Keyboard,
  Flame,
  Undo2,
  Redo2,
  Image as ImageIcon,
  Volume2,
  Crop,
  Instagram,
  Scissors
} from 'lucide-react';
import { ScreenMode, ProjectData } from '../types';

interface NavbarProps {
  currentScreen: ScreenMode;
  onNavigate: (screen: ScreenMode) => void;
  project: ProjectData;
  onOpenExport: () => void;
  onOpenVoiceover?: () => void;
  onOpenShortcuts?: () => void;
  onOpenHooks?: () => void;
  onOpenOverlays?: () => void;
  onOpenThumbnailStudio?: () => void;
  onOpenAudioMixer?: () => void;
  onOpenAutoFraming?: () => void;
  onOpenMagicMask?: () => void;
  onOpenInstagramCopy?: () => void;
  onOpenRepurposeAI?: () => void;
  onOpenTranscriptionWizard?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentScreen,
  onNavigate,
  project,
  onOpenExport,
  onOpenVoiceover,
  onOpenShortcuts,
  onOpenHooks,
  onOpenOverlays,
  onOpenThumbnailStudio,
  onOpenAudioMixer,
  onOpenAutoFraming,
  onOpenMagicMask,
  onOpenInstagramCopy,
  onOpenRepurposeAI,
  onOpenTranscriptionWizard,
  onUndo,
  onRedo,
  canUndo = true,
  canRedo = false,
}) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const navTabs: { id: ScreenMode; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'home', label: 'Início', icon: Home },
    { id: 'editor', label: 'Editor NLE', icon: Film },
    { id: 'social_presets', label: 'Presets & Guias', icon: SlidersHorizontal },
    { id: 'subtitles_gallery', label: 'Legendas & Estilos', icon: Sparkles },
    { id: 'transcription_text', label: 'Corte por Texto', icon: Layers },
    { id: 'ai_analytics', label: 'Análise IA & Retenção', icon: BarChart3 },
    { id: 'sfx_library', label: 'Biblioteca SFX', icon: Music },
    { id: 'screens_reference', label: 'Galeria de Telas (15)', icon: Eye },
  ];

  return (
    <header className="w-full bg-[#131722] border-b border-[#232838] text-slate-200 text-sm select-none z-30 sticky top-0">
      {/* Top Application Bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#1c2130]">
        <div className="flex items-center gap-4">
          {/* Brand Logo */}
          <button 
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 group focus:outline-none"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 via-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M4 12v-6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6" />
                <path d="m9 16 3-3 3 3" />
                <path d="M12 4v9" />
              </svg>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-bold tracking-tight text-white font-['Montserrat',sans-serif]">
                Viralume
              </span>
              <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                Studio
              </span>
            </div>
          </button>

          {/* Desktop File Menu */}
          <div className="hidden lg:flex items-center gap-1 text-xs text-slate-300">
            {['Arquivo', 'Editar', 'Exibir', 'Janela', 'Ajuda'].map((menu) => (
              <div key={menu} className="relative">
                <button
                  onClick={() => setActiveMenu(activeMenu === menu ? null : menu)}
                  className={`px-2.5 py-1 rounded hover:bg-[#1f2537] hover:text-white transition-colors ${
                    activeMenu === menu ? 'bg-[#1f2537] text-white' : ''
                  }`}
                >
                  {menu}
                </button>
                {activeMenu === menu && (
                  <div 
                    className="absolute top-full left-0 mt-1 w-48 bg-[#181d2c] border border-[#2c344d] rounded-lg shadow-xl py-1.5 z-50 text-xs"
                    onMouseLeave={() => setActiveMenu(null)}
                  >
                    <div className="px-3 py-1 text-slate-400 font-medium border-b border-[#232a3f] mb-1">
                      {menu} - Viralume Pro
                    </div>
                    {menu === 'Arquivo' && (
                      <>
                        <button onClick={() => { onNavigate('home'); setActiveMenu(null); }} className="w-full text-left px-3 py-1.5 hover:bg-indigo-600/30 hover:text-indigo-200">Novo Projeto (Ctrl+N)</button>
                        <button onClick={() => { onNavigate('home'); setActiveMenu(null); }} className="w-full text-left px-3 py-1.5 hover:bg-indigo-600/30 hover:text-indigo-200">Abrir Projeto... (Ctrl+O)</button>
                        <button onClick={() => { onOpenExport(); setActiveMenu(null); }} className="w-full text-left px-3 py-1.5 hover:bg-indigo-600/30 hover:text-indigo-200">Exportar Vídeo (Ctrl+E)</button>
                      </>
                    )}
                    {menu === 'Editar' && (
                      <>
                        <button onClick={() => { if (onUndo) onUndo(); setActiveMenu(null); }} className="w-full text-left px-3 py-1.5 hover:bg-indigo-600/30">Desfazer (Ctrl+Z)</button>
                        <button onClick={() => { if (onRedo) onRedo(); setActiveMenu(null); }} className="w-full text-left px-3 py-1.5 hover:bg-indigo-600/30">Refazer (Ctrl+Shift+Z)</button>
                        <button onClick={() => { onNavigate('transcription_text'); setActiveMenu(null); }} className="w-full text-left px-3 py-1.5 hover:bg-indigo-600/30">Cortar Silêncios com IA</button>
                      </>
                    )}
                    {menu !== 'Arquivo' && menu !== 'Editar' && (
                      <div className="px-3 py-2 text-slate-400">Atalhos rápidos ativos</div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Quick Undo / Redo Buttons */}
          <div className="hidden sm:flex items-center gap-1 border-l border-slate-700/60 pl-2">
            <button
              onClick={onUndo}
              disabled={!canUndo}
              title="Desfazer (Ctrl+Z)"
              className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-[#1f2537] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onRedo}
              disabled={!canRedo}
              title="Refazer (Ctrl+Shift+Z)"
              className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-[#1f2537] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <Redo2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Project Name and Format Pill */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#1a1f2e] border border-[#2c3349] text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-400">Projeto:</span>
            <span className="font-semibold text-slate-100">{project.name}</span>
            <span className="text-slate-500">•</span>
            <span className="text-indigo-400 font-medium">{project.resolution}</span>
            <span className="text-slate-500">•</span>
            <span className="text-amber-400 font-medium">{project.fps} fps</span>
          </div>

          {/* Quick Hardware Status */}
          <div className="hidden xl:flex items-center gap-2 text-[11px] text-slate-400 bg-[#161a27] px-2.5 py-1 rounded border border-[#23283a]">
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" /> RTX 3080
            </span>
            <span className="text-slate-600">|</span>
            <span>CRF: 22</span>
            <span className="text-slate-600">|</span>
            <span className="text-cyan-400 font-medium">Whisper OK</span>
          </div>
        </div>

        {/* Right Actions & Export Button */}
        <div className="flex items-center gap-1.5">
          {onOpenTranscriptionWizard && (
            <button
              onClick={onOpenTranscriptionWizard}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all hover:scale-105"
              title="Transcrever Áudio do Vídeo e Gerar Legendas Automáticas por IA"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>Transcrever & Legendas</span>
            </button>
          )}

          {onOpenRepurposeAI && (
            <button
              onClick={onOpenRepurposeAI}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-indigo-950/90 to-purple-950/90 text-indigo-300 border border-indigo-500/40 hover:border-indigo-400 text-xs font-semibold shadow-sm transition-all hover:scale-105"
              title="Transformar Vídeo Longo em Múltiplos Cortes Verticais (9:16)"
            >
              <Scissors className="w-3.5 h-3.5 text-indigo-400" />
              <span>Cortes IA (Repurpose)</span>
            </button>
          )}

          {onOpenInstagramCopy && (
            <button
              onClick={onOpenInstagramCopy}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-rose-950/80 to-purple-950/80 text-rose-300 border border-rose-500/40 hover:border-rose-400 text-xs font-semibold shadow-sm transition-all hover:scale-105"
              title="Gerador de Legenda e Copy Otimizada para Instagram Reels"
            >
              <Instagram className="w-3.5 h-3.5 text-rose-400" />
              <span>Copy Instagram</span>
            </button>
          )}

          {onOpenThumbnailStudio && (
            <button
              onClick={onOpenThumbnailStudio}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#1f1d2c] text-amber-300 border border-amber-500/40 hover:bg-[#2c2840] text-xs font-semibold shadow-sm transition-colors"
              title="Criar Capa 9:16 para Reels e TikTok"
            >
              <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
              <span>Capas 9:16</span>
            </button>
          )}

          {onOpenAudioMixer && (
            <button
              onClick={onOpenAudioMixer}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#12242b] text-cyan-300 border border-cyan-500/40 hover:bg-[#18323d] text-xs font-semibold shadow-sm transition-colors"
              title="Mixer de Áudio e Auto-Ducking (-14 LUFS)"
            >
              <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Ducking & Áudio</span>
            </button>
          )}

          {onOpenAutoFraming && (
            <button
              onClick={onOpenAutoFraming}
              className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#1a1b2d] text-indigo-300 border border-indigo-500/40 hover:bg-[#252740] text-xs font-semibold shadow-sm transition-colors"
              title="Auto-Framing e Rastreamento Facial IA"
            >
              <Crop className="w-3.5 h-3.5 text-indigo-400" />
              <span>Auto-Framing IA</span>
            </button>
          )}

          {onOpenMagicMask && (
            <button
              onClick={onOpenMagicMask}
              className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#27182e] text-purple-300 border border-purple-500/40 hover:bg-[#382242] text-xs font-semibold shadow-sm transition-colors"
              title="Máscara Mágica e Texto Atrás do Sujeito"
            >
              <Layers className="w-3.5 h-3.5 text-purple-400" />
              <span>Texto Atrás</span>
            </button>
          )}

          {onOpenHooks && (
            <button
              onClick={onOpenHooks}
              className="hidden md:flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-[#281c10] text-amber-300 border border-amber-500/40 hover:bg-[#382614] text-xs font-semibold shadow-sm transition-colors"
            >
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Ganchos</span>
            </button>
          )}

          {onOpenShortcuts && (
            <button
              onClick={onOpenShortcuts}
              title="Atalhos de Teclado"
              className="p-1.5 rounded-lg bg-[#181d2c] text-slate-400 hover:text-slate-200 border border-[#2b334a] hover:bg-[#20273a] transition-colors"
            >
              <Keyboard className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={onOpenExport}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar Vídeo</span>
          </button>
        </div>
      </div>

      {/* Screen Navigation Tabs */}
      <div className="flex items-center gap-1 px-3 py-1.5 overflow-x-auto no-scrollbar bg-[#0f121a]">
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentScreen === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-[#22293d] text-indigo-300 border border-indigo-500/40 shadow-sm shadow-indigo-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#181d2a]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
              {tab.id === 'ai_analytics' && (
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </header>
  );
};
