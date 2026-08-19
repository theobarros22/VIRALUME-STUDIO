import { TranscriptSegment } from '../types';

// Format seconds into SRT timecode: 00:00:01,230
export function formatSRTTime(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const millis = Math.floor((seconds % 1) * 1000);

  const pad = (n: number, z = 2) => String(n).padStart(z, '0');
  return `${pad(hrs)}:${pad(mins)}:${pad(secs)},${pad(millis, 3)}`;
}

// Format seconds into VTT timecode: 00:00:01.230
export function formatVTTTime(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const millis = Math.floor((seconds % 1) * 1000);

  const pad = (n: number, z = 2) => String(n).padStart(z, '0');
  return `${pad(hrs)}:${pad(mins)}:${pad(secs)}.${pad(millis, 3)}`;
}

// Generate complete SRT string from transcription segments
export function generateSRT(segments: TranscriptSegment[]): string {
  let srtContent = '';
  let index = 1;

  for (const seg of segments) {
    const start = formatSRTTime(seg.start);
    const end = formatSRTTime(seg.end);
    srtContent += `${index}\n${start} --> ${end}\n${seg.text.trim()}\n\n`;
    index++;
  }

  return srtContent.trim();
}

// Generate complete WebVTT string from transcription segments
export function generateVTT(segments: TranscriptSegment[]): string {
  let vttContent = 'WEBVTT - Gerado pelo Viralume Studio\n\n';
  let index = 1;

  for (const seg of segments) {
    const start = formatVTTTime(seg.start);
    const end = formatVTTTime(seg.end);
    vttContent += `${index}\n${start} --> ${end}\n${seg.text.trim()}\n\n`;
    index++;
  }

  return vttContent.trim();
}

// Helper to trigger direct client-side file download
export function downloadTextFile(content: string, filename: string, mimeType: string = 'text/plain') {
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

