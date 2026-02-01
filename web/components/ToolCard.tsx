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
  const { getVotes, getUserVote, vote } = useToolVotes();

  const votes = getVotes(tool.id);
  const userVote = getUserVote(tool.id);

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

  const handleVote = (voteType: "like" | "dislike") => {
    vote(tool.id, voteType);
  };

  return (
    <div className="bg-gradient-to-br from-white to-slate-50 dark:bg-slate-800 rounded-xl shadow-sm dark:shadow-xl border border-slate-200 dark:border-white p-4 md:p-6 flex flex-col h-full hover-scale animate-fade-in relative overflow-hidden group">
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 dark:bg-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none"></div>

      <div className="flex-1 relative z-10">
        {/* Title and Category - Stacked Vertically */}
        <div className={`mb-4 ${isRTL ? "text-right" : ""}`}>
          <h3
            className={`text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-2 ${isRTL ? "text-left" : ""}`}
            dir="ltr"
          >
            {tool.name}
          </h3>
          <span className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-400 dark:to-purple-400 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
            {categoryName}
          </span>
        </div>

        <p
          className={`text-slate-600 dark:text-white text-sm mb-4 line-clamp-3 ${isRTL ? "text-right font-cairo" : ""}`}
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
              className={`text-xs text-slate-700 dark:text-white font-medium ${isRTL ? "text-right font-cairo" : ""}`}
              dir={isRTL ? "rtl" : "ltr"}
            >
              <span className="text-slate-500 dark:text-slate-300">
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
                className={`text-xs text-slate-500 dark:text-slate-300 italic ${isRTL ? "text-right font-cairo" : ""}`}
                dir={isRTL ? "rtl" : "ltr"}
              >
                {limitations}
              </p>
            </div>
          )}
        </div>

        {/* Like/Dislike Buttons */}
        <div
          className={`flex items-center gap-3 mb-4 ${isRTL ? "flex-row-reverse" : ""}`}
        >
          <button
            onClick={() => handleVote("like")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              userVote === "like"
                ? "bg-emerald-500 text-white shadow-md"
                : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-white hover:bg-emerald-100 dark:hover:bg-emerald-900/30 border border-slate-200 dark:border-slate-600"
            }`}
            title={t.like}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
            </svg>
            <span>{votes.likes}</span>
          </button>

          <button
            onClick={() => handleVote("dislike")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              userVote === "dislike"
                ? "bg-red-500 text-white shadow-md"
                : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-white hover:bg-red-100 dark:hover:bg-red-900/30 border border-slate-200 dark:border-slate-600"
            }`}
            title={t.dislike}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
            </svg>
            <span>{votes.dislikes}</span>
          </button>
        </div>
      </div>

      <a
        href={tool.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`relative z-10 block w-full text-center bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-700 dark:to-slate-600 text-white py-2.5 rounded-lg font-medium hover:from-slate-800 hover:to-slate-700 dark:hover:from-slate-600 dark:hover:to-slate-500 transition-all shadow-sm hover:shadow-md mt-auto border border-slate-700 dark:border-slate-500 ${isRTL ? "font-cairo" : ""}`}
      >
        {t.viewTool}
      </a>
    </div>
  );
};

export default ToolCard;
