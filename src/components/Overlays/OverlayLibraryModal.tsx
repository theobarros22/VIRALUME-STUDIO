import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Layers, 
  Play, 
  Plus, 
  Search, 
  Smile, 
  Film, 
  Flame, 
  Zap, 
  CheckCircle2,
  Tv
} from 'lucide-react';
import { TimelineClip } from '../../types';

interface OverlayItem {
  id: string;
  name: string;
  category: 'memes' | 'stickers' | 'broll' | 'effects';
  thumbnailUrl: string;
  previewGif?: string;
  duration: number;
  tags: string[];
  color: string;
}

const OVERLAY_ITEMS: OverlayItem[] = [
  // Memes & Reactions
  {
    id: 'ov-meme-1',
    name: 'Gato Dançante (Vibing Cat)',
    category: 'memes',
    thumbnailUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&auto=format&fit=crop&q=80',
    duration: 3.0,
    tags: ['humor', 'música', 'meme', 'gato'],
    color: '#ec4899'
  },
  {
    id: 'ov-meme-2',
    name: 'Mind Blown (Explosão Mental)',
    category: 'memes',
    thumbnailUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=400&auto=format&fit=crop&q=80',
    duration: 2.5,
    tags: ['surpresa', 'choque', 'revelação'],
    color: '#8b5cf6'
  },
  {
    id: 'ov-meme-3',
    name: 'Confused / Procurando Respostas',
    category: 'memes',
    thumbnailUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    duration: 3.5,
    tags: ['dúvida', 'meme', 'reação'],
    color: '#f59e0b'
  },

  // Stickers 3D & CTA
  {
    id: 'ov-stk-1',
    name: '🔥 Fogo 3D em Alta Temperatura',
    category: 'stickers',
    thumbnailUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&auto=format&fit=crop&q=80',
    duration: 2.0,
    tags: ['hype', 'fogo', 'viral', 'sticker'],
    color: '#ef4444'
  },
  {
    id: 'ov-stk-2',
    name: '💸 Chuva de Dinheiro / Lucro',
    category: 'stickers',
    thumbnailUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&auto=format&fit=crop&q=80',
    duration: 3.0,
    tags: ['vendas', 'finanças', 'dólar', 'sucesso'],
    color: '#10b981'
  },
  {
    id: 'ov-stk-3',
    name: '🔔 Botão Seguir & Ativar Notificações',
    category: 'stickers',
    thumbnailUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&auto=format&fit=crop&q=80',
    duration: 3.5,
    tags: ['cta', 'seguir', 'inscrição', 'engajamento'],
    color: '#3b82f6'
  },

  // B-Rolls
  {
    id: 'ov-broll-1',
    name: 'Teclado Mecânico Rápido (Produtividade)',
    category: 'broll',
    thumbnailUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&auto=format&fit=crop&q=80',
    duration: 4.0,
    tags: ['trabalho', 'código', 'tecnologia', 'broll'],
    color: '#06b6d4'
  },
  {
    id: 'ov-broll-2',
    name: 'Gráfico de Vendas Subindo em Alta',
    category: 'broll',
    thumbnailUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&auto=format&fit=crop&q=80',
    duration: 3.0,
    tags: ['investimento', 'gráfico', 'crescimento'],
    color: '#10b981'
  },
  {
    id: 'ov-broll-3',
    name: 'Time-lapse Cidade à Noite',
    category: 'broll',
    thumbnailUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=400&auto=format&fit=crop&q=80',
    duration: 4.5,
    tags: ['cinematográfico', 'luzes', 'urbano'],
    color: '#6366f1'
  },

  // Effects
  {
    id: 'ov-eff-1',
    name: 'Glitch Cibernético RGB',
    category: 'effects',
    thumbnailUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&auto=format&fit=crop&q=80',
    duration: 1.5,
    tags: ['transição', 'glitch', 'efeito'],
    color: '#ec4899'
  },
  {
    id: 'ov-eff-2',
    name: 'Chuva de Confetes Dourados',
    category: 'effects',
    thumbnailUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&auto=format&fit=crop&q=80',
    duration: 3.0,
    tags: ['comemoração', 'festa', 'confete'],
    color: '#eab308'
  }
];

interface OverlayLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddOverlayClip: (clip: TimelineClip) => void;
  currentTime: number;
}

export const OverlayLibraryModal: React.FC<OverlayLibraryModalProps> = ({
  isOpen,
  onClose,
  onAddOverlayClip,
  currentTime,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'memes' | 'stickers' | 'broll' | 'effects'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredItems = OVERLAY_ITEMS.filter(item => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const handleAddToTimeline = (item: OverlayItem) => {
    const newClip: TimelineClip = {
      id: `overlay-${Date.now()}`,
      trackId: 'overlay',
      name: `${item.name}`,
      thumbnailUrl: item.thumbnailUrl,
      startOffset: currentTime,
      duration: item.duration,
      sourceStart: 0,
      sourceDuration: item.duration,
      type: 'overlay',
      color: item.color,
      isCached: true
    };
    onAddOverlayClip(newClip);
    setSuccessToast(`"${item.name}" adicionado à trilha de sobreposição!`);
    setTimeout(() => setSuccessToast(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in select-none">
      <div className="relative w-full max-w-3xl bg-[#131724] border border-[#262e44] rounded-2xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#20273c] bg-[#161a29]">
          <div className="flex items-center gap-2 font-bold text-white text-base">
            <Layers className="w-5 h-5 text-indigo-400" />
            <span>Biblioteca de B-Rolls, Memes & Stickers (Overlays 9:16)</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#22283d] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="p-6 pb-2 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar memes, stickers 3D, b-rolls e efeitos..."
              className="w-full bg-[#0d1019] border border-[#232a3f] rounded-xl pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 text-xs">
            {[
              { id: 'all', label: 'Todos os Recursos' },
              { id: 'memes', label: '😂 Memes & Reações' },
              { id: 'stickers', label: '✨ Stickers 3D & CTA' },
              { id: 'broll', label: '🎬 B-Rolls de Apoio' },
              { id: 'effects', label: '⚡ Efeitos Visuais' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === tab.id
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-[#181d2a] text-slate-400 hover:text-slate-200 border border-[#23293c]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid of Items */}
        <div className="p-6 pt-2 overflow-y-auto custom-scrollbar flex-1">
          {successToast && (
            <div className="mb-4 p-3 bg-emerald-950/80 border border-emerald-500 rounded-xl text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{successToast}</span>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
            {filteredItems.map(item => (
              <div
                key={item.id}
                className="bg-[#171c2b] border border-[#262f44] hover:border-indigo-500/50 rounded-xl overflow-hidden group flex flex-col justify-between transition-all hover:shadow-lg"
              >
                <div className="relative aspect-video bg-black/40 overflow-hidden">
                  <img
                    src={item.thumbnailUrl}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/70 text-[10px] font-mono text-slate-200">
                    {item.duration}s
                  </div>
                </div>

                <div className="p-2.5 space-y-2">
                  <span className="text-xs font-semibold text-slate-200 block truncate" title={item.name}>
                    {item.name}
                  </span>

                  <button
                    onClick={() => handleAddToTimeline(item)}
                    className="w-full py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600 text-indigo-200 hover:text-white border border-indigo-500/40 text-[11px] font-bold flex items-center justify-center gap-1 transition-all active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Inserir na Timeline</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-[#20273c] bg-[#161a29]">
          <span className="text-[11px] text-slate-400">
            Adiciona automaticamente na faixa <strong className="text-indigo-400">Overlay 1</strong> no cursor atual.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-1.5 rounded-xl bg-[#1c2233] hover:bg-[#252c42] text-slate-300 text-xs font-semibold transition-colors"
          >
            Concluir
          </button>
        </div>

      </div>
    </div>
  );
};
