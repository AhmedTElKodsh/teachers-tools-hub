"use client";

import { useState, useEffect } from "react";
import { ToolVotes, RatingValue } from "../types";

const VOTES_STORAGE_KEY = "teacherToolsHub_votes";
const USER_VOTES_STORAGE_KEY = "teacherToolsHub_userVotes";

export function useToolVotes() {
  const [votes, setVotes] = useState<Record<string, ToolVotes>>({});
  const [userVotes, setUserVotes] = useState<Record<string, RatingValue>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Load votes from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedVotes = localStorage.getItem(VOTES_STORAGE_KEY);
      const storedUserVotes = localStorage.getItem(USER_VOTES_STORAGE_KEY);

      if (storedVotes) {
        setVotes(JSON.parse(storedVotes));
      }

      if (storedUserVotes) {
        setUserVotes(JSON.parse(storedUserVotes));
      }

      setIsLoaded(true);
    }
  }, []);

  // Save votes to localStorage whenever they change
  useEffect(() => {
    if (isLoaded && typeof window !== "undefined") {
      localStorage.setItem(VOTES_STORAGE_KEY, JSON.stringify(votes));
      localStorage.setItem(USER_VOTES_STORAGE_KEY, JSON.stringify(userVotes));
    }
  }, [votes, userVotes, isLoaded]);

  const getVotes = (toolId: string): ToolVotes => {
    return votes[toolId] || { totalStars: 0, ratingCount: 0 };
  };

  const getUserVote = (toolId: string): RatingValue => {
    return userVotes[toolId] || null;
  };

  const getAverageRating = (toolId: string): number => {
    const toolVotes = getVotes(toolId);
    if (toolVotes.ratingCount === 0) return 0;
    return toolVotes.totalStars / toolVotes.ratingCount;
  };

  const rate = (toolId: string, rating: RatingValue) => {
    const currentRating = userVotes[toolId] || null;
    const currentVotes = votes[toolId] || { totalStars: 0, ratingCount: 0 };

    let newVotes = { ...currentVotes };
    let newUserRating: RatingValue = rating;

    // If clicking the same rating, remove it
    if (currentRating === rating && rating !== null) {
      newVotes.totalStars = Math.max(0, newVotes.totalStars - rating);
      newVotes.ratingCount = Math.max(0, newVotes.ratingCount - 1);
      newUserRating = null;
    } else {
      // Remove previous rating if exists
      if (currentRating !== null) {
        newVotes.totalStars = Math.max(0, newVotes.totalStars - currentRating);
        newVotes.ratingCount = Math.max(0, newVotes.ratingCount - 1);
      }

      // Add new rating
      if (rating !== null) {
        newVotes.totalStars += rating;
        newVotes.ratingCount += 1;
      }
    }

    setVotes((prev) => ({ ...prev, [toolId]: newVotes }));
    setUserVotes((prev) => ({ ...prev, [toolId]: newUserRating }));
  };

  return {
    getVotes,
    getUserVote,
    getAverageRating,
    rate,
    isLoaded,
  };
}
