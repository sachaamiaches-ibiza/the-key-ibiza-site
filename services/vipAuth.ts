
// VIP Authentication Service
// Credentials: vip / GOLDKEY

const VIP_USERNAME = 'vip';
const VIP_PASSWORD = 'GOLDKEY';
const VIP_STORAGE_KEY = 'thekey_vip_access';

export const vipAuth = {
  login: (username: string, password: string): boolean => {
    if (username === VIP_USERNAME && password === VIP_PASSWORD) {
      localStorage.setItem(VIP_STORAGE_KEY, 'true');
      return true;
    }
    return false;
  },

  logout: (): void => {
    localStorage.removeItem(VIP_STORAGE_KEY);
  },

  isAuthenticated: (): boolean => {
    return localStorage.getItem(VIP_STORAGE_KEY) === 'true';
  }
};
