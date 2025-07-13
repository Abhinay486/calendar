import { useQuery } from '@tanstack/react-query';
import { googleCalendarApi, type CalendarEvent } from '@/lib/google-calendar';
import { Calendar, Clock } from 'lucide-react';

interface EventsPanelProps {
  currentDate: Date;
}

export function EventsPanel({ currentDate }: EventsPanelProps) {
  // Get upcoming events from current date
  const startDate = new Date();
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + 1);

  const { data: authStatus } = useQuery({
    queryKey: ['/api/auth/status'],
    queryFn: () => googleCalendarApi.getAuthStatus(),
  });

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['/api/calendar/events', startDate, endDate],
    queryFn: () => googleCalendarApi.getEvents(startDate, endDate),
    enabled: authStatus?.isAuthenticated,
  });

  // Filter and sort upcoming events
  const upcomingEvents = events
    .filter(event => new Date(event.startDateTime) >= startDate)
    .sort((a, b) => new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime())
    .slice(0, 10);

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === now.toDateString()) {
      return `Today at ${date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      })}`;
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow at ${date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      })}`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    }
  };

  const eventColors = ['bg-green-500', 'bg-blue-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500'];
  
  const getEventColor = (index: number) => {
    return eventColors[index % eventColors.length];
  };

  return (
    <div className="bg-white rounded-lg shadow-sm mt-6 p-6">
      <h3 className="text-lg font-medium text-primary-calendar mb-4">
        Upcoming Events
      </h3>
      
      {!authStatus?.isAuthenticated ? (
        <div className="text-center py-8 text-secondary-calendar">
          <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">Connect your Google Calendar to see events</p>
        </div>
      ) : isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center space-x-3 p-3">
                <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : upcomingEvents.length === 0 ? (
        <div className="text-center py-8 text-secondary-calendar">
          <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">No upcoming events</p>
        </div>
      ) : (
        <div className="space-y-3">
          {upcomingEvents.map((event, index) => (
            <div
              key={event.id}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className={`w-3 h-3 rounded-full ${getEventColor(index)}`} />
              <div className="flex-1">
                <div className="text-sm font-medium text-primary-calendar">
                  {event.summary}
                </div>
                <div className="text-xs text-secondary-calendar">
                  {formatEventDate(event.startDateTime)}
                </div>
                {event.location && (
                  <div className="text-xs text-secondary-calendar mt-1">
                    📍 {event.location}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
