"use client";

import { useSyncExternalStore } from "react";

// The member's peak program start date (YYYY-MM-DD), kept in this browser's
// localStorage because members have no account. It doesn't follow the member
// to another phone; that's an accepted trade-off for not logging in.

const KEY = "hk:peak-start";
const listeners = new Set<() => void>();

function read(): string | null {
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    return null; // storage blocked (e.g. some private modes)
  }
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  // Also react to changes from another tab.
  window.addEventListener("storage", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function setPeakStart(date: string | null) {
  try {
    if (date) window.localStorage.setItem(KEY, date);
    else window.localStorage.removeItem(KEY);
  } catch {
    // Can't persist; the UI just won't remember it after a reload.
  }
  listeners.forEach((l) => l());
}

// undefined = not known yet (server render / before hydration),
// null = not started, string = start date.
export function usePeakStart(): string | null | undefined {
  return useSyncExternalStore(subscribe, read, () => undefined);
}
