import React, { useState, useEffect } from 'react';
import { vipAuth } from '../services/vipAuth';

const BACKEND_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:5001'
  : 'https://the-key-ibiza-backend.vercel.app';

// Convert country code to flag emoji
const getCountryFlag = (countryCode: string | null): string => {
  if (!countryCode) return '';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

// Format slug to readable name
const formatSlug = (slug: string): string => {
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
};

interface BehavioralStats {
  avgPagesPerSession: number;
  bounceRate: number;
  sessionsWithActions: number;
}

interface TopItem {
  name: string;
  views: number;
}

interface GeoIntelligence {
  country: string;
  sessions: number;
  topVillas: string[];
  topYachts: string[];
}

interface DailyTrend {
  date: string;
  sessions: number;
  actions: number;
  vipSessions: number;
}

interface AuditStats {
  period: string;
  totalSessions: number;
  totalActions: number;
  uniqueIPs: number;
  vipSessions: number;
  byBrowser: Record<string, number>;
  byDevice: Record<string, number>;
  byCountry: Record<string, number>;
  byAction: Record<string, number>;
  topPages: Record<string, number>;
  recentSessions: any[];
  recentActions: any[];
  behavioral: BehavioralStats;
  topVillas: TopItem[];
  topYachts: TopItem[];
  geoIntelligence: GeoIntelligence[];
  dailyTrend: DailyTrend[];
}

interface VipUser {
  id: string;
  name: string;
  email: string;
}

interface AdminDashboardProps {
  onNavigate: (view: string) => void;
}

const PERIOD_OPTIONS = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '3m', label: 'Last 3 months' },
  { value: '6m', label: 'Last 6 months' },
  { value: '1y', label: 'Last year' },
  { value: 'all', label: 'All time' }
];

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const [stats, setStats] = useState<AuditStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'advanced' | 'sessions' | 'actions' | 'vip'>('overview');
  const [period, setPeriod] = useState('30d');
  const [vipUsers, setVipUsers] = useState<VipUser[]>([]);
  const [selectedVip, setSelectedVip] = useState<string | null>(null);
  const [vipHistory, setVipHistory] = useState<any[]>([]);

  // Check if user is admin
  useEffect(() => {
    if (!vipAuth.isAdmin()) {
      onNavigate('home');
    }
  }, [onNavigate]);

  // Fetch stats with period
  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${BACKEND_URL}/api/audit/stats?period=${period}`);
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
  }, [period]);

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

  const formatShortDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short'
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

  // Calculate max for trend chart
  const maxSessions = stats?.dailyTrend?.reduce((max, d) => Math.max(max, d.sessions), 0) || 1;

  return (
    <div className="pt-40 pb-24 min-h-screen" style={{ backgroundColor: '#0B1C26' }}>
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
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
            <p className="text-white/40">Advanced insights and tracking</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-4">
            {/* Period Selector */}
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="bg-luxury-slate/50 border border-white/20 rounded-lg px-4 py-2 pr-8 text-white text-sm focus:outline-none focus:border-luxury-gold appearance-none cursor-pointer"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23C4A461'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center', backgroundSize: '16px' }}
            >
              {PERIOD_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <p className="text-luxury-gold text-sm">{vipAuth.getUserName()}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {(['overview', 'advanced', 'sessions', 'actions', 'vip'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-full text-xs uppercase tracking-wider transition-all ${
                activeTab === tab
                  ? 'bg-luxury-gold text-luxury-blue'
                  : 'bg-transparent border border-white/20 text-white/60 hover:border-luxury-gold/50'
              }`}
            >
              {tab === 'vip' ? 'VIP Tracking' : tab === 'advanced' ? 'Advanced' : tab}
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

            {/* Behavioral Stats */}
            {stats.behavioral && (
              <div className="grid grid-cols-3 gap-4 md:gap-6 mb-12">
                <div className="bg-gradient-to-br from-green-900/30 to-green-900/10 rounded-2xl p-6 border border-green-500/20">
                  <p className="text-green-400/70 text-[10px] uppercase tracking-wider mb-2">Avg Pages/Session</p>
                  <p className="text-3xl md:text-4xl text-green-400 font-serif">{stats.behavioral.avgPagesPerSession}</p>
                </div>
                <div className="bg-gradient-to-br from-amber-900/30 to-amber-900/10 rounded-2xl p-6 border border-amber-500/20">
                  <p className="text-amber-400/70 text-[10px] uppercase tracking-wider mb-2">Bounce Rate</p>
                  <p className="text-3xl md:text-4xl text-amber-400 font-serif">{stats.behavioral.bounceRate}%</p>
                </div>
                <div className="bg-gradient-to-br from-blue-900/30 to-blue-900/10 rounded-2xl p-6 border border-blue-500/20">
                  <p className="text-blue-400/70 text-[10px] uppercase tracking-wider mb-2">Active Sessions</p>
                  <p className="text-3xl md:text-4xl text-blue-400 font-serif">{stats.behavioral.sessionsWithActions}</p>
                </div>
              </div>
            )}

            {/* Charts Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {/* By Country */}
              <div className="bg-luxury-slate/30 rounded-2xl p-6 border border-white/10">
                <h3 className="text-white text-lg font-serif mb-4">By Country</h3>
                <div className="space-y-3">
                  {Object.entries(stats.byCountry || {})
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 8)
                    .map(([country, count]) => {
                      const percentage = Math.round((count / stats.totalSessions) * 100);
                      return (
                        <div key={country}>
                          <div className="flex justify-between mb-1">
                            <span className="text-white/60 text-sm">{country}</span>
                            <span className="text-luxury-gold text-sm">{count} ({percentage}%)</span>
                          </div>
                          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-luxury-gold to-amber-400 rounded-full transition-all"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

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

        {/* Advanced Analytics Tab */}
        {activeTab === 'advanced' && stats && (
          <>
            {/* Daily Trend Chart */}
            <div className="bg-luxury-slate/30 rounded-2xl p-6 border border-white/10 mb-8">
              <h3 className="text-white text-lg font-serif mb-6">Sessions Trend</h3>
              <div className="h-48 flex items-end gap-1">
                {stats.dailyTrend?.map((day, i) => (
                  <div
                    key={day.date}
                    className="flex-1 group relative"
                  >
                    <div
                      className="bg-gradient-to-t from-luxury-gold to-amber-400 rounded-t transition-all hover:from-luxury-gold hover:to-yellow-300"
                      style={{ height: `${(day.sessions / maxSessions) * 100}%`, minHeight: '4px' }}
                    />
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-luxury-blue/90 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                      {formatShortDate(day.date)}: {day.sessions} sessions
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-white/40 text-xs">
                  {stats.dailyTrend?.[0]?.date ? formatShortDate(stats.dailyTrend[0].date) : ''}
                </span>
                <span className="text-white/40 text-xs">
                  {stats.dailyTrend?.[stats.dailyTrend.length - 1]?.date ? formatShortDate(stats.dailyTrend[stats.dailyTrend.length - 1].date) : ''}
                </span>
              </div>
            </div>

            {/* Top Content Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Top Villas */}
              <div className="bg-luxury-slate/30 rounded-2xl p-6 border border-white/10">
                <h3 className="text-white text-lg font-serif mb-4 flex items-center">
                  <span className="w-3 h-3 bg-purple-500 rounded-full mr-3"></span>
                  Top Villas
                </h3>
                <div className="space-y-3">
                  {stats.topVillas?.length > 0 ? stats.topVillas.map((villa, i) => (
                    <div key={villa.name} className="flex items-center justify-between py-2 border-b border-white/5">
                      <div className="flex items-center">
                        <span className="text-luxury-gold/50 text-sm w-6">{i + 1}.</span>
                        <span className="text-white/70 text-sm">{formatSlug(villa.name)}</span>
                      </div>
                      <span className="text-purple-400 text-sm">{villa.views} views</span>
                    </div>
                  )) : (
                    <p className="text-white/40 text-sm">No villa views recorded</p>
                  )}
                </div>
              </div>

              {/* Top Yachts */}
              <div className="bg-luxury-slate/30 rounded-2xl p-6 border border-white/10">
                <h3 className="text-white text-lg font-serif mb-4 flex items-center">
                  <span className="w-3 h-3 bg-cyan-500 rounded-full mr-3"></span>
                  Top Yachts
                </h3>
                <div className="space-y-3">
                  {stats.topYachts?.length > 0 ? stats.topYachts.map((yacht, i) => (
                    <div key={yacht.name} className="flex items-center justify-between py-2 border-b border-white/5">
                      <div className="flex items-center">
                        <span className="text-luxury-gold/50 text-sm w-6">{i + 1}.</span>
                        <span className="text-white/70 text-sm">{formatSlug(yacht.name)}</span>
                      </div>
                      <span className="text-cyan-400 text-sm">{yacht.views} views</span>
                    </div>
                  )) : (
                    <p className="text-white/40 text-sm">No yacht views recorded</p>
                  )}
                </div>
              </div>
            </div>

            {/* Geographic Intelligence */}
            <div className="bg-luxury-slate/30 rounded-2xl p-6 border border-white/10">
              <h3 className="text-white text-lg font-serif mb-6">Geographic Intelligence</h3>
              <p className="text-white/40 text-sm mb-4">What visitors from each country are interested in</p>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="text-white/50 text-[10px] uppercase tracking-wider border-b border-white/10">
                      <th className="text-left pb-3 pr-4">Country</th>
                      <th className="text-left pb-3 pr-4">Sessions</th>
                      <th className="text-left pb-3 pr-4">Top Villas</th>
                      <th className="text-left pb-3">Top Yachts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.geoIntelligence?.map((geo) => (
                      <tr key={geo.country} className="border-b border-white/5 hover:bg-white/5">
                        <td className="py-3 pr-4 text-white text-sm font-medium">{geo.country}</td>
                        <td className="py-3 pr-4 text-luxury-gold text-sm">{geo.sessions}</td>
                        <td className="py-3 pr-4">
                          {geo.topVillas.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {geo.topVillas.map(v => (
                                <span key={v} className="px-2 py-0.5 bg-purple-500/20 text-purple-300 text-xs rounded">
                                  {formatSlug(v)}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-white/30 text-sm">-</span>
                          )}
                        </td>
                        <td className="py-3">
                          {geo.topYachts.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {geo.topYachts.map(y => (
                                <span key={y} className="px-2 py-0.5 bg-cyan-500/20 text-cyan-300 text-xs rounded">
                                  {formatSlug(y)}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-white/30 text-sm">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Sessions Tab */}
        {activeTab === 'sessions' && stats && (
          <div className="bg-luxury-slate/30 rounded-2xl p-6 border border-white/10 overflow-x-auto">
            <h3 className="text-white text-lg font-serif mb-4">Recent Sessions</h3>
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="text-white/50 text-[10px] uppercase tracking-wider border-b border-white/10">
                  <th className="text-left pb-3 pr-4">Date</th>
                  <th className="text-left pb-3 pr-4">Country</th>
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
                    <td className="py-3 pr-4 text-white/60 text-sm">
                      {session.country ? (
                        <span className="flex items-center gap-1">
                          <span className="text-lg">{getCountryFlag(session.country_code)}</span>
                          <span>{session.country}</span>
                        </span>
                      ) : (
                        <span className="text-white/30">-</span>
                      )}
                    </td>
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
