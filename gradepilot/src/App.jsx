import { Dashboard } from './components/Dashboard';

/**
 * GradePilot - Grade Tracking Dashboard
 * 
 * Built with:
 * - React (Vite)
 * - Tailwind CSS
 * - Uber "Base" Design System
 * - Local-first state management with localStorage persistence
 * 
 * Features:
 * - Grade Forecast Engine (What-If Calculator)
 * - Category Management with inline editing
 * - Visual Analytics (weight check, performance badges)
 * - Persistent localStorage data
 */
function App() {
  return (
    <div className="antialiased">
      <Dashboard />
    </div>
  );
}

export default App;
