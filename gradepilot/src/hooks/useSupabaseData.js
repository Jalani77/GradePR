import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../utils/supabase/client';
import { useAuth } from './useAuth';

/**
 * Hook to fetch and manage grade data from Supabase
 */
export function useSupabaseGrades() {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [targetGrade, setTargetGrade] = useState(90);
  const [gradeScale, setGradeScale] = useState({
    A: 90,
    B: 80,
    C: 70,
    D: 60,
    F: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all data
  const fetchData = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);

      // Fetch user settings
      const { data: settings, error: settingsError } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (settingsError && settingsError.code !== 'PGRST116') {
        throw settingsError;
      }

      if (settings) {
        setTargetGrade(settings.target_grade || 90);
        setGradeScale({
          A: settings.grade_scale_a || 90,
          B: settings.grade_scale_b || 80,
          C: settings.grade_scale_c || 70,
          D: settings.grade_scale_d || 60,
          F: 0
        });
      }

      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (categoriesError) throw categoriesError;

      // Fetch assignments for each category
      const { data: assignmentsData, error: assignmentsError } = await supabase
        .from('assignments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (assignmentsError) throw assignmentsError;

      // Group assignments by category
      const categoriesWithAssignments = (categoriesData || []).map(cat => ({
        id: cat.id,
        name: cat.name,
        weight: cat.weight,
        assignments: (assignmentsData || [])
          .filter(a => a.category_id === cat.id)
          .map(a => ({
            id: a.id,
            name: a.name,
            pointsEarned: a.points_earned,
            pointsPossible: a.points_possible
          }))
      }));

      setCategories(categoriesWithAssignments);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Add category
  const addCategory = async (name = 'New Category', weight = 0) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('categories')
        .insert([{ 
          user_id: user.id, 
          name, 
          weight 
        }])
        .select()
        .single();

      if (error) throw error;

      setCategories([...categories, {
        id: data.id,
        name: data.name,
        weight: data.weight,
        assignments: []
      }]);

      return data;
    } catch (err) {
      console.error('Error adding category:', err);
      setError(err.message);
      throw err;
    }
  };

  // Update category
  const updateCategory = async (categoryId, updates) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('categories')
        .update({
          name: updates.name,
          weight: updates.weight
        })
        .eq('id', categoryId)
        .eq('user_id', user.id);

      if (error) throw error;

      setCategories(categories.map(cat => 
        cat.id === categoryId 
          ? { ...cat, name: updates.name, weight: updates.weight }
          : cat
      ));
    } catch (err) {
      console.error('Error updating category:', err);
      setError(err.message);
      throw err;
    }
  };

  // Delete category
  const deleteCategory = async (categoryId) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryId)
        .eq('user_id', user.id);

      if (error) throw error;

      setCategories(categories.filter(cat => cat.id !== categoryId));
    } catch (err) {
      console.error('Error deleting category:', err);
      setError(err.message);
      throw err;
    }
  };

  // Add assignment
  const addAssignment = async (categoryId, name = 'New Assignment', pointsPossible = 100) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('assignments')
        .insert([{
          user_id: user.id,
          category_id: categoryId,
          name,
          points_earned: null,
          points_possible: pointsPossible
        }])
        .select()
        .single();

      if (error) throw error;

      setCategories(categories.map(cat =>
        cat.id === categoryId
          ? {
              ...cat,
              assignments: [...cat.assignments, {
                id: data.id,
                name: data.name,
                pointsEarned: data.points_earned,
                pointsPossible: data.points_possible
              }]
            }
          : cat
      ));

      return data;
    } catch (err) {
      console.error('Error adding assignment:', err);
      setError(err.message);
      throw err;
    }
  };

  // Update assignment
  const updateAssignment = async (assignmentId, updates) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('assignments')
        .update({
          name: updates.name,
          points_earned: updates.pointsEarned,
          points_possible: updates.pointsPossible
        })
        .eq('id', assignmentId)
        .eq('user_id', user.id);

      if (error) throw error;

      setCategories(categories.map(cat => ({
        ...cat,
        assignments: cat.assignments.map(a =>
          a.id === assignmentId
            ? {
                ...a,
                name: updates.name,
                pointsEarned: updates.pointsEarned,
                pointsPossible: updates.pointsPossible
              }
            : a
        )
      })));
    } catch (err) {
      console.error('Error updating assignment:', err);
      setError(err.message);
      throw err;
    }
  };

  // Delete assignment
  const deleteAssignment = async (assignmentId, categoryId) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('assignments')
        .delete()
        .eq('id', assignmentId)
        .eq('user_id', user.id);

      if (error) throw error;

      setCategories(categories.map(cat =>
        cat.id === categoryId
          ? {
              ...cat,
              assignments: cat.assignments.filter(a => a.id !== assignmentId)
            }
          : cat
      ));
    } catch (err) {
      console.error('Error deleting assignment:', err);
      setError(err.message);
      throw err;
    }
  };

  // Update settings
  const updateSettings = async (newTargetGrade, newGradeScale) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          target_grade: newTargetGrade,
          grade_scale_a: newGradeScale.A,
          grade_scale_b: newGradeScale.B,
          grade_scale_c: newGradeScale.C,
          grade_scale_d: newGradeScale.D
        });

      if (error) throw error;

      setTargetGrade(newTargetGrade);
      setGradeScale(newGradeScale);
    } catch (err) {
      console.error('Error updating settings:', err);
      setError(err.message);
      throw err;
    }
  };

  // Reset all data
  const resetAllData = async () => {
    if (!user) return;

    try {
      // Delete all categories (assignments will cascade)
      const { error: catError } = await supabase
        .from('categories')
        .delete()
        .eq('user_id', user.id);

      if (catError) throw catError;

      // Reset settings
      const { error: settingsError } = await supabase
        .from('user_settings')
        .update({
          target_grade: 90,
          grade_scale_a: 90,
          grade_scale_b: 80,
          grade_scale_c: 70,
          grade_scale_d: 60
        })
        .eq('user_id', user.id);

      if (settingsError) throw settingsError;

      // Reset local state
      setCategories([]);
      setTargetGrade(90);
      setGradeScale({ A: 90, B: 80, C: 70, D: 60, F: 0 });
    } catch (err) {
      console.error('Error resetting data:', err);
      setError(err.message);
      throw err;
    }
  };

  return {
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
    resetAllData,
    refreshData: fetchData
  };
}

export default useSupabaseGrades;
