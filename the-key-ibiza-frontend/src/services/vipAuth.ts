
// VIP Authentication Service
// Session management only - authentication is handled by the backend

interface VipSession {
  userId: string;
  email: string;
  role: 'admin' | 'user';
  name: string;
}

// Get current session - check both localStorage and sessionStorage
const getSession = (): VipSession | null => {
  // Check for JWT token (backend system)
  const token = localStorage.getItem('vip_token') || sessionStorage.getItem('vip_token');
  const userStr = localStorage.getItem('vip_user') || sessionStorage.getItem('vip_user');

  if (token && userStr) {
    try {
      const user = JSON.parse(userStr);
      return {
        userId: user.id,
        email: user.email,
        role: user.role || 'user',
        name: user.name || 'VIP Guest',
      };
    } catch {
      return null;
    }
  }

  return null;
};

export const vipAuth = {
  // Logout - clear both storages
  logout: (): void => {
    localStorage.removeItem('vip_token');
    localStorage.removeItem('vip_user');
    localStorage.removeItem('vip_remember');
    sessionStorage.removeItem('vip_token');
    sessionStorage.removeItem('vip_user');
  },

  // Check if authenticated
  isAuthenticated: (): boolean => {
    return getSession() !== null;
  },

  // Check if current user is admin
  isAdmin: (): boolean => {
    const userStr = localStorage.getItem('vip_user') || sessionStorage.getItem('vip_user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        return user.role === 'admin';
      } catch {
        return false;
      }
    }
    return false;
  },

  // Get current user info
  getCurrentUser: (): VipSession | null => {
    return getSession();
  },

  // Get current user's name
  getUserName: (): string => {
    const session = getSession();
    return session?.name || 'VIP Guest';
  },
};
