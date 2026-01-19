import { useMemo } from 'react';

/**
 * Centralized math for weighted averages and grade forecasts
 * @param {Array} categories - Array of category objects
 * @param {number} targetGrade - The target grade percentage
 * @param {Object} gradeScale - Grade letter thresholds
 */
export function useGradeLogic(categories, targetGrade, gradeScale) {
  
  // Calculate total weight of all categories
  const totalWeight = useMemo(() => {
    return categories.reduce((sum, cat) => sum + (parseFloat(cat.weight) || 0), 0);
  }, [categories]);

  // Check if weights are valid (equal to 100%)
  const isWeightValid = useMemo(() => {
    return Math.abs(totalWeight - 100) < 0.01;
  }, [totalWeight]);

  // Calculate weighted grade for a single category
  const calculateCategoryGrade = (category) => {
    const assignments = category.assignments || [];
    if (assignments.length === 0) return null;

    const gradedAssignments = assignments.filter(a => 
      a.pointsEarned !== null && 
      a.pointsEarned !== undefined && 
      a.pointsEarned !== '' &&
      a.pointsPossible > 0
    );

    if (gradedAssignments.length === 0) return null;

    const totalEarned = gradedAssignments.reduce((sum, a) => sum + parseFloat(a.pointsEarned || 0), 0);
    const totalPossible = gradedAssignments.reduce((sum, a) => sum + parseFloat(a.pointsPossible || 0), 0);

    if (totalPossible === 0) return null;
    return (totalEarned / totalPossible) * 100;
  };

  // Calculate current weighted average across all categories
  const currentGrade = useMemo(() => {
    let weightedSum = 0;
    let totalWeightUsed = 0;

    categories.forEach(category => {
      const categoryGrade = calculateCategoryGrade(category);
      if (categoryGrade !== null) {
        const weight = parseFloat(category.weight) || 0;
        weightedSum += (categoryGrade * weight) / 100;
        totalWeightUsed += weight;
      }
    });

    if (totalWeightUsed === 0) return null;
    
    // Return the weighted average normalized to used weight
    return (weightedSum / totalWeightUsed) * 100;
  }, [categories]);

  // Calculate points earned (weighted)
  const pointsEarned = useMemo(() => {
    let weightedPoints = 0;

    categories.forEach(category => {
      const categoryGrade = calculateCategoryGrade(category);
      if (categoryGrade !== null) {
        const weight = parseFloat(category.weight) || 0;
        weightedPoints += (categoryGrade * weight) / 100;
      }
    });

    return weightedPoints;
  }, [categories]);

  // Calculate weight used so far
  const weightUsed = useMemo(() => {
    let used = 0;
    categories.forEach(category => {
      const assignments = category.assignments || [];
      const hasGradedAssignments = assignments.some(a => 
        a.pointsEarned !== null && 
        a.pointsEarned !== undefined && 
        a.pointsEarned !== ''
      );
      if (hasGradedAssignments) {
        used += parseFloat(category.weight) || 0;
      }
    });
    return used;
  }, [categories]);

  // Calculate remaining weight
  const remainingWeight = useMemo(() => {
    return Math.max(0, 100 - weightUsed);
  }, [weightUsed]);

  // Calculate required average on remaining assignments to reach target
  const requiredAverage = useMemo(() => {
    if (remainingWeight <= 0) {
      // All weight is used - can't improve
      return null;
    }

    // Formula: x = (Target - CurrentPointsEarned) / RemainingWeight * 100
    const neededPoints = targetGrade - pointsEarned;
    const required = (neededPoints / remainingWeight) * 100;

    return required;
  }, [targetGrade, pointsEarned, remainingWeight]);

  // Determine if target is achievable
  const isTargetAchievable = useMemo(() => {
    if (requiredAverage === null) {
      return currentGrade !== null && currentGrade >= targetGrade;
    }
    return requiredAverage <= 100;
  }, [requiredAverage, currentGrade, targetGrade]);

  // Get letter grade from percentage
  const getLetterGrade = (percentage) => {
    if (percentage === null || percentage === undefined) return '-';
    if (percentage >= gradeScale.A) return 'A';
    if (percentage >= gradeScale.B) return 'B';
    if (percentage >= gradeScale.C) return 'C';
    if (percentage >= gradeScale.D) return 'D';
    return 'F';
  };

  // Current letter grade
  const currentLetterGrade = useMemo(() => {
    return getLetterGrade(currentGrade);
  }, [currentGrade, gradeScale]);

  // Performance tier calculation
  const performanceTier = useMemo(() => {
    if (currentGrade === null) return { label: 'NO DATA', color: 'secondary' };
    if (currentGrade >= 95) return { label: 'A+ TIER', color: 'green' };
    if (currentGrade >= 90) return { label: 'A-TIER', color: 'green' };
    if (currentGrade >= 85) return { label: 'STABLE', color: 'blue' };
    if (currentGrade >= 80) return { label: 'WATCH', color: 'primary' };
    if (currentGrade >= 70) return { label: 'AT RISK', color: 'error' };
    return { label: 'CRITICAL', color: 'error' };
  }, [currentGrade]);

  // Calculate forecast scenarios
  const forecast = useMemo(() => {
    if (remainingWeight <= 0) {
      return {
        best: currentGrade,
        worst: currentGrade,
        current: currentGrade
      };
    }

    // Best case: 100% on remaining
    const bestCase = pointsEarned + remainingWeight;
    
    // Worst case: 0% on remaining
    const worstCase = pointsEarned;

    return {
      best: bestCase,
      worst: worstCase,
      current: currentGrade
    };
  }, [pointsEarned, remainingWeight, currentGrade]);

  return {
    totalWeight,
    isWeightValid,
    currentGrade,
    currentLetterGrade,
    pointsEarned,
    weightUsed,
    remainingWeight,
    requiredAverage,
    isTargetAchievable,
    performanceTier,
    forecast,
    getLetterGrade,
    calculateCategoryGrade
  };
}

export default useGradeLogic;
