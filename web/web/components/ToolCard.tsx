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
            className="transition-all hover:scale-125 focus:outline-none group/star relative"
            title={`Rate ${star} star${star > 1 ? "s" : ""}`}
          >
            <svg
              className={`w-5 h-5 transition-all duration-300 ${
                userRating && star <= userRating
                  ? "drop-shadow-[0_3px_6px_rgba(240,176,112,0.8)] dark:drop-shadow-[0_4px_10px_rgba(255,200,130,1)]"
                  : star <= Math.round(averageRating)
                    ? "drop-shadow-[0_2px_4px_rgba(212,151,92,0.6)] dark:drop-shadow-[0_3px_8px_rgba(240,176,112,0.9)]"
                    : "opacity-40 dark:opacity-25"
              }`}
              style={{
                color:
                  userRating && star <= userRating
                    ? "#f0b070"
                    : star <= Math.round(averageRating)
                      ? "#e0a870"
                      : "#8b7d6b",
                fill:
                  userRating && star <= userRating
                    ? "#f0b070"
                    : star <= Math.round(averageRating)
                      ? "#e0a870"
                      : "#8b7d6b",
                stroke:
                  userRating && star <= userRating
                    ? "#d4975c"
                    : star <= Math.round(averageRating)
                      ? "#c98847"
                      : "transparent",
                strokeWidth:
                  (userRating && star <= userRating) ||
                  star <= Math.round(averageRating)
                    ? "1px"
                    : "0",
                filter:
                  (userRating && star <= userRating) ||
                  star <= Math.round(averageRating)
                    ? "brightness(1.15) contrast(1.1)"
                    : "none",
              }}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            {/* Sparkle effect on hover */}
            <div className="absolute inset-0 opacity-0 group-hover/star:opacity-100 transition-opacity pointer-events-none">
              <svg
                className="w-5 h-5 animate-pulse"
                style={{ color: "#ffc882", filter: "brightness(1.3)" }}
                fill="currentColor"
                viewBox="0 0 24 24"
                opacity="0.7"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="tool-card rounded-lg p-5 md:p-7 flex flex-col h-full hover-scale animate-fade-in relative overflow-hidden group corner-fold">
      {/* Decorative header accent */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#7a9d7e] to-transparent opacity-50"></div>

      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg pointer-events-none bg-gradient-to-br from-[#c96847]/5 to-[#7a9d7e]/5 dark:from-[#e08968]/8 dark:to-[#9bb89e]/8"></div>

      <div className="flex-1 relative z-10">
        {/* Title and Category */}
        <div className={`mb-5 ${isRTL ? "text-right" : ""}`}>
          <div className="flex items-start justify-between gap-3 mb-3">
            <h3
              className={`text-xl md:text-2xl font-bold text-foreground dark:text-foreground leading-tight ${isRTL ? "text-left font-cairo" : ""}`}
              style={{
                fontFamily: "var(--font-heading)",
                letterSpacing: "-0.02em",
              }}
              dir="ltr"
            >
              {tool.name}
            </h3>
            {/* Book icon decoration */}
            <svg
              className="w-5 h-5 text-[#7a9d7e] dark:text-[#9bb89e] shrink-0 mt-1 animate-float"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z" />
            </svg>
          </div>
          <span className="category-badge inline-block text-white text-xs font-bold px-4 py-1.5 rounded-md">
            {categoryName}
          </span>
        </div>

        <p
          className={`text-foreground/80 dark:text-foreground/80 text-sm leading-relaxed mb-5 line-clamp-3 ${isRTL ? "text-right font-cairo" : ""}`}
          dir={isRTL ? "rtl" : "ltr"}
        >
          {description}
        </p>

        <div className="space-y-3 mb-6 border-l-2 border-[#7a9d7e]/30 dark:border-[#9bb89e]/30 pl-3">
          <div
            className={`flex items-start gap-2.5 ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <div className="mt-0.5 shrink-0">
              <svg
                className="w-4 h-4"
                style={{ color: "var(--accent-success)" }}
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
              </svg>
            </div>
            <p
              className={`text-xs text-foreground dark:text-foreground font-semibold ${isRTL ? "text-right font-cairo" : ""}`}
              dir={isRTL ? "rtl" : "ltr"}
            >
              <span style={{ color: "var(--sage)" }}>{t.free}:</span> {freeTier}
            </p>
          </div>
          {limitations && (
            <div
              className={`flex items-start gap-2.5 ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <div className="mt-0.5 shrink-0">
                <svg
                  className="w-4 h-4"
                  style={{ color: "var(--accent-warning)" }}
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
                </svg>
              </div>
              <p
                className={`text-xs text-foreground/70 dark:text-foreground/70 ${isRTL ? "text-right font-cairo" : ""}`}
                dir={isRTL ? "rtl" : "ltr"}
              >
                {limitations}
              </p>
            </div>
          )}
        </div>

        {/* Star Rating */}
        <div
          className={`flex items-center gap-3 mb-5 pb-5 border-b border-[#e7dfd6] dark:border-[#4a3a2e] ${isRTL ? "flex-row-reverse" : ""}`}
        >
          {renderStars()}
          <div
            className="flex items-center gap-1.5 text-xs font-bold"
            style={{ color: "var(--accent-star)" }}
          >
            <span className="text-base">{averageRating.toFixed(1)}</span>
            <span className="text-foreground/50 dark:text-foreground/50 font-normal">
              ({votes.ratingCount})
            </span>
          </div>
        </div>
      </div>

      <a
        href={tool.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`relative z-10 block w-full text-center btn-gradient-primary text-white py-3.5 rounded-lg font-bold transition-all mt-auto overflow-hidden group/btn ${isRTL ? "font-cairo" : ""}`}
        style={{
          fontFamily: "var(--font-sans)",
          letterSpacing: "0.02em",
        }}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {t.viewTool}
          <svg
            className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </span>
      </a>
    </div>
  );
};

export default ToolCard;
