// Inline SVG icons — no external icon dependency.
import React from 'react';

type P = { size?: number; className?: string; strokeWidth?: number };
const base = (size = 20, strokeWidth = 1.6) => ({
  width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
  stroke: 'currentColor', strokeWidth, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const,
});

export const IconGrid = ({ size, className, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)} className={className}><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/></svg>
);
export const IconHome = ({ size, className, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)} className={className}><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M9.5 21v-6h5v6"/></svg>
);
export const IconCalendar = ({ size, className, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)} className={className}><rect x="3" y="4.5" width="18" height="16" rx="2.5"/><path d="M3 9h18M8 3v3M16 3v3"/></svg>
);
export const IconMessage = ({ size, className, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)} className={className}><path d="M4 5h16a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H9l-4 4v-4H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"/></svg>
);
export const IconSettings = ({ size, className, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)} className={className}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1Z"/></svg>
);
export const IconLogout = ({ size, className, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)} className={className}><path d="M15 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3"/><path d="M10 17l5-5-5-5"/><path d="M15 12H3"/></svg>
);
export const IconSun = ({ size, className, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)} className={className}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
);
export const IconMoon = ({ size, className, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)} className={className}><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></svg>
);
export const IconChevronLeft = ({ size, className, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)} className={className}><path d="M15 18l-6-6 6-6"/></svg>
);
export const IconChevronRight = ({ size, className, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)} className={className}><path d="M9 18l6-6-6-6"/></svg>
);
export const IconChevronDown = ({ size, className, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)} className={className}><path d="M6 9l6 6 6-6"/></svg>
);
export const IconPlus = ({ size, className, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)} className={className}><path d="M12 5v14M5 12h14"/></svg>
);
export const IconX = ({ size, className, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)} className={className}><path d="M18 6 6 18M6 6l12 12"/></svg>
);
export const IconCheck = ({ size, className, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)} className={className}><path d="M20 6 9 17l-5-5"/></svg>
);
export const IconUsers = ({ size, className, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)} className={className}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9"/><path d="M16 3.1A4 4 0 0 1 16 11"/></svg>
);
export const IconBed = ({ size, className, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)} className={className}><path d="M2 17V7a1 1 0 0 1 1-1h1v8"/><path d="M4 12h16a2 2 0 0 1 2 2v3"/><path d="M2 17h20M2 20v-3M22 20v-3"/><path d="M7 10h4a1 1 0 0 1 1 1v1"/></svg>
);
export const IconBath = ({ size, className, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)} className={className}><path d="M4 12V6a2 2 0 0 1 3.5-1.3"/><path d="M3 12h18v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-3Z"/><path d="M6 19l-1 2M18 19l1 2M7 6h2"/></svg>
);
export const IconPin = ({ size, className, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)} className={className}><path d="M20 10c0 5.5-8 12-8 12s-8-6.5-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
);
export const IconTrash = ({ size, className, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)} className={className}><path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
);
export const IconGlobe = ({ size, className, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)} className={className}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18"/></svg>
);
export const IconKey = ({ size, className, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)} className={className}><circle cx="7.5" cy="15.5" r="4.5"/><path d="M10.5 12.5 20 3M17 6l2 2M14 9l2 2"/></svg>
);
export const IconArrow = ({ size, className, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)} className={className}><path d="M5 12h14M13 6l6 6-6 6"/></svg>
);
export const IconBell = ({ size, className, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)} className={className}><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg>
);
export const IconActivity = ({ size, className, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)} className={className}><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
);
export const IconSpark = ({ size, className, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)} className={className}><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3Z"/></svg>
);
export const IconRefresh = ({ size, className, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)} className={className}><path d="M21 12a9 9 0 1 1-2.64-6.36"/><path d="M21 3v6h-6"/></svg>
);
export const IconLink = ({ size, className, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)} className={className}><path d="M10 13a5 5 0 0 0 7.07 0l2.83-2.83a5 5 0 0 0-7.07-7.07l-1.41 1.41"/><path d="M14 11a5 5 0 0 0-7.07 0L4.1 13.83a5 5 0 0 0 7.07 7.07l1.41-1.41"/></svg>
);
export const IconCopy = ({ size, className, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)} className={className}><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
);
