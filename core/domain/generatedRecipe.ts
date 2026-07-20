import { Allergen, Difficulty, Unity } from "@/types/recipes";

export interface GeneratedRecipeIngredient {
  name: string;
  quantity: number;
  unity: Unity;
}

export interface GeneratedRecipe {
  title: string;
  servings: number;
  ingredients: GeneratedRecipeIngredient[];
  allergens: Allergen[];
  photo: string;
  description: string;
  duration: number;
  difficulty: Difficulty;
}
