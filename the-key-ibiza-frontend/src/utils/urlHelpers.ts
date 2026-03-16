import { Language } from '../types';

// Helper to convert villa name to URL-friendly slug
export function nameToUrlSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-') // Spaces to hyphens
    .replace(/-+/g, '-') // Multiple hyphens to single
    .trim();
}

// Supported languages for URL prefixes
export const SUPPORTED_LANG_PREFIXES = ['fr', 'es', 'de'] as const;
export type LangPrefix = typeof SUPPORTED_LANG_PREFIXES[number];

// Extract language from URL path
export function getLangFromPath(path: string): { lang: Language; pathWithoutLang: string } {
  const segments = path.split('/').filter(Boolean);
  const firstSegment = segments[0]?.toLowerCase();

  if (firstSegment && SUPPORTED_LANG_PREFIXES.includes(firstSegment as LangPrefix)) {
    return {
      lang: firstSegment as Language,
      pathWithoutLang: '/' + segments.slice(1).join('/')
    };
  }

  return { lang: 'en', pathWithoutLang: path };
}

