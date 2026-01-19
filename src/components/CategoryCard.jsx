import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { calculateCategoryScore, formatPercent } from "../hooks/useGradeLogic";

const inputBase =
  "w-full bg-transparent border-b border-border pb-1 text-ink focus:border-ink focus:outline-none";

const numberInputBase =
  "bg-transparent border border-border rounded-base px-2 py-1 font-mono text-ink focus:border-ink focus:outline-none";

const CategoryCard = ({
  category,
  onUpdateCategory,
  onDeleteCategory,
  onAddAssignment,
  onUpdateAssignment,
  onDeleteAssignment,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const categoryScore = calculateCategoryScore(category);

  return (
    <div className="border border-border rounded-base p-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex-1 min-w-[220px]">
            <input
              className={`${inputBase} text-lg font-black`}
              value={category.name}
              onChange={(event) =>
                onUpdateCategory(category.id, { name: event.target.value })
              }
              placeholder="Category name"
            />
            <div className="mt-3 flex items-center gap-2 text-xs uppercase text-muted">
              <span>Weight</span>
              <input
                className={`${numberInputBase} w-20 text-center`}
                type="number"
                min="0"
                step="0.1"
                value={category.weight}
                onChange={(event) =>
                  onUpdateCategory(category.id, { weight: event.target.value })
                }
              />
              <span>%</span>
            </div>
          </div>
          <div className="flex items-end justify-between gap-4 md:flex-col md:items-end">
            <div className="text-right">
              <div className="text-xs uppercase text-muted">Category Avg</div>
              <div className="font-mono text-lg">
                {categoryScore === null ? "—" : formatPercent(categoryScore)}
              </div>
            </div>
            <button
              type="button"
              className="flex items-center gap-1 text-xs font-black uppercase text-muted hover:text-ink"
              onClick={() => onDeleteCategory(category.id)}
            >
              <Trash2 size={16} className="text-ink" />
              Remove
            </button>
          </div>
        </div>

        <div className="border-t border-border pt-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              className="text-xs font-black uppercase text-muted hover:text-ink"
              onClick={() => setIsOpen((prev) => !prev)}
            >
              {isOpen ? "Hide" : "Show"} assignments ({category.assignments.length}
              )
            </button>
            <button
              type="button"
              className="flex items-center gap-1 rounded-base border border-ink px-3 py-2 text-xs font-black uppercase text-ink hover:bg-ink hover:text-white"
              onClick={() => onAddAssignment(category.id)}
            >
              <Plus size={16} className="text-ink" />
              Add assignment
            </button>
          </div>

          {isOpen && (
            <div className="mt-4 space-y-3">
              {category.assignments.length === 0 ? (
                <div className="text-sm text-muted">
                  No assignments yet. Add one to start tracking.
                </div>
              ) : (
                <>
                  <div className="hidden text-xs uppercase text-muted md:grid md:grid-cols-[2fr_1fr_1fr_auto] md:gap-2">
                    <span>Assignment</span>
                    <span>Score</span>
                    <span>Total</span>
                    <span></span>
                  </div>
                  {category.assignments.map((assignment) => (
                    <div
                      key={assignment.id}
                      className="grid gap-2 border border-border rounded-base p-2 md:grid-cols-[2fr_1fr_1fr_auto] md:items-center"
                    >
                      <input
                        className={`${inputBase} text-sm font-black`}
                        value={assignment.name}
                        onChange={(event) =>
                          onUpdateAssignment(category.id, assignment.id, {
                            name: event.target.value,
                          })
                        }
                        placeholder="Assignment name"
                      />
                      <input
                        className={numberInputBase}
                        type="number"
                        min="0"
                        step="0.1"
                        value={assignment.score}
                        onChange={(event) =>
                          onUpdateAssignment(category.id, assignment.id, {
                            score: event.target.value,
                          })
                        }
                        placeholder="Score"
                      />
                      <input
                        className={numberInputBase}
                        type="number"
                        min="0"
                        step="0.1"
                        value={assignment.total}
                        onChange={(event) =>
                          onUpdateAssignment(category.id, assignment.id, {
                            total: event.target.value,
                          })
                        }
                        placeholder="Total"
                      />
                      <button
                        type="button"
                        className="flex items-center justify-center rounded-base border border-border p-2 text-ink hover:border-ink"
                        onClick={() =>
                          onDeleteAssignment(category.id, assignment.id)
                        }
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;
