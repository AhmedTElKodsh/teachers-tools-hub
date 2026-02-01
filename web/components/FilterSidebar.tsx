"use client";

import React, { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { SortOption } from "../types";
import SuggestToolModal from "./SuggestToolModal";
import ReportIssueModal from "./ReportIssueModal";

interface FilterSidebarProps {
  categories: string[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
  sortOption: SortOption;
  onSortChange: (sort: SortOption) => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  sortOption,
  onSortChange,
}) => {
  const { t, isRTL } = useLanguage();
  const [isSuggestModalOpen, setIsSuggestModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const getCategoryTranslation = (category: string): string => {
    const map: Record<string, keyof typeof t> = {
      "General Tools": "generalTools",
      "Lesson Planning": "lessonPlanning",
      "Presentation Tools": "presentationTools",
      "Student Assessment": "studentAssessment",
      "Study & Review": "studyReview",
      "Video Creation": "videoCreation",
      "Visual Content": "visualContent",
    };
    return t[map[category]] || category;
  };

  const sortOptions: { value: SortOption; label: keyof typeof t }[] = [
    { value: "alphabetical", label: "sortAlphabetical" },
    { value: "mostLiked", label: "sortMostLiked" },
    { value: "leastDisliked", label: "sortLeastDisliked" },
    { value: "bestRated", label: "sortBestRated" },
  ];

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
        <div className="sidebar-card bg-gradient-to-br from-white to-slate-50 dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 md:p-6 md:sticky md:top-8 animate-fade-in">
          {/* Sort Dropdown */}
          <div className="mb-6">
            <label
              className={`block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2 ${isRTL ? "font-cairo text-right" : ""}`}
            >
              {t.sortBy}
            </label>
            <select
              value={sortOption}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className={`w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700/80 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm ${isRTL ? "font-cairo text-right" : ""}`}
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {t[option.label]}
                </option>
              ))}
            </select>
          </div>

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
                  : "text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-600 dark:hover:border-slate-400"
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
                    : "text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-600 dark:hover:border-slate-400"
                } ${isRTL ? "text-right font-cairo" : "text-left"}`}
              >
                {getCategoryTranslation(category)}
              </button>
            ))}
          </nav>

          <div
            className={`mt-8 md:mt-10 pt-6 border-t border-slate-100 dark:border-slate-700 space-y-4 ${isRTL ? "font-cairo" : ""}`}
          >
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-lg p-4 border border-emerald-200 dark:border-emerald-700/50 shadow-sm">
              <h4
                className={`text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider mb-2 ${isRTL ? "text-right" : ""}`}
              >
                {t.proTip}
              </h4>
              <p
                className={`text-xs text-emerald-700 dark:text-emerald-300 leading-relaxed ${isRTL ? "text-right" : ""}`}
              >
                {t.proTipText}
              </p>
            </div>

            <button
              onClick={() => setIsSuggestModalOpen(true)}
              className="w-full bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-600 dark:to-slate-700 text-white px-4 py-3 rounded-lg text-sm font-semibold hover:from-slate-800 hover:to-slate-700 dark:hover:from-slate-500 dark:hover:to-slate-600 transition-all shadow-sm hover:shadow-md transform hover:scale-[1.02]"
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
