import { useState } from 'react'
import './App.css'
import { HabitProvider } from './contexts/HabitContext'
import HabitList from './components/HabitList'
import HabitDetail from './components/HabitDetail'
import DarkModeToggle from './components/DarkModeToggle'
import Settings from './components/Settings'

function App() {
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [showSettings, setShowSettings] = useState(false);

  return (
    <HabitProvider>
      <div className="app-container">
        <header className="app-header">
          <h1>Habit Tracker</h1>
          <div className="header-actions">
            <button className="btn-settings" onClick={() => setShowSettings(true)}>
              ⚙️
            </button>
            <DarkModeToggle />
          </div>
        </header>
        
        <main className="app-content">
          <HabitList onSelectHabit={setSelectedHabit} />
          
          {selectedHabit && (
            <HabitDetail 
              habit={selectedHabit} 
              onClose={() => setSelectedHabit(null)} 
            />
          )}
          
          {showSettings && (
            <Settings onClose={() => setShowSettings(false)} />
          )}
        </main>
        
        <footer className="app-footer">
          <p>Habit Tracker App - Track your habits and build a better you</p>
        </footer>
      </div>
    </HabitProvider>
  )
}

export default App
