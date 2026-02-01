"use client";

import React, { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { SortOption, FilterOption } from "../types";
import SuggestToolModal from "./SuggestToolModal";
import ReportIssueModal from "./ReportIssueModal";

interface FilterSidebarProps {
  categories: string[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
  sortOption: SortOption;
  onSortChange: (sort: SortOption) => void;
  filterOption: FilterOption;
  onFilterChange: (filter: FilterOption) => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  sortOption,
  onSortChange,
  filterOption,
  onFilterChange,
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
    { value: "highestRated", label: "sortHighestRated" },
    { value: "lowestRated", label: "sortLowestRated" },
  ];

  const filterOptions: { value: FilterOption; label: string }[] = [
    { value: "all", label: isRTL ? "الكل" : "All" },
    { value: "4plus", label: "4+ ⭐" },
    { value: "3plus", label: "3+ ⭐" },
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
        <div className="sidebar-card rounded-xl p-4 md:p-6 md:sticky md:top-8 animate-fade-in">
          {/* Sort Dropdown */}
          <div className="mb-6">
            <label
              className={`block text-sm font-semibold text-foreground dark:text-foreground mb-2 ${isRTL ? "font-cairo text-right" : ""}`}
            >
              {t.sortBy}
            </label>
            <select
              value={sortOption}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className={`w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-800 !text-white dark:bg-slate-700/80 dark:text-foreground text-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all shadow-sm backdrop-blur-sm ${isRTL ? "font-cairo text-right" : ""}`}
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value} className="bg-slate-800 text-white">
                  {t[option.label]}
                </option>
              ))}
            </select>
          </div>

          {/* Filter by Rating */}
          <div className="mb-6">
            <label
              className={`block text-sm font-semibold text-foreground dark:text-foreground mb-2 ${isRTL ? "font-cairo text-right" : ""}`}
            >
              {isRTL ? "تصفية حسب التقييم" : "Filter by Rating"}
            </label>
            <div className="flex gap-2">
              {filterOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => onFilterChange(option.value)}
                  className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    filterOption === option.value
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md"
                      : "bg-slate-100 dark:bg-slate-700/50 text-foreground dark:text-foreground hover:bg-slate-200 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <h2
            className={`text-lg font-bold bg-clip-text text-foreground dark:text-foreground mb-4 md:mb-6 ${isRTL ? "font-cairo text-right" : ""}`}
          >
            {t.workflowCategories}
          </h2>
          <nav className="space-y-1">
            <button
              onClick={() => onSelectCategory(null)}
              className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-lg text-sm font-medium transition-all ${
                selectedCategory === null
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 text-white shadow-md hover:shadow-lg dark:shadow-blue-500/20 transform hover:scale-[1.02]"
                  : "text-foreground dark:text-foreground hover:bg-slate-100 dark:hover:bg-slate-700/80 hover:text-foreground dark:hover:text-white border border-slate-200 dark:border-slate-600 dark:hover:border-slate-500"
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
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 text-white shadow-md hover:shadow-lg dark:shadow-blue-500/20 transform hover:scale-[1.02]"
                    : "text-foreground dark:text-foreground hover:bg-slate-100 dark:hover:bg-slate-700/80 hover:text-foreground dark:hover:text-white border border-slate-200 dark:border-slate-600 dark:hover:border-slate-500"
                } ${isRTL ? "text-right font-cairo" : "text-left"}`}
              >
                {getCategoryTranslation(category)}
              </button>
            ))}
          </nav>

          <div
            className={`mt-8 md:mt-10 pt-6 border-t border-slate-100 dark:border-slate-700 space-y-4 ${isRTL ? "font-cairo" : ""}`}
          >
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 dark:from-slate-700 dark:to-slate-800 rounded-lg p-4 border border-slate-700 dark:border-emerald-500/40 shadow-sm dark:shadow-lg dark:shadow-emerald-500/10">
              <h4
                className={`text-xs font-bold !text-white dark:text-emerald-400 uppercase tracking-wider mb-2 ${isRTL ? "text-right" : ""}`}
              >
                {t.proTip}
              </h4>
              <p
                className={`text-xs !text-white/90 dark:text-foreground leading-relaxed ${isRTL ? "text-right" : ""}`}
              >
                {t.proTipText}
              </p>
            </div>

            <button
              onClick={() => setIsSuggestModalOpen(true)}
              className="w-full bg-gradient-to-r from-slate-900 to-slate-800 dark:from-blue-600 dark:to-purple-600 text-white px-4 py-3 rounded-lg text-sm font-semibold hover:from-slate-800 hover:to-slate-700 dark:hover:from-blue-500 dark:hover:to-purple-500 transition-all shadow-sm hover:shadow-md dark:shadow-lg dark:hover:shadow-xl dark:hover:shadow-blue-500/20 transform hover:scale-[1.02]"
            >
              {t.suggestTool}
            </button>

            <p
              className={`text-[10px] text-center text-slate-600 dark:text-slate-500 px-2 leading-tight ${isRTL ? "font-cairo" : ""}`}
            >
              {t.foundIssue}{" "}
              <button
                onClick={() => setIsReportModalOpen(true)}
                className="underline hover:text-foreground dark:hover:text-foreground transition-colors"
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
