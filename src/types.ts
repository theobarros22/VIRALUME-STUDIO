export type ScreenMode = 
  | 'home'
  | 'editor'
  | 'social_presets'
  | 'subtitles_gallery'
  | 'transcription_text'
  | 'ai_analytics'
  | 'sfx_library'
  | 'screens_reference';

export type PlatformSafeZone = 'instagram_reels' | 'tiktok' | 'youtube_shorts' | 'none';

export type VideoAspectRatio = '9:16' | '16:9' | '1:1' | '4:5' | '4:3';

export type CaptionPresetType = 
  | 'viral_energetic'
  | 'podcast_clean'
  | 'tiktok_bounce'
  | 'karaoke_glow'
  | 'minimal_elegant'
  | 'storytelling_flow'
  | 'meme_style';

export interface CaptionStyleConfig {
  preset: CaptionPresetType;
  fontFamily: string;
  fontSize: number; // in px
  textColor: string;
  highlightColor: string;
  outlineColor: string;
  outlineWidth: number;
  hasOutline: boolean;
  hasShadow: boolean;
  animation: 'pop' | 'bounce' | 'slide' | 'fade' | 'karaoke';
  animationIntensity: number; // 0-100
  textBehindSubject: number; // 0-100
  popAnimation: number; // 0-100
  bounceAnimation: number; // 0-100
  slideAnimation: number; // 0-100
  positionY: number; // % from top
}

export interface TranscriptWord {
  id: string;
  word: string;
  start: number; // in seconds
  end: number;
  confidence: number;
  highlightColor?: string;
  isCut?: boolean;
  isSilence?: boolean;
  isFiller?: boolean;
  isDeleted?: boolean;
}

export interface TranscriptSegment {
  id: string;
  speaker: string;
  timestamp: string; // e.g. "00:01.2 - 00:03.5"
  start: number;
  end: number;
  text: string;
  words: TranscriptWord[];
  hasSilenceBefore?: boolean;
  silenceDuration?: number;
}

export interface TimelineClip {
  id: string;
  trackId: 'overlay' | 'video' | 'captions' | 'audio1' | 'audio2';
  name: string;
  thumbnailUrl?: string;
  startOffset: number; // in timeline seconds
  duration: number; // in timeline seconds
  sourceStart: number;
  sourceDuration: number;
  type: 'video' | 'audio' | 'overlay' | 'caption';
  color: string;
  volume?: number;
  isProxy?: boolean;
  isCached?: boolean;
  locked?: boolean;
  muted?: boolean;
  selected?: boolean;
}

export interface SoundItem {
  id: string;
  name: string;
  folder: 'Transições' | 'Impactos' | 'Natureza' | 'Fundo Musical';
  duration: string;
  durationSec: number;
  format: 'WAV' | 'MP3';
  sampleRate: string;
  isFavorite: boolean;
  waveformData: number[];
  audioUrl?: string;
}

export interface ProjectData {
  id: string;
  name: string;
  duration: string;
  durationSec: number;
  timecode: string;
  resolution: string;
  aspectRatio: VideoAspectRatio;
  fps: number;
  lastEdited: string;
  thumbnail: string;
  status: string;
  estimatedSize: string;
  videoFileUrl?: string;
  videoFileName?: string;
  isEmptyProject?: boolean;
  transcript?: TranscriptSegment[];
}

export interface AIInsightMetrics {
  hookScore: number; // 85%
  hookStatus: 'Forte' | 'Moderado' | 'Fraco';
  pacingScore: number; // 72%
  pacingStatus: 'Moderado' | 'Rápido' | 'Lento';
  clarityScore: number; // 91%
  clarityStatus: 'Excelente' | 'Boa' | 'Ajustar';
  readabilityScore: number; // 95%
  readabilityStatus: 'Excelente' | 'Boa' | 'Baixa';
}

export interface RetentionMetric {
  id: string;
  label: string;
  score: number;
  status: string;
  subtext: string;
  color: string;
}

export interface RetentionPoint {
  timeSec: number;
  timeLabel: string;
  retentionPercent: number;
  dropWarning?: string;
  isPeak?: boolean;
  thumbnail?: string;
}

export interface AISuggestion {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  impact: string;
  type: 'cut' | 'broll' | 'audio' | 'caption' | 'pacing';
  actionLabel: string;
  applied?: boolean;
}

export interface ExportPreset {
  id: string;
  name: string;
  resolution: string;
  codec: string;
  fps: number;
  bitrate: string;
  estimatedSizeMb: number;
  recommendedFor: string;
}

export interface ExportSettings {
  format: 'MP4' | 'MOV';
  codec: 'H.264' | 'H.265' | 'ProRes';
  crf: number; // 14-34
  gpuAcceleration: boolean;
  resolution: string;
  fps: number;
  aspectRatio: VideoAspectRatio;
  estimatedTime: string;
  estimatedSize: string;
  payloadCheck: boolean;
}

export interface InspectorState {
  posX: number;
  posY: number;
  scale: number;
  rotation: number;
  anchorPoint: number;
  opacity: number;
  exposure: number;
  contrast: number;
  saturation: number;
  temperature: number;
  liftColor: string;
  gammaColor: string;
  gainColor: string;
}

export interface AutoDuckingConfig {
  enabled: boolean;
  reductionDb: number; // e.g. -16 dB
  thresholdDb: number; // e.g. -24 dB
  attackMs: number; // e.g. 50 ms
  releaseMs: number; // e.g. 400 ms
  normalizeLufs: number; // -14 LUFS standard
  vocalClarity: boolean;
}

export interface AutoFramingConfig {
  enabled: boolean;
  mode: 'single_speaker' | 'speaker_switch' | 'action_track';
  trackingSmoothness: number; // 0-100
  zoomLevel: number; // 1.0 - 2.5
  centerOffsetY: number; // -50 to 50%
}

export interface ThumbnailConfig {
  title: string;
  subtitle: string;
  badgeText: string;
  badgeColor: string;
  sticker: 'fire' | 'money' | 'warning' | 'star' | 'arrow' | 'none';
  filterStyle: 'clean' | 'high_contrast' | 'neon_glow' | 'vintage';
  aspectRatio: VideoAspectRatio;
  fontSize: number;
}

export interface HistoryItem {
  id: string;
  label: string;
  timestamp: string;
  clipsSnapshot: TimelineClip[];
}

