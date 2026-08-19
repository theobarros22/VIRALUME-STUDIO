import React, { useRef, useState } from 'react';
import { 
  PlusCircle, 
  FolderOpen, 
  Clock, 
  Sparkles, 
  HardDrive, 
  Cpu, 
  CheckCircle2, 
  Keyboard, 
  ArrowRight,
  Video,
  Layers,
  Wand2,
  Smartphone,
  Upload,
  FileVideo,
  Zap
} from 'lucide-react';
import { ProjectData, ScreenMode } from '../types';

interface HomeLauncherProps {
  projects: ProjectData[];
  onOpenProject: (proj: ProjectData) => void;
  onNewProject: (file?: File) => void;
  onNavigate: (screen: ScreenMode) => void;
}

export const HomeLauncher: React.FC<HomeLauncherProps> = ({
  projects,
  onOpenProject,
  onNewProject,
  onNavigate,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col justify-between bg-[#0f1118] text-slate-100 p-6 md:p-10 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main 3-Column Layout exactly as Image 13 */}
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 my-auto z-10 items-center">
        
        {/* Left Column: Projetos Recentes */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-400" />
            <h2 className="text-base font-semibold text-slate-200 tracking-tight">
              Projetos Recentes
            </h2>
          </div>

          <div className="space-y-3">
            {projects.slice(0, 5).map((proj) => (
              <div
                key={proj.id}
                onClick={() => onOpenProject(proj)}
                className="group flex items-center gap-3 p-2.5 rounded-xl bg-[#171b26]/90 border border-[#262c3e] hover:border-indigo-500/50 hover:bg-[#1f2537] transition-all cursor-pointer shadow-md hover:shadow-indigo-500/10"
              >
                <div className="relative w-16 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-slate-800 border border-slate-700/50">
                  <img
                    src={proj.thumbnail}
                    alt={proj.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-0 right-0 px-1 py-0.2 bg-black/80 text-[9px] font-mono text-slate-300 rounded-tl">
                    {proj.duration.slice(3)}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-xs font-semibold text-slate-200 group-hover:text-indigo-300 truncate">
                    {proj.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                    ({proj.lastEdited})
                  </p>
                  <span className="inline-block text-[10px] text-slate-400 bg-[#121520] px-1.5 py-0.5 rounded mt-1 border border-[#202636]">
                    {proj.resolution.split(' ')[0]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Center Column: Big Logo, Slogan & Hero Action Buttons */}
        <div className="lg:col-span-6 flex flex-col items-center text-center px-4 py-8">
          
          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*,audio/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                onNewProject(file);
              }
            }}
          />

          {/* Logo Illustration resembling Image 13 */}
          <div className="mb-4 relative">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-400 p-[2px] shadow-2xl shadow-indigo-600/30">
              <div className="w-full h-full bg-[#11141f] rounded-[22px] flex items-center justify-center">
                <svg className="w-10 h-10 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" fillOpacity="0.15" />
                  <path d="M12 7v10" stroke="#38bdf8" />
                  <path d="M16 10v4" stroke="#818cf8" />
                </svg>
              </div>
            </div>
            {/* Sparkle badge */}
            <div className="absolute -top-1.5 -right-1.5 p-1 rounded-full bg-indigo-500 text-white shadow-lg shadow-indigo-500/50 animate-bounce">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['Montserrat',sans-serif]">
            Viralume <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400">Studio</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 max-w-md mt-1.5 mb-6 leading-relaxed">
            Comece importando o seu vídeo para transcrever áudio em texto e gerar legendas dinâmicas em alta velocidade.
          </p>

          {/* Drag & Drop Hero Box */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              const file = e.dataTransfer.files?.[0];
              if (file) {
                onNewProject(file);
              }
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`w-full max-w-md p-6 rounded-2xl border-2 border-dashed cursor-pointer transition-all mb-4 ${
              isDragging
                ? 'border-indigo-400 bg-indigo-950/40 ring-4 ring-indigo-500/30 scale-105'
                : 'border-[#2e374e] bg-[#141826]/80 hover:border-indigo-500/50 hover:bg-[#191f32]'
            }`}
          >
            <div className="flex flex-col items-center justify-center text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                <Upload className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white font-['Montserrat',sans-serif]">
                  Arraste e solte seu vídeo aqui
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Suporta MP4, MOV, WEBM, AVI (Até 4K)
                </p>
              </div>
              <div className="pt-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold shadow-md shadow-indigo-600/20">
                  <FileVideo className="w-3.5 h-3.5" />
                  <span>Selecionar Arquivo de Vídeo</span>
                </span>
              </div>
            </div>
          </div>

          {/* Secondary Action Buttons */}
          <div className="w-full max-w-md space-y-2.5">
            <button
              onClick={() => onNewProject()}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl bg-[#1b2131] hover:bg-[#242b3f] text-slate-200 font-semibold text-xs border border-[#2d364f] transition-all hover:scale-[1.01]"
            >
              <PlusCircle className="w-4 h-4 text-indigo-400" />
              <span>Abrir Editor com Projeto 100% Limpo (Vazio)</span>
            </button>

            {/* Default Aspect Ratio Notice & Social Presets */}
            <div className="px-3.5 py-2 rounded-xl bg-[#141824] border border-[#242c3e] flex items-center justify-between text-[11px] text-slate-300">
              <span className="flex items-center gap-1.5 font-medium">
                <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                <span>Formato Padrão: <strong>9:16</strong></span>
              </span>
              <span className="text-[10px] text-slate-400 bg-[#1c2233] px-2 py-0.5 rounded border border-[#2b354d]">
                Reels • TikTok • Shorts
              </span>
            </div>

            <button
              onClick={() => onNavigate('editor')}
              className="w-full flex items-center justify-center gap-2.5 py-3 px-6 rounded-xl bg-[#262c3e] hover:bg-[#31394f] text-slate-200 font-semibold text-xs border border-[#374059] transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <FolderOpen className="w-4 h-4 text-indigo-400" />
              <span>Abrir Projeto Existente</span>
            </button>
          </div>

          {/* Quick Module Shortcuts */}
          <div className="mt-8 flex flex-wrap justify-center gap-2 text-xs">
            <button 
              onClick={() => onNavigate('social_presets')}
              className="px-3 py-1.5 rounded-lg bg-[#181d2c] hover:bg-[#22293e] text-slate-300 border border-[#2b3349] flex items-center gap-1.5 transition-colors"
            >
              <Wand2 className="w-3.5 h-3.5 text-indigo-400" />
              Presets Reels & TikTok
            </button>
            <button 
              onClick={() => onNavigate('subtitles_gallery')}
              className="px-3 py-1.5 rounded-lg bg-[#181d2c] hover:bg-[#22293e] text-slate-300 border border-[#2b3349] flex items-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Estilos de Legenda Pop
            </button>
            <button 
              onClick={() => onNavigate('ai_analytics')}
              className="px-3 py-1.5 rounded-lg bg-[#181d2c] hover:bg-[#22293e] text-slate-300 border border-[#2b3349] flex items-center gap-1.5 transition-colors"
            >
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              Mapa de Retenção IA
            </button>
          </div>
        </div>

        {/* Right Column: Novidades e Dicas */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h2 className="text-base font-semibold text-slate-200 tracking-tight">
              Novidades e Dicas
            </h2>
          </div>

          <div className="space-y-3">
            {/* Card 1: Novo Modelo de Transcrição Local */}
            <div 
              onClick={() => onNavigate('transcription_text')}
              className="p-3.5 rounded-xl bg-[#171b26]/90 border border-[#262c3e] hover:border-cyan-500/40 hover:bg-[#1c2233] transition-all cursor-pointer group"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center flex-shrink-0 border border-cyan-500/20">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300">
                    Novo Modelo de Transcrição Local
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1 leading-normal">
                    Acelere sua legendagem com IA offline instantânea e corte de pausas em um clique.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2: Atalhos de Teclado Essenciais */}
            <div 
              onClick={() => onNavigate('editor')}
              className="p-3.5 rounded-xl bg-[#171b26]/90 border border-[#262c3e] hover:border-indigo-500/40 hover:bg-[#1c2233] transition-all cursor-pointer group"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center flex-shrink-0 border border-indigo-500/20">
                  <Keyboard className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-slate-200 group-hover:text-indigo-300">
                    Atalhos de Teclado Essenciais
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1 leading-normal">
                    Domine a timeline com <code className="text-indigo-300 bg-indigo-950/60 px-1 py-0.5 rounded">Ctrl+B</code> (Dividir), <code className="text-indigo-300 bg-indigo-950/60 px-1 py-0.5 rounded">B</code> (Lâmina) e <code className="text-indigo-300 bg-indigo-950/60 px-1 py-0.5 rounded">Space</code> (Play).
                  </p>
                </div>
              </div>
            </div>

            {/* Card 3: Safe Zones para Redes */}
            <div 
              onClick={() => onNavigate('social_presets')}
              className="p-3.5 rounded-xl bg-[#171b26]/90 border border-[#262c3e] hover:border-purple-500/40 hover:bg-[#1c2233] transition-all cursor-pointer group"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center flex-shrink-0 border border-purple-500/20">
                  <Video className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-slate-200 group-hover:text-purple-300">
                    Zonas Seguras para Reels & TikTok
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1 leading-normal">
                    Evite que títulos fiquem cobertos pelos botões de like e descrição nas redes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Status Bar exactly as Image 13 */}
      <footer className="w-full border-t border-[#1e2333] pt-4 mt-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="font-medium text-slate-400">Status do Sistema:</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> FFMPEG v5.1.2 (OK)
              </span>
            </span>
            <span className="text-slate-600">|</span>
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />
              <span>GPU:</span>
              <span className="text-indigo-300 font-medium">NVIDIA GeForce RTX 3080 (Ativa)</span>
            </span>
            <span className="text-slate-600">|</span>
            <span className="flex items-center gap-1.5">
              <HardDrive className="w-3.5 h-3.5 text-cyan-400" />
              <span>Espaço em Disco:</span>
              <span className="text-slate-200 font-medium">1.2TB Livres</span>
            </span>
          </div>

          <div className="text-[11px] text-slate-500">
            Viralume Studio Pro v2.4 • Prontidão de Render 60 FPS
          </div>
        </div>
      </footer>
    </div>
  );
};
