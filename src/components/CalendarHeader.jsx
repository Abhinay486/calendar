import { Button } from './ui/button';
import { ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { usePWA } from '../hooks/usePWA';

export function CalendarHeader({
  currentDate,
  onPreviousMonth,
  onNextMonth,
  onGoToToday,
}) {
  const { isInstallable, isInstalled, installApp } = usePWA();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentMonthYear = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

  return (
    <div className="bg-white rounded-lg shadow-sm mb-4 p-4 md:p-6 md:mb-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-4">
        <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-y-0 md:space-x-4">
          <h1 className="text-xl md:text-2xl font-semibold text-primary-calendar">Calendar</h1>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-gray-400" />
            <span className="text-xs md:text-sm text-secondary-calendar">
              Frontend Only
            </span>
          </div>
        </div>
        
        <div className="flex space-x-2">
          {isInstallable && !isInstalled && (
            <Button
              variant="outline"
              onClick={installApp}
              className="flex items-center space-x-2 text-xs md:text-sm"
              size="sm"
            >
              <Download className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Install App</span>
            </Button>
          )}
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={onPreviousMonth}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 md:w-4 md:h-4 text-secondary-calendar" />
        </Button>
        
        <div className="flex items-center space-x-2 md:space-x-4">
          <h2 className="text-lg md:text-xl font-medium text-primary-calendar">
            {currentMonthYear}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onGoToToday}
            className="text-xs md:text-sm text-secondary-calendar hover:text-primary-calendar transition-colors px-2 py-1"
          >
            Today
          </Button>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onNextMonth}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ChevronRight className="w-5 h-5 md:w-4 md:h-4 text-secondary-calendar" />
        </Button>
      </div>
    </div>
  );
}