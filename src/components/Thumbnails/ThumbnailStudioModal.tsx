import React, { useState } from 'react';
import { 
  X, 
  Image as ImageIcon, 
  Download, 
  Sparkles, 
  Layers, 
  Type, 
  Sliders, 
  Check, 
  Flame, 
  DollarSign, 
  AlertTriangle, 
  Star, 
  ArrowUpRight, 
  Eye, 
  Camera, 
  RefreshCw,
  Smartphone
} from 'lucide-react';
import { ProjectData, ThumbnailConfig, VideoAspectRatio } from '../../types';

interface ThumbnailStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectData;
  onSaveAsProjectThumbnail: (thumbnailUrl: string) => void;
}

export const ThumbnailStudioModal: React.FC<ThumbnailStudioModalProps> = ({
  isOpen,
  onClose,
  project,
  onSaveAsProjectThumbnail,
}) => {
  const [config, setConfig] = useState<ThumbnailConfig>({
    title: 'O SEGREDO REVELADO!',
    subtitle: 'Assista antes que seja tarde',
    badgeText: '🔥 NOVO',
    badgeColor: '#ef4444',
    sticker: 'fire',
    filterStyle: 'high_contrast',
    aspectRatio: '9:16',
    fontSize: 28,
  });

  const [frameTime, setFrameTime] = useState(12.4);
  const [isSaved, setIsSaved] = useState(false);
  const [previewGuide, setPreviewGuide] = useState<'full_9_16' | 'feed_4_5' | 'grid_1_1'>('full_9_16');

  if (!isOpen) return null;

  const handleDownload = () => {
    // Generate simulated download file
    const element = document.createElement('a');
    const file = new Blob(['Viralume Studio - Capa 9:16 Gerada em Alta Resolução (1080x1920)'], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${project.name}_Capa_9x16_HighCTR.png`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleApplyToProject = () => {
    onSaveAsProjectThumbnail(project.thumbnail);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1500);
  };

  const presetTitles = [
    'O SEGREDO REVELADO!',
    'NUNCA FAÇA ISSO!',
    'COMO GANHEI 100K SEGUIDORES',
    '3 HACKS SECRETOS DE VÍDEO',
    'PARE DE ERRAR NISSO!',
    'O RESULTADO ME CHOCOU...'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in select-none">
      <div className="relative w-full max-w-4xl bg-[#131724] border border-[#262e44] rounded-2xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#20273c] bg-[#161a29]">
          <div className="flex items-center gap-2 font-bold text-white text-base">
            <ImageIcon className="w-5 h-5 text-indigo-400" />
            <span>Estúdio de Capas & Miniaturas 9:16 (High CTR)</span>
            <span className="text-[11px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">
              Reels • TikTok • Shorts
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#22283d] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content: 2-Column Layout */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Left Column: Live 9:16 Thumbnail Preview */}
          <div className="md:col-span-5 flex flex-col items-center justify-center bg-[#0c0f17] rounded-xl border border-[#22293d] p-4 space-y-3">
            
            {/* Guide Simulator Mode Tabs */}
            <div className="flex items-center gap-1 bg-[#151928] p-1 rounded-lg border border-[#242c42] w-full justify-center">
              <button
                onClick={() => setPreviewGuide('full_9_16')}
                className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
                  previewGuide === 'full_9_16'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Reels (9:16)
              </button>
              <button
                onClick={() => setPreviewGuide('feed_4_5')}
                className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
                  previewGuide === 'feed_4_5'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Feed (4:5)
              </button>
              <button
                onClick={() => setPreviewGuide('grid_1_1')}
                className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
                  previewGuide === 'grid_1_1'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Grade Perfil (1:1)
              </button>
            </div>

            <div className="relative w-[240px] aspect-[9/16] rounded-xl overflow-hidden shadow-2xl border-2 border-indigo-500/40 bg-black flex flex-col justify-between p-3 group">
              
              {/* Creator Background Image with Filter Boost */}
              <img
                src={project.thumbnail || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=85"}
                alt="Thumbnail Frame"
                className={`absolute inset-0 w-full h-full object-cover object-center transition-all ${
                  config.filterStyle === 'high_contrast' ? 'contrast-125 saturate-125 brightness-105' :
                  config.filterStyle === 'neon_glow' ? 'brightness-110 saturate-150 hue-rotate-15' :
                  config.filterStyle === 'vintage' ? 'sepia-50 contrast-110' : ''
                }`}
                referrerPolicy="no-referrer"
              />

              {/* Gradient Vignette for Text Legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/60 pointer-events-none" />

              {/* Instagram Feed 4:5 Cutout Guide */}
              {previewGuide === 'feed_4_5' && (
                <div className="absolute inset-0 pointer-events-none z-15 flex flex-col justify-between">
                  <div className="w-full h-[14.8%] bg-black/80 backdrop-blur-[1px] border-b border-rose-500 text-[8px] text-rose-300 font-bold flex items-center justify-center">
                    Corte Feed
                  </div>
                  <div className="flex-1 border-2 border-rose-400/80" />
                  <div className="w-full h-[14.8%] bg-black/80 backdrop-blur-[1px] border-t border-rose-500 text-[8px] text-rose-300 font-bold flex items-center justify-center">
                    Corte Feed
                  </div>
                </div>
              )}

              {/* Instagram Profile Grid 1:1 Cutout Guide */}
              {previewGuide === 'grid_1_1' && (
                <div className="absolute inset-0 pointer-events-none z-15 flex flex-col justify-between">
                  <div className="w-full h-[21.8%] bg-black/85 backdrop-blur-[1px] border-b border-amber-400 text-[8px] text-amber-300 font-bold flex items-center justify-center">
                    Oculto na Grade
                  </div>
                  <div className="flex-1 border-2 border-amber-400" />
                  <div className="w-full h-[21.8%] bg-black/85 backdrop-blur-[1px] border-t border-amber-400 text-[8px] text-amber-300 font-bold flex items-center justify-center">
                    Oculto na Grade
                  </div>
                </div>
              )}

              {/* Top Row: Badge & Sticker */}
              <div className="relative z-10 flex items-center justify-between">
                {config.badgeText && (
                  <span 
                    className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider text-white shadow-lg border border-white/30 animate-pulse"
                    style={{ backgroundColor: config.badgeColor }}
                  >
                    {config.badgeText}
                  </span>
                )}

                {config.sticker === 'fire' && (
                  <div className="w-8 h-8 rounded-full bg-amber-500/90 text-black flex items-center justify-center shadow-lg border border-yellow-300">
                    <Flame className="w-5 h-5 fill-amber-300" />
                  </div>
                )}
                {config.sticker === 'money' && (
                  <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg border border-emerald-300">
                    <DollarSign className="w-5 h-5 font-bold" />
                  </div>
                )}
                {config.sticker === 'warning' && (
                  <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg border border-red-300">
                    <AlertTriangle className="w-5 h-5 fill-white text-black" />
                  </div>
                )}
                {config.sticker === 'star' && (
                  <div className="w-8 h-8 rounded-full bg-yellow-400 text-black flex items-center justify-center shadow-lg border border-white">
                    <Star className="w-5 h-5 fill-black" />
                  </div>
                )}
                {config.sticker === 'arrow' && (
                  <div className="w-8 h-8 rounded-full bg-cyan-500 text-black flex items-center justify-center shadow-lg border border-white">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                )}
              </div>

              {/* Bottom Area: Big Viral Title & Subtitle */}
              <div className="relative z-10 space-y-1.5 text-center">
                {config.title && (
                  <div className="px-2.5 py-1.5 bg-[#FFE600] text-black font-['Montserrat',sans-serif] font-black text-sm uppercase tracking-tight rounded-lg shadow-2xl border-2 border-black transform -rotate-1 leading-tight">
                    {config.title}
                  </div>
                )}
                {config.subtitle && (
                  <div className="px-2 py-0.5 bg-black/80 backdrop-blur-sm text-white font-bold text-[10px] rounded border border-white/20">
                    {config.subtitle}
                  </div>
                )}
              </div>
            </div>

            {/* Frame Selector Slider */}
            <div className="w-full mt-4 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Camera className="w-3.5 h-3.5 text-indigo-400" />
                  Capturar Frame do Vídeo
                </span>
                <span className="font-mono text-slate-200">00:{Math.floor(frameTime).toString().padStart(2, '0')}.4</span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                step="0.5"
                value={frameTime}
                onChange={(e) => setFrameTime(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>
          </div>

          {/* Right Column: Customization Controls */}
          <div className="md:col-span-7 space-y-4">
            
            {/* Title Input & Presets */}
            <div className="p-3.5 rounded-xl bg-[#171c2b] border border-[#252d42] space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                  <Type className="w-4 h-4 text-amber-400" />
                  Título Principal Chamativo (Gancho Visual)
                </label>
              </div>

              <input
                type="text"
                value={config.title}
                onChange={(e) => setConfig(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Ex: O SEGREDO REVELADO!"
                className="w-full px-3 py-2 bg-[#0e111a] border border-[#2b344d] rounded-lg text-sm text-white font-bold focus:border-indigo-500 outline-none"
              />

              {/* Quick Preset Titles */}
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Ganchos Rápidos de Alto Impacto:</span>
                <div className="flex flex-wrap gap-1.5">
                  {presetTitles.map((t, idx) => (
                    <button
                      key={idx}
                      onClick={() => setConfig(prev => ({ ...prev, title: t }))}
                      className="px-2 py-1 rounded bg-[#101420] hover:bg-[#20273c] text-[11px] text-slate-300 border border-[#273047] transition-colors"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Subtitle & Badge */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-[#171c2b] border border-[#252d42] space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Subtítulo / Chamada</label>
                <input
                  type="text"
                  value={config.subtitle}
                  onChange={(e) => setConfig(prev => ({ ...prev, subtitle: e.target.value }))}
                  placeholder="Ex: Veja até o fim"
                  className="w-full px-2.5 py-1.5 bg-[#0e111a] border border-[#2b344d] rounded-lg text-xs text-white outline-none"
                />
              </div>

              <div className="p-3 rounded-xl bg-[#171c2b] border border-[#252d42] space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Selo / Badge de Destaque</label>
                <input
                  type="text"
                  value={config.badgeText}
                  onChange={(e) => setConfig(prev => ({ ...prev, badgeText: e.target.value }))}
                  placeholder="Ex: 🔥 NOVO"
                  className="w-full px-2.5 py-1.5 bg-[#0e111a] border border-[#2b344d] rounded-lg text-xs text-white outline-none"
                />
              </div>
            </div>

            {/* Stickers Selector */}
            <div className="p-3 rounded-xl bg-[#171c2b] border border-[#252d42] space-y-2">
              <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Sticker de Atenção Instantânea
              </label>

              <div className="grid grid-cols-6 gap-2">
                {[
                  { id: 'fire', label: 'Fogo', icon: Flame, color: 'text-amber-400' },
                  { id: 'money', label: 'Grana', icon: DollarSign, color: 'text-emerald-400' },
                  { id: 'warning', label: 'Alerta', icon: AlertTriangle, color: 'text-red-400' },
                  { id: 'star', label: 'Estrela', icon: Star, color: 'text-yellow-400' },
                  { id: 'arrow', label: 'Seta', icon: ArrowUpRight, color: 'text-cyan-400' },
                  { id: 'none', label: 'Nenhum', icon: X, color: 'text-slate-500' },
                ].map((stk) => {
                  const Icon = stk.icon;
                  return (
                    <button
                      key={stk.id}
                      onClick={() => setConfig(prev => ({ ...prev, sticker: stk.id as any }))}
                      className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all ${
                        config.sticker === stk.id
                          ? 'bg-indigo-600/30 border-indigo-500 text-white font-bold'
                          : 'bg-[#0f121d] border-[#22293d] text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Icon className={`w-4 h-4 mb-1 ${stk.color}`} />
                      <span className="text-[10px]">{stk.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Visual Filter Preset */}
            <div className="p-3 rounded-xl bg-[#171c2b] border border-[#252d42] space-y-2">
              <label className="text-xs font-medium text-slate-300">Filtro de Nitidez / Realce Facial</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'clean', label: 'Natural' },
                  { id: 'high_contrast', label: 'Alto Contraste' },
                  { id: 'neon_glow', label: 'Glow Viral' },
                  { id: 'vintage', label: 'Cinematográfico' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setConfig(prev => ({ ...prev, filterStyle: f.id as any }))}
                    className={`py-1.5 px-2 rounded-lg text-[11px] font-medium border transition-colors ${
                      config.filterStyle === f.id
                        ? 'bg-indigo-600 text-white border-indigo-400'
                        : 'bg-[#0f121d] text-slate-400 border-[#22293d] hover:text-white'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#20273c] bg-[#161a29]">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-indigo-400" />
            <span>Formato 9:16 (1080 x 1920) Otimizado para Reels e Shorts</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownload}
              className="px-4 py-2 rounded-xl bg-[#22293d] hover:bg-[#2d364f] text-slate-200 text-xs font-semibold flex items-center gap-2 border border-[#343e59] transition-all"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              Baixar Imagem PNG (1080x1920)
            </button>

            <button
              onClick={handleApplyToProject}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all"
            >
              {isSaved ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  Capa Aplicada ao Projeto!
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Definir como Capa do Projeto
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
