import React from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Gauge,
  ListOrdered,
} from 'lucide-react';
import { Chapter } from '../types/documentary';
import { secondsToTimeString } from '../utils/audioSync';

interface AudioPlayerBarProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  playbackRate: number;
  onChangePlaybackRate: (rate: number) => void;
  volume: number;
  onChangeVolume: (vol: number) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  activeChapter: Chapter;
  chapters: Chapter[];
  onSelectChapter: (chapter: Chapter) => void;
  autoScroll: boolean;
  onToggleAutoScroll: () => void;
}

export const AudioPlayerBar: React.FC<AudioPlayerBarProps> = ({
  isPlaying,
  onTogglePlay,
  currentTime,
  duration,
  onSeek,
  playbackRate,
  onChangePlaybackRate,
  volume,
  onChangeVolume,
  isMuted,
  onToggleMute,
  activeChapter,
  chapters,
  onSelectChapter,
  autoScroll,
  onToggleAutoScroll,
}) => {
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleSkip = (seconds: number) => {
    const nextTime = Math.min(Math.max(0, currentTime + seconds), duration);
    onSeek(nextTime);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    onSeek(val);
  };

  return (
    <aside aria-label="Audio Narration Player" className="sticky bottom-0 z-40 w-full border-t border-stone-800 bg-stone-950/95 backdrop-blur-lg px-4 sm:px-6 py-3 shadow-2xl transition-all">
      <div className="max-w-7xl mx-auto flex flex-col gap-2">
        {/* Top Mini Progress Bar */}
        <div className="flex items-center gap-3">
          <span className="font-mono tabular-nums text-xs text-stone-400 w-11 text-right">
            {secondsToTimeString(currentTime)}
          </span>
          <div className="relative flex-1 group flex items-center">
            <input
              type="range"
              min="0"
              max={duration || 420.5}
              step="0.5"
              value={currentTime}
              onChange={handleSliderChange}
              aria-label="Seek audio position"
              className="w-full h-1.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-400"
            />
          </div>
          <span className="font-mono tabular-nums text-xs text-stone-500 w-11">
            {secondsToTimeString(duration || 420.5)}
          </span>
        </div>

        {/* Controls Row */}
        <div className="flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap">
          {/* Active Chapter Details */}
          <div className="flex items-center gap-3 min-w-0 max-w-sm lg:max-w-md">
            <div className="hidden sm:flex flex-col text-left truncate">
              <span className="text-[10px] uppercase font-sans tracking-widest text-amber-500/90 truncate">
                {activeChapter.number !== null ? `Chapter ${activeChapter.number}` : 'Prologue'} · {activeChapter.timeRange}
              </span>
              <span className="text-xs sm:text-sm font-serif font-medium text-stone-100 truncate">
                {activeChapter.title}
              </span>
            </div>

            {/* Quick Chapter Selector Dropdown */}
            <div className="relative inline-block text-left">
              <select
                value={activeChapter.id}
                onChange={(e) => {
                  const target = chapters.find((c) => c.id === e.target.value);
                  if (target) onSelectChapter(target);
                }}
                className="bg-stone-900 border border-stone-800 text-stone-300 text-xs rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer max-w-[140px] sm:max-w-[170px] truncate"
                aria-label="Select documentary chapter"
              >
                {chapters.map((ch) => (
                  <option key={ch.id} value={ch.id}>
                    {ch.number !== null ? `${ch.number}. ` : ''}{ch.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Central Playback Controls */}
          <div className="flex items-center gap-2 sm:gap-4 mx-auto">
            <button
              onClick={() => handleSkip(-10)}
              className="p-1.5 text-stone-400 hover:text-stone-100 transition-colors cursor-pointer rounded hover:bg-stone-900"
              title="Rewind 10 seconds"
              aria-label="Rewind 10 seconds"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={onTogglePlay}
              className="w-10 h-10 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 flex items-center justify-center transition-all shadow cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-300"
              aria-label={isPlaying ? 'Pause narration' : 'Play narration'}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current ml-0.5" />
              )}
            </button>

            <button
              onClick={() => handleSkip(10)}
              className="p-1.5 text-stone-400 hover:text-stone-100 transition-colors cursor-pointer rounded hover:bg-stone-900"
              title="Forward 10 seconds"
              aria-label="Forward 10 seconds"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>

          {/* Secondary Controls: Speed, Volume, Auto-scroll */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0 text-xs text-stone-400">
            {/* Speed toggle */}
            <div className="flex items-center gap-1">
              <Gauge className="w-3.5 h-3.5 text-stone-500 hidden sm:inline" />
              {[0.75, 1.0, 1.25, 1.5].map((rate) => (
                <button
                  key={rate}
                  onClick={() => onChangePlaybackRate(rate)}
                  className={`px-1.5 py-0.5 rounded transition-colors text-[11px] font-mono cursor-pointer ${
                    playbackRate === rate
                      ? 'bg-amber-500/20 text-amber-400 font-semibold'
                      : 'hover:text-stone-200'
                  }`}
                  aria-label={`Set speed to ${rate}x`}
                >
                  {rate}x
                </button>
              ))}
            </div>

            {/* Auto scroll toggle */}
            <button
              onClick={onToggleAutoScroll}
              className={`hidden md:flex items-center gap-1.5 px-2 py-1 rounded transition-colors cursor-pointer text-xs ${
                autoScroll
                  ? 'text-amber-400 bg-amber-950/40 border border-amber-800/50'
                  : 'text-stone-500 hover:text-stone-300'
              }`}
              title="Follow spoken lines automatically"
              aria-label={autoScroll ? 'Disable auto scroll' : 'Enable auto scroll'}
            >
              <ListOrdered className="w-3.5 h-3.5" />
              <span>Follow</span>
            </button>

            {/* Volume control */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={onToggleMute}
                className="p-1 text-stone-400 hover:text-stone-200 transition-colors cursor-pointer"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
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
                aria-label="Volume slider"
                className="w-16 h-1 bg-stone-800 rounded appearance-none accent-amber-500 cursor-pointer hidden sm:inline-block"
              />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
