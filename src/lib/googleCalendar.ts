import { supabase } from './supabase';

export const syncGoogleCalendar = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.provider_token) {
      throw new Error('No access token available');
    }

    // Get events from Supabase
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('*')
      .eq('user_id', session.user.id);

    if (eventsError) throw eventsError;

    // Sync each event to Google Calendar
    for (const event of events) {
      const googleEvent = {
        summary: event.title,
        start: {
          dateTime: event.start_date,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        end: {
          dateTime: event.end_date,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
      };

      await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.provider_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(googleEvent),
      });
    }

    return events;
  } catch (error) {
    console.error('Error syncing with Google Calendar:', error);
    throw error;
  }
};