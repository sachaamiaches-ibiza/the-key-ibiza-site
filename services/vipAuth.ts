
// VIP Authentication Service
// Supports multiple VIP users with admin capabilities

export interface VipUser {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'user';
  createdAt: string;
}

interface VipSession {
  userId: string;
  email: string;
  role: 'admin' | 'user';
  name: string;
}

const VIP_USERS_KEY = 'thekey_vip_users';
const VIP_SESSION_KEY = 'thekey_vip_session';

// Default admin user (VIP principal)
const DEFAULT_ADMIN: VipUser = {
  id: 'admin-001',
  email: 'hello@thekey-ibiza.com',
  password: 'GOLDKEY',
  name: 'VIP Principal',
  role: 'admin',
  createdAt: new Date().toISOString(),
};

// Initialize users if not exists or update default admin email
const initializeUsers = (): VipUser[] => {
  const stored = localStorage.getItem(VIP_USERS_KEY);
  if (!stored) {
    const initialUsers = [DEFAULT_ADMIN];
    localStorage.setItem(VIP_USERS_KEY, JSON.stringify(initialUsers));
    return initialUsers;
  }

  let users: VipUser[] = JSON.parse(stored);

  // Update default admin email if it was changed (migration)
  const adminIndex = users.findIndex(u => u.id === 'admin-001');
  if (adminIndex !== -1 && users[adminIndex].email !== DEFAULT_ADMIN.email) {
    users[adminIndex].email = DEFAULT_ADMIN.email;
    localStorage.setItem(VIP_USERS_KEY, JSON.stringify(users));
  }

  return users;
};

// Get all users
const getUsers = (): VipUser[] => {
  return initializeUsers();
};

// Save users
const saveUsers = (users: VipUser[]): void => {
  localStorage.setItem(VIP_USERS_KEY, JSON.stringify(users));
};

// Get current session
const getSession = (): VipSession | null => {
  const stored = localStorage.getItem(VIP_SESSION_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
};

// Generate unique ID
const generateId = (): string => {
  return 'user-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
};

export const vipAuth = {
  // Login with email and password
  login: (email: string, password: string): boolean => {
    const users = getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

    if (user) {
      const session: VipSession = {
        userId: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      };
      localStorage.setItem(VIP_SESSION_KEY, JSON.stringify(session));
      return true;
    }
    return false;
  },

  // Logout
  logout: (): void => {
    localStorage.removeItem(VIP_SESSION_KEY);
  },

  // Check if authenticated
  isAuthenticated: (): boolean => {
    return getSession() !== null;
  },

  // Check if current user is admin
  isAdmin: (): boolean => {
    const session = getSession();
    return session?.role === 'admin';
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

  // ===== ADMIN FUNCTIONS =====

  // Get all VIP users (admin only)
  getAllUsers: (): VipUser[] | null => {
    if (!vipAuth.isAdmin()) return null;
    return getUsers().map(u => ({ ...u, password: '********' })); // Hide passwords
  },

  // Create new VIP user (admin only)
  createUser: (email: string, password: string, name: string, role: 'admin' | 'user' = 'user'): { success: boolean; error?: string } => {
    if (!vipAuth.isAdmin()) {
      return { success: false, error: 'Unauthorized' };
    }

    const users = getUsers();

    // Check if email already exists
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: 'Email already exists' };
    }

    const newUser: VipUser = {
      id: generateId(),
      email: email.toLowerCase(),
      password,
      name,
      role,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveUsers(users);
    return { success: true };
  },

  // Update VIP user (admin only)
  updateUser: (userId: string, updates: Partial<Pick<VipUser, 'email' | 'name' | 'role'>>): { success: boolean; error?: string } => {
    if (!vipAuth.isAdmin()) {
      return { success: false, error: 'Unauthorized' };
    }

    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      return { success: false, error: 'User not found' };
    }

    // Check email uniqueness if changing email
    if (updates.email && updates.email.toLowerCase() !== users[userIndex].email.toLowerCase()) {
      if (users.some(u => u.email.toLowerCase() === updates.email!.toLowerCase())) {
        return { success: false, error: 'Email already exists' };
      }
    }

    users[userIndex] = { ...users[userIndex], ...updates };
    if (updates.email) {
      users[userIndex].email = updates.email.toLowerCase();
    }
    saveUsers(users);
    return { success: true };
  },

  // Change user password (admin only)
  changePassword: (userId: string, newPassword: string): { success: boolean; error?: string } => {
    if (!vipAuth.isAdmin()) {
      return { success: false, error: 'Unauthorized' };
    }

    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      return { success: false, error: 'User not found' };
    }

    users[userIndex].password = newPassword;
    saveUsers(users);
    return { success: true };
  },

  // Delete VIP user (admin only)
  deleteUser: (userId: string): { success: boolean; error?: string } => {
    if (!vipAuth.isAdmin()) {
      return { success: false, error: 'Unauthorized' };
    }

    const users = getUsers();
    const user = users.find(u => u.id === userId);

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    // Prevent deleting the last admin
    if (user.role === 'admin') {
      const adminCount = users.filter(u => u.role === 'admin').length;
      if (adminCount <= 1) {
        return { success: false, error: 'Cannot delete the last admin' };
      }
    }

    const filteredUsers = users.filter(u => u.id !== userId);
    saveUsers(filteredUsers);
    return { success: true };
  },

  // Get user by ID (admin only, for editing)
  getUserById: (userId: string): VipUser | null => {
    if (!vipAuth.isAdmin()) return null;
    const users = getUsers();
    const user = users.find(u => u.id === userId);
    return user ? { ...user, password: '********' } : null;
  },
};
