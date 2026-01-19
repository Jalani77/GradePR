const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const sumCategoryWeights = (categories) =>
  categories.reduce((total, category) => total + toNumber(category.weight), 0);

export const calculateCategoryScore = (category) => {
  const totals = category.assignments.reduce(
    (acc, assignment) => {
      const earned = toNumber(assignment.score);
      const possible = toNumber(assignment.total);
      return {
        earned: acc.earned + earned,
        possible: acc.possible + possible,
      };
    },
    { earned: 0, possible: 0 }
  );

  if (totals.possible <= 0) {
    return null;
  }

  return (totals.earned / totals.possible) * 100;
};

export const calculateWeightedTotals = (categories) => {
  let earnedPoints = 0;
  let loggedWeight = 0;

  categories.forEach((category) => {
    const weight = toNumber(category.weight);
    if (weight <= 0) {
      return;
    }
    const score = calculateCategoryScore(category);
    if (score === null) {
      return;
    }

    loggedWeight += weight;
    earnedPoints += (score * weight) / 100;
  });

  const totalWeight = sumCategoryWeights(categories);
  const remainingWeight = Math.max(0, 100 - loggedWeight);
  const currentAverage =
    loggedWeight > 0 ? (earnedPoints / loggedWeight) * 100 : 0;

  return {
    earnedPoints,
    loggedWeight,
    remainingWeight,
    totalWeight,
    currentAverage,
  };
};

export const calculateRequiredAverage = (target, earnedPoints, remainingWeight) =>
  remainingWeight > 0
    ? ((toNumber(target) - earnedPoints) / remainingWeight) * 100
    : null;

export const getPerformanceBadge = (average, scale) => {
  const normalized = toNumber(average);

  if (normalized >= scale.a) {
    return { label: "A-TIER", tone: "uberGreen" };
  }
  if (normalized >= scale.b) {
    return { label: "STABLE", tone: "uberBlue" };
  }
  if (normalized >= scale.c) {
    return { label: "FOCUS", tone: "muted" };
  }

  return { label: "AT-RISK", tone: "alertRed" };
};

export const formatPercent = (value, digits = 1) => {
  if (!Number.isFinite(value)) {
    return "—";
  }
  return `${value.toFixed(digits)}%`;
};
