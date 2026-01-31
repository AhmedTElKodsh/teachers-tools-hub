"use client";

import React from "react";
import { useTheme } from "../contexts/ThemeContext";

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  if (!theme) return null;

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2.5 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 hover:from-slate-200 hover:to-slate-300 dark:hover:from-slate-600 dark:hover:to-slate-700 transition-all duration-300 shadow-md hover:shadow-lg border border-slate-300 dark:border-slate-600"
      aria-label={
        theme === "light" ? "Switch to dark mode" : "Switch to light mode"
      }
    >
      {theme === "dark" ? (
        // Sun Icon - Completely redesigned with modern aesthetic
        <svg
          className="w-6 h-6 text-amber-400 transition-transform duration-300 hover:rotate-45"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
                strokeWidth="2"
                stroke="currentColor"
                strokeLinecap="round"
                fill="none"
          />
        </svg>
      ) : (
        // Moon Icon - Completely redesigned with modern crescent and star
        <svg
          className="w-6 h-6 text-indigo-700 transition-transform duration-300 hover:-rotate-12"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Z" />
          <circle cx="19" cy="6" r="1.5" opacity="0.8" />
        </svg>
      )}
    </button>
  );
};

export default ThemeToggle;
