import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const googleTokens = pgTable("google_tokens", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  accessToken: text("access_token").notNull(),
  refreshToken: text("refresh_token"),
  expiresAt: timestamp("expires_at").notNull(),
  tokenType: text("token_type").default("Bearer"),
});

export const calendarEvents = pgTable("calendar_events", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  googleEventId: text("google_event_id").notNull(),
  summary: text("summary").notNull(),
  description: text("description"),
  startDateTime: timestamp("start_date_time").notNull(),
  endDateTime: timestamp("end_date_time").notNull(),
  location: text("location"),
  color: text("color"),
  isAllDay: boolean("is_all_day").default(false),
  lastSynced: timestamp("last_synced").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertGoogleTokenSchema = createInsertSchema(googleTokens).omit({
  id: true,
});

export const insertCalendarEventSchema = createInsertSchema(calendarEvents).omit({
  id: true,
  lastSynced: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type GoogleToken = typeof googleTokens.$inferSelect;
export type InsertGoogleToken = z.infer<typeof insertGoogleTokenSchema>;
export type CalendarEvent = typeof calendarEvents.$inferSelect;
export type InsertCalendarEvent = z.infer<typeof insertCalendarEventSchema>;
