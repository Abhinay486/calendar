// Public holidays data - you can customize this for your country
interface Holiday {
  date: string; // YYYY-MM-DD format
  name: string;
  type: 'national' | 'religious' | 'public';
}

// Common US holidays for 2024-2025 (you can modify for your country)
const holidays2024: Holiday[] = [
  { date: '2024-01-01', name: 'New Year\'s Day', type: 'national' },
  { date: '2024-01-15', name: 'Martin Luther King Jr. Day', type: 'national' },
  { date: '2024-02-19', name: 'Presidents\' Day', type: 'national' },
  { date: '2024-05-27', name: 'Memorial Day', type: 'national' },
  { date: '2024-06-19', name: 'Juneteenth', type: 'national' },
  { date: '2024-07-04', name: 'Independence Day', type: 'national' },
  { date: '2024-09-02', name: 'Labor Day', type: 'national' },
  { date: '2024-10-14', name: 'Columbus Day', type: 'national' },
  { date: '2024-11-11', name: 'Veterans Day', type: 'national' },
  { date: '2024-11-28', name: 'Thanksgiving', type: 'national' },
  { date: '2024-12-25', name: 'Christmas Day', type: 'religious' },
];

const holidays2025: Holiday[] = [
  { date: '2025-01-01', name: 'New Year\'s Day', type: 'national' },
  { date: '2025-01-20', name: 'Martin Luther King Jr. Day', type: 'national' },
  { date: '2025-02-17', name: 'Presidents\' Day', type: 'national' },
  { date: '2025-05-26', name: 'Memorial Day', type: 'national' },
  { date: '2025-06-19', name: 'Juneteenth', type: 'national' },
  { date: '2025-07-04', name: 'Independence Day', type: 'national' },
  { date: '2025-09-01', name: 'Labor Day', type: 'national' },
  { date: '2025-10-13', name: 'Columbus Day', type: 'national' },
  { date: '2025-11-11', name: 'Veterans Day', type: 'national' },
  { date: '2025-11-27', name: 'Thanksgiving', type: 'national' },
  { date: '2025-12-25', name: 'Christmas Day', type: 'religious' },
];

const allHolidays = [...holidays2024, ...holidays2025];

export function isHoliday(date: Date): Holiday | null {
  const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD format
  return allHolidays.find(holiday => holiday.date === dateString) || null;
}

export function getHolidaysForMonth(year: number, month: number): Holiday[] {
  const monthStr = (month + 1).toString().padStart(2, '0');
  const yearStr = year.toString();
  
  return allHolidays.filter(holiday => {
    return holiday.date.startsWith(`${yearStr}-${monthStr}`);
  });
}

export function isPublicHoliday(date: Date): boolean {
  const holiday = isHoliday(date);
  return holiday !== null && (holiday.type === 'national' || holiday.type === 'public');
}