import { useQuery } from '@tanstack/react-query';
import { googleCalendarApi, type CalendarEvent } from '@/lib/google-calendar';

interface CalendarGridProps {
  currentDate: Date;
}

interface CalendarDay {
  date: Date;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSunday: boolean;
  events: CalendarEvent[];
}

export function CalendarGrid({ currentDate }: CalendarGridProps) {
  // Get start and end of the month
  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  
  // Get the first day of the week for the calendar grid
  const startOfCalendar = new Date(startOfMonth);
  startOfCalendar.setDate(startOfCalendar.getDate() - startOfCalendar.getDay());
  
  // Get the last day of the week for the calendar grid
  const endOfCalendar = new Date(endOfMonth);
  endOfCalendar.setDate(endOfCalendar.getDate() + (6 - endOfCalendar.getDay()));

  const { data: events = [] } = useQuery({
    queryKey: ['/api/calendar/events', startOfCalendar, endOfCalendar],
    queryFn: () => googleCalendarApi.getEvents(startOfCalendar, endOfCalendar),
  });

  // Generate calendar days
  const calendarDays: CalendarDay[] = [];
  const current = new Date(startOfCalendar);
  const today = new Date();
  
  while (current <= endOfCalendar) {
    const dayEvents = events.filter(event => {
      const eventDate = new Date(event.startDateTime);
      return eventDate.toDateString() === current.toDateString();
    });

    calendarDays.push({
      date: new Date(current),
      dayNumber: current.getDate(),
      isCurrentMonth: current.getMonth() === currentDate.getMonth(),
      isToday: current.toDateString() === today.toDateString(),
      isSunday: current.getDay() === 0,
      events: dayEvents,
    });
    
    current.setDate(current.getDate() + 1);
  }

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const eventColors = ['bg-green-500', 'bg-blue-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500'];

  const getEventColor = (index: number) => {
    return eventColors[index % eventColors.length];
  };

  const renderDay = (day: CalendarDay) => {
    let cellClasses = 'h-24 border-r border-b border-light p-2 transition-colors ';
    
    if (!day.isCurrentMonth) {
      cellClasses += 'calendar-cell-other-month ';
    } else if (day.isToday) {
      cellClasses += 'calendar-cell-today ';
    } else if (day.isSunday) {
      cellClasses += 'calendar-cell-sunday ';
    } else {
      cellClasses += 'calendar-cell-regular ';
    }

    let textClasses = 'text-sm ';
    if (!day.isCurrentMonth) {
      textClasses += 'text-gray-400';
    } else if (day.isSunday) {
      textClasses += 'text-sunday';
    } else {
      textClasses += 'text-primary-calendar';
    }

    if (day.isToday) {
      textClasses += ' font-medium';
    }

    return (
      <div key={day.date.toISOString()} className={cellClasses}>
        <span className={textClasses}>
          {day.dayNumber}
        </span>
        {day.isToday && (
          <div className="text-xs text-blue-600 mt-1">Today</div>
        )}
        {day.events.length > 0 && (
          <div className="mt-1 space-y-1">
            {day.events.slice(0, 3).map((event, index) => (
              <div
                key={event.id}
                className={`w-2 h-2 rounded-full ${getEventColor(index)}`}
                title={event.summary}
              />
            ))}
            {day.events.length > 3 && (
              <div className="text-xs text-gray-500">
                +{day.events.length - 3} more
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // Group days into weeks
  const weeks: CalendarDay[][] = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7));
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Days of Week Header */}
      <div className="grid grid-cols-7 border-b border-light">
        {weekDays.map((day, index) => (
          <div
            key={day}
            className={`p-4 text-center text-sm font-medium ${
              index === 0 
                ? 'text-sunday bg-red-50' 
                : 'text-secondary-calendar'
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Dates Grid */}
      <div className="grid grid-cols-7">
        {calendarDays.map(renderDay)}
      </div>
    </div>
  );
}
