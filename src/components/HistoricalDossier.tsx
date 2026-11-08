import React, { useState } from 'react';
import { Scroll, FileText, AlertTriangle, Users, BookOpen, Scale } from 'lucide-react';
import { CASUALTY_DATA, PRIMARY_DOCUMENTS } from '../data/documentaryData';
import { CasualtyRecord, PrimarySourceDocument } from '../types/documentary';

export const HistoricalDossier: React.FC = () => {
  const [activeDocId, setActiveDocId] = useState<string>(PRIMARY_DOCUMENTS[0].id);
  const [allianceFilter, setAllianceFilter] = useState<'All' | 'Allies' | 'Axis'>('All');

  const filteredCasualties =
    allianceFilter === 'All'
      ? CASUALTY_DATA
      : CASUALTY_DATA.filter((c) => c.alliance === allianceFilter);

  const activeDoc =
    PRIMARY_DOCUMENTS.find((d) => d.id === activeDocId) || PRIMARY_DOCUMENTS[0];

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-10 sm:py-14">
      {/* Section Header */}
      <div className="mb-10 pb-4 border-b border-stone-800">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-amber-500 font-sans font-medium mb-1">
          <span>Archival Dossier</span>
          <span aria-hidden="true">·</span>
          <span>Demographics & Treaties</span>
        </div>
        <h2 className="font-serif text-2xl sm:text-4xl font-semibold text-stone-100">
          The Human Toll & Historical Records
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-stone-400 font-sans max-w-2xl">
          An estimated 60 to 85 million people perished in World War II — representing over 3% of the 1940 world population. Examine the casualty balance sheets and foundational primary declarations.
        </p>
      </div>

      {/* Part 1: Key Macro Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <div className="p-4 rounded-xl border border-stone-800 bg-stone-900/60">
          <div className="text-[11px] font-sans uppercase tracking-wider text-stone-400 mb-1">
            Total Fatalities
          </div>
          <div className="font-serif text-2xl sm:text-3xl font-bold text-stone-100 tabular-nums">
            60–85M
          </div>
          <div className="text-[11px] text-stone-500 font-sans mt-1">
            Soldiers & civilians worldwide
          </div>
        </div>

        <div className="p-4 rounded-xl border border-stone-800 bg-stone-900/60">
          <div className="text-[11px] font-sans uppercase tracking-wider text-stone-400 mb-1">
            Holocaust Victims
          </div>
          <div className="font-serif text-2xl sm:text-3xl font-bold text-amber-400 tabular-nums">
            ~6,000,000
          </div>
          <div className="text-[11px] text-stone-500 font-sans mt-1">
            Jewish men, women, and children
          </div>
        </div>

        <div className="p-4 rounded-xl border border-stone-800 bg-stone-900/60">
          <div className="text-[11px] font-sans uppercase tracking-wider text-stone-400 mb-1">
            Participating Nations
          </div>
          <div className="font-serif text-2xl sm:text-3xl font-bold text-stone-100 tabular-nums">
            50+
          </div>
          <div className="text-[11px] text-stone-500 font-sans mt-1">
            Across Europe, Asia, Africa & Americas
          </div>
        </div>

        <div className="p-4 rounded-xl border border-stone-800 bg-stone-900/60">
          <div className="text-[11px] font-sans uppercase tracking-wider text-stone-400 mb-1">
            United Nations Charter
          </div>
          <div className="font-serif text-2xl sm:text-3xl font-bold text-emerald-400 tabular-nums">
            Oct 1945
          </div>
          <div className="text-[11px] text-stone-500 font-sans mt-1">
            50 founding signatory states
          </div>
        </div>
      </div>

      {/* Part 2: Casualty Statistics Table */}
      <div className="mb-14">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="font-serif text-xl sm:text-2xl font-semibold text-stone-100">
              Casualty Balance Sheet by Nation
            </h3>
            <p className="text-xs text-stone-400 font-sans mt-0.5">
              Demographic losses including military deaths and civilian deaths from atrocities, bombing, and starvation.
            </p>
          </div>

          <div className="flex items-center gap-1 bg-stone-900 p-1 rounded-lg border border-stone-800 self-start sm:self-auto">
            {(['All', 'Allies', 'Axis'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setAllianceFilter(filter)}
                className={`px-3 py-1 rounded text-xs font-sans transition-colors cursor-pointer ${
                  allianceFilter === filter
                    ? 'bg-amber-500 text-stone-950 font-semibold'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-stone-800 bg-stone-900/50">
          <table className="w-full text-left text-xs sm:text-sm font-sans">
            <thead className="bg-stone-950/80 text-stone-400 uppercase text-[11px] tracking-wider border-b border-stone-800">
              <tr>
                <th className="py-3 px-4">Nation</th>
                <th className="py-3 px-4">Alliance</th>
                <th className="py-3 px-4 text-right">Military Deaths</th>
                <th className="py-3 px-4 text-right">Civilian Deaths</th>
                <th className="py-3 px-4 text-right">Total Losses</th>
                <th className="py-3 px-4 text-right">% of 1939 Pop.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/80">
              {filteredCasualties.map((row) => (
                <tr
                  key={row.country}
                  className="hover:bg-stone-800/40 transition-colors"
                >
                  <td className="py-3 px-4 font-serif font-medium text-stone-200">
                    {row.country}
                  </td>
                  <td className="py-3 px-4 text-stone-400">
                    <span
                      className={`text-[11px] font-sans uppercase tracking-wider ${
                        row.alliance === 'Allies' ? 'text-amber-400' : 'text-rose-400'
                      }`}
                    >
                      {row.alliance}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums text-stone-300">
                    {row.militaryDeaths}
                  </td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums text-stone-300">
                    {row.civilianDeaths}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-semibold tabular-nums text-amber-300">
                    {row.totalDeaths}
                  </td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums text-stone-400">
                    {row.populationShare}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Part 3: Primary Source Documents Archive */}
      <div>
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-amber-500 font-sans font-medium mb-1">
            <span>Primary Archives</span>
            <span aria-hidden="true">·</span>
            <span>Diplomatic Texts</span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-semibold text-stone-100">
            Diplomatic Decrees & Instruments of Surrender
          </h3>
          <p className="text-xs text-stone-400 font-sans mt-0.5">
            Key historic treaties, declarations, and directives that shaped the conflict and ended world war.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Document list selectors (4 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-2">
            {PRIMARY_DOCUMENTS.map((doc) => {
              const isSelected = doc.id === activeDoc.id;
              return (
                <button
                  key={doc.id}
                  onClick={() => setActiveDocId(doc.id)}
                  className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-950/30 border-amber-500/70 shadow-md'
                      : 'bg-stone-900/60 border-stone-800/80 hover:bg-stone-900 hover:border-stone-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-sans uppercase tracking-wider text-amber-500 mb-1">
                    <span>{doc.date}</span>
                  </div>
                  <h4 className="font-serif text-sm sm:text-base font-semibold text-stone-100">
                    {doc.title}
                  </h4>
                  <p className="mt-1 text-xs text-stone-400 font-sans line-clamp-2">
                    {doc.significance}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Active Document Viewer (7 Cols) */}
          <div className="lg:col-span-7 rounded-xl border border-stone-800 bg-stone-900/90 p-6 sm:p-8 shadow-xl">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3 mb-4 text-xs font-sans text-amber-500 uppercase tracking-widest">
              <span>Primary Source Excerpt</span>
              <span className="text-stone-400 font-mono">{activeDoc.date}</span>
            </div>

            <h4 className="font-serif text-xl sm:text-2xl font-bold text-stone-100 mb-1">
              {activeDoc.title}
            </h4>
            <div className="text-xs text-stone-400 font-sans mb-4">
              Parties: <span className="text-stone-200">{activeDoc.parties}</span>
            </div>

            <div className="p-4 sm:p-5 rounded-lg bg-stone-950 border border-stone-800 font-serif italic text-sm sm:text-base text-stone-200 leading-relaxed my-4">
              {activeDoc.excerpt}
            </div>

            <div className="text-xs sm:text-sm text-stone-300 font-sans leading-relaxed">
              <span className="font-semibold text-amber-400 block mb-1">
                Historical Significance:
              </span>
              {activeDoc.significance}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
