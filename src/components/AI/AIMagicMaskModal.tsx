import React, { useState } from 'react';
import { 
  X, 
  Layers, 
  User, 
  Sparkles, 
  Sliders, 
  Check, 
  Eye, 
  Type, 
  ShieldCheck, 
  Palette,
  Smartphone
} from 'lucide-react';
import { ProjectData } from '../../types';

interface AIMagicMaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectData;
  onApplyMagicMask?: () => void;
}

export const AIMagicMaskModal: React.FC<AIMagicMaskModalProps> = ({
  isOpen,
  onClose,
  project,
  onApplyMagicMask,
}) => {
  const [viewMode, setViewMode] = useState<'composite' | 'matte' | 'text_behind'>('text_behind');
  const [feather, setFeather] = useState(15);
  const [expand, setExpand] = useState(0);
  const [textBehindContent, setTextBehindContent] = useState('VIRALUME');
  const [textColor, setTextColor] = useState('#ffffff');
  const [isDone, setIsDone] = useState(false);

  if (!isOpen) return null;

  const handleApply = () => {
    if (onApplyMagicMask) {
      onApplyMagicMask();
    }
    setIsDone(true);
    setTimeout(() => {
      setIsDone(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in select-none">
      <div className="relative w-full max-w-4xl bg-[#131724] border border-[#262e44] rounded-2xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#20273c] bg-[#161a29]">
          <div className="flex items-center gap-2 font-bold text-white text-base">
            <Layers className="w-5 h-5 text-indigo-400" />
            <span>Máscara Mágica IA & Texto Atrás do Sujeito (Depth Mask)</span>
            <span className="text-[11px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/30">
              Rotoscopia Neural em Tempo Real
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#22283d] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content: 2 Columns */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Left Column: Interactive Simulation Preview */}
          <div className="md:col-span-5 flex flex-col items-center justify-center bg-[#0c0f17] rounded-xl border border-[#22293d] p-4">
            <div className="relative w-[240px] aspect-[9/16] rounded-xl overflow-hidden shadow-2xl border-2 border-purple-500/40 bg-black flex items-center justify-center">
              
              {/* Background Layer or Text Behind Layer */}
              {viewMode === 'matte' ? (
                <div className="w-full h-full bg-black flex items-center justify-center">
                  {/* Silhouette Mask View */}
                  <div className="w-36 h-64 bg-white rounded-t-full filter blur-[1px] opacity-95 animate-pulse" />
                </div>
              ) : (
                <>
                  {/* Background Video */}
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=85"
                    alt="Background"
                    className="absolute inset-0 w-full h-full object-cover brightness-75"
                    referrerPolicy="no-referrer"
                  />

                  {/* 3D Big Text Passing Behind the Subject */}
                  {viewMode === 'text_behind' && (
                    <div 
                      className="absolute top-1/3 w-full text-center font-['Montserrat',sans-serif] font-black text-4xl uppercase tracking-widest text-white/90 drop-shadow-2xl z-10 scale-110 pointer-events-none"
                      style={{ color: textColor }}
                    >
                      {textBehindContent}
                    </div>
                  )}

                  {/* Foreground Cutout Subject (Subject on Top Layer) */}
                  <div className="absolute inset-0 z-20 overflow-hidden pointer-events-none flex items-center justify-center">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=85"
                      alt="Foreground Cutout"
                      className="w-full h-full object-cover"
                      style={{
                        clipPath: 'polygon(20% 0%, 80% 0%, 85% 100%, 15% 100%)'
                      }}
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </>
              )}

              {/* View Mode Badge */}
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[9px] font-mono text-purple-300 border border-purple-500/40 z-30">
                {viewMode === 'text_behind' ? 'Camada 3D: Texto Atrás' : viewMode === 'matte' ? 'Visão Máscara Alpha' : 'Composição Final'}
              </div>
            </div>

            <div className="flex gap-1.5 mt-3">
              <button
                onClick={() => setViewMode('text_behind')}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold border ${
                  viewMode === 'text_behind'
                    ? 'bg-purple-600 text-white border-purple-400'
                    : 'bg-[#141824] text-slate-400 border-[#262e44]'
                }`}
              >
                Texto Atrás
              </button>
              <button
                onClick={() => setViewMode('matte')}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold border ${
                  viewMode === 'matte'
                    ? 'bg-purple-600 text-white border-purple-400'
                    : 'bg-[#141824] text-slate-400 border-[#262e44]'
                }`}
              >
                Máscara Alpha
              </button>
              <button
                onClick={() => setViewMode('composite')}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold border ${
                  viewMode === 'composite'
                    ? 'bg-purple-600 text-white border-purple-400'
                    : 'bg-[#141824] text-slate-400 border-[#262e44]'
                }`}
              >
                Normal
              </button>
            </div>
          </div>

          {/* Right Column: Customization Controls */}
          <div className="md:col-span-7 space-y-4">
            
            {/* Text Behind Configuration */}
            <div className="p-3.5 rounded-xl bg-[#171c2b] border border-[#252d42] space-y-3">
              <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <Type className="w-4 h-4 text-purple-400" />
                Texto para Inserir Atrás do Sujeito
              </label>

              <input
                type="text"
                value={textBehindContent}
                onChange={(e) => setTextBehindContent(e.target.value)}
                placeholder="Ex: VIRALUME, PODCAST, HACK"
                className="w-full px-3 py-2 bg-[#0e111a] border border-[#2b344d] rounded-lg text-sm text-white font-bold tracking-wider outline-none focus:border-purple-500 uppercase"
              />

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400">Cor do Título:</span>
                {['#ffffff', '#f59e0b', '#38bdf8', '#ef4444', '#a855f7', '#22c55e'].map((c) => (
                  <button
                    key={c}
                    onClick={() => setTextColor(c)}
                    className={`w-6 h-6 rounded-full border-2 transition-transform ${
                      textColor === c ? 'scale-125 border-white' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            {/* Edge Feathering & Refinement */}
            <div className="p-3.5 rounded-xl bg-[#171c2b] border border-[#252d42] space-y-3">
              <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-indigo-400" />
                Refinamento de Borda da Silhueta (Feather)
              </label>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">Suavidade da Borda (Feather)</span>
                  <span className="font-mono text-purple-400 font-bold">{feather} px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  value={feather}
                  onChange={(e) => setFeather(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
              </div>

              <div className="space-y-1.5 pt-2 border-t border-[#22283a]">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">Expansão da Máscara</span>
                  <span className="font-mono text-cyan-400 font-bold">{expand} %</span>
                </div>
                <input
                  type="range"
                  min="-20"
                  max="20"
                  value={expand}
                  onChange={(e) => setExpand(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>
            </div>

            {/* Quality Note */}
            <div className="p-3 rounded-xl bg-[#0f1320] border border-[#232b3f] flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-purple-400 flex-shrink-0" />
              <div className="text-[11px] text-slate-300 leading-relaxed">
                Efeito visual cinematográfico muito utilizado pelos maiores criadores do TikTok e Reels para reter atenção nos primeiros 3 segundos.
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#20273c] bg-[#161a29]">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-purple-400" />
            <span>Processamento local com aceleração GPU</span>
          </div>

          <button
            onClick={handleApply}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-purple-600/30 transition-all"
          >
            {isDone ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                Máscara & Texto Atrás Aplicados!
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                Aplicar Efeito ao Clipe
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
