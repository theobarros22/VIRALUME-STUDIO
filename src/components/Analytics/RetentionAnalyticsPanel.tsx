import React, { useState } from 'react';
import { 
  TrendingUp, 
  BarChart3, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowUpRight, 
  Layers, 
  Flame, 
  Zap, 
  Clock, 
  Smile, 
  Plus
} from 'lucide-react';
import { RetentionMetric, AISuggestion } from '../../types';
import { INITIAL_RETENTION_METRICS, INITIAL_AI_SUGGESTIONS } from '../../data/mockData';

interface RetentionAnalyticsPanelProps {
  onApplySuggestion?: (suggestionId: string) => void;
}

export const RetentionAnalyticsPanel: React.FC<RetentionAnalyticsPanelProps> = ({
  onApplySuggestion,
}) => {
  const [metrics] = useState<RetentionMetric[]>(INITIAL_RETENTION_METRICS);
  const [suggestions, setSuggestions] = useState<AISuggestion[]>(INITIAL_AI_SUGGESTIONS);
  const [selectedPlatform, setSelectedPlatform] = useState<'all' | 'reels' | 'tiktok' | 'shorts'>('all');
  const [appliedIds, setAppliedIds] = useState<Record<string, boolean>>({});

  const handleApply = (id: string) => {
    setAppliedIds(prev => ({ ...prev, [id]: true }));
    if (onApplySuggestion) onApplySuggestion(id);
  };

  return (
    <div className="min-h-[calc(100vh-85px)] bg-[#0d1017] text-slate-100 p-4 lg:p-8 space-y-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Title Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-500/40 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Algoritmo Preditivo Viralume
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1 font-['Montserrat',sans-serif]">
              Predição de Retenção e Engajamento por IA
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Simulação de comportamento do público baseada em mais de 500.000 vídeos virais do seu nicho.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#131724] p-1 rounded-xl border border-[#23293d]">
            {[
              { id: 'all', label: 'Consolidado' },
              { id: 'reels', label: 'Instagram Reels' },
              { id: 'tiktok', label: 'TikTok FYP' },
              { id: 'shorts', label: 'YouTube Shorts' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedPlatform(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  selectedPlatform === tab.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 1. TOP KPI METRICS (4 CARDS) matching Image 11 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-[#131724] border border-[#232a3f] p-5 rounded-2xl shadow-xl flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">Score Viral Geral</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-950/70 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <Flame className="w-4 h-4" />
              </div>
            </div>
            <div className="my-2">
              <div className="text-3xl font-black text-emerald-400 font-['Montserrat',sans-serif]">
                88<span className="text-lg text-slate-500">/100</span>
              </div>
              <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
                <ArrowUpRight className="w-3 h-3" /> Top 5% dos vídeos do nicho
              </span>
            </div>
            <div className="w-full bg-[#1e2538] h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-400 h-full w-[88%]" />
            </div>
          </div>

          <div className="bg-[#131724] border border-[#232a3f] p-5 rounded-2xl shadow-xl flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">Taxa de Conclusão Estimada</span>
              <div className="w-8 h-8 rounded-lg bg-indigo-950/70 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="my-2">
              <div className="text-3xl font-black text-white font-['Montserrat',sans-serif]">
                74.2%
              </div>
              <span className="text-[11px] text-indigo-400 font-semibold flex items-center gap-1 mt-0.5">
                +18.4% acima da média geral
              </span>
            </div>
            <div className="w-full bg-[#1e2538] h-1.5 rounded-full overflow-hidden">
              <div className="bg-indigo-500 h-full w-[74.2%]" />
            </div>
          </div>

          <div className="bg-[#131724] border border-[#232a3f] p-5 rounded-2xl shadow-xl flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">Gancho Inicial (0-3s)</span>
              <div className="w-8 h-8 rounded-lg bg-cyan-950/70 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
                <Zap className="w-4 h-4" />
              </div>
            </div>
            <div className="my-2">
              <div className="text-3xl font-black text-cyan-400 font-['Montserrat',sans-serif]">
                94%
              </div>
              <span className="text-[11px] text-cyan-400 font-semibold flex items-center gap-1 mt-0.5">
                Excelente poder de parada no feed
              </span>
            </div>
            <div className="w-full bg-[#1e2538] h-1.5 rounded-full overflow-hidden">
              <div className="bg-cyan-400 h-full w-[94%]" />
            </div>
          </div>

          <div className="bg-[#131724] border border-[#232a3f] p-5 rounded-2xl shadow-xl flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">Ponto Crítico de Queda</span>
              <div className="w-8 h-8 rounded-lg bg-amber-950/70 text-amber-400 flex items-center justify-center border border-amber-500/30">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="my-2">
              <div className="text-3xl font-black text-amber-400 font-['Montserrat',sans-serif]">
                00:45s
              </div>
              <span className="text-[11px] text-amber-400 font-semibold flex items-center gap-1 mt-0.5">
                Risco de perda de 12% da audiência
              </span>
            </div>
            <div className="w-full bg-[#1e2538] h-1.5 rounded-full overflow-hidden">
              <div className="bg-amber-400 h-full w-[45%]" />
            </div>
          </div>

        </div>

        {/* 2. INTERACTIVE RETENTION LINE GRAPH (Image 11) */}
        <div className="bg-[#131724] border border-[#23293c] rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1f2537] pb-3">
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-indigo-400" />
                <span>Curva de Retenção Prevista ao Longo da Timeline</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Passando o mouse para inspecionar pontos chave da narrativa.
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Zona de Alta Retenção (&gt;80%)
              </span>
              <span className="flex items-center gap-1.5 text-amber-400 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Zona de Atenção (Queda)
              </span>
            </div>
          </div>

          {/* SVG Line Graph */}
          <div className="relative h-64 w-full bg-[#0e111a] rounded-xl p-4 border border-[#20273a] flex flex-col justify-between">
            {/* Horizontal Grid lines */}
            <div className="absolute inset-x-4 top-8 border-b border-slate-800/60 flex justify-between text-[10px] text-slate-600">
              <span>100%</span>
            </div>
            <div className="absolute inset-x-4 top-24 border-b border-slate-800/60 flex justify-between text-[10px] text-slate-600">
              <span>75%</span>
            </div>
            <div className="absolute inset-x-4 top-40 border-b border-slate-800/60 flex justify-between text-[10px] text-slate-600">
              <span>50%</span>
            </div>

            {/* Retention Curve Path */}
            <svg className="w-full h-44 overflow-visible z-10" viewBox="0 0 1000 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="retentionGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              
              {/* Fill area below curve */}
              <path
                d="M 0 10 Q 150 25, 300 45 T 450 110 T 600 70 T 750 65 T 900 80 L 1000 95 L 1000 200 L 0 200 Z"
                fill="url(#retentionGrad)"
              />

              {/* Main Line */}
              <path
                d="M 0 10 Q 150 25, 300 45 T 450 110 T 600 70 T 750 65 T 900 80 L 1000 95"
                fill="none"
                stroke="#6366f1"
                strokeWidth="3.5"
              />

              {/* Point 1: Hook (00:03s) */}
              <circle cx="50" cy="15" r="5" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
              
              {/* Point 2: Drop Warning (00:45s) */}
              <circle cx="450" cy="110" r="6" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />

              {/* Point 3: Climax (01:15s) */}
              <circle cx="750" cy="65" r="5" fill="#06b6d4" stroke="#ffffff" strokeWidth="2" />
            </svg>

            {/* Callout Pins */}
            <div className="absolute left-[42%] top-8 bg-amber-950/90 border border-amber-500/50 px-2.5 py-1.5 rounded-lg shadow-xl text-[10px] text-amber-200 z-20 animate-pulse pointer-events-none">
              <span className="font-bold">⚠️ 00:45s: Queda Brusca</span>
              <span className="block text-slate-400 text-[9px]">Monotonia visual (sem B-roll)</span>
            </div>

            <div className="absolute left-[5%] top-2 bg-emerald-950/90 border border-emerald-500/50 px-2.5 py-1 rounded-lg text-[10px] text-emerald-200 z-20 pointer-events-none">
              <span className="font-bold">⚡ 00:03s: Hook 94%</span>
            </div>

            {/* X-Axis Time Markers */}
            <div className="flex justify-between text-[10px] font-mono text-slate-500 border-t border-slate-800 pt-2">
              <span>00:00 (Início)</span>
              <span>00:15</span>
              <span>00:30</span>
              <span className="text-amber-400 font-bold">00:45 (Atenção)</span>
              <span>01:00</span>
              <span>01:15</span>
              <span>01:30</span>
              <span>01:45</span>
              <span>02:00 (Fim)</span>
            </div>
          </div>
        </div>

        {/* 3. IA SUGESTÕES DE OTIMIZAÇÃO (Actionable Recommendations) */}
        <div className="bg-[#131724] border border-[#23293c] rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#1f2537] pb-3">
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Sugestões Automáticas para Recuperar +14% de Retenção</span>
            </div>
            <span className="text-xs text-indigo-400 font-semibold">4 Ações Prontas</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {suggestions.map((sug) => {
              const isApplied = appliedIds[sug.id];
              return (
                <div
                  key={sug.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col justify-between space-y-3 ${
                    isApplied
                      ? 'bg-emerald-950/20 border-emerald-500/40'
                      : 'bg-[#171c2b] border-[#252d42] hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-black/50 text-indigo-300 font-bold border border-indigo-500/20">
                          {sug.timestamp}
                        </span>
                        <span className="text-xs font-bold text-slate-100">{sug.title}</span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {sug.description}
                      </p>
                    </div>

                    <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30 whitespace-nowrap">
                      {sug.impact}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#1f2638]">
                    <span className="text-[10px] text-slate-500 capitalize">
                      Tipo: {sug.type}
                    </span>
                    <button
                      onClick={() => handleApply(sug.id)}
                      disabled={isApplied}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        isApplied
                          ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 cursor-default'
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20'
                      }`}
                    >
                      {isApplied ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Aplicado na Timeline</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>{sug.actionLabel}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
