export interface Chapter {
  id: string;
  number: number | null; // null for Intro and Conclusion
  title: string;
  subtitle: string;
  timeRange: string;
  startTime: number; // in seconds
  endTime: number;   // in seconds
  summary: string;
  keyLeaders: string[];
  theater: string;
  keyBattles: string[];
  imagePath?: string;
  imageAlt?: string;
  imageCaption?: string;
  historicalSignificance: string;
  quote?: string;
}

export interface TranscriptLine {
  id: string;
  timeStr: string;   // e.g. "01:40"
  seconds: number;   // e.g. 100
  text: string;
  chapterId: string;
  isChapterHeader?: boolean;
}

export interface BattleMilestone {
  id: string;
  name: string;
  date: string;
  location: string;
  theater: 'European' | 'Pacific' | 'Eastern Front' | 'Mediterranean & Africa';
  alliedForces: string;
  axisForces: string;
  outcome: string;
  audioTimestampSec?: number;
  significance: string;
  latLngApprox: { x: number; y: number }; // Percentage for interactive SVG theatre map
}

export interface CasualtyRecord {
  country: string;
  alliance: 'Allies' | 'Axis' | 'Neutral';
  militaryDeaths: string;
  civilianDeaths: string;
  totalDeaths: string;
  populationShare: string;
}

export interface PrimarySourceDocument {
  id: string;
  title: string;
  date: string;
  significance: string;
  excerpt: string;
  parties: string;
}
