import React from 'react';
import { X, Command, Keyboard, Zap, Scissors, Play, Volume2, Move, Sparkles } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcutGroups = [
    {
      title: 'Reprodução & Navegação',
      shortcuts: [
        { key: 'Espaço', label: 'Play / Pause do Monitor de Vídeo' },
        { key: 'J', label: 'Retroceder 5 Segundos' },
        { key: 'L', label: 'Avançar 5 Segundos' },
        { key: 'Home / End', label: 'Ir para Início / Fim da Linha do Tempo' },
      ]
    },
    {
      title: 'Edição & Ferramentas NLE',
      shortcuts: [
        { key: 'B', label: 'Lâmina / Dividir Clipes no Playhead' },
        { key: 'V', label: 'Ferramenta de Seleção Padrão' },
        { key: 'N', label: 'Ativar / Desativar Encaixe Magnético (Snap)' },
        { key: 'Delete / Backspace', label: 'Excluir Elemento Selecionado' },
        { key: 'Esc', label: 'Fechar Menus e Modais Flutuantes' },
      ]
    },
    {
      title: 'Recursos de IA & Exportação',
      shortcuts: [
        { key: 'Ctrl + E', label: 'Abrir Modal de Exportação e Render GPU' },
        { key: 'Ctrl + T', label: 'Ir para Editor de Corte por Texto' },
        { key: 'Ctrl + L', label: 'Abrir Galeria de Legendas Dinâmicas' },
        { key: 'Ctrl + V', label: 'Abrir Estúdio de Dublagem & Vozes IA' },
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in select-none">
      <div className="relative w-full max-w-xl bg-[#131724] border border-[#262e44] rounded-2xl shadow-2xl overflow-hidden text-slate-100 flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#20273c] bg-[#161a29]">
          <div className="flex items-center gap-2 font-bold text-white text-base">
            <Keyboard className="w-5 h-5 text-indigo-400" />
            <span>Atalhos de Teclado & Guia Rápido Viralume</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#22283d] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {shortcutGroups.map((group, idx) => (
            <div key={idx} className="space-y-2.5">
              <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                {group.title}
              </h3>
              <div className="space-y-1.5 bg-[#0e111a] p-3 rounded-xl border border-[#20273a]">
                {group.shortcuts.map((sc, sIdx) => (
                  <div key={sIdx} className="flex items-center justify-between py-1 text-xs">
                    <span className="text-slate-300">{sc.label}</span>
                    <kbd className="px-2.5 py-1 rounded bg-[#1c2233] border border-[#2b354e] font-mono text-[11px] font-bold text-indigo-300 shadow-sm">
                      {sc.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-[#20273c] bg-[#161a29] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors"
          >
            Entendido
          </button>
        </div>

      </div>
    </div>
  );
};
