import React, { useRef, useEffect, useState } from 'react';
import {
  Play,
  Search,
  Quote,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Users,
  Swords,
  ScrollText,
  Volume2,
} from 'lucide-react';
import { Chapter, TranscriptLine } from '../types/documentary';
import { calculateChapterProgress, searchTranscript } from '../utils/audioSync';

interface DocumentaryPlayerViewProps {
  activeChapter: Chapter;
  chapters: Chapter[];
  onSelectChapter: (chapter: Chapter) => void;
  transcriptLines: TranscriptLine[];
  activeTranscriptIndex: number;
  onSeek: (seconds: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  currentTime: number;
  autoScroll: boolean;
  onToggleAutoScroll: () => void;
}

export const DocumentaryPlayerView: React.FC<DocumentaryPlayerViewProps> = ({
  activeChapter,
  chapters,
  onSelectChapter,
  transcriptLines,
  activeTranscriptIndex,
  onSeek,
  isPlaying,
  onTogglePlay,
  currentTime,
  autoScroll,
  onToggleAutoScroll,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const transcriptScrollContainerRef = useRef<HTMLDivElement>(null);
  const activeLineRef = useRef<HTMLDivElement>(null);

  // Auto-scroll the transcript to follow current spoken line
  useEffect(() => {
    if (autoScroll && activeLineRef.current && transcriptScrollContainerRef.current) {
      const container = transcriptScrollContainerRef.current;
      const element = activeLineRef.current;
      const containerRect = container.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();

      // If element is out of visible view or near boundaries, scroll smoothly into view
      if (
        elementRect.top < containerRect.top + 60 ||
        elementRect.bottom > containerRect.bottom - 60
      ) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }
  }, [activeTranscriptIndex, autoScroll]);

  const currentIndex = chapters.findIndex((c) => c.id === activeChapter.id);
  const prevChapter = currentIndex > 0 ? chapters[currentIndex - 1] : null;
  const nextChapter = currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null;

  const filteredLines = searchTranscript(searchQuery, transcriptLines);
  const chapterProgress = calculateChapterProgress(currentTime, activeChapter);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Active Chapter Spotlight (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Chapter Header Ribbon */}
          <div className="flex items-center justify-between border-b border-stone-800 pb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-sans tracking-widest text-amber-500 font-semibold">
                {activeChapter.number !== null ? `Chapter 0${activeChapter.number}` : 'Prologue'}
              </span>
              <span className="text-stone-600">·</span>
              <span className="text-xs font-mono text-stone-400 tabular-nums">
                {activeChapter.timeRange}
              </span>
            </div>

            {/* Chapter Prev / Next pagination */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => prevChapter && onSelectChapter(prevChapter)}
                disabled={!prevChapter}
                className="p-1 rounded text-stone-400 hover:text-stone-100 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-stone-900 transition-colors"
                aria-label="Previous chapter"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-xs text-stone-500 font-sans">
                {currentIndex + 1} of {chapters.length}
              </span>
              <button
                onClick={() => nextChapter && onSelectChapter(nextChapter)}
                disabled={!nextChapter}
                className="p-1 rounded text-stone-400 hover:text-stone-100 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-stone-900 transition-colors"
                aria-label="Next chapter"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Chapter Title & Subtitle */}
          <div>
            <h2 className="font-serif text-2xl sm:text-4xl font-semibold text-stone-100 leading-tight">
              {activeChapter.title}
            </h2>
            <p className="mt-1 text-sm sm:text-base font-serif italic text-amber-400/90">
              {activeChapter.subtitle}
            </p>
          </div>

          {/* Chapter Progress bar */}
          <div className="w-full bg-stone-900 h-1.5 rounded-full overflow-hidden border border-stone-800">
            <div
              className="bg-amber-500 h-full transition-all duration-300"
              style={{ width: `${chapterProgress}%` }}
            />
          </div>

          {/* Archival Visual Media Presentation */}
          {activeChapter.imagePath && (
            <div className="relative rounded-lg overflow-hidden border border-stone-800 bg-stone-900 group shadow-xl">
              <div className="aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden bg-stone-950">
                <img
                  src={activeChapter.imagePath}
                  alt={activeChapter.imageAlt || activeChapter.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center filter sepia-[0.1] contrast-105 group-hover:scale-[1.02] transition-transform duration-500"
                />
              </div>
              <div className="p-3 bg-stone-950/90 border-t border-stone-800 text-xs font-serif italic text-stone-400 flex items-center justify-between">
                <span>{activeChapter.imageCaption || activeChapter.title}</span>
                <span className="text-[11px] font-sans tracking-wider uppercase text-amber-500/80 not-italic ml-2 shrink-0">
                  Historical Record
                </span>
              </div>
            </div>
          )}

          {/* Narrative Summary */}
          <div className="prose prose-invert max-w-none text-stone-300 text-sm sm:text-base leading-relaxed font-sans font-light">
            <p className="first-letter:text-4xl first-letter:font-serif first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:text-amber-500 first-letter:leading-none">
              {activeChapter.summary}
            </p>
          </div>

          {/* Curatorial Quote */}
          {activeChapter.quote && (
            <div className="p-4 sm:p-5 rounded-lg border border-stone-800/80 bg-stone-900/40 relative">
              <Quote className="w-6 h-6 text-amber-500/30 absolute top-3 left-3 -z-0" />
              <p className="font-serif italic text-base sm:text-lg text-stone-200 relative z-10 pl-5">
                "{activeChapter.quote}"
              </p>
            </div>
          )}

          {/* Strategic Context Grid: Theater, Leaders, Battles */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-lg bg-stone-900/60 border border-stone-800/80">
              <div className="flex items-center gap-1.5 text-xs text-amber-500 uppercase tracking-wider font-sans font-medium mb-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>Primary Theatre</span>
              </div>
              <p className="text-xs sm:text-sm text-stone-200 font-serif">
                {activeChapter.theater}
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-stone-900/60 border border-stone-800/80">
              <div className="flex items-center gap-1.5 text-xs text-amber-500 uppercase tracking-wider font-sans font-medium mb-1">
                <Users className="w-3.5 h-3.5" />
                <span>Key Figures</span>
              </div>
              <p className="text-xs sm:text-sm text-stone-200 font-serif line-clamp-2">
                {activeChapter.keyLeaders.join(', ')}
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-stone-900/60 border border-stone-800/80">
              <div className="flex items-center gap-1.5 text-xs text-amber-500 uppercase tracking-wider font-sans font-medium mb-1">
                <Swords className="w-3.5 h-3.5" />
                <span>Key Milestones</span>
              </div>
              <p className="text-xs sm:text-sm text-stone-200 font-serif line-clamp-2">
                {activeChapter.keyBattles.length > 0
                  ? activeChapter.keyBattles.join(' · ')
                  : 'Strategic mobilization'}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Synchronized Transcript (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4 bg-stone-900/40 rounded-xl border border-stone-800 p-4 sm:p-5 sticky top-20">
          {/* Transcript Header & Search */}
          <div className="flex flex-col gap-3 pb-3 border-b border-stone-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ScrollText className="w-4 h-4 text-amber-500" />
                <h3 className="font-serif text-lg font-semibold text-stone-100">
                  Documentary Transcript
                </h3>
              </div>

              {/* Follow Spoken Words Toggle */}
              <button
                onClick={onToggleAutoScroll}
                className={`text-xs px-2.5 py-1 rounded transition-colors font-sans cursor-pointer ${
                  autoScroll
                    ? 'text-amber-400 bg-amber-950/40 border border-amber-800/40'
                    : 'text-stone-500 hover:text-stone-300'
                }`}
                aria-label={autoScroll ? 'Disable auto scroll' : 'Enable auto scroll'}
              >
                {autoScroll ? 'Auto-Scrolling ON' : 'Auto-Scroll Paused'}
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search transcript by keyword (e.g. Stalingrad, Midway)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-stone-950/80 border border-stone-800 rounded-md text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300 text-xs"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Transcript Scroll Container */}
          <div
            ref={transcriptScrollContainerRef}
            className="flex flex-col gap-2.5 max-h-[580px] overflow-y-auto pr-1 select-text"
          >
            {filteredLines.length === 0 ? (
              <div className="py-8 text-center text-xs text-stone-500 font-sans">
                No transcript phrases match "{searchQuery}"
              </div>
            ) : (
              filteredLines.map((line) => {
                // Determine whether this line is currently active
                const isLineActive =
                  transcriptLines[activeTranscriptIndex]?.id === line.id;

                return (
                  <div
                    key={line.id}
                    ref={isLineActive ? activeLineRef : null}
                    onClick={() => onSeek(line.seconds)}
                    className={`group text-left p-2.5 rounded-lg transition-all cursor-pointer border ${
                      isLineActive
                        ? 'bg-amber-950/30 border-amber-600/60 shadow-sm'
                        : 'border-transparent hover:bg-stone-800/50 hover:border-stone-800'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`font-mono text-[11px] tabular-nums transition-colors ${
                          isLineActive
                            ? 'text-amber-400 font-semibold'
                            : 'text-stone-500 group-hover:text-amber-500'
                        }`}
                      >
                        {line.timeStr}
                      </span>

                      {line.isChapterHeader && (
                        <span className="text-[10px] font-sans uppercase tracking-widest text-amber-500/80 bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-900/40">
                          Chapter Marker
                        </span>
                      )}

                      {isLineActive && isPlaying && (
                        <span className="ml-auto flex items-center gap-1 text-[10px] uppercase font-sans tracking-widest text-amber-400">
                          <Volume2 className="w-3 h-3 animate-pulse" />
                          <span>Speaking</span>
                        </span>
                      )}
                    </div>

                    <p
                      className={`text-xs sm:text-sm font-sans leading-relaxed transition-colors ${
                        isLineActive
                          ? 'text-stone-100 font-medium'
                          : line.isChapterHeader
                          ? 'text-amber-200/90 font-serif font-semibold text-sm'
                          : 'text-stone-400 group-hover:text-stone-200'
                      }`}
                    >
                      {line.text}
                    </p>
                  </div>
                );
              })
            )}
          </div>

          <div className="pt-2 border-t border-stone-800 text-[11px] text-stone-500 text-center font-sans">
            Click any sentence or timestamp to jump narration directly to that moment.
          </div>
        </div>
      </div>
    </div>
  );
};
