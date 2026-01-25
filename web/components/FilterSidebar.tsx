"use client";

import React, { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import SuggestToolModal from "./SuggestToolModal";
import ReportIssueModal from "./ReportIssueModal";

interface FilterSidebarProps {
  categories: string[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  const { t, isRTL } = useLanguage();
  const [isSuggestModalOpen, setIsSuggestModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const getCategoryTranslation = (category: string): string => {
    const map: Record<string, keyof typeof t> = {
      "General Assistants": "generalAssistants",
      "Lesson Planning": "lessonPlanning",
      "Presentation Tools": "presentationTools",
      "Student Assessment": "studentAssessment",
      "Study & Review": "studyReview",
      "Video Creation": "videoCreation",
      "Visual Content": "visualContent",
    };
    return t[map[category]] || category;
  };

  return (
    <>
      <SuggestToolModal
        isOpen={isSuggestModalOpen}
        onClose={() => setIsSuggestModalOpen(false)}
      />
      <ReportIssueModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
      
      <div className="w-full md:w-64 shrink-0">
      <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 md:p-6 md:sticky md:top-8 animate-fade-in">
        <h2
          className={`text-lg font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent mb-4 md:mb-6 ${isRTL ? "font-cairo text-right" : ""}`}
        >
          {t.workflowCategories}
        </h2>
        <nav className="space-y-1">
          <button
            onClick={() => onSelectCategory(null)}
            className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-lg text-sm font-medium transition-all ${
              selectedCategory === null
                ? "bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 text-white shadow-md hover:shadow-lg transform hover:scale-[1.02]"
                : "text-slate-600 dark:text-slate-300 hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100 dark:hover:from-slate-700 dark:hover:to-slate-600 hover:text-slate-900 dark:hover:text-slate-100"
            } ${isRTL ? "text-right font-cairo" : "text-left"}`}
          >
            {t.allTools}
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onSelectCategory(category)}
              className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-lg text-sm font-medium transition-all ${
                selectedCategory === category
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 text-white shadow-md hover:shadow-lg transform hover:scale-[1.02]"
                  : "text-slate-600 dark:text-slate-300 hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100 dark:hover:from-slate-700 dark:hover:to-slate-600 hover:text-slate-900 dark:hover:text-slate-100"
              } ${isRTL ? "text-right font-cairo" : "text-left"}`}
            >
              {getCategoryTranslation(category)}
            </button>
          ))}
        </nav>

        <div
          className={`mt-8 md:mt-10 pt-6 border-t border-slate-100 dark:border-slate-700 space-y-4 ${isRTL ? "font-cairo" : ""}`}
        >
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-lg p-4 border border-emerald-200 dark:border-emerald-800 shadow-sm">
            <h4
              className={`text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider mb-2 ${isRTL ? "text-right" : ""}`}
            >
              {t.proTip}
            </h4>
            <p
              className={`text-xs text-emerald-700 dark:text-emerald-400 leading-relaxed ${isRTL ? "text-right" : ""}`}
            >
              {t.proTipText}
            </p>
          </div>

          <button
            onClick={() => setIsSuggestModalOpen(true)}
            className="w-full bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-700 dark:to-slate-600 text-white px-4 py-3 rounded-lg text-sm font-semibold hover:from-slate-800 hover:to-slate-700 dark:hover:from-slate-600 dark:hover:to-slate-500 transition-all shadow-sm hover:shadow-md transform hover:scale-[1.02]"
          >
            {t.suggestTool}
          </button>

          <p
            className={`text-[10px] text-center text-slate-400 dark:text-slate-500 px-2 leading-tight ${isRTL ? "font-cairo" : ""}`}
          >
            {t.foundIssue}{" "}
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="underline hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              {t.reportHere}
            </button>
            .
          </p>
        </div>
      </div>
    </div>
    </>
  );
};

export default FilterSidebar;
