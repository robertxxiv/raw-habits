# Habit Tracker App

A modern habit tracking application with visualization features built with React.

## Features

### Core Features

- **Habit Management**
  - Create, edit, and delete habits
  - Customize habits with colors and icons

- **Daily Tracking**
  - Mark habits as complete with a single click
  - Track multiple habits simultaneously

- **Visualization**
  - Calendar heatmap (like GitHub contributions) for each habit
  - Streak counters (current streak, longest streak)
  - Weekly and monthly completion percentages
  - Bar chart showing weekly completion rates

- **Persistence**
  - Data stored in browser localStorage
  - No authentication or backend required

### Additional Features

- **Dark Mode**
  - Toggle between light and dark themes
  - Preference saved across sessions

- **Import/Export**
  - Export all data as JSON for backup
  - Import data from previously exported files

## Technical Details

- **Frontend Framework**: React with Vite
- **Visualization Library**: Recharts for charts and visualizations
- **State Management**: React Context API for global state
- **Storage**: LocalStorage with JSON structure
- **UI**: Responsive and mobile-friendly design

## Project Structure

```
src/
├── components/         # React components
│   ├── HabitList.jsx   # Main habits list
│   ├── HabitForm.jsx   # Create/edit habit form
│   ├── HabitItem.jsx   # Individual habit card
│   ├── HabitDetail.jsx # Detailed view with visualizations
│   ├── HabitCalendar.jsx # Calendar heatmap component
│   ├── DarkModeToggle.jsx # Dark mode functionality
│   └── Settings.jsx    # Settings panel (import/export)
├── contexts/
│   └── HabitContext.jsx # Global state management
├── utils/
│   ├── dateUtils.js    # Date formatting utilities
│   └── exportImport.js # Data import/export utilities
└── App.jsx             # Main application component
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Run the development server:
   ```
   npm run dev
   ```
4. Open http://localhost:5173 in your browser

## Usage

1. **Creating a Habit**: Click the "+ New Habit" button and fill in the details
2. **Tracking a Habit**: Click the "Mark Complete" button on a habit card
3. **Viewing Stats**: Click on a habit name or the "View Stats" button
4. **Managing Habits**: Use the edit button to modify or delete habits
5. **Import/Export**: Access via the settings (gear icon) in the header
6. **Dark Mode**: Toggle using the moon/sun icon in the header

## License

MIT
