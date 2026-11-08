import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Subtitles,
  Film,
  Sparkles,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { Chapter, TranscriptLine } from '../types/documentary';
import { secondsToTimeString } from '../utils/audioSync';

interface CinematicVideoPlayerProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  currentTime: number;
  duration: number;
  onSeek: (seconds: number) => void;
  activeChapter: Chapter;
  chapters: Chapter[];
  onSelectChapter: (ch: Chapter) => void;
  transcriptLines: TranscriptLine[];
  activeTranscriptIndex: number;
  playbackRate: number;
  onChangePlaybackRate: (rate: number) => void;
  volume: number;
  onChangeVolume: (vol: number) => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const CinematicVideoPlayer: React.FC<CinematicVideoPlayerProps> = ({
  isPlaying,
  onTogglePlay,
  currentTime,
  duration,
  onSeek,
  activeChapter,
  chapters,
  onSelectChapter,
  transcriptLines,
  activeTranscriptIndex,
  playbackRate,
  onChangePlaybackRate,
  volume,
  onChangeVolume,
  isMuted,
  onToggleMute,
}) => {
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [vintageGrain, setVintageGrain] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const currentSpokenLine = transcriptLines[activeTranscriptIndex]?.text || '';

  // Auto-hide controls during playback after 3 seconds of inactivity
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3500);
    }
  };

  const toggleFullscreen = () => {
    if (!videoContainerRef.current) return;
    if (!document.fullscreenElement) {
      videoContainerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-8 py-6 sm:py-10">
      {/* Title & Mode Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 pb-4 border-b border-stone-800">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-amber-500 font-sans font-medium mb-1">
            <Film className="w-3.5 h-3.5 text-amber-500" />
            <span>Cinematic Historical Screen</span>
            <span aria-hidden="true">·</span>
            <span>Documentary Presentation</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-stone-100">
            World War II: The Full Film Experience
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 font-sans mt-0.5">
            Synchronized archival newsreel visuals, on-screen subtitles, lower-third contextual placards, and voice narration.
          </p>
        </div>

        {/* Video Mode Badges & Toggles */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setVintageGrain((prev) => !prev)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-sans transition-colors cursor-pointer ${
              vintageGrain
                ? 'bg-amber-950/40 border-amber-800/60 text-amber-300'
                : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
            }`}
            title="Toggle 1940s newsreel film texture"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{vintageGrain ? 'Vintage Grain ON' : 'Pristine Clean'}</span>
          </button>

          <button
            onClick={() => setShowSubtitles((prev) => !prev)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-sans transition-colors cursor-pointer ${
              showSubtitles
                ? 'bg-amber-500 text-stone-950 font-semibold border-amber-400'
                : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
            }`}
            title="Toggle closed caption subtitles"
          >
            <Subtitles className="w-3.5 h-3.5" />
            <span>{showSubtitles ? 'CC Active' : 'CC Muted'}</span>
          </button>
        </div>
      </div>

      {/* Main 16:9 Video Canvas Frame */}
      <div
        ref={videoContainerRef}
        onMouseMove={handleMouseMove}
        onClick={(e) => {
          // If clicked directly on the frame (not on control buttons), toggle play
          if ((e.target as HTMLElement).tagName !== 'BUTTON' && (e.target as HTMLElement).tagName !== 'INPUT' && (e.target as HTMLElement).tagName !== 'SELECT') {
            onTogglePlay();
          }
        }}
        className="relative w-full aspect-[16/9] bg-black rounded-xl sm:rounded-2xl overflow-hidden border border-stone-800 shadow-2xl select-none group cursor-pointer"
      >
        {/* Animated Image Slideshow (Ken Burns Effect) */}
        {activeChapter.imagePath && (
          <div className="absolute inset-0 w-full h-full overflow-hidden">
            <img
              key={activeChapter.id}
              src={activeChapter.imagePath}
              alt={activeChapter.imageAlt || activeChapter.title}
              referrerPolicy="no-referrer"
              className={`w-full h-full object-cover object-center filter contrast-105 brightness-90 transition-all duration-1000 ${
                isPlaying ? 'scale-105 translate-y-[-1%]' : 'scale-100'
              }`}
              style={{
                transitionProperty: 'transform, filter',
                transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            />
          </div>
        )}

        {/* Vintage Film Grain & Vignette Overlay */}
        {vintageGrain && (
          <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-40 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.85)_100%)]" />
        )}

        {/* Top Video Header: Chapter Placard & Audio Visualizer */}
        <div
          className={`absolute top-0 inset-x-0 p-4 sm:p-6 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex items-start justify-between transition-opacity duration-300 pointer-events-none ${
            showControls ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="flex flex-col">
            <span className="font-mono uppercase text-[11px] tracking-widest text-amber-400 font-semibold drop-shadow">
              {activeChapter.number !== null ? `CHAPTER 0${activeChapter.number}` : 'DOCUMENTARY PROLOGUE'} · {activeChapter.theater}
            </span>
            <span className="font-serif text-lg sm:text-2xl font-bold text-white drop-shadow-md">
              {activeChapter.title}
            </span>
          </div>

          {/* Voice Activity Waves Indicator */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-stone-700/80">
            <div className={`w-1.5 h-3 rounded-full bg-amber-400 ${isPlaying ? 'animate-pulse' : 'opacity-40'}`} />
            <div className={`w-1.5 h-5 rounded-full bg-amber-400 ${isPlaying ? 'animate-pulse delay-75' : 'opacity-40'}`} />
            <div className={`w-1.5 h-2.5 rounded-full bg-amber-400 ${isPlaying ? 'animate-pulse delay-150' : 'opacity-40'}`} />
            <span className="text-[11px] font-sans font-medium text-stone-200 ml-1.5">
              {isPlaying ? 'Narration Live' : 'Paused'}
            </span>
          </div>
        </div>

        {/* Big Central Play/Pause Watermark Overlay when paused */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] transition-all">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-amber-500/90 text-stone-950 flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
              <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-current ml-1" />
            </div>
          </div>
        )}

        {/* Lower Third Historical Metadata Placard */}
        <div
          className={`absolute bottom-20 left-4 sm:left-6 max-w-sm sm:max-w-md p-3 rounded-lg bg-black/80 backdrop-blur-md border border-stone-800 text-left transition-opacity duration-300 pointer-events-none hidden sm:block ${
            showControls ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="text-[10px] font-sans uppercase tracking-widest text-amber-500 font-semibold mb-0.5">
            Archival Record · {activeChapter.timeRange}
          </div>
          <p className="text-xs font-serif italic text-stone-300 line-clamp-2">
            {activeChapter.imageCaption || activeChapter.subtitle}
          </p>
        </div>

        {/* Closed Captions / Subtitles Overlay (Always centered above the controls) */}
        {showSubtitles && currentSpokenLine && (
          <div className="absolute bottom-16 sm:bottom-20 inset-x-4 sm:inset-x-12 flex justify-center pointer-events-none z-20">
            <div className="px-4 py-2 rounded-lg bg-black/85 backdrop-blur-md border border-stone-700/60 max-w-3xl text-center shadow-2xl">
              <p className="font-serif text-sm sm:text-base lg:text-lg font-medium text-amber-100 tracking-wide leading-relaxed drop-shadow">
                "{currentSpokenLine}"
              </p>
            </div>
          </div>
        )}

        {/* Cinematic OSD Control Bar at Bottom */}
        <div
          onClick={(e) => e.stopPropagation()}
          className={`absolute bottom-0 inset-x-0 p-3 sm:p-5 bg-gradient-to-t from-black via-black/80 to-transparent flex flex-col gap-2 transition-opacity duration-300 z-30 ${
            showControls || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Timeline scrub bar with Chapter Notches */}
          <div className="relative w-full flex items-center group/scrub">
            <input
              type="range"
              min="0"
              max={duration || 420.5}
              step="0.5"
              value={currentTime}
              onChange={(e) => onSeek(parseFloat(e.target.value))}
              aria-label="Video scrubber"
              className="w-full h-2 bg-stone-800/80 rounded-lg appearance-none cursor-pointer accent-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-400"
            />
            {/* Chapter Notches on Timeline */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none px-1">
              {chapters.map((ch) => {
                const notchPercent = (ch.startTime / (duration || 420.5)) * 100;
                return (
                  <div
                    key={ch.id}
                    className="absolute w-1 h-3 bg-amber-400/70 rounded-full -translate-x-1/2"
                    style={{ left: `${notchPercent}%` }}
                    title={`${ch.title} (${secondsToTimeString(ch.startTime)})`}
                  />
                );
              })}
            </div>
          </div>

          {/* Bottom Controls Row */}
          <div className="flex items-center justify-between text-xs text-stone-300">
            {/* Left: Play, Skip, Timecode */}
            <div className="flex items-center gap-3">
              <button
                onClick={onTogglePlay}
                className="w-8 h-8 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 flex items-center justify-center transition-all cursor-pointer"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 fill-current" />
                ) : (
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                )}
              </button>

              <button
                onClick={() => onSeek(Math.max(0, currentTime - 10))}
                className="p-1 text-stone-400 hover:text-white transition-colors cursor-pointer"
                title="Rewind 10 seconds"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={() => onSeek(Math.min(duration, currentTime + 10))}
                className="p-1 text-stone-400 hover:text-white transition-colors cursor-pointer"
                title="Skip 10 seconds"
              >
                <RotateCw className="w-4 h-4" />
              </button>

              <div className="font-mono text-xs tabular-nums text-stone-300 ml-1">
                <span className="text-amber-400 font-semibold">{secondsToTimeString(currentTime)}</span>
                <span className="text-stone-600 mx-1">/</span>
                <span>{secondsToTimeString(duration || 420.5)}</span>
              </div>
            </div>

            {/* Right: CC, Speed, Volume, Fullscreen */}
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={() => setShowSubtitles((p) => !p)}
                className={`p-1.5 rounded transition-colors cursor-pointer ${
                  showSubtitles ? 'text-amber-400 bg-stone-900' : 'text-stone-500 hover:text-stone-300'
                }`}
                title="Subtitles (CC)"
              >
                <Subtitles className="w-4 h-4" />
              </button>

              {/* Playback speed */}
              <div className="hidden sm:flex items-center gap-1">
                {[0.75, 1.0, 1.25, 1.5].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => onChangePlaybackRate(rate)}
                    className={`px-1.5 py-0.5 rounded text-[11px] font-mono cursor-pointer transition-colors ${
                      playbackRate === rate
                        ? 'bg-amber-500 text-stone-950 font-bold'
                        : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>

              {/* Volume */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={onToggleMute}
                  className="p-1 text-stone-400 hover:text-white cursor-pointer"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-4 h-4 text-rose-400" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => onChangeVolume(parseFloat(e.target.value))}
                  className="w-16 h-1 bg-stone-800 rounded appearance-none accent-amber-500 cursor-pointer hidden md:inline-block"
                />
              </div>

              {/* Fullscreen */}
              <button
                onClick={toggleFullscreen}
                className="p-1.5 text-stone-400 hover:text-white transition-colors cursor-pointer"
                title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              >
                {isFullscreen ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Chapter Selection Strip beneath the video */}
      <div className="mt-6 flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs text-stone-400">
          <span className="font-sans uppercase tracking-wider text-amber-500 font-medium">
            Jump to Film Chapter
          </span>
          <span className="text-stone-500 font-sans">
            Click thumbnail to jump video & narration
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {chapters.slice(0, 5).map((ch) => {
            const isCur = ch.id === activeChapter.id;
            return (
              <button
                key={ch.id}
                onClick={() => onSelectChapter(ch)}
                className={`text-left p-2.5 rounded-lg border transition-all cursor-pointer flex flex-col justify-between ${
                  isCur
                    ? 'bg-amber-950/40 border-amber-500 text-stone-100 shadow'
                    : 'bg-stone-900/60 border-stone-800 text-stone-400 hover:bg-stone-900 hover:text-stone-200'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-sans uppercase tracking-wider text-amber-500 mb-1">
                  <span>{ch.number !== null ? `Ch. 0${ch.number}` : 'Prologue'}</span>
                  <span className="font-mono tabular-nums text-stone-400">{ch.timeRange.split('–')[0].trim()}</span>
                </div>
                <div className="font-serif text-xs font-semibold truncate text-stone-200">
                  {ch.title}
                </div>
              </button>
            );
          })}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {chapters.slice(5).map((ch) => {
            const isCur = ch.id === activeChapter.id;
            return (
              <button
                key={ch.id}
                onClick={() => onSelectChapter(ch)}
                className={`text-left p-2.5 rounded-lg border transition-all cursor-pointer flex flex-col justify-between ${
                  isCur
                    ? 'bg-amber-950/40 border-amber-500 text-stone-100 shadow'
                    : 'bg-stone-900/60 border-stone-800 text-stone-400 hover:bg-stone-900 hover:text-stone-200'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-sans uppercase tracking-wider text-amber-500 mb-1">
                  <span>Ch. 0{ch.number}</span>
                  <span className="font-mono tabular-nums text-stone-400">{ch.timeRange.split('–')[0].trim()}</span>
                </div>
                <div className="font-serif text-xs font-semibold truncate text-stone-200">
                  {ch.title}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
