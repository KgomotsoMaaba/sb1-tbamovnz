import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { addMonths, subMonths, format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameMonth, isSameDay, addDays, isWeekend } from 'date-fns';
import { getPublicHolidays } from '../../data/holidays';
import { getSchoolTerms } from '../../data/schoolTerms';
import { supabase } from '../../lib/supabase';
import AuthButton from '../auth/AuthButton';
import { syncGoogleCalendar } from '../../lib/googleCalendar';

interface CalendarProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}

interface Event {
  id: string;
  title: string;
  start_date: string;
  end_date: string;
  type?: string;
}

const Calendar: React.FC<CalendarProps> = ({ selectedDate, setSelectedDate }) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(selectedDate);
  const [showEventForm, setShowEventForm] = useState<boolean>(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState<boolean>(false);
  const [newEventTitle, setNewEventTitle] = useState<string>('');
  const [events, setEvents] = useState<Event[]>([]);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchEvents();
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchEvents();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('start_date', { ascending: true });

      if (error) {
        throw error;
      }

      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleMonthChange = (amount: number) => {
    const newMonth = amount > 0 ? addMonths(currentMonth, amount) : subMonths(currentMonth, Math.abs(amount));
    setCurrentMonth(newMonth);
  };

  const handleDateClick = (day: Date) => {
    setSelectedDate(day);
  };

  const handleAddEvent = async () => {
    if (!newEventTitle.trim() || !session) return;

    try {
      // Create event in Supabase
      const newEvent = {
        title: newEventTitle.trim(),
        start_date: selectedDate.toISOString(),
        end_date: addDays(selectedDate, 1).toISOString(),
        user_id: session.user.id
      };

      const { data, error } = await supabase
        .from('events')
        .insert([newEvent])
        .select()
        .single();

      if (error) throw error;

      // Sync with Google Calendar if provider_token exists
      if (session.provider_token) {
        try {
          await syncGoogleCalendar();
        } catch (error) {
          console.error('Error syncing with Google Calendar:', error);
        }
      }

      setEvents([...events, data]);
      setNewEventTitle('');
      setShowEventForm(false);
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  const handleAddEventClick = () => {
    if (!session) {
      setShowAuthPrompt(true);
    } else {
      setShowEventForm(true);
    }
  };

  // Generate calendar days
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = addDays(monthStart, -getDay(monthStart));
  const endDate = addDays(monthEnd, 6 - getDay(monthEnd));
  
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  // Get holidays and terms for the current month view
  const publicHolidays = getPublicHolidays(currentMonth.getFullYear(), currentMonth.getMonth());
  const schoolTerms = getSchoolTerms(currentMonth.getFullYear());
  
  const isInSchoolTerm = (date: Date): boolean => {
    if (isWeekend(date)) return false;
    return schoolTerms.some(term => {
      const termStart = new Date(term.startDate);
      const termEnd = new Date(term.endDate);
      return date >= termStart && date <= termEnd;
    });
  };

  const isPublicHoliday = (date: Date): { isHoliday: boolean; name?: string } => {
    const holiday = publicHolidays.find(holiday => 
      isSameDay(new Date(holiday.date), date)
    );
    
    return holiday 
      ? { isHoliday: true, name: holiday.name } 
      : { isHoliday: false };
  };

  const getEventsForDay = (day: Date) => {
    return events.filter(event => 
      isSameDay(new Date(event.start_date), day)
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-primary-100 dark:bg-gray-700 flex justify-between items-center">
        <button 
          onClick={() => handleMonthChange(-1)}
          className="p-2 rounded-full hover:bg-primary-200 dark:hover:bg-gray-600 transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft size={20} />
        </button>
        
        <h2 className="font-heading font-semibold text-xl">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        
        <button 
          onClick={() => handleMonthChange(1)}
          className="p-2 rounded-full hover:bg-primary-200 dark:hover:bg-gray-600 transition-colors"
          aria-label="Next month"
        >
          <ChevronRight size={20} />
        </button>
      </div>
      
      <div className="grid grid-cols-7 bg-primary-50 dark:bg-gray-700">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
          <div key={index} className="py-2 text-center font-heading font-medium text-sm text-textSecondary dark:text-primary-200">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 bg-white dark:bg-gray-800">
        {days.map((day, i) => {
          const dayEvents = getEventsForDay(day);
          const holiday = isPublicHoliday(day);
          const inSchoolTerm = isInSchoolTerm(day);
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isToday = isSameDay(day, new Date());
          const isSelected = isSameDay(day, selectedDate);

          return (
            <div 
              key={i} 
              onClick={() => handleDateClick(day)}
              className={`
                min-h-[80px] p-1 border-b border-r border-primary-100 dark:border-gray-700 
                transition-colors cursor-pointer relative
                ${isCurrentMonth ? 'bg-white dark:bg-gray-800' : 'bg-primary-50/50 dark:bg-gray-700/50 text-textSecondary/70 dark:text-primary-200/70'}
                ${isToday ? 'ring-2 ring-inset ring-secondary-400 dark:ring-secondary-500' : ''}
                ${isSelected ? 'bg-primary-100 dark:bg-gray-700' : 'hover:bg-primary-50 dark:hover:bg-gray-700'}
              `}
            >
              <div className="flex justify-between items-start">
                <span className={`
                  text-sm font-medium rounded-full w-6 h-6 flex items-center justify-center
                  ${isSelected ? 'bg-secondary-400 text-white' : ''}
                `}>
                  {format(day, 'd')}
                </span>
                
                {holiday.isHoliday && (
                  <span className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 text-xs px-1 rounded">
                    Holiday
                  </span>
                )}
                
                {inSchoolTerm && !holiday.isHoliday && isCurrentMonth && (
                  <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs px-1 rounded">
                    School
                  </span>
                )}
              </div>
              
              <div className="mt-1 space-y-1 text-xs">
                {dayEvents.map((event, idx) => (
                  <div 
                    key={idx} 
                    className={`
                      p-1 rounded truncate overflow-hidden
                      ${event.type === 'adventure' ? 'bg-accent-100 dark:bg-accent-900/30 text-accent-800 dark:text-accent-300' : 
                       event.type === 'leisure' ? 'bg-secondary-100 dark:bg-secondary-900/30 text-secondary-800 dark:text-secondary-300' : 
                       'bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300'}
                    `}
                  >
                    {event.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Selected day details */}
      <div className="p-4 border-t border-primary-100 dark:border-gray-700">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-heading font-medium">
            {format(selectedDate, 'EEEE, MMMM do, yyyy')}
          </h3>
          <button 
            onClick={handleAddEventClick}
            className="flex items-center text-sm bg-secondary-400 hover:bg-secondary-500 text-white px-3 py-1 rounded-full transition-colors"
          >
            <Plus size={16} className="mr-1" />
            Add Event
          </button>
        </div>
        
        {showEventForm && (
          <div className="bg-primary-50 dark:bg-gray-700 p-3 rounded-md mb-4 animate-slide-up">
            <input
              type="text"
              placeholder="Event title"
              value={newEventTitle}
              onChange={(e) => setNewEventTitle(e.target.value)}
              className="w-full p-2 mb-2 rounded border border-primary-200 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-accent-500"
            />
            <div className="flex justify-end space-x-2">
              <button 
                onClick={() => setShowEventForm(false)}
                className="px-3 py-1 text-sm text-textPrimary dark:text-primary-100 hover:bg-primary-100 dark:hover:bg-gray-600 rounded transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddEvent}
                className="px-3 py-1 text-sm bg-accent-700 hover:bg-accent-800 text-white rounded transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        )}
        
        <div>
          {getEventsForDay(selectedDate).length > 0 ? (
            <div className="space-y-2">
              {getEventsForDay(selectedDate).map((event, idx) => (
                <div key={idx} className="bg-white dark:bg-gray-700 p-3 rounded-md shadow-sm border border-primary-100 dark:border-gray-600">
                  <h4 className="font-medium">{event.title}</h4>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-textSecondary dark:text-primary-200 text-sm">No events scheduled for this day.</p>
          )}
        </div>
      </div>

      {showAuthPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl">
            <h3 className="text-xl font-semibold mb-4">Sign in to add events</h3>
            <AuthButton />
            <button
              onClick={() => setShowAuthPrompt(false)}
              className="mt-4 text-sm text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;