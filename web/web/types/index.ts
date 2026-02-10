export interface Tool {
  id: string;
  name: string;
  description: string;
  description_ar?: string;
  freeTier: string;
  freeTier_ar?: string;
  limitations: string;
  limitations_ar?: string;
  categories: string[];
  bestFor: string;
  url: string;
}

export interface ToolVotes {
  totalStars: number;
  ratingCount: number;
}

export type RatingValue = 1 | 2 | 3 | 4 | 5 | null;

export type SortOption = "alphabetical" | "highestRated" | "lowestRated";

export type FilterOption = "all" | "4plus" | "3plus";
