import React from 'react';
import { Play, Clock, ArrowRight } from 'lucide-react';
import { Chapter } from '../types/documentary';

interface ChapterGalleryProps {
  chapters: Chapter[];
  activeChapter: Chapter;
  onSelectChapter: (chapter: Chapter) => void;
}

export const ChapterGallery: React.FC<ChapterGalleryProps> = ({
  chapters,
  activeChapter,
  onSelectChapter,
}) => {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-10 sm:py-14 border-t border-stone-800">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-amber-500 font-sans font-medium mb-1">
          <span>Historical Retrospective</span>
          <span aria-hidden="true">·</span>
          <span>Curated Index</span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-stone-100">
          The Eight Chapters of World War II
        </h2>
        <p className="mt-1 text-sm text-stone-400 font-sans max-w-2xl">
          Follow the chronological progression of the global conflict from the ashes of 1919 to the dawn of the atomic age.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {chapters.map((ch) => {
          const isActive = ch.id === activeChapter.id;
          return (
            <div
              key={ch.id}
              onClick={() => onSelectChapter(ch)}
              className={`group flex flex-col justify-between rounded-xl border bg-stone-900/60 overflow-hidden cursor-pointer transition-all hover:bg-stone-900 shadow-md ${
                isActive
                  ? 'border-amber-500/80 ring-1 ring-amber-500/50'
                  : 'border-stone-800/80 hover:border-stone-700'
              }`}
            >
              {/* Media Thumbnail */}
              {ch.imagePath && (
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-stone-950">
                  <img
                    src={ch.imagePath}
                    alt={ch.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center filter sepia-[0.1] contrast-105 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent" />
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs">
                    <span className="font-mono tabular-nums text-[11px] text-amber-300 bg-stone-950/80 px-2 py-0.5 rounded border border-amber-900/40">
                      {ch.timeRange}
                    </span>
                    <span className="text-[10px] uppercase font-sans tracking-wider text-stone-300 bg-stone-950/80 px-2 py-0.5 rounded">
                      {ch.theater}
                    </span>
                  </div>
                </div>
              )}

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-[11px] font-sans uppercase tracking-widest text-amber-500 font-medium mb-1">
                    {ch.number !== null ? `Chapter 0${ch.number}` : 'Documentary Prologue'}
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-stone-100 group-hover:text-amber-400 transition-colors">
                    {ch.title}
                  </h3>
                  <p className="mt-1 text-xs text-amber-400/80 font-serif italic">
                    {ch.subtitle}
                  </p>
                  <p className="mt-3 text-xs sm:text-sm text-stone-400 leading-relaxed font-sans font-light line-clamp-3">
                    {ch.summary}
                  </p>
                </div>

                {/* Footer action */}
                <div className="mt-5 pt-3 border-t border-stone-800/80 flex items-center justify-between text-xs">
                  <span className="text-stone-500 font-sans">
                    {ch.keyLeaders.slice(0, 2).join(', ')}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectChapter(ch);
                    }}
                    className="flex items-center gap-1.5 text-amber-400 group-hover:text-amber-300 font-medium font-sans"
                  >
                    <span>Jump to Audio</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
