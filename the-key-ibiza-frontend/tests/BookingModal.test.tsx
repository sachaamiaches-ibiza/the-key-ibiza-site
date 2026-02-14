import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Create a simplified BookingModal component for testing
// This simulates the booking modal behavior from VillaDetailPage
const BookingModal = ({
  isOpen,
  onClose,
  villa,
  checkIn,
  checkOut,
  totalPrice,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  villa: { name: string };
  checkIn: string;
  checkOut: string;
  totalPrice: number | null;
  onSubmit: (data: { name: string; email: string; phone: string; message: string }) => Promise<boolean>;
}) => {
  const [form, setForm] = React.useState({ name: '', email: '', phone: '', message: '' });
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [status, setStatus] = React.useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Invalid email';
    if (!form.phone.trim()) newErrors.phone = 'Phone is required';
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setStatus('submitting');
    try {
      const success = await onSubmit(form);
      setStatus(success ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
  };

  if (!isOpen) return null;

  return (
    <div data-testid="booking-modal">
      <div data-testid="backdrop" onClick={() => status !== 'submitting' && onClose()} />
      <div>
        <h3>Request Booking</h3>
        <p>{villa.name}</p>
        <button onClick={() => status !== 'submitting' && onClose()} data-testid="close-button">
          Close
        </button>

        {status === 'success' ? (
          <div data-testid="success-message">
            <h4>Request Sent</h4>
            <p>Thank you for your interest</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div data-testid="booking-summary">
              <span>Check-in: {checkIn || 'Not selected'}</span>
              <span>Check-out: {checkOut || 'Not selected'}</span>
              {totalPrice && <span>Total: €{totalPrice.toLocaleString()}</span>}
            </div>

            <input
              type="text"
              placeholder="Your Name *"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              aria-label="Name"
            />
            {errors.name && <p data-testid="error-name">{errors.name}</p>}

            <input
              type="email"
              placeholder="Email Address *"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              aria-label="Email"
            />
            {errors.email && <p data-testid="error-email">{errors.email}</p>}

            <input
              type="tel"
              placeholder="Phone Number *"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              aria-label="Phone"
            />
            {errors.phone && <p data-testid="error-phone">{errors.phone}</p>}

            <textarea
              placeholder="Additional Message (optional)"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              aria-label="Message"
            />

            <button type="submit" disabled={status === 'submitting'}>
              {status === 'submitting' ? 'Sending...' : 'Send Booking Request'}
            </button>

            {status === 'error' && <p data-testid="error-message">Failed to send request</p>}
          </form>
        )}
      </div>
    </div>
  );
};

// Need to import React for the component
import React from 'react';

describe('Booking Modal', () => {
  const mockOnClose = vi.fn();
  const mockOnSubmit = vi.fn();
  const mockVilla = { name: 'Test Villa' };

  beforeEach(() => {
    vi.clearAllMocks();
    mockOnSubmit.mockResolvedValue(true);
  });

  describe('Modal Display', () => {
    it('should not render when isOpen is false', () => {
      render(
        <BookingModal
          isOpen={false}
          onClose={mockOnClose}
          villa={mockVilla}
          checkIn=""
          checkOut=""
          totalPrice={null}
          onSubmit={mockOnSubmit}
        />
      );
      expect(screen.queryByTestId('booking-modal')).not.toBeInTheDocument();
    });

    it('should render when isOpen is true', () => {
      render(
        <BookingModal
          isOpen={true}
          onClose={mockOnClose}
          villa={mockVilla}
          checkIn=""
          checkOut=""
          totalPrice={null}
          onSubmit={mockOnSubmit}
        />
      );
      expect(screen.getByTestId('booking-modal')).toBeInTheDocument();
    });

    it('should display villa name', () => {
      render(
        <BookingModal
          isOpen={true}
          onClose={mockOnClose}
          villa={mockVilla}
          checkIn=""
          checkOut=""
          totalPrice={null}
          onSubmit={mockOnSubmit}
        />
      );
      expect(screen.getByText('Test Villa')).toBeInTheDocument();
    });

    it('should display selected dates', () => {
      render(
        <BookingModal
          isOpen={true}
          onClose={mockOnClose}
          villa={mockVilla}
          checkIn="2025-06-01"
          checkOut="2025-06-08"
          totalPrice={null}
          onSubmit={mockOnSubmit}
        />
      );
      expect(screen.getByText(/Check-in: 2025-06-01/)).toBeInTheDocument();
      expect(screen.getByText(/Check-out: 2025-06-08/)).toBeInTheDocument();
    });

    it('should display calculated price', () => {
      render(
        <BookingModal
          isOpen={true}
          onClose={mockOnClose}
          villa={mockVilla}
          checkIn="2025-06-01"
          checkOut="2025-06-08"
          totalPrice={25000}
          onSubmit={mockOnSubmit}
        />
      );
      expect(screen.getByText(/€25,000/)).toBeInTheDocument();
    });
  });

  describe('Form Fields', () => {
    it('should have all required form fields', () => {
      render(
        <BookingModal
          isOpen={true}
          onClose={mockOnClose}
          villa={mockVilla}
          checkIn=""
          checkOut=""
          totalPrice={null}
          onSubmit={mockOnSubmit}
        />
      );
      expect(screen.getByPlaceholderText('Your Name *')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Email Address *')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Phone Number *')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Additional Message (optional)')).toBeInTheDocument();
    });

    it('should update form values on input', async () => {
      render(
        <BookingModal
          isOpen={true}
          onClose={mockOnClose}
          villa={mockVilla}
          checkIn=""
          checkOut=""
          totalPrice={null}
          onSubmit={mockOnSubmit}
        />
      );
      const user = userEvent.setup();

      const nameInput = screen.getByPlaceholderText('Your Name *');
      await user.type(nameInput, 'John Doe');
      expect(nameInput).toHaveValue('John Doe');
    });
  });

  describe('Validation', () => {
    it('should show error when name is empty', async () => {
      render(
        <BookingModal
          isOpen={true}
          onClose={mockOnClose}
          villa={mockVilla}
          checkIn=""
          checkOut=""
          totalPrice={null}
          onSubmit={mockOnSubmit}
        />
      );
      const user = userEvent.setup();

      await user.click(screen.getByText('Send Booking Request'));

      expect(screen.getByTestId('error-name')).toHaveTextContent('Name is required');
    });

    it('should not submit form with invalid email', async () => {
      render(
        <BookingModal
          isOpen={true}
          onClose={mockOnClose}
          villa={mockVilla}
          checkIn=""
          checkOut=""
          totalPrice={null}
          onSubmit={mockOnSubmit}
        />
      );
      const user = userEvent.setup();

      await user.type(screen.getByPlaceholderText('Your Name *'), 'John');
      await user.type(screen.getByPlaceholderText('Email Address *'), 'notvalid');
      await user.type(screen.getByPlaceholderText('Phone Number *'), '123456789');
      await user.click(screen.getByText('Send Booking Request'));

      // Form should not be submitted with invalid email
      await waitFor(() => {
        expect(mockOnSubmit).not.toHaveBeenCalled();
      });
    });

    it('should show error when phone is empty', async () => {
      render(
        <BookingModal
          isOpen={true}
          onClose={mockOnClose}
          villa={mockVilla}
          checkIn=""
          checkOut=""
          totalPrice={null}
          onSubmit={mockOnSubmit}
        />
      );
      const user = userEvent.setup();

      await user.click(screen.getByText('Send Booking Request'));

      expect(screen.getByTestId('error-phone')).toHaveTextContent('Phone is required');
    });
  });

  describe('Submission', () => {
    it('should submit form with valid data', async () => {
      render(
        <BookingModal
          isOpen={true}
          onClose={mockOnClose}
          villa={mockVilla}
          checkIn="2025-06-01"
          checkOut="2025-06-08"
          totalPrice={25000}
          onSubmit={mockOnSubmit}
        />
      );
      const user = userEvent.setup();

      await user.type(screen.getByPlaceholderText('Your Name *'), 'John Doe');
      await user.type(screen.getByPlaceholderText('Email Address *'), 'john@example.com');
      await user.type(screen.getByPlaceholderText('Phone Number *'), '+34 123456789');
      await user.type(screen.getByPlaceholderText('Additional Message (optional)'), 'Looking forward to our stay!');
      await user.click(screen.getByText('Send Booking Request'));

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+34 123456789',
          message: 'Looking forward to our stay!',
        });
      });
    });

    it('should show submitting state', async () => {
      mockOnSubmit.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve(true), 500)));

      render(
        <BookingModal
          isOpen={true}
          onClose={mockOnClose}
          villa={mockVilla}
          checkIn=""
          checkOut=""
          totalPrice={null}
          onSubmit={mockOnSubmit}
        />
      );
      const user = userEvent.setup();

      await user.type(screen.getByPlaceholderText('Your Name *'), 'John');
      await user.type(screen.getByPlaceholderText('Email Address *'), 'john@test.com');
      await user.type(screen.getByPlaceholderText('Phone Number *'), '123');
      await user.click(screen.getByText('Send Booking Request'));

      expect(screen.getByText('Sending...')).toBeInTheDocument();
    });

    it('should show success message on successful submission', async () => {
      render(
        <BookingModal
          isOpen={true}
          onClose={mockOnClose}
          villa={mockVilla}
          checkIn=""
          checkOut=""
          totalPrice={null}
          onSubmit={mockOnSubmit}
        />
      );
      const user = userEvent.setup();

      await user.type(screen.getByPlaceholderText('Your Name *'), 'John');
      await user.type(screen.getByPlaceholderText('Email Address *'), 'john@test.com');
      await user.type(screen.getByPlaceholderText('Phone Number *'), '123');
      await user.click(screen.getByText('Send Booking Request'));

      await waitFor(() => {
        expect(screen.getByTestId('success-message')).toBeInTheDocument();
      });
    });

    it('should show error message on failed submission', async () => {
      mockOnSubmit.mockResolvedValue(false);

      render(
        <BookingModal
          isOpen={true}
          onClose={mockOnClose}
          villa={mockVilla}
          checkIn=""
          checkOut=""
          totalPrice={null}
          onSubmit={mockOnSubmit}
        />
      );
      const user = userEvent.setup();

      await user.type(screen.getByPlaceholderText('Your Name *'), 'John');
      await user.type(screen.getByPlaceholderText('Email Address *'), 'john@test.com');
      await user.type(screen.getByPlaceholderText('Phone Number *'), '123');
      await user.click(screen.getByText('Send Booking Request'));

      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toBeInTheDocument();
      });
    });
  });

  describe('Close Behavior', () => {
    it('should call onClose when close button clicked', async () => {
      render(
        <BookingModal
          isOpen={true}
          onClose={mockOnClose}
          villa={mockVilla}
          checkIn=""
          checkOut=""
          totalPrice={null}
          onSubmit={mockOnSubmit}
        />
      );
      const user = userEvent.setup();

      await user.click(screen.getByTestId('close-button'));
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should call onClose when backdrop clicked', async () => {
      render(
        <BookingModal
          isOpen={true}
          onClose={mockOnClose}
          villa={mockVilla}
          checkIn=""
          checkOut=""
          totalPrice={null}
          onSubmit={mockOnSubmit}
        />
      );
      const user = userEvent.setup();

      await user.click(screen.getByTestId('backdrop'));
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should not close during submission', async () => {
      mockOnSubmit.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve(true), 1000)));

      render(
        <BookingModal
          isOpen={true}
          onClose={mockOnClose}
          villa={mockVilla}
          checkIn=""
          checkOut=""
          totalPrice={null}
          onSubmit={mockOnSubmit}
        />
      );
      const user = userEvent.setup();

      await user.type(screen.getByPlaceholderText('Your Name *'), 'John');
      await user.type(screen.getByPlaceholderText('Email Address *'), 'john@test.com');
      await user.type(screen.getByPlaceholderText('Phone Number *'), '123');
      await user.click(screen.getByText('Send Booking Request'));

      // Wait for submitting state
      await waitFor(() => {
        expect(screen.getByText('Sending...')).toBeInTheDocument();
      });

      // Try to close
      await user.click(screen.getByTestId('backdrop'));

      // Should not have called onClose
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });
});
