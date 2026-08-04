import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { makeT, TFunc, PortalLang } from './i18n';
import { OwnerUser, ownerSession } from './ownerApi';

type Theme = 'light' | 'dark';

interface Ctx {
  lang: PortalLang;
  setLang: (l: PortalLang) => void;
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
  t: TFunc;
  user: OwnerUser | null;
  setUser: (u: OwnerUser | null) => void;
  toast: (msg: string) => void;
}

const PortalCtx = createContext<Ctx | null>(null);

const LANG_KEY = 'owner_lang';
const THEME_KEY = 'owner_theme';

function initialLang(user: OwnerUser | null): PortalLang {
  const stored = (typeof window !== 'undefined' && localStorage.getItem(LANG_KEY)) as PortalLang | null;
  if (stored) return stored;
  if (user?.preferredLang) return user.preferredLang;
  const nav = typeof navigator !== 'undefined' ? navigator.language.slice(0, 2) : 'en';
  return (['en', 'es', 'fr', 'de', 'it'].includes(nav) ? nav : 'en') as PortalLang;
}

function initialTheme(): Theme {
  const stored = (typeof window !== 'undefined' && localStorage.getItem(THEME_KEY)) as Theme | null;
  if (stored) return stored;
  if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: light)').matches) return 'light';
  return 'dark';
}

export const PortalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<OwnerUser | null>(() => ownerSession.user());
  const [lang, setLangState] = useState<PortalLang>(() => initialLang(ownerSession.user()));
  const [theme, setThemeState] = useState<Theme>(initialTheme);
  const [toastMsg, setToastMsg] = useState<{ id: number; msg: string } | null>(null);

  const setLang = useCallback((l: PortalLang) => { setLangState(l); localStorage.setItem(LANG_KEY, l); }, []);
  const setTheme = useCallback((tm: Theme) => { setThemeState(tm); localStorage.setItem(THEME_KEY, tm); }, []);
  const toggleTheme = useCallback(() => setTheme(theme === 'dark' ? 'light' : 'dark'), [theme, setTheme]);

  const toast = useCallback((msg: string) => {
    const id = Date.now();
    setToastMsg({ id, msg });
    window.setTimeout(() => setToastMsg((cur) => (cur?.id === id ? null : cur)), 2600);
  }, []);

  const t = useMemo(() => makeT(lang), [lang]);

  // Set document lang for a11y
  useEffect(() => { if (typeof document !== 'undefined') document.documentElement.lang = lang; }, [lang]);

  // The main site applies `html { zoom: 0.75 }` on desktop; the portal is
  // designed at 100% and must fill the viewport. Neutralise it while mounted.
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const html = document.documentElement;
    const prevZoom = html.style.zoom;
    html.style.zoom = '1';
    return () => { html.style.zoom = prevZoom; };
  }, []);

  const value = useMemo(
    () => ({ lang, setLang, theme, setTheme, toggleTheme, t, user, setUser, toast }),
    [lang, setLang, theme, setTheme, toggleTheme, t, user, toast]
  );

  return (
    <PortalCtx.Provider value={value}>
      <div className={`portal ${theme}`}>
        {children}
        {toastMsg && (
          <div
            className="pl-modal"
            style={{
              position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 100,
              background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-lg)', borderRadius: 999, padding: '0.7rem 1.25rem', fontSize: '0.9rem', fontWeight: 600,
            }}
          >
            {toastMsg.msg}
          </div>
        )}
      </div>
    </PortalCtx.Provider>
  );
};

export function usePortal(): Ctx {
  const ctx = useContext(PortalCtx);
  if (!ctx) throw new Error('usePortal must be used within PortalProvider');
  return ctx;
}
