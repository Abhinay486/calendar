# Google Calendar Integration App

## Overview

This is a full-stack web application that integrates with Google Calendar to display and manage calendar events. The app provides a clean, modern calendar interface where users can authenticate with Google, view their calendar events, and navigate through different months.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a modern full-stack architecture with a clear separation between frontend and backend concerns:

### Frontend Architecture
- **React 18** with TypeScript for the user interface
- **Wouter** for client-side routing (lightweight alternative to React Router)
- **Tailwind CSS** with **shadcn/ui** components for styling and UI components
- **TanStack Query** for server state management and API caching
- **Vite** as the build tool and development server

### Backend Architecture
- **Express.js** server with TypeScript
- **RESTful API** design for client-server communication
- **Google OAuth 2.0** integration for authentication
- **Google Calendar API** integration for calendar data
- **Drizzle ORM** with PostgreSQL for data persistence

### Directory Structure
```
├── client/           # Frontend React application
├── server/           # Backend Express server
├── shared/           # Shared types and schemas
└── migrations/       # Database migration files
```

## Key Components

### Authentication System
- **Google OAuth 2.0** flow implementation
- Token management with automatic refresh
- User session handling
- Secure credential storage in PostgreSQL

### Calendar Features
- Monthly calendar grid view
- Event display with color coding
- Navigation between months
- Today's date highlighting
- Upcoming events panel

### Data Management
- **Drizzle ORM** for type-safe database operations
- PostgreSQL database with proper schema design
- Event synchronization with Google Calendar
- Efficient caching with TanStack Query

### UI/UX Design
- **shadcn/ui** component library for consistent design
- Responsive layout that works on desktop and mobile
- Clean, modern interface with proper accessibility
- Toast notifications for user feedback

## Data Flow

1. **Authentication Flow**: User clicks connect → redirected to Google OAuth → callback with auth code → exchange for tokens → store in database
2. **Calendar Data**: Fetch events from Google Calendar API → store/sync in local database → serve to frontend
3. **Real-time Updates**: Frontend polls for changes using TanStack Query's background refetching
4. **Error Handling**: Comprehensive error boundaries and user-friendly error messages

## External Dependencies

### Google Services
- **Google Calendar API** for calendar data
- **Google OAuth 2.0** for authentication
- **Google People API** for user information

### Database
- **PostgreSQL** via Neon Database (serverless)
- **Drizzle ORM** for database operations
- **Drizzle Kit** for migrations

### Key Libraries
- **@neondatabase/serverless** for PostgreSQL connection
- **googleapis** for Google API integration
- **@tanstack/react-query** for state management
- **@radix-ui** components via shadcn/ui
- **date-fns** for date manipulation

## Deployment Strategy

### Development Setup
- **tsx** for running TypeScript server in development
- **Vite** dev server for frontend with HMR
- Environment variables for API keys and database URL
- **Replit** integration with cartographer for development

### Production Build
- **esbuild** for server bundling
- **Vite** for frontend optimization
- Static file serving from Express
- Database migrations via Drizzle Kit

### Environment Configuration
- `DATABASE_URL` for PostgreSQL connection
- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` for OAuth
- `GOOGLE_REDIRECT_URI` for OAuth callback
- Separate development and production configurations

The application is designed to be deployed on platforms like Replit, Vercel, or similar, with PostgreSQL database hosting on Neon or similar serverless database providers.