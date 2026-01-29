"use client";

import React from "react";
import { Tool, SortOption } from "../types";
import ToolCard from "./ToolCard";
import { useLanguage } from "../contexts/LanguageContext";
import { useToolVotes } from "../hooks/useToolVotes";

interface ToolGridProps {
  tools: Tool[];
  sortOption: SortOption;
}

const ToolGrid: React.FC<ToolGridProps> = ({ tools, sortOption }) => {
  const { t, isRTL } = useLanguage();
  const { getVotes } = useToolVotes();

  // Sort tools based on selected option
  const sortedTools = React.useMemo(() => {
    const toolsWithVotes = tools.map((tool) => ({
      tool,
      votes: getVotes(tool.id),
    }));

    switch (sortOption) {
      case "mostLiked":
        return toolsWithVotes
          .sort((a, b) => b.votes.likes - a.votes.likes)
          .map((item) => item.tool);

      case "leastDisliked":
        return toolsWithVotes
          .sort((a, b) => a.votes.dislikes - b.votes.dislikes)
          .map((item) => item.tool);

      case "bestRated":
        return toolsWithVotes
          .sort((a, b) => {
            const scoreA = a.votes.likes - a.votes.dislikes;
            const scoreB = b.votes.likes - b.votes.dislikes;
            return scoreB - scoreA;
          })
          .map((item) => item.tool);

      case "alphabetical":
      default:
        return [...tools].sort((a, b) => a.name.localeCompare(b.name));
    }
  }, [tools, sortOption, getVotes]);

  if (sortedTools.length === 0) {
    return (
      <div className="flex-1 text-center py-16 md:py-20 bg-white dark:bg-slate-800 rounded-xl border border-dashed border-slate-300 dark:border-slate-600">
        <p
          className={`text-slate-500 dark:text-slate-400 ${isRTL ? "font-cairo" : ""}`}
        >
          {t.noTools}
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        {sortedTools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </div>
  );
};

export default ToolGrid;
