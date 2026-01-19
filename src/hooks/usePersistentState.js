import { useEffect, useState } from "react";

const readStorage = (key, fallback) => {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const stored = window.localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch (error) {
    console.warn("GradePilot storage read failed:", error);
    return fallback;
  }
};

const writeStorage = (key, value) => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn("GradePilot storage write failed:", error);
  }
};

const usePersistentState = (key, fallback) => {
  const [state, setState] = useState(() => readStorage(key, fallback));

  useEffect(() => {
    writeStorage(key, state);
  }, [key, state]);

  return [state, setState];
};

export default usePersistentState;
