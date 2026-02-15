import { Plus, RotateCcw, Settings, TrendingUp, Award, BookOpen, LogOut } from 'lucide-react';
import { useSupabaseGrades } from '../hooks/useSupabaseData';
import { useGradeLogic } from '../hooks/useGradeLogic';
import { useAuth } from '../hooks/useAuth';
import { CategoryCard } from './CategoryCard';
import { GradeForecast } from './GradeForecast';
import { DashboardSkeleton } from './LoadingSkeleton';
import { useState } from 'react';

/**
 * Setup Progress Card
 * Shows info card when total weight is less than 100%
 */
function SetupProgressCard({ totalWeight, isValid }) {
  if (isValid || totalWeight >= 100) {
    return null;
  }

  const progress = (totalWeight / 100) * 100;
  const missing = 100 - totalWeight;

  return (
    <div className="bg-gradient-to-r from-[#EFF6FF] to-[#FEF3C7] border border-[#DBEAFE] rounded-lg p-5 mb-6">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-[#3B82F6] rounded-full flex items-center justify-center flex-shrink-0">
          <Settings size={20} className="text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-black text-sm mb-2 text-[#1E40AF]">Setup Progress</h3>
          <p className="text-sm text-[#475569] mb-3">
            Your category weights add up to {totalWeight.toFixed(1)}%. 
            Add {missing.toFixed(1)}% more to complete your grade setup.
          </p>
          {/* Progress Bar */}
          <div className="h-2 bg-white rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#3B82F6] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-2 text-xs text-[#64748B]">
            {progress.toFixed(0)}% complete
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
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded font-black text-sm uppercase tracking-wider ${colorMap[tier.color]}`}>
      <Award size={14} />
      {tier.label}
    </div>
  );
}

/**
 * Stats Card Component
 */
function StatCard({ label, value, suffix = '', subtext, highlight = false, large = false, showProgress = false, progressValue = 0 }) {
  return (
    <div className="card rounded p-6 relative overflow-hidden">
      {/* Background progress ring/circle for large cards */}
      {large && showProgress && (
        <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
          <svg viewBox="0 0 100 100" className="transform -rotate-90">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#EEEEEE"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#05A357"
              strokeWidth="8"
              strokeDasharray={`${progressValue * 2.51} 251`}
              className="transition-all duration-500"
            />
          </svg>
        </div>
      )}
      
      <div className="text-xs font-semibold text-[#545454] uppercase tracking-wide mb-2">
        {label}
      </div>
      <div className={`font-mono-grades ${large ? 'text-5xl' : 'text-3xl'} font-black ${highlight ? 'text-[#05A357]' : 'text-[#000000]'} relative z-10`}>
        {value}{suffix}
      </div>
      {subtext && (
        <div className="text-xs text-[#545454] mt-2">{subtext}</div>
      )}
    </div>
  );
}

/**
 * Empty State Component
 */
function EmptyState({ onCreateCategory }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-[#FAFAFA] to-[#FFFFFF]">
      <div className="text-center max-w-2xl">
        <div className="w-20 h-20 bg-gradient-to-br from-[#000000] to-[#545454] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
          <BookOpen size={32} className="text-white" />
        </div>
        <h1 className="text-4xl font-black mb-3">Welcome to GradePilot</h1>
        <p className="text-[#545454] text-lg mb-10">
          Your intelligent grade tracking companion. Start by creating your first course category.
        </p>
        
        <button
          onClick={onCreateCategory}
          className="btn-primary rounded-lg inline-flex items-center gap-2 mb-12 shadow-lg"
        >
          <Plus size={18} />
          Create Your First Category
        </button>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          <div className="bg-white card rounded-lg p-5 text-left">
            <div className="w-10 h-10 bg-[#05A357] rounded-lg flex items-center justify-center mb-3">
              <TrendingUp size={20} className="text-white" />
            </div>
            <h3 className="font-black text-sm mb-2">Track Progress</h3>
            <p className="text-xs text-[#545454]">
              Monitor your grades across all categories in real-time
            </p>
          </div>
          
          <div className="bg-white card rounded-lg p-5 text-left">
            <div className="w-10 h-10 bg-[#276EF1] rounded-lg flex items-center justify-center mb-3">
              <Award size={20} className="text-white" />
            </div>
            <h3 className="font-black text-sm mb-2">Forecast Grades</h3>
            <p className="text-xs text-[#545454]">
              See what you need to achieve your target grade
            </p>
          </div>
          
          <div className="bg-white card rounded-lg p-5 text-left">
            <div className="w-10 h-10 bg-[#000000] rounded-lg flex items-center justify-center mb-3">
              <BookOpen size={20} className="text-white" />
            </div>
            <h3 className="font-black text-sm mb-2">Stay Organized</h3>
            <p className="text-xs text-[#545454]">
              Manage assignments with weighted category averages
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
  const { signOut } = useAuth();
  const {
    categories,
    targetGrade,
    gradeScale,
    loading,
    error,
    addCategory,
    updateCategory,
    deleteCategory,
    addAssignment,
    updateAssignment,
    deleteAssignment,
    updateSettings,
    resetAllData
  } = useSupabaseGrades();

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

  // Show loading skeleton while fetching data
  if (loading) {
    return <DashboardSkeleton />;
  }

  // Show error toast if there's an error
  if (error) {
    console.error('Dashboard error:', error);
  }

  // Category CRUD operations
  const handleAddCategory = async () => {
    try {
      await addCategory('New Category', 0);
    } catch (err) {
      console.error('Failed to add category:', err);
    }
  };

  const handleUpdateCategory = async (category, updates) => {
    try {
      // Update category itself
      if (updates.name !== category.name || updates.weight !== category.weight) {
        await updateCategory(category.id, {
          name: updates.name,
          weight: updates.weight
        });
      }

      // Handle assignment updates
      if (updates.assignments) {
        // Find new assignments (without id or with temp id)
        const newAssignments = updates.assignments.filter(
          a => !category.assignments.some(ca => ca.id === a.id)
        );
        
        // Find updated assignments
        const updatedAssignments = updates.assignments.filter(
          a => category.assignments.some(ca => ca.id === a.id)
        );

        // Find deleted assignments
        const deletedAssignments = category.assignments.filter(
          a => !updates.assignments.some(ua => ua.id === a.id)
        );

        // Add new assignments
        for (const assignment of newAssignments) {
          await addAssignment(category.id, assignment.name, assignment.pointsPossible);
        }

        // Update existing assignments
        for (const assignment of updatedAssignments) {
          const oldAssignment = category.assignments.find(a => a.id === assignment.id);
          if (
            oldAssignment.name !== assignment.name ||
            oldAssignment.pointsEarned !== assignment.pointsEarned ||
            oldAssignment.pointsPossible !== assignment.pointsPossible
          ) {
            await updateAssignment(assignment.id, assignment);
          }
        }

        // Delete removed assignments
        for (const assignment of deletedAssignments) {
          await deleteAssignment(assignment.id, category.id);
        }
      }
    } catch (err) {
      console.error('Failed to update category:', err);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm('Delete this category and all its assignments?')) {
      try {
        await deleteCategory(categoryId);
      } catch (err) {
        console.error('Failed to delete category:', err);
      }
    }
  };

  const handleTargetChange = async (newTarget) => {
    try {
      await updateSettings(newTarget, gradeScale);
    } catch (err) {
      console.error('Failed to update target:', err);
    }
  };

  const handleGradeScaleChange = async (newScale) => {
    try {
      await updateSettings(targetGrade, newScale);
    } catch (err) {
      console.error('Failed to update grade scale:', err);
    }
  };

  const handleResetAll = async () => {
    if (window.confirm('This will delete all your data. Are you sure?')) {
      try {
        await resetAllData();
        setShowSettings(false);
      } catch (err) {
        console.error('Failed to reset data:', err);
      }
    }
  };

  const handleSignOut = async () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      try {
        await signOut();
      } catch (err) {
        console.error('Failed to sign out:', err);
      }
    }
  };

  // Show empty state if no categories
  if (categories.length === 0) {
    return <EmptyState onCreateCategory={handleAddCategory} />;
  }

  return (
    <div className="min-h-screen bg-[#FFFFFF]">
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
            <button
              onClick={handleSignOut}
              className="p-2 hover:bg-[#EEEEEE] rounded transition-colors"
              aria-label="Sign out"
            >
              <LogOut size={20} className="text-[#545454]" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        {/* Setup Progress Card */}
        <SetupProgressCard totalWeight={totalWeight} isValid={isWeightValid} />

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Stats & Categories */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <StatCard 
                label="Current Grade" 
                value={currentGrade !== null ? currentGrade.toFixed(1) : '—'}
                suffix={currentGrade !== null ? '%' : ''}
                highlight={currentGrade >= 90}
                large={true}
                showProgress={currentGrade !== null}
                progressValue={currentGrade || 0}
              />
              <div className="grid grid-cols-2 gap-4">
                <StatCard 
                  label="Letter" 
                  value={currentLetterGrade}
                  highlight={currentLetterGrade === 'A'}
                />
                <StatCard 
                  label="Weight Used" 
                  value={weightUsed.toFixed(0)}
                  suffix="%"
                />
              </div>
            </div>

            {/* Categories Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black">Course Categories</h2>
              <button
                onClick={handleAddCategory}
                className="border-2 border-[#000000] bg-transparent text-[#000000] hover:bg-[#000000] hover:text-white transition-colors rounded text-sm font-bold inline-flex items-center gap-2 py-2 px-4"
              >
                <Plus size={14} />
                Add Category
              </button>
            </div>

            {/* Category Cards */}
            <div className="space-y-4">
              {categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  onUpdate={(updated) => handleUpdateCategory(category, updated)}
                  onDelete={() => handleDeleteCategory(category.id)}
                  categoryGrade={calculateCategoryGrade(category)}
                />
              ))}
            </div>
          </div>

          {/* Right Column - Forecast (More Prominent) */}
          <div className="space-y-6">
            <GradeForecast
              targetGrade={targetGrade}
              onTargetChange={handleTargetChange}
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
          onScaleChange={handleGradeScaleChange}
          onClose={() => setShowSettings(false)}
          onReset={handleResetAll}
        />
      )}
    </div>
  );
}

export default Dashboard;
