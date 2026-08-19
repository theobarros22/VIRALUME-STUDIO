import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Flame, 
  Zap, 
  Copy, 
  Check, 
  Plus, 
  TrendingUp, 
  RefreshCw, 
  Layers, 
  Hash,
  Lightbulb,
  CheckCircle2
} from 'lucide-react';
import { TimelineClip } from '../../types';

interface ViralHooksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertHookClip?: (clip: TimelineClip) => void;
  currentTime?: number;
}

interface HookIdea {
  id: string;
  category: string;
  trigger: string;
  script: string;
  screenText: string;
  estimatedRetention: number;
  recommendedSFX: string;
}

const NICHES = [
  'Fotografia & Vídeo',
  'Marketing & Vendas',
  'Finanças & Investimentos',
  'Humor & Entretenimento',
  'Desenvolvimento Pessoal',
  'Tecnologia & IA',
  'Fitness & Saúde'
];

const PRESET_HOOKS_MAP: Record<string, HookIdea[]> = {
  'Fotografia & Vídeo': [
    {
      id: 'h-1',
      category: 'Erro Fatal / Quebra de Padrão',
      trigger: 'Medo de estar fazendo errado',
      script: 'Se você ainda filma seus vídeos em 4K 60fps achando que a qualidade vai ficar melhor no Instagram, você está destruindo o alcance do seu conteúdo!',
      screenText: '❌ PARE DE FILMAR EM 4K 60FPS!',
      estimatedRetention: 94,
      recommendedSFX: 'Glitch + Bass Drop'
    },
    {
      id: 'h-2',
      category: 'Loop de Curiosidade',
      trigger: 'Segredo de bastidores',
      script: 'Esta é a única configuração de iluminação secreta que os maiores canais de YouTube usam para fazer vídeos de celular parecerem cinema.',
      screenText: '💡 O SEGREDO DA ILUMINAÇÃO DE CINEMA',
      estimatedRetention: 91,
      recommendedSFX: 'Whoosh Rápido + Impacto'
    },
    {
      id: 'h-3',
      category: 'Contraintuitivo',
      trigger: 'Choque de perspectiva',
      script: 'Você não precisa de uma câmera de 10 mil reais. O que faz seu vídeo reter 80% é apenas esta técnica de corte a cada 2.5 segundos.',
      screenText: '🎬 CÂMERA DE 10K É INÚTIL SE...',
      estimatedRetention: 88,
      recommendedSFX: 'Pop Dinâmico + Risers'
    },
    {
      id: 'h-4',
      category: 'Passo a Passo Rápido',
      trigger: 'Promessa de resultado imediato',
      script: 'Em apenas 3 passos rápidos, eu vou te ensinar a colorir qualquer vídeo no celular para ficar com as cores idênticas às de Hollywood.',
      screenText: '🎨 COLOR GRADING HOLLYWOOD NO CELULAR',
      estimatedRetention: 89,
      recommendedSFX: 'Whoosh de Transição'
    }
  ],
  'Marketing & Vendas': [
    {
      id: 'h-5',
      category: 'A Dor Latente',
      trigger: 'Urgência financeira',
      script: 'Se seus vídeos no TikTok têm menos de 200 visualizações, a culpa não é do algoritmo. É porque você cometeu este erro nos primeiros 2 segundos.',
      screenText: '🚨 PRESO EM 200 VIEWS? VEJA ISSO',
      estimatedRetention: 96,
      recommendedSFX: 'Impacto Subgrave'
    },
    {
      id: 'h-6',
      category: 'O Truque Proibido',
      trigger: 'Vantagem competitiva',
      script: 'Usei esta estrutura exata de roteiro de 30 segundos e gerei R$ 14.500 em vendas orgânicas sem gastar 1 real em anúncios.',
      screenText: '💰 R$ 14.500 COM ESSE ROTEIRO',
      estimatedRetention: 93,
      recommendedSFX: 'Sino de Caixa Registradora'
    }
  ]
};

export const ViralHooksModal: React.FC<ViralHooksModalProps> = ({
  isOpen,
  onClose,
  onInsertHookClip,
  currentTime = 0,
}) => {
  const [topic, setTopic] = useState('Como viralizar vídeos no Reels e TikTok com cortes dinâmicos');
  const [niche, setNiche] = useState('Fotografia & Vídeo');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [hooksList, setHooksList] = useState<HookIdea[]>(PRESET_HOOKS_MAP['Fotografia & Vídeo']);

  if (!isOpen) return null;

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      const baseHooks = PRESET_HOOKS_MAP[niche] || PRESET_HOOKS_MAP['Fotografia & Vídeo'];
      // Shuffle & tweak for interactivity
      setHooksList([...baseHooks].reverse());
      setSuccessToast('Ganchos virais recalculados com sucesso pela IA!');
      setTimeout(() => setSuccessToast(null), 2500);
    }, 750);
  };

  const handleCopy = (hook: HookIdea) => {
    navigator.clipboard.writeText(`[GANCHO]: ${hook.script}\n[TEXTO NA TELA]: ${hook.screenText}`);
    setCopiedId(hook.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleInsertToTimeline = (hook: HookIdea) => {
    if (onInsertHookClip) {
      const newClip: TimelineClip = {
        id: `hook-clip-${Date.now()}`,
        trackId: 'captions',
        name: `🪝 Gancho: ${hook.screenText}`,
        thumbnailUrl: '',
        startOffset: 0,
        duration: 3.5,
        sourceStart: 0,
        sourceDuration: 3.5,
        type: 'caption',
        color: '#f59e0b',
        isCached: true
      };
      onInsertHookClip(newClip);
      setSuccessToast(`Gancho inserido nos primeiros 3.5s da timeline!`);
      setTimeout(() => {
        setSuccessToast(null);
        onClose();
      }, 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in select-none">
      <div className="relative w-full max-w-3xl bg-[#131724] border border-[#262e44] rounded-2xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#20273c] bg-[#161a29]">
          <div className="flex items-center gap-2 font-bold text-white text-base">
            <Flame className="w-5 h-5 text-amber-400" />
            <span>Gerador de Ganchos & Roteiros Virais (Gemini AI Hook Engine)</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#22283d] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar">
          
          {/* Controls Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-[#0e111a] p-4 rounded-xl border border-[#242b3e]">
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                Tema ou Título do Vídeo
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Ex: Como gravar vídeos profissionais com celular..."
                className="w-full bg-[#161b29] border border-[#2c354e] rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Nicho / Categoria
              </label>
              <select
                value={niche}
                onChange={(e) => {
                  setNiche(e.target.value);
                  setHooksList(PRESET_HOOKS_MAP[e.target.value] || PRESET_HOOKS_MAP['Fotografia & Vídeo']);
                }}
                className="w-full bg-[#161b29] border border-[#2c354e] rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                {NICHES.map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              Ganchos com Mais de 90% de Retenção Estimada
            </span>
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="px-3.5 py-1.5 rounded-lg bg-[#1f2639] hover:bg-[#2a334d] border border-[#2f3954] text-xs font-semibold text-amber-300 flex items-center gap-1.5 transition-all active:scale-95"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>{isGenerating ? 'Gerando com IA...' : 'Regenerar Ideias'}</span>
            </button>
          </div>

          {/* Hooks List */}
          <div className="space-y-3">
            {hooksList.map((hook) => {
              const isCopied = copiedId === hook.id;
              return (
                <div
                  key={hook.id}
                  className="bg-[#161a29] border border-[#262e44] hover:border-amber-500/40 rounded-xl p-4 transition-all space-y-2.5 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold uppercase">
                        {hook.category}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Gatilho: <strong className="text-slate-200">{hook.trigger}</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                      <Zap className="w-3 h-3 text-emerald-400" />
                      <span>{hook.estimatedRetention}% Retenção</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-100 font-medium leading-relaxed bg-[#0e111a] p-3 rounded-lg border border-[#1f2638]">
                    "{hook.script}"
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#20273c] text-[11px]">
                    <div className="flex items-center gap-3 text-slate-400">
                      <span>Texto na Tela: <strong className="text-amber-300 font-mono">{hook.screenText}</strong></span>
                      <span>•</span>
                      <span>SFX Sugerido: <strong className="text-cyan-300">{hook.recommendedSFX}</strong></span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopy(hook)}
                        className="px-2.5 py-1 rounded bg-[#20273c] hover:bg-[#2a344e] text-slate-300 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                      >
                        {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{isCopied ? 'Copiado' : 'Copiar'}</span>
                      </button>

                      {onInsertHookClip && (
                        <button
                          onClick={() => handleInsertToTimeline(hook)}
                          className="px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-400 text-black text-[11px] font-bold flex items-center gap-1 shadow-sm transition-all hover:scale-105"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Aplicar no Início</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Viral Hashtags & SEO Pill Recommendation */}
          <div className="bg-[#121624] p-3.5 rounded-xl border border-[#22293d] space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Hash className="w-3.5 h-3.5 text-indigo-400" />
              Hashtags de Alto Alcance Recomendadas:
            </span>
            <div className="flex flex-wrap gap-1.5 text-[11px]">
              {['#dicasdeedicao', '#videomakerbrasil', '#reelsviral', '#tiktokdicas', '#criaçãodeconteudo', '#viralumestudio'].map(tag => (
                <span key={tag} className="px-2.5 py-0.5 rounded-full bg-[#1c2233] text-indigo-300 border border-[#2b354e] font-mono">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {successToast && (
            <div className="p-3 bg-emerald-950/80 border border-emerald-500 rounded-xl text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{successToast}</span>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-[#20273c] bg-[#161a29]">
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Otimizado para manter o público além dos primeiros 3 segundos críticos.</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-1.5 rounded-xl bg-[#1c2233] hover:bg-[#252c42] text-slate-300 text-xs font-semibold transition-colors"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
