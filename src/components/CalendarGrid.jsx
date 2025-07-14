import { useState, useEffect } from 'react';

export function CalendarGrid({ currentDate }) {
  // Get start and end of the month
  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  
  // Get the first day of the week for the calendar grid
  const startOfCalendar = new Date(startOfMonth);
  startOfCalendar.setDate(startOfCalendar.getDate() - startOfCalendar.getDay());
  
  // Get the last day of the week for the calendar grid
  const endOfCalendar = new Date(endOfMonth);
  endOfCalendar.setDate(endOfCalendar.getDate() + (6 - endOfCalendar.getDay()));

  // Generate calendar days
  const calendarDays = [];
  const current = new Date(startOfCalendar);
  const today = new Date();
  
  while (current <= endOfCalendar) {
    calendarDays.push({
      date: new Date(current),
      dayNumber: current.getDate(),
      isCurrentMonth: current.getMonth() === currentDate.getMonth(),
      isToday: current.toDateString() === today.toDateString(),
      isSunday: current.getDay() === 0,
    });
    
    current.setDate(current.getDate() + 1);
  }

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const renderDay = (day) => {
    let cellClasses = 'h-16 md:h-24 border-r border-b border-light flex items-center justify-center transition-colors ';
    
    if (!day.isCurrentMonth) {
      cellClasses += 'calendar-cell-other-month ';
    } else if (day.isToday) {
      cellClasses += 'calendar-cell-today ';
    } else if (day.isSunday) {
      cellClasses += 'calendar-cell-sunday ';
    } else {
      cellClasses += 'calendar-cell-regular ';
    }

    let textClasses = 'text-2xl md:text-xl font-bold calendar-date ';
    if (!day.isCurrentMonth) {
      textClasses += 'text-gray-400';
    } else if (day.isSunday) {
      textClasses += 'text-sunday';
    } else {
      textClasses += 'text-primary-calendar';
    }

    if (day.isToday) {
      textClasses += ' text-blue-800';
    }

    return (
      <div key={day.date.toISOString()} className={`${cellClasses} no-select touch-friendly`}>
        <span className={textClasses}>
          {day.dayNumber}
        </span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Days of Week Header */}
      <div className="grid grid-cols-7 border-b border-light">
        {weekDays.map((day, index) => (
          <div
            key={day}
            className={`p-2 md:p-4 text-center text-xs md:text-sm font-medium ${
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