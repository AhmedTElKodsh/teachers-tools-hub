"use client";

import React from "react";
import { Tool } from "../types";
import ToolCard from "./ToolCard";
import { useLanguage } from "../contexts/LanguageContext";

interface ToolGridProps {
  tools: Tool[];
}

const ToolGrid: React.FC<ToolGridProps> = ({ tools }) => {
  const { t, isRTL } = useLanguage();

  if (tools.length === 0) {
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
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </div>
  );
};

export default ToolGrid;
