import { useState, useEffect } from 'react';
import { CalendarHeader } from '@/components/calendar-header';
import { CalendarGrid } from '@/components/calendar-grid';
import { EventsPanel } from '@/components/events-panel';
import { useToast } from '@/hooks/use-toast';

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { toast } = useToast();

  // Check for authentication success/error in URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authStatus = urlParams.get('auth');
    
    if (authStatus === 'success') {
      toast({
        title: "Success",
        description: "Successfully connected to Google Calendar",
      });
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (authStatus === 'error') {
      toast({
        title: "Error",
        description: "Failed to connect to Google Calendar",
        variant: "destructive",
      });
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [toast]);

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleGoToToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <div className="min-h-screen py-8 px-4 bg-calendar">
      <div className="max-w-4xl mx-auto">
        <CalendarHeader
          currentDate={currentDate}
          onPreviousMonth={handlePreviousMonth}
          onNextMonth={handleNextMonth}
          onGoToToday={handleGoToToday}
        />
        
        <CalendarGrid currentDate={currentDate} />
        
        <EventsPanel currentDate={currentDate} />
      </div>
    </div>
  );
}
