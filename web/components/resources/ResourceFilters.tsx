'use client';

import React from 'react';
// import { useLanguage } from '@/contexts/LanguageContext'; // using English defaults for MVP

interface ResourceFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedSubject: string | null;
  onSelectSubject: (subject: string | null) => void;
  selectedGrade: string | null;
  onSelectGrade: (grade: string | null) => void;
  selectedType: string | null;
  onSelectType: (type: string | null) => void;
}

const SUBJECTS = [
  'Math', 'Science', 'English/Language Arts', 'Social Studies', 
  'History', 'Geography', 'Art', 'Music', 
  'Physical Education', 'Foreign Language', 'Computer Science', 'Special Education'
];

const GRADES = [
  'Pre-K', 'Kindergarten', '1st Grade', '2nd Grade', '3rd Grade', 
  '4th Grade', '5th Grade', '6th Grade', '7th Grade', '8th Grade', 
  '9th Grade', '10th Grade', '11th Grade', '12th Grade', 'Higher Education'
];

const RESOURCE_TYPES = [
  'Lesson Plan', 'Worksheet', 'Activity Guide', 'Assessment', 
  'Presentation', 'Quiz', 'Project Guide', 'Rubric', 'Handout'
];

export default function ResourceFilters({
  searchQuery,
  onSearchChange,
  selectedSubject,
  onSelectSubject,
  selectedGrade,
  onSelectGrade,
  selectedType,
  onSelectType,
}: ResourceFiltersProps) {
  return (
    <div className="w-full md:w-64 shrink-0 space-y-6">
      <div className="sidebar-card rounded-xl p-4 md:p-6 bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700">
        {/* Search */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
            Search Resources
          </label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Keywords..."
            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-[#c96847] focus:border-transparent transition-all"
          />
        </div>

        {/* Resource Type */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
            Resource Type
          </label>
          <select
            value={selectedType || ''}
            onChange={(e) => onSelectType(e.target.value || null)}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-[#c96847] focus:border-transparent transition-all"
          >
            <option value="">All Types</option>
            {RESOURCE_TYPES.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Subject */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
            Subject
          </label>
          <div className="space-y-1 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
            <button
              onClick={() => onSelectSubject(null)}
              className={`w-full text-left px-2 py-1.5 rounded text-sm transition-colors ${
                selectedSubject === null
                  ? 'bg-[#c96847] text-white font-medium'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              All Subjects
            </button>
            {SUBJECTS.map((subject) => (
              <button
                key={subject}
                onClick={() => onSelectSubject(subject)}
                className={`w-full text-left px-2 py-1.5 rounded text-sm transition-colors ${
                  selectedSubject === subject
                    ? 'bg-[#c96847] text-white font-medium'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {subject}
              </button>
            ))}
          </div>
        </div>

        {/* Grade Level */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
            Grade Level
          </label>
          <div className="space-y-1 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
            <button
              onClick={() => onSelectGrade(null)}
              className={`w-full text-left px-2 py-1.5 rounded text-sm transition-colors ${
                selectedGrade === null
                  ? 'bg-[#c96847] text-white font-medium'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              All Grades
            </button>
            {GRADES.map((grade) => (
              <button
                key={grade}
                onClick={() => onSelectGrade(grade)}
                className={`w-full text-left px-2 py-1.5 rounded text-sm transition-colors ${
                  selectedGrade === grade
                    ? 'bg-[#c96847] text-white font-medium'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {grade}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
