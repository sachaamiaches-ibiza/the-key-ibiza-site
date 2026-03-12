import React, { useState, useEffect, useCallback, useRef } from 'react';
import { DayPicker, DateRange } from 'react-day-picker';
import { format, addMonths, subMonths } from 'date-fns';
import 'react-day-picker/dist/style.css';

interface MobileDatePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  checkIn: string;
  checkOut: string;
  onDatesChange: (checkIn: string, checkOut: string) => void;
}

const MobileDatePickerModal: React.FC<MobileDatePickerModalProps> = ({
  isOpen,
  onClose,
  checkIn,
  checkOut,
  onDatesChange,
}) => {
  const [range, setRange] = useState<DateRange | undefined>(undefined);
  const [selecting, setSelecting] = useState<'checkin' | 'checkout'>('checkin');
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [wasOpen, setWasOpen] = useState(false);

  // Swipe detection
  const touchStartX = useRef<number | null>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  // Only reset state when modal OPENS (not on every render)
  useEffect(() => {
    if (isOpen && !wasOpen) {
      // Reset to allow new selection
      setRange(undefined);
      setSelecting('checkin');
      setCurrentMonth(new Date());
    }
    setWasOpen(isOpen);
  }, [isOpen, wasOpen]);

  const today = new Date();

  // Custom month navigation handlers
  const handlePrevMonth = useCallback(() => {
    setCurrentMonth(prev => subMonths(prev, 1));
  }, []);

  const handleNextMonth = useCallback(() => {
    setCurrentMonth(prev => addMonths(prev, 1));
  }, []);

  // Swipe handlers for horizontal month navigation
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStartX.current === null) return;

    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    // Minimum swipe distance of 50px
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Swipe left - next month
        handleNextMonth();
      } else {
        // Swipe right - previous month
        handlePrevMonth();
      }
    }

    touchStartX.current = null;
  }, [handleNextMonth, handlePrevMonth]);

  const handleSelect = useCallback((newRange: DateRange | undefined) => {
    if (!newRange?.from) {
      return;
    }

    if (selecting === 'checkin') {
      // Starting fresh selection
      setRange({ from: newRange.from, to: undefined });
      setSelecting('checkout');
    } else {
      // Selecting checkout
      if (newRange.from && newRange.to) {
        setRange(newRange);
      } else if (newRange.from) {
        // User clicked a date - use it as checkout if after checkin
        if (range?.from && newRange.from > range.from) {
          setRange({ from: range.from, to: newRange.from });
        } else {
          // Start over with this date as checkin
          setRange({ from: newRange.from, to: undefined });
          setSelecting('checkout');
        }
      }
    }
  }, [selecting, range]);

  const handleConfirm = () => {
    const newCheckIn = range?.from ? format(range.from, 'yyyy-MM-dd') : '';
    const newCheckOut = range?.to ? format(range.to, 'yyyy-MM-dd') : '';
    onDatesChange(newCheckIn, newCheckOut);
    onClose();
  };

  const handleClear = () => {
    setRange(undefined);
    setSelecting('checkin');
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999]"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0B1C26] border border-white/10 rounded-2xl p-4 md:p-6 max-w-sm md:max-w-md w-[calc(100%-2rem)] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-white font-serif text-lg">Select Dates</h3>
          <button
            onClick={onClose}
            className="text-white/50 hover:text-white p-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Selection indicator */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => { setSelecting('checkin'); setRange(undefined); }}
            className={`flex-1 p-2 rounded-lg border text-center text-xs transition-all ${
              selecting === 'checkin'
                ? 'border-luxury-gold bg-luxury-gold/10 text-luxury-gold'
                : 'border-white/10 text-white/50'
            }`}
          >
            <div className="text-[8px] uppercase tracking-wider mb-1">Check-in</div>
            <div>{range?.from ? format(range.from, 'dd MMM yyyy') : '—'}</div>
          </button>
          <button
            onClick={() => range?.from && setSelecting('checkout')}
            className={`flex-1 p-2 rounded-lg border text-center text-xs transition-all ${
              selecting === 'checkout'
                ? 'border-luxury-gold bg-luxury-gold/10 text-luxury-gold'
                : 'border-white/10 text-white/50'
            }`}
          >
            <div className="text-[8px] uppercase tracking-wider mb-1">Check-out</div>
            <div>{range?.to ? format(range.to, 'dd MMM yyyy') : '—'}</div>
          </button>
        </div>

        {/* Custom Month Navigation */}
        <div className="flex items-center justify-between mb-3 px-1">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="p-2 text-white/50 hover:text-luxury-gold active:text-luxury-gold transition-colors rounded-lg hover:bg-white/5 active:bg-white/10"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-white font-medium">
            {format(currentMonth, 'MMMM yyyy')}
          </span>
          <button
            type="button"
            onClick={handleNextMonth}
            className="p-2 text-white/50 hover:text-luxury-gold active:text-luxury-gold transition-colors rounded-lg hover:bg-white/5 active:bg-white/10"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Swipe hint */}
        <p className="text-white/30 text-[10px] text-center mb-1">Swipe left/right to change month</p>

        {/* Calendar with swipe */}
        <div
          ref={calendarRef}
          className="mobile-calendar-wrapper touch-pan-y"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <style>{`
            .mobile-calendar-wrapper .rdp {
              --rdp-cell-size: 36px;
              --rdp-accent-color: #C4A461;
              --rdp-background-color: rgba(196, 164, 97, 0.2);
              margin: 0;
              margin-top: -8px;
            }
            .mobile-calendar-wrapper .rdp-month {
              width: 100%;
            }
            .mobile-calendar-wrapper .rdp-table {
              width: 100%;
            }
            .mobile-calendar-wrapper .rdp-caption,
            .mobile-calendar-wrapper .rdp-nav,
            .mobile-calendar-wrapper .rdp-caption_label,
            .mobile-calendar-wrapper .rdp-caption_dropdowns {
              display: none !important;
            }
            .mobile-calendar-wrapper .rdp-head_cell,
            .mobile-calendar-wrapper .rdp-weekday {
              color: #C4A461 !important;
              font-size: 11px;
              font-weight: 600;
              text-transform: uppercase;
            }
            .mobile-calendar-wrapper .rdp-cell {
              color: white !important;
            }
            .mobile-calendar-wrapper .rdp-day {
              color: white !important;
              font-size: 13px;
              font-weight: 400;
            }
            .mobile-calendar-wrapper .rdp-button:not(.rdp-day_disabled) {
              color: white !important;
            }
            .mobile-calendar-wrapper .rdp-day:hover:not(.rdp-day_disabled) {
              background: rgba(196, 164, 97, 0.3) !important;
            }
            .mobile-calendar-wrapper .rdp-day_selected,
            .mobile-calendar-wrapper .rdp-day_range_start,
            .mobile-calendar-wrapper .rdp-day_range_end,
            .mobile-calendar-wrapper .rdp-selected,
            .mobile-calendar-wrapper [aria-selected="true"],
            .mobile-calendar-wrapper .rdp-day[aria-selected="true"] {
              background: #C4A461 !important;
              color: #0B1C26 !important;
              font-weight: 600;
            }
            .mobile-calendar-wrapper .rdp-day_range_middle,
            .mobile-calendar-wrapper .rdp-range_middle {
              background: rgba(196, 164, 97, 0.5) !important;
              color: #0B1C26 !important;
            }
            .mobile-calendar-wrapper .rdp-day_disabled {
              color: rgba(255,255,255,0.2) !important;
            }
            .mobile-calendar-wrapper .rdp-day_today:not(.rdp-day_selected) {
              border: 1px solid #C4A461;
              color: #C4A461 !important;
            }
          `}</style>
          <DayPicker
            mode="range"
            selected={range}
            onSelect={handleSelect}
            month={currentMonth}
            onMonthChange={setCurrentMonth}
            disabled={{ before: today }}
            numberOfMonths={1}
            showOutsideDays={false}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-4">
          <button
            onClick={handleClear}
            className="flex-1 py-3 rounded-xl text-[10px] uppercase tracking-widest font-medium border border-white/10 text-white/50 hover:text-white hover:border-white/20 transition-all"
          >
            Clear
          </button>
          <button
            onClick={handleConfirm}
            disabled={!range?.from}
            className="flex-1 py-3 rounded-xl text-[10px] uppercase tracking-widest font-semibold bg-luxury-gold text-luxury-blue disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileDatePickerModal;
