import entriesJson from './entries.json';

export interface Entry {
  day: number;
  month: string;
  title: string;
  light: string;
  wisdom: string;
  prayer: string;
  page: number;
}

export const entries: Entry[] = entriesJson as Entry[];

export const getEntry = (month: string, day: number): Entry | undefined =>
  entries.find(e => e.month === month && e.day === day);

export const getEntriesByMonth = (month: string): Entry[] =>
  entries.filter(e => e.month === month).sort((a, b) => a.day - b.day);

export const getRandomEntry = (): Entry =>
  entries[Math.floor(Math.random() * entries.length)];

export const getTotalEntries = (): number => entries.length;
