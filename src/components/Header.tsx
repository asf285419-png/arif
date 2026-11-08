import React from 'react';
import { Play, Pause, Volume2, BookOpen } from 'lucide-react';

interface HeaderProps {
  activeTab: 'documentary' | 'video' | 'theatres' | 'dossier' | 'transcript';
  setActiveTab: (tab: 'documentary' | 'video' | 'theatres' | 'dossier' | 'transcript') => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  currentTimeFormatted: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isPlaying,
  onTogglePlay,
  currentTimeFormatted,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-800 bg-stone-950/90 backdrop-blur-md px-4 sm:px-8 py-3.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        {/* Zone 1: Single text wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('documentary')}
            className="text-left group cursor-pointer focus:outline-none"
            aria-label="Return to Documentary home"
          >
            <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-stone-100 group-hover:text-amber-400 transition-colors whitespace-nowrap shrink-0">
              WWII ARCHIVE <span className="text-amber-500 font-sans font-normal text-xs sm:text-sm tracking-widest uppercase ml-1">1939–1945</span>
            </span>
          </button>
        </div>

        {/* Zone 2: 5 single-line nav links */}
        <nav className="hidden md:flex items-center gap-5 lg:gap-7 text-sm font-medium text-stone-300">
          <button
            onClick={() => setActiveTab('video')}
            className={`cursor-pointer whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1.5 ${
              activeTab === 'video'
                ? 'text-amber-400 border-b-2 border-amber-500 font-semibold'
                : 'hover:text-stone-100'
            }`}
          >
            <span>Cinema Film</span>
          </button>
          <button
            onClick={() => setActiveTab('documentary')}
            className={`cursor-pointer whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'documentary'
                ? 'text-amber-400 border-b-2 border-amber-500 font-semibold'
                : 'hover:text-stone-100'
            }`}
          >
            Documentary
          </button>
          <button
            onClick={() => setActiveTab('theatres')}
            className={`cursor-pointer whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'theatres'
                ? 'text-amber-400 border-b-2 border-amber-500 font-semibold'
                : 'hover:text-stone-100'
            }`}
          >
            Theatres & Maps
          </button>
          <button
            onClick={() => setActiveTab('dossier')}
            className={`cursor-pointer whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'dossier'
                ? 'text-amber-400 border-b-2 border-amber-500 font-semibold'
                : 'hover:text-stone-100'
            }`}
          >
            Casualties & Records
          </button>
          <button
            onClick={() => setActiveTab('transcript')}
            className={`cursor-pointer whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'transcript'
                ? 'text-amber-400 border-b-2 border-amber-500 font-semibold'
                : 'hover:text-stone-100'
            }`}
          >
            Full Transcript
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onTogglePlay}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider bg-amber-500 hover:bg-amber-400 text-stone-950 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 whitespace-nowrap shrink-0"
            aria-label={isPlaying ? 'Pause audio narration' : 'Play audio narration'}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause</span>
                <span className="font-mono tabular-nums text-stone-900 opacity-80 hidden sm:inline">
                  {currentTimeFormatted}
                </span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Listen</span>
                <span className="font-mono tabular-nums text-stone-900 opacity-80 hidden sm:inline">
                  7:00
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
