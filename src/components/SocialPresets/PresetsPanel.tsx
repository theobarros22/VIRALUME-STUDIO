import React, { useState } from 'react';
import { 
  Zap, 
  Mic, 
  Scroll, 
  Smile, 
  Sparkles, 
  SlidersHorizontal, 
  CheckCircle2, 
  Smartphone,
  Play,
  Pause
} from 'lucide-react';
import { CaptionPresetType, CaptionStyleConfig, PlatformSafeZone } from '../../types';

interface PresetsPanelProps {
  captionConfig: CaptionStyleConfig;
  onChangeConfig: (newConfig: Partial<CaptionStyleConfig>) => void;
  safeZone: PlatformSafeZone;
  onSafeZoneChange: (zone: PlatformSafeZone) => void;
  onApplyPreset: () => void;
}

export const PresetsPanel: React.FC<PresetsPanelProps> = ({
  captionConfig,
  onChangeConfig,
  safeZone,
  onSafeZoneChange,
  onApplyPreset,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [appliedToast, setAppliedToast] = useState(false);

  const presetsList: {
    id: CaptionPresetType;
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    accentColor: string;
  }[] = [
    {
      id: 'viral_energetic',
      title: 'Viral Energetic',
      description: 'Animação rápida e dinâmica para engajamento.',
      icon: Zap,
      accentColor: '#3b82f6'
    },
    {
      id: 'podcast_clean',
      title: 'Podcast Clean',
      description: 'Legendas claras e profissionais.',
      icon: Mic,
      accentColor: '#64748b'
    },
    {
      id: 'storytelling_flow',
      title: 'Storytelling Flow',
      description: 'Transições suaves para narrativas.',
      icon: Scroll,
      accentColor: '#8b5cf6'
    },
    {
      id: 'meme_style',
      title: 'Meme Style',
      description: 'Fontes ousadas e cores vibrantes.',
      icon: Smile,
      accentColor: '#f59e0b'
    },
  ];

  const handleSelectPreset = (presetId: CaptionPresetType) => {
    onChangeConfig({ preset: presetId });
  };

  const handleApply = () => {
    onApplyPreset();
    setAppliedToast(true);
    setTimeout(() => setAppliedToast(false), 3000);
  };

  return (
    <div className="min-h-[calc(100vh-85px)] bg-[#0d1017] text-slate-100 p-4 lg:p-8 flex flex-col justify-center">
      <div className="max-w-6xl mx-auto w-full space-y-6">
        
        {/* Title Header matching Image 1 */}
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['Montserrat',sans-serif]">
            Presets e Guias Sociais
          </h1>
          <p className="text-xs text-slate-400">
            Ajuste automático de enquadramento, zonas seguras e tipografia animada de alto impacto.
          </p>
        </div>

        {/* 2-Column Grid Layout matching Image 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Panel: PAINEL CONTEXTUAL, GUIAS DE PLATAFORMA, PERSONALIZAÇÃO */}
          <div className="lg:col-span-6 bg-[#131724] border border-[#23293c] rounded-2xl p-5 space-y-6 shadow-xl">
            
            {/* 1. PAINEL CONTEXTUAL (4 Cards) */}
            <div className="space-y-3">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Painel Contextual
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {presetsList.map((p) => {
                  const Icon = p.icon;
                  const isSelected = captionConfig.preset === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => handleSelectPreset(p.id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                        isSelected
                          ? 'bg-blue-950/40 border-blue-500 shadow-md shadow-blue-500/10 ring-1 ring-blue-500/50'
                          : 'bg-[#181d2c] border-[#262c3e] hover:border-slate-500 hover:bg-[#1d2335]'
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        isSelected ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                          <span>{p.title}</span>
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />}
                        </div>
                        <p className="text-[11px] text-slate-400 leading-snug mt-0.5">
                          {p.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. GUIAS DE PLATAFORMA */}
            <div className="space-y-3">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Guias de Plataforma
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'instagram_reels', label: 'Instagram Reels', icon: Smartphone },
                  { id: 'tiktok', label: 'TikTok', icon: Smartphone },
                  { id: 'youtube_shorts', label: 'YouTube Shorts', icon: Smartphone },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onSafeZoneChange(item.id as any)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                      safeZone === item.id
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25 border border-blue-400/50 scale-[1.02]'
                        : 'bg-[#181d2c] text-slate-300 border border-[#272e42] hover:bg-[#1f2639]'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. PERSONALIZAÇÃO (Sliders matching Image 1) */}
            <div className="space-y-4 pt-2 border-t border-[#1e2436]">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Personalização
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                {/* Slider 1: Animação Pop */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-300">Animação Pop</span>
                    <span className="text-blue-400 font-mono">{captionConfig.popAnimation}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={captionConfig.popAnimation}
                    onChange={(e) => onChangeConfig({ popAnimation: Number(e.target.value) })}
                    className="w-full accent-blue-500 h-1.5 bg-[#20273a] rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Slider 2: Animação Bounce */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-300">Animação Bounce</span>
                    <span className="text-blue-400 font-mono">{captionConfig.bounceAnimation}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={captionConfig.bounceAnimation}
                    onChange={(e) => onChangeConfig({ bounceAnimation: Number(e.target.value) })}
                    className="w-full accent-blue-500 h-1.5 bg-[#20273a] rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Slider 3: Animação Slide */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-300">Animação Slide</span>
                    <span className="text-blue-400 font-mono">{captionConfig.slideAnimation}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={captionConfig.slideAnimation}
                    onChange={(e) => onChangeConfig({ slideAnimation: Number(e.target.value) })}
                    className="w-full accent-blue-500 h-1.5 bg-[#20273a] rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Slider 4: Texto Atrás do Sujeito */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-300">Texto Atrás do Sujeito</span>
                    <span className="text-blue-400 font-mono">{captionConfig.textBehindSubject}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={captionConfig.textBehindSubject}
                    onChange={(e) => onChangeConfig({ textBehindSubject: Number(e.target.value) })}
                    className="w-full accent-blue-500 h-1.5 bg-[#20273a] rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Right Panel: PREVIEW AO VIVO with Live Creator and Lime Green CTA Button */}
          <div className="lg:col-span-6 bg-[#131724] border border-[#23293c] rounded-2xl p-5 space-y-4 shadow-xl flex flex-col items-center">
            
            <div className="w-full flex items-center justify-between">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Preview ao Vivo
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 bg-[#181d2c] px-3 py-1 rounded-lg border border-[#242b3d]">
                <Smartphone className="w-3.5 h-3.5 text-blue-400" />
                <span>{safeZone === 'instagram_reels' ? 'Instagram Reels' : safeZone === 'tiktok' ? 'TikTok' : 'YouTube Shorts'}</span>
              </div>
            </div>

            {/* Video Canvas Box with Safe Zone Guidelines as in Image 1 */}
            <div className="relative w-full max-w-md aspect-[16/9] sm:aspect-[9/16] max-h-[460px] rounded-xl overflow-hidden bg-black border border-slate-700 shadow-2xl flex items-center justify-center">
              
              {/* Creator Photo / Video background */}
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=85"
                alt="Live Creator Preview"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />

              {/* Shaded Margins Outside Safe Zone (Grid Overlay matching Image 1) */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Lime Green Safe Area Box matching Image 1 */}
                <div className="absolute inset-x-8 inset-y-6 border-2 border-lime-400/90 rounded-lg shadow-[0_0_15px_rgba(163,230,53,0.3)] flex flex-col justify-end p-4">
                  
                  {/* Dynamic Subtitle overlay inside safe zone matching Image 1 text */}
                  <div className="bg-black/75 backdrop-blur-sm p-3 rounded-xl border border-white/10 text-center shadow-xl">
                    <p className="text-xs sm:text-sm font-semibold text-white leading-relaxed">
                      Esta é a legenda com a animação{' '}
                      <span className="text-lime-400 font-bold underline">
                        {captionConfig.preset === 'viral_energetic' ? 'Viral Energetic' : captionConfig.preset}
                      </span>{' '}
                      aplicada nas zonas seguras do Reels.
                    </p>
                  </div>
                </div>

                {/* Outer darkened border strips */}
                <div className="absolute inset-x-0 top-0 h-6 bg-black/40 backdrop-blur-[1px]" />
                <div className="absolute inset-x-0 bottom-0 h-6 bg-black/40 backdrop-blur-[1px]" />
                <div className="absolute inset-y-0 left-0 w-8 bg-black/40 backdrop-blur-[1px]" />
                <div className="absolute inset-y-0 right-0 w-8 bg-black/40 backdrop-blur-[1px]" />
              </div>

              {/* Play / Pause Toggle Button */}
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="absolute top-3 left-3 p-2 rounded-lg bg-black/60 text-white hover:bg-black/80 transition-colors backdrop-blur-sm"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
            </div>

            {/* Big Lime Green Button matching Image 1: "Aplicar Preset & Guia" */}
            <div className="w-full pt-2">
              <button
                onClick={handleApply}
                className="w-full py-3.5 px-6 rounded-xl bg-[#84cc16] hover:bg-[#65a30d] text-black font-extrabold text-sm shadow-xl shadow-lime-500/20 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-black" />
                <span>Aplicar Preset & Guia</span>
              </button>
            </div>

            {appliedToast && (
              <div className="text-xs font-semibold text-lime-400 flex items-center gap-1.5 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4" />
                <span>Preset e zonas seguras aplicados com sucesso à timeline!</span>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
