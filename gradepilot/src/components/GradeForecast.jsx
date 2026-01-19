import { Target, TrendingUp, TrendingDown, AlertCircle, CheckCircle } from 'lucide-react';

/**
 * Grade Forecast Engine - "What-If" Calculator
 * Calculates the precise average required on remaining assignments to hit target
 */
export function GradeForecast({ 
  targetGrade, 
  onTargetChange, 
  requiredAverage, 
  isTargetAchievable, 
  currentGrade,
  remainingWeight,
  forecast,
  gradeScale
}) {
  
  // Get grade letter for target
  const getTargetLetter = (target) => {
    if (target >= gradeScale.A) return 'A';
    if (target >= gradeScale.B) return 'B';
    if (target >= gradeScale.C) return 'C';
    if (target >= gradeScale.D) return 'D';
    return 'F';
  };

  // Preset target buttons
  const presets = [
    { label: 'A', value: gradeScale.A },
    { label: 'B', value: gradeScale.B },
    { label: 'C', value: gradeScale.C },
    { label: 'D', value: gradeScale.D },
  ];

  return (
    <div className="card rounded p-5">
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <Target size={16} className="text-[#000000]" />
        <h2 className="text-sm font-black uppercase tracking-wide">Grade Forecast</h2>
      </div>

      {/* Target Input */}
      <div className="mb-5">
        <label className="block text-xs font-semibold text-[#545454] uppercase tracking-wide mb-2">
          Target Grade
        </label>
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <input
              type="number"
              value={targetGrade}
              onChange={(e) => onTargetChange(parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-3 border border-[#EEEEEE] rounded font-mono-grades text-2xl font-black text-center focus:border-[#000000] focus:outline-none transition-colors"
              min="0"
              max="100"
              step="0.1"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#545454] font-semibold">%</span>
          </div>
          <div className="w-14 h-14 flex items-center justify-center bg-[#000000] text-[#FFFFFF] font-black text-xl rounded">
            {getTargetLetter(targetGrade)}
          </div>
        </div>

        {/* Preset buttons */}
        <div className="flex gap-2 mt-3">
          {presets.map(preset => (
            <button
              key={preset.label}
              onClick={() => onTargetChange(preset.value)}
              className={`flex-1 py-2 text-sm font-bold rounded transition-colors ${
                targetGrade === preset.value 
                  ? 'bg-[#000000] text-[#FFFFFF]' 
                  : 'bg-[#EEEEEE] text-[#000000] hover:bg-[#DDDDDD]'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Required Average Result */}
      <div className="border-t border-[#EEEEEE] pt-5">
        <label className="block text-xs font-semibold text-[#545454] uppercase tracking-wide mb-3">
          Required on Remaining ({remainingWeight.toFixed(1)}% weight)
        </label>
        
        {remainingWeight <= 0 ? (
          <div className="flex items-center gap-3 p-4 bg-[#FAFAFA] rounded">
            <AlertCircle size={16} className="text-[#545454]" />
            <div>
              <p className="font-semibold text-sm">All weight is accounted for</p>
              <p className="text-xs text-[#545454]">
                Current grade: {currentGrade !== null ? `${currentGrade.toFixed(1)}%` : 'N/A'}
              </p>
            </div>
          </div>
        ) : requiredAverage !== null ? (
          <div className={`p-4 rounded ${
            isTargetAchievable ? 'bg-[#F0F7F4]' : 'bg-[#FEF2F2]'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {isTargetAchievable ? (
                  <>
                    {requiredAverage <= (currentGrade || 0) ? (
                      <TrendingDown size={16} className="text-[#05A357]" />
                    ) : (
                      <TrendingUp size={16} className="text-[#276EF1]" />
                    )}
                  </>
                ) : (
                  <AlertCircle size={16} className="text-[#E11D48]" />
                )}
                <span className="text-xs font-semibold uppercase text-[#545454]">
                  {isTargetAchievable ? 'Achievable' : 'Not Achievable'}
                </span>
              </div>
            </div>

            <div className="font-mono-grades text-4xl font-black mb-1">
              {requiredAverage > 100 ? (
                <span className="text-[#E11D48]">&gt;100%</span>
              ) : requiredAverage < 0 ? (
                <span className="text-[#05A357]">0%</span>
              ) : (
                <span className={isTargetAchievable ? 
                  (requiredAverage >= 90 ? 'text-[#000000]' : 'text-[#276EF1]') : 
                  'text-[#E11D48]'
                }>
                  {requiredAverage.toFixed(1)}%
                </span>
              )}
            </div>

            <p className="text-xs text-[#545454]">
              {isTargetAchievable 
                ? requiredAverage <= 0 
                  ? "You've already achieved your target! Any score will work."
                  : `Average this on remaining ${remainingWeight.toFixed(0)}% of work to hit ${targetGrade}%`
                : `Would require over 100% average — target too high for remaining ${remainingWeight.toFixed(0)}%`
              }
            </p>
          </div>
        ) : (
          <div className="p-4 bg-[#FAFAFA] rounded text-center text-[#545454] text-sm">
            Enter grades to see forecast
          </div>
        )}
      </div>

      {/* Best/Worst Case Scenario */}
      {forecast && remainingWeight > 0 && (
        <div className="border-t border-[#EEEEEE] pt-5 mt-5">
          <label className="block text-xs font-semibold text-[#545454] uppercase tracking-wide mb-3">
            Grade Range Projection
          </label>
          
          <div className="space-y-3">
            {/* Visual bar */}
            <div className="h-2 bg-[#EEEEEE] rounded-full overflow-hidden relative">
              {/* Possible range */}
              <div 
                className="absolute h-full bg-[#276EF1] opacity-30"
                style={{ 
                  left: `${Math.max(0, forecast.worst)}%`, 
                  width: `${Math.min(100, forecast.best) - Math.max(0, forecast.worst)}%` 
                }}
              />
              {/* Current position */}
              {forecast.current !== null && (
                <div 
                  className="absolute h-full w-1 bg-[#000000]"
                  style={{ left: `${Math.min(100, Math.max(0, forecast.current))}%` }}
                />
              )}
              {/* Target marker */}
              <div 
                className="absolute h-full w-0.5 bg-[#E11D48]"
                style={{ left: `${Math.min(100, Math.max(0, targetGrade))}%` }}
              />
            </div>

            {/* Labels */}
            <div className="flex justify-between text-xs">
              <div>
                <span className="text-[#545454]">Worst: </span>
                <span className="font-mono-grades font-semibold">{forecast.worst.toFixed(1)}%</span>
              </div>
              {forecast.current !== null && (
                <div>
                  <span className="text-[#545454]">Now: </span>
                  <span className="font-mono-grades font-bold">{forecast.current.toFixed(1)}%</span>
                </div>
              )}
              <div>
                <span className="text-[#545454]">Best: </span>
                <span className="font-mono-grades font-semibold text-[#05A357]">{forecast.best.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GradeForecast;
