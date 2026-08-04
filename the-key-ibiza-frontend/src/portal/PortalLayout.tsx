import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { usePortal } from './PortalContext';
import { ownerSession } from './ownerApi';
import { PORTAL_LANGS } from './i18n';
import {
  IconGrid, IconHome, IconCalendar, IconMessage, IconSettings, IconLogout,
  IconSun, IconMoon, IconChevronDown, IconKey, IconUsers, IconCheck,
} from './icons';

const LangMenu: React.FC = () => {
  const { lang, setLang } = usePortal();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = PORTAL_LANGS.find((l) => l.code === lang)!;
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button className="pl-btn pl-btn-ghost" style={{ padding: '0.5rem 0.75rem' }} onClick={() => setOpen((o) => !o)}>
        <span style={{ fontSize: '1rem' }}>{current.flag}</span>
        <span style={{ fontSize: '0.85rem' }}>{current.code.toUpperCase()}</span>
        <IconChevronDown size={14} />
      </button>
      {open && (
        <div className="pl-modal" style={{
          position: 'absolute', right: 0, top: 'calc(100% + 8px)', zIndex: 60, minWidth: 168,
          background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, boxShadow: 'var(--shadow-lg)', padding: 6,
        }}>
          {PORTAL_LANGS.map((l) => (
            <button key={l.code} onClick={() => { setLang(l.code); setOpen(false); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '0.55rem 0.7rem',
                borderRadius: 10, fontSize: '0.9rem', fontWeight: l.code === lang ? 700 : 500,
                background: l.code === lang ? 'var(--accent-bg)' : 'transparent', color: 'var(--text)',
              }}>
              <span style={{ fontSize: '1.05rem' }}>{l.flag}</span>{l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = usePortal();
  return (
    <button className="pl-btn pl-btn-ghost" style={{ padding: '0.5rem', width: 40, height: 40, borderRadius: 999 }}
      onClick={toggleTheme} aria-label="Toggle theme">
      {theme === 'dark' ? <IconSun size={18} /> : <IconMoon size={18} />}
    </button>
  );
};

type NavEntry = { to: string; key: any; Icon: React.FC<any>; end: boolean; soon?: boolean };

const NAV: NavEntry[] = [
  { to: '/owner', key: 'navDashboard', Icon: IconHome, end: true },
  { to: '/owner/properties', key: 'navProperties', Icon: IconGrid, end: false },
  { to: '/owner/calendar', key: 'navCalendar', Icon: IconCalendar, end: false },
  { to: '/owner/messages', key: 'navMessages', Icon: IconMessage, end: false, soon: true },
  { to: '/owner/settings', key: 'navSettings', Icon: IconSettings, end: false },
];

const ADMIN_NAV: NavEntry[] = [
  { to: '/owner/admin/owners', key: 'adminOwners', Icon: IconUsers, end: false },
  { to: '/owner/admin/approvals', key: 'adminApprovals', Icon: IconCheck, end: false },
];

const PortalLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t, user, setUser } = usePortal();
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => { ownerSession.clear(); setUser(null); navigate('/owner/login'); };

  const navItem = (item: typeof NAV[number], mobile = false) => {
    const active = item.end ? location.pathname === item.to : location.pathname.startsWith(item.to);
    return (
      <NavLink key={item.to} to={item.to} end={item.end}
        style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: mobile ? '0.4rem 0.5rem' : '0.65rem 0.8rem', borderRadius: 12,
          flexDirection: mobile ? 'column' : 'row', fontSize: mobile ? '0.62rem' : '0.92rem',
          fontWeight: active ? 700 : 500,
          color: active ? 'var(--gold)' : 'var(--text-muted)',
          background: active && !mobile ? 'var(--accent-bg)' : 'transparent',
          position: 'relative', transition: 'all 0.15s',
        }}>
        <item.Icon size={mobile ? 21 : 20} strokeWidth={active ? 2 : 1.6} />
        <span>{t(item.key)}</span>
        {item.soon && !mobile && (
          <span style={{ marginLeft: 'auto', fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: '0.08em', color: 'var(--text-faint)', border: '1px solid var(--border)', borderRadius: 999, padding: '2px 7px' }}>
            {t('soon')}
          </span>
        )}
      </NavLink>
    );
  };

  const firstName = (user?.name || '').split(' ')[0] || '';
  const items: NavEntry[] = user?.role === 'admin' ? [...NAV, ...ADMIN_NAV] : NAV;

  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>
      {/* Sidebar (desktop) */}
      <aside style={{
        width: 260, flexShrink: 0, borderRight: '1px solid var(--border)', background: 'var(--surface)',
        padding: '1.5rem 1rem', flexDirection: 'column', gap: 4, position: 'sticky', top: 0, height: '100vh',
        display: 'none',
      }} className="pl-sidebar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0.3rem 0.6rem 1.4rem' }}>
          <div style={{ width: 38, height: 38, borderRadius: 11, background: 'var(--navy)', color: 'var(--gold-soft)',
            display: 'grid', placeItems: 'center', flexShrink: 0 }}>
            <IconKey size={20} />
          </div>
          <div style={{ lineHeight: 1.15 }}>
            <div className="serif" style={{ fontSize: '1.15rem', color: 'var(--text)' }}>{t('brand')}</div>
            <div style={{ fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-faint)' }}>{t('ownerPortal')}</div>
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
          {items.map((i) => navItem(i))}
        </nav>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0.5rem 0.6rem' }}>
            <div style={{ width: 34, height: 34, borderRadius: 999, background: 'var(--accent-bg)', color: 'var(--gold)',
              display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: '0.85rem' }}>
              {firstName.slice(0, 1).toUpperCase()}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{user?.name}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-faint)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{user?.email}</div>
            </div>
          </div>
          <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0.6rem 0.8rem',
            borderRadius: 12, fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            <IconLogout size={20} />{t('logout')}
          </button>
        </div>
      </aside>

      {/* Main column */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        {/* Topbar */}
        <header style={{
          position: 'sticky', top: 0, zIndex: 40, display: 'flex', alignItems: 'center', gap: 12,
          padding: '0.8rem 1.1rem', borderBottom: '1px solid var(--border)',
          background: 'color-mix(in srgb, var(--bg) 82%, transparent)', backdropFilter: 'blur(12px)',
        }}>
          <div className="pl-mobile-brand" style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: 'var(--navy)', color: 'var(--gold-soft)', display: 'grid', placeItems: 'center' }}>
              <IconKey size={17} />
            </div>
            <span className="serif" style={{ fontSize: '1.05rem' }}>{t('brand')}</span>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
            <ThemeToggle />
            <LangMenu />
          </div>
        </header>

        <main style={{ flex: 1, padding: '1.25rem', paddingBottom: 96 }} className="pl-main">
          {children}
        </main>
      </div>

      {/* Bottom nav (mobile) */}
      <nav className="pl-bottomnav" style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50, display: 'flex', justifyContent: 'space-around',
        padding: '0.4rem 0.5rem calc(0.4rem + env(safe-area-inset-bottom))', borderTop: '1px solid var(--border)',
        background: 'color-mix(in srgb, var(--surface) 92%, transparent)', backdropFilter: 'blur(16px)',
      }}>
        {items.filter((i) => !i.soon).map((i) => navItem(i, true))}
      </nav>

      <style>{`
        @media (min-width: 900px) {
          .pl-sidebar { display: flex !important; }
          .pl-bottomnav { display: none !important; }
          .pl-mobile-brand { display: none !important; }
          .pl-main { padding: 2rem 2.5rem !important; padding-bottom: 2.5rem !important; }
        }
      `}</style>
    </div>
  );
};

export default PortalLayout;
