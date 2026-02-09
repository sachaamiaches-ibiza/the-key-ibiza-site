
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
    // Check authentication status on mount
    const authenticated = vipAuth.isAuthenticated();
    setIsVip(authenticated);
    onAuthChange?.(authenticated);
  }, [onAuthChange]);

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
        <h3 className="text-luxury-gold text-[10px] uppercase tracking-[0.4em] font-semibold mb-6">VIP Access</h3>
        <div className="border border-luxury-gold/20 rounded-2xl p-6 bg-luxury-gold/5 max-w-xs mx-auto">
          <div className="mb-4">
            <svg className="w-8 h-8 mx-auto text-luxury-gold mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <p className="text-luxury-gold text-sm font-serif italic mb-3 leading-relaxed">
            Welcome to the private The Key Ibiza space.
          </p>
          <p className="text-white/50 text-xs leading-relaxed mb-5">
            Please enjoy the journey and feel free to contact us if you have any questions.
          </p>
          <button
            onClick={handleLogout}
            className="w-full bg-transparent border border-white/20 text-white/60 py-2 rounded-full text-[9px] uppercase tracking-[0.2em] font-medium hover:border-luxury-gold hover:text-luxury-gold transition-all"
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
      <h3 className="text-luxury-gold text-[10px] uppercase tracking-[0.4em] font-semibold mb-6">VIP Access</h3>
      <div className="border border-white/10 rounded-2xl p-6 bg-white/5 max-w-xs mx-auto">
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-transparent border-b border-white/20 px-0 py-2 text-white text-sm focus:outline-none focus:border-luxury-gold transition-colors placeholder:text-white/30 mb-4"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-transparent border-b border-white/20 px-0 py-2 text-white text-sm focus:outline-none focus:border-luxury-gold transition-colors placeholder:text-white/30 mb-4"
          />
          {error && (
            <p className="text-red-400/80 text-[10px] mb-3 tracking-wide">{error}</p>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-transparent border border-luxury-gold/40 text-luxury-gold py-2 rounded-full text-[9px] uppercase tracking-[0.2em] font-medium hover:bg-luxury-gold hover:text-luxury-blue transition-all disabled:opacity-50"
          >
            {isLoading ? '...' : 'Enter'}
          </button>
        </form>
        <p className="text-white/20 text-[8px] mt-4 tracking-wider">Members only</p>
      </div>
    </div>
  );
};

export default VipLogin;
