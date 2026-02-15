import { getSupabase } from './client';

/**
 * Fetch all categories and their assignments for the current user.
 * Returns the data in the same shape the Dashboard expects.
 */
export async function fetchGrades() {
  const supabase = getSupabase();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Fetch categories
  const { data: categories, error: catError } = await supabase
    .from('categories')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true });

  if (catError) throw catError;

  // Fetch assignments for all categories
  const { data: assignments, error: asnError } = await supabase
    .from('assignments')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true });

  if (asnError) throw asnError;

  // Group assignments by category_id
  const assignmentMap = {};
  for (const a of assignments || []) {
    if (!assignmentMap[a.category_id]) {
      assignmentMap[a.category_id] = [];
    }
    assignmentMap[a.category_id].push({
      id: a.id,
      name: a.name,
      pointsEarned: a.score,
      pointsPossible: a.max_score,
    });
  }

  // Map categories into the shape expected by the app
  return (categories || []).map(cat => ({
    id: cat.id,
    name: cat.name,
    weight: cat.weight,
    assignments: assignmentMap[cat.id] || [],
  }));
}

/**
 * Insert a new category for the current user.
 * @returns the newly created category object
 */
export async function insertCategory(name, weight) {
  const supabase = getSupabase();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('categories')
    .insert({ name, weight, user_id: user.id })
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    name: data.name,
    weight: data.weight,
    assignments: [],
  };
}

/**
 * Update a category.
 */
export async function updateCategory(categoryId, updates) {
  const supabase = getSupabase();

  const { error } = await supabase
    .from('categories')
    .update({ name: updates.name, weight: updates.weight })
    .eq('id', categoryId);

  if (error) throw error;
}

/**
 * Delete a category and all its assignments.
 */
export async function deleteCategory(categoryId) {
  const supabase = getSupabase();

  // Delete assignments first (foreign key)
  await supabase.from('assignments').delete().eq('category_id', categoryId);

  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', categoryId);

  if (error) throw error;
}

/**
 * Insert a new assignment.
 */
export async function insertAssignment(categoryId, name, score, maxScore) {
  const supabase = getSupabase();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('assignments')
    .insert({
      name,
      score,
      max_score: maxScore,
      category_id: categoryId,
      user_id: user.id,
    })
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    name: data.name,
    pointsEarned: data.score,
    pointsPossible: data.max_score,
  };
}

/**
 * Update an assignment.
 */
export async function updateAssignment(assignmentId, updates) {
  const supabase = getSupabase();

  const { error } = await supabase
    .from('assignments')
    .update({
      name: updates.name,
      score: updates.pointsEarned,
      max_score: updates.pointsPossible,
    })
    .eq('id', assignmentId);

  if (error) throw error;
}

/**
 * Delete an assignment.
 */
export async function deleteAssignment(assignmentId) {
  const supabase = getSupabase();

  const { error } = await supabase
    .from('assignments')
    .delete()
    .eq('id', assignmentId);

  if (error) throw error;
}
