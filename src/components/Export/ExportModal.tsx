import React, { useState, useEffect } from 'react';
import { 
  X, 
  Download, 
  Share2, 
  Smartphone, 
  Tv, 
  CheckCircle2, 
  Sparkles, 
  Cpu, 
  Zap, 
  Layers, 
  Film, 
  ArrowRight,
  HardDrive,
  Calendar,
  Check
} from 'lucide-react';
import { ExportPreset } from '../../types';
import { EXPORT_PRESETS } from '../../data/mockData';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('exp-1');
  const [useHardwareAccel, setUseHardwareAccel] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [directPublish, setDirectPublish] = useState({
    instagram: false,
    tiktok: false,
    schedule: false,
  });

  const selectedPreset = EXPORT_PRESETS.find(p => p.id === selectedPresetId) || EXPORT_PRESETS[0];

  // Render export progress simulation
  useEffect(() => {
    let interval: any = null;
    if (isExporting && progress < 100) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 98) {
            setIsExporting(false);
            setIsCompleted(true);
            return 100;
          }
          return prev + 6;
        });
      }, 120);
    }
    return () => clearInterval(interval);
  }, [isExporting, progress]);

  if (!isOpen) return null;

  const handleStartExport = () => {
    setIsExporting(true);
    setProgress(0);
    setIsCompleted(false);
  };

  const handleDownload = () => {
    // Generate simulated download file
    const element = document.createElement('a');
    const file = new Blob(['Viralume Studio Render Output - 1080x1920 H.264'], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${selectedPreset.name.replace(/\s+/g, '_')}_Final_Render.mp4`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in select-none">
      <div className="relative w-full max-w-2xl bg-[#131724] border border-[#262e44] rounded-2xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#20273c] bg-[#161a29]">
          <div className="flex items-center gap-2 font-bold text-white text-base">
            <Download className="w-5 h-5 text-indigo-400" />
            <span>Exportar Projeto & Renderização Viralume</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#22283d] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
          
          {/* 1. PRESET SELECTOR (Instagram, TikTok, YouTube, 4K) */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              1. Selecione o Preset de Exportação
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {EXPORT_PRESETS.map((preset) => {
                const isSelected = selectedPresetId === preset.id;
                return (
                  <div
                    key={preset.id}
                    onClick={() => setSelectedPresetId(preset.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-indigo-950/40 border-indigo-500 ring-2 ring-indigo-500/40 shadow-lg'
                        : 'bg-[#181d2c] border-[#252c3f] hover:border-slate-500'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-white">{preset.name}</span>
                      {isSelected ? (
                        <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-600" />
                      )}
                    </div>
                    <div className="mt-2 text-xs text-slate-400 space-y-0.5">
                      <div className="flex justify-between">
                        <span>Resolução:</span>
                        <span className="font-mono text-slate-200">{preset.resolution}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Codec & FPS:</span>
                        <span className="font-mono text-slate-200">{preset.codec} • {preset.fps} FPS</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Bitrate:</span>
                        <span className="font-mono text-slate-200">{preset.bitrate}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. HARDWARE ACCELERATION & EXPORT SETTINGS */}
          <div className="space-y-3 bg-[#171c2b] p-4 rounded-xl border border-[#252d42]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-slate-200">Aceleração por GPU (NVIDIA NVENC / Apple Silicon)</span>
              </div>
              <input
                type="checkbox"
                checked={useHardwareAccel}
                onChange={(e) => setUseHardwareAccel(e.target.checked)}
                className="w-4 h-4 accent-indigo-500 rounded cursor-pointer"
              />
            </div>
            <p className="text-[11px] text-slate-400">
              Reduz o tempo de renderização em até 4.5x utilizando os núcleos dedicados de codificação da sua placa de vídeo.
            </p>
          </div>

          {/* 3. DIRECT SOCIAL PUBLISH */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              2. Publicação e Agendamento Direto
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label className="flex items-center gap-2.5 p-3 rounded-xl bg-[#181d2c] border border-[#252c3f] cursor-pointer hover:bg-[#1e2538] transition-colors">
                <input
                  type="checkbox"
                  checked={directPublish.instagram}
                  onChange={(e) => setDirectPublish(p => ({ ...p, instagram: e.target.checked }))}
                  className="w-4 h-4 accent-indigo-500 rounded"
                />
                <span className="text-xs font-medium text-slate-200">Instagram Reels</span>
              </label>

              <label className="flex items-center gap-2.5 p-3 rounded-xl bg-[#181d2c] border border-[#252c3f] cursor-pointer hover:bg-[#1e2538] transition-colors">
                <input
                  type="checkbox"
                  checked={directPublish.tiktok}
                  onChange={(e) => setDirectPublish(p => ({ ...p, tiktok: e.target.checked }))}
                  className="w-4 h-4 accent-indigo-500 rounded"
                />
                <span className="text-xs font-medium text-slate-200">TikTok FYP</span>
              </label>

              <label className="flex items-center gap-2.5 p-3 rounded-xl bg-[#181d2c] border border-[#252c3f] cursor-pointer hover:bg-[#1e2538] transition-colors">
                <input
                  type="checkbox"
                  checked={directPublish.schedule}
                  onChange={(e) => setDirectPublish(p => ({ ...p, schedule: e.target.checked }))}
                  className="w-4 h-4 accent-indigo-500 rounded"
                />
                <span className="text-xs font-medium text-slate-200">Agendar Melhor Horário</span>
              </label>
            </div>
          </div>

          {/* RENDER PROGRESS BAR */}
          {(isExporting || isCompleted) && (
            <div className="space-y-2 bg-[#0e111a] p-4 rounded-xl border border-indigo-500/40 animate-in fade-in">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-indigo-300">
                  {isCompleted ? '✓ Renderização Concluída!' : 'Codificando Vídeo com Aceleração NVENC...'}
                </span>
                <span className="font-mono text-white">{progress}%</span>
              </div>
              <div className="w-full bg-[#1e2438] h-2.5 rounded-full overflow-hidden">
                <div 
                  style={{ width: `${progress}%` }} 
                  className={`h-full transition-all duration-150 ${
                    isCompleted ? 'bg-emerald-400' : 'bg-gradient-to-r from-indigo-500 to-cyan-400'
                  }`} 
                />
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <span>Quadro {Math.floor((progress / 100) * 3600)} / 3.600</span>
                <span>GPU FPS: 84 • 1080p60</span>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#20273c] bg-[#161a29]">
          <div className="text-xs text-slate-400">
            Tamanho Estimado: <span className="font-mono text-slate-200 font-bold">{selectedPreset.estimatedSizeMb} MB</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#1c2233] hover:bg-[#252c42] text-slate-300 text-xs font-semibold transition-colors"
            >
              Fechar
            </button>

            {isCompleted ? (
              <button
                onClick={handleDownload}
                className="px-6 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold shadow-lg shadow-emerald-500/25 flex items-center gap-2 transition-all hover:scale-105"
              >
                <Download className="w-4 h-4 text-black" />
                <span>Baixar Vídeo Renderizado (.mp4)</span>
              </button>
            ) : (
              <button
                onClick={handleStartExport}
                disabled={isExporting}
                className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all hover:scale-105 disabled:opacity-50"
              >
                <Zap className="w-4 h-4" />
                <span>{isExporting ? 'Renderizando...' : 'Iniciar Exportação'}</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
