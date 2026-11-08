import React, { useState } from 'react';
import { MapPin, Swords, Calendar, Award, Play, Filter, Shield } from 'lucide-react';
import { BattleMilestone } from '../types/documentary';
import { BATTLE_MILESTONES, PACIFIC_IMAGE_PATH, DDAY_IMAGE_PATH } from '../data/documentaryData';
import { secondsToTimeString } from '../utils/audioSync';

interface TheatreInteractiveMapProps {
  onSeek: (seconds: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
}

export const TheatreInteractiveMap: React.FC<TheatreInteractiveMapProps> = ({
  onSeek,
  isPlaying,
  onTogglePlay,
}) => {
  const [selectedTheater, setSelectedTheater] = useState<string>('All');
  const [activeBattleId, setActiveBattleId] = useState<string>('b8'); // D-Day default

  const theaters = ['All', 'European', 'Eastern Front', 'Pacific', 'Mediterranean & Africa'];

  const filteredBattles =
    selectedTheater === 'All'
      ? BATTLE_MILESTONES
      : BATTLE_MILESTONES.filter((b) => b.theater === selectedTheater);

  const activeBattle =
    BATTLE_MILESTONES.find((b) => b.id === activeBattleId) || BATTLE_MILESTONES[0];

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-10 sm:py-14">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-4 border-b border-stone-800">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-amber-500 font-sans font-medium mb-1">
            <span>Strategic Cartography</span>
            <span aria-hidden="true">·</span>
            <span>Global Operations</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl font-semibold text-stone-100">
            Military Theatres & Decisive Campaigns
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-stone-400 font-sans max-w-2xl">
            Explore the geographic expanse of World War II across the Western European front, the titanic Soviet clash, the Pacific naval expanses, and the sands of North Africa.
          </p>
        </div>

        {/* Theater filter tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar bg-stone-900/80 p-1 rounded-lg border border-stone-800">
          {theaters.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTheater(t)}
              className={`px-3 py-1.5 rounded-md text-xs font-sans whitespace-nowrap transition-colors cursor-pointer ${
                selectedTheater === t
                  ? 'bg-amber-500 text-stone-950 font-semibold shadow-sm'
                  : 'text-stone-400 hover:text-stone-100 hover:bg-stone-800'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Strategic Cartography Map (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="relative rounded-xl border border-stone-800 bg-stone-900/80 p-4 overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between text-xs text-stone-400 mb-3 pb-2 border-b border-stone-800/80">
              <span className="font-serif tracking-wider uppercase text-amber-400">
                Operational Map: Global Theatre Coordinates
              </span>
              <span className="text-[11px] font-sans text-stone-500">
                Click pin to inspect battle & jump narration
              </span>
            </div>

            {/* Stylized Tactical World Map Canvas SVG */}
            <div className="relative w-full aspect-[16/9] bg-stone-950 rounded-lg overflow-hidden border border-stone-800/80">
              <svg
                viewBox="0 0 100 60"
                className="w-full h-full select-none"
                style={{ filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.5))' }}
              >
                {/* Background grid lines for military cartography aesthetic */}
                <defs>
                  <pattern id="tactical-grid" width="10" height="10" patternUnits="userSpaceOnUse">
                    <path
                      d="M 10 0 L 0 0 0 10"
                      fill="none"
                      stroke="rgba(120, 113, 108, 0.15)"
                      strokeWidth="0.2"
                    />
                  </pattern>
                </defs>
                <rect width="100" height="60" fill="url(#tactical-grid)" />

                {/* Stylized Continents silhouettes */}
                {/* North America */}
                <path
                  d="M 12 10 Q 18 8 28 12 Q 25 24 22 28 Q 18 30 15 22 Z"
                  fill="#292524"
                  stroke="#44403c"
                  strokeWidth="0.3"
                />
                {/* South America */}
                <path
                  d="M 24 33 Q 32 35 30 46 Q 26 55 24 50 Z"
                  fill="#292524"
                  stroke="#44403c"
                  strokeWidth="0.3"
                />
                {/* Europe */}
                <path
                  d="M 46 16 Q 56 12 60 18 Q 58 26 48 26 Q 44 22 46 16 Z"
                  fill="#3f3f46"
                  stroke="#52525b"
                  strokeWidth="0.3"
                />
                {/* Africa */}
                <path
                  d="M 48 28 Q 62 28 60 42 Q 54 52 50 48 Q 44 38 48 28 Z"
                  fill="#292524"
                  stroke="#44403c"
                  strokeWidth="0.3"
                />
                {/* Asia / Russia */}
                <path
                  d="M 60 14 Q 85 10 92 20 Q 86 34 72 32 Q 62 26 60 14 Z"
                  fill="#3f3f46"
                  stroke="#52525b"
                  strokeWidth="0.3"
                />
                {/* Australia */}
                <path
                  d="M 80 42 Q 90 40 88 50 Q 82 52 80 42 Z"
                  fill="#292524"
                  stroke="#44403c"
                  strokeWidth="0.3"
                />

                {/* Major Ocean Labels */}
                <text x="35" y="22" fill="#78716c" fontSize="1.8" fontFamily="serif" opacity="0.6">
                  ATLANTIC OCEAN
                </text>
                <text x="18" y="42" fill="#78716c" fontSize="1.8" fontFamily="serif" opacity="0.6">
                  PACIFIC OCEAN
                </text>
                <text x="68" y="44" fill="#78716c" fontSize="1.8" fontFamily="serif" opacity="0.6">
                  INDIAN OCEAN
                </text>

                {/* Axis of Allied Atlantic Convoy Line */}
                <line
                  x1="26"
                  y1="18"
                  x2="48"
                  y2="20"
                  stroke="#d97706"
                  strokeWidth="0.3"
                  strokeDasharray="1,1"
                  opacity="0.5"
                />

                {/* Battle Milestone Coordinate Pins */}
                {filteredBattles.map((b, idx) => {
                  const isPinActive = b.id === activeBattle.id;
                  // Alternate label offset or place selected on top
                  const yOffset = idx % 2 === 0 ? -2.8 : 3.6;
                  return (
                    <g
                      key={b.id}
                      className="cursor-pointer transition-transform hover:scale-125"
                      onClick={() => {
                        setActiveBattleId(b.id);
                        if (b.audioTimestampSec !== undefined) {
                          onSeek(b.audioTimestampSec);
                        }
                      }}
                    >
                      {/* Pulse circle for active pin */}
                      {isPinActive && (
                        <circle
                          cx={b.latLngApprox.x}
                          cy={b.latLngApprox.y}
                          r="3.5"
                          fill="none"
                          stroke="#f59e0b"
                          strokeWidth="0.4"
                          className="animate-ping"
                          opacity="0.85"
                        />
                      )}
                      <circle
                        cx={b.latLngApprox.x}
                        cy={b.latLngApprox.y}
                        r={isPinActive ? '2.2' : '1.3'}
                        fill={isPinActive ? '#f59e0b' : '#ef4444'}
                        stroke="#1c1917"
                        strokeWidth="0.4"
                      />
                      <rect
                        x={b.latLngApprox.x - (b.name.length * 0.9)}
                        y={b.latLngApprox.y + (yOffset > 0 ? yOffset - 1.6 : yOffset - 2)}
                        width={b.name.length * 1.8}
                        height="2.4"
                        fill="rgba(12, 10, 9, 0.75)"
                        rx="0.4"
                      />
                      <text
                        x={b.latLngApprox.x}
                        y={b.latLngApprox.y + yOffset}
                        fill={isPinActive ? '#fbbf24' : '#e7e5e4'}
                        fontSize="1.6"
                        fontWeight={isPinActive ? 'bold' : 'normal'}
                        textAnchor="middle"
                        fontFamily="sans-serif"
                      >
                        {b.name}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Pin legend */}
            <div className="flex items-center justify-between text-[11px] text-stone-400 pt-2 font-sans">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> Selected Battle
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" /> Campaign Pin
                </span>
              </div>
              <span className="font-mono text-stone-500">
                {filteredBattles.length} locations plotted
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Active Campaign Card Details (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="p-5 rounded-xl border border-stone-800 bg-stone-900/90 shadow-xl">
            <div className="flex items-center justify-between text-xs text-amber-500 uppercase tracking-widest font-sans font-medium mb-1.5">
              <span>{activeBattle.theater} Theatre</span>
              <span className="font-mono tabular-nums text-stone-400">
                {activeBattle.date}
              </span>
            </div>

            <h3 className="font-serif text-2xl font-bold text-stone-100">
              {activeBattle.name}
            </h3>
            <div className="flex items-center gap-2 text-xs text-stone-400 mt-1 font-sans">
              <MapPin className="w-3.5 h-3.5 text-amber-500" />
              <span>{activeBattle.location}</span>
            </div>

            <div className="my-4 pt-3 border-t border-stone-800 flex flex-col gap-2.5 text-xs sm:text-sm font-sans">
              <div>
                <span className="text-stone-400 font-medium">Allied Forces: </span>
                <span className="text-stone-200">{activeBattle.alliedForces}</span>
              </div>
              <div>
                <span className="text-stone-400 font-medium">Axis Forces: </span>
                <span className="text-stone-200">{activeBattle.axisForces}</span>
              </div>
              <div>
                <span className="text-stone-400 font-medium">Outcome: </span>
                <span className="text-amber-300 font-medium">{activeBattle.outcome}</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-stone-950 border border-stone-800 text-xs sm:text-sm text-stone-300 font-serif leading-relaxed">
              <span className="font-sans text-[11px] uppercase tracking-wider text-amber-500 font-semibold block mb-1">
                Strategic Impact
              </span>
              {activeBattle.significance}
            </div>

            {/* Jump to audio timestamp action */}
            {activeBattle.audioTimestampSec !== undefined && (
              <div className="mt-4 pt-3 border-t border-stone-800 flex items-center justify-between">
                <div className="text-xs text-stone-400 font-sans">
                  Spoken in documentary at{' '}
                  <span className="font-mono text-amber-400 font-semibold">
                    {secondsToTimeString(activeBattle.audioTimestampSec)}
                  </span>
                </div>
                <button
                  onClick={() => {
                    if (activeBattle.audioTimestampSec !== undefined) {
                      onSeek(activeBattle.audioTimestampSec);
                    }
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-xs font-sans transition-colors cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Listen to Event</span>
                </button>
              </div>
            )}
          </div>

          {/* Quick List of Other Battles in Theatre */}
          <div className="p-4 rounded-xl border border-stone-800 bg-stone-900/50">
            <h4 className="text-xs font-sans uppercase tracking-widest text-stone-400 mb-2">
              Select Another Campaign
            </h4>
            <div className="flex flex-col gap-1.5 max-h-[220px] overflow-y-auto pr-1">
              {filteredBattles.map((b) => (
                <button
                  key={b.id}
                  onClick={() => {
                    setActiveBattleId(b.id);
                    if (b.audioTimestampSec !== undefined) onSeek(b.audioTimestampSec);
                  }}
                  className={`text-left px-3 py-2 rounded-lg text-xs font-sans flex items-center justify-between transition-colors cursor-pointer ${
                    b.id === activeBattle.id
                      ? 'bg-amber-950/40 text-amber-300 border border-amber-800/60 font-medium'
                      : 'text-stone-300 hover:bg-stone-800/60'
                  }`}
                >
                  <span className="truncate">{b.name}</span>
                  <span className="font-mono text-stone-500 tabular-nums ml-2 shrink-0">
                    {b.date.split(',')[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
