"use client";

import React, { useState, useMemo } from "react";
import toolsData from "../data/tools.json";
import { Tool, SortOption, FilterOption } from "../types";
import FilterSidebar from "../components/FilterSidebar";
import ToolGrid from "../components/ToolGrid";
import LanguageToggle from "../components/LanguageToggle";
import ThemeToggle from "../components/ThemeToggle";
import { useLanguage } from "../contexts/LanguageContext";

// Disable static generation for this page
export const dynamic = "force-dynamic";

export default function Home() {
  const tools = toolsData as Tool[];
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("alphabetical");
  const [filterOption, setFilterOption] = useState<FilterOption>("all");
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
    <main className="min-h-screen transition-colors">
      {/* Header */}
      <header className="relative py-8 md:py-12 px-4 md:px-6 overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 animate-gradient"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Top Bar with Toggles */}
          <div
            className={`flex items-center justify-end gap-2 mb-6 ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <a
              href="/admin/dashboard"
              className="p-2 rounded-lg bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-700/80 transition-colors shadow-sm border border-slate-200 dark:border-slate-600 dark:text-white group backdrop-blur-sm"
              aria-label="Admin Dashboard"
              title={isRTL ? "ادمن" : "Admin"}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-slate-900 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400"
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
            <ThemeToggle />
            <LanguageToggle />
          </div>

          {/* Title and Description */}
          <div className="text-center">
            {/* Decorative element */}
            <div className="flex items-center justify-center gap-3 mb-4 animate-fade-in">
              <div className="h-1 w-12 bg-gradient-to-r from-transparent via-[#c96847] to-transparent rounded-full"></div>
              <svg className="w-6 h-6 text-[#c96847] dark:text-[#e08968]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3L1 9l11 6 9-4.91V17h2V9M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
              </svg>
              <div className="h-1 w-12 bg-gradient-to-r from-transparent via-[#c96847] to-transparent rounded-full"></div>
            </div>

            <h1
              className={`text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 animate-fade-in heading-accent ${isRTL ? "font-cairo" : ""}`}
              style={{
                color: 'var(--foreground)',
                textShadow: '2px 2px 4px rgba(201, 104, 71, 0.1)'
              }}
            >
              {t.title}
            </h1>
            <p
              className={`text-base md:text-xl text-foreground/80 dark:text-foreground/80 max-w-3xl mx-auto mb-3 leading-relaxed animate-fade-in ${isRTL ? "font-cairo" : ""}`}
              style={{ animationDelay: "0.15s" }}
            >
              {t.subtitle}{" "}
              <span className="font-semibold relative inline-block">
                <span className="relative z-10" style={{ color: 'var(--terracotta)' }}>
                  {t.hours}
                </span>
                <span className="absolute bottom-0 left-0 w-full h-2 bg-[#7a9d7e] dark:bg-[#9bb89e] opacity-30 -z-10"></span>
              </span>
              . {t.forClassrooms}
            </p>

            {/* Search Bar */}
            <div
              className="max-w-2xl mx-auto relative mt-8 md:mt-10 animate-fade-in"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="relative group">
                <input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full px-5 md:px-7 py-4 md:py-5 bg-white dark:bg-[#2d231c] border-2 border-[#e7dfd6] dark:border-[#4a3a2e] rounded-xl focus:outline-none transition-all shadow-md hover:shadow-lg focus:shadow-lg text-foreground dark:text-foreground placeholder-[#8b7d6b] dark:placeholder-[#a89885] font-medium ${isRTL ? "text-right font-cairo pr-14 pl-5" : "pl-7 pr-14"}`}
                  style={{
                    borderLeftWidth: '5px',
                    borderLeftColor: 'var(--sage)'
                  }}
                  dir={isRTL ? "rtl" : "ltr"}
                />
                <div
                  className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? "left-5" : "right-5"}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-[#c96847] dark:text-[#e08968] group-focus-within:animate-pulse"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>

              {/* Search hint */}
              <p className="text-xs text-center text-foreground/50 dark:text-foreground/50 mt-3 font-medium">
                {isRTL ? "ابحث عن الأدوات حسب الاسم أو الفئة أو الوصف" : "Search by tool name, category, or description"}
              </p>
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
            filterOption={filterOption}
            onFilterChange={setFilterOption}
          />
          <ToolGrid
            tools={filteredTools}
            sortOption={sortOption}
            filterOption={filterOption}
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t py-6 md:py-8 px-4 md:px-6 mt-12">
        <div
          className={`max-w-7xl mx-auto text-center text-foreground/80 dark:text-foreground/80 text-sm ${isRTL ? "font-cairo" : ""}`}
        >
          <p>{t.footer}</p>
        </div>
      </footer>
    </main>
  );
}
