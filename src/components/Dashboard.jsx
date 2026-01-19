import { Plus, TrendingUp } from "lucide-react";
import usePersistentState from "../hooks/usePersistentState";
import {
  calculateRequiredAverage,
  calculateWeightedTotals,
  formatPercent,
  getPerformanceBadge,
  sumCategoryWeights,
} from "../hooks/useGradeLogic";
import CategoryCard from "./CategoryCard";
import GradeForecast from "./GradeForecast";

const DEFAULT_DATA = {
  categories: [],
  targetGrade: 90,
  scale: {
    a: 90,
    b: 80,
    c: 70,
    d: 60,
  },
};

const toneClasses = {
  uberGreen: "border-uberGreen text-uberGreen",
  uberBlue: "border-uberBlue text-uberBlue",
  muted: "border-border text-muted",
  alertRed: "border-alertRed text-alertRed",
};

const createId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const Dashboard = () => {
  const [data, setData] = usePersistentState("gradepilot:data", DEFAULT_DATA);
  const categories = data.categories ?? [];

  const totals = calculateWeightedTotals(categories);
  const requiredAverage = calculateRequiredAverage(
    data.targetGrade,
    totals.earnedPoints,
    totals.remainingWeight
  );
  const performance = getPerformanceBadge(totals.currentAverage, data.scale);
  const totalWeight = sumCategoryWeights(categories);
  const weightBalanced = Math.abs(totalWeight - 100) < 0.01;

  const updateData = (updater) =>
    setData((prev) => ({
      ...prev,
      ...updater(prev),
    }));

  const addCategory = () => {
    const newCategory = {
      id: createId(),
      name: "New Category",
      weight: 0,
      assignments: [],
    };

    updateData((prev) => ({
      categories: [...prev.categories, newCategory],
    }));
  };

  const updateCategory = (id, updates) => {
    updateData((prev) => ({
      categories: prev.categories.map((category) =>
        category.id === id ? { ...category, ...updates } : category
      ),
    }));
  };

  const deleteCategory = (id) => {
    updateData((prev) => ({
      categories: prev.categories.filter((category) => category.id !== id),
    }));
  };

  const addAssignment = (categoryId) => {
    updateData((prev) => ({
      categories: prev.categories.map((category) =>
        category.id === categoryId
          ? {
              ...category,
              assignments: [
                ...category.assignments,
                {
                  id: createId(),
                  name: "Assignment",
                  score: 0,
                  total: 100,
                },
              ],
            }
          : category
      ),
    }));
  };

  const updateAssignment = (categoryId, assignmentId, updates) => {
    updateData((prev) => ({
      categories: prev.categories.map((category) =>
        category.id === categoryId
          ? {
              ...category,
              assignments: category.assignments.map((assignment) =>
                assignment.id === assignmentId
                  ? { ...assignment, ...updates }
                  : assignment
              ),
            }
          : category
      ),
    }));
  };

  const deleteAssignment = (categoryId, assignmentId) => {
    updateData((prev) => ({
      categories: prev.categories.map((category) =>
        category.id === categoryId
          ? {
              ...category,
              assignments: category.assignments.filter(
                (assignment) => assignment.id !== assignmentId
              ),
            }
          : category
      ),
    }));
  };

  const updateScale = (key, value) => {
    updateData((prev) => ({
      scale: {
        ...prev.scale,
        [key]: value,
      },
    }));
  };

  const updateTargetGrade = (value) => {
    updateData(() => ({
      targetGrade: value,
    }));
  };

  return (
    <div className="min-h-screen bg-white text-ink">
      <div className={`h-2 ${weightBalanced ? "bg-ink" : "bg-alertRed"}`} />

      <header className="border-b border-border px-6 py-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-xs font-black uppercase text-muted">
              GradePilot
            </div>
            <h1 className="text-2xl font-black tracking-tight">Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase text-muted">
              Global Weight Check
            </span>
            <span
              className={`font-mono text-sm ${
                weightBalanced ? "text-ink" : "text-alertRed"
              }`}
            >
              {formatPercent(totalWeight)}
            </span>
          </div>
        </div>
      </header>

      <main className="px-6 py-6">
        {categories.length === 0 ? (
          <div className="mx-auto flex max-w-2xl flex-col gap-4 rounded-base border border-border p-8">
            <span className="text-xs uppercase text-muted">
              Welcome to GradePilot
            </span>
            <h2 className="text-2xl font-black">
              Create your first category to start forecasting.
            </h2>
            <p className="text-sm text-muted">
              Add course categories, log assignments, and map out target grade
              scenarios in seconds.
            </p>
            <button
              type="button"
              className="flex w-fit items-center gap-2 rounded-base bg-ink px-4 py-2 text-xs font-black uppercase text-white"
              onClick={addCategory}
            >
              <Plus size={16} className="text-white" />
              Create your first category
            </button>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
            <section className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-black">Course Categories</h2>
                  <p className="text-sm text-muted">
                    Manage weights and assignments inline.
                  </p>
                </div>
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-base border border-ink px-4 py-2 text-xs font-black uppercase text-ink hover:bg-ink hover:text-white"
                  onClick={addCategory}
                >
                  <Plus size={16} className="text-ink" />
                  Add category
                </button>
              </div>

              <div className="space-y-4">
                {categories.map((category) => (
                  <CategoryCard
                    key={category.id}
                    category={category}
                    onUpdateCategory={updateCategory}
                    onDeleteCategory={deleteCategory}
                    onAddAssignment={addAssignment}
                    onUpdateAssignment={updateAssignment}
                    onDeleteAssignment={deleteAssignment}
                  />
                ))}
              </div>
            </section>

            <aside className="space-y-4">
              <GradeForecast
                targetGrade={data.targetGrade}
                onTargetChange={updateTargetGrade}
                requiredAverage={requiredAverage}
                remainingWeight={totals.remainingWeight}
                earnedPoints={totals.earnedPoints}
              />

              <div className="border border-border rounded-base p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp size={16} className="text-ink" />
                    <h3 className="text-sm font-black uppercase">Performance</h3>
                  </div>
                  <span
                    className={`rounded-base border px-2 py-1 text-xs font-black uppercase ${
                      toneClasses[performance.tone]
                    }`}
                  >
                    {performance.label}
                  </span>
                </div>

                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted">Current grade</span>
                    <span className="font-mono text-lg">
                      {formatPercent(totals.currentAverage)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted">Weighted points earned</span>
                    <span className="font-mono">
                      {formatPercent(totals.earnedPoints)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted">Logged weight</span>
                    <span className="font-mono">
                      {formatPercent(totals.loggedWeight)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted">Remaining weight</span>
                    <span className="font-mono">
                      {formatPercent(totals.remainingWeight)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border border-border rounded-base p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black uppercase">Scale settings</h3>
                  <span className="text-xs uppercase text-muted">
                    Persistent
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-xs uppercase text-muted">
                  {[
                    { key: "a", label: "A" },
                    { key: "b", label: "B" },
                    { key: "c", label: "C" },
                    { key: "d", label: "D" },
                  ].map((item) => (
                    <label
                      key={item.key}
                      className="flex items-center justify-between gap-2"
                    >
                      <span>{item.label} Tier</span>
                      <input
                        className="w-20 rounded-base border border-border bg-transparent px-2 py-1 text-right font-mono text-ink focus:border-ink focus:outline-none"
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={data.scale[item.key]}
                        onChange={(event) =>
                          updateScale(item.key, event.target.value)
                        }
                      />
                    </label>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
