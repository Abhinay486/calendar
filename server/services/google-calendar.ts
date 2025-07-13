import { google } from 'googleapis';
import type { InsertCalendarEvent } from '@shared/schema';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5000/api/auth/google/callback';

export class GoogleCalendarService {
  private oauth2Client;

  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET,
      GOOGLE_REDIRECT_URI
    );
  }

  getAuthUrl(state?: string): string {
    const scopes = [
      'https://www.googleapis.com/auth/calendar.readonly',
      'https://www.googleapis.com/auth/userinfo.email'
    ];

    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      state: state,
    });
  }

  async getTokens(code: string) {
    const { tokens } = await this.oauth2Client.getToken(code);
    return tokens;
  }

  async refreshAccessToken(refreshToken: string) {
    this.oauth2Client.setCredentials({
      refresh_token: refreshToken,
    });

    const { credentials } = await this.oauth2Client.refreshAccessToken();
    return credentials;
  }

  async getCalendarEvents(accessToken: string, timeMin: Date, timeMax: Date): Promise<InsertCalendarEvent[]> {
    this.oauth2Client.setCredentials({
      access_token: accessToken,
    });

    const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });

    try {
      const response = await calendar.events.list({
        calendarId: 'primary',
        timeMin: timeMin.toISOString(),
        timeMax: timeMax.toISOString(),
        singleEvents: true,
        orderBy: 'startTime',
        maxResults: 250,
      });

      const events = response.data.items || [];
      
      return events.map((event): InsertCalendarEvent => ({
        userId: 0, // Will be set by the caller
        googleEventId: event.id!,
        summary: event.summary || 'Untitled Event',
        description: event.description || '',
        startDateTime: new Date(event.start?.dateTime || event.start?.date || ''),
        endDateTime: new Date(event.end?.dateTime || event.end?.date || ''),
        location: event.location || '',
        color: event.colorId || '',
        isAllDay: !event.start?.dateTime, // All-day events don't have dateTime
      }));
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      throw new Error('Failed to fetch calendar events');
    }
  }

  async getUserInfo(accessToken: string) {
    this.oauth2Client.setCredentials({
      access_token: accessToken,
    });

    const oauth2 = google.oauth2({ version: 'v2', auth: this.oauth2Client });
    const response = await oauth2.userinfo.get();
    return response.data;
  }
}

export const googleCalendarService = new GoogleCalendarService();
