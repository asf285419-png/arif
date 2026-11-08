import { Chapter, TranscriptLine } from '../types/documentary';

/**
 * Converts "MM:SS" or "HH:MM:SS" string to total seconds.
 */
export function timeStringToSeconds(timeStr: string): number {
  if (!timeStr) return 0;
  const parts = timeStr.trim().split(':').map((p) => Number(p));
  if (parts.some((p) => isNaN(p))) return 0;
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  return 0;
}

/**
 * Formats total seconds into "MM:SS".
 */
export function secondsToTimeString(totalSeconds: number): string {
  if (isNaN(totalSeconds) || totalSeconds < 0) return '00:00';
  const m = Math.floor(totalSeconds / 60);
  const s = Math.floor(totalSeconds % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

/**
 * Finds the active chapter for a given audio playback time in seconds.
 */
export function findActiveChapter(currentTime: number, chapters: Chapter[]): Chapter {
  if (!chapters || chapters.length === 0) {
    throw new Error('Chapters list cannot be empty');
  }
  // Find chapter whose interval contains currentTime
  const matched = chapters.find(
    (ch) => currentTime >= ch.startTime && currentTime < ch.endTime
  );
  if (matched) return matched;

  // If before first chapter
  if (currentTime < chapters[0].startTime) {
    return chapters[0];
  }

  // If beyond last chapter, return the last one
  return chapters[chapters.length - 1];
}

/**
 * Finds the index of the active transcript line matching the current timestamp.
 * Uses binary search or backwards search for efficiency and precision.
 */
export function findActiveTranscriptIndex(
  currentTime: number,
  lines: TranscriptLine[]
): number {
  if (!lines || lines.length === 0) return -1;
  if (currentTime < lines[0].seconds) return 0;

  // Find the last line whose seconds is <= currentTime
  let low = 0;
  let high = lines.length - 1;
  let candidate = 0;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (lines[mid].seconds <= currentTime) {
      candidate = mid;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  return candidate;
}

/**
 * Filters transcript lines matching search query.
 */
export function searchTranscript(
  query: string,
  lines: TranscriptLine[]
): TranscriptLine[] {
  if (!query || !query.trim()) return lines;
  const normalized = query.toLowerCase().trim();
  return lines.filter(
    (l) =>
      l.text.toLowerCase().includes(normalized) ||
      l.timeStr.includes(normalized)
  );
}

/**
 * Returns completion percentage (0 - 100) for an active chapter.
 */
export function calculateChapterProgress(currentTime: number, chapter: Chapter): number {
  if (currentTime <= chapter.startTime) return 0;
  if (currentTime >= chapter.endTime) return 100;
  const duration = chapter.endTime - chapter.startTime;
  if (duration <= 0) return 100;
  return Math.min(100, Math.max(0, ((currentTime - chapter.startTime) / duration) * 100));
}
