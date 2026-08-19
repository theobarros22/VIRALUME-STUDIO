import React, { useState } from 'react';
import { 
  X, 
  Instagram, 
  Sparkles, 
  Copy, 
  Check, 
  Hash, 
  MessageSquare, 
  Share2, 
  Bookmark, 
  Heart,
  TrendingUp,
  Flame,
  Lightbulb,
  FileText,
  Target
} from 'lucide-react';
import { ProjectData } from '../../types';

interface InstagramCopyStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectData;
}

export const InstagramCopyStudioModal: React.FC<InstagramCopyStudioModalProps> = ({
  isOpen,
  onClose,
  project,
}) => {
  const [selectedObjective, setSelectedObjective] = useState<'comments' | 'shares' | 'saves' | 'leads'>('comments');
  const [copied, setCopied] = useState(false);
  const [headline, setHeadline] = useState('O SEGREDO QUE NINGUÉM TE CONTA SOBRE EDIÇÃO DE REELS 👇');
  const [bodyText, setBodyText] = useState(
    'Se você ainda edita vídeos do mesmo jeito de 2 anos atrás, o algoritmo do Instagram simplesmente não vai entregar seus posts.\n\n' +
    'Aqui estão os 3 pilares que usamos neste projeto:\n\n' +
    '1️⃣ Gancho nos primeiros 2.5s (Corte de Silêncio Radical)\n' +
    '2️⃣ Legendas dinâmicas com destaque de palavras-chave\n' +
    '3️⃣ Trilha sonora calibrada em -14 LUFS com Auto-Ducking\n\n' +
    'Quer ter acesso a todos esses presets prontos?'
  );
  const [ctaText, setCtaText] = useState('💬 Comente "VIRAL" aqui embaixo que eu te envio o guia completo no Direct!');
  const [selectedHashtagGroup, setSelectedHashtagGroup] = useState<string[]>(['#reelsbrasil', '#marketingdigital', '#edicaodevideo', '#conteudoviral', '#criadoresdeconteudo', '#instagramparaempresas']);

  if (!isOpen) return null;

  const hashtagPresets: { name: string; tags: string[] }[] = [
    {
      name: 'Alta Entrega Reels 2026',
      tags: ['#reelsbrasil', '#reelsviral', '#dicasdeinstagram', '#criacaodeconteudo', '#estrategiadigital']
    },
    {
      name: 'Edição & Audiovisual',
      tags: ['#edicaodevideo', '#videomaker', '#viralumestudio', '#premierepro', '#motiondesign', '#cinematic']
    },
    {
      name: 'Engajamento & Negócios',
      tags: ['#marketingdigitalbrasil', '#instagramparanegocios', '#socialmediamarketing', '#vendasonline']
    }
  ];

  const fullCaption = `${headline}\n\n${bodyText}\n\n${ctaText}\n\n.\n.\n.\n${selectedHashtagGroup.join(' ')}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullCaption);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in select-none">
      <div className="relative w-full max-w-4xl bg-[#131724] border border-[#262e44] rounded-2xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#20273c] bg-gradient-to-r from-[#1d122b] via-[#1a142e] to-[#141828]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-rose-500/20">
              <Instagram className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-base font-['Montserrat',sans-serif]">
                  Gerador de Legenda & Copy IA para Instagram Reels
                </span>
                <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full border border-rose-500/30 font-bold uppercase">
                  Foco: Instagram
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Otimizado para o algoritmo do Instagram: retenção no feed, quebras de linha automáticas e CTAs de conversão.
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

        {/* 2-Column Content */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Configuration Controls */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Objective Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Target className="w-4 h-4 text-rose-400" />
                Objetivo do Reel no Instagram
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'comments', label: 'Comentários', icon: MessageSquare },
                  { id: 'saves', label: 'Salvamentos', icon: Bookmark },
                  { id: 'shares', label: 'Compartilhar', icon: Share2 },
                  { id: 'leads', label: 'Direct / DM', icon: Flame },
                ].map((obj) => {
                  const Icon = obj.icon;
                  const isSel = selectedObjective === obj.id;
                  return (
                    <button
                      key={obj.id}
                      onClick={() => {
                        setSelectedObjective(obj.id as any);
                        if (obj.id === 'saves') {
                          setCtaText('💾 Salve este post para consultar quando for editar o seu próximo Reels!');
                        } else if (obj.id === 'shares') {
                          setCtaText('🚀 Envie este vídeo para aquele amigo videomaker que precisa ver isso!');
                        } else if (obj.id === 'leads') {
                          setCtaText('📩 Mande uma mensagem no meu Direct com a palavra "VIRAL" para receber o material!');
                        } else {
                          setCtaText('💬 Comente "VIRAL" aqui embaixo que eu te envio o guia completo no Direct!');
                        }
                      }}
                      className={`p-2 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 border transition-all ${
                        isSel
                          ? 'bg-rose-950/60 border-rose-500 text-rose-200 shadow-md shadow-rose-500/10'
                          : 'bg-[#161a29] border-[#252c42] text-slate-400 hover:bg-[#1f2538]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{obj.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Headline / Hook */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-400" />
                Gancho Principal (Primeira Linha Visível no Feed)
              </label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full px-3 py-2 bg-[#0e111a] border border-[#2b344d] rounded-lg text-xs font-bold text-white outline-none focus:border-rose-500"
              />
            </div>

            {/* Body Text */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-indigo-400" />
                Corpo da Legenda com Quebras Limpas
              </label>
              <textarea
                rows={5}
                value={bodyText}
                onChange={(e) => setBodyText(e.target.value)}
                className="w-full px-3 py-2 bg-[#0e111a] border border-[#2b344d] rounded-lg text-xs text-slate-200 outline-none focus:border-rose-500 resize-none font-sans leading-relaxed"
              />
            </div>

            {/* Call to Action */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                Chamada para Ação (CTA de Alta Conversão)
              </label>
              <input
                type="text"
                value={ctaText}
                onChange={(e) => setCtaText(e.target.value)}
                className="w-full px-3 py-2 bg-[#0e111a] border border-[#2b344d] rounded-lg text-xs font-medium text-emerald-300 outline-none focus:border-emerald-500"
              />
            </div>

            {/* Hashtag Presets */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Hash className="w-4 h-4 text-purple-400" />
                Bancos de Hashtags Otimizadas para Instagram
              </label>
              <div className="flex flex-wrap gap-2">
                {hashtagPresets.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => setSelectedHashtagGroup(preset.tags)}
                    className="px-2.5 py-1 rounded-lg bg-[#181d2c] hover:bg-[#22283c] text-slate-300 border border-[#262c3e] text-[11px] font-medium transition-colors"
                  >
                    + {preset.name} ({preset.tags.length})
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Live Instagram Mobile Mockup Preview */}
          <div className="lg:col-span-5 flex flex-col items-center justify-start bg-[#0d1017] rounded-xl border border-[#22293d] p-4 space-y-3">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Instagram className="w-3.5 h-3.5 text-rose-400" />
              Preview no App do Instagram
            </div>

            {/* Instagram Post Card Mockup */}
            <div className="w-full max-w-[320px] bg-black border border-neutral-800 rounded-2xl p-3 shadow-2xl text-white space-y-2.5 font-sans">
              
              {/* Profile Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-[1.5px]">
                    <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-[10px] font-bold">
                      V
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-bold leading-tight">viralume.studio</div>
                    <div className="text-[9px] text-neutral-400">Áudio Original</div>
                  </div>
                </div>
                <button className="px-2 py-0.5 rounded-md bg-rose-600 text-[10px] font-bold">
                  Seguir
                </button>
              </div>

              {/* Video Thumbnail Box in 9:16 Aspect */}
              <div className="relative aspect-[9/16] max-h-[220px] w-full rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                <img
                  src={project.thumbnail}
                  alt="Reel Cover"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/60 text-[9px] font-mono text-white flex items-center gap-1">
                  <Instagram className="w-2.5 h-2.5 text-rose-400" /> Reels
                </div>
              </div>

              {/* Interactions Bar */}
              <div className="flex items-center justify-between text-neutral-200 pt-1">
                <div className="flex items-center gap-3">
                  <Heart className="w-4 h-4 hover:text-rose-500 cursor-pointer" />
                  <MessageSquare className="w-4 h-4 hover:text-blue-400 cursor-pointer" />
                  <Share2 className="w-4 h-4 hover:text-emerald-400 cursor-pointer" />
                </div>
                <Bookmark className="w-4 h-4 hover:text-amber-400 cursor-pointer" />
              </div>

              {/* Caption Preview formatted */}
              <div className="text-[11px] leading-relaxed text-neutral-200 max-h-[140px] overflow-y-auto no-scrollbar space-y-1 bg-neutral-950/80 p-2 rounded-lg border border-neutral-800/80">
                <div className="font-bold text-white">{headline}</div>
                <div className="text-neutral-300 whitespace-pre-line text-[10px]">{bodyText}</div>
                <div className="text-emerald-400 font-semibold text-[10px]">{ctaText}</div>
                <div className="text-blue-400 text-[9px] break-words pt-1">{selectedHashtagGroup.join(' ')}</div>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="w-full grid grid-cols-2 gap-2 text-center text-[10px] text-slate-400">
              <div className="p-2 rounded-lg bg-[#141827] border border-[#23293e]">
                <span className="block text-slate-200 font-bold">~ 18 seg</span>
                Tempo Estimado de Leitura
              </div>
              <div className="p-2 rounded-lg bg-[#141827] border border-[#23293e]">
                <span className="block text-emerald-400 font-bold">98/100</span>
                Pontuação de Engajamento
              </div>
            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#20273c] bg-[#161a29]">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <Instagram className="w-4 h-4 text-rose-400" />
            <span>Formatado sem caracteres invisíveis para evitar bugs no Instagram</span>
          </div>

          <button
            onClick={handleCopy}
            className="px-6 py-2 rounded-xl bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-rose-600/30 transition-all hover:scale-105 active:scale-95"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                Copiado com Sucesso!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copiar Legenda Formatada para Instagram
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
