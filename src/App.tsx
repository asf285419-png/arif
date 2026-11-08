/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { DocumentaryPlayerView } from './components/DocumentaryPlayerView';
import { ChapterGallery } from './components/ChapterGallery';
import { TheatreInteractiveMap } from './components/TheatreInteractiveMap';
import { HistoricalDossier } from './components/HistoricalDossier';
import { FullTranscriptView } from './components/FullTranscriptView';
import { AudioPlayerBar } from './components/AudioPlayerBar';
import { Footer } from './components/Footer';
import {
  CHAPTERS,
  TRANSCRIPT_LINES,
  AUDIO_FILE_PATH,
  TOTAL_AUDIO_DURATION_SEC,
} from './data/documentaryData';
import {
  findActiveChapter,
  findActiveTranscriptIndex,
  secondsToTimeString,
} from './utils/audioSync';
import { Chapter } from './types/documentary';

import { CinematicVideoPlayer } from './components/CinematicVideoPlayer';

export default function App() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [activeTab, setActiveTab] = useState<'documentary' | 'video' | 'theatres' | 'dossier' | 'transcript'>('documentary');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(TOTAL_AUDIO_DURATION_SEC);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [volume, setVolume] = useState<number>(1.0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [autoScroll, setAutoScroll] = useState<boolean>(true);

  // Scroll to top when tab changes
  const handleTabChange = (tab: 'documentary' | 'video' | 'theatres' | 'dossier' | 'transcript') => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Sync playback rate and volume to audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [playbackRate, volume, isMuted]);

  // Handle audio time updates
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current && !isNaN(audioRef.current.duration)) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn('Playback request error:', err);
        });
    }
  };

  const handleSeek = (seconds: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = seconds;
    setCurrentTime(seconds);
    if (!isPlaying) {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.warn('Play on seek error:', err));
    }
  };

  const handleSelectChapter = (ch: Chapter) => {
    handleSeek(ch.startTime);
  };

  // Derive active chapter and transcript line based on currentTime
  const activeChapter = findActiveChapter(currentTime, CHAPTERS);
  const activeTranscriptIndex = findActiveTranscriptIndex(currentTime, TRANSCRIPT_LINES);

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-amber-900/60 selection:text-amber-100">
      {/* Hidden Native Audio Element */}
      <audio
        ref={audioRef}
        src={AUDIO_FILE_PATH}
        preload="auto"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Top Bar Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        isPlaying={isPlaying}
        onTogglePlay={togglePlay}
        currentTimeFormatted={secondsToTimeString(currentTime)}
      />

      {/* Main Content Areas */}
      <main className="flex-1 pb-16">
        {activeTab === 'video' && (
          <CinematicVideoPlayer
            isPlaying={isPlaying}
            onTogglePlay={togglePlay}
            currentTime={currentTime}
            duration={duration}
            onSeek={handleSeek}
            activeChapter={activeChapter}
            chapters={CHAPTERS}
            onSelectChapter={handleSelectChapter}
            transcriptLines={TRANSCRIPT_LINES}
            activeTranscriptIndex={activeTranscriptIndex}
            playbackRate={playbackRate}
            onChangePlaybackRate={setPlaybackRate}
            volume={volume}
            onChangeVolume={setVolume}
            isMuted={isMuted}
            onToggleMute={() => setIsMuted((prev) => !prev)}
          />
        )}

        {activeTab === 'documentary' && (
          <>
            <HeroSection
              isPlaying={isPlaying}
              onTogglePlay={togglePlay}
              onSelectChapter={handleSelectChapter}
              chapters={CHAPTERS}
              onOpenTheatres={() => handleTabChange('theatres')}
              onOpenVideo={() => handleTabChange('video')}
            />
            <DocumentaryPlayerView
              activeChapter={activeChapter}
              chapters={CHAPTERS}
              onSelectChapter={handleSelectChapter}
              transcriptLines={TRANSCRIPT_LINES}
              activeTranscriptIndex={activeTranscriptIndex}
              onSeek={handleSeek}
              isPlaying={isPlaying}
              onTogglePlay={togglePlay}
              currentTime={currentTime}
              autoScroll={autoScroll}
              onToggleAutoScroll={() => setAutoScroll((prev) => !prev)}
            />
            <ChapterGallery
              chapters={CHAPTERS}
              activeChapter={activeChapter}
              onSelectChapter={handleSelectChapter}
            />
          </>
        )}

        {activeTab === 'theatres' && (
          <TheatreInteractiveMap
            onSeek={handleSeek}
            isPlaying={isPlaying}
            onTogglePlay={togglePlay}
          />
        )}

        {activeTab === 'dossier' && <HistoricalDossier />}

        {activeTab === 'transcript' && (
          <FullTranscriptView
            chapters={CHAPTERS}
            transcriptLines={TRANSCRIPT_LINES}
            activeTranscriptIndex={activeTranscriptIndex}
            onSeek={handleSeek}
            isPlaying={isPlaying}
            onTogglePlay={togglePlay}
          />
        )}
      </main>

      {/* Bottom Sticky Audio Player */}
      <AudioPlayerBar
        isPlaying={isPlaying}
        onTogglePlay={togglePlay}
        currentTime={currentTime}
        duration={duration}
        onSeek={handleSeek}
        playbackRate={playbackRate}
        onChangePlaybackRate={setPlaybackRate}
        volume={volume}
        onChangeVolume={setVolume}
        isMuted={isMuted}
        onToggleMute={() => setIsMuted((prev) => !prev)}
        activeChapter={activeChapter}
        chapters={CHAPTERS}
        onSelectChapter={handleSelectChapter}
        autoScroll={autoScroll}
        onToggleAutoScroll={() => setAutoScroll((prev) => !prev)}
      />

      {/* Historical Footer */}
      <Footer />
    </div>
  );
}
