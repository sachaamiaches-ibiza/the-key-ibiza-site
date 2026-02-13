import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import VipLogin from '../components/VipLogin';

describe('VipLogin Component', () => {
  const mockOnAuthChange = vi.fn();

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    vi.resetModules();
  });

  describe('Login Form', () => {
    it('should render login form when not authenticated', () => {
      render(<VipLogin onAuthChange={mockOnAuthChange} />);

      expect(screen.getByText('VIP Access')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
      expect(screen.getByText('Sign In')).toBeInTheDocument();
    });

    it('should have email input type', () => {
      render(<VipLogin onAuthChange={mockOnAuthChange} />);
      const emailInput = screen.getByPlaceholderText('Email');
      expect(emailInput).toHaveAttribute('type', 'email');
    });

    it('should have password input type', () => {
      render(<VipLogin onAuthChange={mockOnAuthChange} />);
      const passwordInput = screen.getByPlaceholderText('Password');
      expect(passwordInput).toHaveAttribute('type', 'password');
    });

    it('should show "Forgotten password?" button', () => {
      render(<VipLogin onAuthChange={mockOnAuthChange} />);
      expect(screen.getByText('Forgotten password?')).toBeInTheDocument();
    });

    it('should show error on invalid credentials', async () => {
      render(<VipLogin onAuthChange={mockOnAuthChange} />);
      const user = userEvent.setup();

      await user.type(screen.getByPlaceholderText('Email'), 'wrong@email.com');
      await user.type(screen.getByPlaceholderText('Password'), 'wrongpassword');
      await user.click(screen.getByText('Sign In'));

      await waitFor(() => {
        expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
      }, { timeout: 2000 });
    });

    it('should call onAuthChange with true on successful login', async () => {
      render(<VipLogin onAuthChange={mockOnAuthChange} />);
      const user = userEvent.setup();

      await user.type(screen.getByPlaceholderText('Email'), 'hello@thekey-ibiza.com');
      await user.type(screen.getByPlaceholderText('Password'), 'GOLDKEY');
      await user.click(screen.getByText('Sign In'));

      await waitFor(() => {
        expect(mockOnAuthChange).toHaveBeenCalledWith(true);
      }, { timeout: 2000 });
    });
  });

  describe('Forgot Password', () => {
    it('should show forgot password message when button clicked', async () => {
      render(<VipLogin onAuthChange={mockOnAuthChange} />);
      const user = userEvent.setup();

      await user.click(screen.getByText('Forgotten password?'));

      expect(screen.getByText(/Please contact your collaborator/i)).toBeInTheDocument();
      expect(screen.getByText(/to obtain new credentials/i)).toBeInTheDocument();
    });

    it('should have back to login button in forgot password view', async () => {
      render(<VipLogin onAuthChange={mockOnAuthChange} />);
      const user = userEvent.setup();

      await user.click(screen.getByText('Forgotten password?'));
      expect(screen.getByText('Back to login')).toBeInTheDocument();
    });

    it('should return to login form when clicking back', async () => {
      render(<VipLogin onAuthChange={mockOnAuthChange} />);
      const user = userEvent.setup();

      await user.click(screen.getByText('Forgotten password?'));
      await user.click(screen.getByText('Back to login'));

      expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    });
  });

  describe('Logged In State', () => {
    beforeEach(async () => {
      // Pre-login
      const { vipAuth } = await import('../services/vipAuth');
      vipAuth.login('hello@thekey-ibiza.com', 'GOLDKEY');
    });

    it('should show welcome message when logged in', async () => {
      render(<VipLogin onAuthChange={mockOnAuthChange} />);

      await waitFor(() => {
        expect(screen.getByText(/Welcome/i)).toBeInTheDocument();
      });
    });

    it('should show Sign Out button when logged in', async () => {
      render(<VipLogin onAuthChange={mockOnAuthChange} />);

      await waitFor(() => {
        expect(screen.getByText('Sign Out')).toBeInTheDocument();
      });
    });

    it('should show Admin Access badge for admin user', async () => {
      render(<VipLogin onAuthChange={mockOnAuthChange} />);

      await waitFor(() => {
        expect(screen.getByText('Admin Access')).toBeInTheDocument();
      });
    });

    it('should show Manage Users button for admin', async () => {
      render(<VipLogin onAuthChange={mockOnAuthChange} />);

      await waitFor(() => {
        expect(screen.getByText('Manage Users')).toBeInTheDocument();
      });
    });

    it('should logout when Sign Out clicked', async () => {
      render(<VipLogin onAuthChange={mockOnAuthChange} />);
      const user = userEvent.setup();

      await waitFor(() => {
        expect(screen.getByText('Sign Out')).toBeInTheDocument();
      });

      await user.click(screen.getByText('Sign Out'));

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
      });

      expect(mockOnAuthChange).toHaveBeenCalledWith(false);
    });
  });

  describe('Styling', () => {
    it('should have text-center class on container', () => {
      render(<VipLogin onAuthChange={mockOnAuthChange} />);
      const title = screen.getByText('VIP Access');
      const container = title.closest('div');
      expect(container).toHaveClass('text-center');
    });

    it('should have 16px font-size on inputs to prevent mobile zoom', () => {
      render(<VipLogin onAuthChange={mockOnAuthChange} />);
      const emailInput = screen.getByPlaceholderText('Email');
      expect(emailInput).toHaveClass('text-base'); // text-base = 16px
    });
  });
});
