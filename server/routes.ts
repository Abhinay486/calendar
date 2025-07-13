import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { googleCalendarService } from "./services/google-calendar";
import { insertGoogleTokenSchema, insertCalendarEventSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Google OAuth routes
  app.get("/api/auth/google", async (req, res) => {
    try {
      const authUrl = googleCalendarService.getAuthUrl();
      res.json({ authUrl });
    } catch (error) {
      console.error('Error generating auth URL:', error);
      res.status(500).json({ message: "Failed to generate authentication URL" });
    }
  });

  app.get("/api/auth/google/callback", async (req, res) => {
    try {
      const { code, error } = req.query;

      if (error) {
        return res.status(400).json({ message: `Authentication failed: ${error}` });
      }

      if (!code) {
        return res.status(400).json({ message: "Authorization code is required" });
      }

      const tokens = await googleCalendarService.getTokens(code as string);
      
      if (!tokens.access_token) {
        return res.status(400).json({ message: "Failed to obtain access token" });
      }

      // Get user info to identify the user
      const userInfo = await googleCalendarService.getUserInfo(tokens.access_token);
      
      // For demo purposes, create a user with email as username
      // In production, you'd have proper user management
      let user = await storage.getUserByUsername(userInfo.email!);
      if (!user) {
        user = await storage.createUser({
          username: userInfo.email!,
          password: '', // OAuth user, no password needed
        });
      }

      // Save the tokens
      await storage.saveGoogleToken({
        userId: user.id,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token || '',
        expiresAt: new Date(Date.now() + (tokens.expiry_date || 3600000)),
        tokenType: tokens.token_type || 'Bearer',
      });

      // Redirect to frontend with success
      res.redirect('/?auth=success');
    } catch (error) {
      console.error('OAuth callback error:', error);
      res.redirect('/?auth=error');
    }
  });

  // Get authentication status
  app.get("/api/auth/status", async (req, res) => {
    try {
      // For demo purposes, get the first user with tokens
      // In production, you'd use session management
      const users = await storage.getUserByUsername('demo@example.com');
      if (!users) {
        return res.json({ isAuthenticated: false });
      }

      const token = await storage.getGoogleToken(users.id);
      res.json({ 
        isAuthenticated: !!token,
        user: token ? { id: users.id, email: users.username } : null
      });
    } catch (error) {
      console.error('Error checking auth status:', error);
      res.status(500).json({ message: "Failed to check authentication status" });
    }
  });

  // Get calendar events
  app.get("/api/calendar/events", async (req, res) => {
    try {
      const { start, end } = req.query;

      if (!start || !end) {
        return res.status(400).json({ message: "Start and end dates are required" });
      }

      // Get first authenticated user (demo purposes)
      const users = await storage.getUserByUsername('demo@example.com');
      if (!users) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const token = await storage.getGoogleToken(users.id);
      if (!token) {
        return res.status(401).json({ message: "Google Calendar not connected" });
      }

      // Check if token is expired and refresh if needed
      if (token.expiresAt < new Date()) {
        if (!token.refreshToken) {
          await storage.deleteGoogleToken(users.id);
          return res.status(401).json({ message: "Token expired and no refresh token available" });
        }

        try {
          const newTokens = await googleCalendarService.refreshAccessToken(token.refreshToken);
          if (newTokens.access_token) {
            await storage.updateGoogleToken(users.id, {
              accessToken: newTokens.access_token,
              expiresAt: new Date(Date.now() + (newTokens.expiry_date || 3600000)),
            });
            token.accessToken = newTokens.access_token;
          }
        } catch (refreshError) {
          console.error('Error refreshing token:', refreshError);
          await storage.deleteGoogleToken(users.id);
          return res.status(401).json({ message: "Failed to refresh authentication token" });
        }
      }

      const startDate = new Date(start as string);
      const endDate = new Date(end as string);

      // Fetch events from Google Calendar
      const googleEvents = await googleCalendarService.getCalendarEvents(
        token.accessToken,
        startDate,
        endDate
      );

      // Add userId to events
      const eventsWithUserId = googleEvents.map(event => ({
        ...event,
        userId: users.id,
      }));

      // Sync with local storage
      await storage.syncCalendarEvents(users.id, eventsWithUserId);

      // Get events from local storage
      const events = await storage.getCalendarEvents(users.id, startDate, endDate);

      res.json(events);
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      res.status(500).json({ message: "Failed to fetch calendar events" });
    }
  });

  // Disconnect Google Calendar
  app.delete("/api/auth/google", async (req, res) => {
    try {
      // Get first authenticated user (demo purposes)
      const users = await storage.getUserByUsername('demo@example.com');
      if (!users) {
        return res.json({ success: true });
      }

      await storage.deleteGoogleToken(users.id);
      res.json({ success: true });
    } catch (error) {
      console.error('Error disconnecting Google Calendar:', error);
      res.status(500).json({ message: "Failed to disconnect Google Calendar" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
