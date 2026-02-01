"use client";

import React from "react";
import { Tool } from "../types";
import { useLanguage } from "../contexts/LanguageContext";
import { useToolVotes } from "../hooks/useToolVotes";

interface ToolCardProps {
  tool: Tool;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
  const { t, isRTL, language } = useLanguage();
  const { getUserVote, getAverageRating, rate, getVotes } = useToolVotes();

  const userRating = getUserVote(tool.id);
  const averageRating = getAverageRating(tool.id);
  const votes = getVotes(tool.id);

  // Get the appropriate text based on language
  const description =
    language === "ar" && tool.description_ar
      ? tool.description_ar
      : tool.description;
  const freeTier =
    language === "ar" && tool.freeTier_ar ? tool.freeTier_ar : tool.freeTier;
  const limitations =
    language === "ar" && tool.limitations_ar
      ? tool.limitations_ar
      : tool.limitations;

  // Translate category name if in Arabic
  const categoryName =
    language === "ar" && tool.categories[0] in t
      ? t[tool.categories[0] as keyof typeof t]
      : tool.categories[0];

  const handleRate = (rating: 1 | 2 | 3 | 4 | 5) => {
    rate(tool.id, rating);
  };

  const renderStars = () => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleRate(star as 1 | 2 | 3 | 4 | 5)}
            className="transition-transform hover:scale-110 focus:outline-none"
            title={`Rate ${star} star${star > 1 ? "s" : ""}`}
          >
            <svg
              className={`w-5 h-5 transition-colors ${
                userRating && star <= userRating
                  ? "text-amber-400 fill-amber-400"
                  : star <= Math.round(averageRating)
                    ? "text-amber-300 fill-amber-300"
                    : "text-slate-300 dark:text-slate-600 fill-slate-300 dark:fill-slate-600"
              }`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="tool-card rounded-xl p-4 md:p-6 flex flex-col h-full hover-scale animate-fade-in relative overflow-hidden group">
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none bg-gradient-to-br from-blue-500/5 to-purple-500/5 dark:from-blue-400/10 dark:to-purple-400/10"></div>

      <div className="flex-1 relative z-10">
        {/* Title and Category - Stacked Vertically */}
        <div className={`mb-4 ${isRTL ? "text-right" : ""}`}>
          <h3
            className={`text-lg md:text-xl font-bold text-foreground dark:text-foreground mb-2 ${isRTL ? "text-left" : ""}`}
            dir="ltr"
          >
            {tool.name}
          </h3>
          <span className="category-badge inline-block bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-400 dark:to-purple-400 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
            {categoryName}
          </span>
        </div>

        <p
          className={`text-foreground dark:text-foreground text-sm mb-4 line-clamp-3 ${isRTL ? "text-right font-cairo" : ""}`}
          dir={isRTL ? "rtl" : "ltr"}
        >
          {description}
        </p>

        <div className="space-y-3 mb-6">
          <div
            className={`flex items-start gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <div className="mt-1 shrink-0">
              <svg
                className="w-4 h-4 text-emerald-500 dark:text-emerald-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p
              className={`text-xs text-foreground dark:text-foreground font-medium ${isRTL ? "text-right font-cairo" : ""}`}
              dir={isRTL ? "rtl" : "ltr"}
            >
              <span className="text-foreground dark:text-foreground">
                {t.free}:
              </span>{" "}
              {freeTier}
            </p>
          </div>
          {limitations && (
            <div
              className={`flex items-start gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <div className="mt-1 shrink-0">
                <svg
                  className="w-4 h-4 text-amber-500 dark:text-amber-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <p
                className={`text-xs text-foreground dark:text-foreground italic ${isRTL ? "text-right font-cairo" : ""}`}
                dir={isRTL ? "rtl" : "ltr"}
              >
                {limitations}
              </p>
            </div>
          )}
        </div>

        {/* Star Rating */}
        <div
          className={`flex items-center gap-3 mb-4 ${isRTL ? "flex-row-reverse" : ""}`}
        >
          {renderStars()}
          <div className="flex items-center gap-1 text-xs text-foreground dark:text-foreground">
            <span className="font-semibold">{averageRating.toFixed(1)}</span>
            <span>({votes.ratingCount})</span>
          </div>
        </div>
      </div>

      <a
        href={tool.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`relative z-10 block w-full text-center bg-gradient-to-r from-slate-900 to-slate-800 dark:from-blue-600 dark:to-purple-600 text-white py-2.5 rounded-lg font-medium hover:from-slate-800 hover:to-slate-700 dark:hover:from-blue-500 dark:hover:to-purple-500 transition-all shadow-sm hover:shadow-md mt-auto border border-slate-700 dark:border-blue-500 ${isRTL ? "font-cairo" : ""}`}
      >
        {t.viewTool}
      </a>
    </div>
  );
};

export default ToolCard;
