import { useState } from 'react';
import { ChevronDown, ChevronRight, Plus, Trash2, GripVertical } from 'lucide-react';

/**
 * Inline editable input component
 */
function InlineInput({ value, onChange, type = 'text', className = '', placeholder = '' }) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`inline-edit bg-transparent ${className}`}
      placeholder={placeholder}
      step={type === 'number' ? '0.01' : undefined}
      min={type === 'number' ? '0' : undefined}
    />
  );
}

/**
 * Assignment row component with inline editing
 */
function AssignmentRow({ assignment, onUpdate, onDelete }) {
  const handleChange = (field, value) => {
    onUpdate({ ...assignment, [field]: value });
  };

  const grade = assignment.pointsPossible > 0 && assignment.pointsEarned !== '' && assignment.pointsEarned !== null
    ? ((parseFloat(assignment.pointsEarned) / parseFloat(assignment.pointsPossible)) * 100).toFixed(1)
    : null;

  return (
    <div className="flex items-center gap-3 py-2.5 px-4 border-b border-[#EEEEEE] last:border-b-0 hover:bg-[#F7F7F7] group transition-colors duration-150">
      <GripVertical size={14} className="text-[#CCCCCC] opacity-0 group-hover:opacity-100 transition-opacity cursor-grab" />
      
      <InlineInput
        value={assignment.name}
        onChange={(v) => handleChange('name', v)}
        className="flex-1 text-sm font-medium"
        placeholder="Assignment name"
      />
      
      <div className="flex items-center gap-1">
        <InlineInput
          value={assignment.pointsEarned ?? ''}
          onChange={(v) => handleChange('pointsEarned', v === '' ? null : parseFloat(v))}
          type="number"
          className="w-16 text-right font-mono-grades text-sm"
          placeholder="—"
        />
        <span className="text-[#545454] text-sm">/</span>
        <InlineInput
          value={assignment.pointsPossible}
          onChange={(v) => handleChange('pointsPossible', parseFloat(v) || 0)}
          type="number"
          className="w-16 text-left font-mono-grades text-sm"
          placeholder="100"
        />
      </div>

      <div className="w-16 text-right">
        {grade !== null ? (
          <span className={`font-mono-grades text-sm font-semibold ${
            parseFloat(grade) >= 90 ? 'text-[#05A357]' : 
            parseFloat(grade) >= 80 ? 'text-[#276EF1]' : 
            parseFloat(grade) >= 70 ? 'text-[#545454]' : 'text-[#E11D48]'
          }`}>
            {grade}%
          </span>
        ) : (
          <span className="text-[#CCCCCC] text-sm">—</span>
        )}
      </div>

      <button
        onClick={onDelete}
        className="p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#EEEEEE] rounded-md"
        aria-label="Delete assignment"
      >
        <Trash2 size={14} className="text-[#545454]" />
      </button>
    </div>
  );
}

/**
 * Category Card component with expandable assignments list
 * - Rounded corners and hover effect on the card itself
 * - Conditional category grade coloring: <70% = soft orange, >90% = green
 * - '+' icon button instead of text link for "Add Assignment"
 */
export function CategoryCard({ category, onUpdate, onDelete, categoryGrade }) {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleCategoryChange = (field, value) => {
    onUpdate({ ...category, [field]: value });
  };

  const handleAssignmentUpdate = (index, updatedAssignment) => {
    const newAssignments = [...(category.assignments || [])];
    newAssignments[index] = updatedAssignment;
    onUpdate({ ...category, assignments: newAssignments });
  };

  const handleAssignmentDelete = (index) => {
    const newAssignments = (category.assignments || []).filter((_, i) => i !== index);
    onUpdate({ ...category, assignments: newAssignments });
  };

  const handleAddAssignment = () => {
    const newAssignment = {
      id: `assignment_${Date.now()}`,
      name: 'New Assignment',
      pointsEarned: null,
      pointsPossible: 100
    };
    onUpdate({ 
      ...category, 
      assignments: [...(category.assignments || []), newAssignment] 
    });
  };

  const assignments = category.assignments || [];
  const gradedCount = assignments.filter(a => a.pointsEarned !== null && a.pointsEarned !== '').length;

  // Conditional category grade color
  const getCategoryGradeColor = (grade) => {
    if (grade === null) return 'text-[#CCCCCC]';
    if (grade >= 90) return 'text-[#05A357]';       // green for 90%+
    if (grade >= 80) return 'text-[#276EF1]';       // blue for 80-89%
    if (grade >= 70) return 'text-[#545454]';       // neutral for 70-79%
    return 'text-orange-500';                        // soft orange for <70%
  };

  return (
    <div className="card rounded-xl hover:shadow-md transition-shadow duration-200">
      {/* Category Header */}
      <div className="flex items-center gap-3 p-4 border-b border-[#EEEEEE]">
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 hover:bg-[#EEEEEE] rounded-md transition-colors"
          aria-label={isExpanded ? 'Collapse' : 'Expand'}
        >
          {isExpanded ? (
            <ChevronDown size={16} className="text-[#000000]" />
          ) : (
            <ChevronRight size={16} className="text-[#000000]" />
          )}
        </button>

        <div className="flex-1 flex items-center gap-4">
          <InlineInput
            value={category.name}
            onChange={(v) => handleCategoryChange('name', v)}
            className="text-base font-black tracking-tight"
            placeholder="Category name"
          />
          
          <div className="flex items-center gap-1">
            <InlineInput
              value={category.weight}
              onChange={(v) => handleCategoryChange('weight', parseFloat(v) || 0)}
              type="number"
              className="w-14 text-right font-mono-grades text-sm font-semibold"
              placeholder="0"
            />
            <span className="text-[#545454] text-sm font-semibold">%</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Category grade — conditional color */}
          <div className="text-right">
            {categoryGrade !== null ? (
              <span className={`font-mono-grades text-lg font-black ${getCategoryGradeColor(categoryGrade)}`}>
                {categoryGrade.toFixed(1)}%
              </span>
            ) : (
              <span className="text-[#CCCCCC] font-mono-grades text-lg">—</span>
            )}
          </div>

          {/* Assignment count badge */}
          <div className="bg-[#EEEEEE] px-2 py-1 rounded-md text-xs font-semibold text-[#545454]">
            {gradedCount}/{assignments.length}
          </div>

          {/* Add assignment — subtle '+' icon button */}
          <button
            onClick={handleAddAssignment}
            className="p-2 hover:bg-blue-50 rounded-md transition-colors group/add"
            aria-label="Add assignment"
            title="Add assignment"
          >
            <Plus size={16} className="text-[#545454] group-hover/add:text-[#276EF1] transition-colors" />
          </button>

          <button
            onClick={onDelete}
            className="p-2 hover:bg-red-50 rounded-md transition-colors group/del"
            aria-label="Delete category"
          >
            <Trash2 size={16} className="text-[#545454] group-hover/del:text-[#E11D48] transition-colors" />
          </button>
        </div>
      </div>

      {/* Assignments List */}
      {isExpanded && (
        <div>
          {assignments.length > 0 ? (
            <div>
              {assignments.map((assignment, index) => (
                <AssignmentRow
                  key={assignment.id}
                  assignment={assignment}
                  onUpdate={(updated) => handleAssignmentUpdate(index, updated)}
                  onDelete={() => handleAssignmentDelete(index)}
                />
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-[#545454] text-sm">
              No assignments yet — click the <Plus size={12} className="inline text-[#276EF1]" /> button to add one
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CategoryCard;
