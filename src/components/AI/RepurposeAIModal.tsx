import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Video, 
  Play, 
  Flame, 
  Scissors, 
  CheckCircle2, 
  ArrowRight, 
  TrendingUp, 
  Clock, 
  Instagram, 
  Film, 
  Layers,
  Zap,
  Sliders
} from 'lucide-react';
import { ProjectData } from '../../types';

interface RepurposeAIModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectData;
  onSelectClipToEdit: (clipTitle: string) => void;
}

interface GeneratedReelClip {
  id: string;
  title: string;
  hook: string;
  duration: string;
  durationSec: number;
  viralScore: number;
  reason: string;
  thumbnail: string;
  topic: string;
}

export const RepurposeAIModal: React.FC<RepurposeAIModalProps> = ({
  isOpen,
  onClose,
  project,
  onSelectClipToEdit,
}) => {
  const [sourceUrl, setSourceUrl] = useState('https://youtube.com/watch?v=podcast_audiovisual_ep42');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [hasScanned, setHasScanned] = useState(true);
  const [selectedClipId, setSelectedClipId] = useState<string>('clip-1');

  const generatedClips: GeneratedReelClip[] = [
    {
      id: 'clip-1',
      title: 'O Erro Fatal que Derruba seu Alcance no Reels',
      hook: '"Se você faz isso nos primeiros 3 segundos, o algoritmo simplesmente te ignora."',
      duration: '0:34',
      durationSec: 34,
      viralScore: 97,
      reason: 'Gancho de alta curiosidade com pico de energia vocal de 98%.',
      thumbnail: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=85',
      topic: 'Algoritmo & Retenção'
    },
    {
      id: 'clip-2',
      title: 'Como Faturar Alto Editando Vídeos Verticais',
      hook: '"Os criadores pagam até R$ 3.000 por pacote se você entregar com esse estilo..."',
      duration: '0:48',
      durationSec: 48,
      viralScore: 94,
      reason: 'Tema de dinheiro/carreira com excelente poder de compartilhamento.',
      thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=85',
      topic: 'Monetização & Clientes'
    },
    {
      id: 'clip-3',
      title: 'A Regra dos Cortes Dinâmicos a Cada 2.5 Segundos',
      hook: '"Atenção humana hoje é menor que a de um peixe dourado. Veja o que fazer."',
      duration: '0:29',
      durationSec: 29,
      viralScore: 91,
      reason: 'Ritmo acelerado com analogia marcante para reter a audiência.',
      thumbnail: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=600&auto=format&fit=crop&q=85',
      topic: 'Técnica de Edição'
    }
  ];

  const handleStartScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    setHasScanned(false);
  };

  useEffect(() => {
    let timer: any = null;
    if (isScanning && scanProgress < 100) {
      timer = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 98) {
            setIsScanning(false);
            setHasScanned(true);
            return 100;
          }
          return prev + 8;
        });
      }, 100);
    }
    return () => clearInterval(timer);
  }, [isScanning, scanProgress]);

  if (!isOpen) return null;

  const activeClip = generatedClips.find(c => c.id === selectedClipId) || generatedClips[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in select-none">
      <div className="relative w-full max-w-5xl bg-[#131724] border border-[#262e44] rounded-2xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#20273c] bg-gradient-to-r from-[#17122b] via-[#161a29] to-[#121b29]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-rose-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
              <Scissors className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-base font-['Montserrat',sans-serif]">
                  Repurpose IA: Cortes Automáticos para Instagram Reels
                </span>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/30 font-bold uppercase">
                  Long-Form ➔ 9:16
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Transforme podcasts, palestras e vídeos longos em múltiplos Reels virais com legendas e ganchos sincronizados.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#22283d] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Input Bar */}
        <div className="px-6 py-3 bg-[#0d1017] border-b border-[#1f2537] flex items-center gap-3 flex-wrap sm:flex-nowrap">
          <div className="flex-1 flex items-center bg-[#151a29] border border-[#262f45] rounded-xl px-3 py-1.5 focus-within:border-indigo-500">
            <Film className="w-4 h-4 text-slate-400 mr-2" />
            <input
              type="text"
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              placeholder="Cole o link do YouTube ou selecione um vídeo longo..."
              className="w-full bg-transparent text-xs text-slate-200 outline-none"
            />
          </div>

          <button
            onClick={handleStartScan}
            disabled={isScanning}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-indigo-600/30 disabled:opacity-50 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isScanning ? `Escaneando (${scanProgress}%)` : 'Escanear Melhores Momentos'}</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: List of Generated Reels */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300">
              <span className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-rose-400" />
                Cortes Gerados pela IA ({generatedClips.length} Reels Encontrados)
              </span>
              <span className="text-[11px] text-slate-500 font-normal">Ordenado por Potencial Viral</span>
            </div>

            <div className="space-y-3">
              {generatedClips.map((clip, index) => {
                const isSelected = selectedClipId === clip.id;
                return (
                  <div
                    key={clip.id}
                    onClick={() => setSelectedClipId(clip.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex gap-3.5 ${
                      isSelected
                        ? 'bg-indigo-950/40 border-indigo-500 ring-2 ring-indigo-500/40 shadow-xl'
                        : 'bg-[#151928] border-[#242c40] hover:bg-[#1a2033] hover:border-slate-500'
                    }`}
                  >
                    {/* Thumbnail in 9:16 Aspect */}
                    <div className="relative w-20 aspect-[9/16] rounded-xl overflow-hidden bg-black flex-shrink-0 border border-white/10 shadow-md">
                      <img
                        src={clip.thumbnail}
                        alt={clip.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-1 left-1 px-1 py-0.5 rounded bg-black/70 text-[8px] font-mono text-white">
                        {clip.duration}
                      </div>
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <div className="w-6 h-6 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center text-white">
                          <Play className="w-3 h-3 fill-white ml-0.5" />
                        </div>
                      </div>
                    </div>

                    {/* Clip Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                            #{index + 1} • {clip.topic}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[10px] font-extrabold flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            {clip.viralScore}/100
                          </span>
                        </div>

                        <h4 className="text-xs font-bold text-white leading-snug mt-1 line-clamp-2">
                          {clip.title}
                        </h4>

                        <p className="text-[11px] text-slate-400 italic mt-1 line-clamp-2">
                          {clip.hook}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-[#1f263d] mt-2">
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-400" />
                          {clip.reason}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Live Reel Preview with Safe Zones & Auto-Framing */}
          <div className="lg:col-span-5 flex flex-col items-center justify-start bg-[#0d1017] rounded-2xl border border-[#22293d] p-4 space-y-4">
            <div className="w-full flex items-center justify-between text-xs font-bold text-slate-300">
              <span className="flex items-center gap-1.5">
                <Instagram className="w-4 h-4 text-rose-400" />
                Prévia do Reel Vertical 9:16
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">Pronto para Reels</span>
            </div>

            {/* Video Box */}
            <div className="relative w-full max-w-[240px] aspect-[9/16] rounded-2xl overflow-hidden bg-black border-2 border-indigo-500/50 shadow-2xl flex items-center justify-center">
              <img
                src={activeClip.thumbnail}
                alt="Selected Clip Preview"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />

              {/* Shaded gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

              {/* Subtitle / Hook preview */}
              <div className="absolute inset-x-3 bottom-6 p-2 rounded-xl bg-black/80 backdrop-blur-md border border-white/20 text-center pointer-events-none">
                <p className="text-[11px] font-bold text-yellow-300 leading-tight">
                  {activeClip.title}
                </p>
              </div>

              {/* Play button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="w-12 h-12 rounded-full bg-indigo-600/90 text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
                  <Play className="w-5 h-5 fill-white ml-0.5" />
                </button>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="w-full grid grid-cols-2 gap-2 text-center text-[10px] text-slate-400">
              <div className="p-2 rounded-xl bg-[#141827] border border-[#23293e]">
                <span className="block text-white font-bold">{activeClip.duration}</span>
                Duração do Reel
              </div>
              <div className="p-2 rounded-xl bg-[#141827] border border-[#23293e]">
                <span className="block text-emerald-400 font-bold">{activeClip.viralScore}%</span>
                Taxa de Retenção Estimada
              </div>
            </div>

            {/* Action button */}
            <button
              onClick={() => {
                onSelectClipToEdit(activeClip.title);
                onClose();
              }}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-rose-600 hover:from-indigo-500 hover:to-rose-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition-all hover:scale-105"
            >
              <Scissors className="w-4 h-4" />
              <span>Abrir Corte na Timeline Principal</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </div>

        </div>

      </div>
    </div>
  );
};
