"use client";

import { useState, useEffect } from "react";
import { ToolVotes, VoteType } from "../types";

const VOTES_STORAGE_KEY = "teacherToolsHub_votes";
const USER_VOTES_STORAGE_KEY = "teacherToolsHub_userVotes";

export function useToolVotes() {
  const [votes, setVotes] = useState<Record<string, ToolVotes>>({});
  const [userVotes, setUserVotes] = useState<Record<string, VoteType>>({});
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
    return votes[toolId] || { likes: 0, dislikes: 0 };
  };

  const getUserVote = (toolId: string): VoteType => {
    return userVotes[toolId] || null;
  };

  const vote = (toolId: string, voteType: VoteType) => {
    const currentVote = userVotes[toolId] || null;
    const currentVotes = votes[toolId] || { likes: 0, dislikes: 0 };

    let newVotes = { ...currentVotes };
    let newUserVote: VoteType = voteType;

    // If clicking the same vote, remove it
    if (currentVote === voteType) {
      if (voteType === "like") {
        newVotes.likes = Math.max(0, newVotes.likes - 1);
      } else if (voteType === "dislike") {
        newVotes.dislikes = Math.max(0, newVotes.dislikes - 1);
      }
      newUserVote = null;
    } else {
      // Remove previous vote if exists
      if (currentVote === "like") {
        newVotes.likes = Math.max(0, newVotes.likes - 1);
      } else if (currentVote === "dislike") {
        newVotes.dislikes = Math.max(0, newVotes.dislikes - 1);
      }

      // Add new vote
      if (voteType === "like") {
        newVotes.likes += 1;
      } else if (voteType === "dislike") {
        newVotes.dislikes += 1;
      }
    }

    setVotes((prev) => ({ ...prev, [toolId]: newVotes }));
    setUserVotes((prev) => ({ ...prev, [toolId]: newUserVote }));
  };

  return {
    getVotes,
    getUserVote,
    vote,
    isLoaded,
  };
}
