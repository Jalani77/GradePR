import { Plus, RotateCcw, Settings, TrendingUp, Award, BookOpen } from 'lucide-react';
import { useGradePilotStore } from '../hooks/usePersistentState';
import { useGradeLogic } from '../hooks/useGradeLogic';
import { CategoryCard } from './CategoryCard';
import { GradeForecast } from './GradeForecast';
import { useState } from 'react';

/**
 * Global Weight Check Bar
 * Shows warning when total weight != 100%
 */
function WeightCheckBar({ totalWeight, isValid }) {
  if (isValid) {
    return (
      <div className="h-1 w-full bg-[#000000]" />
    );
  }

  return (
    <div className="bg-[#E11D48] text-white px-4 py-2 flex items-center justify-between">
      <span className="text-sm font-semibold">
        Weight Check: {totalWeight.toFixed(1)}% — {totalWeight < 100 ? `Missing ${(100 - totalWeight).toFixed(1)}%` : `${(totalWeight - 100).toFixed(1)}% over`}
      </span>
      <span className="text-xs font-medium opacity-80">
        Total should equal 100%
      </span>
    </div>
  );
}

/**
 * Performance Badge Component
 */
function PerformanceBadge({ tier }) {
  const colorMap = {
    green: 'bg-[#05A357] text-white',
    blue: 'bg-[#276EF1] text-white',
    primary: 'bg-[#000000] text-white',
    secondary: 'bg-[#EEEEEE] text-[#545454]',
    error: 'bg-[#E11D48] text-white'
  };

  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded font-black text-sm uppercase tracking-wider ${colorMap[tier.color]}`}>
      <Award size={14} />
      {tier.label}
    </div>
  );
}

/**
 * Stats Card Component
 */
function StatCard({ label, value, suffix = '', subtext, highlight = false }) {
  return (
    <div className="card rounded p-4">
      <div className="text-xs font-semibold text-[#545454] uppercase tracking-wide mb-1">
        {label}
      </div>
      <div className={`font-mono-grades text-3xl font-black ${highlight ? 'text-[#05A357]' : 'text-[#000000]'}`}>
        {value}{suffix}
      </div>
      {subtext && (
        <div className="text-xs text-[#545454] mt-1">{subtext}</div>
      )}
    </div>
  );
}

/**
 * Empty State Component
 */
function EmptyState({ onCreateCategory }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-[#000000] rounded-full flex items-center justify-center mx-auto mb-6">
          <BookOpen size={32} className="text-white" />
        </div>
        <h1 className="text-3xl font-black mb-2">Welcome to GradePilot</h1>
        <p className="text-[#545454] mb-8">
          Your personal grade tracking dashboard. Start by creating your first course category to begin tracking your academic progress.
        </p>
        <button
          onClick={onCreateCategory}
          className="btn-primary rounded inline-flex items-center gap-2"
        >
          <Plus size={16} />
          Create Your First Category
        </button>
      </div>
    </div>
  );
}

/**
 * Settings Modal Component
 */
function SettingsModal({ gradeScale, onScaleChange, onClose, onReset }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded max-w-md w-full p-6">
        <h2 className="text-xl font-black mb-6">Settings</h2>
        
        {/* Grade Scale */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-[#545454] uppercase tracking-wide mb-3">
            Grade Scale Thresholds
          </label>
          <div className="space-y-2">
            {['A', 'B', 'C', 'D'].map(letter => (
              <div key={letter} className="flex items-center gap-3">
                <span className="w-8 font-black">{letter}</span>
                <span className="text-[#545454]">≥</span>
                <input
                  type="number"
                  value={gradeScale[letter]}
                  onChange={(e) => onScaleChange({ ...gradeScale, [letter]: parseFloat(e.target.value) || 0 })}
                  className="flex-1 px-3 py-2 border border-[#EEEEEE] rounded font-mono-grades focus:border-[#000000] focus:outline-none"
                />
                <span className="text-[#545454]">%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reset Data */}
        <div className="border-t border-[#EEEEEE] pt-6 mb-6">
          <label className="block text-xs font-semibold text-[#545454] uppercase tracking-wide mb-3">
            Danger Zone
          </label>
          <button
            onClick={onReset}
            className="w-full py-3 bg-[#E11D48] text-white font-semibold rounded hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <RotateCcw size={14} />
            Reset All Data
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full btn-primary rounded"
        >
          Done
        </button>
      </div>
    </div>
  );
}

/**
 * Main Dashboard Component
 */
export function Dashboard() {
  const {
    categories,
    setCategories,
    targetGrade,
    setTargetGrade,
    gradeScale,
    setGradeScale,
    resetAllData
  } = useGradePilotStore();

  const {
    totalWeight,
    isWeightValid,
    currentGrade,
    currentLetterGrade,
    weightUsed,
    remainingWeight,
    requiredAverage,
    isTargetAchievable,
    performanceTier,
    forecast,
    calculateCategoryGrade
  } = useGradeLogic(categories, targetGrade, gradeScale);

  const [showSettings, setShowSettings] = useState(false);

  // Category CRUD operations
  const handleAddCategory = () => {
    const newCategory = {
      id: `cat_${Date.now()}`,
      name: 'New Category',
      weight: 0,
      assignments: []
    };
    setCategories([...categories, newCategory]);
  };

  const handleUpdateCategory = (index, updatedCategory) => {
    const newCategories = [...categories];
    newCategories[index] = updatedCategory;
    setCategories(newCategories);
  };

  const handleDeleteCategory = (index) => {
    if (window.confirm('Delete this category and all its assignments?')) {
      setCategories(categories.filter((_, i) => i !== index));
    }
  };

  const handleResetAll = () => {
    if (window.confirm('This will delete all your data. Are you sure?')) {
      resetAllData();
      setShowSettings(false);
    }
  };

  // Show empty state if no categories
  if (categories.length === 0) {
    return <EmptyState onCreateCategory={handleAddCategory} />;
  }

  return (
    <div className="min-h-screen bg-[#FFFFFF]">
      {/* Weight Check Bar */}
      <WeightCheckBar totalWeight={totalWeight} isValid={isWeightValid} />

      {/* Header */}
      <header className="border-b border-[#EEEEEE] px-4 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#000000] rounded flex items-center justify-center">
              <TrendingUp size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight">GradePilot</h1>
              <p className="text-xs text-[#545454]">Grade Tracking Dashboard</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <PerformanceBadge tier={performanceTier} />
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 hover:bg-[#EEEEEE] rounded transition-colors"
              aria-label="Settings"
            >
              <Settings size={20} className="text-[#000000]" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Categories */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <StatCard 
                label="Current Grade" 
                value={currentGrade !== null ? currentGrade.toFixed(1) : '—'}
                suffix={currentGrade !== null ? '%' : ''}
                highlight={currentGrade >= 90}
              />
              <StatCard 
                label="Letter Grade" 
                value={currentLetterGrade}
                highlight={currentLetterGrade === 'A'}
              />
              <StatCard 
                label="Weight Used" 
                value={weightUsed.toFixed(0)}
                suffix="%"
                subtext={`${remainingWeight.toFixed(0)}% remaining`}
              />
              <StatCard 
                label="Categories" 
                value={categories.length}
                subtext={`${categories.reduce((sum, c) => sum + (c.assignments?.length || 0), 0)} assignments`}
              />
            </div>

            {/* Categories Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black">Course Categories</h2>
              <button
                onClick={handleAddCategory}
                className="btn-primary rounded text-sm inline-flex items-center gap-2 py-2 px-4"
              >
                <Plus size={14} />
                Add Category
              </button>
            </div>

            {/* Category Cards */}
            <div className="space-y-4">
              {categories.map((category, index) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  onUpdate={(updated) => handleUpdateCategory(index, updated)}
                  onDelete={() => handleDeleteCategory(index)}
                  categoryGrade={calculateCategoryGrade(category)}
                />
              ))}
            </div>
          </div>

          {/* Right Column - Forecast */}
          <div className="space-y-6">
            <GradeForecast
              targetGrade={targetGrade}
              onTargetChange={setTargetGrade}
              requiredAverage={requiredAverage}
              isTargetAchievable={isTargetAchievable}
              currentGrade={currentGrade}
              remainingWeight={remainingWeight}
              forecast={forecast}
              gradeScale={gradeScale}
            />

            {/* Quick Tips */}
            <div className="card rounded p-5">
              <h3 className="text-sm font-black uppercase tracking-wide mb-3">Quick Tips</h3>
              <ul className="space-y-2 text-sm text-[#545454]">
                <li className="flex items-start gap-2">
                  <span className="text-[#000000]">•</span>
                  Click any value to edit inline
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#000000]">•</span>
                  Weights should total 100%
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#000000]">•</span>
                  Leave scores blank for ungraded work
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#000000]">•</span>
                  All data saves automatically
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal
          gradeScale={gradeScale}
          onScaleChange={setGradeScale}
          onClose={() => setShowSettings(false)}
          onReset={handleResetAll}
        />
      )}
    </div>
  );
}

export default Dashboard;
