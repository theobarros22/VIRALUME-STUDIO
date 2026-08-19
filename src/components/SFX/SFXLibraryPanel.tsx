import React, { useState } from 'react';
import { 
  Music, 
  Search, 
  Folder, 
  Play, 
  Pause, 
  Star, 
  Download, 
  Plus, 
  Volume2, 
  Sliders, 
  Sparkles,
  Layers,
  CheckCircle2
} from 'lucide-react';
import { SoundItem } from '../../types';
import { SFX_ITEMS } from '../../data/mockData';

interface SFXLibraryPanelProps {
  onAddToTimeline?: (item: SoundItem) => void;
}

export const SFXLibraryPanel: React.FC<SFXLibraryPanelProps> = ({ onAddToTimeline }) => {
  const [items, setItems] = useState<SoundItem[]>(SFX_ITEMS);
  const [selectedFolder, setSelectedFolder] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const folders = ['Todos', 'Transições', 'Impactos', 'Natureza', 'Fundo Musical'];

  const filteredItems = items.filter(item => {
    const matchesFolder = selectedFolder === 'Todos' || item.folder === selectedFolder;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFolder && matchesSearch;
  });

  const togglePlay = (id: string) => {
    if (playingId === id) {
      setPlayingId(null);
    } else {
      setPlayingId(id);
    }
  };

  const toggleFavorite = (id: string) => {
    setItems(prev => prev.map(item => {
      if (item.id !== id) return item;
      return { ...item, isFavorite: !item.isFavorite };
    }));
  };

  const handleAdd = (item: SoundItem) => {
    if (onAddToTimeline) onAddToTimeline(item);
    setToast(`"${item.name}" adicionado à trilha de áudio da timeline!`);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="min-h-[calc(100vh-85px)] bg-[#0d1017] text-slate-100 p-4 lg:p-8 space-y-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Title */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                <Music className="w-3 h-3" />
                Áudio de Alta Fidelidade (Waveforms Sem Perdas)
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1 font-['Montserrat',sans-serif]">
              Biblioteca SFX e Gerenciador de Sons
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Mais de 2.000 efeitos sonoros e trilhas lo-fi organizadas por categorias e tags de energia.
            </p>
          </div>

          {toast && (
            <div className="text-xs font-semibold text-emerald-400 bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-500/30 flex items-center gap-1.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4" />
              <span>{toast}</span>
            </div>
          )}
        </div>

        {/* 2-Column Audio Layout matching Image 12 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Folders & Filters */}
          <div className="lg:col-span-4 bg-[#131724] border border-[#23293c] rounded-2xl p-5 shadow-xl space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Busca de Efeitos
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar 'Whoosh', 'Explosão'..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#0e111a] border border-[#262e42] rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Categorias / Pastas
              </label>
              <div className="space-y-1">
                {folders.map(f => {
                  const isSelected = selectedFolder === f;
                  const count = f === 'Todos' ? items.length : items.filter(i => i.folder === f).length;
                  return (
                    <button
                      key={f}
                      onClick={() => setSelectedFolder(f)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                        isSelected
                          ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/40 shadow-sm font-semibold'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-[#181d2c]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Folder className={`w-3.5 h-3.5 ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`} />
                        <span>{f}</span>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/40 text-slate-400 font-mono">
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Audio Equalizer Info matching Image 12 */}
            <div className="p-4 bg-[#0e111a] rounded-xl border border-[#22293d] space-y-2 text-xs text-slate-400">
              <span className="font-bold text-slate-200 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                Normalização Automática (LUFS)
              </span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Todos os efeitos são pré-nivelados em -14 LUFS para não estourarem no Reels ou TikTok.
              </p>
            </div>
          </div>

          {/* Right Column: Audio Items List with Waveforms matching Image 12 */}
          <div className="lg:col-span-8 bg-[#131724] border border-[#23293c] rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#1f2537] pb-3">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                Trilhas Disponíveis ({filteredItems.length})
              </span>
              <span className="text-[11px] text-slate-400">
                Pré-escuta com waveform interativa
              </span>
            </div>

            <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
              {filteredItems.map(item => {
                const isPlaying = playingId === item.id;
                return (
                  <div
                    key={item.id}
                    className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row items-center justify-between gap-3 ${
                      isPlaying
                        ? 'bg-cyan-950/30 border-cyan-500/50 shadow-md ring-1 ring-cyan-500/30'
                        : 'bg-[#181d2c] border-[#252c3e] hover:border-slate-500'
                    }`}
                  >
                    {/* Left: Play button, Star, Title */}
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <button
                        onClick={() => togglePlay(item.id)}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                          isPlaying
                            ? 'bg-cyan-400 text-black shadow-lg shadow-cyan-400/30 scale-105'
                            : 'bg-[#20273a] hover:bg-cyan-600 hover:text-white text-slate-300'
                        }`}
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                      </button>

                      <button
                        onClick={() => toggleFavorite(item.id)}
                        className="text-slate-500 hover:text-amber-400 transition-colors"
                      >
                        <Star className={`w-4 h-4 ${item.isFavorite ? 'text-amber-400 fill-amber-400' : ''}`} />
                      </button>

                      <div>
                        <div className="text-xs font-bold text-slate-100 flex items-center gap-2">
                          <span>{item.name}</span>
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-black/50 text-cyan-300 border border-cyan-500/20">
                            {item.format}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                          <span>{item.folder}</span>
                          <span>•</span>
                          <span className="font-mono">{item.duration}</span>
                          <span>•</span>
                          <span className="font-mono text-slate-500">{item.sampleRate}</span>
                        </div>
                      </div>
                    </div>

                    {/* Center: Waveform Bars Simulation */}
                    <div className="flex items-center gap-1 w-full sm:w-48 h-8 px-2 bg-[#0e111a] rounded-lg border border-[#202738] overflow-hidden">
                      {item.waveformData.map((val, idx) => (
                        <div
                          key={idx}
                          style={{ height: `${Math.max(15, (val / 100) * 28)}px` }}
                          className={`flex-1 rounded-full transition-all duration-200 ${
                            isPlaying ? 'bg-cyan-400 animate-pulse' : 'bg-slate-600 hover:bg-slate-400'
                          }`}
                        />
                      ))}
                    </div>

                    {/* Right: Add to Timeline Button */}
                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      <button
                        onClick={() => handleAdd(item)}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-md shadow-indigo-600/20"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Adicionar</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
