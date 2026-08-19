import { 
  ProjectData, 
  SoundItem, 
  TranscriptSegment, 
  TimelineClip, 
  RetentionPoint, 
  RetentionMetric,
  AISuggestion, 
  AIInsightMetrics,
  CaptionStyleConfig,
  ExportPreset
} from '../types';

export const INITIAL_PROJECT: ProjectData = {
  id: 'proj-01',
  name: 'Viral_Dance_Challenge_v3',
  duration: '00:03:45',
  durationSec: 225,
  timecode: '00:01:15:05',
  resolution: '1080x1920 (Vertical)',
  aspectRatio: '9:16',
  fps: 60.00,
  lastEdited: 'Hoje às 14:32',
  thumbnail: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
  status: 'Pronto para Edição / Exportação',
  estimatedSize: '1.2 GB'
};

export const RECENT_PROJECTS: ProjectData[] = [
  {
    id: 'proj-01',
    name: 'Viral_Dance_Challenge_v3',
    duration: '00:03:45',
    durationSec: 225,
    timecode: '00:01:15:05',
    resolution: '1080x1920 (Vertical)',
    aspectRatio: '9:16',
    fps: 60.00,
    lastEdited: 'Hoje às 14:32',
    thumbnail: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
    status: 'Pronto para Edição',
    estimatedSize: '1.2 GB'
  },
  {
    id: 'proj-02',
    name: 'Documentário Natureza',
    duration: '00:45:00',
    durationSec: 2700,
    timecode: '00:12:30:00',
    resolution: '4K (3840x2160)',
    aspectRatio: '16:9',
    fps: 24.00,
    lastEdited: '2d atrás, 45min',
    thumbnail: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&auto=format&fit=crop&q=80',
    status: 'Cache OK (33%)',
    estimatedSize: '4.8 GB'
  },
  {
    id: 'proj-03',
    name: 'Tutorial de Edição Viral',
    duration: '00:15:20',
    durationSec: 920,
    timecode: '00:04:15:10',
    resolution: '1080p (1920x1080)',
    aspectRatio: '16:9',
    fps: 60.00,
    lastEdited: '4d atrás, 15min',
    thumbnail: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&auto=format&fit=crop&q=80',
    status: 'Renderizado',
    estimatedSize: '850 MB'
  },
  {
    id: 'proj-04',
    name: 'Vlog de Viagem Skater',
    duration: '00:22:40',
    durationSec: 1360,
    timecode: '00:08:50:00',
    resolution: '1080x1920 (Vertical)',
    aspectRatio: '9:16',
    fps: 60.00,
    lastEdited: '1s atrás, 22min',
    thumbnail: 'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?w=600&auto=format&fit=crop&q=80',
    status: 'Proxy Ativo',
    estimatedSize: '1.6 GB'
  }
];

export const DEFAULT_CAPTION_CONFIG: CaptionStyleConfig = {
  preset: 'viral_energetic',
  fontFamily: 'Montserrat',
  fontSize: 28,
  textColor: '#FFE600',
  highlightColor: '#775CFF',
  outlineColor: '#000000',
  outlineWidth: 4,
  hasOutline: true,
  hasShadow: true,
  animation: 'pop',
  animationIntensity: 85,
  textBehindSubject: 85,
  popAnimation: 70,
  bounceAnimation: 30,
  slideAnimation: 50,
  positionY: 72
};

export const INITIAL_CAPTION_CONFIG = DEFAULT_CAPTION_CONFIG;

export const INITIAL_TRANSCRIPT: TranscriptSegment[] = [
  {
    id: 'seg-1',
    speaker: 'Apresentador (Voz Principal)',
    timestamp: '00:00 - 00:15',
    start: 0,
    end: 15,
    text: 'O nosso novo fluxo de trabalho no Viralume Studio é focado na precisão. Com a integração do Whisper, conseguimos uma transcrição incrivelmente rápida.',
    words: [
      { id: 'w1', word: 'O', start: 0.1, end: 0.3, confidence: 0.99 },
      { id: 'w2', word: 'nosso', start: 0.4, end: 0.7, confidence: 0.98 },
      { id: 'w3', word: 'novo', start: 0.8, end: 1.1, confidence: 0.99 },
      { id: 'w4', word: 'fluxo', start: 1.2, end: 1.5, confidence: 0.99 },
      { id: 'w5', word: 'de', start: 1.5, end: 1.7, confidence: 0.99 },
      { id: 'w6', word: 'trabalho', start: 1.8, end: 2.2, confidence: 0.99 },
      { id: 'w7', word: 'no', start: 2.3, end: 2.5, confidence: 0.98 },
      { id: 'w8', word: 'Viralume', start: 2.6, end: 3.1, confidence: 0.97 },
      { id: 'w9', word: 'Studio', start: 3.2, end: 3.6, confidence: 0.99 },
      { id: 'w10', word: 'é', start: 3.7, end: 3.9, confidence: 0.99 },
      { id: 'w11', word: 'focado', start: 4.0, end: 4.4, confidence: 0.99 },
      { id: 'w12', word: 'na', start: 4.5, end: 4.7, confidence: 0.99 },
      { id: 'w13', word: 'precisão.', start: 4.8, end: 5.4, confidence: 0.99, highlightColor: '#775CFF' },
      { id: 'w13-silence', word: '[ Pausa 1.2s ]', start: 5.4, end: 6.6, confidence: 1.0, isSilence: true },
      { id: 'w14', word: 'Com', start: 6.6, end: 6.9, confidence: 0.98 },
      { id: 'w15', word: 'a', start: 6.9, end: 7.1, confidence: 0.99 },
      { id: 'w16', word: 'integração', start: 7.2, end: 7.8, confidence: 0.99 },
      { id: 'w17', word: 'do', start: 7.9, end: 8.1, confidence: 0.99 },
      { id: 'w18', word: 'Whisper,', start: 8.2, end: 8.7, confidence: 0.96 },
      { id: 'w18-filler', word: 'ééé...', start: 8.7, end: 9.3, confidence: 0.90, isFiller: true },
      { id: 'w19', word: 'conseguimos', start: 9.4, end: 10.0, confidence: 0.99 },
      { id: 'w20', word: 'uma', start: 10.1, end: 10.3, confidence: 0.99 },
      { id: 'w21', word: 'transcrição', start: 10.4, end: 11.1, confidence: 0.99 },
      { id: 'w22', word: 'incrivelmente', start: 11.2, end: 11.9, confidence: 0.99 },
      { id: 'w23', word: 'rápida,', start: 12.0, end: 12.5, confidence: 0.99, highlightColor: '#FFE600' },
      { id: 'w24', word: 'permitindo', start: 12.6, end: 13.2, confidence: 0.99 },
      { id: 'w25', word: 'cortes', start: 13.3, end: 13.7, confidence: 0.99 },
      { id: 'w26', word: 'por', start: 13.8, end: 14.0, confidence: 0.99 },
      { id: 'w27', word: 'texto', start: 14.1, end: 14.5, confidence: 0.99 },
      { id: 'w28', word: 'imediatos.', start: 14.6, end: 15.2, confidence: 0.99 }
    ]
  },
  {
    id: 'seg-2',
    speaker: 'Apresentador (Voz Principal)',
    timestamp: '00:15 - 00:30',
    start: 15,
    end: 30,
    text: 'Basta clicar em qualquer palavra para que o vídeo pule para esse momento exato. Isso simplifica a edição.',
    words: [
      { id: 'w28-silence', word: '[ Pausa 1.5s ]', start: 15.2, end: 16.7, confidence: 1.0, isSilence: true },
      { id: 'w29', word: 'Basta', start: 16.8, end: 17.2, confidence: 0.99 },
      { id: 'w30', word: 'clicar', start: 17.3, end: 17.7, confidence: 0.99 },
      { id: 'w31', word: 'em', start: 17.8, end: 18.0, confidence: 0.99 },
      { id: 'w32', word: 'qualquer', start: 18.1, end: 18.6, confidence: 0.98 },
      { id: 'w33', word: 'palavra', start: 18.7, end: 19.2, confidence: 0.99, highlightColor: '#775CFF' },
      { id: 'w33-filler', word: 'tipo assim', start: 19.3, end: 19.9, confidence: 0.91, isFiller: true },
      { id: 'w34', word: 'para', start: 20.0, end: 20.3, confidence: 0.99 },
      { id: 'w35', word: 'que', start: 20.4, end: 20.6, confidence: 0.99 },
      { id: 'w36', word: 'o', start: 20.7, end: 20.9, confidence: 0.99 },
      { id: 'w37', word: 'vídeo', start: 21.0, end: 21.4, confidence: 0.99 },
      { id: 'w38', word: 'pule', start: 21.5, end: 21.9, confidence: 0.98 },
      { id: 'w39', word: 'para', start: 22.0, end: 22.3, confidence: 0.99 },
      { id: 'w40', word: 'esse', start: 22.4, end: 22.7, confidence: 0.99 },
      { id: 'w41', word: 'momento', start: 22.8, end: 23.3, confidence: 0.99 },
      { id: 'w42', word: 'exato.', start: 23.4, end: 23.9, confidence: 0.99 },
      { id: 'w42-silence', word: '[ Pausa 0.7s ]', start: 24.0, end: 24.7, confidence: 1.0, isSilence: true },
      { id: 'w43', word: 'Isso', start: 24.8, end: 25.2, confidence: 0.99 },
      { id: 'w44', word: 'simplifica', start: 25.3, end: 26.0, confidence: 0.99 },
      { id: 'w45', word: 'a', start: 26.1, end: 26.3, confidence: 0.99 },
      { id: 'w46', word: 'edição', start: 26.4, end: 26.9, confidence: 0.99 },
      { id: 'w47', word: 'e', start: 27.0, end: 27.2, confidence: 0.99 },
      { id: 'w48', word: 'acelera', start: 27.3, end: 27.8, confidence: 0.99, highlightColor: '#00E5FF' },
      { id: 'w49', word: 'a', start: 27.9, end: 28.1, confidence: 0.99 },
      { id: 'w50', word: 'criação.', start: 28.2, end: 29.0, confidence: 0.99 }
    ]
  }
];

export const INITIAL_CLIPS: TimelineClip[] = [
  {
    id: 'clip-ov-1',
    trackId: 'overlay',
    name: 'Overlay_Gradiente.png',
    thumbnailUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=300&auto=format&fit=crop&q=80',
    startOffset: 0,
    duration: 35,
    sourceStart: 0,
    sourceDuration: 35,
    type: 'overlay',
    color: '#8b5cf6',
    isCached: true
  },
  {
    id: 'clip-ov-2',
    trackId: 'overlay',
    name: 'TikTok_Badge_FX.mov',
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80',
    startOffset: 45,
    duration: 30,
    sourceStart: 0,
    sourceDuration: 30,
    type: 'overlay',
    color: '#8b5cf6',
    isProxy: true
  },
  {
    id: 'clip-vid-1',
    trackId: 'video',
    name: 'Cena_01_Intro.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    startOffset: 0,
    duration: 18,
    sourceStart: 0,
    sourceDuration: 18,
    type: 'video',
    color: '#3b82f6',
    isCached: true,
    isProxy: true
  },
  {
    id: 'clip-vid-2',
    trackId: 'video',
    name: 'Cena_02_Tutorial.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    startOffset: 18,
    duration: 25,
    sourceStart: 0,
    sourceDuration: 25,
    type: 'video',
    color: '#3b82f6',
    isCached: true,
    isProxy: true
  },
  {
    id: 'clip-vid-3',
    trackId: 'video',
    name: 'Cena_03_Demonstracao.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
    startOffset: 43,
    duration: 40,
    sourceStart: 0,
    sourceDuration: 40,
    type: 'video',
    color: '#3b82f6',
    isCached: false,
    isProxy: false
  },
  {
    id: 'clip-vid-4',
    trackId: 'video',
    name: 'Cena_04_Encerramento.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=300&auto=format&fit=crop&q=80',
    startOffset: 83,
    duration: 32,
    sourceStart: 0,
    sourceDuration: 32,
    type: 'video',
    color: '#3b82f6',
    isCached: true,
    isProxy: true
  },
  {
    id: 'clip-cap-1',
    trackId: 'captions',
    name: 'Legenda: "Viral Energetic"',
    startOffset: 2,
    duration: 38,
    sourceStart: 0,
    sourceDuration: 38,
    type: 'caption',
    color: '#f59e0b'
  },
  {
    id: 'clip-cap-2',
    trackId: 'captions',
    name: 'Legenda: "Podcast Clean"',
    startOffset: 45,
    duration: 50,
    sourceStart: 0,
    sourceDuration: 50,
    type: 'caption',
    color: '#f59e0b'
  },
  {
    id: 'clip-aud-1',
    trackId: 'audio1',
    name: 'Voz_Principal_Mic_01.wav',
    startOffset: 0,
    duration: 115,
    sourceStart: 0,
    sourceDuration: 115,
    type: 'audio',
    color: '#10b981',
    volume: 1.0,
    isCached: true
  },
  {
    id: 'clip-aud-2',
    trackId: 'audio2',
    name: 'Fundo_Musical_Lofi_Beat.mp3',
    startOffset: 0,
    duration: 115,
    sourceStart: 0,
    sourceDuration: 115,
    type: 'audio',
    color: '#06b6d4',
    volume: 0.35,
    isCached: true
  }
];

export const INITIAL_RETENTION_METRICS: RetentionMetric[] = [
  {
    id: 'm-1',
    label: 'Score Viral Geral',
    score: 88,
    status: 'Excelente',
    subtext: 'Top 5% dos vídeos do nicho',
    color: '#10b981'
  },
  {
    id: 'm-2',
    label: 'Taxa de Conclusão Estimada',
    score: 74.2,
    status: 'Alta',
    subtext: '+18.4% acima da média geral',
    color: '#6366f1'
  },
  {
    id: 'm-3',
    label: 'Gancho Inicial (0-3s)',
    score: 94,
    status: 'Muito Forte',
    subtext: 'Excelente poder de parada',
    color: '#06b6d4'
  },
  {
    id: 'm-4',
    label: 'Ponto Crítico de Queda',
    score: 45,
    status: '00:45s',
    subtext: 'Risco de perda de 12% da audiência',
    color: '#f59e0b'
  }
];

export const INITIAL_AI_SUGGESTIONS: AISuggestion[] = [
  {
    id: 'sug-1',
    title: 'Acelerar Início (Gancho)',
    description: 'Remova os primeiros 3 segundos ou aumente a velocidade para capturar a atenção imediata do espectador.',
    timestamp: '00:00 - 00:03',
    impact: '+18% Retenção no Gancho',
    actionLabel: 'Aplicar Corte no Início',
    type: 'cut'
  },
  {
    id: 'sug-2',
    title: 'Remover Silêncio Crítico',
    description: 'A pausa longa em 00:13 prejudica o ritmo e causou queda de 40% na retenção.',
    timestamp: '00:13 - 00:16',
    impact: '+25% Ritmo',
    actionLabel: 'Cortar Silêncio (2.8s)',
    type: 'cut'
  },
  {
    id: 'sug-3',
    title: 'Inserir B-Roll Dinâmico',
    description: 'A monotonia visual em 00:45 pode ser quebrada com uma sobreposição de imagem ou vídeo de demonstração.',
    timestamp: '00:45 - 00:55',
    impact: '+14% Engajamento',
    actionLabel: 'Adicionar B-Roll IA',
    type: 'broll'
  },
  {
    id: 'sug-4',
    title: 'Melhorar Áudio & Equalização',
    description: 'Ruído de fundo detectado na faixa de microfone durante a fala principal.',
    timestamp: '01:15 - 01:30',
    impact: '+10% Clareza Vocal',
    actionLabel: 'Otimizar Áudio IA',
    type: 'audio'
  }
];

export const EXPORT_PRESETS: ExportPreset[] = [
  {
    id: 'exp-1',
    name: 'Instagram Reels & Stories',
    resolution: '1080x1920 (9:16)',
    codec: 'H.264 / AVC',
    fps: 30,
    bitrate: '15 Mbps',
    estimatedSizeMb: 42,
    recommendedFor: 'Reels, Stories, Feed Vertical'
  },
  {
    id: 'exp-2',
    name: 'TikTok FYP High Quality',
    resolution: '1080x1920 (9:16)',
    codec: 'H.265 / HEVC',
    fps: 60,
    bitrate: '20 Mbps',
    estimatedSizeMb: 58,
    recommendedFor: 'TikTok 60FPS sem compressão'
  },
  {
    id: 'exp-3',
    name: 'YouTube Shorts Ultra',
    resolution: '1080x1920 (9:16)',
    codec: 'AV1 / VP9',
    fps: 60,
    bitrate: '25 Mbps',
    estimatedSizeMb: 65,
    recommendedFor: 'YouTube Shorts HDR'
  },
  {
    id: 'exp-4',
    name: 'Master 4K Cinema ProRes',
    resolution: '3840x2160 (16:9)',
    codec: 'Apple ProRes 422 HQ',
    fps: 24,
    bitrate: '220 Mbps',
    estimatedSizeMb: 820,
    recommendedFor: 'Edição offline e arquivo master'
  }
];

export const SFX_ITEMS: SoundItem[] = [
  {
    id: 'sfx-1',
    name: 'Transição_Cinematica_01.wav',
    folder: 'Transições',
    duration: '0:05',
    durationSec: 5,
    format: 'WAV',
    sampleRate: '1000 MHz • 3.50 Bits',
    isFavorite: true,
    waveformData: [12, 24, 45, 80, 95, 70, 55, 40, 20, 10, 5, 2]
  },
  {
    id: 'sfx-2',
    name: 'Transição_Cinematica_02.wav',
    folder: 'Transições',
    duration: '0:05',
    durationSec: 5,
    format: 'WAV',
    sampleRate: '1000 MHz • 3.99 Bits',
    isFavorite: true,
    waveformData: [5, 15, 30, 60, 90, 85, 60, 35, 18, 8, 4, 1]
  },
  {
    id: 'sfx-3',
    name: 'Transição_Cinematica_03.wav',
    folder: 'Transições',
    duration: '0:05',
    durationSec: 5,
    format: 'WAV',
    sampleRate: '1000 MHz • 3.29 Bits',
    isFavorite: true,
    waveformData: [8, 20, 48, 75, 100, 80, 50, 30, 15, 6, 2, 1]
  },
  {
    id: 'sfx-4',
    name: 'Impacto_Explosão_Forte.mp3',
    folder: 'Impactos',
    duration: '0:02',
    durationSec: 2,
    format: 'MP3',
    sampleRate: '2550 MHz • 3.94 Bits',
    isFavorite: false,
    waveformData: [98, 90, 75, 55, 40, 28, 18, 10, 6, 3, 1, 0]
  },
  {
    id: 'sfx-5',
    name: 'Impacto_Explosão_01.wav',
    folder: 'Impactos',
    duration: '0:03',
    durationSec: 3,
    format: 'WAV',
    sampleRate: '2500 MHz • 3.34 Bits',
    isFavorite: true,
    waveformData: [95, 85, 65, 45, 30, 20, 12, 7, 4, 2, 1, 0]
  },
  {
    id: 'sfx-6',
    name: 'Pássaros_Floresta_Manhã.wav',
    folder: 'Natureza',
    duration: '1:20',
    durationSec: 80,
    format: 'WAV',
    sampleRate: '1200 MHz • 3.32 Bits',
    isFavorite: true,
    waveformData: [20, 35, 25, 40, 30, 50, 45, 35, 40, 25, 30, 20]
  },
  {
    id: 'sfx-7',
    name: 'Fundo_Lofi_Vibes_Chill.mp3',
    folder: 'Fundo Musical',
    duration: '2:15',
    durationSec: 135,
    format: 'MP3',
    sampleRate: '44.1 kHz • 320 kbps',
    isFavorite: true,
    waveformData: [45, 60, 55, 70, 65, 80, 75, 65, 70, 60, 55, 50]
  }
];

export const RETENTION_DATA: RetentionPoint[] = [
  { timeSec: 0, timeLabel: '00:00', retentionPercent: 100, isPeak: true },
  { timeSec: 5, timeLabel: '00:05', retentionPercent: 95, isPeak: true },
  { timeSec: 10, timeLabel: '00:10', retentionPercent: 88 },
  { timeSec: 13, timeLabel: '00:13', retentionPercent: 48, dropWarning: '00:13 - Queda de Retenção (Pausa longa/Silêncio)' },
  { timeSec: 16, timeLabel: '00:16', retentionPercent: 62 },
  { timeSec: 20, timeLabel: '00:20', retentionPercent: 78 },
  { timeSec: 45, timeLabel: '00:45', retentionPercent: 92, isPeak: true },
  { timeSec: 75, timeLabel: '01:15', retentionPercent: 84 },
  { timeSec: 95, timeLabel: '01:35', retentionPercent: 68 },
  { timeSec: 120, timeLabel: '02:00', retentionPercent: 74 }
];

export const AI_METRICS: AIInsightMetrics = {
  hookScore: 85,
  hookStatus: 'Forte',
  pacingScore: 72,
  pacingStatus: 'Moderado',
  clarityScore: 91,
  clarityStatus: 'Excelente',
  readabilityScore: 95,
  readabilityStatus: 'Excelente'
};

export const REFERENCE_SCREENS = [
  {
    id: 1,
    title: 'Presets e Guias Sociais',
    screenMode: 'social_presets',
    category: 'Templates & Social',
    description: 'Painel Contextual com presets virais, guias de zona segura para Instagram Reels, TikTok, YouTube Shorts e sliders de animação.',
    tags: ['Safe Zones', 'Presets', 'Pop Animation', 'Reels / TikTok']
  },
  {
    id: 2,
    title: 'Módulo de Exportação Profissional',
    screenMode: 'editor',
    category: 'Exportação & Render',
    description: 'Modal de exportação com seleção de Codec H.264/H.265, Formato MP4/MOV, Bitrate CRF e aceleração GPU NVIDIA.',
    tags: ['Exportação', 'H.264/H.265', 'CRF', 'NVIDIA GPU']
  },
  {
    id: 3,
    title: 'Transcrição e Estilos em Tempo Real',
    screenMode: 'subtitles_gallery',
    category: 'Legendas & Transcrição',
    description: 'Lista de palavras sincronizadas com timestamp, estilo balão de impacto amarelo "incrível" e player de corte de silêncios.',
    tags: ['Whisper Sync', 'Timestamp Words', 'Pop Captions', 'Cortar Silêncios']
  },
  {
    id: 4,
    title: 'Painel de Transcrição e Análise IA',
    screenMode: 'ai_analytics',
    category: 'Análise de Vídeo',
    description: 'Vídeo em análise com Transcrição Sincronizada, Insights de Desempenho (Gancho 85%, Ritmo 72%, Clareza 91%), Mapa de Retenção e sugestões de corte.',
    tags: ['Mapa de Retenção', 'Insights IA', 'Gancho 85%', 'Sugestões de Corte']
  },
  {
    id: 5,
    title: 'Ultra-Premium Video Editor Workspace',
    screenMode: 'editor',
    category: 'NLE Workspace',
    description: 'Workspace NLE completo com Biblioteca de Mídia, Inspetor Contextual (Transform e Color), Timeline multi-faixa e Monitor Vertical de Reels.',
    tags: ['Multi-Track Timeline', 'Inspector', 'Media Library', 'Vertical Monitor']
  },
  {
    id: 6,
    title: 'Editor NLE com Formato TikTok',
    screenMode: 'editor',
    category: 'NLE Workspace',
    description: 'Timeline com Time Ruler, Cache Render bar, color wheels de 3 vias (Lift/Gamma/Gain) e guias seguras do TikTok.',
    tags: ['Color Wheels', 'Time Ruler', 'TikTok Safe Zones', 'Cache Bar']
  },
  {
    id: 7,
    title: 'Barra de Ferramentas da Timeline',
    screenMode: 'editor',
    category: 'NLE Tools',
    description: 'Ferramentas de precisão: Playhead, Lâmina de Corte (Blade "B"), Magnet/Snapping, Slip, Marcador, Cortar Silêncios e Modo Ripple.',
    tags: ['Blade Tool', 'Snapping', 'Ripple Mode', 'Audio Waveforms']
  },
  {
    id: 8,
    title: 'Menu de Contexto de Edição',
    screenMode: 'editor',
    category: 'Shortcuts & Context Menu',
    description: 'Menu suspenso com Edição Básica (Ctrl+C, Ctrl+V, etc.), Ações de Clipe (Dividir Ctrl+B, Separar Áudio), Organização e Recursos IA.',
    tags: ['Context Menu', 'Dividir Playhead', 'Recortar Sujeito', 'Shortcuts']
  },
  {
    id: 9,
    title: 'Indicadores de Performance e Cache',
    screenMode: 'editor',
    category: 'Performance & Diagnostic',
    description: 'Barra de cache de render (Verde Instantâneo, Amarelo Proxy, Vermelho Sem Cache), Badges "P" Proxy e "C" Cache, Monitor de CPU/GPU/RAM.',
    tags: ['Timeline Cache', 'Proxy Badges', 'GPU/RAM Monitor', 'Instant Playback']
  },
  {
    id: 10,
    title: 'Configurações de Exportação Skater Preview',
    screenMode: 'editor',
    category: 'Exportação & Render',
    description: 'Modal com resumo do projeto 1080x1920, 60fps, formato MP4/MOV ProRes, CRF slider e estimativa de tempo 5-7 min.',
    tags: ['60 FPS', 'Vertical Skater', 'ProRes', 'Hardware Acceleration']
  },
  {
    id: 11,
    title: 'Análise de Performance e Retenção IA (Full Screen)',
    screenMode: 'ai_analytics',
    category: 'Análise de Vídeo',
    description: 'Dashboard de retenção com gráficos de onda com gradiente neon, indicadores de gancho/ritmo/clareza/legibilidade e botão de auto-aplicação.',
    tags: ['Neon Retention Wave', 'Hook Score', 'Legibilidade 95%', 'Auto Apply']
  },
  {
    id: 12,
    title: 'Biblioteca SFX e Gerenciador de Sons',
    screenMode: 'sfx_library',
    category: 'Áudio & SFX',
    description: 'Gerenciador de efeitos sonoros com navegação por pastas (Transições, Impactos, Natureza, Música), visualizador de onda e player persistente.',
    tags: ['SFX Manager', 'Waveform Visualizer', 'Audio Table', 'Drag to Timeline']
  },
  {
    id: 13,
    title: 'Launcher e Tela Inicial Viralume',
    screenMode: 'home',
    category: 'Início & Boas-Vindas',
    description: 'Tela de boas-vindas com logo Viralume Studio, Novo Projeto, Abrir Projeto, Projetos Recentes, Novidades e Barra de Status do Sistema.',
    tags: ['Welcome Launcher', 'Recent Projects', 'System Status', 'GPU RTX 3080']
  },
  {
    id: 14,
    title: 'Painel de Transcrição e Corte por Texto',
    screenMode: 'transcription_text',
    category: 'Edição por Texto',
    description: 'Editor baseado em transcrição com clique para pular no vídeo, cortar silêncios, busca de palavras e conversão instantânea para legendas.',
    tags: ['Text-Based Editing', 'Whisper Sync', 'Click to Seek', 'Cortar Silêncios']
  },
  {
    id: 15,
    title: 'Galeria de Estilos de Legenda Automática',
    screenMode: 'subtitles_gallery',
    category: 'Legendas & Estilos',
    description: 'Galeria com cards de estilos (Viral Energetic, Podcast Clean, TikTok Bounce, Karaokê, Minimal Elegant), seleção de fonte, cor, contorno e animações.',
    tags: ['Viral Energetic', 'TikTok Bounce', 'Karaokê', 'Outline Controls']
  }
];

