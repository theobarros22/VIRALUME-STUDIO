import React, { useState } from 'react';
import { 
  Sliders, 
  Move, 
  Palette, 
  RotateCw, 
  Maximize2, 
  Eye, 
  Sun, 
  Contrast, 
  Sparkles,
  RefreshCw,
  SlidersHorizontal
} from 'lucide-react';
import { InspectorState } from '../../types';

interface ContextualInspectorProps {
  inspectorState: InspectorState;
  onChange: (newState: Partial<InspectorState>) => void;
  onReset: () => void;
}

export const ContextualInspector: React.FC<ContextualInspectorProps> = ({
  inspectorState,
  onChange,
  onReset,
}) => {
  const [activeTab, setActiveTab] = useState<'transform' | 'color' | 'text'>('transform');

  return (
    <div className="h-full flex flex-col bg-[#141824] border-r border-[#222838] text-slate-200 text-xs select-none">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-[#202636]">
        <div className="flex items-center gap-1.5 font-semibold text-slate-100 text-xs">
          <Sliders className="w-3.5 h-3.5 text-indigo-400" />
          <span>Inspetor Contextual</span>
        </div>
        <button
          onClick={onReset}
          className="text-[10px] text-slate-400 hover:text-indigo-300 flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-[#1e2436] transition-colors"
          title="Redefinir Parâmetros"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Redefinir</span>
        </button>
      </div>

      {/* Tabs matching Image 5 & 6 (Transform, Color, Text) */}
      <div className="flex items-center border-b border-[#1f2537] bg-[#0f121c] px-2 pt-1">
        {[
          { id: 'transform', label: 'Transformação', icon: Move },
          { id: 'color', label: 'Cor & Gradação', icon: Palette },
          { id: 'text', label: 'Texto / Legenda', icon: Sparkles },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-[11px] font-medium border-b-2 transition-colors ${
                isActive
                  ? 'border-indigo-500 text-indigo-300 bg-[#161a27]'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-[#141824]'
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content Body */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-4 custom-scrollbar">
        
        {/* TAB 1: TRANSFORM (Image 5 & 6) */}
        {activeTab === 'transform' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between font-semibold text-slate-300 text-xs">
              <span className="flex items-center gap-1.5">
                <Move className="w-3.5 h-3.5 text-indigo-400" />
                Transformação do Objeto
              </span>
              <span className="text-[10px] text-indigo-400 font-mono">X: {inspectorState.posX}px / Y: {inspectorState.posY}px</span>
            </div>

            {/* Position X & Y */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Posição (X, Y)</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center bg-[#0f121c] border border-[#252d40] rounded-lg px-2.5 py-1.5">
                  <span className="text-[11px] text-slate-500 font-mono mr-2">X</span>
                  <input
                    type="number"
                    value={inspectorState.posX}
                    onChange={(e) => onChange({ posX: Number(e.target.value) })}
                    className="w-full bg-transparent text-xs text-slate-100 focus:outline-none font-mono"
                  />
                  <span className="text-[10px] text-slate-500">px</span>
                </div>
                <div className="flex items-center bg-[#0f121c] border border-[#252d40] rounded-lg px-2.5 py-1.5">
                  <span className="text-[11px] text-slate-500 font-mono mr-2">Y</span>
                  <input
                    type="number"
                    value={inspectorState.posY}
                    onChange={(e) => onChange({ posY: Number(e.target.value) })}
                    className="w-full bg-transparent text-xs text-slate-100 focus:outline-none font-mono"
                  />
                  <span className="text-[10px] text-slate-500">px</span>
                </div>
              </div>
            </div>

            {/* Scale */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Escala (Zoom)</span>
                <span className="text-indigo-400 font-mono">{inspectorState.scale.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="3.0"
                step="0.05"
                value={inspectorState.scale}
                onChange={(e) => onChange({ scale: parseFloat(e.target.value) })}
                className="w-full accent-indigo-500 h-1.5 bg-[#202739] rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Rotation */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Rotação</span>
                <span className="text-indigo-400 font-mono">{inspectorState.rotation}°</span>
              </div>
              <input
                type="range"
                min="-180"
                max="180"
                step="1"
                value={inspectorState.rotation}
                onChange={(e) => onChange({ rotation: parseInt(e.target.value) })}
                className="w-full accent-indigo-500 h-1.5 bg-[#202739] rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Anchor Point */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Ponto Âncora</span>
                <span className="text-indigo-400 font-mono">{inspectorState.anchorPoint.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={inspectorState.anchorPoint}
                onChange={(e) => onChange({ anchorPoint: parseFloat(e.target.value) })}
                className="w-full accent-indigo-500 h-1.5 bg-[#202739] rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Opacity */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Opacidade</span>
                <span className="text-indigo-400 font-mono">{inspectorState.opacity}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={inspectorState.opacity}
                onChange={(e) => onChange({ opacity: parseInt(e.target.value) })}
                className="w-full accent-indigo-500 h-1.5 bg-[#202739] rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* TAB 2: COLOR & 3-WAY COLOR GRADING (Images 5 & 6) */}
        {activeTab === 'color' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between font-semibold text-slate-300 text-xs">
              <span className="flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-cyan-400" />
                Color Grading & Correção
              </span>
            </div>

            {/* 3-Way Color Wheels exactly as in Image 6 */}
            <div className="space-y-2">
              <div className="text-[11px] text-slate-400 font-medium">Rodas de Cor (Color Wheels)</div>
              <div className="grid grid-cols-3 gap-2 text-center">
                
                {/* Lift / Sombras */}
                <div className="flex flex-col items-center bg-[#111420] p-2 rounded-xl border border-[#232a3d]">
                  <div className="w-14 h-14 rounded-full relative p-0.5 flex items-center justify-center bg-gradient-to-tr from-blue-500 via-purple-500 to-rose-500 shadow-inner cursor-pointer hover:scale-105 transition-transform">
                    <div className="w-full h-full rounded-full bg-[#161a28] flex items-center justify-center relative">
                      <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/80 -translate-x-1 translate-y-1" />
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-300 font-semibold mt-1.5">Lift</span>
                  <span className="text-[9px] text-slate-500">Sombras</span>
                </div>

                {/* Gamma / Médios */}
                <div className="flex flex-col items-center bg-[#111420] p-2 rounded-xl border border-[#232a3d]">
                  <div className="w-14 h-14 rounded-full relative p-0.5 flex items-center justify-center bg-gradient-to-tr from-amber-500 via-emerald-500 to-cyan-500 shadow-inner cursor-pointer hover:scale-105 transition-transform">
                    <div className="w-full h-full rounded-full bg-[#161a28] flex items-center justify-center relative">
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm shadow-amber-400/80 translate-x-1" />
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-300 font-semibold mt-1.5">Gamma</span>
                  <span className="text-[9px] text-slate-500">Médios</span>
                </div>

                {/* Gain / Realces */}
                <div className="flex flex-col items-center bg-[#111420] p-2 rounded-xl border border-[#232a3d]">
                  <div className="w-14 h-14 rounded-full relative p-0.5 flex items-center justify-center bg-gradient-to-tr from-rose-500 via-amber-500 to-violet-500 shadow-inner cursor-pointer hover:scale-105 transition-transform">
                    <div className="w-full h-full rounded-full bg-[#161a28] flex items-center justify-center relative">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-400 shadow-sm shadow-rose-400/80" />
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-300 font-semibold mt-1.5">Gain</span>
                  <span className="text-[9px] text-slate-500">Realces</span>
                </div>

              </div>
            </div>

            {/* Sliders matching Image 5 (Exposure, Contrast, Saturation, Temperature) */}
            <div className="space-y-3 pt-2 border-t border-[#1f2537]">
              {/* Exposure */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Exposição</span>
                  <span className="text-cyan-400 font-mono">{inspectorState.exposure > 0 ? `+${inspectorState.exposure}` : inspectorState.exposure}</span>
                </div>
                <input
                  type="range"
                  min="-3"
                  max="3"
                  step="0.1"
                  value={inspectorState.exposure}
                  onChange={(e) => onChange({ exposure: parseFloat(e.target.value) })}
                  className="w-full accent-cyan-400 h-1.5 bg-[#202739] rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Contrast */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Contraste</span>
                  <span className="text-cyan-400 font-mono">{inspectorState.contrast > 0 ? `+${inspectorState.contrast}` : inspectorState.contrast}</span>
                </div>
                <input
                  type="range"
                  min="-2"
                  max="2"
                  step="0.1"
                  value={inspectorState.contrast}
                  onChange={(e) => onChange({ contrast: parseFloat(e.target.value) })}
                  className="w-full accent-cyan-400 h-1.5 bg-[#202739] rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Saturation */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Saturação</span>
                  <span className="text-cyan-400 font-mono">{inspectorState.saturation > 0 ? `+${inspectorState.saturation}` : inspectorState.saturation}</span>
                </div>
                <input
                  type="range"
                  min="-3"
                  max="3"
                  step="0.1"
                  value={inspectorState.saturation}
                  onChange={(e) => onChange({ saturation: parseFloat(e.target.value) })}
                  className="w-full accent-cyan-400 h-1.5 bg-[#202739] rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Temperature */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Temperatura</span>
                  <span className="text-cyan-400 font-mono">{inspectorState.temperature > 0 ? `+${inspectorState.temperature}` : inspectorState.temperature}</span>
                </div>
                <input
                  type="range"
                  min="-3"
                  max="3"
                  step="0.1"
                  value={inspectorState.temperature}
                  onChange={(e) => onChange({ temperature: parseFloat(e.target.value) })}
                  className="w-full accent-cyan-400 h-1.5 bg-[#202739] rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: TEXT / CAPTIONS */}
        {activeTab === 'text' && (
          <div className="space-y-3">
            <div className="text-[11px] text-slate-400">Personalize o comportamento do texto dinâmico na cena:</div>
            
            <div className="p-3 bg-[#111420] rounded-xl border border-[#232a3d] space-y-2">
              <span className="text-xs font-semibold text-indigo-300">Modo Pop Inteligente</span>
              <p className="text-[11px] text-slate-400">
                O texto se ajusta à velocidade da fala e adiciona animação de escala e contorno automaticamente.
              </p>
            </div>

            <div className="p-3 bg-[#111420] rounded-xl border border-[#232a3d] space-y-2">
              <span className="text-xs font-semibold text-cyan-300">Texto Atrás do Sujeito</span>
              <p className="text-[11px] text-slate-400">
                Segmentação por IA isola o criador e coloca a palavra com efeito 3D de profundidade.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
