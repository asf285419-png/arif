import test from 'node:test';
import assert from 'node:assert/strict';
import {
  timeStringToSeconds,
  secondsToTimeString,
  findActiveChapter,
  findActiveTranscriptIndex,
  calculateChapterProgress,
  searchTranscript,
} from './audioSync';
import { Chapter, TranscriptLine } from '../types/documentary';

const mockChapters: Chapter[] = [
  {
    id: 'intro',
    number: null,
    title: 'Introduction',
    subtitle: 'The War That Changed the World',
    timeRange: '00:00 - 00:39',
    startTime: 0,
    endTime: 40,
    summary: 'Overview of the devastating global conflict.',
    keyLeaders: ['Roosevelt', 'Churchill', 'Hitler', 'Stalin'],
    theater: 'Global',
    keyBattles: [],
    historicalSignificance: '6-year total war that remade the international order.',
  },
  {
    id: 'ch1',
    number: 1,
    title: 'The Roots of War',
    subtitle: 'Treaty of Versailles to Rise of Totalitarianism',
    timeRange: '00:40 - 01:39',
    startTime: 40,
    endTime: 100,
    summary: 'Post-WWI economic crises and Hitler rise to power.',
    keyLeaders: ['Adolf Hitler', 'Benito Mussolini'],
    theater: 'Europe & Asia',
    keyBattles: [],
    historicalSignificance: 'Fragility of the interwar peace and the rise of fascism.',
  },
  {
    id: 'ch2',
    number: 2,
    title: 'The Beginning of World War II',
    subtitle: 'Invasion of Poland & the Blitzkrieg',
    timeRange: '01:40 - 02:32',
    startTime: 100,
    endTime: 153,
    summary: 'Blitzkrieg in Poland, fall of France, Battle of Britain.',
    keyLeaders: ['Winston Churchill', 'Adolf Hitler'],
    theater: 'Western Europe',
    keyBattles: ['Invasion of Poland', 'Fall of France', 'Battle of Britain'],
    historicalSignificance: 'Outbreak of global war in Europe.',
  },
];

const mockLines: TranscriptLine[] = [
  { id: '1', timeStr: '00:00', seconds: 0, text: 'World War II 1939 to 1945', chapterId: 'intro' },
  { id: '2', timeStr: '00:20', seconds: 20, text: 'A war that lasted six years', chapterId: 'intro' },
  { id: '3', timeStr: '00:40', seconds: 40, text: 'Chapter 1: The roots of war', chapterId: 'ch1' },
  { id: '4', timeStr: '01:00', seconds: 60, text: 'Treaty of Versailles forced Germany', chapterId: 'ch1' },
  { id: '5', timeStr: '01:40', seconds: 100, text: 'Chapter 2: The beginning of World War II', chapterId: 'ch2' },
];

test('timeStringToSeconds parses strings accurately', () => {
  assert.equal(timeStringToSeconds('00:00'), 0);
  assert.equal(timeStringToSeconds('01:30'), 90);
  assert.equal(timeStringToSeconds('05:03'), 303);
  assert.equal(timeStringToSeconds('01:10:05'), 4205);
  assert.equal(timeStringToSeconds('invalid'), 0);
});

test('secondsToTimeString formats numbers correctly', () => {
  assert.equal(secondsToTimeString(0), '00:00');
  assert.equal(secondsToTimeString(65), '01:05');
  assert.equal(secondsToTimeString(303), '05:03');
  assert.equal(secondsToTimeString(420.48), '07:00');
});

test('findActiveChapter detects correct chapter at various timestamps', () => {
  assert.equal(findActiveChapter(0, mockChapters).id, 'intro');
  assert.equal(findActiveChapter(25, mockChapters).id, 'intro');
  assert.equal(findActiveChapter(40, mockChapters).id, 'ch1');
  assert.equal(findActiveChapter(99, mockChapters).id, 'ch1');
  assert.equal(findActiveChapter(100, mockChapters).id, 'ch2');
  assert.equal(findActiveChapter(120, mockChapters).id, 'ch2');
  // edge: beyond max should return last chapter
  assert.equal(findActiveChapter(999, mockChapters).id, 'ch2');
});

test('findActiveTranscriptIndex locates closest line without exceeding currentTime', () => {
  assert.equal(findActiveTranscriptIndex(0, mockLines), 0);
  assert.equal(findActiveTranscriptIndex(15, mockLines), 0);
  assert.equal(findActiveTranscriptIndex(20, mockLines), 1);
  assert.equal(findActiveTranscriptIndex(39, mockLines), 1);
  assert.equal(findActiveTranscriptIndex(40, mockLines), 2);
  assert.equal(findActiveTranscriptIndex(75, mockLines), 3);
  assert.equal(findActiveTranscriptIndex(100, mockLines), 4);
  assert.equal(findActiveTranscriptIndex(150, mockLines), 4);
});

test('calculateChapterProgress calculates 0 to 100 percentage', () => {
  const ch1 = mockChapters[1]; // 40s to 100s (duration 60s)
  assert.equal(calculateChapterProgress(40, ch1), 0);
  assert.equal(calculateChapterProgress(70, ch1), 50);
  assert.equal(calculateChapterProgress(100, ch1), 100);
  assert.equal(calculateChapterProgress(150, ch1), 100);
  assert.equal(calculateChapterProgress(10, ch1), 0);
});

test('searchTranscript filters text correctly', () => {
  const result = searchTranscript('Versailles', mockLines);
  assert.equal(result.length, 1);
  assert.equal(result[0].id, '4');

  const emptyResult = searchTranscript('Nonexistent', mockLines);
  assert.equal(emptyResult.length, 0);

  const allResult = searchTranscript('', mockLines);
  assert.equal(allResult.length, 5);
});
