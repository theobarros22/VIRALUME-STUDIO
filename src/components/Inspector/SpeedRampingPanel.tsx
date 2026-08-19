import React, { useState } from 'react';
import { 
  Zap, 
  Clock, 
  Activity, 
  Sparkles, 
  CheckCircle2, 
  Sliders, 
  Layers,
  Flame
} from 'lucide-react';

interface SpeedRampingPanelProps {
  onApplySpeed?: (speed: number, presetName: string) => void;
}

interface SpeedPreset {
  id: string;
  name: string;
  speed: number;
  curve: string;
  description: string;
  icon: string;
}

const SPEED_PRESETS: SpeedPreset[] = [
  {
    id: 'normal',
    name: 'Normal (1.0x)',
    speed: 1.0,
    curve: 'M 10 50 L 190 50',
    description: 'Velocidade padrão sem aceleração.',
    icon: '⏸️'
  },
  {
    id: 'viral_beat',
    name: 'Montagem Viral (Beat Drop)',
    speed: 2.2,
    curve: 'M 10 70 C 60 70, 80 15, 120 15 C 160 15, 170 60, 190 60',
    description: 'Acelera no movimento e desacelera na batida da música.',
    icon: '⚡'
  },
  {
    id: 'bullet_time',
    name: 'Super Slow Motion (0.3x)',
    speed: 0.3,
    curve: 'M 10 30 C 50 30, 80 85, 120 85 C 160 85, 170 30, 190 30',
    description: 'Câmera ultra lenta com interpolação de fluxo óptico.',
    icon: '⏳'
  },
  {
    id: 'hyperlapse',
    name: 'Hyperlapse Rápido (3.0x)',
    speed: 3.0,
    curve: 'M 10 80 L 190 20',
    description: 'Aceleração linear para transição de cenário ou rotina.',
    icon: '🚀'
  }
];

export const SpeedRampingPanel: React.FC<SpeedRampingPanelProps> = ({ onApplySpeed }) => {
  const [selectedPreset, setSelectedPreset] = useState<SpeedPreset>(SPEED_PRESETS[1]);
  const [customSpeed, setCustomSpeed] = useState<number>(selectedPreset.speed);
  const [opticalFlow, setOpticalFlow] = useState<boolean>(true);
  const [maintainPitch, setMaintainPitch] = useState<boolean>(true);
  const [appliedToast, setAppliedToast] = useState<string | null>(null);

  const handleSelectPreset = (preset: SpeedPreset) => {
    setSelectedPreset(preset);
    setCustomSpeed(preset.speed);
  };

  const handleApply = () => {
    if (onApplySpeed) {
      onApplySpeed(customSpeed, selectedPreset.name);
    }
    setAppliedToast(`Curva "${selectedPreset.name}" aplicada ao clipe!`);
    setTimeout(() => setAppliedToast(null), 2500);
  };

  return (
    <div className="space-y-4 text-slate-100 select-none">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-amber-400" />
          Curva de Velocidade & Speed Ramping
        </span>
        <span className="text-[11px] font-mono text-amber-400 font-bold">
          {customSpeed.toFixed(2)}x
        </span>
      </div>

      {/* Preset Buttons */}
      <div className="grid grid-cols-2 gap-2">
        {SPEED_PRESETS.map(preset => {
          const isSelected = selectedPreset.id === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => handleSelectPreset(preset)}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'bg-amber-950/40 border-amber-500 ring-1 ring-amber-500/50 shadow-md'
                  : 'bg-[#151926] border-[#22293b] hover:border-slate-500'
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold text-xs text-white">
                <span>{preset.icon}</span>
                <span className="truncate">{preset.name}</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">
                {preset.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Visual Bezier Curve Display */}
      <div className="bg-[#0b0e17] border border-[#20273a] rounded-xl p-3 space-y-2">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>Curva Bézier de Transição de Velocidade:</span>
          <span className="text-amber-400 font-mono">Suavização GPU</span>
        </div>

        <div className="h-20 bg-[#121624] rounded-lg border border-[#1f2638] relative overflow-hidden flex items-center justify-center">
          <svg className="w-full h-full" viewBox="0 0 200 100" preserveAspectRatio="none">
            {/* Grid lines */}
            <line x1="0" y1="50" x2="200" y2="50" stroke="#252d42" strokeDasharray="3 3" strokeWidth="1" />
            <line x1="100" y1="0" x2="100" y2="100" stroke="#252d42" strokeDasharray="3 3" strokeWidth="1" />
            
            {/* Curve path */}
            <path
              d={selectedPreset.curve}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="3"
              strokeLinecap="round"
            />
            {/* Interactive Keypoint Dots */}
            <circle cx="20" cy="50" r="4" fill="#f59e0b" className="animate-pulse" />
            <circle cx="100" cy="20" r="5" fill="#f59e0b" />
            <circle cx="180" cy="50" r="4" fill="#f59e0b" className="animate-pulse" />
          </svg>
        </div>
      </div>

      {/* Speed Slider */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-[11px] text-slate-300">
          <span>Ajuste Fino de Velocidade:</span>
          <span className="font-mono text-amber-400 font-bold">{customSpeed.toFixed(1)}x</span>
        </div>
        <input
          type="range"
          min="0.2"
          max="4.0"
          step="0.1"
          value={customSpeed}
          onChange={(e) => setCustomSpeed(parseFloat(e.target.value))}
          className="w-full accent-amber-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-500 font-mono">
          <span>0.2x (Ultra Slow)</span>
          <span>1.0x (Padrão)</span>
          <span>4.0x (Hyper)</span>
        </div>
      </div>

      {/* Advanced Toggles */}
      <div className="space-y-2 pt-1 border-t border-[#20273a]">
        <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer p-1.5 rounded-lg hover:bg-[#181d2c]">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Fluxo Óptico (Optical Flow AI)
          </span>
          <input
            type="checkbox"
            checked={opticalFlow}
            onChange={(e) => setOpticalFlow(e.target.checked)}
            className="accent-amber-500 rounded cursor-pointer"
          />
        </label>

        <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer p-1.5 rounded-lg hover:bg-[#181d2c]">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            Preservar Tom de Áudio (Pitch Lock)
          </span>
          <input
            type="checkbox"
            checked={maintainPitch}
            onChange={(e) => setMaintainPitch(e.target.checked)}
            className="accent-amber-500 rounded cursor-pointer"
          />
        </label>
      </div>

      {appliedToast && (
        <div className="p-2.5 bg-emerald-950/80 border border-emerald-500 rounded-xl text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{appliedToast}</span>
        </div>
      )}

      {/* Apply Button */}
      <button
        onClick={handleApply}
        className="w-full py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black text-xs font-bold shadow-md shadow-amber-500/20 flex items-center justify-center gap-1.5 transition-all active:scale-98"
      >
        <Zap className="w-3.5 h-3.5 text-black" />
        <span>Aplicar Ramping ao Clipe Selecionado</span>
      </button>

    </div>
  );
};
