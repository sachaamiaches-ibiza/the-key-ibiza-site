
import React, { useState, useEffect } from 'react';
import { vipAuth } from '../services/vipAuth';

interface VipLoginProps {
  onAuthChange?: (isVip: boolean) => void;
}

const VipLogin: React.FC<VipLoginProps> = ({ onAuthChange }) => {
  const [isVip, setIsVip] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check authentication status on mount only
    const authenticated = vipAuth.isAuthenticated();
    setIsVip(authenticated);
    if (onAuthChange) {
      onAuthChange(authenticated);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      const success = vipAuth.login(username, password);
      if (success) {
        setIsVip(true);
        onAuthChange?.(true);
        setUsername('');
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
          <p className="text-luxury-gold text-base font-serif italic mb-3 leading-relaxed">
            Welcome to the private The Key Ibiza space.
          </p>
          <p className="text-white/60 text-sm leading-relaxed mb-5">
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
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-transparent border-b border-white/25 px-0 py-2.5 text-white text-sm focus:outline-none focus:border-luxury-gold transition-colors placeholder:text-white/40 mb-4"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-transparent border-b border-white/25 px-0 py-2.5 text-white text-sm focus:outline-none focus:border-luxury-gold transition-colors placeholder:text-white/40 mb-5"
          />
          {error && (
            <p className="text-red-400 text-xs mb-3 tracking-wide">{error}</p>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-transparent border border-luxury-gold/50 text-luxury-gold py-2.5 rounded-full text-[10px] uppercase tracking-[0.2em] font-medium hover:bg-luxury-gold hover:text-luxury-blue transition-all disabled:opacity-50"
          >
            {isLoading ? '...' : 'Enter'}
          </button>
        </form>
        <p className="text-white/40 text-[9px] mt-4 tracking-wider">Members only</p>
      </div>
    </div>
  );
};

export default VipLogin;
