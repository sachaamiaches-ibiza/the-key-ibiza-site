import React, { useState, useEffect } from 'react';
import { DayPicker, DateRange } from 'react-day-picker';
import { format } from 'date-fns';
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
  const [range, setRange] = useState<DateRange | undefined>(() => {
    const from = checkIn ? new Date(checkIn) : undefined;
    const to = checkOut ? new Date(checkOut) : undefined;
    return from ? { from, to } : undefined;
  });

  const [selecting, setSelecting] = useState<'checkin' | 'checkout'>('checkin');

  useEffect(() => {
    if (isOpen) {
      const from = checkIn ? new Date(checkIn) : undefined;
      const to = checkOut ? new Date(checkOut) : undefined;
      setRange(from ? { from, to } : undefined);
      setSelecting(from && !to ? 'checkout' : 'checkin');
    }
  }, [isOpen, checkIn, checkOut]);

  if (!isOpen) return null;

  const handleSelect = (newRange: DateRange | undefined) => {
    if (!newRange) {
      setRange(undefined);
      setSelecting('checkin');
      return;
    }

    if (selecting === 'checkin') {
      setRange({ from: newRange.from, to: undefined });
      setSelecting('checkout');
    } else {
      if (newRange.from && newRange.to) {
        setRange(newRange);
      } else if (newRange.from) {
        setRange({ from: range?.from, to: newRange.from });
      }
    }
  };

  const handleConfirm = () => {
    const newCheckIn = range?.from ? format(range.from, 'yyyy-MM-dd') : '';
    const newCheckOut = range?.to ? format(range.to, 'yyyy-MM-dd') : '';
    onDatesChange(newCheckIn, newCheckOut);
    onClose();
  };

  const today = new Date();

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-[#0B1C26] border border-white/10 rounded-2xl p-4 mx-4 max-w-sm w-full max-h-[90vh] overflow-y-auto">
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
          <div className={`flex-1 p-2 rounded-lg border text-center text-xs ${selecting === 'checkin' ? 'border-luxury-gold bg-luxury-gold/10 text-luxury-gold' : 'border-white/10 text-white/50'}`}>
            <div className="text-[8px] uppercase tracking-wider mb-1">Check-in</div>
            <div>{range?.from ? format(range.from, 'dd MMM yyyy') : '—'}</div>
          </div>
          <div className={`flex-1 p-2 rounded-lg border text-center text-xs ${selecting === 'checkout' ? 'border-luxury-gold bg-luxury-gold/10 text-luxury-gold' : 'border-white/10 text-white/50'}`}>
            <div className="text-[8px] uppercase tracking-wider mb-1">Check-out</div>
            <div>{range?.to ? format(range.to, 'dd MMM yyyy') : '—'}</div>
          </div>
        </div>

        {/* Calendar */}
        <div className="mobile-calendar-wrapper">
          <style>{`
            .mobile-calendar-wrapper .rdp {
              --rdp-cell-size: 36px;
              --rdp-accent-color: #C4A461;
              --rdp-background-color: rgba(196, 164, 97, 0.2);
              margin: 0;
            }
            .mobile-calendar-wrapper .rdp-month {
              width: 100%;
            }
            .mobile-calendar-wrapper .rdp-table {
              width: 100%;
            }
            .mobile-calendar-wrapper .rdp-caption_label {
              color: white;
              font-size: 14px;
            }
            .mobile-calendar-wrapper .rdp-nav_button {
              color: rgba(255,255,255,0.5);
            }
            .mobile-calendar-wrapper .rdp-nav_button:hover {
              color: #C4A461;
              background: rgba(196, 164, 97, 0.1);
            }
            .mobile-calendar-wrapper .rdp-head_cell {
              color: rgba(255,255,255,0.4);
              font-size: 10px;
              font-weight: normal;
            }
            .mobile-calendar-wrapper .rdp-day {
              color: white;
              font-size: 12px;
            }
            .mobile-calendar-wrapper .rdp-day:hover:not(.rdp-day_disabled) {
              background: rgba(196, 164, 97, 0.2);
            }
            .mobile-calendar-wrapper .rdp-day_selected,
            .mobile-calendar-wrapper .rdp-day_range_start,
            .mobile-calendar-wrapper .rdp-day_range_end,
            .mobile-calendar-wrapper .rdp-selected {
              background: #C4A461 !important;
              color: #0B1C26 !important;
            }
            .mobile-calendar-wrapper .rdp-day_range_middle,
            .mobile-calendar-wrapper .rdp-range_middle {
              background: rgba(196, 164, 97, 0.5) !important;
              color: #0B1C26 !important;
            }
            .mobile-calendar-wrapper [aria-selected="true"] {
              background: #C4A461 !important;
              color: #0B1C26 !important;
            }
            .mobile-calendar-wrapper .rdp-day_disabled {
              color: rgba(255,255,255,0.2);
            }
            .mobile-calendar-wrapper .rdp-day_today {
              border: 1px solid #C4A461;
            }
          `}</style>
          <DayPicker
            mode="range"
            selected={range}
            onSelect={handleSelect}
            disabled={{ before: today }}
            numberOfMonths={1}
            showOutsideDays={false}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => {
              setRange(undefined);
              setSelecting('checkin');
            }}
            className="flex-1 py-3 rounded-xl text-[10px] uppercase tracking-widest font-medium border border-white/10 text-white/50"
          >
            Clear
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 py-3 rounded-xl text-[10px] uppercase tracking-widest font-semibold bg-luxury-gold text-luxury-blue"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileDatePickerModal;
