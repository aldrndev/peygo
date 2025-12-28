"use client";

import { useSyncExternalStore } from "react";

/**
 * Custom hook to detect user's motion preference.
 * Returns true if user prefers reduced motion.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeToMotionPreference,
    getMotionPreference,
    getServerMotionPreference
  );
}

function getMotionPreference(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getServerMotionPreference(): boolean {
  return false;
}

function subscribeToMotionPreference(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
}
