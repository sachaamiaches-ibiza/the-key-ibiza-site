
import React, { useState, useEffect } from 'react';
import { vipAuth } from '../services/vipAuth';
import { linkAuditToVip, trackAction } from '../hooks/useAudit';

interface VipLoginProps {
  onAuthChange?: (isVip: boolean) => void;
}

// Auto-detect environment
const BACKEND_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:5001'
  : 'https://the-key-ibiza-backend.vercel.app';

const VipLogin: React.FC<VipLoginProps> = ({ onAuthChange }) => {
  const [isVip, setIsVip] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [userName, setUserName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  useEffect(() => {
    // Check authentication status on mount only
    const authenticated = vipAuth.isAuthenticated();
    const admin = vipAuth.isAdmin();
    const name = vipAuth.getUserName();
    setIsVip(authenticated);
    setIsAdmin(admin);
    setUserName(name);
    if (onAuthChange) {
      onAuthChange(authenticated);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    setShowForgotPassword(false);

    try {
      const response = await fetch(`${BACKEND_URL}/vip/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Store token and user info based on rememberMe preference
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem('vip_token', data.token);
        storage.setItem('vip_user', JSON.stringify(data.user));
        if (rememberMe) {
          localStorage.setItem('vip_remember', 'true');
        } else {
          localStorage.removeItem('vip_remember');
        }

        // Link audit session to VIP user
        if (data.user?.id) {
          linkAuditToVip(data.user.id);
          trackAction('vip_login', '/vip-login', {
            vipEmail: data.user.email,
            vipName: data.user.name
          });
        }

        setIsVip(true);
        setIsAdmin(data.user?.role === 'admin');
        setUserName(data.user?.name || 'VIP Guest');
        onAuthChange?.(true);
        setEmail('');
        setPassword('');
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    }
    setIsLoading(false);
  };

  const handleLogout = () => {
    vipAuth.logout();
    setIsVip(false);
    setIsAdmin(false);
    onAuthChange?.(false);
  };

  // Logged in state - show welcome message
  if (isVip) {
    return (
      <div className="text-center">
        <h3 className="text-luxury-gold text-xs uppercase tracking-[0.3em] font-semibold mb-5">VIP Access</h3>
        <div className="border border-luxury-gold/30 rounded-2xl p-6 max-w-xs mx-auto" style={{ background: 'linear-gradient(145deg, rgba(196,164,97,0.12) 0%, rgba(196,164,97,0.05) 100%)' }}>
          <div className="mb-4">
            <svg className="w-10 h-10 mx-auto text-luxury-gold mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <p className="text-luxury-gold text-base font-serif italic mb-2 leading-relaxed">
            Welcome, {userName}
          </p>
          <p className="text-white/60 text-sm leading-relaxed mb-2">
            to the private The Key Ibiza space.
          </p>
          <p className="text-white/50 text-xs leading-relaxed mb-5">
            Please enjoy the journey and feel free to contact us if you have any questions.
          </p>
          <button
            onClick={handleLogout}
            className="w-full bg-transparent border border-white/30 text-white/70 py-2.5 rounded-full text-[10px] uppercase tracking-[0.2em] font-medium hover:border-luxury-gold hover:text-luxury-gold transition-all"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  // Login form
  return (
    <div className="text-center">
      <h3 className="text-luxury-gold text-xs uppercase tracking-[0.3em] font-semibold mb-5">VIP Access</h3>
      <div className="border border-white/15 rounded-2xl p-6 max-w-xs mx-auto" style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)' }}>
        {showForgotPassword ? (
          // Forgot password message
          <div className="py-4">
            <svg className="w-12 h-12 mx-auto text-luxury-gold/70 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <p className="text-white/70 text-sm leading-relaxed mb-6">
              Please contact your collaborator to obtain new credentials.
            </p>
            <button
              type="button"
              onClick={() => setShowForgotPassword(false)}
              className="text-luxury-gold text-xs uppercase tracking-wider hover:underline"
            >
              Back to login
            </button>
          </div>
        ) : (
          // Login form
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border-b border-white/25 px-0 py-2.5 text-white text-base focus:outline-none focus:border-luxury-gold transition-colors placeholder:text-white/40 mb-4"
              autoComplete="email"
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border-b border-white/25 px-0 py-2.5 pr-10 text-white text-base focus:outline-none focus:border-luxury-gold transition-colors placeholder:text-white/40"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-luxury-gold/70 hover:text-luxury-gold transition-colors p-2"
              >
                {showPassword ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            <div className="flex items-center justify-center mt-4 mb-3">
              <label className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-white/30 bg-transparent text-luxury-gold focus:ring-luxury-gold focus:ring-offset-0 cursor-pointer"
                />
                <span className="ml-2 text-white/50 text-[11px] tracking-wide group-hover:text-white/70 transition-colors">
                  Keep me signed in
                </span>
              </label>
            </div>
            {error && (
              <p className="text-red-400 text-xs mb-3 tracking-wide">{error}</p>
            )}
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="text-white/40 text-[10px] mb-4 block mx-auto hover:text-luxury-gold transition-colors tracking-wide"
            >
              Forgotten password?
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-luxury-gold text-luxury-blue py-2.5 rounded-full text-[10px] uppercase tracking-[0.2em] font-medium hover:bg-luxury-blue hover:text-luxury-gold border border-luxury-gold transition-all disabled:opacity-50"
            >
              {isLoading ? '...' : 'Sign In'}
            </button>
          </form>
        )}
        <p className="text-white/40 text-[9px] mt-4 tracking-wider">Members only</p>
      </div>
    </div>
  );
};

export default VipLogin;
