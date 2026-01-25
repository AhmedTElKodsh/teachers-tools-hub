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
