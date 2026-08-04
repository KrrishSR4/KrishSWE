import { useThemeMode } from "@/lib/theme-mode";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { mode, ready, toggle } = useThemeMode();
  const light = mode === "light";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${light ? "dark" : "light"} mode`}
      aria-pressed={light}
      title={`${light ? "Dark" : "Light"} mode`}
      className={`label-xs group relative inline-flex shrink-0 items-center gap-0 border border-border-strong ${className}`}
    >
      <span
        className={`px-2 py-1.5 transition-colors flex items-center justify-center ${
          !light && ready ? "bg-foreground text-background" : "text-muted-foreground"
        }`}
      >
        <Moon className="h-4 w-4" />
      </span>
      <span
        className={`border-l border-border-strong px-2 py-1.5 transition-colors flex items-center justify-center ${
          light && ready ? "bg-foreground text-background" : "text-muted-foreground"
        }`}
      >
        <Sun className="h-4 w-4" />
      </span>
    </button>
  );
}
