import React, { useState } from 'react';
import { Search, Play, Copy, Check, FileDown, BookOpen } from 'lucide-react';
import { Chapter, TranscriptLine } from '../types/documentary';
import { searchTranscript } from '../utils/audioSync';

interface FullTranscriptViewProps {
  chapters: Chapter[];
  transcriptLines: TranscriptLine[];
  activeTranscriptIndex: number;
  onSeek: (seconds: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
}

export const FullTranscriptView: React.FC<FullTranscriptViewProps> = ({
  chapters,
  transcriptLines,
  activeTranscriptIndex,
  onSeek,
  isPlaying,
  onTogglePlay,
}) => {
  const [query, setQuery] = useState('');
  const [copied, setCopied] = useState(false);

  const filtered = searchTranscript(query, transcriptLines);

  const handleCopyAll = () => {
    const fullText = transcriptLines.map((l) => `[${l.timeStr}] ${l.text}`).join('\n');
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="w-full max-w-5xl mx-auto px-4 sm:px-8 py-10 sm:py-14">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-4 border-b border-stone-800">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-amber-500 font-sans font-medium mb-1">
            <span>Historical Documentation</span>
            <span aria-hidden="true">·</span>
            <span>Verbatim Archive</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl font-semibold text-stone-100">
            Full Documentary Narration Transcript
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-stone-400 font-sans">
            Complete time-coded documentary script narrated by Archie. Click any timestamp to play.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCopyAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-stone-900 border border-stone-800 hover:bg-stone-800 text-xs text-stone-300 font-sans transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied Transcript</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Script</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Filter entire documentary script by keyword, leader, date, or battle..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-stone-900/80 border border-stone-800 rounded-lg text-sm text-stone-200 placeholder-stone-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-200"
          >
            Clear
          </button>
        )}
      </div>

      {/* Transcript Items */}
      <div className="flex flex-col gap-3">
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-sm text-stone-500 font-sans">
            No narration matches found for "{query}".
          </div>
        ) : (
          filtered.map((line) => {
            const isCurrent =
              transcriptLines[activeTranscriptIndex]?.id === line.id;

            return (
              <div
                key={line.id}
                onClick={() => onSeek(line.seconds)}
                className={`p-3.5 rounded-lg border transition-all cursor-pointer flex items-start gap-3 sm:gap-4 ${
                  isCurrent
                    ? 'bg-amber-950/30 border-amber-600/60 shadow'
                    : 'bg-stone-900/40 border-stone-800/80 hover:bg-stone-900 hover:border-stone-700'
                }`}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSeek(line.seconds);
                  }}
                  className={`font-mono text-xs tabular-nums px-2 py-1 rounded transition-colors shrink-0 ${
                    isCurrent
                      ? 'bg-amber-500 text-stone-950 font-bold'
                      : 'bg-stone-800 text-stone-400 hover:bg-amber-500 hover:text-stone-950'
                  }`}
                  aria-label={`Jump to ${line.timeStr}`}
                >
                  {line.timeStr}
                </button>

                <div className="flex-1">
                  {line.isChapterHeader && (
                    <div className="text-[11px] font-sans uppercase tracking-widest text-amber-500 font-semibold mb-1">
                      Chapter Heading
                    </div>
                  )}
                  <p
                    className={`text-sm sm:text-base leading-relaxed ${
                      isCurrent
                        ? 'text-stone-100 font-medium'
                        : line.isChapterHeader
                        ? 'font-serif text-amber-300 font-semibold text-lg'
                        : 'text-stone-300'
                    }`}
                  >
                    {line.text}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};
