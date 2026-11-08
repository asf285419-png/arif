import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-stone-800 bg-stone-950 py-10 px-4 sm:px-8 text-stone-500 text-xs font-sans">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
          <span className="font-serif text-sm font-semibold text-stone-300">
            CHRONICLE: World War II (1939–1945)
          </span>
          <span className="hidden sm:inline text-stone-700">·</span>
          <span>The War That Changed the World</span>
        </div>

        <div className="text-stone-400 text-center md:text-right">
          Historical documentary narration by Archie · In solemn remembrance of all victims and sacrifices
        </div>
      </div>
    </footer>
  );
};
