"use client";

import React, { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";

interface SuggestToolModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SuggestToolModal: React.FC<SuggestToolModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { t, isRTL } = useLanguage();
  const [formData, setFormData] = useState({
    toolName: "",
    toolUrl: "",
    category: "",
    description: "",
    pricingModel: "",
    hasFreeTier: "",
    additionalInfo: "",
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
      const response = await fetch("/api/suggest-tool", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setTimeout(() => {
          onClose();
          setFormData({
            toolName: "",
            toolUrl: "",
            category: "",
            description: "",
            pricingModel: "",
            hasFreeTier: "",
            additionalInfo: "",
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
      className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-background rounded-2xl shadow-2xl dark:shadow-[0_0_40px_rgba(96,165,250,0.15)] max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 md:p-8">
          <div
            className={`flex items-center justify-between mb-6 ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <h2
              className={`text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-[#60a5fa] dark:to-[#a78bfa] bg-clip-text text-transparent ${isRTL ? "font-cairo" : ""}`}
            >
              {t.suggestTool}
            </h2>
            <button
              onClick={onClose}
              className="text-foreground/70 hover:text-foreground dark:text-foreground/70 dark:hover:text-foreground transition-colors p-2 hover:bg-slate-100 dark:hover:bg-[#252b45] rounded-lg"
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
                className={`block text-sm font-medium text-foreground dark:text-foreground mb-2 ${isRTL ? "text-right font-cairo" : ""}`}
              >
                {t.toolName || "Tool Name"} *
              </label>
              <input
                type="text"
                name="toolName"
                value={formData.toolName}
                onChange={handleChange}
                required
                className={`w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-surface text-foreground placeholder-slate-400 dark:placeholder-slate-500 transition-all ${isRTL ? "text-right font-cairo" : ""}`}
                dir={isRTL ? "rtl" : "ltr"}
              />
            </div>

            <div>
              <label
                className={`block text-sm font-medium text-foreground dark:text-foreground mb-2 ${isRTL ? "text-right font-cairo" : ""}`}
              >
                {t.toolUrl || "Tool URL"} *
              </label>
              <input
                type="url"
                name="toolUrl"
                value={formData.toolUrl}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-surface text-foreground placeholder-slate-400 dark:placeholder-slate-500 transition-all"
                dir="ltr"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  className={`block text-sm font-medium text-foreground mb-2 ${isRTL ? "text-right font-cairo" : ""}`}
                >
                  {t.pricingModel || "Pricing Model"} *
                </label>
                <select
                  name="pricingModel"
                  value={formData.pricingModel}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-surface text-foreground transition-all ${isRTL ? "text-right font-cairo" : ""}`}
                >
                  <option value="">
                    {t.selectPricing || "Select pricing model"}
                  </option>
                  <option value="Free">{t.free || "Free"}</option>
                  <option value="Freemium">{t.freemium || "Freemium"}</option>
                  <option value="Premium">{t.premium || "Premium"}</option>
                </select>
              </div>

              <div>
                <label
                  className={`block text-sm font-medium text-foreground mb-2 ${isRTL ? "text-right font-cairo" : ""}`}
                >
                  {t.hasFreeTier || "Does it have a free tier?"} *
                </label>
                <select
                  name="hasFreeTier"
                  value={formData.hasFreeTier}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-surface text-foreground transition-all ${isRTL ? "text-right font-cairo" : ""}`}
                >
                  <option value="">
                    {t.selectOption || "Select an option"}
                  </option>
                  <option value="yes">{t.yes || "Yes"}</option>
                  <option value="no">{t.no || "No"}</option>
                </select>
              </div>
            </div>

            <div>
              <label
                className={`block text-sm font-medium text-foreground dark:text-foreground mb-2 ${isRTL ? "text-right font-cairo" : ""}`}
              >
                {t.category || "Category"} *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className={`w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-surface text-foreground transition-all ${isRTL ? "text-right font-cairo" : ""}`}
              >
                <option value="">
                  {t.selectCategory || "Select a category"}
                </option>
                <option value="General Assistants">
                  {t.generalAssistants}
                </option>
                <option value="Lesson Planning">{t.lessonPlanning}</option>
                <option value="Presentation Tools">
                  {t.presentationTools}
                </option>
                <option value="Student Assessment">
                  {t.studentAssessment}
                </option>
                <option value="Study & Review">{t.studyReview}</option>
                <option value="Video Creation">{t.videoCreation}</option>
                <option value="Visual Content">{t.visualContent}</option>
              </select>
            </div>

            <div>
              <label
                className={`block text-sm font-medium text-foreground dark:text-foreground mb-2 ${isRTL ? "text-right font-cairo" : ""}`}
              >
                {t.shortDescription || "Short Description"} *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className={`w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-surface text-foreground placeholder-slate-400 dark:placeholder-slate-500 transition-all ${isRTL ? "text-right font-cairo" : ""}`}
                dir={isRTL ? "rtl" : "ltr"}
              />
            </div>

            <div>
              <label
                className={`block text-sm font-medium text-foreground dark:text-foreground mb-2 ${isRTL ? "text-right font-cairo" : ""}`}
              >
                {t.additionalInfo || "Additional Info"} (
                {t.optional || "optional"})
              </label>
              <textarea
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleChange}
                rows={3}
                className={`w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-surface text-foreground placeholder-slate-400 dark:placeholder-slate-500 transition-all ${isRTL ? "text-right font-cairo" : ""}`}
                dir={isRTL ? "rtl" : "ltr"}
              />
            </div>

            <div>
              <label
                className={`block text-sm font-medium text-foreground dark:text-foreground mb-2 ${isRTL ? "text-right font-cairo" : ""}`}
              >
                {t.yourEmail || "Your Email"} ({t.optional || "optional"})
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-surface text-foreground placeholder-slate-400 dark:placeholder-slate-500 transition-all"
                dir="ltr"
              />
            </div>

            {submitStatus === "success" && (
              <div
                className={`p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg ${isRTL ? "text-right font-cairo" : ""}`}
              >
                <p className="text-green-800 dark:text-green-300 text-sm font-medium">
                  {t.submitSuccess ||
                    "Thank you! Your suggestion has been submitted."}
                </p>
              </div>
            )}

            {submitStatus === "error" && (
              <div
                className={`p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg ${isRTL ? "text-right font-cairo" : ""}`}
              >
                <p className="text-red-800 dark:text-red-300 text-sm font-medium">
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
                className={`flex-1 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-[#60a5fa] dark:to-[#a78bfa] text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 dark:hover:from-[#3b82f6] dark:hover:to-[#8b5cf6] transition-all shadow-lg hover:shadow-xl dark:shadow-[0_0_20px_rgba(96,165,250,0.3)] disabled:opacity-50 disabled:cursor-not-allowed ${isRTL ? "font-cairo" : ""}`}
              >
                {isSubmitting
                  ? t.submitting || "Submitting..."
                  : t.submit || "Submit"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className={`px-6 py-3 border-2 border-border text-foreground rounded-lg font-semibold hover:bg-surface transition-all ${isRTL ? "font-cairo" : ""}`}
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

export default SuggestToolModal;
