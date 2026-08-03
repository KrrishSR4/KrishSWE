import { useCallback, useEffect, useState } from "react";

export type Mode = "dark" | "light";
const KEY = "portfolio.mode";

function apply(mode: Mode) {
  const root = document.documentElement;
  root.classList.toggle("mode-light", mode === "light");
  root.classList.toggle("dark", mode === "dark");
  root.style.colorScheme = mode;
}

function read(): Mode {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw === "light" || raw === "dark") return raw;
  } catch {
    /* storage unavailable */
  }
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

/** Global dark/light mode. Class lives on <html> so every token cascades. */
export function useThemeMode() {
  const [mode, setMode] = useState<Mode>("dark");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const initial = read();
    setMode(initial);
    apply(initial);
    setReady(true);
  }, []);

  const set = useCallback((next: Mode) => {
    setMode(next);
    apply(next);
    try {
      window.localStorage.setItem(KEY, next);
    } catch {
      /* storage unavailable */
    }
  }, []);

  const toggle = useCallback(() => set(mode === "dark" ? "light" : "dark"), [mode, set]);

  return { mode, ready, set, toggle };
}
