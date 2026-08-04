import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './portal.css';
import { PortalProvider, usePortal } from './PortalContext';
import { ownerSession } from './ownerApi';
import PortalLayout from './PortalLayout';
import OwnerLogin from './OwnerLogin';
import OwnerDashboard from './OwnerDashboard';
import OwnerVillas from './OwnerVillas';
import OwnerCalendar from './OwnerCalendar';
import OwnerSettings from './OwnerSettings';
import AdminOwners from './AdminOwners';
import AdminApprovals from './AdminApprovals';
import { IconMessage } from './icons';

const RequireOwner: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const location = useLocation();
  if (!ownerSession.isAuthed()) {
    return <Navigate to="/owner/login" replace state={{ from: location.pathname }} />;
  }
  return children;
};

const ComingSoonPage: React.FC = () => {
  const { t } = usePortal();
  return (
    <div className="pl-animate" style={{ display: 'grid', placeItems: 'center', minHeight: '60vh', textAlign: 'center' }}>
      <div>
        <div style={{ width: 64, height: 64, borderRadius: 18, background: 'var(--accent-bg)', color: 'var(--gold)', display: 'grid', placeItems: 'center', margin: '0 auto 18px' }}>
          <IconMessage size={30} />
        </div>
        <h2 className="serif" style={{ fontSize: '1.6rem', marginBottom: 6 }}>{t('navMessages')}</h2>
        <p style={{ color: 'var(--text-muted)' }}>{t('comingInPhase')}</p>
      </div>
    </div>
  );
};

const RequireAdmin: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  if (!ownerSession.isAuthed()) return <Navigate to="/owner/login" replace />;
  if (ownerSession.user()?.role !== 'admin') return <Navigate to="/owner" replace />;
  return children;
};

const Shell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <RequireOwner><PortalLayout>{children}</PortalLayout></RequireOwner>
);

const AdminShell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <RequireAdmin><PortalLayout>{children}</PortalLayout></RequireAdmin>
);

const OwnerApp: React.FC = () => (
  <PortalProvider>
    <Routes>
      <Route path="login" element={ownerSession.isAuthed() ? <Navigate to="/owner" replace /> : <OwnerLogin />} />
      <Route path="" element={<Shell><OwnerDashboard /></Shell>} />
      <Route path="properties" element={<Shell><OwnerVillas /></Shell>} />
      <Route path="calendar" element={<Shell><OwnerCalendar /></Shell>} />
      <Route path="calendar/:slug" element={<Shell><OwnerCalendar /></Shell>} />
      <Route path="messages" element={<Shell><ComingSoonPage /></Shell>} />
      <Route path="settings" element={<Shell><OwnerSettings /></Shell>} />
      <Route path="admin/owners" element={<AdminShell><AdminOwners /></AdminShell>} />
      <Route path="admin/approvals" element={<AdminShell><AdminApprovals /></AdminShell>} />
      <Route path="*" element={<Navigate to="/owner" replace />} />
    </Routes>
  </PortalProvider>
);

export default OwnerApp;
