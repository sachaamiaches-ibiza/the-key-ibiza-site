import React, { useState, useCallback, useRef } from 'react';
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

  // Helper to parse "YYYY-MM-DD" as local date (midnight) to prevent timezone shifts
  const parseLocal = useCallback((d: string) => {
    if (!d) return undefined;
    const parts = d.split('-');
    if (parts.length === 3) {
      return new Date(+parts[0], +parts[1] - 1, +parts[2]);
    }
    return new Date(d);
  }, []);

  // Derive range directly from props (stateless)
  const range = React.useMemo(() => {
    const from = parseLocal(checkIn);
    const to = parseLocal(checkOut);
    return from ? { from, to } : undefined;
  }, [checkIn, checkOut, parseLocal]);

  const [selecting, setSelecting] = useState<'checkin' | 'checkout'>(() => {
    return (checkIn && checkOut) ? 'checkin' : (checkIn ? 'checkout' : 'checkin');
  });

  const [currentMonth, setCurrentMonth] = useState<Date>(() => {
    const fromDate = parseLocal(checkIn);
    return fromDate || new Date();
  });

  const touchStartX = useRef<number | null>(null);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const handlePrevMonth = useCallback(() => {
    setCurrentMonth(prev => subMonths(prev, 1));
  }, []);

  const handleNextMonth = useCallback(() => {
    setCurrentMonth(prev => addMonths(prev, 1));
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? handleNextMonth() : handlePrevMonth();
    }
    touchStartX.current = null;
  }, [handleNextMonth, handlePrevMonth]);

  const handleSelect = useCallback((newRange: DateRange | undefined, selectedDay: Date) => {
    // If not valid click, ignore
    if (!selectedDay) return;

    if (selecting === 'checkin') {
      // Logic for selecting START date
      // Always use the clicked day as new start, clear the end
      onDatesChange(format(selectedDay, 'yyyy-MM-dd'), '');
      setSelecting('checkout');
    } else {
      // Logic for selecting END date or modifying range
      if (newRange?.to) {
        // We have a full range (start + end) provided by DayPicker
        onDatesChange(format(newRange.from!, 'yyyy-MM-dd'), format(newRange.to, 'yyyy-MM-dd'));
        onClose();
      } else if (newRange?.from && range?.from && newRange.from > range.from) {
        // User clicked a date AFTER current start, but DayPicker gave partial range
        // Treat clicked date (newRange.from which is usually selectedDay) as end
        onDatesChange(format(range.from, 'yyyy-MM-dd'), format(newRange.from, 'yyyy-MM-dd'));
        onClose();
      } else {
        // User clicked a date BEFORE current start, or same date
        // Treat as new start date
        onDatesChange(format(selectedDay, 'yyyy-MM-dd'), '');
        setSelecting('checkout');
      }
    }
  }, [selecting, range, onDatesChange, onClose]);

  const handleClear = () => {
    onDatesChange('', '');
    setSelecting('checkin');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999]" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      <div
        className="absolute inset-0 m-auto bg-[#0B1C26] border border-white/10 rounded-2xl p-4 md:p-6 max-w-sm md:max-w-md w-[calc(100%-2rem)] h-fit max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-white font-serif text-lg">Select Dates</h3>
          <button onClick={onClose} className="text-white/50 hover:text-white p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => { setSelecting('checkin'); onDatesChange('', ''); }}
            className={`flex-1 p-2 rounded-lg border text-center text-xs transition-all ${
              selecting === 'checkin' ? 'border-luxury-gold bg-luxury-gold/10 text-luxury-gold' : 'border-white/10 text-white/50'
            }`}
          >
            <div className="text-[8px] uppercase tracking-wider mb-1">Check-in</div>
            <div>{range?.from ? format(range.from, 'dd MMM yyyy') : '—'}</div>
          </button>
          <button
            onClick={() => range?.from && setSelecting('checkout')}
            className={`flex-1 p-2 rounded-lg border text-center text-xs transition-all ${
              selecting === 'checkout' ? 'border-luxury-gold bg-luxury-gold/10 text-luxury-gold' : 'border-white/10 text-white/50'
            }`}
          >
            <div className="text-[8px] uppercase tracking-wider mb-1">Check-out</div>
            <div>{range?.to ? format(range.to, 'dd MMM yyyy') : '—'}</div>
          </button>
        </div>

        <div className="flex items-center justify-between mb-3 px-1">
          <button type="button" onClick={handlePrevMonth} className="p-2 text-white/50 hover:text-luxury-gold transition-colors rounded-lg hover:bg-white/5">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-white font-medium">{format(currentMonth, 'MMMM yyyy')}</span>
          <button type="button" onClick={handleNextMonth} className="p-2 text-white/50 hover:text-luxury-gold transition-colors rounded-lg hover:bg-white/5">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <p className="text-white/30 text-[10px] text-center mb-1">Swipe left/right to change month</p>

        <div className="mobile-calendar-wrapper touch-pan-y" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
          <style>{`
            .mobile-calendar-wrapper .rdp {
              --rdp-cell-size: 36px;
              --rdp-accent-color: #C4A461;
              margin: 0;
              margin-top: -8px;
            }
            .mobile-calendar-wrapper .rdp-month { width: 100%; }
            .mobile-calendar-wrapper .rdp-table { width: 100%; }
            .mobile-calendar-wrapper .rdp-caption,
            .mobile-calendar-wrapper .rdp-caption_label,
            .mobile-calendar-wrapper .rdp-nav,
            .mobile-calendar-wrapper .rdp-caption_dropdowns,
            .mobile-calendar-wrapper .rdp-months_dropdown,
            .mobile-calendar-wrapper .rdp-years_dropdown { display: none !important; }
            .mobile-calendar-wrapper .rdp-head_cell,
            .mobile-calendar-wrapper .rdp-weekday {
              color: #C4A461 !important;
              font-size: 11px;
              font-weight: 600;
              text-transform: uppercase;
            }
            .mobile-calendar-wrapper .rdp-day {
              color: white !important;
              font-size: 13px;
            }
            .mobile-calendar-wrapper .rdp-day:hover:not(.rdp-day_disabled) {
              background: rgba(196, 164, 97, 0.3) !important;
            }
            .mobile-calendar-wrapper .rdp-day_selected,
            .mobile-calendar-wrapper .rdp-day_range_start,
            .mobile-calendar-wrapper .rdp-day_range_end,
            .mobile-calendar-wrapper [aria-selected="true"] {
              background: #C4A461 !important;
              color: #0B1C26 !important;
              font-weight: 600;
            }
            .mobile-calendar-wrapper .rdp-day_range_middle {
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
            disabled={{ before: today }}
            numberOfMonths={1}
            showOutsideDays={false}
          />
        </div>

        <div className="flex gap-3 mt-4">
          <button onClick={handleClear} className="flex-1 py-3 rounded-xl text-[10px] uppercase tracking-widest font-medium border border-white/10 text-white/50 hover:text-white hover:border-white/20 transition-all">
            Clear
          </button>
          <button onClick={onClose} className="flex-1 py-3 rounded-xl text-[10px] uppercase tracking-widest font-semibold bg-luxury-gold text-luxury-blue">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileDatePickerModal;
