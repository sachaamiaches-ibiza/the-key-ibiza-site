
import React, { useState, useEffect } from 'react';
import { vipAuth } from '../services/vipAuth';
import VipUserManagement from './VipUserManagement';

interface VipLoginProps {
  onAuthChange?: (isVip: boolean) => void;
}

const VipLogin: React.FC<VipLoginProps> = ({ onAuthChange }) => {
  const [isVip, setIsVip] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [userName, setUserName] = useState('');
  const [showUserManagement, setShowUserManagement] = useState(false);

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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    setShowForgotPassword(false);

    setTimeout(() => {
      const success = vipAuth.login(email, password);
      if (success) {
        setIsVip(true);
        setIsAdmin(vipAuth.isAdmin());
        setUserName(vipAuth.getUserName());
        onAuthChange?.(true);
        setEmail('');
        setPassword('');
      } else {
        setError('Invalid credentials');
      }
      setIsLoading(false);
    }, 500);
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
          {isAdmin && (
            <>
              <p className="text-luxury-gold/60 text-[10px] uppercase tracking-wider mb-4">
                Admin Access
              </p>
              <button
                onClick={() => setShowUserManagement(true)}
                className="w-full bg-luxury-gold/20 border border-luxury-gold/30 text-luxury-gold py-2.5 rounded-full text-[10px] uppercase tracking-[0.2em] font-medium hover:bg-luxury-gold hover:text-luxury-blue transition-all mb-3"
              >
                Manage Users
              </button>
            </>
          )}
          <button
            onClick={handleLogout}
            className="w-full bg-transparent border border-white/30 text-white/70 py-2.5 rounded-full text-[10px] uppercase tracking-[0.2em] font-medium hover:border-luxury-gold hover:text-luxury-gold transition-all"
          >
            Sign Out
          </button>
        </div>
        {showUserManagement && <VipUserManagement onClose={() => setShowUserManagement(false)} />}
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
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border-b border-white/25 px-0 py-2.5 text-white text-base focus:outline-none focus:border-luxury-gold transition-colors placeholder:text-white/40 mb-3"
              autoComplete="current-password"
            />
            {error && (
              <p className="text-red-400 text-xs mb-3 tracking-wide">{error}</p>
            )}
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="text-white/40 text-[10px] mb-5 block mx-auto hover:text-luxury-gold transition-colors tracking-wide"
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
