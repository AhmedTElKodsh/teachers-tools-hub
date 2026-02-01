"use client";

import React from "react";
import { Tool, SortOption, FilterOption } from "../types";
import ToolCard from "./ToolCard";
import { useLanguage } from "../contexts/LanguageContext";
import { useToolVotes } from "../hooks/useToolVotes";

interface ToolGridProps {
  tools: Tool[];
  sortOption: SortOption;
  filterOption: FilterOption;
}

const ToolGrid: React.FC<ToolGridProps> = ({
  tools,
  sortOption,
  filterOption,
}) => {
  const { t, isRTL } = useLanguage();
  const { getAverageRating } = useToolVotes();

  // Filter and sort tools
  const processedTools = React.useMemo(() => {
    // First, filter by rating
    let filtered = tools;

    if (filterOption === "4plus") {
      filtered = tools.filter((tool) => getAverageRating(tool.id) >= 4);
    } else if (filterOption === "3plus") {
      filtered = tools.filter((tool) => getAverageRating(tool.id) >= 3);
    }

    // Then sort
    switch (sortOption) {
      case "highestRated":
        return [...filtered].sort(
          (a, b) => getAverageRating(b.id) - getAverageRating(a.id),
        );

      case "lowestRated":
        return [...filtered].sort(
          (a, b) => getAverageRating(a.id) - getAverageRating(b.id),
        );

      case "alphabetical":
      default:
        return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    }
  }, [tools, sortOption, filterOption, getAverageRating]);

  if (processedTools.length === 0) {
    return (
      <div className="flex-1 text-center py-16 md:py-20 bg-white dark:bg-slate-800 rounded-xl border border-dashed border-slate-300 dark:border-slate-600">
        <p
          className={`text-foreground dark:text-foreground ${isRTL ? "font-cairo" : ""}`}
        >
          {t.noTools}
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        {processedTools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </div>
  );
};

export default ToolGrid;
