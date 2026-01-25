"use client";

import React, { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";

interface ReportIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ReportIssueModal: React.FC<ReportIssueModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { t, isRTL } = useLanguage();
  const [formData, setFormData] = useState({
    issueType: "",
    toolName: "",
    description: "",
    email: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      // TODO: Replace with your actual submission endpoint
      const response = await fetch("/api/report-issue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setTimeout(() => {
          onClose();
          setFormData({
            issueType: "",
            toolName: "",
            description: "",
            email: "",
          });
          setSubmitStatus("idle");
        }, 2000);
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 md:p-8">
          <div
            className={`flex items-center justify-between mb-6 ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <h2
              className={`text-2xl font-bold text-slate-900 dark:text-slate-100 ${isRTL ? "font-cairo" : ""}`}
            >
              {t.reportIssue || "Report an Issue"}
            </h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                className={`block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 ${isRTL ? "text-right font-cairo" : ""}`}
              >
                {t.issueType || "Issue Type"} *
              </label>
              <select
                name="issueType"
                value={formData.issueType}
                onChange={handleChange}
                required
                className={`w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 ${isRTL ? "text-right font-cairo" : ""}`}
              >
                <option value="">
                  {t.selectIssueType || "Select issue type"}
                </option>
                <option value="broken-link">
                  {t.brokenLink || "Broken Link"}
                </option>
                <option value="incorrect-info">
                  {t.incorrectInfo || "Incorrect Information"}
                </option>
                <option value="tool-not-free">
                  {t.toolNotFree || "Tool Not Free"}
                </option>
                <option value="website-bug">
                  {t.websiteBug || "Website Bug"}
                </option>
                <option value="other">{t.other || "Other"}</option>
              </select>
            </div>

            <div>
              <label
                className={`block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 ${isRTL ? "text-right font-cairo" : ""}`}
              >
                {t.toolName || "Tool Name"} ({t.ifApplicable || "if applicable"}
                )
              </label>
              <input
                type="text"
                name="toolName"
                value={formData.toolName}
                onChange={handleChange}
                className={`w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 ${isRTL ? "text-right font-cairo" : ""}`}
                dir={isRTL ? "rtl" : "ltr"}
              />
            </div>

            <div>
              <label
                className={`block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 ${isRTL ? "text-right font-cairo" : ""}`}
              >
                {t.description || "Description"} *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={5}
                placeholder={
                  t.describeIssue || "Please describe the issue in detail..."
                }
                className={`w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 ${isRTL ? "text-right font-cairo" : ""}`}
                dir={isRTL ? "rtl" : "ltr"}
              />
            </div>

            <div>
              <label
                className={`block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 ${isRTL ? "text-right font-cairo" : ""}`}
              >
                {t.yourEmail || "Your Email"} ({t.optional || "optional"})
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                dir="ltr"
              />
            </div>

            {submitStatus === "success" && (
              <div
                className={`p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg ${isRTL ? "text-right font-cairo" : ""}`}
              >
                <p className="text-green-800 dark:text-green-200 text-sm">
                  {t.submitSuccess ||
                    "Thank you! Your report has been submitted."}
                </p>
              </div>
            )}

            {submitStatus === "error" && (
              <div
                className={`p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg ${isRTL ? "text-right font-cairo" : ""}`}
              >
                <p className="text-red-800 dark:text-red-200 text-sm">
                  {t.submitError || "Something went wrong. Please try again."}
                </p>
              </div>
            )}

            <div
              className={`flex gap-3 pt-4 ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${isRTL ? "font-cairo" : ""}`}
              >
                {isSubmitting
                  ? t.submitting || "Submitting..."
                  : t.submit || "Submit"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className={`px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all ${isRTL ? "font-cairo" : ""}`}
              >
                {t.cancel || "Cancel"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportIssueModal;
