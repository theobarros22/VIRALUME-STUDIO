import React, { useState } from 'react';
import { 
  X, 
  Volume2, 
  VolumeX, 
  Sliders, 
  Sparkles, 
  Mic, 
  Music, 
  Check, 
  Activity, 
  Gauge, 
  Zap, 
  RotateCcw,
  ShieldCheck
} from 'lucide-react';
import { AutoDuckingConfig } from '../../types';

interface AudioMixerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyDucking?: (config: AutoDuckingConfig) => void;
}

export const AudioMixerModal: React.FC<AudioMixerModalProps> = ({
  isOpen,
  onClose,
  onApplyDucking,
}) => {
  const [duckingConfig, setDuckingConfig] = useState<AutoDuckingConfig>({
    enabled: true,
    reductionDb: -16,
    thresholdDb: -24,
    attackMs: 60,
    releaseMs: 450,
    normalizeLufs: -14,
    vocalClarity: true,
  });

  const [voiceVolume, setVoiceVolume] = useState(100);
  const [musicVolume, setMusicVolume] = useState(65);
  const [sfxVolume, setSfxVolume] = useState(80);
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    if (onApplyDucking) {
      onApplyDucking(duckingConfig);
    }
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in select-none">
      <div className="relative w-full max-w-3xl bg-[#131724] border border-[#262e44] rounded-2xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#20273c] bg-[#161a29]">
          <div className="flex items-center gap-2 font-bold text-white text-base">
            <Volume2 className="w-5 h-5 text-cyan-400" />
            <span>Mixer de Áudio & Auto-Ducking Inteligente</span>
            <span className="text-[11px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
              -14 LUFS Padrão Social
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#22283d] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Section 1: Auto-Ducking Engine */}
          <div className="p-4 rounded-xl bg-[#171c2b] border border-[#252d42] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-indigo-300">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Auto-Ducking de Música de Fundo</h3>
                  <p className="text-[11px] text-slate-400">
                    Reduz automaticamente o volume da trilha de música quando a voz do orador for detectada.
                  </p>
                </div>
              </div>

              {/* Toggle Switch */}
              <button
                onClick={() => setDuckingConfig(prev => ({ ...prev, enabled: !prev.enabled }))}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                  duckingConfig.enabled ? 'bg-indigo-600 justify-end' : 'bg-slate-700 justify-start'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-white shadow-md" />
              </button>
            </div>

            {duckingConfig.enabled && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-[#232a3d]">
                {/* Reduction amount slider */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300">Atenuação da Música (Ducking)</span>
                    <span className="font-mono text-cyan-400 font-bold">{duckingConfig.reductionDb} dB</span>
                  </div>
                  <input
                    type="range"
                    min="-30"
                    max="-6"
                    step="1"
                    value={duckingConfig.reductionDb}
                    onChange={(e) => setDuckingConfig(prev => ({ ...prev, reductionDb: parseInt(e.target.value) }))}
                    className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  />
                  <span className="text-[10px] text-slate-500">Recomendado: -16 dB para fala clara</span>
                </div>

                {/* Sensitivity threshold slider */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300">Sensibilidade do Microfone</span>
                    <span className="font-mono text-indigo-400 font-bold">{duckingConfig.thresholdDb} dB</span>
                  </div>
                  <input
                    type="range"
                    min="-40"
                    max="-10"
                    step="1"
                    value={duckingConfig.thresholdDb}
                    onChange={(e) => setDuckingConfig(prev => ({ ...prev, thresholdDb: parseInt(e.target.value) }))}
                    className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                  <span className="text-[10px] text-slate-500">Dispara quando a voz passa de {duckingConfig.thresholdDb} dB</span>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Multitrack Volume Levels & LUFS Meter */}
          <div className="p-4 rounded-xl bg-[#171c2b] border border-[#252d42] space-y-4">
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-400" />
              Faders de Volume & Medidor de Loudness (-14 LUFS)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Track 1: Voice */}
              <div className="p-3 rounded-lg bg-[#10131e] border border-[#20273c] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                    <Mic className="w-3.5 h-3.5" />
                    Trilha Voz (A1)
                  </span>
                  <span className="font-mono text-slate-200">{voiceVolume}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="150"
                  value={voiceVolume}
                  onChange={(e) => setVoiceVolume(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                />
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden flex gap-0.5">
                  <div className="h-full bg-emerald-500 rounded-l" style={{ width: `${Math.min(100, voiceVolume * 0.7)}%` }} />
                  <div className="h-full bg-yellow-500" style={{ width: `${Math.max(0, (voiceVolume - 80) * 0.4)}%` }} />
                </div>
              </div>

              {/* Track 2: Music */}
              <div className="p-3 rounded-lg bg-[#10131e] border border-[#20273c] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
                    <Music className="w-3.5 h-3.5" />
                    Trilha Música (A2)
                  </span>
                  <span className="font-mono text-slate-200">{musicVolume}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="150"
                  value={musicVolume}
                  onChange={(e) => setMusicVolume(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden flex gap-0.5">
                  <div className="h-full bg-cyan-500 rounded-l" style={{ width: `${Math.min(100, musicVolume * 0.6)}%` }} />
                </div>
              </div>

              {/* Track 3: SFX */}
              <div className="p-3 rounded-lg bg-[#10131e] border border-[#20273c] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-purple-400 font-bold">
                    <Zap className="w-3.5 h-3.5" />
                    Trilha Efeitos (SFX)
                  </span>
                  <span className="font-mono text-slate-200">{sfxVolume}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="150"
                  value={sfxVolume}
                  onChange={(e) => setSfxVolume(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-400"
                />
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden flex gap-0.5">
                  <div className="h-full bg-purple-500 rounded-l" style={{ width: `${Math.min(100, sfxVolume * 0.6)}%` }} />
                </div>
              </div>
            </div>

            {/* Target Loudness Bar */}
            <div className="p-3 rounded-xl bg-[#0f1320] border border-[#222a3e] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gauge className="w-4 h-4 text-emerald-400" />
                <div>
                  <div className="text-xs font-semibold text-white">Normalização Automática (-14 LUFS)</div>
                  <div className="text-[10px] text-slate-400">Padrão exato exigido pelo algoritmo do Instagram Reels, TikTok e YouTube</div>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold text-xs border border-emerald-500/30">
                -14.1 LUFS (Perfeito)
              </span>
            </div>
          </div>

          {/* Section 3: Vocal Clarity AI Enhancer */}
          <div className="p-3.5 rounded-xl bg-[#171c2b] border border-[#252d42] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
              <div>
                <span className="text-xs font-semibold text-white">Clareza Vocal e Remoção de Ruído de Fundo (IA)</span>
                <p className="text-[10px] text-slate-400">Isola frequências de voz humana e remove chiados de ar-condicionado e microfone.</p>
              </div>
            </div>

            <button
              onClick={() => setDuckingConfig(prev => ({ ...prev, vocalClarity: !prev.vocalClarity }))}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                duckingConfig.vocalClarity
                  ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30'
                  : 'bg-[#10131e] text-slate-400 border-[#2b344d]'
              }`}
            >
              {duckingConfig.vocalClarity ? 'Ativo (IA)' : 'Desativado'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#20273c] bg-[#161a29]">
          <button
            onClick={() => {
              setVoiceVolume(100);
              setMusicVolume(65);
              setSfxVolume(80);
              setDuckingConfig({
                enabled: true,
                reductionDb: -16,
                thresholdDb: -24,
                attackMs: 60,
                releaseMs: 450,
                normalizeLufs: -14,
                vocalClarity: true,
              });
            }}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Restaurar Padrão
          </button>

          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all"
          >
            {isSaved ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                Configurações de Áudio Aplicadas!
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                Salvar & Aplicar Mixagem
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
