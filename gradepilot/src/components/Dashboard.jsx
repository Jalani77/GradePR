import { Plus, RotateCcw, Settings, TrendingUp, Award, BookOpen, Info, Target, BarChart3, Zap } from 'lucide-react';
import { useGradePilotStore } from '../hooks/usePersistentState';
import { useGradeLogic } from '../hooks/useGradeLogic';
import { CategoryCard } from './CategoryCard';
import { GradeForecast } from './GradeForecast';
import { useState } from 'react';

/**
 * Setup Progress Card
 * Shows when total weight < 100%, uses a soft info theme instead of red error bar
 */
function SetupProgressCard({ totalWeight, isValid }) {
  if (isValid) return null;

  const progress = Math.min(totalWeight, 100);
  const missing = 100 - totalWeight;
  const isOver = totalWeight > 100;

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 mb-6">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Info size={18} className="text-amber-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-bold text-amber-900 mb-1">Setup Progress</h3>
          <p className="text-sm text-amber-700 mb-3">
            {isOver
              ? `Your category weights total ${totalWeight.toFixed(1)}% — that's ${(totalWeight - 100).toFixed(1)}% over. Adjust weights so they add up to 100%.`
              : `Your category weights total ${totalWeight.toFixed(1)}%. Add ${missing.toFixed(1)}% more weight to complete your course setup.`
            }
          </p>
          {/* Progress bar */}
          <div className="h-2 bg-amber-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${isOver ? 'bg-amber-500' : 'bg-amber-400'}`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-xs text-amber-600 font-medium">{totalWeight.toFixed(0)}% assigned</span>
            <span className="text-xs text-amber-600 font-medium">100% goal</span>
          </div>
        </div>
      </div>
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
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-black text-sm uppercase tracking-wider ${colorMap[tier.color]}`}>
      <Award size={14} />
      {tier.label}
    </div>
  );
}

/**
 * Mini Sparkline SVG for grade trend visualization
 */
function MiniSparkline({ value, size = 80 }) {
  if (value === null) return null;
  
  // Generate a simple arc / progress ring
  const radius = (size - 8) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(Math.max(value / 100, 0), 1);
  const offset = circumference * (1 - progress);

  return (
    <svg width={size} height={size} className="absolute inset-0 m-auto opacity-15">
      {/* Background ring */}
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        opacity="0.2"
      />
      {/* Progress ring */}
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`}
        className="transition-all duration-700"
      />
    </svg>
  );
}

/**
 * Enhanced Current Grade Card with large text and progress ring
 */
function CurrentGradeCard({ currentGrade, currentLetterGrade }) {
  const highlight = currentGrade !== null && currentGrade >= 90;

  return (
    <div className="card rounded-xl p-5 relative overflow-hidden col-span-2 sm:col-span-2 lg:col-span-1">
      <MiniSparkline value={currentGrade} size={100} />
      <div className="relative z-10">
        <div className="text-xs font-semibold text-[#545454] uppercase tracking-wide mb-1">
          Current Grade
        </div>
        <div className={`font-mono-grades text-5xl font-black leading-tight ${highlight ? 'text-[#05A357]' : 'text-[#000000]'}`}>
          {currentGrade !== null ? currentGrade.toFixed(1) : '—'}
          <span className="text-3xl">{currentGrade !== null ? '%' : ''}</span>
        </div>
        <div className="mt-1 flex items-center gap-2">
          <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
            currentLetterGrade === 'A' ? 'bg-green-100 text-green-700' :
            currentLetterGrade === 'B' ? 'bg-blue-100 text-blue-700' :
            currentLetterGrade === 'C' ? 'bg-yellow-100 text-yellow-700' :
            currentLetterGrade === 'D' ? 'bg-orange-100 text-orange-700' :
            currentLetterGrade === 'F' ? 'bg-red-100 text-red-700' :
            'bg-gray-100 text-gray-500'
          }`}>
            {currentLetterGrade}
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * Stats Card Component
 */
function StatCard({ label, value, suffix = '', subtext, highlight = false }) {
  return (
    <div className="card rounded-xl p-4">
      <div className="text-xs font-semibold text-[#545454] uppercase tracking-wide mb-1">
        {label}
      </div>
      <div className={`font-mono-grades text-2xl font-black ${highlight ? 'text-[#05A357]' : 'text-[#000000]'}`}>
        {value}{suffix}
      </div>
      {subtext && (
        <div className="text-xs text-[#545454] mt-1">{subtext}</div>
      )}
    </div>
  );
}

/**
 * Empty State / Welcome Component with feature cards
 */
function EmptyState({ onCreateCategory }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="text-center max-w-lg">
        <div className="w-20 h-20 bg-[#000000] rounded-full flex items-center justify-center mx-auto mb-6">
          <BookOpen size={32} className="text-white" />
        </div>
        <h1 className="text-3xl font-black mb-2">Welcome to GradePilot</h1>
        <p className="text-[#545454] mb-8">
          Your personal grade tracking dashboard. Start by creating your first course category to begin tracking your academic progress.
        </p>
        <button
          onClick={onCreateCategory}
          className="btn-primary rounded-lg inline-flex items-center gap-2 mb-10"
        >
          <Plus size={16} />
          Create Your First Category
        </button>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
          <div className="rounded-xl border border-[#EEEEEE] p-4 bg-white">
            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center mb-3">
              <Target size={18} className="text-[#276EF1]" />
            </div>
            <h3 className="text-sm font-bold mb-1">Set Your Target</h3>
            <p className="text-xs text-[#545454] leading-relaxed">
              Choose a target grade and see exactly what you need on remaining work to hit it.
            </p>
          </div>
          <div className="rounded-xl border border-[#EEEEEE] p-4 bg-white">
            <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center mb-3">
              <BarChart3 size={18} className="text-[#05A357]" />
            </div>
            <h3 className="text-sm font-bold mb-1">Track Categories</h3>
            <p className="text-xs text-[#545454] leading-relaxed">
              Organize assignments by category with weighted grades that update in real time.
            </p>
          </div>
          <div className="rounded-xl border border-[#EEEEEE] p-4 bg-white">
            <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center mb-3">
              <Zap size={18} className="text-purple-600" />
            </div>
            <h3 className="text-sm font-bold mb-1">What-If Forecasts</h3>
            <p className="text-xs text-[#545454] leading-relaxed">
              Slide a value to explore how future scores change your overall grade instantly.
            </p>
          </div>
        </div>
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
      <div className="bg-white rounded-xl max-w-md w-full p-6">
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
                  className="flex-1 px-3 py-2 border border-[#EEEEEE] rounded-lg font-mono-grades focus:border-[#000000] focus:outline-none"
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
            className="w-full py-3 bg-[#E11D48] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <RotateCcw size={14} />
            Reset All Data
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full btn-primary rounded-lg"
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
    pointsEarned,
    getLetterGrade,
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
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Header */}
      <header className="border-b border-[#EEEEEE] bg-white px-4 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#000000] rounded-lg flex items-center justify-center">
              <TrendingUp size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight">GradePilot</h1>
              <p className="text-xs text-[#545454]">Grade Tracking Dashboard</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <PerformanceBadge tier={performanceTier} />
            {/* Add Category — primary outline button */}
            <button
              onClick={handleAddCategory}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold border-2 border-[#000000] text-[#000000] rounded-lg hover:bg-[#000000] hover:text-white transition-colors"
            >
              <Plus size={14} />
              Add Category
            </button>
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 hover:bg-[#EEEEEE] rounded-lg transition-colors"
              aria-label="Settings"
            >
              <Settings size={20} className="text-[#000000]" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content — 3-column desktop grid */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        {/* Setup Progress Card (replaces red weight check bar) */}
        <SetupProgressCard totalWeight={totalWeight} isValid={isWeightValid} />

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Column 1 — Stats & Categories */}
          <div className="lg:col-span-1 space-y-6 order-2 lg:order-1">
            {/* Stats Cards */}
            <CurrentGradeCard currentGrade={currentGrade} currentLetterGrade={currentLetterGrade} />

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

            {/* Quick Tips */}
            <div className="card rounded-xl p-5">
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

          {/* Column 2 — Categories (main feed) */}
          <div className="lg:col-span-1 space-y-6 order-1 lg:order-2">
            {/* Categories Header (mobile add button) */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black">Course Categories</h2>
              <button
                onClick={handleAddCategory}
                className="sm:hidden inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold border-2 border-[#000000] text-[#000000] rounded-lg hover:bg-[#000000] hover:text-white transition-colors"
              >
                <Plus size={14} />
                Add
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

          {/* Column 3 — Grade Forecast (prominent) */}
          <div className="space-y-6 order-3">
            <GradeForecast
              targetGrade={targetGrade}
              onTargetChange={setTargetGrade}
              requiredAverage={requiredAverage}
              isTargetAchievable={isTargetAchievable}
              currentGrade={currentGrade}
              remainingWeight={remainingWeight}
              forecast={forecast}
              gradeScale={gradeScale}
              pointsEarned={pointsEarned}
              getLetterGrade={getLetterGrade}
            />
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
