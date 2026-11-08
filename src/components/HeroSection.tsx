import React from 'react';
import { Play, Pause, Compass, Clock, MapPin, ShieldAlert } from 'lucide-react';
import { Chapter } from '../types/documentary';
import { HERO_IMAGE_PATH } from '../data/documentaryData';

interface HeroSectionProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onSelectChapter: (chapter: Chapter) => void;
  chapters: Chapter[];
  onOpenTheatres: () => void;
  onOpenVideo: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  isPlaying,
  onTogglePlay,
  onSelectChapter,
  chapters,
  onOpenTheatres,
  onOpenVideo,
}) => {
  return (
    <section className="relative w-full border-b border-stone-800 overflow-hidden bg-stone-950">
      {/* Background Hero Banner with measured contrast scrim */}
      <div className="relative w-full h-[360px] sm:h-[440px] lg:h-[500px]">
        <img
          src={HERO_IMAGE_PATH}
          alt="World War II naval convoys and aircraft over wartime skies"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center filter brightness-90 contrast-105"
        />
        {/* Measured dark gradient scrim for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/70 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/60 to-transparent" />

        {/* Content container */}
        <div className="absolute inset-0 max-w-7xl mx-auto px-4 sm:px-8 flex flex-col justify-end pb-8 sm:pb-12">
          {/* Metadata: clean unboxed text with subtle typographic separators */}
          <div className="flex items-center gap-2 text-xs sm:text-sm font-sans tracking-widest uppercase text-amber-400 mb-3">
            <span>Historical Retrospective</span>
            <span aria-hidden="true" className="text-stone-600">·</span>
            <span>1939 – 1945</span>
            <span aria-hidden="true" className="text-stone-600">·</span>
            <span>50+ Nations</span>
            <span aria-hidden="true" className="text-stone-600">·</span>
            <span>7-Minute Narration</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-stone-100 max-w-4xl text-balance leading-tight sm:leading-none">
            The War That Changed the World
          </h1>

          <p className="mt-3 sm:mt-4 text-stone-300 text-sm sm:text-base lg:text-lg max-w-3xl leading-relaxed font-sans font-light">
            A comprehensive, synchronized historical chronicle through six years of global warfare — from the collapse of European peace and Blitzkrieg to D-Day, the Pacific naval campaign, the Holocaust, and the atomic age.
          </p>

          {/* Action CTAs */}
          <div className="mt-6 flex flex-wrap items-center gap-3 sm:gap-4">
            <button
              onClick={onOpenVideo}
              className="flex items-center gap-2.5 px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-sm transition-all shadow-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-300"
            >
              <Play className="w-4 h-4 fill-current ml-0.5" />
              <span>Watch Cinematic Film Experience</span>
            </button>

            <button
              onClick={onTogglePlay}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-stone-900/90 hover:bg-stone-800 text-stone-200 border border-stone-700 text-sm font-medium transition-colors cursor-pointer"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 fill-current text-amber-400" />
                  <span>Pause Narration</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current text-amber-400 ml-0.5" />
                  <span>Listen to Audio</span>
                </>
              )}
            </button>

            <button
              onClick={onOpenTheatres}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-stone-900/60 hover:bg-stone-800 text-stone-300 border border-stone-800 text-sm font-medium transition-colors cursor-pointer"
            >
              <Compass className="w-4 h-4 text-amber-400" />
              <span>Theatres & Maps</span>
            </button>
          </div>

          {/* Quick Chapter Navigation Ribbon */}
          <div className="mt-8 pt-4 border-t border-stone-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <span className="text-xs uppercase tracking-wider text-stone-500 font-sans whitespace-nowrap shrink-0 mr-2">
              Jump to Era:
            </span>
            {chapters.map((ch) => (
              <button
                key={ch.id}
                onClick={() => onSelectChapter(ch)}
                className="text-xs font-sans whitespace-nowrap px-2.5 py-1 rounded bg-stone-900/60 hover:bg-stone-800 hover:text-amber-400 border border-stone-800 text-stone-400 transition-colors cursor-pointer"
              >
                {ch.number !== null ? `Ch. ${ch.number}: ` : ''}{ch.title}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
