import { useState, useEffect, useCallback } from 'react';
import {
  fetchGrades,
  insertCategory,
  updateCategory as updateCategoryApi,
  deleteCategory as deleteCategoryApi,
  insertAssignment,
  updateAssignment as updateAssignmentApi,
  deleteAssignment as deleteAssignmentApi,
} from '../utils/supabase/queries';

/**
 * Hook that manages grade data from Supabase.
 * Returns the same shape as useGradePilotStore so the Dashboard can swap seamlessly.
 *
 * Falls back to null when Supabase is not configured,
 * letting the Dashboard use the local-state store instead.
 */
export function useSupabaseGrades() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Whether Supabase env vars are configured
  const supabaseConfigured = Boolean(
    import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY
  );

  const refresh = useCallback(async () => {
    if (!supabaseConfigured) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await fetchGrades();
      setCategories(data);
    } catch (err) {
      console.error('Failed to fetch grades:', err);
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [supabaseConfigured]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Add category via Supabase
  const handleAddCategory = useCallback(async () => {
    if (!supabaseConfigured) return;
    try {
      const newCat = await insertCategory('New Category', 0);
      setCategories(prev => [...prev, newCat]);
    } catch (err) {
      setError(err.message);
    }
  }, [supabaseConfigured]);

  // Update category
  const handleUpdateCategory = useCallback(async (index, updatedCategory) => {
    if (!supabaseConfigured) return;

    // Optimistic local update
    setCategories(prev => {
      const next = [...prev];
      next[index] = updatedCategory;
      return next;
    });

    try {
      await updateCategoryApi(updatedCategory.id, updatedCategory);
    } catch (err) {
      setError(err.message);
      refresh(); // re-fetch on error
    }
  }, [supabaseConfigured, refresh]);

  // Delete category
  const handleDeleteCategory = useCallback(async (index) => {
    if (!supabaseConfigured) return;
    const cat = categories[index];
    if (!cat) return;

    setCategories(prev => prev.filter((_, i) => i !== index));

    try {
      await deleteCategoryApi(cat.id);
    } catch (err) {
      setError(err.message);
      refresh();
    }
  }, [supabaseConfigured, categories, refresh]);

  // Add assignment
  const handleAddAssignment = useCallback(async (categoryId) => {
    if (!supabaseConfigured) return;
    try {
      const newAssignment = await insertAssignment(categoryId, 'New Assignment', null, 100);
      setCategories(prev =>
        prev.map(cat =>
          cat.id === categoryId
            ? { ...cat, assignments: [...(cat.assignments || []), newAssignment] }
            : cat
        )
      );
    } catch (err) {
      setError(err.message);
    }
  }, [supabaseConfigured]);

  // Update assignment
  const handleUpdateAssignment = useCallback(async (categoryId, assignmentIndex, updatedAssignment) => {
    if (!supabaseConfigured) return;

    setCategories(prev =>
      prev.map(cat => {
        if (cat.id !== categoryId) return cat;
        const assignments = [...(cat.assignments || [])];
        assignments[assignmentIndex] = updatedAssignment;
        return { ...cat, assignments };
      })
    );

    try {
      await updateAssignmentApi(updatedAssignment.id, updatedAssignment);
    } catch (err) {
      setError(err.message);
      refresh();
    }
  }, [supabaseConfigured, refresh]);

  // Delete assignment
  const handleDeleteAssignment = useCallback(async (categoryId, assignmentIndex) => {
    if (!supabaseConfigured) return;
    const cat = categories.find(c => c.id === categoryId);
    const assignment = cat?.assignments?.[assignmentIndex];
    if (!assignment) return;

    setCategories(prev =>
      prev.map(c => {
        if (c.id !== categoryId) return c;
        return { ...c, assignments: c.assignments.filter((_, i) => i !== assignmentIndex) };
      })
    );

    try {
      await deleteAssignmentApi(assignment.id);
    } catch (err) {
      setError(err.message);
      refresh();
    }
  }, [supabaseConfigured, categories, refresh]);

  return {
    categories,
    setCategories,
    loading,
    error,
    supabaseConfigured,
    refresh,
    handleAddCategory,
    handleUpdateCategory,
    handleDeleteCategory,
    handleAddAssignment,
    handleUpdateAssignment,
    handleDeleteAssignment,
  };
}

export default useSupabaseGrades;
