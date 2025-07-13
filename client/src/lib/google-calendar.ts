import { apiRequest } from './queryClient';

export interface AuthStatus {
  isAuthenticated: boolean;
  user?: {
    id: number;
    email: string;
  };
}

export interface CalendarEvent {
  id: number;
  googleEventId: string;
  summary: string;
  description: string;
  startDateTime: string;
  endDateTime: string;
  location: string;
  color: string;
  isAllDay: boolean;
}

export const googleCalendarApi = {
  async getAuthUrl(): Promise<{ authUrl: string }> {
    const res = await apiRequest('GET', '/api/auth/google');
    return res.json();
  },

  async getAuthStatus(): Promise<AuthStatus> {
    const res = await apiRequest('GET', '/api/auth/status');
    return res.json();
  },

  async getEvents(startDate: Date, endDate: Date): Promise<CalendarEvent[]> {
    const params = new URLSearchParams({
      start: startDate.toISOString(),
      end: endDate.toISOString(),
    });
    
    const res = await apiRequest('GET', `/api/calendar/events?${params}`);
    return res.json();
  },

  async disconnect(): Promise<{ success: boolean }> {
    const res = await apiRequest('DELETE', '/api/auth/google');
    return res.json();
  },
};
