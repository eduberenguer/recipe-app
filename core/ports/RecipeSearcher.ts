import { Allergen, Difficulty, Unity } from "@/types/recipes";

export interface RecipeSearchResult {
  title: string;
  ingredients: { name: string; quantity: number; unity: Unity }[];
  allergens: Allergen[];
  difficulty: Difficulty;
  duration: number;
}

export interface RecipeSearcher {
  searchByIngredients(ingredients: string[]): Promise<RecipeSearchResult[]>;
}
