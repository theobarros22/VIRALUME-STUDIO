import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Copy, 
  Check, 
  FileText, 
  FileCode, 
  Sparkles, 
  Sliders,
  CheckCircle2
} from 'lucide-react';
import { INITIAL_TRANSCRIPT } from '../../data/mockData';
import { generateSRT, generateVTT, downloadTextFile } from '../../utils/subtitleGenerator';

interface ExportSubtitlesModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectName?: string;
}

export const ExportSubtitlesModal: React.FC<ExportSubtitlesModalProps> = ({
  isOpen,
  onClose,
  projectName = 'Meu_Video_Viral',
}) => {
  const [format, setFormat] = useState<'srt' | 'vtt'>('srt');
  const [copied, setCopied] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [maxCharsPerLine, setMaxCharsPerLine] = useState(38);
  const [includeSpeakerLabels, setIncludeSpeakerLabels] = useState(false);

  if (!isOpen) return null;

  const srtContent = generateSRT(INITIAL_TRANSCRIPT);
  const vttContent = generateVTT(INITIAL_TRANSCRIPT);
  const currentContent = format === 'srt' ? srtContent : vttContent;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const filename = `${projectName.replace(/\s+/g, '_')}_legendas.${format}`;
    const mime = format === 'srt' ? 'application/x-subrip' : 'text/vtt';
    downloadTextFile(currentContent, filename, mime);
    setDownloadSuccess(`Arquivo ${filename} baixado com sucesso!`);
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in select-none">
      <div className="relative w-full max-w-2xl bg-[#131724] border border-[#262e44] rounded-2xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#20273c] bg-[#161a29]">
          <div className="flex items-center gap-2 font-bold text-white text-base">
            <FileText className="w-5 h-5 text-indigo-400" />
            <span>Exportar Legendas Sincronizadas (.SRT / .VTT)</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#22283d] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 overflow-y-auto custom-scrollbar">
          
          {/* Format Selector Tabs */}
          <div className="flex items-center justify-between">
            <div className="flex items-center bg-[#0d1019] p-1 rounded-xl border border-[#22293d]">
              <button
                onClick={() => setFormat('srt')}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  format === 'srt'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>Formato SubRip (.SRT)</span>
              </button>
              <button
                onClick={() => setFormat('vtt')}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  format === 'vtt'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Formato WebVTT (.VTT)</span>
              </button>
            </div>

            <span className="text-[11px] text-slate-400 bg-[#1a2030] px-2.5 py-1 rounded border border-[#273047] font-mono">
              {INITIAL_TRANSCRIPT.length} segmentos sincronizados
            </span>
          </div>

          {/* Code/Text Preview Box */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Pré-visualização do Arquivo com Timecodes:</span>
              <span className="text-indigo-400 font-mono">Codificação: UTF-8</span>
            </div>
            <div className="bg-[#0b0e17] border border-[#22293d] rounded-xl p-3.5 font-mono text-xs text-slate-300 h-56 overflow-y-auto custom-scrollbar leading-relaxed whitespace-pre-wrap select-text">
              {currentContent}
            </div>
          </div>

          {/* Quick Subtitle Settings */}
          <div className="bg-[#171c2b] p-3.5 rounded-xl border border-[#252d42] flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-400" />
              <span className="font-semibold text-slate-200">Compatibilidade Total:</span>
              <span className="text-slate-400">Premiere Pro, DaVinci Resolve, CapCut, YouTube & Instagram</span>
            </div>
          </div>

          {downloadSuccess && (
            <div className="p-3 bg-emerald-950/80 border border-emerald-500 rounded-xl text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{downloadSuccess}</span>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#20273c] bg-[#161a29]">
          <button
            onClick={handleCopy}
            className="px-4 py-2 rounded-xl bg-[#1f2639] hover:bg-[#28324a] text-slate-200 text-xs font-semibold flex items-center gap-2 transition-colors border border-[#2b354e]"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
            <span>{copied ? 'Copiado para a Área de Transferência!' : 'Copiar Texto'}</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#1c2233] hover:bg-[#252c42] text-slate-300 text-xs font-semibold transition-colors"
            >
              Fechar
            </button>

            <button
              onClick={handleDownload}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/25 flex items-center gap-2 transition-all hover:scale-105"
            >
              <Download className="w-4 h-4" />
              <span>Baixar Arquivo .{format.toUpperCase()}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
