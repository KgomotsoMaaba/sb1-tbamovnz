import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import { getPublicHolidays } from '../../data/holidays';
import { format, isWithinInterval, addDays, startOfMonth, endOfMonth } from 'date-fns';

interface PublicHolidaysProps {
  selectedDate: Date;
}

const PublicHolidays: React.FC<PublicHolidaysProps> = ({ selectedDate }) => {
  // Get all public holidays for the current year
  const currentYear = selectedDate.getFullYear();
  const allHolidays = getPublicHolidays(currentYear);
  
  // Get holidays for the current month
  const currentMonth = selectedDate.getMonth();
  const monthHolidays = getPublicHolidays(currentYear, currentMonth);
  
  // Get upcoming holidays (next 60 days)
  const today = new Date();
  const sixtyDaysLater = addDays(today, 60);
  
  const upcomingHolidays = allHolidays.filter(holiday => {
    const holidayDate = new Date(holiday.date);
    return holidayDate >= today && holidayDate <= sixtyDaysLater;
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="space-y-2">
      {monthHolidays.length > 0 ? (
        <div>
          <h3 className="text-sm font-semibold mb-2 font-heading">This Month</h3>
          <ul className="space-y-2">
            {monthHolidays.map((holiday, index) => (
              <li 
                key={index} 
                className="flex items-start py-1 text-sm border-b border-primary-50 dark:border-gray-700 last:border-0"
              >
                <Calendar size={14} className="mt-1 mr-2 text-secondary-400 flex-shrink-0" />
                <div>
                  <p className="font-medium">{holiday.name}</p>
                  <p className="text-xs text-textSecondary dark:text-primary-200">
                    {format(new Date(holiday.date), 'EEEE, MMMM do')}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-sm text-textSecondary dark:text-primary-200">No public holidays this month.</p>
      )}
      
      {upcomingHolidays.length > 0 && (
        <div className="pt-2">
          <h3 className="text-sm font-semibold mb-2 font-heading">Upcoming Holidays</h3>
          <ul className="space-y-2">
            {upcomingHolidays.slice(0, 3).map((holiday, index) => (
              <li 
                key={index} 
                className="flex items-start py-1 text-sm border-b border-primary-50 dark:border-gray-700 last:border-0"
              >
                <Clock size={14} className="mt-1 mr-2 text-secondary-400 flex-shrink-0" />
                <div>
                  <p className="font-medium">{holiday.name}</p>
                  <p className="text-xs text-textSecondary dark:text-primary-200">
                    {format(new Date(holiday.date), 'EEEE, MMMM do')}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PublicHolidays;