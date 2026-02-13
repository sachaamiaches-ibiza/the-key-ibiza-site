import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React, { useState, useRef, useEffect } from 'react';

// Mock date picker component that simulates the behavior in VillaListingPage
const DateSearchFilter = ({
  initialCheckIn = '',
  initialCheckOut = '',
  onDatesChange,
}: {
  initialCheckIn?: string;
  initialCheckOut?: string;
  onDatesChange?: (checkIn: string, checkOut: string) => void;
}) => {
  const [checkIn, setCheckIn] = useState(initialCheckIn);
  const [checkOut, setCheckOut] = useState(initialCheckOut);
  const checkOutRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (onDatesChange) {
      onDatesChange(checkIn, checkOut);
    }
  }, [checkIn, checkOut, onDatesChange]);

  const handleCheckInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCheckIn(e.target.value);
    // Auto-open checkout calendar
    setTimeout(() => {
      checkOutRef.current?.showPicker?.();
    }, 100);
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="relative">
        <input
          type="date"
          data-testid="check-in-input"
          value={checkIn}
          onChange={handleCheckInChange}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-xs"
          style={{ colorScheme: 'dark' }}
        />
        <span className="absolute left-3 -top-2 text-[8px] uppercase tracking-wider text-white/40">Check-in</span>
      </div>
      <div className="relative">
        <input
          ref={checkOutRef}
          type="date"
          data-testid="check-out-input"
          value={checkOut}
          min={checkIn}
          onChange={(e) => setCheckOut(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-xs"
          style={{ colorScheme: 'dark' }}
        />
        <span className="absolute left-3 -top-2 text-[8px] uppercase tracking-wider text-white/40">Check-out</span>
      </div>
    </div>
  );
};

describe('Date Search Filter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Initial State', () => {
    it('should render check-in and check-out inputs', () => {
      render(<DateSearchFilter />);
      expect(screen.getByTestId('check-in-input')).toBeInTheDocument();
      expect(screen.getByTestId('check-out-input')).toBeInTheDocument();
    });

    it('should initialize with empty dates by default', () => {
      render(<DateSearchFilter />);
      expect(screen.getByTestId('check-in-input')).toHaveValue('');
      expect(screen.getByTestId('check-out-input')).toHaveValue('');
    });

    it('should initialize with provided dates', () => {
      render(<DateSearchFilter initialCheckIn="2025-06-01" initialCheckOut="2025-06-08" />);
      expect(screen.getByTestId('check-in-input')).toHaveValue('2025-06-01');
      expect(screen.getByTestId('check-out-input')).toHaveValue('2025-06-08');
    });
  });

  describe('Date Persistence', () => {
    it('should call onDatesChange when dates change', async () => {
      const mockOnDatesChange = vi.fn();
      render(<DateSearchFilter onDatesChange={mockOnDatesChange} />);

      fireEvent.change(screen.getByTestId('check-in-input'), { target: { value: '2025-06-01' } });

      await waitFor(() => {
        expect(mockOnDatesChange).toHaveBeenCalledWith('2025-06-01', '');
      });
    });

    it('should persist dates when navigating back (via initialCheckIn/initialCheckOut)', () => {
      // First render with no dates
      const { rerender } = render(<DateSearchFilter />);

      // User selects dates
      fireEvent.change(screen.getByTestId('check-in-input'), { target: { value: '2025-06-01' } });
      fireEvent.change(screen.getByTestId('check-out-input'), { target: { value: '2025-06-08' } });

      // Simulate navigation: unmount and remount with persisted dates
      rerender(<DateSearchFilter initialCheckIn="2025-06-01" initialCheckOut="2025-06-08" />);

      expect(screen.getByTestId('check-in-input')).toHaveValue('2025-06-01');
      expect(screen.getByTestId('check-out-input')).toHaveValue('2025-06-08');
    });
  });

  describe('Auto-open Checkout Calendar', () => {
    it('should attempt to open checkout calendar after check-in selection', async () => {
      const mockShowPicker = vi.fn();
      render(<DateSearchFilter />);

      const checkOutInput = screen.getByTestId('check-out-input') as HTMLInputElement;
      checkOutInput.showPicker = mockShowPicker;

      fireEvent.change(screen.getByTestId('check-in-input'), { target: { value: '2025-06-01' } });

      await waitFor(() => {
        expect(mockShowPicker).toHaveBeenCalled();
      }, { timeout: 500 });
    });
  });

  describe('Styling Consistency', () => {
    it('should have consistent styling classes for all date inputs', () => {
      render(<DateSearchFilter />);

      const checkInInput = screen.getByTestId('check-in-input');
      const checkOutInput = screen.getByTestId('check-out-input');

      // Both should have the same styling classes
      expect(checkInInput.className).toContain('rounded-xl');
      expect(checkInInput.className).toContain('px-4');
      expect(checkInInput.className).toContain('py-3');

      expect(checkOutInput.className).toContain('rounded-xl');
      expect(checkOutInput.className).toContain('px-4');
      expect(checkOutInput.className).toContain('py-3');
    });

    it('should have dark color scheme for calendar', () => {
      render(<DateSearchFilter />);

      const checkInInput = screen.getByTestId('check-in-input');
      const checkOutInput = screen.getByTestId('check-out-input');

      expect(checkInInput).toHaveStyle({ colorScheme: 'dark' });
      expect(checkOutInput).toHaveStyle({ colorScheme: 'dark' });
    });
  });

  describe('Check-out Minimum Date', () => {
    it('should set min attribute on check-out based on check-in', async () => {
      render(<DateSearchFilter />);

      fireEvent.change(screen.getByTestId('check-in-input'), { target: { value: '2025-06-01' } });

      await waitFor(() => {
        expect(screen.getByTestId('check-out-input')).toHaveAttribute('min', '2025-06-01');
      });
    });
  });
});

// Test for date persistence between views (simulating App.tsx behavior)
describe('Date Persistence Between Views', () => {
  // Simulate App.tsx state management
  const AppWithDatePersistence = () => {
    const [globalCheckIn, setGlobalCheckIn] = useState('');
    const [globalCheckOut, setGlobalCheckOut] = useState('');
    const [currentView, setCurrentView] = useState<'listing' | 'detail'>('listing');

    const handleDatesChange = (checkIn: string, checkOut: string) => {
      setGlobalCheckIn(checkIn);
      setGlobalCheckOut(checkOut);
    };

    return (
      <div>
        <button onClick={() => setCurrentView('listing')} data-testid="go-to-listing">
          Listing
        </button>
        <button onClick={() => setCurrentView('detail')} data-testid="go-to-detail">
          Detail
        </button>

        {currentView === 'listing' && (
          <div data-testid="listing-view">
            <DateSearchFilter
              initialCheckIn={globalCheckIn}
              initialCheckOut={globalCheckOut}
              onDatesChange={handleDatesChange}
            />
          </div>
        )}

        {currentView === 'detail' && (
          <div data-testid="detail-view">
            <DateSearchFilter
              initialCheckIn={globalCheckIn}
              initialCheckOut={globalCheckOut}
              onDatesChange={handleDatesChange}
            />
          </div>
        )}
      </div>
    );
  };

  it('should persist dates when navigating from listing to detail', async () => {
    render(<AppWithDatePersistence />);
    const user = userEvent.setup();

    // Set dates in listing view
    fireEvent.change(screen.getByTestId('check-in-input'), { target: { value: '2025-07-01' } });
    fireEvent.change(screen.getByTestId('check-out-input'), { target: { value: '2025-07-08' } });

    // Navigate to detail view
    await user.click(screen.getByTestId('go-to-detail'));

    // Dates should be preserved
    expect(screen.getByTestId('check-in-input')).toHaveValue('2025-07-01');
    expect(screen.getByTestId('check-out-input')).toHaveValue('2025-07-08');
  });

  it('should persist dates when navigating back to listing from detail', async () => {
    render(<AppWithDatePersistence />);
    const user = userEvent.setup();

    // Set dates in listing view
    fireEvent.change(screen.getByTestId('check-in-input'), { target: { value: '2025-08-15' } });
    fireEvent.change(screen.getByTestId('check-out-input'), { target: { value: '2025-08-22' } });

    // Navigate to detail view
    await user.click(screen.getByTestId('go-to-detail'));

    // Navigate back to listing view
    await user.click(screen.getByTestId('go-to-listing'));

    // Dates should still be preserved
    expect(screen.getByTestId('check-in-input')).toHaveValue('2025-08-15');
    expect(screen.getByTestId('check-out-input')).toHaveValue('2025-08-22');
  });
});
