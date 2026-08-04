import { LOCALE_MAP, PortalLang } from './i18n';

// All calendar logic works on local calendar dates as YYYY-MM-DD strings to
// avoid timezone drift. end_date is exclusive (departure day).

export const iso = (d: Date): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export const parseIso = (s: string): Date => {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
};

export const todayIso = (): string => iso(new Date());

export const addDays = (s: string, n: number): string => {
  const d = parseIso(s);
  d.setDate(d.getDate() + n);
  return iso(d);
};

export const daysBetween = (start: string, end: string): number =>
  Math.round((parseIso(end).getTime() - parseIso(start).getTime()) / 86400000);

// Inclusive range of date strings [a..b]
export const rangeInclusive = (a: string, b: string): string[] => {
  const [lo, hi] = a <= b ? [a, b] : [b, a];
  const out: string[] = [];
  let cur = lo;
  while (cur <= hi) { out.push(cur); cur = addDays(cur, 1); }
  return out;
};

export const monthMatrix = (year: number, month: number): (string | null)[] => {
  // Monday-first grid; 6 rows × 7 cols
  const first = new Date(year, month, 1);
  const startDow = (first.getDay() + 6) % 7; // 0=Mon
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (string | null)[] = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(iso(new Date(year, month, d)));
  while (cells.length % 7 !== 0) cells.push(null);
  while (cells.length < 42) cells.push(null);
  return cells;
};

export const fmtMonthYear = (year: number, month: number, lang: PortalLang): string =>
  new Intl.DateTimeFormat(LOCALE_MAP[lang], { month: 'long', year: 'numeric' }).format(new Date(year, month, 1));

export const fmtDay = (s: string, lang: PortalLang, opts?: Intl.DateTimeFormatOptions): string =>
  new Intl.DateTimeFormat(LOCALE_MAP[lang], opts || { day: 'numeric', month: 'short' }).format(parseIso(s));

export const fmtRange = (start: string, end: string, lang: PortalLang): string => {
  const s = fmtDay(start, lang, { day: 'numeric', month: 'short' });
  // end is exclusive departure; show last night (end - 1) as the stay end
  const e = fmtDay(end, lang, { day: 'numeric', month: 'short', year: 'numeric' });
  return `${s} → ${e}`;
};

export const weekdayNames = (lang: PortalLang): string[] => {
  const fmt = new Intl.DateTimeFormat(LOCALE_MAP[lang], { weekday: 'short' });
  // Monday-first
  const base = new Date(2024, 0, 1); // a Monday
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(base); d.setDate(base.getDate() + i);
    return fmt.format(d);
  });
};

export const weekdayNarrow = (lang: PortalLang): string[] => {
  const fmt = new Intl.DateTimeFormat(LOCALE_MAP[lang], { weekday: 'narrow' });
  const base = new Date(2024, 0, 1);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(base); d.setDate(base.getDate() + i);
    return fmt.format(d);
  });
};
