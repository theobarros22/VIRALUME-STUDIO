import React, { useState } from 'react';
import { 
  X, 
  Crop, 
  User, 
  Users, 
  Zap, 
  Check, 
  Sliders, 
  Sparkles, 
  Eye, 
  Smartphone, 
  Tv, 
  Scan,
  Maximize2
} from 'lucide-react';
import { AutoFramingConfig, ProjectData } from '../../types';

interface AutoFramingModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectData;
  onApplyAutoFraming?: (config: AutoFramingConfig) => void;
}

export const AutoFramingModal: React.FC<AutoFramingModalProps> = ({
  isOpen,
  onClose,
  project,
  onApplyAutoFraming,
}) => {
  const [config, setConfig] = useState<AutoFramingConfig>({
    enabled: true,
    mode: 'single_speaker',
    trackingSmoothness: 80,
    zoomLevel: 1.35,
    centerOffsetY: 0,
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);

  if (!isOpen) return null;

  const handleApply = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsDone(true);
      if (onApplyAutoFraming) {
        onApplyAutoFraming(config);
      }
      setTimeout(() => {
        setIsDone(false);
        onClose();
      }, 1200);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in select-none">
      <div className="relative w-full max-w-4xl bg-[#131724] border border-[#262e44] rounded-2xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#20273c] bg-[#161a29]">
          <div className="flex items-center gap-2 font-bold text-white text-base">
            <Crop className="w-5 h-5 text-indigo-400" />
            <span>Auto-Framing IA & Rastreamento Facial (16:9 ➔ 9:16)</span>
            <span className="text-[11px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/30">
              Smart Crop Neural
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
          <div className="md:col-span-6 flex flex-col items-center justify-center bg-[#0c0f17] rounded-xl border border-[#22293d] p-4">
            <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-[#262e44] bg-slate-900 flex items-center justify-center shadow-2xl">
              
              {/* Horizontal Original Source Video */}
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900&auto=format&fit=crop&q=85"
                alt="Original Video"
                className="w-full h-full object-cover opacity-40 filter grayscale"
                referrerPolicy="no-referrer"
              />

              {/* Dynamic 9:16 Smart Crop Box centered on the person's face */}
              <div 
                className="absolute h-[92%] aspect-[9/16] border-2 border-indigo-400 rounded-lg shadow-2xl shadow-indigo-500/30 overflow-hidden flex items-center justify-center transition-all duration-300"
                style={{
                  transform: `scale(${config.zoomLevel}) translateY(${config.centerOffsetY * 0.5}px)`
                }}
              >
                {/* Cropped Clear Area */}
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900&auto=format&fit=crop&q=85"
                  alt="Tracked Face"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />

                {/* AI Face Detection Box Overlay */}
                <div className="absolute top-8 w-16 h-16 border-2 border-emerald-400 rounded-lg bg-emerald-500/10 flex items-start justify-start p-1 pointer-events-none animate-pulse">
                  <span className="text-[8px] bg-emerald-500 text-black px-1 font-bold rounded">
                    Rosto 98%
                  </span>
                </div>

                {/* Vertical Safe Area Guides */}
                <div className="absolute inset-0 border border-white/20 pointer-events-none m-2 rounded" />
              </div>

              {/* Status Badge */}
              <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/80 rounded backdrop-blur text-[10px] text-indigo-300 font-mono border border-indigo-500/30 flex items-center gap-1.5">
                <Scan className="w-3 h-3 text-emerald-400 animate-spin" />
                Rastreando Orador Ativo
              </div>
            </div>

            <p className="text-[11px] text-slate-400 text-center mt-3">
              A IA re-enquadra vídeos horizontais 16:9 em verticais 9:16 sem cortar a cabeça ou o tronco do orador.
            </p>
          </div>

          {/* Right Column: Tracking Settings */}
          <div className="md:col-span-6 space-y-4">
            
            {/* Tracking Mode */}
            <div className="p-3.5 rounded-xl bg-[#171c2b] border border-[#252d42] space-y-3">
              <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <User className="w-4 h-4 text-indigo-400" />
                Modo de Rastreamento
              </label>

              <div className="grid grid-cols-3 gap-2">
                {[
                  {
                    id: 'single_speaker',
                    title: 'Orador Único',
                    desc: 'Foco suave no apresentador',
                    icon: User,
                  },
                  {
                    id: 'speaker_switch',
                    title: 'Alternância',
                    desc: 'Alterna por quem fala',
                    icon: Users,
                  },
                  {
                    id: 'action_track',
                    title: 'Ação Rápida',
                    desc: 'Esportes e dança',
                    icon: Zap,
                  },
                ].map((m) => {
                  const Icon = m.icon;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setConfig(prev => ({ ...prev, mode: m.id as any }))}
                      className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                        config.mode === m.id
                          ? 'bg-indigo-600/30 border-indigo-500 text-white font-bold'
                          : 'bg-[#0f121d] border-[#22293d] text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Icon className="w-4 h-4 mb-2 text-indigo-300" />
                      <div>
                        <div className="text-xs">{m.title}</div>
                        <div className="text-[10px] text-slate-400 font-normal">{m.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Smoothing & Zoom Sliders */}
            <div className="p-3.5 rounded-xl bg-[#171c2b] border border-[#252d42] space-y-3">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">Suavidade do Movimento de Câmera</span>
                  <span className="font-mono text-indigo-400 font-bold">{config.trackingSmoothness}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={config.trackingSmoothness}
                  onChange={(e) => setConfig(prev => ({ ...prev, trackingSmoothness: parseInt(e.target.value) }))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
                <span className="text-[10px] text-slate-500">Valores mais altos criam transições cinematográficas suaves</span>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-[#22283a]">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">Nível de Zoom / Enquadramento</span>
                  <span className="font-mono text-cyan-400 font-bold">{config.zoomLevel.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="2.0"
                  step="0.05"
                  value={config.zoomLevel}
                  onChange={(e) => setConfig(prev => ({ ...prev, zoomLevel: parseFloat(e.target.value) }))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>
            </div>

            {/* Benefits Banner */}
            <div className="p-3 rounded-xl bg-[#0f1320] border border-[#232b3f] flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-amber-400 flex-shrink-0" />
              <div className="text-[11px] text-slate-300 leading-relaxed">
                Ideal para reaproveitar podcasts do YouTube, entrevistas e vídeos de estúdio no formato vertical do <strong>Instagram Reels</strong> e <strong>TikTok</strong>.
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#20273c] bg-[#161a29]">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-indigo-400" />
            <span>Saída: 9:16 Vertical (1080 x 1920) com enquadramento centralizado</span>
          </div>

          <button
            onClick={handleApply}
            disabled={isProcessing}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <Scan className="w-4 h-4 animate-spin text-cyan-300" />
                Processando Rastreamento IA...
              </>
            ) : isDone ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                Auto-Framing 9:16 Aplicado!
              </>
            ) : (
              <>
                <Crop className="w-4 h-4" />
                Aplicar Auto-Framing ao Clipe
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
