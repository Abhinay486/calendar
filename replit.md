# Minimalistic Calendar PWA

## Overview

This is a frontend-only React Vite application that displays a clean, minimalistic calendar interface. The app has been converted from a full-stack Google Calendar integration to a standalone PWA (Progressive Web App) that can be installed on Android devices.

## User Preferences

Preferred communication style: Simple, everyday language.
Architecture preference: Frontend-only React application with JavaScript (not TypeScript)

## System Architecture

The application follows a modern frontend-only architecture using React and Vite:

### Frontend Architecture
- **React 18** with JavaScript (converted from TypeScript)
- **React Router** for client-side routing
- **Tailwind CSS** with **shadcn/ui** components for styling and UI components
- **Vite** as the build tool and development server
- **PWA** capabilities with service worker for offline functionality

### Key Features
- **Minimalistic Design**: Clean, light color scheme
- **Deuce-style Typography**: Elegant Georgia serif font for calendar dates
- **Sunday Highlighting**: Red color for Sunday dates
- **Mobile-first Design**: Responsive layout with touch-friendly interactions
- **PWA Support**: Installable as Android app with offline capabilities

### Directory Structure
```
├── src/
│   ├── components/      # React components
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utility functions
│   ├── pages/          # Page components
│   └── index.css       # Global styles
├── public/             # Static assets and PWA files
└── vite.config.js      # Vite configuration
```

## Key Components

### Calendar Features
- Monthly calendar grid view with clean design
- Navigation between months (Previous/Next/Today buttons)
- Today's date highlighting with blue background
- Sunday dates highlighted in red as requested
- Centered, bold dates with larger font size
- Deuce-style typography using Georgia serif font

### PWA Features
- Service worker for offline functionality
- App manifest for Android installation
- Touch-friendly interactions (44px minimum touch targets)
- Fullscreen standalone display mode
- Complete icon set for all device sizes

### UI/UX Design
- **shadcn/ui** component library for consistent design
- Responsive layout optimized for mobile and desktop
- Clean, minimalistic interface with light color scheme
- Smooth animations and transitions
- No text selection on mobile for better UX

## Data Flow

1. **Calendar Generation**: Calculate calendar grid based on current month and year
2. **Date Rendering**: Apply appropriate styling for current month, other months, today, and Sundays
3. **PWA Installation**: Detect installation capability and provide install button
4. **Navigation**: Handle month navigation and today navigation
5. **Mobile Optimization**: Responsive design with touch-friendly interactions

## Removed Dependencies

### Previously Used (Now Removed)
- Google Calendar API integration
- Google OAuth 2.0 authentication
- Express.js backend server
- PostgreSQL database
- Drizzle ORM
- TypeScript (converted to JavaScript)

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