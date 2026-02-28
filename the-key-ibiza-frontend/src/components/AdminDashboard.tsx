import React, { useState, useEffect } from 'react';
import { vipAuth } from '../services/vipAuth';

const BACKEND_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:5001'
  : 'https://the-key-ibiza-backend.vercel.app';

interface AuditStats {
  totalSessions: number;
  totalActions: number;
  uniqueIPs: number;
  vipSessions: number;
  byBrowser: Record<string, number>;
  byDevice: Record<string, number>;
  byAction: Record<string, number>;
  topPages: Record<string, number>;
  recentSessions: any[];
  recentActions: any[];
}

interface VipUser {
  id: string;
  name: string;
  email: string;
}

interface AdminDashboardProps {
  onNavigate: (view: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const [stats, setStats] = useState<AuditStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'sessions' | 'actions' | 'vip'>('overview');
  const [vipUsers, setVipUsers] = useState<VipUser[]>([]);
  const [selectedVip, setSelectedVip] = useState<string | null>(null);
  const [vipHistory, setVipHistory] = useState<any[]>([]);

  // Check if user is admin
  useEffect(() => {
    if (!vipAuth.isAdmin()) {
      onNavigate('home');
    }
  }, [onNavigate]);

  // Fetch stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/audit/stats`);
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        } else {
          setError('Failed to load statistics');
        }
      } catch (err) {
        setError('Connection error');
      }
      setLoading(false);
    };
    fetchStats();
  }, []);

  // Fetch VIP users
  useEffect(() => {
    const fetchVipUsers = async () => {
      try {
        const token = localStorage.getItem('vip_token') || sessionStorage.getItem('vip_token');
        const res = await fetch(`${BACKEND_URL}/vip/users`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setVipUsers(data.users || []);
        }
      } catch (err) {
        console.error('Failed to fetch VIP users:', err);
      }
    };
    fetchVipUsers();
  }, []);

  // Fetch VIP history when selected
  useEffect(() => {
    if (selectedVip) {
      const fetchVipHistory = async () => {
        try {
          const res = await fetch(`${BACKEND_URL}/api/audit/vip/${selectedVip}`);
          if (res.ok) {
            const data = await res.json();
            setVipHistory(data);
          }
        } catch (err) {
          console.error('Failed to fetch VIP history:', err);
        }
      };
      fetchVipHistory();
    }
  }, [selectedVip]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAction = (action: string) => {
    return action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (loading) {
    return (
      <div className="pt-40 pb-24 min-h-screen" style={{ backgroundColor: '#0B1C26' }}>
        <div className="container mx-auto px-6 text-center">
          <div className="w-12 h-12 border-2 border-luxury-gold/30 border-t-luxury-gold rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-40 pb-24 min-h-screen" style={{ backgroundColor: '#0B1C26' }}>
        <div className="container mx-auto px-6 text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => onNavigate('home')}
            className="px-6 py-2 rounded-full bg-luxury-gold text-luxury-blue text-sm"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-40 pb-24 min-h-screen" style={{ backgroundColor: '#0B1C26' }}>
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div>
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center text-white/40 hover:text-luxury-gold transition-colors mb-4 text-sm"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-2">Analytics Dashboard</h1>
            <p className="text-white/40">Last 30 days activity</p>
          </div>
          <div className="mt-4 md:mt-0 text-right">
            <p className="text-luxury-gold text-sm">Admin: {vipAuth.getUserName()}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {(['overview', 'sessions', 'actions', 'vip'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-full text-xs uppercase tracking-wider transition-all ${
                activeTab === tab
                  ? 'bg-luxury-gold text-luxury-blue'
                  : 'bg-transparent border border-white/20 text-white/60 hover:border-luxury-gold/50'
              }`}
            >
              {tab === 'vip' ? 'VIP Tracking' : tab}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && stats && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
              <div className="bg-gradient-to-br from-luxury-slate/50 to-luxury-slate/20 rounded-2xl p-6 border border-white/10">
                <p className="text-white/50 text-[10px] uppercase tracking-wider mb-2">Total Sessions</p>
                <p className="text-3xl md:text-4xl text-luxury-gold font-serif">{stats.totalSessions.toLocaleString()}</p>
              </div>
              <div className="bg-gradient-to-br from-luxury-slate/50 to-luxury-slate/20 rounded-2xl p-6 border border-white/10">
                <p className="text-white/50 text-[10px] uppercase tracking-wider mb-2">Total Actions</p>
                <p className="text-3xl md:text-4xl text-luxury-gold font-serif">{stats.totalActions.toLocaleString()}</p>
              </div>
              <div className="bg-gradient-to-br from-luxury-slate/50 to-luxury-slate/20 rounded-2xl p-6 border border-white/10">
                <p className="text-white/50 text-[10px] uppercase tracking-wider mb-2">Unique Visitors</p>
                <p className="text-3xl md:text-4xl text-luxury-gold font-serif">{stats.uniqueIPs.toLocaleString()}</p>
              </div>
              <div className="bg-gradient-to-br from-luxury-slate/50 to-luxury-slate/20 rounded-2xl p-6 border border-white/10">
                <p className="text-white/50 text-[10px] uppercase tracking-wider mb-2">VIP Sessions</p>
                <p className="text-3xl md:text-4xl text-luxury-gold font-serif">{stats.vipSessions.toLocaleString()}</p>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {/* By Browser */}
              <div className="bg-luxury-slate/30 rounded-2xl p-6 border border-white/10">
                <h3 className="text-white text-lg font-serif mb-4">By Browser</h3>
                <div className="space-y-3">
                  {Object.entries(stats.byBrowser)
                    .sort(([,a], [,b]) => b - a)
                    .map(([browser, count]) => {
                      const percentage = Math.round((count / stats.totalSessions) * 100);
                      return (
                        <div key={browser}>
                          <div className="flex justify-between mb-1">
                            <span className="text-white/60 text-sm">{browser}</span>
                            <span className="text-luxury-gold text-sm">{count} ({percentage}%)</span>
                          </div>
                          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-luxury-gold rounded-full transition-all"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* By Device */}
              <div className="bg-luxury-slate/30 rounded-2xl p-6 border border-white/10">
                <h3 className="text-white text-lg font-serif mb-4">By Device</h3>
                <div className="space-y-3">
                  {Object.entries(stats.byDevice)
                    .sort(([,a], [,b]) => b - a)
                    .map(([device, count]) => {
                      const percentage = Math.round((count / stats.totalSessions) * 100);
                      return (
                        <div key={device}>
                          <div className="flex justify-between mb-1">
                            <span className="text-white/60 text-sm">{device}</span>
                            <span className="text-luxury-gold text-sm">{count} ({percentage}%)</span>
                          </div>
                          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-luxury-gold rounded-full transition-all"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* By Action */}
              <div className="bg-luxury-slate/30 rounded-2xl p-6 border border-white/10">
                <h3 className="text-white text-lg font-serif mb-4">By Action Type</h3>
                <div className="space-y-3">
                  {Object.entries(stats.byAction)
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 6)
                    .map(([action, count]) => {
                      const percentage = Math.round((count / stats.totalActions) * 100);
                      return (
                        <div key={action}>
                          <div className="flex justify-between mb-1">
                            <span className="text-white/60 text-sm">{formatAction(action)}</span>
                            <span className="text-luxury-gold text-sm">{count}</span>
                          </div>
                          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-luxury-gold rounded-full transition-all"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>

            {/* Top Pages */}
            <div className="bg-luxury-slate/30 rounded-2xl p-6 border border-white/10">
              <h3 className="text-white text-lg font-serif mb-4">Top Pages</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(stats.topPages)
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 10)
                  .map(([page, count], index) => (
                    <div key={page} className="flex items-center justify-between py-2 border-b border-white/5">
                      <div className="flex items-center">
                        <span className="text-luxury-gold/50 text-sm w-6">{index + 1}.</span>
                        <span className="text-white/70 text-sm truncate max-w-[200px] md:max-w-[300px]">{page}</span>
                      </div>
                      <span className="text-luxury-gold text-sm ml-4">{count}</span>
                    </div>
                  ))}
              </div>
            </div>
          </>
        )}

        {/* Sessions Tab */}
        {activeTab === 'sessions' && stats && (
          <div className="bg-luxury-slate/30 rounded-2xl p-6 border border-white/10 overflow-x-auto">
            <h3 className="text-white text-lg font-serif mb-4">Recent Sessions</h3>
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="text-white/50 text-[10px] uppercase tracking-wider border-b border-white/10">
                  <th className="text-left pb-3 pr-4">Date</th>
                  <th className="text-left pb-3 pr-4">Browser</th>
                  <th className="text-left pb-3 pr-4">Device</th>
                  <th className="text-left pb-3 pr-4">IP</th>
                  <th className="text-left pb-3">VIP</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentSessions.map((session: any) => (
                  <tr key={session.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-3 pr-4 text-white/60 text-sm">{formatDate(session.created_at)}</td>
                    <td className="py-3 pr-4 text-white/60 text-sm">{session.browser}</td>
                    <td className="py-3 pr-4 text-white/60 text-sm">{session.device}</td>
                    <td className="py-3 pr-4 text-white/40 text-sm font-mono">{session.ip}</td>
                    <td className="py-3">
                      {session.vip_id ? (
                        <span className="px-2 py-1 rounded-full bg-luxury-gold/20 text-luxury-gold text-[10px]">VIP</span>
                      ) : (
                        <span className="text-white/30 text-sm">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Actions Tab */}
        {activeTab === 'actions' && stats && (
          <div className="bg-luxury-slate/30 rounded-2xl p-6 border border-white/10 overflow-x-auto">
            <h3 className="text-white text-lg font-serif mb-4">Recent Actions</h3>
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="text-white/50 text-[10px] uppercase tracking-wider border-b border-white/10">
                  <th className="text-left pb-3 pr-4">Date</th>
                  <th className="text-left pb-3 pr-4">Action</th>
                  <th className="text-left pb-3 pr-4">URL</th>
                  <th className="text-left pb-3">Details</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentActions.map((action: any) => (
                  <tr key={action.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-3 pr-4 text-white/60 text-sm whitespace-nowrap">{formatDate(action.created_at)}</td>
                    <td className="py-3 pr-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] ${
                        action.action === 'vip_login' ? 'bg-green-500/20 text-green-400' :
                        action.action === 'pdf_download' ? 'bg-blue-500/20 text-blue-400' :
                        action.action === 'villa_view' ? 'bg-purple-500/20 text-purple-400' :
                        action.action === 'yacht_view' ? 'bg-cyan-500/20 text-cyan-400' :
                        'bg-white/10 text-white/60'
                      }`}>
                        {formatAction(action.action)}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-white/40 text-sm truncate max-w-[200px]">{action.url}</td>
                    <td className="py-3 text-white/30 text-xs">
                      {action.metadata ? JSON.stringify(action.metadata).slice(0, 50) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* VIP Tracking Tab */}
        {activeTab === 'vip' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* VIP User List */}
            <div className="bg-luxury-slate/30 rounded-2xl p-6 border border-white/10">
              <h3 className="text-white text-lg font-serif mb-4">VIP Users</h3>
              <div className="space-y-2">
                {vipUsers.length > 0 ? vipUsers.map((vip) => (
                  <button
                    key={vip.id}
                    onClick={() => setSelectedVip(vip.id)}
                    className={`w-full text-left p-3 rounded-xl transition-all ${
                      selectedVip === vip.id
                        ? 'bg-luxury-gold/20 border border-luxury-gold/50'
                        : 'bg-white/5 border border-transparent hover:border-white/20'
                    }`}
                  >
                    <p className="text-white text-sm font-medium">{vip.name}</p>
                    <p className="text-white/40 text-xs">{vip.email}</p>
                  </button>
                )) : (
                  <p className="text-white/40 text-sm">No VIP users found</p>
                )}
              </div>
            </div>

            {/* VIP Activity */}
            <div className="md:col-span-2 bg-luxury-slate/30 rounded-2xl p-6 border border-white/10">
              <h3 className="text-white text-lg font-serif mb-4">
                {selectedVip ? 'User Activity' : 'Select a VIP user'}
              </h3>
              {selectedVip && vipHistory.length > 0 ? (
                <div className="space-y-4 max-h-[500px] overflow-y-auto">
                  {vipHistory.map((session: any) => (
                    <div key={session.id} className="border-b border-white/10 pb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white/60 text-sm">{formatDate(session.created_at)}</span>
                        <span className="text-white/40 text-xs">{session.browser} / {session.device}</span>
                      </div>
                      <div className="space-y-1">
                        {session.audit_actions?.map((action: any) => (
                          <div key={action.id} className="flex items-center text-sm">
                            <span className={`w-2 h-2 rounded-full mr-2 ${
                              action.action === 'pdf_download' ? 'bg-blue-400' :
                              action.action === 'villa_view' ? 'bg-purple-400' :
                              action.action === 'yacht_view' ? 'bg-cyan-400' :
                              action.action === 'search' ? 'bg-yellow-400' :
                              'bg-white/30'
                            }`}></span>
                            <span className="text-luxury-gold">{formatAction(action.action)}</span>
                            <span className="text-white/40 ml-2 truncate">{action.url}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : selectedVip ? (
                <p className="text-white/40 text-sm">No activity found for this user</p>
              ) : (
                <p className="text-white/40 text-sm">Select a VIP user from the list to see their activity</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
