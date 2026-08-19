import React, { useState } from 'react';
import { 
  Eye, 
  ArrowRight, 
  Sparkles, 
  Layers, 
  Film, 
  Download, 
  SlidersHorizontal, 
  Music, 
  BarChart3, 
  Home, 
  ExternalLink,
  CheckCircle2,
  Tv
} from 'lucide-react';
import { ScreenMode } from '../../types';
import { REFERENCE_SCREENS } from '../../data/mockData';

interface ScreensReferenceGalleryProps {
  onNavigate: (screen: ScreenMode) => void;
  onOpenExportModal: () => void;
}

export const ScreensReferenceGallery: React.FC<ScreensReferenceGalleryProps> = ({
  onNavigate,
  onOpenExportModal,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');

  const categories = ['Todas', 'NLE Workspace', 'Legendas & Transcrição', 'Templates & Social', 'Análise de Vídeo', 'Exportação & Render', 'Áudio & SFX', 'Início & Boas-Vindas'];

  const filteredScreens = REFERENCE_SCREENS.filter(s => {
    if (selectedCategory === 'Todas') return true;
    return s.category === selectedCategory;
  });

  const handleOpenScreen = (screen: typeof REFERENCE_SCREENS[0]) => {
    if (screen.id === 2 || screen.id === 10) {
      onOpenExportModal();
    } else {
      onNavigate(screen.screenMode as ScreenMode);
    }
  };

  return (
    <div className="min-h-[calc(100vh-85px)] bg-[#0d1017] text-slate-100 p-4 lg:p-8 space-y-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Title Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-500/40 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                <Tv className="w-3 h-3" />
                Guia Visual Completo (15 Telas)
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1 font-['Montserrat',sans-serif]">
              Catálogo de Telas & Módulos Viralume Studio
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Navegue diretamente para qualquer uma das 15 interfaces implementadas com fidelidade total aos mockups.
            </p>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/25'
                  : 'bg-[#141824] text-slate-400 border border-[#222838] hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 15 Screens Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredScreens.map(screen => (
            <div
              key={screen.id}
              onClick={() => handleOpenScreen(screen)}
              className="group bg-[#131724] border border-[#222838] hover:border-purple-500/60 rounded-2xl p-5 shadow-xl transition-all hover:bg-[#181d2d] cursor-pointer flex flex-col justify-between space-y-4 select-none"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-500/30">
                    {screen.category}
                  </span>
                  <span className="text-xs font-mono text-slate-500 font-bold">
                    Tela #{screen.id.toString().padStart(2, '0')}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-100 group-hover:text-purple-300 transition-colors">
                  {screen.title}
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {screen.description}
                </p>
              </div>

              <div className="space-y-3 pt-2 border-t border-[#1f2537]">
                <div className="flex flex-wrap gap-1.5">
                  {screen.tags.map(tag => (
                    <span
                      key={tag}
                      className="text-[10px] px-2 py-0.5 rounded bg-[#1c2233] text-slate-300 font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <button className="w-full py-2.5 rounded-xl bg-purple-600/20 group-hover:bg-purple-600 text-purple-300 group-hover:text-white border border-purple-500/40 font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-md">
                  <span>Abrir Tela #{screen.id}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
