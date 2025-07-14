import { useState } from 'react';
import { CalendarHeader } from '../components/CalendarHeader';
import { CalendarGrid } from '../components/CalendarGrid';

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());

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
    <div className="min-h-screen py-4 md:py-8 px-2 md:px-4 bg-calendar">
      <div className="max-w-4xl mx-auto">
        <CalendarHeader
          currentDate={currentDate}
          onPreviousMonth={handlePreviousMonth}
          onNextMonth={handleNextMonth}
          onGoToToday={handleGoToToday}
        />
        
        <CalendarGrid currentDate={currentDate} />
      </div>
    </div>
  );
}