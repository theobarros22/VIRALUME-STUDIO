import React, { useState } from 'react';
import { 
  Sparkles, 
  Type, 
  Palette, 
  Layers, 
  CheckCircle2, 
  Play, 
  Pause, 
  Scissors, 
  Check,
  Eye,
  Sliders
} from 'lucide-react';
import { CaptionPresetType, CaptionStyleConfig, TranscriptWord } from '../../types';
import { INITIAL_TRANSCRIPT } from '../../data/mockData';

interface SubtitleGalleryPanelProps {
  captionConfig: CaptionStyleConfig;
  onChangeConfig: (newConfig: Partial<CaptionStyleConfig>) => void;
  onApplyPreset: () => void;
  onNavigateToTextCut?: () => void;
}

export const SubtitleGalleryPanel: React.FC<SubtitleGalleryPanelProps> = ({
  captionConfig,
  onChangeConfig,
  onApplyPreset,
  onNavigateToTextCut,
}) => {
  const [activeWordId, setActiveWordId] = useState<string>('w13');
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const styleCards: {
    id: CaptionPresetType;
    name: string;
    description: string;
    previewBadge: React.ReactNode;
  }[] = [
    {
      id: 'viral_energetic',
      name: "'Viral Energetic'",
      description: 'Animação Pop, Texto Grande',
      previewBadge: (
        <div className="bg-[#FFE600] text-black font-['Montserrat',sans-serif] font-black px-4 py-2 rounded-xl text-center shadow-lg border-2 border-black rotate-[-2deg]">
          <span className="block text-sm tracking-tight leading-none">FIQUE VIRAL! 💥</span>
        </div>
      )
    },
    {
      id: 'podcast_clean',
      name: 'Podcast Clean',
      description: 'Branco, Minimalista',
      previewBadge: (
        <div className="bg-black/80 text-white font-['Plus_Jakarta_Sans',sans-serif] font-bold px-3 py-1.5 rounded-lg border border-white/20 text-center text-xs">
          Áudio Limpo & Profissional
        </div>
      )
    },
    {
      id: 'tiktok_bounce',
      name: 'TikTok Bounce',
      description: 'Colorido com Sombra, Salto',
      previewBadge: (
        <div className="bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white font-['Montserrat',sans-serif] font-extrabold px-3 py-1.5 rounded-full text-center text-xs shadow-md">
          🎵 Em Alta Agora! #FYP
        </div>
      )
    },
    {
      id: 'karaoke_glow',
      name: 'Karaokê',
      description: 'Destaque Progressivo',
      previewBadge: (
        <div className="bg-blue-950/80 text-blue-200 font-bold px-3 py-1.5 rounded-lg border border-blue-400/40 text-center text-xs">
          <span className="text-cyan-400 font-extrabold">Cante junto</span> comigo!
        </div>
      )
    },
    {
      id: 'minimal_elegant',
      name: 'Minimal Elegant',
      description: 'Serifado, Discreto',
      previewBadge: (
        <div className="bg-slate-900/80 text-amber-100 font-['Playfair_Display',serif] italic font-medium px-3 py-1.5 rounded-md text-center text-xs">
          Uma escolha elegante.
        </div>
      )
    },
  ];

  const wordsList: { time: string; text: string; id: string; color?: string }[] = [
    { time: '00:01.2', text: 'Bem-vindos ao', id: 'w-t1' },
    { time: '00:01.5', text: 'tutorial', id: 'w-t2' },
    { time: '00:01.8', text: 'mais', id: 'w-t3' },
    { time: '00:02.1', text: 'incrível', id: 'w-t4', color: '#775CFF' },
    { time: '00:02.5', text: 'de', id: 'w-t5' },
    { time: '00:02.8', text: 'todos!', id: 'w-t6' },
    { time: '00:03.2', text: 'Vamos', id: 'w-t7' },
    { time: '00:03.5', text: 'aprender', id: 'w-t8' },
    { time: '00:03.8', text: 'como', id: 'w-t9' },
    { time: '00:04.1', text: 'criar', id: 'w-t10' },
    { time: '00:04.5', text: 'legendas', id: 'w-t11' },
    { time: '00:04.9', text: 'virais.', id: 'w-t12' },
  ];

  const handleApply = () => {
    onApplyPreset();
    setToastMessage('Preset de legenda aplicado à timeline com sucesso!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="min-h-[calc(100vh-85px)] bg-[#0d1017] text-slate-100 p-4 lg:p-8 space-y-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Title Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['Montserrat',sans-serif]">
              Galeria de Estilos de Legenda Automática
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Escolha e personalize presets visuais sincronizados palavra por palavra.
            </p>
          </div>
          {onNavigateToTextCut && (
            <button
              onClick={onNavigateToTextCut}
              className="px-4 py-2 rounded-xl bg-[#181d2c] hover:bg-[#22283d] text-indigo-300 border border-indigo-500/40 text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <Layers className="w-4 h-4" />
              <span>Abrir Editor de Corte por Texto</span>
            </button>
          )}
        </div>

        {/* 1. PRESET CARDS GALLERY (Image 15) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {styleCards.map((card) => {
            const isSelected = captionConfig.preset === card.id;
            return (
              <div
                key={card.id}
                onClick={() => onChangeConfig({ preset: card.id })}
                className={`flex flex-col justify-between p-4 rounded-2xl border transition-all cursor-pointer select-none min-h-[160px] ${
                  isSelected
                    ? 'bg-[#181d2f] border-indigo-500 shadow-xl shadow-indigo-500/10 ring-2 ring-indigo-500/40 scale-[1.02]'
                    : 'bg-[#131724] border-[#222838] hover:border-slate-500 hover:bg-[#181d2d]'
                }`}
              >
                {/* Visual Subtitle Preview Badge */}
                <div className="flex items-center justify-center h-16 w-full">
                  {card.previewBadge}
                </div>

                <div className="mt-3">
                  <div className="text-xs font-bold text-slate-100 flex items-center justify-between">
                    <span>{card.name}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{card.description}</p>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onChangeConfig({ preset: card.id });
                  }}
                  className={`w-full py-1.5 rounded-lg text-xs font-semibold mt-3 transition-colors ${
                    isSelected
                      ? 'bg-indigo-600 text-white'
                      : 'bg-[#1f2537] text-slate-300 hover:bg-[#283147]'
                  }`}
                >
                  {isSelected ? 'Selecionado' : 'Selecionar'}
                </button>
              </div>
            );
          })}
        </div>

        {/* 2. CONTROLES DE PERSONALIZAÇÃO (Image 15 Lower Section) */}
        <div className="bg-[#131724] border border-[#23293c] rounded-2xl p-5 space-y-4 shadow-xl">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-400" />
            <span>Controles de Personalização</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Control 1: Fonte & Tamanho */}
            <div className="space-y-3 bg-[#171c2b] p-3.5 rounded-xl border border-[#252d42]">
              <label className="block text-xs font-semibold text-slate-300">Fonte</label>
              <select
                value={captionConfig.fontFamily}
                onChange={(e) => onChangeConfig({ fontFamily: e.target.value })}
                className="w-full bg-[#0f121c] border border-[#2c354d] rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              >
                <option value="Montserrat">Montserrat Bold (Atual)</option>
                <option value="Plus Jakarta Sans">Plus Jakarta Sans</option>
                <option value="Playfair Display">Playfair Display</option>
                <option value="Inter">Inter UI</option>
                <option value="JetBrains Mono">JetBrains Mono</option>
              </select>

              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Tamanho</span>
                  <span className="text-indigo-400 font-mono">{captionConfig.fontSize}px</span>
                </div>
                <input
                  type="range"
                  min="18"
                  max="44"
                  value={captionConfig.fontSize}
                  onChange={(e) => onChangeConfig({ fontSize: Number(e.target.value) })}
                  className="w-full accent-indigo-500 h-1.5 bg-[#20273a] rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>Pequeno</span>
                  <span>Médio</span>
                  <span>Grande</span>
                </div>
              </div>
            </div>

            {/* Control 2: Cor & Paleta */}
            <div className="space-y-3 bg-[#171c2b] p-3.5 rounded-xl border border-[#252d42]">
              <label className="block text-xs font-semibold text-slate-300">Cor do Destaque</label>
              <div className="flex items-center gap-2">
                {[
                  { color: '#FFE600', name: 'Amarelo Pop' },
                  { color: '#FFFFFF', name: 'Branco' },
                  { color: '#00E5FF', name: 'Ciano Neon' },
                  { color: '#775CFF', name: 'Roxo Viralume' },
                  { color: '#F43F5E', name: 'Rosa' },
                ].map((c) => (
                  <button
                    key={c.color}
                    onClick={() => onChangeConfig({ textColor: c.color })}
                    style={{ backgroundColor: c.color }}
                    className={`w-7 h-7 rounded-lg border transition-transform ${
                      captionConfig.textColor === c.color ? 'scale-110 ring-2 ring-white border-black' : 'border-slate-700 hover:scale-105'
                    }`}
                    title={c.name}
                  />
                ))}
              </div>

              {/* Color spectrum gradient simulation matching Image 15 */}
              <div className="h-10 rounded-lg bg-gradient-to-r from-yellow-400 via-rose-500 via-purple-500 to-cyan-400 p-0.5 cursor-pointer shadow-inner">
                <div className="w-full h-full bg-[#111420]/30 rounded flex items-center justify-center text-[10px] text-white font-bold backdrop-blur-sm">
                  Gradiente Ativo: {captionConfig.textColor}
                </div>
              </div>
            </div>

            {/* Control 3: Outline (Contorno) */}
            <div className="space-y-3 bg-[#171c2b] p-3.5 rounded-xl border border-[#252d42]">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">Outline (Contorno)</label>
                <input
                  type="checkbox"
                  checked={captionConfig.hasOutline}
                  onChange={(e) => onChangeConfig({ hasOutline: e.target.checked })}
                  className="w-4 h-4 accent-indigo-500 rounded cursor-pointer"
                />
              </div>

              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Espessura</span>
                  <span className="text-indigo-400 font-mono">{captionConfig.outlineWidth}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  disabled={!captionConfig.hasOutline}
                  value={captionConfig.outlineWidth}
                  onChange={(e) => onChangeConfig({ outlineWidth: Number(e.target.value) })}
                  className="w-full accent-indigo-500 h-1.5 bg-[#20273a] rounded-lg appearance-none cursor-pointer disabled:opacity-40"
                />
              </div>
            </div>

            {/* Control 4: Animação de Entrada */}
            <div className="space-y-3 bg-[#171c2b] p-3.5 rounded-xl border border-[#252d42] flex flex-col justify-between">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Animação de Entrada</label>
                <select
                  value={captionConfig.animation}
                  onChange={(e) => onChangeConfig({ animation: e.target.value as any })}
                  className="w-full bg-[#0f121c] border border-[#2c354d] rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                >
                  <option value="pop">Pop (Atual)</option>
                  <option value="bounce">Bounce</option>
                  <option value="slide">Slide</option>
                  <option value="fade">Fade In</option>
                  <option value="karaoke">Karaokê</option>
                </select>
              </div>

              <button
                onClick={() => setIsPlayingPreview(!isPlayingPreview)}
                className="w-full py-2 rounded-lg bg-[#20273a] hover:bg-[#2c354f] text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Eye className="w-3.5 h-3.5 text-indigo-400" />
                <span>Testar Animação</span>
              </button>
            </div>

          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1e2436]">
            <button
              onClick={() => onChangeConfig({ preset: 'viral_energetic', textColor: '#FFE600' })}
              className="px-4 py-2 rounded-xl bg-[#1c2233] hover:bg-[#252c42] text-slate-300 text-xs font-semibold transition-colors"
            >
              Cancelar / Padrão
            </button>
            <button
              onClick={handleApply}
              className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all hover:scale-105"
            >
              Aplicar Preset
            </button>
          </div>

          {toastMessage && (
            <div className="text-xs text-emerald-400 font-semibold flex items-center justify-end gap-1.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4" />
              <span>{toastMessage}</span>
            </div>
          )}
        </div>

        {/* 3. SYNCHRONIZED TIMESTAMPS WORD LIST & LIVE PLAYER (Image 3) */}
        <div className="bg-[#131724] border border-[#23293c] rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1e2436] pb-3">
            <div className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>Transcrição e Estilos em Tempo Real (Sincronia Whisper)</span>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => alert('Corte de silêncios aplicado: 3.4s removidos')}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#181d2c] hover:bg-[#22293e] text-indigo-300 border border-indigo-500/30 text-xs font-medium"
              >
                <Scissors className="w-3.5 h-3.5" />
                <span>Cortar Silêncios</span>
              </button>
              <span className="text-[11px] text-emerald-400 font-semibold bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                ✓ 3.4s removidos
              </span>
            </div>
          </div>

          {/* 2-Column Subtitle Sync Viewer matching Image 3 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left Column: Word by word list matching Image 3 */}
            <div className="lg:col-span-7 space-y-1 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
              {wordsList.map((item) => {
                const isActive = activeWordId === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setActiveWordId(item.id)}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl transition-all cursor-pointer text-xs ${
                      isActive
                        ? 'bg-indigo-600/30 text-white border border-indigo-500 shadow-md font-semibold'
                        : 'bg-[#181d2c] text-slate-300 hover:bg-[#1f2638]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[11px] text-slate-400">{item.time}</span>
                      <span className="text-sm">{item.text}</span>
                    </div>
                    {item.color && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-500/30">
                        {item.color}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Right Column: Live Video Canvas Player matching Image 3 */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-[260px] aspect-[9/16] rounded-2xl overflow-hidden shadow-2xl bg-black border border-slate-700 flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80"
                  alt="Video presenter"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />

                {/* Subtitle badge centered on presenter matching Image 3 */}
                <div className="absolute inset-x-4 bottom-24 flex items-center justify-center pointer-events-none">
                  <div className="bg-[#FFE600] text-black font-['Montserrat',sans-serif] font-black px-5 py-2.5 rounded-2xl shadow-2xl border-4 border-black rotate-[-2deg] animate-bounce">
                    <span className="text-lg uppercase tracking-tight">incrível</span>
                  </div>
                </div>

                {/* Bottom mini scrubber */}
                <div className="absolute bottom-2 inset-x-3 bg-black/60 backdrop-blur-sm p-1.5 rounded-lg flex items-center justify-between text-white text-[10px]">
                  <Play className="w-3.5 h-3.5 cursor-pointer" />
                  <div className="w-24 h-1 bg-slate-700 rounded-full overflow-hidden">
                    <div className="w-1/3 h-full bg-indigo-500" />
                  </div>
                  <span>00:02.1</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
