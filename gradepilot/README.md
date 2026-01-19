# GradePilot Dashboard

A comprehensive grade tracking dashboard built with React, Vite, and Tailwind CSS, following the Uber "Base" design system principles.

## Features

### Grade Forecast Engine
- **What-If Calculator**: Enter a target grade and see the exact average required on remaining assignments
- **Grade Range Projection**: Visual display of best/worst case scenarios
- **Achievability Indicator**: Shows whether your target is reachable given remaining weight

### Category Management
- Create course categories (e.g., Midterms - 30%, Finals - 40%)
- Expandable assignment lists within each category
- **Inline Editing**: Click any name, weight, or grade to edit immediately
- Assignment CRUD operations with automatic grade calculations

### Visual Analytics
- **Global Weight Check Bar**: Black bar at top turns red if weights don't total 100%
- **Performance Badge**: Status indicators like "A-TIER", "STABLE", "AT RISK"
- **Real-time Statistics**: Current grade, letter grade, weight used, category count

### Persistence Layer
- All data syncs to localStorage automatically
- Categories, assignments, targets, and grade scale settings persist
- Reset all data option in settings

## Design System

Following Uber "Base" style guidelines:
- **Fonts**: Inter (or System UI fallback), monospace for numerical grades
- **Colors**:
  - Background: `#FFFFFF`
  - Primary Text: `#000000`
  - Secondary Text: `#545454`
  - Borders: `#EEEEEE`
  - Uber Blue: `#276EF1` (progress indicators)
  - Uber Green: `#05A357` (A grades)
- **Borders**: Strict 1px solid, sharp corners (0-4px radius)
- **No soft shadows**: High contrast, bold typography

## Tech Stack

- **Framework**: React 19 with Vite
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React (16px, black/white only)
- **State**: Custom `usePersistentState` hook with localStorage sync

## Project Structure

```
src/
├── hooks/
│   ├── usePersistentState.js  # localStorage sync hook
│   └── useGradeLogic.js       # Grade calculation math
├── components/
│   ├── Dashboard.jsx          # Main layout with sidebar/stats
│   ├── CategoryCard.jsx       # Course category list items
│   └── GradeForecast.jsx      # What-If calculator module
├── App.jsx                    # Root component
├── main.jsx                   # Entry point
└── index.css                  # Tailwind + Uber Base styles
```

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Grade Calculation Logic

### Weighted Average
```
currentGrade = Σ(categoryGrade × categoryWeight) / Σ(usedWeights)
```

### Forecast Formula
```
requiredAverage = (targetGrade - pointsEarned) / remainingWeight × 100
```

Where:
- `pointsEarned` = sum of (categoryGrade × weight / 100) for graded categories
- `remainingWeight` = 100 - sum of weights for categories with grades

## Responsive Design

- **Desktop**: Split view with categories on left, forecast on right
- **Mobile**: Stacked cards, full-width layout
- Breakpoint: `lg` (1024px)

## No External Dependencies

This application is completely standalone:
- No AI APIs
- No external backends
- All data stored locally in the browser

## License

MIT
