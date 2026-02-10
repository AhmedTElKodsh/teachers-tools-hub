"use client";

import React from "react";
import { useLanguage } from "../contexts/LanguageContext";

const LanguageToggle: React.FC = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="px-3 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors font-semibold text-sm text-foreground dark:text-foreground"
      aria-label={language === "en" ? "Switch to Arabic" : "Switch to English"}
    >
      {language === "en" ? "العربية" : "English"}
    </button>
  );
};

export default LanguageToggle;
