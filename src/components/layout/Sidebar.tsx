import React from 'react';
import PublicHolidays from '../calendar/PublicHolidays';
import SchoolTerms from '../calendar/SchoolTerms';
import { Clock, Calendar as CalendarIcon, BookOpen } from 'lucide-react';
import { format } from 'date-fns';

interface SidebarProps {
  selectedDate: Date;
}

const Sidebar: React.FC<SidebarProps> = ({ selectedDate }) => {
  // Simple greeting based on time of day
  const getTimeOfDayGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 animate-slide-up">
        <div className="flex items-center mb-3">
          <Clock className="text-accent-700 dark:text-accent-400 mr-2" size={20} />
          <h2 className="font-heading font-semibold text-lg">{getTimeOfDayGreeting()}</h2>
        </div>
        <div className="flex flex-col space-y-2">
          <div className="flex items-center">
            <CalendarIcon className="text-secondary-400 mr-2" size={18} />
            <p className="text-textSecondary dark:text-primary-200">{format(new Date(), 'EEEE, MMMM do, yyyy')}</p>
          </div>
          <p className="text-sm text-textSecondary dark:text-primary-200 mt-2">
            Currently viewing: <span className="font-semibold">{format(selectedDate, 'MMMM yyyy')}</span>
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center mb-3">
          <CalendarIcon className="text-accent-700 dark:text-accent-400 mr-2" size={20} />
          <h2 className="font-heading font-semibold text-lg">Public Holidays</h2>
        </div>
        <PublicHolidays selectedDate={selectedDate} />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-center mb-3">
          <BookOpen className="text-accent-700 dark:text-accent-400 mr-2" size={20} />
          <h2 className="font-heading font-semibold text-lg">School Terms</h2>
        </div>
        <SchoolTerms selectedDate={selectedDate} />
      </div>
    </div>
  );
};

export default Sidebar;