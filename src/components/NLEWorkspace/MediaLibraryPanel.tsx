import React, { useState } from 'react';
import { 
  Folder, 
  ChevronRight, 
  ChevronDown, 
  Search, 
  Filter, 
  Plus, 
  Film, 
  Music, 
  Sparkles, 
  Layers, 
  Check, 
  Info,
  SlidersHorizontal,
  Upload
} from 'lucide-react';

interface MediaItem {
  id: string;
  name: string;
  type: 'video' | 'audio' | 'overlay' | 'sfx';
  duration: string;
  thumbnailUrl?: string;
  isProxy?: boolean;
  isCached?: boolean;
  resolution?: string;
}

interface MediaLibraryPanelProps {
  onAddToTimeline?: (item: MediaItem) => void;
}

export const MediaLibraryPanel: React.FC<MediaLibraryPanelProps> = ({ onAddToTimeline }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'video' | 'audio' | 'assets'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    raw: true,
    music: true,
    sfx: false,
  });
  const [hoveredBadge, setHoveredBadge] = useState<{ id: string; type: 'proxy' | 'cache' } | null>(null);

  const mediaList: MediaItem[] = [
    {
      id: 'm-1',
      name: 'Clip_01.mov',
      type: 'video',
      duration: '00:18',
      thumbnailUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
      isProxy: true,
      isCached: true,
      resolution: '4K'
    },
    {
      id: 'm-2',
      name: 'Clip_02.mov',
      type: 'video',
      duration: '00:25',
      thumbnailUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      isProxy: true,
      isCached: true,
      resolution: '1080p'
    },
    {
      id: 'm-3',
      name: 'Audio_Track.wav',
      type: 'audio',
      duration: '03:45',
      thumbnailUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop&q=80',
      isProxy: false,
      isCached: true,
    },
    {
      id: 'm-4',
      name: 'Overlay_Glow.png',
      type: 'overlay',
      duration: '00:30',
      thumbnailUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=300&auto=format&fit=crop&q=80',
      isProxy: true,
      isCached: false,
    },
    {
      id: 'm-5',
      name: 'Efeito_Visual_Render.mov',
      type: 'video',
      duration: '00:15',
      thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80',
      isProxy: true,
      isCached: true,
    },
    {
      id: 'm-6',
      name: 'Cena_03_Skater.mp4',
      type: 'video',
      duration: '00:40',
      thumbnailUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
      isProxy: true,
      isCached: true,
    }
  ];

  const filteredMedia = mediaList.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === 'video') return matchesSearch && item.type === 'video';
    if (activeTab === 'audio') return matchesSearch && item.type === 'audio';
    if (activeTab === 'assets') return matchesSearch && item.type === 'overlay';
    return matchesSearch;
  });

  const toggleFolder = (folderKey: string) => {
    setExpandedFolders(prev => ({ ...prev, [folderKey]: !prev[folderKey] }));
  };

  return (
    <div className="h-full flex flex-col bg-[#141824] border-r border-[#222838] text-slate-200 text-xs select-none">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-[#202636]">
        <div className="flex items-center gap-1.5 font-semibold text-slate-100 text-xs">
          <Film className="w-3.5 h-3.5 text-indigo-400" />
          <span>Biblioteca de Mídia</span>
        </div>
        <div className="flex items-center gap-1">
          <label className="p-1 rounded hover:bg-[#202739] text-slate-400 hover:text-slate-200 cursor-pointer" title="Importar Mídia">
            <Upload className="w-3.5 h-3.5" />
            <input type="file" multiple className="hidden" onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                alert(`Importado(s) ${e.target.files.length} arquivo(s) com sucesso.`);
              }
            }} />
          </label>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="p-2.5 space-y-2 border-b border-[#1c2232]">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar clipes, áudio..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0f121c] border border-[#262e42] rounded-lg pl-8 pr-2.5 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500/80 transition-colors"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1">
          {[
            { id: 'all', label: 'Tudo' },
            { id: 'video', label: 'Vídeos' },
            { id: 'audio', label: 'Áudios' },
            { id: 'assets', label: 'Sobreposições' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#1a2030]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Folders Tree & Media Grid */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-3 custom-scrollbar">
        {/* Folder 1: Raw Footage */}
        <div>
          <button
            onClick={() => toggleFolder('raw')}
            className="w-full flex items-center justify-between text-slate-400 hover:text-slate-200 py-1 text-[11px] font-semibold"
          >
            <div className="flex items-center gap-1.5">
              {expandedFolders.raw ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              <Folder className="w-3.5 h-3.5 text-amber-400" />
              <span>Gravações Brutas (4K / 1080p)</span>
            </div>
            <span className="text-[10px] text-slate-500">{filteredMedia.filter(m => m.type === 'video').length}</span>
          </button>
        </div>

        {/* Media Grid as in Image 5 & 9 */}
        <div className="grid grid-cols-2 gap-2">
          {filteredMedia.map((item) => (
            <div
              key={item.id}
              onClick={() => onAddToTimeline && onAddToTimeline(item)}
              className="group relative rounded-xl bg-[#181d2c] border border-[#252c3f] hover:border-indigo-500/60 p-2 cursor-pointer transition-all hover:bg-[#1f2638] shadow-sm flex flex-col justify-between"
            >
              {/* Thumbnail Container */}
              <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center">
                {item.thumbnailUrl ? (
                  <img
                    src={item.thumbnailUrl}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <Music className="w-6 h-6 text-indigo-400" />
                )}

                {/* Duration Badge */}
                <div className="absolute bottom-1 right-1 px-1 py-0.5 rounded bg-black/80 text-[9px] font-mono text-slate-300">
                  {item.duration}
                </div>

                {/* Proxy Badge 'P' matching Image 5, 6, 9 */}
                {item.isProxy && (
                  <div 
                    onMouseEnter={() => setHoveredBadge({ id: item.id, type: 'proxy' })}
                    onMouseLeave={() => setHoveredBadge(null)}
                    className="absolute top-1 left-1 w-4 h-4 rounded-full bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center shadow-md border border-blue-400/50 cursor-help"
                  >
                    P
                  </div>
                )}

                {/* Cache Badge 'C' matching Image 9 */}
                {item.isCached && (
                  <div 
                    onMouseEnter={() => setHoveredBadge({ id: item.id, type: 'cache' })}
                    onMouseLeave={() => setHoveredBadge(null)}
                    className="absolute top-1 right-1 w-4 h-4 rounded-full bg-amber-500 text-black text-[9px] font-extrabold flex items-center justify-center shadow-md border border-amber-300/50 cursor-help"
                  >
                    C
                  </div>
                )}
              </div>

              {/* Name and Meta */}
              <div className="mt-1.5">
                <div className="text-[11px] font-medium text-slate-200 truncate group-hover:text-indigo-300">
                  {item.name}
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 mt-0.5">
                  <span className="capitalize">{item.type}</span>
                  {item.resolution && <span className="text-slate-500 font-mono">{item.resolution}</span>}
                </div>
              </div>

              {/* Hover Add to Timeline Button */}
              <div className="mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="w-full py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-semibold flex items-center justify-center gap-1">
                  <Plus className="w-3 h-3" />
                  <span>Adicionar</span>
                </button>
              </div>
            </div>
          ))}

          {/* Quick Add Placeholder Card */}
          <div className="border-2 border-dashed border-[#2b334a] rounded-xl flex flex-col items-center justify-center p-3 text-slate-400 hover:border-indigo-500/60 hover:text-indigo-300 transition-colors cursor-pointer bg-[#121622]/50 aspect-video">
            <Plus className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-medium">Recursos +</span>
          </div>
        </div>

        {/* Tooltip description for badges matching Image 9 */}
        {hoveredBadge && (
          <div className="p-2 rounded-lg bg-[#1e2536] border border-[#2f3a52] text-[11px] text-slate-200 shadow-xl animate-in fade-in">
            {hoveredBadge.type === 'proxy' && (
              <div className="flex items-center gap-1.5 text-blue-300">
                <span className="w-3.5 h-3.5 rounded-full bg-blue-600 text-[9px] font-bold text-white flex items-center justify-center">P</span>
                <span><strong>Proxy Ativo:</strong> Reprodução fluida e leve em tempo real.</span>
              </div>
            )}
            {hoveredBadge.type === 'cache' && (
              <div className="flex items-center gap-1.5 text-amber-300">
                <span className="w-3.5 h-3.5 rounded-full bg-amber-500 text-[9px] font-bold text-black flex items-center justify-center">C</span>
                <span><strong>Waveform em Cache:</strong> Áudio decodificado na memória.</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* System Resource Usage Mini Summary matching Image 9 right sidebar */}
      <div className="p-2.5 bg-[#0f121c] border-t border-[#1f2537] text-[10px] text-slate-400 space-y-1">
        <div className="flex justify-between">
          <span>CPU Viralume:</span>
          <span className="text-emerald-400 font-mono">18% (OK)</span>
        </div>
        <div className="flex justify-between">
          <span>GPU Acelerada:</span>
          <span className="text-indigo-400 font-mono">30% (RTX 3080)</span>
        </div>
        <div className="flex justify-between">
          <span>RAM Alocada:</span>
          <span className="text-cyan-400 font-mono">4.2 GB / 32 GB</span>
        </div>
      </div>
    </div>
  );
};
