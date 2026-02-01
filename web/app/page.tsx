"use client";

import React, { useState, useMemo } from "react";
import toolsData from "../data/tools.json";
import { Tool, SortOption } from "../types";
import FilterSidebar from "../components/FilterSidebar";
import ToolGrid from "../components/ToolGrid";
import LanguageToggle from "../components/LanguageToggle";
import { useLanguage } from "../contexts/LanguageContext";

// Disable static generation for this page
export const dynamic = "force-dynamic";

export default function Home() {
  const tools = toolsData as Tool[];
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("alphabetical");
  const { t, isRTL } = useLanguage();

  const categories = useMemo(() => {
    const allCategories = tools.flatMap((tool) => tool.categories);
    return Array.from(new Set(allCategories)).sort();
  }, [tools]);

  const filteredTools = useMemo(() => {
    let result = tools;

    if (selectedCategory) {
      result = result.filter((tool) =>
        tool.categories.includes(selectedCategory),
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (tool) =>
          tool.name.toLowerCase().includes(query) ||
          tool.description.toLowerCase().includes(query) ||
          tool.categories.some((cat) => cat.toLowerCase().includes(query)),
      );
    }

    return result;
  }, [tools, selectedCategory, searchQuery]);

  return (
    <main className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Header */}
      <header className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 py-8 md:py-12 px-4 md:px-6 overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/8 via-purple-500/8 to-pink-500/8 dark:bg-transparent animate-gradient"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Top Bar with Toggles */}
          <div
            className={`flex items-center justify-end gap-2 mb-6 ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <a
              href="/admin/dashboard"
              className="p-2 rounded-lg bg-white dark:bg-slate-800/90 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm border border-slate-200 dark:border-slate-700 dark:text-white group backdrop-blur-sm"
              aria-label="Admin Dashboard"
              title={isRTL ? "ادمن" : "Admin"}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-slate-600 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </a>
            <LanguageToggle />
          </div>

          {/* Title and Description */}
          <div className="text-center">
            <h1
              className={`text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent mb-4 animate-fade-in ${isRTL ? "font-cairo" : ""}`}
            >
              {t.title}
            </h1>
            <p
              className={`text-base md:text-lg text-slate-700 dark:text-slate-100 max-w-2xl mx-auto mb-2 animate-fade-in ${isRTL ? "font-cairo" : ""}`}
              style={{ animationDelay: "0.1s" }}
            >
              {t.subtitle}{" "}
              <span className="text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text font-bold">
                {t.hours}
              </span>
              . {t.forClassrooms}
            </p>

            {/* Search Bar */}
            <div
              className="max-w-xl mx-auto relative mt-6 md:mt-8 animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full px-4 md:px-6 py-3 md:py-4 bg-white dark:bg-slate-800 backdrop-blur-sm border border-slate-300 dark:border-slate-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent focus:bg-white dark:focus:bg-slate-800 transition-all shadow-sm hover:shadow-md text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 ${isRTL ? "text-right font-cairo pr-12 pl-4" : "pl-6 pr-12"}`}
                dir={isRTL ? "rtl" : "ltr"}
              />
              <div
                className={`absolute top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-300 ${isRTL ? "left-4" : "right-4"}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto py-8 md:py-12 px-4 md:px-6">
        <div
          className={`flex flex-col md:flex-row gap-6 md:gap-8 ${isRTL ? "md:flex-row-reverse" : ""}`}
        >
          <FilterSidebar
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            sortOption={sortOption}
            onSortChange={setSortOption}
          />
          <ToolGrid tools={filteredTools} sortOption={sortOption} />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 py-6 md:py-8 px-4 md:px-6 mt-12">
        <div
          className={`max-w-7xl mx-auto text-center text-slate-500 dark:text-slate-400 text-sm ${isRTL ? "font-cairo" : ""}`}
        >
          <p>{t.footer}</p>
        </div>
      </footer>
    </main>
  );
}
