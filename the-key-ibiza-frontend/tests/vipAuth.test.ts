import { describe, it, expect, beforeEach, vi } from 'vitest';

// We need to reset the module between tests to clear cached state
let vipAuth: typeof import('../services/vipAuth').vipAuth;

describe('VIP Authentication Service', () => {
  beforeEach(async () => {
    // Clear localStorage
    localStorage.clear();
    // Reset module cache
    vi.resetModules();
    // Re-import fresh instance
    const module = await import('../services/vipAuth');
    vipAuth = module.vipAuth;
  });

  describe('login', () => {
    it('should login with valid admin credentials', () => {
      const result = vipAuth.login('hello@thekey-ibiza.com', 'GOLDKEY');
      expect(result).toBe(true);
      expect(vipAuth.isAuthenticated()).toBe(true);
    });

    it('should fail login with invalid credentials', () => {
      const result = vipAuth.login('wrong@email.com', 'wrongpassword');
      expect(result).toBe(false);
      expect(vipAuth.isAuthenticated()).toBe(false);
    });

    it('should fail login with wrong password', () => {
      const result = vipAuth.login('hello@thekey-ibiza.com', 'wrongpassword');
      expect(result).toBe(false);
    });

    it('should be case-insensitive for email', () => {
      const result = vipAuth.login('HELLO@THEKEY-IBIZA.COM', 'GOLDKEY');
      expect(result).toBe(true);
    });
  });

  describe('logout', () => {
    it('should logout successfully', () => {
      vipAuth.login('hello@thekey-ibiza.com', 'GOLDKEY');
      expect(vipAuth.isAuthenticated()).toBe(true);

      vipAuth.logout();
      expect(vipAuth.isAuthenticated()).toBe(false);
    });
  });

  describe('isAdmin', () => {
    it('should return true for admin user', () => {
      vipAuth.login('hello@thekey-ibiza.com', 'GOLDKEY');
      expect(vipAuth.isAdmin()).toBe(true);
    });

    it('should return false when not logged in', () => {
      expect(vipAuth.isAdmin()).toBe(false);
    });
  });

  describe('getCurrentUser', () => {
    it('should return user info when logged in', () => {
      vipAuth.login('hello@thekey-ibiza.com', 'GOLDKEY');
      const user = vipAuth.getCurrentUser();
      expect(user).not.toBeNull();
      expect(user?.email).toBe('hello@thekey-ibiza.com');
      expect(user?.role).toBe('admin');
    });

    it('should return null when not logged in', () => {
      expect(vipAuth.getCurrentUser()).toBeNull();
    });
  });

  describe('User Management (Admin Only)', () => {
    beforeEach(() => {
      // Login as admin
      vipAuth.login('hello@thekey-ibiza.com', 'GOLDKEY');
    });

    describe('createUser', () => {
      it('should create a new VIP user', () => {
        const result = vipAuth.createUser('newuser@test.com', 'password123', 'New User');
        expect(result.success).toBe(true);
      });

      it('should fail to create user with duplicate email', () => {
        vipAuth.createUser('duplicate@test.com', 'password123', 'User 1');
        const result = vipAuth.createUser('duplicate@test.com', 'password456', 'User 2');
        expect(result.success).toBe(false);
        expect(result.error).toBe('Email already exists');
      });

      it('should create user as regular VIP by default', () => {
        vipAuth.createUser('regular@test.com', 'password', 'Regular VIP');
        // Logout and login as the new user
        vipAuth.logout();
        vipAuth.login('regular@test.com', 'password');
        expect(vipAuth.isAdmin()).toBe(false);
      });

      it('should create admin user when specified', () => {
        vipAuth.createUser('admin2@test.com', 'password', 'Admin 2', 'admin');
        vipAuth.logout();
        vipAuth.login('admin2@test.com', 'password');
        expect(vipAuth.isAdmin()).toBe(true);
      });
    });

    describe('getAllUsers', () => {
      it('should return all users (with hidden passwords)', () => {
        const users = vipAuth.getAllUsers();
        expect(users).not.toBeNull();
        expect(users!.length).toBeGreaterThan(0);
        // Passwords should be masked
        users!.forEach(user => {
          expect(user.password).toBe('********');
        });
      });

      it('should return null when not admin', () => {
        vipAuth.logout();
        expect(vipAuth.getAllUsers()).toBeNull();
      });
    });

    describe('updateUser', () => {
      it('should update user details', () => {
        vipAuth.createUser('update@test.com', 'password', 'Original Name');
        const users = vipAuth.getAllUsers();
        const userId = users!.find(u => u.email === 'update@test.com')!.id;

        const result = vipAuth.updateUser(userId, { name: 'Updated Name' });
        expect(result.success).toBe(true);

        const updatedUsers = vipAuth.getAllUsers();
        const updatedUser = updatedUsers!.find(u => u.id === userId);
        expect(updatedUser?.name).toBe('Updated Name');
      });

      it('should fail for non-existent user', () => {
        const result = vipAuth.updateUser('non-existent-id', { name: 'Test' });
        expect(result.success).toBe(false);
        expect(result.error).toBe('User not found');
      });
    });

    describe('changePassword', () => {
      it('should change user password', () => {
        vipAuth.createUser('pwchange@test.com', 'oldpassword', 'PW User');
        const users = vipAuth.getAllUsers();
        const userId = users!.find(u => u.email === 'pwchange@test.com')!.id;

        const result = vipAuth.changePassword(userId, 'newpassword');
        expect(result.success).toBe(true);

        // Verify new password works
        vipAuth.logout();
        expect(vipAuth.login('pwchange@test.com', 'newpassword')).toBe(true);
      });
    });

    describe('deleteUser', () => {
      it('should delete a user', () => {
        vipAuth.createUser('todelete@test.com', 'password', 'To Delete');
        const usersBefore = vipAuth.getAllUsers();
        const userId = usersBefore!.find(u => u.email === 'todelete@test.com')!.id;

        const result = vipAuth.deleteUser(userId);
        expect(result.success).toBe(true);

        const usersAfter = vipAuth.getAllUsers();
        expect(usersAfter!.find(u => u.email === 'todelete@test.com')).toBeUndefined();
      });

      it('should prevent deleting the last admin', () => {
        const users = vipAuth.getAllUsers();
        const adminId = users!.find(u => u.role === 'admin')!.id;

        const result = vipAuth.deleteUser(adminId);
        expect(result.success).toBe(false);
        expect(result.error).toBe('Cannot delete the last admin');
      });
    });
  });

  describe('Unauthorized Access', () => {
    it('should block createUser when not logged in', () => {
      const result = vipAuth.createUser('test@test.com', 'password', 'Test');
      expect(result.success).toBe(false);
      expect(result.error).toBe('Unauthorized');
    });

    it('should block updateUser when not admin', () => {
      // First login as admin to create a regular user
      vipAuth.login('hello@thekey-ibiza.com', 'GOLDKEY');
      vipAuth.createUser('regular@test.com', 'password', 'Regular');
      vipAuth.logout();

      // Login as regular user
      vipAuth.login('regular@test.com', 'password');

      const result = vipAuth.updateUser('some-id', { name: 'Test' });
      expect(result.success).toBe(false);
      expect(result.error).toBe('Unauthorized');
    });
  });
});
