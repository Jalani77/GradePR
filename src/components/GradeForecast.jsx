import { Target } from "lucide-react";
import { formatPercent } from "../hooks/useGradeLogic";

const toneClasses = {
  uberBlue: "text-uberBlue",
  uberGreen: "text-uberGreen",
  muted: "text-muted",
  alertRed: "text-alertRed",
  ink: "text-ink",
};

const GradeForecast = ({
  targetGrade,
  onTargetChange,
  requiredAverage,
  remainingWeight,
  earnedPoints,
}) => {
  let statusTone = "uberBlue";
  let statusCopy = "Average needed on remaining assignments.";

  if (remainingWeight <= 0) {
    statusTone = "alertRed";
    statusCopy = "All weight logged. Add more categories to forecast.";
  } else if (requiredAverage !== null && requiredAverage <= 0) {
    statusTone = "uberGreen";
    statusCopy = "Target already secured with current points.";
  } else if (requiredAverage !== null && requiredAverage > 100) {
    statusTone = "alertRed";
    statusCopy = "Above 100% needed on remaining work.";
  }

  return (
    <div className="border border-border rounded-base p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target size={16} className="text-ink" />
          <h3 className="text-sm font-black uppercase">Grade Forecast</h3>
        </div>
        <span className="text-xs uppercase text-muted">What-if</span>
      </div>

      <div className="mt-4 space-y-3">
        <label className="text-xs uppercase text-muted" htmlFor="target-grade">
          Target Grade
        </label>
        <input
          id="target-grade"
          type="number"
          min="0"
          max="100"
          step="0.1"
          className="w-full rounded-base border border-border bg-transparent px-3 py-2 font-mono text-lg text-ink focus:border-ink focus:outline-none"
          value={targetGrade}
          onChange={(event) => onTargetChange(event.target.value)}
        />
        <div className="grid grid-cols-2 gap-4 text-xs uppercase text-muted">
          <div className="flex flex-col gap-1">
            <span>Points earned</span>
            <span className="font-mono text-ink">
              {formatPercent(earnedPoints)}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span>Remaining weight</span>
            <span className="font-mono text-ink">
              {formatPercent(remainingWeight)}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 border-t border-border pt-4">
        <div className="text-xs uppercase text-muted">Required average</div>
        <div
          className={`mt-2 font-mono text-2xl ${
            toneClasses[statusTone] || toneClasses.ink
          }`}
        >
          {requiredAverage === null ? "—" : formatPercent(requiredAverage)}
        </div>
        <p className="mt-2 text-sm text-muted">{statusCopy}</p>
        <p className="mt-3 text-xs text-muted">
          Formula: (Target - Points Earned) / Remaining Weight
        </p>
      </div>
    </div>
  );
};

export default GradeForecast;
