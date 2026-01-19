import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook to sync state with localStorage
 * @param {string} key - The localStorage key
 * @param {any} initialValue - The initial value if no stored value exists
 * @returns {[any, function, function]} - [state, setState, clearState]
 */
export function usePersistentState(key, initialValue) {
  // Initialize state from localStorage or use initial value
  const [state, setState] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored !== null) {
        return JSON.parse(stored);
      }
      return initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Sync to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.error(`Error writing to localStorage key "${key}":`, error);
    }
  }, [key, state]);

  // Clear this specific key from localStorage
  const clearState = useCallback(() => {
    try {
      localStorage.removeItem(key);
      setState(initialValue);
    } catch (error) {
      console.error(`Error clearing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [state, setState, clearState];
}

/**
 * Hook to manage the entire GradePilot data store
 */
export function useGradePilotStore() {
  const [categories, setCategories, clearCategories] = usePersistentState('gradepilot_categories', []);
  const [targetGrade, setTargetGrade, clearTargetGrade] = usePersistentState('gradepilot_target', 90);
  const [gradeScale, setGradeScale, clearGradeScale] = usePersistentState('gradepilot_scale', {
    A: 90,
    B: 80,
    C: 70,
    D: 60,
    F: 0
  });

  // Reset all data
  const resetAllData = useCallback(() => {
    clearCategories();
    clearTargetGrade();
    clearGradeScale();
  }, [clearCategories, clearTargetGrade, clearGradeScale]);

  return {
    categories,
    setCategories,
    targetGrade,
    setTargetGrade,
    gradeScale,
    setGradeScale,
    resetAllData
  };
}

export default usePersistentState;
