import { users, googleTokens, calendarEvents, type User, type InsertUser, type GoogleToken, type InsertGoogleToken, type CalendarEvent, type InsertCalendarEvent } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Google Token operations
  getGoogleToken(userId: number): Promise<GoogleToken | undefined>;
  saveGoogleToken(token: InsertGoogleToken): Promise<GoogleToken>;
  updateGoogleToken(userId: number, token: Partial<InsertGoogleToken>): Promise<GoogleToken | undefined>;
  deleteGoogleToken(userId: number): Promise<boolean>;
  
  // Calendar Events operations
  getCalendarEvents(userId: number, startDate: Date, endDate: Date): Promise<CalendarEvent[]>;
  saveCalendarEvent(event: InsertCalendarEvent): Promise<CalendarEvent>;
  updateCalendarEvent(googleEventId: string, event: Partial<InsertCalendarEvent>): Promise<CalendarEvent | undefined>;
  deleteCalendarEvent(googleEventId: string): Promise<boolean>;
  syncCalendarEvents(userId: number, events: InsertCalendarEvent[]): Promise<CalendarEvent[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private googleTokens: Map<number, GoogleToken>;
  private calendarEvents: Map<string, CalendarEvent>;
  private currentUserId: number;
  private currentTokenId: number;
  private currentEventId: number;

  constructor() {
    this.users = new Map();
    this.googleTokens = new Map();
    this.calendarEvents = new Map();
    this.currentUserId = 1;
    this.currentTokenId = 1;
    this.currentEventId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getGoogleToken(userId: number): Promise<GoogleToken | undefined> {
    return this.googleTokens.get(userId);
  }

  async saveGoogleToken(token: InsertGoogleToken): Promise<GoogleToken> {
    const id = this.currentTokenId++;
    const googleToken: GoogleToken = { ...token, id };
    this.googleTokens.set(token.userId, googleToken);
    return googleToken;
  }

  async updateGoogleToken(userId: number, token: Partial<InsertGoogleToken>): Promise<GoogleToken | undefined> {
    const existing = this.googleTokens.get(userId);
    if (!existing) return undefined;
    
    const updated: GoogleToken = { ...existing, ...token };
    this.googleTokens.set(userId, updated);
    return updated;
  }

  async deleteGoogleToken(userId: number): Promise<boolean> {
    return this.googleTokens.delete(userId);
  }

  async getCalendarEvents(userId: number, startDate: Date, endDate: Date): Promise<CalendarEvent[]> {
    return Array.from(this.calendarEvents.values()).filter(
      (event) => 
        event.userId === userId &&
        event.startDateTime >= startDate &&
        event.startDateTime <= endDate
    );
  }

  async saveCalendarEvent(event: InsertCalendarEvent): Promise<CalendarEvent> {
    const id = this.currentEventId++;
    const calendarEvent: CalendarEvent = { 
      ...event, 
      id,
      lastSynced: new Date()
    };
    this.calendarEvents.set(event.googleEventId, calendarEvent);
    return calendarEvent;
  }

  async updateCalendarEvent(googleEventId: string, event: Partial<InsertCalendarEvent>): Promise<CalendarEvent | undefined> {
    const existing = this.calendarEvents.get(googleEventId);
    if (!existing) return undefined;
    
    const updated: CalendarEvent = { 
      ...existing, 
      ...event,
      lastSynced: new Date()
    };
    this.calendarEvents.set(googleEventId, updated);
    return updated;
  }

  async deleteCalendarEvent(googleEventId: string): Promise<boolean> {
    return this.calendarEvents.delete(googleEventId);
  }

  async syncCalendarEvents(userId: number, events: InsertCalendarEvent[]): Promise<CalendarEvent[]> {
    const savedEvents: CalendarEvent[] = [];
    
    for (const event of events) {
      const existing = this.calendarEvents.get(event.googleEventId);
      if (existing) {
        const updated = await this.updateCalendarEvent(event.googleEventId, event);
        if (updated) savedEvents.push(updated);
      } else {
        const saved = await this.saveCalendarEvent(event);
        savedEvents.push(saved);
      }
    }
    
    return savedEvents;
  }
}

export const storage = new MemStorage();
