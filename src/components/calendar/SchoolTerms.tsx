import React from 'react';
import { BookOpen, Calendar } from 'lucide-react';
import { getSchoolTerms } from '../../data/schoolTerms';
import { format, isWithinInterval } from 'date-fns';

interface SchoolTermsProps {
  selectedDate: Date;
}

const SchoolTerms: React.FC<SchoolTermsProps> = ({ selectedDate }) => {
  const currentYear = selectedDate.getFullYear();
  const schoolTerms = getSchoolTerms(currentYear);
  const today = new Date();
  
  // Find current active term
  const currentTerm = schoolTerms.find(term => {
    const termStart = new Date(term.startDate);
    const termEnd = new Date(term.endDate);
    return isWithinInterval(today, { start: termStart, end: termEnd });
  });
  
  // Find upcoming term
  const upcomingTerm = schoolTerms.find(term => {
    const termStart = new Date(term.startDate);
    return termStart > today;
  });

  return (
    <div className="space-y-4">
      {currentTerm ? (
        <div className="bg-primary-50 dark:bg-gray-700 rounded-md p-3">
          <div className="flex items-center mb-2">
            <BookOpen size={16} className="mr-2 text-secondary-400" />
            <h3 className="font-heading font-medium text-sm">Current Term</h3>
          </div>
          <div>
            <p className="text-sm font-medium">{currentTerm.name}</p>
            <p className="text-xs text-textSecondary dark:text-primary-200">
              {format(new Date(currentTerm.startDate), 'MMMM do')} - {format(new Date(currentTerm.endDate), 'MMMM do, yyyy')}
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-primary-50 dark:bg-gray-700 rounded-md p-3">
          <p className="text-sm text-textSecondary dark:text-primary-200">No active school term</p>
        </div>
      )}

      {upcomingTerm && (
        <div>
          <div className="flex items-center mb-2">
            <Calendar size={16} className="mr-2 text-accent-700 dark:text-accent-400" />
            <h3 className="font-heading font-medium text-sm">Next Term</h3>
          </div>
          <div>
            <p className="text-sm font-medium">{upcomingTerm.name}</p>
            <p className="text-xs text-textSecondary dark:text-primary-200">
              {format(new Date(upcomingTerm.startDate), 'MMMM do')} - {format(new Date(upcomingTerm.endDate), 'MMMM do, yyyy')}
            </p>
          </div>
        </div>
      )}
      
      <div>
        <h3 className="font-heading text-sm font-medium mb-2">All {currentYear} Terms</h3>
        <ul className="space-y-2 text-sm">
          {schoolTerms.map((term, index) => (
            <li 
              key={index} 
              className="py-1 border-b border-primary-50 dark:border-gray-700 last:border-0"
            >
              <p className="font-medium">{term.name}</p>
              <p className="text-xs text-textSecondary dark:text-primary-200">
                {format(new Date(term.startDate), 'MMM do')} - {format(new Date(term.endDate), 'MMM do')}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SchoolTerms;