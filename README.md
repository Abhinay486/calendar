# 📅 Minimalist Calendar

A modern, sleek, and responsive calendar application built with React and Vite. Features a clean minimalist design with glassmorphism effects and smooth animations.

![Calendar Preview](public/icons/calendar-icon.svg)

## ✨ Features

- **Modern UI/UX**: Clean, minimalist design with glassmorphism effects
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Progressive Web App (PWA)**: Install as a native app on any device
- **Month Navigation**: Easy navigation between months with smooth transitions
- **Today Highlighting**: Current date is prominently highlighted
- **Sunday Emphasis**: Special styling for Sundays
- **Touch-Friendly**: Optimized for touch interactions on mobile devices
- **Fast Performance**: Built with Vite for lightning-fast development and builds

## 🚀 Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS with custom design system
- **Icons**: Lucide React
- **UI Components**: Radix UI primitives
- **Build Tool**: Vite
- **Mobile**: Capacitor for native app deployment
- **PWA**: Service Worker for offline functionality

## 📱 Installation & Setup

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd MinimalistCalendar
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 🎨 Design System

### Color Palette
- **Light Gray**: `#F2F2F2` - Primary background
- **Warm Beige**: `#EAE4D5` - Secondary background
- **Muted Brown**: `#B6B09F` - Accent color
- **Black**: `#000000` - Text and primary elements

### Typography
- **Primary Font**: Inter (System fonts fallback)
- **Display Font**: SF Pro Display (System fonts fallback)

### Components
- Glassmorphism cards with backdrop blur
- Smooth hover animations
- Modern button styles with elevation
- Responsive grid layout

## 📂 Project Structure

```
MinimalistCalendar/
├── public/
│   ├── icons/          # App icons and assets
│   ├── manifest.json   # PWA manifest
│   └── sw.js          # Service worker
├── src/
│   ├── components/
│   │   ├── ui/        # Reusable UI components
│   │   ├── CalendarGrid.jsx
│   │   └── CalendarHeader.jsx
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Utility functions
│   ├── pages/         # Page components
│   ├── App.jsx        # Main app component
│   ├── index.css      # Global styles
│   └── main.jsx       # App entry point
├── capacitor.config.ts # Mobile app config
├── tailwind.config.js  # Tailwind configuration
└── vite.config.js     # Vite configuration
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run check` - TypeScript type checking

## 📱 PWA Features

- **Installable**: Can be installed as a native app
- **Offline Ready**: Works offline with service worker
- **App-like Experience**: Full-screen mode, splash screen
- **Cross-Platform**: Works on iOS, Android, and Desktop

## 🎯 Usage

### Navigation
- **Previous/Next Buttons**: Navigate between months
- **Today Button**: Jump to current date
- **Month Display**: Shows current month and year

### Mobile Experience
- Touch-friendly interface
- Optimized for small screens
- Swipe gestures (future enhancement)

## 🛠️ Customization

### Updating Colors
Edit the CSS custom properties in `src/index.css`:

```css
:root {
  --calendar-bg: #F2F2F2;
  --text-primary: #000000;
  --accent-color: #B6B09F;
  /* ... other variables */
}
```

### Adding Features
- Event management
- Multiple calendar views
- Integration with calendar APIs
- Dark mode support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Radix UI](https://www.radix-ui.com/) for accessible UI primitives
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [Lucide](https://lucide.dev/) for beautiful icons
- [Vite](https://vitejs.dev/) for fast build tooling

## 📞 Support

If you have any questions or need help, please open an issue in the repository.

---

Made with ❤️ and modern web technologies