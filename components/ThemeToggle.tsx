"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "../contexts/ThemeContext";

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted before rendering to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render until mounted to prevent hydration issues
  if (!mounted) {
    return (
      <div className="relative p-2 rounded-lg bg-white/90 dark:bg-slate-800/90 shadow-sm border border-slate-200 dark:border-slate-600 backdrop-blur-sm" />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-lg bg-white/90 dark:bg-slate-800/90 hover:bg-slate-50 dark:hover:bg-slate-700/90 transition-all duration-300 shadow-sm hover:shadow-md border border-slate-200 dark:border-slate-600 group backdrop-blur-sm"
      aria-label={
        theme === "light" ? "Switch to dark mode" : "Switch to light mode"
      }
      title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
    >
      <div className="relative w-5 h-5">
        {/* Sun Icon - Shows in dark mode (click to go to light) */}
        <svg
          className={`absolute inset-0 w-5 h-5 text-amber-500 dark:text-amber-400 transition-all duration-500 ${
            theme === "dark"
              ? "opacity-100 rotate-0 scale-100"
              : "opacity-0 -rotate-90 scale-50"
          } group-hover:rotate-45 drop-shadow-lg`}
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="12" cy="12" r="4" />
          <path
            d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
            strokeWidth="2"
            stroke="currentColor"
            strokeLinecap="round"
            fill="none"
          />
        </svg>

        {/* Moon Icon - Shows in light mode (click to go to dark) */}
        <svg
          className={`absolute inset-0 w-5 h-5 text-indigo-600 dark:text-indigo-400 transition-all duration-500 ${
            theme === "light"
              ? "opacity-100 rotate-0 scale-100"
              : "opacity-0 rotate-90 scale-50"
          } group-hover:-rotate-12 drop-shadow-lg`}
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Z" />
          <circle cx="19" cy="6" r="1.5" opacity="0.8" />
        </svg>
      </div>
    </button>
  );
};

export default ThemeToggle;
