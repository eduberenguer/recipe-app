export type Unity = "kg" | "gr" | "mg" | "litres" | "ml" | "unit";

export interface Recipe {
  id: string;
  owner: string;
  title: string;
  servings: number;
  ingredients: { name: string; quantity: number; unity: Unity }[];
  photo: File | string;
  favouritesCounter: number;
  description: string;
  views: number;
  isVisible: boolean;
}
export interface RecipeWithRating extends Recipe {
  rating: {
    average: number;
    count: number;
  };
}

export interface AddRating {
  userId: string;
  recipeId: string;
  rating: number;
}

export interface RecipeChefAI {
  title: string;
  servings: number;
  description: string;
  photo: string;
  ingredients: {
    name: string;
    quantity: number;
    unity: string;
  }[];
}

export interface RecipeRating {
  average: number;
  count: number;
}
