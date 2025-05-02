import { isSameMonth } from 'date-fns';

export interface PublicHoliday {
  date: string;
  name: string;
  description?: string;
}

// South African public holidays for 2025 (a realistic future year)
const publicHolidays2025: PublicHoliday[] = [
  { date: '2025-01-01', name: 'New Year\'s Day', description: 'The first day of the year.' },
  { date: '2025-03-21', name: 'Human Rights Day', description: 'Commemorates the Sharpeville massacre of 1960.' },
  { date: '2025-04-18', name: 'Good Friday', description: 'Christian holiday commemorating the crucifixion of Jesus.' },
  { date: '2025-04-21', name: 'Family Day', description: 'Day after Easter Sunday.' },
  { date: '2025-04-27', name: 'Freedom Day', description: 'Celebrates first democratic elections in 1994.' },
  { date: '2025-04-28', name: 'Freedom Day (Observed)', description: 'Observed on Monday as April 27 falls on a Sunday.' },
  { date: '2025-05-01', name: 'Workers\' Day', description: 'International Workers\' Day.' },
  { date: '2025-06-16', name: 'Youth Day', description: 'Commemorates the Soweto uprising of 1976.' },
  { date: '2025-08-09', name: 'National Women\'s Day', description: 'Commemorates the 1956 women\'s march to the Union Buildings.' },
  { date: '2025-08-11', name: 'National Women\'s Day (Observed)', description: 'Observed on Monday as August 9 falls on a Saturday.' },
  { date: '2025-09-24', name: 'Heritage Day', description: 'Celebrates South African cultural heritage.' },
  { date: '2025-12-16', name: 'Day of Reconciliation', description: 'Promotes reconciliation and national unity.' },
  { date: '2025-12-25', name: 'Christmas Day', description: 'Christian holiday celebrating the birth of Jesus.' },
  { date: '2025-12-26', name: 'Day of Goodwill', description: 'Day of goodwill and giving.' }
];

// Function to get public holidays for a specific year (and optionally month)
export const getPublicHolidays = (year: number, month?: number): PublicHoliday[] => {
  // For now, we only have data for 2025, so we'll return that regardless of the year parameter
  // In a real application, you would have data for multiple years or fetch from an API
  
  if (month !== undefined) {
    return publicHolidays2025.filter(holiday => {
      const holidayDate = new Date(holiday.date);
      return isSameMonth(holidayDate, new Date(year, month, 1));
    });
  }
  
  return publicHolidays2025;
};