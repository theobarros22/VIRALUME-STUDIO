import React from 'react';
import { 
  Scissors, 
  Copy, 
  Clipboard, 
  Trash2, 
  Split, 
  VolumeX, 
  Snowflake, 
  FolderPlus, 
  Layers, 
  Lock, 
  UserCheck, 
  BarChart2,
  Sparkles
} from 'lucide-react';

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onAction: (action: string) => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, onClose, onAction }) => {
  // Ensure menu stays on screen
  const menuStyle: React.CSSProperties = {
    top: Math.min(y, window.innerHeight - 380),
    left: Math.min(x, window.innerWidth - 260),
  };

  const handleItemClick = (actionName: string) => {
    onAction(actionName);
    onClose();
  };

  return (
    <>
      {/* Click outside backdrop */}
      <div 
        className="fixed inset-0 z-50 bg-transparent" 
        onClick={onClose} 
        onContextMenu={(e) => { e.preventDefault(); onClose(); }}
      />

      {/* The Context Menu Window matching Image 8 */}
      <div 
        style={menuStyle}
        className="fixed z-50 w-64 bg-[#161a25] border border-[#2b334a] rounded-xl shadow-2xl py-2 text-xs text-slate-200 select-none animate-in fade-in zoom-in-95 duration-100 font-['Plus_Jakarta_Sans',sans-serif]"
      >
        {/* Section 1: Edição Básica */}
        <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Edição Básica
        </div>
        <div className="space-y-0.5 px-1">
          <button 
            onClick={() => handleItemClick('Recortar')}
            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-indigo-600/30 hover:text-white transition-colors"
          >
            <span>Recortar</span>
            <span className="text-[10px] text-slate-400 font-mono">Ctrl+X</span>
          </button>
          <button 
            onClick={() => handleItemClick('Copiar')}
            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-indigo-600/30 hover:text-white transition-colors"
          >
            <span>Copiar</span>
            <span className="text-[10px] text-slate-400 font-mono">Ctrl+C</span>
          </button>
          <button 
            onClick={() => handleItemClick('Colar')}
            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-indigo-600/30 hover:text-white transition-colors"
          >
            <span>Colar</span>
            <span className="text-[10px] text-slate-400 font-mono">Ctrl+V</span>
          </button>
          <button 
            onClick={() => handleItemClick('Duplicar')}
            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-indigo-600/30 hover:text-white transition-colors"
          >
            <span>Duplicar</span>
            <span className="text-[10px] text-slate-400 font-mono">Ctrl+D</span>
          </button>
          <button 
            onClick={() => handleItemClick('Apagar')}
            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-red-600/30 hover:text-red-300 transition-colors"
          >
            <span>Apagar</span>
            <span className="text-[10px] text-slate-400 font-mono">Delete</span>
          </button>
        </div>

        <div className="my-1.5 border-t border-[#232a3f]" />

        {/* Section 2: Ações de Clipe */}
        <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Ações de Clipe
        </div>
        <div className="space-y-0.5 px-1">
          <button 
            onClick={() => handleItemClick('Dividir no Playhead')}
            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/40 hover:text-white transition-colors font-medium"
          >
            <div className="flex items-center gap-1.5">
              <Split className="w-3.5 h-3.5 text-indigo-400" />
              <span>Dividir no Playhead</span>
            </div>
            <span className="text-[10px] text-indigo-300 font-mono">Ctrl+B</span>
          </button>
          <button 
            onClick={() => handleItemClick('Separar Áudio do Vídeo')}
            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-indigo-600/30 hover:text-white transition-colors"
          >
            <span>Separar Áudio do Vídeo</span>
            <span className="text-[10px] text-slate-400 font-mono">Ctrl+Shift+A</span>
          </button>
          <button 
            onClick={() => handleItemClick('Congelar Quadro')}
            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-indigo-600/30 hover:text-white transition-colors"
          >
            <span>Congelar Quadro</span>
            <span className="text-[10px] text-slate-400 font-mono">Ctrl+F</span>
          </button>
        </div>

        <div className="my-1.5 border-t border-[#232a3f]" />

        {/* Section 3: Organização */}
        <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Organização
        </div>
        <div className="space-y-0.5 px-1">
          <button 
            onClick={() => handleItemClick('Criar Grupo')}
            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-indigo-600/30 hover:text-white transition-colors"
          >
            <span>Criar Grupo</span>
            <span className="text-[10px] text-slate-400 font-mono">Ctrl+G</span>
          </button>
          <button 
            onClick={() => handleItemClick('Mover para Nova Faixa')}
            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-indigo-600/30 hover:text-white transition-colors"
          >
            <span>Mover para Nova Faixa</span>
          </button>
          <button 
            onClick={() => handleItemClick('Travar Faixa')}
            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-indigo-600/30 hover:text-white transition-colors"
          >
            <span>Travar Faixa</span>
          </button>
        </div>

        <div className="my-1.5 border-t border-[#232a3f]" />

        {/* Section 4: IA & Viralume */}
        <div className="px-3 py-1 text-[11px] font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          <span>IA & Auto-Edição</span>
        </div>
        <div className="space-y-0.5 px-1">
          <button 
            onClick={() => handleItemClick('Recortar Sujeito')}
            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-cyan-600/30 hover:text-cyan-200 transition-colors text-cyan-300"
          >
            <span>Recortar Sujeito (Isolar)</span>
            <span className="text-[10px] text-cyan-400 font-mono">Alt+S</span>
          </button>
          <button 
            onClick={() => handleItemClick('Analisar Retenção deste Clipe')}
            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-cyan-600/30 hover:text-cyan-200 transition-colors text-cyan-300"
          >
            <span>Analisar Retenção deste Clipe</span>
          </button>
        </div>
      </div>
    </>
  );
};
